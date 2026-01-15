"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import {
    BarChart3,
    ShieldCheck,
    FileText,
    Users2,
    PenTool,
    LayoutDashboard,
    LogOut,
    Landmark,
    Shield,
    MessageSquare,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/projects", icon: ShieldCheck },
    { name: "Reports", href: "/admin/reports", icon: FileText },
    { name: "Policies", href: "/admin/policies", icon: Shield },
    { name: "Petitions", href: "/admin/petitions", icon: PenTool },
    { name: "Representatives", href: "/admin/representatives", icon: Users2 },
    { name: "Comments", href: "/admin/comments", icon: MessageSquare },
];

import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !user && pathname !== "/admin/login") {
            router.push("/admin/login");
        }
    }, [user, isLoading, pathname, router]);

    // Close mobile menu when pathname changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Don't show sidebar on login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-12 gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Verifying Administrative Clearance...</span>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-zinc-50">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 z-[60]">
                <Link href="/" className="flex items-center gap-2">
                    <Landmark className="text-primary w-5 h-5" />
                    <span className="font-heading font-bold text-base text-foreground tracking-tight uppercase">
                        Admin<span className="text-primary">Ops</span>
                    </span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 -mr-2 text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <BarChart3 className="w-6 h-6 rotate-90" />}
                </button>
            </header>

            {/* Backdrop for mobile */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-zinc-200 z-50 transition-transform duration-300 lg:translate-x-0",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-8 pb-12 flex flex-col h-full">
                    <Link href="/" className="flex items-center gap-2 mb-10">
                        <Landmark className="text-primary w-6 h-6" />
                        <span className="font-heading font-bold text-lg text-foreground tracking-tight uppercase">
                            Admin<span className="text-primary">Ops</span>
                        </span>
                    </Link>

                    <nav className="space-y-1 flex-grow">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href;
                            const Icon = link.icon;

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all group",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                                            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-zinc-400 group-hover:text-primary transition-colors")} />
                                    {link.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="ml-auto w-1 h-4 bg-white rounded-full"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="pt-8 mt-auto border-t border-zinc-100">
                        <Link href="/admin/login">
                            <button className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-lg bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors">
                                <LogOut className="w-3.5 h-3.5" />
                                Terminate Session
                            </button>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow lg:ml-64 min-h-screen pt-16 lg:pt-0">
                <header className="hidden lg:flex h-16 bg-white border-b border-zinc-200 items-center justify-between px-8 sticky top-0 z-40">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                        Current Operations / <span className="text-zinc-900">{sidebarLinks.find(l => l.href === pathname)?.name || "Dashboard"}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase text-zinc-900">Praise Ibec.</span>
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Master Admin</span>
                        </div>
                        <div className="w-8 h-8 rounded bg-zinc-100 border border-zinc-200" />
                    </div>
                </header>

                {/* Mobile Page Indicator */}
                <div className="lg:hidden border-b border-zinc-200 bg-zinc-50 px-6 py-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                        Ops / <span className="text-zinc-900">{sidebarLinks.find(l => l.href === pathname)?.name || "Dashboard"}</span>
                    </div>
                </div>

                <div className="p-6 md:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
