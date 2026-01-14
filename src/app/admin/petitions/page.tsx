"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, Loader2, PenTool, TrendingUp, Users, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminPetitionsPage() {
    const [petitions, setPetitions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPetition, setEditingPetition] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchPetitions();
    }, []);

    async function fetchPetitions() {
        setIsLoading(true);
        const { data } = await supabase.from('petitions').select('*').order('created_at', { ascending: false });
        if (data) setPetitions(data);
        setIsLoading(false);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const petitionData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            target_authority: formData.get('target_authority') as string,
            status: formData.get('status') as string,
            expected_signatures: Number(formData.get('expected_signatures')),
            current_signatures: Number(formData.get('current_signatures')),
        };

        if (editingPetition) {
            await supabase.from('petitions').update(petitionData).eq('id', editingPetition.id);
        } else {
            await supabase.from('petitions').insert([petitionData]);
        }

        await fetchPetitions();
        setIsModalOpen(false);
        setEditingPetition(null);
        setIsSubmitting(false);
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-black uppercase tracking-tight mb-2">
                        Petition <span className="text-primary italic">Control.</span>
                    </h1>
                    <p className="text-zinc-500 text-[11px] font-black uppercase tracking-widest">Manage citizen movements and collective action</p>
                </div>
                <button
                    onClick={() => { setEditingPetition(null); setIsModalOpen(true); }}
                    className="bg-zinc-900 text-white px-6 py-4 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-zinc-800 transition-all shadow-lg"
                >
                    <Plus className="w-4 h-4" /> Start Petition
                </button>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Petition Title</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Momentum</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {petitions.map((petition) => (
                                <tr key={petition.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border",
                                            petition.status === 'Open' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                petition.status === 'Won' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                    petition.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                        "bg-zinc-100 text-zinc-500 border-zinc-200"
                                        )}>
                                            {petition.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="text-[13px] font-black text-zinc-900 uppercase tracking-tight truncate max-w-sm">{petition.title}</div>
                                        <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Target: {petition.target_authority}</div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="text-[11px] font-black text-zinc-900">{petition.current_signatures} / {petition.expected_signatures}</div>
                                        <div className="w-24 h-1 bg-zinc-100 rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${Math.min((petition.current_signatures / petition.expected_signatures) * 100, 100)}%` }} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right whitespace-nowrap">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditingPetition(petition); setIsModalOpen(true); }} className="p-2 bg-white border border-zinc-200 rounded text-zinc-600 hover:text-primary transition-all">
                                                <Edit2 className="w-3.5 h-3.5" />
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
                                        {editingPetition ? "Update Petition" : "Deploy Petition"}
                                    </h3>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Petition Title</label>
                                        <input required name="title" defaultValue={editingPetition?.title} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Target Authority</label>
                                        <input required name="target_authority" placeholder="e.g. Ministry of Power" defaultValue={editingPetition?.target_authority} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Initial Momentum (Status)</label>
                                        <select name="status" defaultValue={editingPetition?.status || 'Pending'} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                            <option>Pending</option>
                                            <option>Open</option>
                                            <option>Won</option>
                                            <option>Closed</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Current Signatures</label>
                                        <input required type="number" name="current_signatures" defaultValue={editingPetition?.current_signatures || 0} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Signature Objective</label>
                                        <input required type="number" name="expected_signatures" defaultValue={editingPetition?.expected_signatures} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Petition Manifest</label>
                                        <textarea required name="description" rows={5} defaultValue={editingPetition?.description} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                                    </div>
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-primary text-primary-foreground py-5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/10"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    {editingPetition ? "Synchronize Movement" : "Archive Movement"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
