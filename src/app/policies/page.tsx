"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Calendar, ExternalLink, Search, Filter, Shield, FileText } from "lucide-react";
import Link from "next/link";

export default function PoliciesPage() {
    const [policies, setPolicies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email === 'praiseibec@gmail.com') {
                setIsAdmin(true);
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        async function fetchPolicies() {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('policies')
                .select('*')
                .order('published_date', { ascending: false });

            if (data) setPolicies(data);
            setIsLoading(false);
        }
        fetchPolicies();
    }, []);

    const filteredPolicies = policies.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* Header */}
            <section className="bg-white border-b border-zinc-200 pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-zinc-100 border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                            Legislative & Executive Intelligence
                        </div>
                        {isAdmin && (
                            <Link
                                href="/admin/policies"
                                className="px-5 py-3 bg-zinc-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-xl"
                            >
                                <BookOpen className="w-3.5 h-3.5" /> Manage Policy Archive
                            </Link>
                        )}
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-heading font-black text-foreground tracking-tight uppercase mb-4 leading-none">
                        Policy <span className="text-primary italic">Desk.</span>
                    </h1>
                    <p className="text-zinc-500 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
                        Unfiltered access to the blueprints of governance. Track every circular, directive, and legislation that shapes the Nigerian landscape.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 mt-12">
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search policies by keyword, department, or title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-zinc-200 rounded-lg pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <button className="bg-white border border-zinc-200 px-6 py-4 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:bg-zinc-50 transition-colors">
                        <Filter className="w-4 h-4" /> Filter Protocol
                    </button>
                </div>

                {/* Policies List */}
                <div>
                    {filteredPolicies.length === 0 && !isLoading ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-zinc-200 rounded-xl p-20 text-center"
                        >
                            <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-6 h-6 text-zinc-300" />
                            </div>
                            <h3 className="text-lg font-heading font-bold uppercase tracking-tight mb-2">No Records Found</h3>
                            <p className="text-zinc-400 text-xs font-medium max-w-xs mx-auto">
                                No policies match your current search criteria. Refine your query or check the official Gazette.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {filteredPolicies.map((policy, idx) => (
                                <PolicyCard key={policy.id} policy={policy} idx={idx} isAdmin={isAdmin} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function PolicyCard({ policy, idx, isAdmin }: { policy: any, idx: number, isAdmin: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.05, 0.5) }}
            className="group bg-white border border-zinc-200 rounded-xl p-6 md:p-8 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
        >
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="space-y-4 flex-grow">
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 rounded-sm bg-primary/5 text-primary text-[9px] font-black uppercase tracking-[0.1em] border border-primary/10">
                            {policy.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold uppercase tracking-wider ml-2">
                            <Calendar className="w-3 h-3" />
                            {policy.published_date ? new Date(policy.published_date).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Pending Review'}
                        </div>
                    </div>

                    <h3 className="text-xl md:text-2xl font-heading font-black uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">
                        {policy.title}
                    </h3>

                    <p className="text-zinc-500 text-sm leading-relaxed font-medium max-w-4xl">
                        {policy.description}
                    </p>
                </div>

                <div className="flex-shrink-0 w-full md:w-auto flex flex-col gap-3">
                    <a
                        href={policy.official_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-zinc-50 border border-zinc-200 px-6 py-4 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all group/btn w-full md:w-auto"
                    >
                        Digital Gazette <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </a>
                    {isAdmin && (
                        <Link
                            href={`/admin/policies?edit=${policy.id}`}
                            className="flex items-center justify-center gap-3 bg-zinc-900 text-white border border-zinc-900 px-6 py-4 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-primary hover:border-primary transition-all group/btn w-full md:w-auto shadow-lg shadow-black/10"
                        >
                            <FileText className="w-3.5 h-3.5" /> Modify Directive
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
