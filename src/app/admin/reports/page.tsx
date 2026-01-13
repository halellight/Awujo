"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, XCircle, Clock, ExternalLink, ShieldAlert, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminReportsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actioningId, setActioningId] = useState<string | null>(null);

    useEffect(() => {
        fetchReports();
    }, []);

    async function fetchReports() {
        setIsLoading(true);
        const { data } = await supabase
            .from('project_reports')
            .select('*, projects(title)')
            .order('created_at', { ascending: false });
        if (data) setReports(data);
        setIsLoading(false);
    }

    async function updateReportStatus(id: string, status: string) {
        setActioningId(id);
        await supabase.from('project_reports').update({ status }).eq('id', id);
        await fetchReports();
        setActioningId(null);
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-black uppercase tracking-tight mb-2">
                    Intelligence <span className="text-primary italic">Moderation.</span>
                </h1>
                <p className="text-zinc-500 text-[11px] font-black uppercase tracking-widest">Verify and authorize citizen ground truth</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {reports.length === 0 && !isLoading ? (
                    <div className="bg-white border border-zinc-200 rounded-xl p-20 text-center">
                        <ShieldAlert className="w-12 h-12 text-zinc-200 mx-auto mb-6" />
                        <p className="text-zinc-400 text-xs font-black uppercase tracking-widest">No reports in the verification pipeline.</p>
                    </div>
                ) : (
                    reports.map((report) => (
                        <div key={report.id} className="bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-8 flex-grow">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Source: {report.submitter_name}</span>
                                        <h3 className="text-lg font-bold text-zinc-900 uppercase">
                                            Target: {report.projects?.title || "General Governance"}
                                        </h3>
                                    </div>
                                    <div className={cn(
                                        "px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border",
                                        report.status === 'Approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            report.status === 'Rejected' ? "bg-red-50 text-red-600 border-red-100" :
                                                "bg-amber-50 text-amber-600 border-amber-100"
                                    )}>
                                        {report.status}
                                    </div>
                                </div>

                                <p className="text-zinc-500 text-sm leading-relaxed mb-6 font-medium italic">
                                    "{report.report_content}"
                                </p>

                                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-zinc-100">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                        <Clock className="w-3.5 h-3.5 text-zinc-300" />
                                        Transmitted: {new Date(report.created_at).toLocaleString()}
                                    </div>
                                    {report.evidence_url && (
                                        <a href={report.evidence_url} target="_blank" className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            Decrypt Evidence
                                        </a>
                                    )}
                                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                        ID: {report.submitter_email}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-zinc-50 border-t md:border-t-0 md:border-l border-zinc-200 p-6 flex flex-row md:flex-col justify-center gap-3 w-full md:w-56">
                                <button
                                    disabled={actioningId === report.id || report.status === 'Approved'}
                                    onClick={() => updateReportStatus(report.id, 'Approved')}
                                    className="flex-grow flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/10"
                                >
                                    {actioningId === report.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                    Authorize
                                </button>
                                <button
                                    disabled={actioningId === report.id || report.status === 'Rejected'}
                                    onClick={() => updateReportStatus(report.id, 'Rejected')}
                                    className="flex-grow flex items-center justify-center gap-2 bg-white border border-zinc-200 text-red-600 px-4 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-50 disabled:opacity-50 transition-all shadow-sm"
                                >
                                    {actioningId === report.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
