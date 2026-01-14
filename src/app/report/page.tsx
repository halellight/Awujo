"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2, Send, Image as ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportPage() {
    const [projects, setProjects] = useState<any[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        project_id: "",
        submitter_name: "",
        submitter_email: "",
        report_content: "",
        evidence_url: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        async function fetchProjects() {
            const { data } = await supabase
                .from('projects')
                .select('id, title')
                .order('title');

            if (data) setProjects(data);
        }
        fetchProjects();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('idle');

        let finalEvidenceUrl = formData.evidence_url;

        // 1. Handle Image Upload if file exists
        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random().toString(36).slice(2)}_${Date.now()}.${fileExt}`;
            const filePath = `entries/${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('reports')
                .upload(filePath, imageFile);

            if (uploadError) {
                console.error('Upload error:', uploadError);
                toast.error("Evidence upload failed. Proceeding without image.");
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('reports')
                    .getPublicUrl(filePath);
                finalEvidenceUrl = publicUrl;
            }
        }

        const submissionData = {
            ...formData,
            evidence_url: finalEvidenceUrl,
            project_id: formData.project_id || null,
            status: 'Pending'
        };

        const { error } = await supabase
            .from('project_reports')
            .insert([submissionData]);

        if (error) {
            console.error('Error submitting report:', error);
            setStatus('error');
        } else {
            setStatus('success');
            setFormData({
                project_id: "",
                submitter_name: "",
                submitter_email: "",
                report_content: "",
                evidence_url: "",
            });
        }
        setIsSubmitting(false);
    }

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* Header Section */}
            <section className="bg-white border-b border-zinc-200 pt-16 pb-12">
                <div className="max-w-4xl mx-auto px-6 sm:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-zinc-100 border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                    >
                        <span className="flex h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,135,81,0.5)]"></span>
                        Citizen Audit Protocol
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-heading font-black text-foreground tracking-tight uppercase mb-4 leading-none"
                    >
                        Submit <span className="text-primary italic">Report.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-500 text-sm md:text-base max-w-2xl font-medium leading-relaxed"
                    >
                        Directly influence governance by submitting verified ground truth.
                        Include photos, documents, or testimony to help us track project integrity.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-6 sm:px-10 mt-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm"
                >
                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-16 text-center"
                            >
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                                </div>
                                <h2 className="text-2xl font-heading font-black uppercase mb-4">Report Transmitted</h2>
                                <p className="text-zinc-500 font-medium mb-12 max-w-md mx-auto">
                                    Your report has been received by our analysis team. Upon verification, it will be published to the project radar.
                                </p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="bg-zinc-900 text-white px-10 py-5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-xl"
                                >
                                    Submit Another Report
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit}
                                className="p-8 md:p-12"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    {/* Project Selection */}
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Target Project</label>
                                        <select
                                            required
                                            value={formData.project_id}
                                            onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                                        >
                                            <option value="">Select Project from Radar</option>
                                            {projects.map(p => (
                                                <option key={p.id} value={p.id}>{p.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Submitter Name */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Integrity Auditor"
                                            value={formData.submitter_name}
                                            onChange={(e) => setFormData({ ...formData, submitter_name: e.target.value })}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>

                                    {/* Submitter Email */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address (Confidential)</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="auditor@awujo.ng"
                                            value={formData.submitter_email}
                                            onChange={(e) => setFormData({ ...formData, submitter_email: e.target.value })}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>

                                    {/* Evidence Upload / URL */}
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Media Evidence (Photos)</label>
                                            <span className="text-[9px] font-bold text-zinc-300 uppercase italic">Direct Upload preferred</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* File Upload */}
                                            <label className="relative group cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setImageFile(file);
                                                            setImagePreview(URL.createObjectURL(file));
                                                        }
                                                    }}
                                                />
                                                <div className="flex items-center gap-4 p-4 bg-zinc-50 border border-zinc-200 border-dashed rounded-lg group-hover:bg-zinc-100 group-hover:border-primary/30 transition-all h-full">
                                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-zinc-200 shadow-sm">
                                                        <ImageIcon className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Select Image</div>
                                                        <div className="text-[9px] font-bold text-zinc-300 uppercase">Gallery or Camera</div>
                                                    </div>
                                                </div>
                                            </label>

                                            {/* URL Fallback */}
                                            <div className="relative">
                                                <input
                                                    type="url"
                                                    disabled={!!imageFile}
                                                    placeholder="Or paste Evidence Link..."
                                                    value={formData.evidence_url}
                                                    onChange={(e) => setFormData({ ...formData, evidence_url: e.target.value })}
                                                    className="w-full h-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-50"
                                                />
                                            </div>
                                        </div>

                                        {/* Preview Area */}
                                        <AnimatePresence>
                                            {imagePreview && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="relative mt-4 group w-fit"
                                                >
                                                    <img src={imagePreview} className="w-40 h-40 object-cover rounded-xl border-4 border-white shadow-xl" alt="Preview" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setImageFile(null);
                                                            setImagePreview(null);
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-all"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Report Content */}
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Intelligence Briefing</label>
                                        <textarea
                                            required
                                            rows={6}
                                            placeholder="Describe the current status of the project, any discrepancies observed, or general implementation feedback..."
                                            value={formData.report_content}
                                            onChange={(e) => setFormData({ ...formData, report_content: e.target.value })}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {status === 'error' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600 text-xs font-bold uppercase tracking-wider"
                                        >
                                            <AlertCircle className="w-4 h-4" />
                                            Transmission Failed. Please check your data and retry.
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-primary text-primary-foreground py-6 rounded-lg text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-primary/10"
                                >
                                    {isSubmitting ? (
                                        <>Transmitting Data <Loader2 className="w-4 h-4 animate-spin" /></>
                                    ) : (
                                        <>Transmit Report <Send className="w-4 h-4" /></>
                                    )}
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
