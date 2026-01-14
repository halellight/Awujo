"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, ShieldCheck, Users2 } from "lucide-react";
import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Home() {
  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative sm:pt-27 lg:pt-32 md:pt-32 pb-40 overflow-hidden border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-zinc-100 border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-12"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,135,81,0.5)]"></span>
            Real-time federation data portal
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-heading font-black text-foreground tracking-tight mb-8 max-w-5xl mx-auto leading-[0.95] uppercase"
          >
            Accountable <br />
            <span className="text-primary italic">Governance.</span> <br />
            Absolute <span className="text-zinc-400">Transparency.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-base md:text-lg text-zinc-500 mb-14 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            The decentralized engine for tracking Nigeria&apos;s progress. Monitor budget performance, project implementation, and public policy in high definition.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="w-full bg-primary text-primary-foreground px-10 py-5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/10">
                Enter Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/how-it-works" className="w-full sm:w-auto">
              <button className="w-full bg-white border border-zinc-200 text-foreground px-10 py-5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors shadow-sm">
                Platform Protocol
              </button>
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-32 pt-12 border-t border-zinc-100"
          >
            <StatItem label="Budget Performance" value="₦2.4T" />
            <StatItem label="Verified Projects" value="12" />
            <StatItem label="Submitters" value="85k" />
            <StatItem label="Policy Shifts" value="42" />
          </motion.div>
        </div>
      </section>

      {/* Primary Intelligence Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20 pb-8 border-b border-zinc-100"
          >
            <div className="max-w-xl text-left">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-4 font-heading">Core Systems</h4>
              <h2 className="text-3xl md:text-5xl font-heading font-black uppercase leading-tight tracking-tight">Data-Driven <span className="text-zinc-400">Accountability.</span></h2>
            </div>
            <p className="text-zinc-500 text-sm max-w-sm text-left md:text-right leading-relaxed font-medium">
              We leverage crowdsourced intelligence and official data to provide an unfiltered view of the Nigerian federation.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            <FeatureCard
              icon={<BarChart3 className="w-5 h-5" />}
              title="Budget Engine"
              description="High-fidelity analytics of federation revenue and expenditure across all ministries and agencies."
              link="/dashboard"
            />
            <FeatureCard
              icon={<ShieldCheck className="w-5 h-5" />}
              title="Project Radar"
              description="Real-time status tracking of infrastructure development with user-submitted proof and verification."
              link="/projects"
            />
            <FeatureCard
              icon={<Users2 className="w-5 h-5" />}
              title="Direct Pipeline"
              description="Verified contact channels and performance reporting for legislative representatives."
              link="/representatives"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-zinc-100 bg-zinc-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-heading font-black uppercase mb-8 leading-tight"
          >
            Citizens are the ultimate <span className="text-primary italic">Auditors.</span>
          </motion.h2>
          <p className="text-zinc-500 mb-12 leading-relaxed font-medium">Have an update on a local project? Submit your report now for verification by our analysis team. No account required.</p>
          <Link href="/report">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-zinc-900 text-white px-10 py-5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-xl"
            >
              Submit Project Report
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
}

import { Counter } from "@/components/counter";

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <motion.div variants={item} className="flex flex-col items-center md:items-start text-center md:text-left">
      <span className="text-4xl font-heading font-black text-foreground mb-2 tracking-tighter uppercase whitespace-nowrap">
        <Counter value={value} />
      </span>
      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{label}</span>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description, link }: { icon: React.ReactNode; title: string; description: string; link: string }) {
  return (
    <motion.div variants={item}>
      <Link href={link} className="group">
        <div className="flex flex-col items-start text-left">
          <div className="w-10 h-10 border border-zinc-200 rounded flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
            {icon}
          </div>
          <h3 className="text-lg font-heading font-bold uppercase mb-4 tracking-tight group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-zinc-500 text-[13px] leading-relaxed mb-8 flex-grow font-medium">
            {description}
          </p>
          <div className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform">
            Access Portal <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
