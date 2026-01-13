"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            <section className="bg-white border-b border-zinc-200 pt-20 pb-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-zinc-100 border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                    >
                        Communication Protocol
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-heading font-black text-foreground tracking-tight uppercase mb-6 leading-tight"
                    >
                        Establish <span className="text-primary italic">Contact.</span>
                    </motion.h1>
                    <p className="text-zinc-500 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                        Our analysis team is available for media inquiries, data verification requests, and citizen briefing assistance.
                    </p>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 mt-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1 space-y-8">
                    <ContactMethod
                        icon={<Mail className="w-5 h-5" />}
                        label="Inquiries"
                        value="praiseibec@gmail.com"
                    />
                    <ContactMethod
                        icon={<MessageSquare className="w-5 h-5" />}
                        label="Media Desk"
                        value="media@awujo.ng"
                    />
                    <ContactMethod
                        icon={<MapPin className="w-5 h-5" />}
                        label="Operation Center"
                        value="FCT, Abuja, Nigeria"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-8 md:p-12 shadow-sm"
                >
                    <form className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Legal Name</label>
                                <input required className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Enter Full Name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address</label>
                                <input required type="email" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="name@domain.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Inquiry Classification</label>
                            <select className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                <option>Data Verification</option>
                                <option>Media Inquiry</option>
                                <option>Policy Clarification</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Briefing Message</label>
                            <textarea required rows={5} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="Provide details regarding your inquiry..." />
                        </div>

                        <button className="w-full bg-zinc-900 text-white py-5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-[0.98]">
                            Transmit Message <Send className="w-4 h-4" />
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

function ContactMethod({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="bg-white border border-zinc-200 rounded-xl p-8 hover:border-primary transition-colors group">
            <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded flex items-center justify-center text-zinc-400 group-hover:bg-primary/10 group-hover:text-primary transition-all mb-6">
                {icon}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">{label}</div>
            <div className="text-[13px] font-black text-zinc-900 uppercase tracking-tight">{value}</div>
        </div>
    );
}
