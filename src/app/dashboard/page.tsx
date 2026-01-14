"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Wallet, Landmark, MapPin, Loader2, MessageSquare } from "lucide-react";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalBudget: 0,
        totalSpent: 0,
        stalledProjects: 0,
        completedProjects: 0,
    });
    const [recentReports, setRecentReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [velocityData, setVelocityData] = useState<number[]>([]);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const { data: projects } = await supabase.from('projects').select('*');
                const { data: reports } = await supabase.from('project_reports').select('*, projects(title)').order('created_at', { ascending: false }).limit(5);

                if (projects) {
                    const totalProjects = projects.length;
                    const totalBudget = projects.reduce((acc, p) => acc + (p.budget_allocated || 0), 0);
                    const totalSpent = projects.reduce((acc, p) => acc + (p.budget_spent || 0), 0);
                    const stalledProjects = projects.filter(p => p.status === 'Stalled').length;
                    const completedProjects = projects.filter(p => p.status === 'Completed').length;

                    setStats({
                        totalProjects,
                        totalBudget,
                        totalSpent,
                        stalledProjects,
                        completedProjects,
                    });

                    // Calculate initiation velocity (projects per month over last 6 months)
                    const now = new Date();
                    const velocity = Array(6).fill(0);
                    projects.forEach(p => {
                        const date = new Date(p.created_at);
                        const diffMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
                        if (diffMonths >= 0 && diffMonths < 6) {
                            velocity[5 - diffMonths]++;
                        }
                    });
                    // Normalize for visualization (0-100 scale)
                    const max = Math.max(...velocity, 1) || 1;
                    setVelocityData(velocity.map(v => (v / max) * 100));
                }

                if (reports) setRecentReports(reports);
            } catch (err) {
                console.error("Dashboard synchronization failure:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

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
                        System-Wide Intelligence
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-heading font-black text-foreground tracking-tight uppercase mb-4 leading-none">
                        Live <span className="text-primary italic">Dashboard.</span>
                    </h1>
                    <p className="text-zinc-500 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
                        High-fidelity analytics of the Nigerian federation. Monitor budget health, implementation velocity, and transparency metrics in real-time.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 mt-12">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-32 gap-6">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Synchronizing Federation Data...</span>
                    </div>
                ) : (
                    <>
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                        >
                            <DashboardStat
                                icon={<Wallet className="w-5 h-5" />}
                                label="Total Allocated"
                                value={`₦${(stats.totalBudget / 1e12).toFixed(1)}T`}
                                subValue="Federation Account"
                            />
                            <DashboardStat
                                icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
                                label="Total Spent"
                                value={`₦${(stats.totalSpent / 1e12).toFixed(1)}T`}
                                subValue={`${((stats.totalSpent / stats.totalBudget) * 100 || 0).toFixed(1)}% utilization`}
                            />
                            <DashboardStat
                                icon={<Landmark className="w-5 h-5" />}
                                label="Active Projects"
                                value={stats.totalProjects}
                                subValue="Across 36 States"
                            />
                            <DashboardStat
                                icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
                                label="Stalled Units"
                                value={stats.stalledProjects}
                                subValue="Immediate attention req"
                            />
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2 space-y-12">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white border border-zinc-200 rounded-xl p-8 md:p-10 shadow-sm"
                                >
                                    <h3 className="text-xl font-heading font-black uppercase mb-10 flex items-center gap-2 tracking-tight">
                                        <BarChart3 className="w-5 h-5 text-primary" /> Initiation Velocity
                                    </h3>
                                    <div className="h-48 md:h-64 flex items-end gap-2 md:gap-3 px-2">
                                        {velocityData.map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${Math.max(h, 5)}%` }}
                                                transition={{ delay: 0.5 + (i * 0.05), duration: 0.8, ease: "easeOut" }}
                                                className="flex-grow bg-zinc-100 rounded-t-lg hover:bg-primary transition-all cursor-help group relative min-w-[20px]"
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-black uppercase shadow-xl z-10 border border-white/10">
                                                    Month -{5 - i}: {Math.round((h / 100) * (stats.totalProjects || 10))} Projects
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">
                                        <span>6 Months Ago</span>
                                        <span>Current Cycle</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white border border-zinc-200 rounded-xl p-8 md:p-10"
                                >
                                    <h3 className="text-xl font-heading font-black uppercase mb-10 flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-primary" /> Recent Intelligence
                                    </h3>
                                    <div className="space-y-6">
                                        {recentReports.map((report, idx) => (
                                            <div key={report.id} className="flex gap-6 pb-6 border-b border-zinc-50 last:border-0 last:pb-0 group">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    {idx + 1}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-[13px] font-black text-zinc-900 uppercase tracking-tight">{report.projects?.title}</div>
                                                    <div className="text-[11px] font-medium text-zinc-500 line-clamp-1">{report.report_content}</div>
                                                    <div className="flex items-center gap-3 pt-1">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${report.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                            {report.status}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
                                                            {new Date(report.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>

                            <div className="space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm"
                                >
                                    <h3 className="text-lg font-heading font-black uppercase mb-8 tracking-tight">Status Distribution</h3>
                                    <div className="space-y-6">
                                        <StatusItem icon={<CheckCircle2 className="text-emerald-500" />} label="Completed" value={stats.completedProjects} total={stats.totalProjects} color="bg-emerald-500" />
                                        <StatusItem icon={<TrendingUp className="text-blue-500" />} label="In Progress" value={stats.totalProjects - stats.completedProjects - stats.stalledProjects} total={stats.totalProjects} color="bg-blue-500" />
                                        <StatusItem icon={<AlertTriangle className="text-red-500" />} label="Stalled" value={stats.stalledProjects} total={stats.totalProjects} color="bg-red-500" />
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-primary text-white rounded-xl p-10 shadow-2xl relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                        <ShieldCheckIcon className="w-24 h-24" />
                                    </div>
                                    <h3 className="text-xl font-heading font-black uppercase mb-4 relative z-10">Policy Alert</h3>
                                    <p className="text-white/70 text-[13px] font-medium leading-relaxed mb-8 relative z-10">New infrastructure guidelines issued by FEC. All projects above ₦5B now require citizen auditing.</p>
                                    <button className="w-full bg-white text-primary py-4 rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all hover:shadow-xl active:scale-95 relative z-10">
                                        Read Protocol
                                    </button>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-white"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="text-[11px] font-black uppercase tracking-widest">Hotspots</div>
                                    </div>
                                    <div className="space-y-4">
                                        <HotspotItem label="Lagos" value="24" />
                                        <HotspotItem label="Abuja" value="18" />
                                        <HotspotItem label="Kano" value="15" />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function DashboardStat({ icon, label, value, subValue }: { icon: any, label: string, value: string | number, subValue: string }) {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
            className="bg-white border border-zinc-200 rounded-xl p-8 hover:border-primary/30 transition-colors shadow-sm"
        >
            <div className="flex items-center gap-2 text-zinc-400 mb-6 font-black uppercase text-[10px] tracking-widest">
                {icon}
                {label}
            </div>
            <div className="text-4xl font-heading font-black uppercase tracking-tight mb-2 leading-none">{value}</div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{subValue}</div>
        </motion.div>
    );
}

function StatusItem({ icon, label, value, total, color }: { icon: any, label: string, value: number, total: number, color: string }) {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end text-[11px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    {icon}
                    {label}
                </div>
                <span className="text-sm font-black text-zinc-900">{value}</span>
            </div>
            <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    );
}

function HotspotItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest py-2 border-b border-zinc-800 last:border-0 border-dashed">
            <span className="text-zinc-500">{label}</span>
            <span className="text-primary">{value} Projects</span>
        </div>
    );
}

function ShieldCheckIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
