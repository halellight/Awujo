import Link from "next/link";
import { Landmark } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-zinc-50 border-t border-zinc-200 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <Landmark className="text-primary w-6 h-6" />
                            <span className="font-heading font-bold text-lg text-foreground tracking-tight uppercase">Àwùjọ<span className="text-primary">NG</span></span>
                        </Link>
                        <p className="text-zinc-500 text-[13px] leading-relaxed">
                            Nigeria&apos;s independent platform for tracking governance, budget allocation, and infrastructure implementation. Built for the citizens, by the citizens.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 mb-6 font-heading">Data Portals</h4>
                        <ul className="space-y-3 text-[13px] text-zinc-500">
                            <li><Link href="/dashboard" className="hover:text-primary transition-colors">Federation Dashboard</Link></li>
                            <li><Link href="/projects" className="hover:text-primary transition-colors">State Project Engine</Link></li>
                            <li><Link href="/policies" className="hover:text-primary transition-colors">National Policy Desk</Link></li>
                            <li><Link href="/petitions" className="hover:text-primary transition-colors">Active Petitions</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 mb-6 font-heading">Information</h4>
                        <ul className="space-y-3 text-[13px] text-zinc-500">
                            <li><Link href="/about" className="hover:text-primary transition-colors">Platform Vision</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-primary transition-colors">User Protocol</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Official Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Disclosure Policy</Link></li>
                        </ul>
                    </div>

                    <div className="bg-zinc-100 p-6 rounded-lg border border-zinc-200">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 mb-4 font-heading">Admin Operations</h4>
                        <p className="text-[12px] text-zinc-500 mb-4 leading-relaxed">System administrators only. Public access is restricted to verified portals.</p>
                        <Link href="/admin/login">
                            <button className="w-full bg-white border border-zinc-200 text-zinc-900 text-[10px] font-black uppercase tracking-widest py-2 rounded shadow-sm hover:bg-zinc-50 transition-colors">
                                Terminal Access
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                    <p>© 2026 Àwùjọ NG. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-primary transition-colors">Twitter // X</Link>
                        <Link href="#" className="hover:text-primary transition-colors">LinkedIn</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Open Data Index</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
