"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, Users, ArrowUpRight, TrendingUp, Clock, CheckCircle, X, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function PetitionsPage() {
    const [petitions, setPetitions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchPetitions();
    }, []);

    async function fetchPetitions() {
        setIsLoading(true);
        const { data } = await supabase
            .from('petitions')
            .select('*')
            .eq('status', 'Open')
            .order('current_signatures', { ascending: false });

        if (data) setPetitions(data);
        setIsLoading(false);
    }

    async function handleSign(id: string) {
        setPetitions(prev => prev.map(p => p.id === id ? { ...p, isSigning: true } : p));

        const petition = petitions.find(p => p.id === id);
        if (!petition) return;

        const { error } = await supabase.rpc('increment_petition_signatures', { petition_id: id });

        if (error) {
            toast.error("Transmission failed. Sovereignty pulse interrupted.");
            setPetitions(prev => prev.map(p => p.id === id ? { ...p, isSigning: false } : p));
        } else {
            setPetitions(prev => prev.map(p => p.id === id ? { ...p, current_signatures: p.current_signatures + 1, isSigning: false, hasSigned: true } : p));
            toast.success("Signature transmitted to the federation.");
        }
    }

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const petitionData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            target_authority: formData.get('target_authority') as string,
            expected_signatures: Number(formData.get('expected_signatures')),
            current_signatures: 1,
            status: 'Pending'
        };

        const { error } = await supabase.from('petitions').insert([petitionData]);

        if (error) {
            console.error("Petition Creation Detailed Error:", JSON.stringify(error, null, 2));
            toast.error(`Submission failed: ${error.message || "Collective action blocked."}`);
        } else {
            toast.success("Movement initiated. Awaiting federation review.");
            await fetchPetitions();
            setIsModalOpen(false);
        }
        setIsSubmitting(false);
    }

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* Header */}
            <section className="bg-white border-b border-zinc-200 pt-20 pb-16">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-zinc-100 border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                    >
                        <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                        Collective Sovereignty
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-heading font-black text-foreground tracking-tight uppercase mb-4 leading-none">
                        Citizen <span className="text-primary italic">Petitions.</span>
                    </h1>
                    <p className="text-zinc-500 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
                        The power of numbers in governance. Initiate and sign petitions to demand legislative action, project audits, or policy adjustments.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Petitions List */}
                    <div className="lg:col-span-2 space-y-8">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center p-20 gap-4">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading Action Pipeline...</span>
                            </div>
                        ) : !petitions || petitions.length === 0 ? (
                            <div className="bg-white border border-zinc-200 rounded-xl p-20 text-center">
                                <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <PenTool className="w-6 h-6 text-zinc-300" />
                                </div>
                                <h3 className="text-lg font-heading font-bold uppercase tracking-tight mb-2">No Active Petitions</h3>
                                <p className="text-zinc-400 text-xs font-medium max-w-xs mx-auto">
                                    The floor is open. Be the first to initiate a movement for transparency.
                                </p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-8 bg-zinc-900 text-white px-8 py-4 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                                >
                                    Draft New Petition
                                </button>
                            </div>
                        ) : (
                            petitions.map((petition, idx) => (
                                <PetitionCard key={petition.id} petition={petition} idx={idx} onSign={() => handleSign(petition.id)} />
                            ))
                        )}
                    </div>

                    {/* Sidebar / Stats */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-zinc-900 text-white rounded-xl p-8 shadow-2xl"
                        >
                            <h3 className="text-lg font-heading font-black text-zinc-400 uppercase mb-8 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-primary" /> Impact Matrix
                            </h3>
                            <div className="space-y-6">
                                <StatRow label="Active Signatures" value={`${(petitions.reduce((acc, p) => acc + p.current_signatures, 0) / 1000).toFixed(1)}k`} color="text-primary" />
                                <StatRow label="Petitions Resolved" value="12" color="text-emerald-400" />
                                <StatRow label="Gov Responses" value="84%" color="text-blue-400" />
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full bg-white text-zinc-900 py-5 rounded-lg text-[10px] font-black uppercase tracking-widest mt-12 hover:bg-zinc-100 transition-colors shadow-lg active:scale-95 transition-all"
                            >
                                Initiate New Action
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white border border-zinc-200 rounded-xl p-8"
                        >
                            <h3 className="text-sm font-heading font-black uppercase mb-6 flex items-center gap-2 text-zinc-400">
                                <Clock className="w-4 h-4" /> Trending Now
                            </h3>
                            <div className="space-y-4">
                                <TrendingItem title="End Excess Project Spillage" count="1.2k today" />
                                <TrendingItem title="Lagos Fourth Mainland Bridge Audit" count="850 today" />
                                <TrendingItem title="Constituency Fund Open Portal" count="2.1k today" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Create Petition Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-zinc-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
                        >
                            <form onSubmit={handleCreate} className="p-10 space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-heading font-black uppercase tracking-tight">
                                        Draft <span className="text-primary italic">Movement.</span>
                                    </h3>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Petition Title</label>
                                        <input required name="title" placeholder="Demand Audit for Sector X" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Target Authority</label>
                                        <input required name="target_authority" placeholder="e.g. Ministry of Works" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Signature Objective</label>
                                        <input required type="number" name="expected_signatures" defaultValue={1000} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Petition Manifest</label>
                                        <textarea required name="description" rows={5} placeholder="State clearly the reason for this action and the expected outcome..." className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                                    </div>
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-primary text-primary-foreground py-6 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 shadow-xl"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenTool className="w-4 h-4" />}
                                    Initiate Collective Action
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function PetitionCard({ petition, idx, onSign }: { petition: any, idx: number, onSign: () => void }) {
    const progress = (petition.current_signatures / petition.expected_signatures) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border border-zinc-200 rounded-xl overflow-hidden group hover:border-primary/20 transition-all duration-300 shadow-sm"
        >
            <div className="p-8 md:p-10">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                        <Users className="w-4 h-4" /> {petition.target_authority}
                    </div>
                    <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${petition.status === 'Open' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                        {petition.status}
                    </span>
                </div>

                <h3 className="text-2xl font-heading font-black uppercase tracking-tight mb-4 group-hover:text-primary transition-colors leading-tight">
                    {petition.title}
                </h3>

                <p className="text-zinc-500 text-sm leading-relaxed font-medium mb-12 line-clamp-3">
                    {petition.description}
                </p>

                <div className="space-y-5">
                    <div className="flex justify-between items-end text-[11px] font-black uppercase tracking-widest">
                        <div className="text-zinc-400">Signatures Transmitted</div>
                        <div className="text-foreground">{petition.current_signatures.toLocaleString()} <span className="text-zinc-300">/ {petition.expected_signatures.toLocaleString()}</span></div>
                    </div>
                    <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-primary"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-10 border-t border-zinc-100">
                    <button
                        disabled={petition.hasSigned || petition.isSigning}
                        onClick={onSign}
                        className={`flex-grow py-5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg ${petition.hasSigned ? 'bg-zinc-100 text-zinc-400 cursor-default' : 'bg-primary text-white hover:brightness-110 active:scale-95'}`}
                    >
                        {petition.isSigning ? (
                            <>Transmitting... <Loader2 className="w-3 h-3 animate-spin" /></>
                        ) : petition.hasSigned ? (
                            <>Signed <Check className="w-3 h-3" /></>
                        ) : (
                            <>Sign Petition <PenTool className="w-3 h-3" /></>
                        )}
                    </button>
                    <Link href={`/petitions/${petition.id}`} className="px-8 border border-zinc-200 py-5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2">
                        View Protocol <ArrowUpRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

import { Counter } from "@/components/counter";

function StatRow({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="flex justify-between items-end">
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{label}</span>
            <span className={`text-3xl font-heading font-black uppercase ${color} leading-none`}>
                <Counter value={value} />
            </span>
        </div>
    );
}

function TrendingItem({ title, count }: { title: string, count: string }) {
    return (
        <div className="group cursor-pointer p-2 -mx-2 hover:bg-zinc-50 rounded-lg transition-colors">
            <h4 className="text-[11px] font-black uppercase tracking-tight text-zinc-800 group-hover:text-primary transition-colors mb-1">{title}</h4>
            <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <TrendingUp className="w-2.5 h-2.5" /> {count}
            </div>
        </div>
    );
}
