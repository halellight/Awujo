"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Users2, Search, Mail, MapPin, Landmark, Filter, Phone, ArrowUpRight } from "lucide-react";

export default function RepresentativesPage() {
    const [reps, setReps] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeState, setActiveState] = useState("All States");

    useEffect(() => {
        async function fetchReps() {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('representatives')
                .select('*')
                .order('name');

            if (data) setReps(data);
            setIsLoading(false);
        }
        fetchReps();
    }, []);

    const states = ["All States", ...Array.from(new Set(reps.map(r => r.state)))].sort();

    const filteredReps = reps.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.constituency.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesState = activeState === "All States" || r.state === activeState;
        return matchesSearch && matchesState;
    });

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* Header */}
            <section className="bg-white border-b border-zinc-200 pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-zinc-100 border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                    >
                        <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                        Direct Accountability Pipeline
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-heading font-black text-foreground tracking-tight uppercase mb-4 leading-none">
                        Our <span className="text-primary italic">Representatives.</span>
                    </h1>
                    <p className="text-zinc-500 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
                        Bridge the gap between constituents and lawmakers. Access contact information, verify constituency performance, and demand direct feedback.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 mt-12">
                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search by name or constituency..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-zinc-200 rounded-lg pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <select
                        value={activeState}
                        onChange={(e) => setActiveState(e.target.value)}
                        className="bg-white border border-zinc-200 px-6 py-4 rounded-lg text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                    >
                        {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>

                {/* Reps Grid */}
                <AnimatePresence mode="popLayout">
                    {filteredReps.length === 0 && !isLoading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white border border-zinc-200 rounded-xl p-20 text-center col-span-full"
                        >
                            <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users2 className="w-6 h-6 text-zinc-300" />
                            </div>
                            <h3 className="text-lg font-heading font-bold uppercase tracking-tight mb-2">No Representative Linked</h3>
                            <p className="text-zinc-400 text-xs font-medium max-w-xs mx-auto">
                                No matching representatives found for "{searchTerm}" in {activeState}.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredReps.map((rep, idx) => (
                                <RepCard key={rep.id} rep={rep} idx={idx} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function RepCard({ rep, idx }: { rep: any, idx: number }) {
    const isLeader = ["Senate President", "Speaker of the House"].includes(rep.role);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.05, 0.5) }}
            className={`bg-white border rounded-xl overflow-hidden group transition-all duration-300 flex flex-col ${isLeader
                    ? 'border-primary/40 shadow-xl shadow-primary/5 ring-1 ring-primary/10'
                    : 'border-zinc-200 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5'
                }`}
        >
            <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-primary border ${isLeader ? 'bg-primary/10 border-primary/20' : 'bg-zinc-100 border-zinc-200'
                        }`}>
                        {rep.image_url ? (
                            <img src={rep.image_url} alt={rep.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <Landmark className="w-6 h-6" />
                        )}
                    </div>
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest border ${isLeader
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                        }`}>
                        {rep.role}
                    </span>
                </div>

                {isLeader && (
                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                        Federal Leadership
                    </div>
                )}
                <h3 className="text-xl font-heading font-black uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">
                    {rep.name}
                </h3>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    {rep.party || 'Independent'}
                </p>

                <div className="space-y-4 mb-8">
                    <DetailRow icon={<MapPin className="w-3 h-3" />} label="Constituency" value={rep.constituency} />
                    <DetailRow icon={<Landmark className="w-3 h-3" />} label="State" value={rep.state} />
                </div>

                <div className="mt-auto pt-6 border-t border-zinc-50 flex gap-4">
                    <a
                        href={`mailto:${rep.contact_email}`}
                        className="flex-grow bg-zinc-900 text-white py-4 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <Mail className="w-3 h-3" /> Send Briefing
                    </a>
                    <button className="px-5 border border-zinc-200 rounded-lg flex items-center justify-center hover:bg-zinc-50 transition-colors">
                        <ArrowUpRight className="w-4 h-4 text-zinc-400" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function DetailRow({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[9px] font-black text-zinc-300 uppercase tracking-widest">
                {icon} {label}
            </div>
            <div className="text-[12px] font-bold text-zinc-600 uppercase tracking-tight">{value}</div>
        </div>
    );
}
