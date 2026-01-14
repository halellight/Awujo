"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Landmark, MapPin, Calendar, Wallet, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchProjects() {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setProjects(data);
            setIsLoading(false);
        }
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* Header Section */}
            <section className="bg-white border-b border-zinc-200 pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-zinc-100 border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                    >
                        <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                        Live Infrastructure Radar
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-heading font-black text-foreground tracking-tight uppercase mb-4 leading-none"
                    >
                        Project <span className="text-primary italic">Tracker.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-500 text-sm md:text-base max-w-2xl font-medium leading-relaxed"
                    >
                        Real-time monitoring of federation-funded infrastructure across Nigeria.
                        Cross-referencing official budget data with crowdsourced ground truth.
                    </motion.p>
                </div>
            </section>

            {/* Projects Grid */}
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 mt-12">
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search by project name, location, or keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-zinc-200 rounded-lg pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <button className="bg-white border border-zinc-200 px-6 py-4 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:bg-zinc-50 transition-colors">
                        <Filter className="w-4 h-4" /> State Units
                    </button>
                </div>

                <div>
                    {filteredProjects.length === 0 && !isLoading ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-zinc-200 rounded-xl p-20 text-center"
                        >
                            <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Landmark className="w-6 h-6 text-zinc-300" />
                            </div>
                            <h3 className="text-lg font-heading font-bold uppercase tracking-tight mb-2">No Projects Detected</h3>
                            <p className="text-zinc-400 text-xs font-medium max-w-xs mx-auto">
                                No matching projects found. Try a different search term or check the national registry.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map((project, idx) => (
                                <ProjectCard key={project.id} project={project} idx={idx} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import Link from "next/link";

function ProjectCard({ project, idx }: { project: any, idx: number }) {
    const statusColors: Record<string, string> = {
        'Planned': 'bg-zinc-100 text-zinc-500 border-zinc-200',
        'In Progress': 'bg-blue-50 text-blue-600 border-blue-100',
        'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Stalled': 'bg-red-50 text-red-600 border-red-100',
    };

    const statusColor = statusColors[project.status] || statusColors['Planned'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.05, 0.5) }}
            className="group bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500"
        >
            <Link href={`/projects/${project.id}`} className="p-8 flex flex-col h-full">
                {/* Status & Location */}
                <div className="flex justify-between items-start mb-6">
                    <div className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${statusColor}`}>
                        {project.status}
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{project.location || 'Nationwide'}</span>
                    </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-heading font-black uppercase leading-tight tracking-tight mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                </h3>
                <p className="text-zinc-500 text-xs leading-relaxed font-medium mb-8 line-clamp-3">
                    {project.description}
                </p>

                <div className="mt-auto space-y-4 pt-6 border-t border-zinc-100">
                    {/* Budget */}
                    <div className="flex justify-between items-center text-[11px]">
                        <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-widest">
                            <Wallet className="w-3.5 h-3.5" />
                            Budget
                        </div>
                        <div className="font-heading font-black text-foreground">
                            ₦{new Intl.NumberFormat('en-NG').format(project.budget_allocated)}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.min((project.budget_spent / project.budget_allocated) * 100 || 0, 100)}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-primary"
                        />
                    </div>

                    {/* Date */}
                    <div className="flex justify-between items-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest pt-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            Timeline
                        </div>
                        <span>
                            {project.start_date ? new Date(project.start_date).toLocaleDateString('en-NG', { year: 'numeric', month: 'short' }) : 'TBD'}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
