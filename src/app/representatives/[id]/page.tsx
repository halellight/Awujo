"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
    Users2, Mail, MapPin, Landmark, ArrowLeft,
    ShieldCheck, BarChart3, Clock, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Counter } from "@/components/counter";

export default function RepresentativeDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [rep, setRep] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
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
        async function fetchRep() {
            setIsLoading(true);
            const { data } = await supabase
                .from('representatives')
                .select('*')
                .eq('id', id)
                .single();

            if (data) setRep(data);
            setIsLoading(false);
        }
        fetchRep();
    }, [id]);

    if (isLoading) return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
            <div className="animate-pulse text-[10px] font-black uppercase tracking-widest text-zinc-400">Synchronizing Profile...</div>
        </div>
    );

    if (!rep) return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-2xl font-heading font-black uppercase mb-4">Profile Not Located</h1>
            <Link href="/representatives" className="text-primary text-[10px] font-black uppercase tracking-widest">Return to Pipeline</Link>
        </div>
    );

    const isLeader = ["Senate President", "Speaker of the House"].includes(rep.role);

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* Header / Nav */}
            <div className="bg-white border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
                    <Link href="/representatives" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Pipeline
                    </Link>
                    {isAdmin && (
                        <div className="ml-auto">
                            <Link
                                href={`/admin/representatives?edit=${rep.id}`}
                                className="px-4 py-2 bg-zinc-900 text-white rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-sm"
                            >
                                <Landmark className="w-3 h-3" /> Manage Official
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Primary Profile */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className="bg-white border border-zinc-200 rounded-3xl p-8 md:p-12">
                            <div className="flex flex-col md:flex-row gap-10 items-start">
                                <div className={`w-32 h-32 md:w-48 md:h-48 rounded-2xl flex-shrink-0 border flex items-center justify-center bg-zinc-50 ${isLeader ? 'border-primary/20' : 'border-zinc-100'}`}>
                                    {rep.image_url ? (
                                        <img src={rep.image_url} alt={rep.name} className="w-full h-full object-cover rounded-2xl" />
                                    ) : (
                                        <Landmark className="w-16 h-16 text-zinc-200" />
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${isLeader ? 'bg-primary text-white border-primary' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                                            {rep.role}
                                        </span>
                                        <span className="px-2.5 py-1 rounded bg-zinc-50 text-zinc-400 border border-zinc-100 text-[9px] font-black uppercase tracking-widest">
                                            {rep.party || 'Independent'}
                                        </span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tight mb-4 leading-none">
                                        {rep.name}
                                    </h1>
                                    <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xl">
                                        Representing the constituents of <strong>{rep.constituency}</strong>, {rep.state} State in the 10th National Assembly.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-lg font-heading font-black uppercase tracking-tight flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-primary" /> Performance Matrix
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <PerformanceStat label="Bill Sponsorships" value={rep.bill_sponsorships?.toString() || "0"} />
                                <PerformanceStat label="Commitee Attendance" value={rep.committee_attendance || "0%"} />
                                <PerformanceStat label="Citizen Engagement" value={rep.citizen_engagement || "0/10"} />
                            </div>
                        </section>

                        <section className="bg-zinc-900 text-white rounded-3xl p-10 md:p-16">
                            <h2 className="text-2xl font-heading font-black uppercase mb-8 text-zinc-400">Legislative <span className="text-primary italic">Priority.</span></h2>
                            <p className="text-zinc-400 leading-relaxed font-medium mb-12">
                                {rep.legislative_priority || `Currently focusing on infrastructure development, fiscal transparency, and educational reform within the ${rep.constituency} corridor.`}
                            </p>
                            <div className="flex flex-wrap gap-12">
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Contact Protocol</div>
                                    <a href={`mailto:${rep.contact_email}`} className="text-lg font-bold hover:text-primary transition-colors flex items-center gap-2">
                                        {rep.contact_email} <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-white border border-zinc-200 rounded-2xl p-8">
                            <h3 className="text-sm font-heading font-black uppercase mb-8 text-zinc-400 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Jurisdiction
                            </h3>
                            <div className="space-y-6">
                                <JurisdictionRow label="State" value={rep.state} />
                                <JurisdictionRow label="Constituency" value={rep.constituency} />
                                <JurisdictionRow label="Assumed Office" value={rep.assumed_office || "June 2023"} />
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-2xl p-8">
                            <h3 className="text-sm font-heading font-black uppercase mb-8 text-zinc-400 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Verification
                            </h3>
                            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                                <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-tight leading-relaxed">
                                    Data sources: National Assembly Registry (NASS), Independent National Electoral Commission (INEC).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function PerformanceStat({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center md:text-left">
            <div className="text-3xl font-heading font-black mb-1"><Counter value={value} /></div>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</div>
        </div>
    );
}

function JurisdictionRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">{label}</span>
            <span className="font-bold text-zinc-900 uppercase tracking-tight">{value}</span>
        </div>
    );
}
