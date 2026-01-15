"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, Loader2, Users2, Mail, Phone, Edit2, Trash2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminRepsPage() {
    return (
        <Suspense fallback={<div className="animate-pulse text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading Pipeline...</div>}>
            <AdminRepsContent />
        </Suspense>
    );
}

function AdminRepsContent() {
    const [reps, setReps] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRep, setEditingRep] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');

    useEffect(() => {
        fetchReps();
    }, []);

    async function fetchReps() {
        setIsLoading(true);
        const { data } = await supabase.from('representatives').select('*').order('name', { ascending: true });
        if (data) {
            setReps(data);
            // Handle direct edit link
            if (editId) {
                const repToEdit = data.find(r => r.id === editId);
                if (repToEdit) {
                    setEditingRep(repToEdit);
                    setIsModalOpen(true);
                }
            }
        }
        setIsLoading(false);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const repData = {
            name: formData.get('name') as string,
            role: formData.get('role') as string,
            constituency: formData.get('constituency') as string,
            state: formData.get('state') as string,
            party: formData.get('party') as string,
            contact_email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            bill_sponsorships: parseInt(formData.get('bill_sponsorships') as string) || 0,
            committee_attendance: formData.get('committee_attendance') as string,
            citizen_engagement: formData.get('citizen_engagement') as string,
            assumed_office: formData.get('assumed_office') as string,
            legislative_priority: formData.get('legislative_priority') as string,
        };

        let error;
        if (editingRep) {
            const { error: updateError } = await supabase.from('representatives').update(repData).eq('id', editingRep.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase.from('representatives').insert([repData]);
            error = insertError;
        }

        if (error) {
            console.error("Representative operation failed. Full error context:", JSON.stringify(error, null, 2));
            toast.error(`Operation failed: ${error.message}. Check console for technical details.`);
        } else {
            toast.success(editingRep ? "Profile updated" : "Lawmaker enrolled");
            await fetchReps();
            setIsModalOpen(true); // Keep open if you want? No, close it.
            setIsModalOpen(false);
            setEditingRep(null);
        }
        setIsSubmitting(false);
    }

    async function deleteRep(id: string) {
        if (confirm("Delete this representative from the directory?")) {
            const { error } = await supabase.from('representatives').delete().eq('id', id);
            if (error) {
                toast.error(`Delete failed: ${error.message}`);
            } else {
                toast.success("Profile removed");
                await fetchReps();
            }
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-heading font-black uppercase tracking-tight mb-2">
                        Rep <span className="text-primary italic">Directory.</span>
                    </h1>
                    <p className="text-zinc-500 text-[11px] font-black uppercase tracking-widest">Maintain the national legislative accountability pipeline</p>
                </div>
                <button
                    onClick={() => { setEditingRep(null); setIsModalOpen(true); }}
                    className="w-full sm:w-auto bg-zinc-900 text-white px-6 py-4 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-lg"
                >
                    <Plus className="w-4 h-4" /> Add Representative
                </button>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Representative</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Constituency/State</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Party</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {reps.map((rep) => (
                                <tr key={rep.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] font-black text-zinc-400">
                                                {rep.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-[13px] font-black text-zinc-900 uppercase tracking-tight">{rep.name}</div>
                                                <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{rep.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="text-[11px] font-black text-zinc-900 uppercase tracking-tight">{rep.constituency}</div>
                                        <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{rep.state} State</div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 text-[8px] font-black uppercase tracking-widest">
                                            {rep.party}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right whitespace-nowrap">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditingRep(rep); setIsModalOpen(true); }} className="p-2 bg-white border border-zinc-200 rounded text-zinc-600 hover:text-primary transition-all">
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => deleteRep(rep.id)} className="p-2 bg-white border border-zinc-200 rounded text-zinc-600 hover:text-red-500 transition-all">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-zinc-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
                        >
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-heading font-black uppercase tracking-tight">
                                        {editingRep ? "Update Profile" : "Enroll Lawmaker"}
                                    </h3>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Legal Name</label>
                                        <input required name="name" defaultValue={editingRep?.name} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Official Role</label>
                                        <input required name="role" defaultValue={editingRep?.role} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Political Party</label>
                                        <input required name="party" defaultValue={editingRep?.party} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Constituency</label>
                                        <input required name="constituency" defaultValue={editingRep?.constituency} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Represented State</label>
                                        <input required name="state" defaultValue={editingRep?.state} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Contact Email</label>
                                        <input required type="email" name="email" defaultValue={editingRep?.contact_email} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Direct Pipeline (Phone)</label>
                                        <input required name="phone" defaultValue={editingRep?.phone} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Bill Sponsorships</label>
                                        <input type="number" name="bill_sponsorships" defaultValue={editingRep?.bill_sponsorships || 0} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Committee Attendance</label>
                                        <input name="committee_attendance" defaultValue={editingRep?.committee_attendance || '0%'} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Citizen Engagement</label>
                                        <input name="citizen_engagement" defaultValue={editingRep?.citizen_engagement || '0/10'} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Assumed Office</label>
                                        <input name="assumed_office" defaultValue={editingRep?.assumed_office || 'June 2023'} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Legislative Priority</label>
                                        <textarea name="legislative_priority" rows={3} defaultValue={editingRep?.legislative_priority} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                                    </div>
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-primary text-primary-foreground py-5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 shadow-lg"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                    {editingRep ? "Synchronize Profile" : "Finalize Enrollment"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
