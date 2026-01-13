"use client";

import Link from "next/link";

import { Menu, X, Landmark } from "lucide-react";
import { useState } from "react";

const navLinks = [
    { name: "Live Dashboard", href: "/dashboard" },
    { name: "Project Tracker", href: "/projects" },
    { name: "Policy Desk", href: "/policies" },
    { name: "Petitions", href: "/petitions" },
    { name: "Representatives", href: "/representatives" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-[27px] w-full z-50 bg-background/95 backdrop-blur-sm border-b border-zinc-200 transition-all">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <Landmark className="text-primary w-6 h-6" />
                            <span className="font-heading font-bold text-lg text-foreground tracking-tight uppercase">Àwùjọ <span className="text-primary">NG</span></span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-10">

                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link href="/report" className="border-l border-zinc-200 pl-10">
                            <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest hover:brightness-110 shadow-sm transition-all active:scale-95">
                                Submit Report
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-zinc-600"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-background border-b border-zinc-200 py-6 animate-in slide-in-from-top-4 duration-200">
                    <div className="px-6 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-primary"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link href="/report" className="block pt-4">
                            <button className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg text-xs font-black uppercase tracking-widest">
                                Submit Report
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
