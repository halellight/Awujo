"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, X, Check, Loader2, MapPin, Wallet, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        setIsLoading(true);
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (data) setProjects(data);
        setIsLoading(false);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const projectData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            location: formData.get('location') as string,
            status: formData.get('status') as string,
            budget_allocated: Number(formData.get('budget_allocated')),
            budget_spent: Number(formData.get('budget_spent')),
            start_date: formData.get('start_date') as string,
        };

        if (editingProject) {
            await supabase.from('projects').update(projectData).eq('id', editingProject.id);
        } else {
            await supabase.from('projects').insert([projectData]);
        }

        await fetchProjects();
        setIsModalOpen(false);
        setEditingProject(null);
        setIsSubmitting(false);
    }

    async function deleteProject(id: string) {
        if (confirm("Are you sure you want to decommission this project node?")) {
            await supabase.from('projects').delete().eq('id', id);
            await fetchProjects();
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-heading font-black uppercase tracking-tight mb-2">
                        Project <span className="text-primary italic">Registry.</span>
                    </h1>
                    <p className="text-zinc-500 text-[11px] font-black uppercase tracking-widest">Global infrastructure command & control</p>
                </div>
                <button
                    onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
                    className="w-full sm:w-auto bg-zinc-900 text-white px-6 py-4 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-200"
                >
                    <Plus className="w-4 h-4" /> Deploy Project
                </button>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Project Detail</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Allocation</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border",
                                            project.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                project.status === 'In Progress' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                    project.status === 'Stalled' ? "bg-red-50 text-red-600 border-red-100" :
                                                        "bg-zinc-100 text-zinc-500 border-zinc-200"
                                        )}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="space-y-1">
                                            <div className="text-[13px] font-black text-zinc-900 uppercase tracking-tight">{project.title}</div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                                <MapPin className="w-3 h-3" /> {project.location || "Nationwide"}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <div className="text-[12px] font-black text-zinc-900">₦{new Intl.NumberFormat('en-NG').format(project.budget_allocated)}</div>
                                        <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                                            {((project.budget_spent / project.budget_allocated) * 100 || 0).toFixed(1)}% Consumed
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right whitespace-nowrap">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { setEditingProject(project); setIsModalOpen(true); }}
                                                className="p-2 bg-white border border-zinc-200 rounded text-zinc-600 hover:text-primary hover:border-primary transition-all"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => deleteProject(project.id)}
                                                className="p-2 bg-white border border-zinc-200 rounded text-zinc-600 hover:text-red-500 hover:border-red-500 transition-all"
                                            >
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

            {/* Project Modal */}
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
                                    {editingProject ? "Reconfigure Node" : "Deploy New Project"}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Project Designation</label>
                                    <input required name="title" defaultValue={editingProject?.title} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Intelligence Brief</label>
                                    <textarea required name="description" rows={3} defaultValue={editingProject?.description} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Deployment Zone</label>
                                    <input required name="location" defaultValue={editingProject?.location} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Operational Status</label>
                                    <select name="status" defaultValue={editingProject?.status || 'Planned'} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                        <option>Planned</option>
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                        <option>Stalled</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Allocation (₦)</label>
                                    <input required type="number" name="budget_allocated" defaultValue={editingProject?.budget_allocated} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Utilized Resources (₦)</label>
                                    <input required type="number" name="budget_spent" defaultValue={editingProject?.budget_spent || 0} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                </div>

                                <div className="md:col-span-2 pt-6">
                                    <button
                                        disabled={isSubmitting}
                                        className="w-full bg-primary text-primary-foreground py-5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        {editingProject ? "Update Configuration" : "Establish Deployment"}
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
