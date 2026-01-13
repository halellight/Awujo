"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    MessageSquare, Trash2, Search,
    Filter, ExternalLink, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AdminCommentsPage() {
    const [comments, setComments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchComments();
    }, []);

    async function fetchComments() {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('project_comments')
            .select('*, projects(title)')
            .order('created_at', { ascending: false });

        if (data) setComments(data);
        setIsLoading(false);
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to scrub this observation from the record?")) return;

        const { error } = await supabase
            .from('project_comments')
            .delete()
            .eq('id', id);

        if (!error) {
            setComments(comments.filter(c => c.id !== id));
        }
    };

    const filteredComments = comments.filter(c =>
        c.comment_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.projects?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-heading font-black uppercase tracking-tight mb-2">
                        Citizen <span className="text-primary italic">Feedback.</span>
                    </h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                        Moderation portal for public observations and audits.
                    </p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Filter observations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-lg pl-12 pr-4 py-3 text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>
            </header>

            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50 border-b border-zinc-200">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Citizen</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Observation</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Project Unit</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Timestamp</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-6 py-8">
                                        <div className="h-4 bg-zinc-50 rounded w-full" />
                                    </td>
                                </tr>
                            ))
                        ) : filteredComments.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <ShieldAlert className="w-10 h-10 text-zinc-200 mx-auto mb-4" />
                                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">No matching feedback nodes found.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredComments.map((comment) => (
                                <tr key={comment.id} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-6 py-6">
                                        <div className="text-[11px] font-black text-zinc-900 uppercase">{comment.user_name}</div>
                                    </td>
                                    <td className="px-6 py-6 max-w-md">
                                        <p className="text-xs text-zinc-500 font-medium leading-relaxed italic">
                                            "{comment.comment_text}"
                                        </p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <Link
                                            href={`/projects/${comment.project_id}`}
                                            className="inline-flex items-center gap-2 text-[10px] font-black text-primary hover:underline uppercase tracking-tight"
                                        >
                                            {comment.projects?.title}
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="text-[10px] font-bold text-zinc-400 uppercase">
                                            {new Date(comment.created_at).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="p-2 text-zinc-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete Observation"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
