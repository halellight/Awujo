"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Database, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function SeedPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const realData = {
        reps: [
            { name: "Godswill Akpabio", role: "Senate President", constituency: "Akwa Ibom North-West", state: "Akwa Ibom", party: "APC", contact_email: "president.senate@nass.gov.ng" },
            { name: "Tajudeen Abbas", role: "Speaker of the House", constituency: "Zaria Federal", state: "Kaduna", party: "APC", contact_email: "speaker@nass.gov.ng" },
            { name: "Akpoti-uduaghan Natasha", role: "Senator", constituency: "Kogi Central", state: "Kogi", party: "PDP", contact_email: "n.akpoti@nass.gov.ng" },
            { name: "Abba Patrick Moro", role: "Senator", constituency: "Benue South", state: "Benue", party: "PDP", contact_email: "p.moro@nass.gov.ng" },
            { name: "Adeola Solomon Olamilekan", role: "Senator", constituency: "Ogun West", state: "Ogun", party: "APC", contact_email: "s.adeola@nass.gov.ng" },
            { name: "Ahmad Ibrahim Lawan", role: "Senator", constituency: "Yobe North", state: "Yobe", party: "APC", contact_email: "a.lawan@nass.gov.ng" },
            { name: "Omosede Gabriella Igbinedion", role: "Honourable", constituency: "Ovia Federal", state: "Edo", party: "APC", contact_email: "g.igbinedion@nass.gov.ng" }
        ],
        policies: [
            { title: "National Minimum Wage (Amendment) Act 2024", description: "Mandates a new national minimum wage of ₦70,000, with review every 3 years. Signed into law July 2024.", category: "Labor / Economy", implementation_date: "2024-07-29", status: "Active" },
            { title: "Nigeria Tax Act (NTA) 2026", description: "Comprehensive overhaul of the tax landscape including NRSA and Joint Revenue Board frameworks. signed June 2025, effective Jan 2026.", category: "Fiscal Policy", implementation_date: "2026-01-01", status: "Upcoming" },
            { title: "Cybercrimes (Amendment) Act 2024", description: "Mandates 0.5% cybersecurity levy on electronic transactions to fund national digital defense.", category: "Security / Tech", implementation_date: "2024-05-01", status: "Active" },
            { title: "Renewed Hope Nigeria First Policy", description: "Directs government investment to prioritize local industries and indigenous content across all sectors.", category: "Governance", implementation_date: "2025-05-05", status: "Active" }
        ],
        projects: [
            { title: "Lagos-Calabar Coastal Highway", description: "Construction of a 700km highway connecting Lagos to Calabar.", state: "Lagos / Calabar", status: "In Progress", budget_allocated: 15000000000000, budget_spent: 1200000000000, category: "Infrastructure" },
            { title: "Port Harcourt Refinery Modernization", description: "Complete rehabilitation of the Port Harcourt Refining Company for optimal domestic output.", state: "Rivers", status: "In Progress", budget_allocated: 1200000000000, budget_spent: 980000000000, category: "Energy" },
            { title: "Sokoto-Badagry Highway", description: "1,068km arterial road connecting the North-West to the South-West.", state: "Sokoto / Badagry", status: "In Progress", budget_allocated: 1100000000000, budget_spent: 50000000000, category: "Infrastructure" },
            { title: "Abuja-Kano Dual Carriageway", description: "Dualization and expansion of the critical freight corridor.", state: "FCT / Kano", status: "In Progress", budget_allocated: 790000000000, budget_spent: 450000000000, category: "Infrastructure" }
        ]
    };

    async function runSeed() {
        setStatus("loading");
        try {
            // Delete existing test data to avoid duplicates if necessary, 
            // but for safety we just insert the specific real ones.

            await supabase.from('representatives').insert(realData.reps);
            await supabase.from('policies').insert(realData.policies);
            const { data: projects } = await supabase.from('projects').insert(realData.projects).select();

            if (projects && projects.length > 0) {
                const reports = [
                    { project_id: projects.find(p => p.title.includes("Coastal"))?.id, reporter_name: "Tracka Auditor 01", report_text: "Dredging operations verified at Section 1. Earthworks progressing despite terrain challenges.", evidence_url: "https://tracka.ng", status: "Verified" },
                    { project_id: projects.find(p => p.title.includes("Refinery"))?.id, reporter_name: "Oil Sector Analyst", report_text: "Testing phase confirmed. Flaring intensity increased as units come online. Near-term production expected.", evidence_url: "https://nnpcgroup.com", status: "Pending" }
                ].filter(r => r.project_id);

                if (reports.length > 0) {
                    await supabase.from('project_reports').insert(reports);
                }
            }

            setStatus("success");
            setMessage("National Database Synchronized. Representatives, Policies, and Infrastructure Nodes are now live.");
        } catch (err) {
            console.error(err);
            setStatus("error");
            setMessage("Synchronization failure. Check logs for protocol errors.");
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-zinc-200 rounded-3xl p-12 max-w-lg w-full text-center shadow-2xl"
            >
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-8">
                    <Database className="w-10 h-10" />
                </div>

                <h1 className="text-3xl font-heading font-black uppercase tracking-tight mb-4">
                    Data <span className="text-primary italic">Sync.</span>
                </h1>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-10 px-4">
                    Transmit verified 10th National Assembly data and 2024-2026 Federal Policies into the secure database.
                </p>

                {status === "idle" && (
                    <button
                        onClick={runSeed}
                        className="w-full bg-zinc-900 text-white py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl"
                    >
                        Initialize Synchronization
                    </button>
                )}

                {status === "loading" && (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Verifying Protocol...</span>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-3 text-emerald-600 font-bold uppercase text-xs tracking-widest">
                            <CheckCircle2 className="w-5 h-5" /> Transmission Complete
                        </div>
                        <p className="text-zinc-500 text-[11px] font-medium leading-relaxed bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                            {message}
                        </p>
                        <button
                            onClick={() => window.location.href = "/dashboard"}
                            className="w-full bg-primary text-white py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg"
                        >
                            Open Live Dashboard
                        </button>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-3 text-red-600 font-bold uppercase text-xs tracking-widest">
                            <AlertCircle className="w-5 h-5" /> Sync Halted
                        </div>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                            {message}
                        </p>
                        <button
                            onClick={() => setStatus("idle")}
                            className="w-full bg-zinc-100 text-zinc-600 py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em]"
                        >
                            Retry Protocol
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
