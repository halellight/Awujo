"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, ArrowLeft, PenTool, Check, Loader2,
    Share2, AlertCircle, TrendingUp, Info,
    Calendar, Building2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Counter } from "@/components/counter";

export default function PetitionDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [petition, setPetition] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSigning, setIsSigning] = useState(false);

    useEffect(() => {
        async function fetchPetition() {
            setIsLoading(true);
            const { data } = await supabase
                .from('petitions')
                .select('*')
                .eq('id', id)
                .single();

            if (data) setPetition(data);
            setIsLoading(false);
        }
        fetchPetition();
    }, [id]);

    async function handleSign() {
        if (!petition) return;
        setIsSigning(true);

        const { error } = await supabase.rpc('increment_petition_signatures', { petition_id: id });

        if (error) {
            console.error("Signature error:", error);
            toast.error(`Transmission failed: ${error.message || "Collective action signal blocked."}`);
        } else {
            setPetition({ ...petition, current_signatures: petition.current_signatures + 1, hasSigned: true });
            toast.success("Signature transmitted to the federation registry.");
        }
        setIsSigning(false);
    }

    async function handleShare() {
        if (!petition) return;
        console.log("Initiating Movement Pulse Share...");
        const url = window.location.href;
        const title = `Support Movement: ${petition.title}`;

        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: petition.description.substring(0, 100) + "...",
                    url: url,
                });
                toast.success("Movement signal shared.");
            } catch (err) {
                console.error("Share failed:", err);
            }
        } else {
            // Fallback: Copy to clipboard
            await navigator.clipboard.writeText(url);
            toast.success("Protocol link copied to clipboard.");
        }
    }

    if (isLoading) return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
            <div className="animate-pulse text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading Movement Pipeline...</div>
        </div>
    );

    if (!petition) return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-2xl font-heading font-black uppercase mb-4">Movement Pipeline Offline</h1>
            <Link href="/petitions" className="text-primary text-[10px] font-black uppercase tracking-widest">Return to Collective Action</Link>
        </div>
    );

    const progress = (petition.current_signatures / petition.expected_signatures) * 100;

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* Header / Nav */}
            <div className="bg-white border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
                    <Link href="/petitions" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Collective
                    </Link>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className="bg-white border border-zinc-200 rounded-3xl p-8 md:p-12 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8">
                                <span className={`px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest border ${petition.status === 'Open' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                                    {petition.status} Protocol
                                </span>
                            </div>

                            <div className="space-y-8 max-w-3xl">
                                <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                                    <Building2 className="w-4 h-4 text-primary" /> Target: {petition.target_authority}
                                </div>
                                <h1 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tight leading-none">
                                    {petition.title}
                                </h1>
                                <div className="flex flex-wrap gap-8 py-6 border-y border-zinc-100">
                                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold whitespace-nowrap">
                                        <Users className="w-4 h-4 text-zinc-300" /> <Counter value={petition.current_signatures} /> Signatories
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold whitespace-nowrap">
                                        <Calendar className="w-4 h-4 text-zinc-300" /> Initiated {new Date(petition.created_at).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                                <div className="prose prose-zinc max-w-none">
                                    <p className="text-zinc-600 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                                        {petition.description}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-zinc-900 text-white rounded-3xl p-10 md:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 opacity-10">
                                <TrendingUp className="w-64 h-64 -mr-20 -mt-20" />
                            </div>
                            <h2 className="text-2xl font-heading font-black uppercase mb-12 flex items-center gap-3 text-zinc-400">
                                <Info className="w-6 h-6 text-primary" /> Collective Momentum
                            </h2>
                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                        <span>Current Signal</span>
                                        <span className="text-white"><Counter value={petition.current_signatures} /> / {petition.expected_signatures.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(progress, 100)}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-primary shadow-[0_0_15px_rgba(0,135,81,0.5)]"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-6">
                                    <button
                                        onClick={handleSign}
                                        disabled={petition.hasSigned || isSigning || petition.status !== 'Open'}
                                        className={`flex-grow py-6 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl ${petition.hasSigned ? 'bg-white/10 text-zinc-500 cursor-default' : 'bg-primary text-white hover:brightness-110 active:scale-95'}`}
                                    >
                                        {isSigning ? (
                                            <>Transmitting Pulse <Loader2 className="w-4 h-4 animate-spin" /></>
                                        ) : petition.hasSigned ? (
                                            <>Signal Transmitted <Check className="w-4 h-4 text-primary" /></>
                                        ) : (
                                            <>Sign Collective Action <PenTool className="w-4 h-4" /></>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="px-10 py-6 border border-white/10 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-colors flex items-center justify-center gap-3"
                                    >
                                        <Share2 className="w-4 h-4" /> Share Movement
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-white border border-zinc-200 rounded-2xl p-8">
                            <h3 className="text-sm font-heading font-black uppercase mb-8 text-zinc-400 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Why this movement?
                            </h3>
                            <div className="space-y-6 text-[13px] text-zinc-600 font-medium leading-relaxed">
                                <p>Petitions are weighted signals processed by the Àwùjọ governance layer. Reaching the signal objective triggers an official inquiry pipeline.</p>
                                <ul className="space-y-3">
                                    <li className="flex gap-3"><span className="text-primary font-black">•</span> Verified by ground agents</li>
                                    <li className="flex gap-3"><span className="text-primary font-black">•</span> Transmitted to legislative desk</li>
                                    <li className="flex gap-3"><span className="text-primary font-black">•</span> Public progress tracking</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-8">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">Pipeline Verification</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl border border-zinc-200 flex items-center justify-center">
                                    <Info className="w-6 h-6 text-zinc-200" />
                                </div>
                                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                                    Secure and anonymous signature encryption active.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
