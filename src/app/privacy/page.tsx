"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, EyeOff, Scale } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            <section className="bg-white border-b border-zinc-200 pt-20 pb-16">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-zinc-100 border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                    >
                        Data Sovereignty Protocol
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-heading font-black text-foreground tracking-tight uppercase mb-6 leading-tight"
                    >
                        Disclosure <span className="text-primary italic">Policy.</span>
                    </motion.h1>
                    <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-2xl">
                        Àwùjọ NG is committed to protecting citizen auditors and maintaining the highest standards of data integrity and protection.
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-6 mt-20 space-y-12">
                <div className="bg-white border border-zinc-200 rounded-2xl p-8 md:p-12 shadow-sm space-y-10">
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <Lock className="w-5 h-5" />
                            <h2 className="text-xl font-heading font-black uppercase tracking-tight">Anonymity & Protection</h2>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium leading-loose">
                            Citizen reports are handled with extreme confidentiality. Submitter identities are never published. We only retain email addresses for verification purposes and strictly do not share them with third parties or government agencies without explicit legal mandate.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <EyeOff className="w-5 h-5" />
                            <h2 className="text-xl font-heading font-black uppercase tracking-tight">Data Integrity</h2>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium leading-loose">
                            Once an intelligence report is verified and published, it becomes part of the public audit record. We do not edit historical data except to correct verified inaccuracies. Our platform maintains a versioned history of project status updates to prevent data manipulation.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <Scale className="w-5 h-5" />
                            <h2 className="text-xl font-heading font-black uppercase tracking-tight">Public Interest Disclosure</h2>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium leading-loose">
                            Àwùjọ NG operates under the principle of the Freedom of Information Act. We prioritize the public&apos;s right to know the status of federal and state infrastructure over institutional non-disclosure agreements.
                        </p>
                    </section>
                </div>

                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] text-center pt-8">
                    Last Revision: January 2026 // Protocol 9.2
                </div>
            </div>
        </div>
    );
}
