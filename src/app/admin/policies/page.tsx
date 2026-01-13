"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, Loader2, FileText, Globe, Calendar, Edit2, Trash2 } from "lucide-react";

export default function AdminPoliciesPage() {
    const [policies, setPolicies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchPolicies();
    }, []);

    async function fetchPolicies() {
        setIsLoading(true);
        const { data } = await supabase.from('policies').select('*').order('published_date', { ascending: false });
        if (data) setPolicies(data);
        setIsLoading(false);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const policyData = {
            title: formData.get('title') as string,
            category: formData.get('category') as string,
            description: formData.get('description') as string,
            official_url: formData.get('official_url') as string,
            published_date: formData.get('published_date') as string,
        };

        if (editingPolicy) {
            await supabase.from('policies').update(policyData).eq('id', editingPolicy.id);
        } else {
            await supabase.from('policies').insert([policyData]);
        }

        await fetchPolicies();
        setIsModalOpen(false);
        setEditingPolicy(null);
        setIsSubmitting(false);
    }

    async function deletePolicy(id: string) {
        if (confirm("Delete this policy from the archive?")) {
            await supabase.from('policies').delete().eq('id', id);
            await fetchPolicies();
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-black uppercase tracking-tight mb-2">
                        Policy <span className="text-primary italic">Desk.</span>
                    </h1>
                    <p className="text-zinc-500 text-[11px] font-black uppercase tracking-widest">National policy & gazette management</p>
                </div>
                <button
                    onClick={() => { setEditingPolicy(null); setIsModalOpen(true); }}
                    className="bg-zinc-900 text-white px-6 py-4 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-zinc-800 transition-all shadow-lg"
                >
                    <Plus className="w-4 h-4" /> Issue Directive
                </button>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Category</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Policy Title</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Pub. Date</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {policies.map((policy) => (
                                <tr key={policy.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <span className="px-2 py-1 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 text-[9px] font-black uppercase tracking-widest">
                                            {policy.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="text-[13px] font-black text-zinc-900 uppercase tracking-tight truncate max-w-md">{policy.title}</div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap text-[11px] font-bold text-zinc-400">
                                        {new Date(policy.published_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-6 text-right whitespace-nowrap">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditingPolicy(policy); setIsModalOpen(true); }} className="p-2 bg-white border border-zinc-200 rounded text-zinc-600 hover:text-primary transition-all">
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => deletePolicy(policy.id)} className="p-2 bg-white border border-zinc-200 rounded text-zinc-600 hover:text-red-500 transition-all">
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
                            <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                                <h3 className="text-xl font-heading font-black uppercase tracking-tight">
                                    {editingPolicy ? "Update Policy" : "New Directive"}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Directive Title</label>
                                    <input required name="title" defaultValue={editingPolicy?.title} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Category</label>
                                    <input required name="category" placeholder="e.g. Finance, Healthcare" defaultValue={editingPolicy?.category} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Publication Date</label>
                                    <input required type="date" name="published_date" defaultValue={editingPolicy?.published_date?.split('T')[0]} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Executive Summary</label>
                                    <textarea required name="description" rows={3} defaultValue={editingPolicy?.description} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Official Resource URL</label>
                                    <input required type="url" name="official_url" defaultValue={editingPolicy?.official_url} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                </div>

                                <div className="md:col-span-2 pt-6">
                                    <button
                                        disabled={isSubmitting}
                                        className="w-full bg-primary text-primary-foreground py-5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:brightness-110 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        {editingPolicy ? "Synchronize Policy" : "Archive Policy"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
