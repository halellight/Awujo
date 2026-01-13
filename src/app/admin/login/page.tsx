"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Landmark, Shield, ArrowRight, Loader2, Lock } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulation of login
        setTimeout(() => {
            router.push("/admin");
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 mb-8">
                        <Landmark className="text-primary w-8 h-8" />
                        <span className="font-heading font-black text-2xl text-foreground tracking-tight uppercase">
                            Àwùjọ<span className="text-primary">NG</span>
                        </span>
                    </Link>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-zinc-100 border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        Terminal Access Control
                    </div>
                    <h1 className="text-3xl font-heading font-black uppercase tracking-tight text-foreground">
                        Administrative <span className="text-primary italic">Clearance.</span>
                    </h1>
                </div>

                <div className="bg-white border border-zinc-200 rounded-xl p-8 md:p-10 shadow-xl shadow-zinc-200/50">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Security Email</label>
                            <input
                                required
                                type="email"
                                placeholder="admin@awujo.ng"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Access Key</label>
                            <div className="relative">
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                />
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-zinc-900 text-white py-5 rounded-lg text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>Verifying Identity <Loader2 className="w-4 h-4 animate-spin" /></>
                            ) : (
                                <>Establish Uplink <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        <span>Protocol v10.4.0</span>
                        <div className="flex items-center gap-2">
                            <Shield className="w-3 h-3 text-primary" />
                            Encrypted Session
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-zinc-400 text-[10px] font-medium leading-relaxed uppercase tracking-wider px-4">
                    Unauthorized access attempts are monitored and logged. <br />
                    Federal transparency protocol 42-A in effect.
                </p>
            </motion.div>
        </div>
    );
}
