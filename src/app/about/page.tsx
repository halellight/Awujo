"use client";

import { motion } from "framer-motion";
import { Landmark, Shield, Target, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            <section className="bg-white border-b border-zinc-200 pt-20 pb-16">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-zinc-100 border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                    >
                        National Disclosure Registry
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-heading font-black text-foreground tracking-tight uppercase mb-6 leading-tight"
                    >
                        Our <span className="text-primary italic">Vision.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-500 text-lg font-medium leading-relaxed max-w-2xl"
                    >
                        Àwùjọ NG is a premier independent platform dedicated to fiscal transparency and project accountability in Nigeria. We believe that open data is the cornerstone of effective governance.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-6 mt-20 space-y-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-heading font-black uppercase tracking-tight">Radical Integrity</h2>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                            We operate outside the traditional government framework to ensure unbiased reporting. Every data point published on Àwùjọ NG is cross-referenced with both official gazettes and verified field intelligence.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                <Target className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-heading font-black uppercase tracking-tight">Active Impact</h2>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                            Our objective is not just to display data, but to facilitate change. By equipping citizens with verified evidence, we empower them to hold their representatives accountable for budget implementation.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-zinc-100 border border-zinc-200 rounded-2xl p-12"
                >
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-6">Our Methodology</h3>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="text-primary font-black mt-1">01.</div>
                            <p className="text-zinc-900 text-[13px] font-bold uppercase tracking-tight">Aggregate data from official Federation Budget documents.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="text-primary font-black mt-1">02.</div>
                            <p className="text-zinc-900 text-[13px] font-bold uppercase tracking-tight">Deploy field verification protocols via citizen reporting.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="text-primary font-black mt-1">03.</div>
                            <p className="text-zinc-900 text-[13px] font-bold uppercase tracking-tight">Publish implementation velocity metrics and stalled project alerts.</p>
                        </div>
                    </div>
                </motion.div>

                <div className="text-center pt-12 pb-20 border-t border-zinc-100">
                    <p className="text-zinc-400 text-[11px] font-black uppercase tracking-widest mb-4">Established 2026 // Federal Capital Territory</p>
                    <Landmark className="w-6 h-6 text-zinc-300 mx-auto" />
                </div>
            </div>
        </div>
    );
}
