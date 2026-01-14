"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    FileText,
    AlertCircle,
    ArrowRight,
    TrendingUp,
    CheckCircle2,
    Clock,
    Landmark
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        pendingReports: 0,
        activeProjects: 0,
        openPetitions: 0,
        recentSubmissions: [] as any[],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const [reports, projects, petitions] = await Promise.all([
                supabase.from('project_reports').select('*, projects(title)').order('created_at', { ascending: false }),
                supabase.from('projects').select('*'),
                supabase.from('petitions').select('*').eq('status', 'Open'),
            ]);

            setStats({
                pendingReports: reports.data?.filter(r => r.status === 'Pending').length || 0,
                activeProjects: projects.data?.length || 0,
                openPetitions: petitions.data?.length || 0,
                recentSubmissions: reports.data?.slice(0, 5) || [],
            });
            setIsLoading(false);
        }
        fetchData();
    }, []);

    return (
        <div className="space-y-12">
            <section>
                <h1 className="text-3xl font-heading font-black uppercase tracking-tight mb-8">
                    Ops <span className="text-primary italic">Overview.</span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AdminStat
                        icon={<FileText className="text-amber-500" />}
                        label="Pending Reports"
                        value={stats.pendingReports}
                        description="Awaiting moderation"
                        link="/admin/reports"
                    />
                    <AdminStat
                        icon={<ShieldCheck className="text-primary" />}
                        label="Live Projects"
                        value={stats.activeProjects}
                        description="Currently in tracking"
                        link="/admin/projects"
                    />
                    <AdminStat
                        icon={<TrendingUp className="text-blue-500" />}
                        label="Open Petitions"
                        value={stats.openPetitions}
                        description="Citizen movements"
                        link="/admin/petitions"
                    />
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-heading font-black uppercase tracking-tight flex items-center gap-2">
                            <Clock className="w-4 h-4 text-zinc-400" /> Recent Intelligence
                        </h2>
                        <Link href="/admin/reports" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                            View All
                        </Link>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                        {stats.recentSubmissions.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">No pending reports detected.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-100">
                                {stats.recentSubmissions.map((report) => (
                                    <div key={report.id} className="p-6 hover:bg-zinc-50 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{report.submitter_name}</span>
                                            <span className="px-2 py-0.5 rounded-sm bg-amber-50 text-amber-600 border border-amber-100 text-[8px] font-black uppercase tracking-widest">Pending</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-zinc-900 group-hover:text-primary transition-colors cursor-pointer line-clamp-1 mb-2">
                                            {report.project_id ? "Internal Project Update" : "General Governance Report"}
                                        </h3>
                                        <p className="text-zinc-500 text-[11px] font-medium line-clamp-2 leading-relaxed">
                                            {report.report_content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-heading font-black uppercase tracking-tight flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-zinc-400" /> Quick Actions
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <QuickActionCard
                            title="Add New Project"
                            description="Deploy a new infrastructure node to the radar."
                            href="/admin/projects"
                        />
                        <QuickActionCard
                            title="Issue Policy Update"
                            description="Coordinate national gazette entries."
                            href="/admin/policies"
                        />
                        <QuickActionCard
                            title="Update Rep Data"
                            description="Maintain lawmaker contact pipelines."
                            href="/admin/representatives"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}

function AdminStat({ icon, label, value, description, link }: { icon: any, label: string, value: number, description: string, link: string }) {
    return (
        <Link href={link} className="block group">
            <div className="bg-white border border-zinc-200 rounded-xl p-8 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                        {icon}
                    </div>
                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{label}</span>
                </div>
                <div className="text-4xl font-heading font-black mb-2">{value}</div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-primary transition-colors">
                    {description}
                </div>
            </div>
        </Link>
    );
}

function QuickActionCard({ title, description, href }: { title: string, description: string, href: string }) {
    return (
        <Link href={href} className="flex items-center justify-between p-6 bg-white border border-zinc-200 rounded-xl hover:border-zinc-900 group transition-all">
            <div>
                <h4 className="text-sm font-bold uppercase tracking-tight text-zinc-900 group-hover:text-primary transition-colors">{title}</h4>
                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">{description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
        </Link>
    );
}
