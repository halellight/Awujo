"use client";

import { motion } from "framer-motion";
import { Search, PenTool, FileText, CheckCircle2, ShieldCheck, Landmark } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            icon: <Search className="w-6 h-6" />,
            title: "Explore the Radar",
            description: "Access our real-time database of national infrastructure projects. Filter by state, sector, or budget status."
        },
        {
            icon: <PenTool className="w-6 h-6" />,
            title: "Submit a Report",
            description: "If you have ground truth—photos or testimony—on a project&apos;s status, transmit it securely via our citizen audit portal."
        },
        {
            icon: <CheckCircle2 className="w-6 h-6" />,
            title: "Expert Verification",
            description: "Our analysis team verifies every citizen report against official budget records and field data before publication."
        },
        {
            icon: <ShieldCheck className="w-6 h-6" />,
            title: "Drive Accountability",
            description: "Verified data is sent directly to appropriate oversight committees and published for national discourse."
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            <section className="bg-white border-b border-zinc-200 pt-20 pb-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-zinc-100 border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                    >
                        Digital Transparency Protocol
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-heading font-black text-foreground tracking-tight uppercase mb-6 leading-tight"
                    >
                        How it <span className="text-primary italic">Works.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        Àwùjọ NG acts as a bridge between official government data and the reality on the ground. Here is our operational sequence.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-5xl mx-auto px-6 mt-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white border border-zinc-200 rounded-xl p-8 md:p-10 hover:shadow-xl hover:shadow-primary/5 transition-all group"
                        >
                            <div className="w-12 h-12 bg-zinc-50 border border-zinc-100 rounded flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-heading font-black uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 bg-zinc-900 rounded-2xl p-12 text-center text-white"
                >
                    <Landmark className="w-10 h-10 text-primary mx-auto mb-8" />
                    <h2 className="text-2xl font-heading font-black uppercase mb-4 tracking-tight text-white">Ready to Audit?</h2>
                    <p className="text-zinc-400 text-sm font-medium max-w-sm mx-auto mb-10 leading-relaxed uppercase tracking-widest">
                        Join thousands of citizens monitoring projects across all 36 states.
                    </p>
                    <button className="bg-primary text-white px-10 py-5 rounded-lg text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl">
                        Open Project Radar
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
