"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import {
    MapPin, Calendar, Wallet, Landmark,
    ArrowLeft, MessageSquare, Image as ImageIcon,
    Clock, Send, Trash2, ShieldCheck, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = use(params);
    const [project, setProject] = useState<any>(null);
    const [updates, setUpdates] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [userName, setUserName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email === 'praiseibec@gmail.com') {
                setIsAdmin(true);
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        async function fetchProjectData() {
            setIsLoading(true);

            // 1. Fetch Project
            const { data: projectData } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();

            if (projectData) setProject(projectData);

            // 2. Fetch Updates
            const { data: updateData } = await supabase
                .from('project_updates')
                .select('*')
                .eq('project_id', projectId)
                .order('update_date', { ascending: false });

            if (updateData) setUpdates(updateData);

            // 3. Fetch Published Reports
            const { data: reportData } = await supabase
                .from('project_reports')
                .select('*')
                .eq('project_id', projectId)
                .eq('status', 'Published')
                .order('created_at', { ascending: false });

            if (reportData) setReports(reportData);

            // 4. Fetch Comments
            const { data: commentData } = await supabase
                .from('project_comments')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false });

            if (commentData) setComments(commentData);

            setIsLoading(false);
        }
        fetchProjectData();
    }, [projectId]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        const { data, error } = await supabase
            .from('project_comments')
            .insert([{
                project_id: projectId,
                user_name: userName.trim() || "Anonymous Citizen",
                comment_text: newComment
            }])
            .select();

        if (data) {
            setComments([data[0], ...comments]);
            setNewComment("");
            setUserName("");
        }
        setIsSubmitting(false);
    };

    const handleDeleteComment = async (commentId: string) => {
        const { error } = await supabase
            .from('project_comments')
            .delete()
            .eq('id', commentId);

        if (!error) {
            setComments(comments.filter(c => c.id !== commentId));
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-zinc-400 text-xs font-black uppercase tracking-widest">Accessing Intelligence...</p>
            </div>
        </div>
    );

    if (!project) return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
            <div className="text-center">
                <h1 className="text-2xl font-black uppercase mb-4">Project Not Found</h1>
                <Link href="/projects" className="text-primary font-bold uppercase text-xs tracking-widest">Back to Radar</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* Navigation Header */}
            <div className="bg-white border-b border-zinc-200 py-4 sticky top-[89px] z-40">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
                    <Link href="/projects" className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Back to Radar</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            project.status === 'Stalled' ? 'bg-red-50 text-red-600 border-red-100' :
                                'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                            {project.status}
                        </span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 lg:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Left Column: Project Details & Updates */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Hero Info */}
                    <section>
                        <h1 className="text-4xl md:text-6xl font-heading font-black text-foreground tracking-tight uppercase leading-tight mb-6">
                            {project.title}
                        </h1>
                        <p className="text-zinc-500 text-lg font-medium leading-relaxed mb-8">
                            {project.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                                <MapPin className="w-5 h-5 text-zinc-400 mb-3" />
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">State Unit</div>
                                <div className="text-sm font-bold text-zinc-900 uppercase">{project.location}</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                                <Wallet className="w-5 h-5 text-zinc-400 mb-3" />
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Budget Allocation</div>
                                <div className="text-sm font-bold text-zinc-900 uppercase">₦{new Intl.NumberFormat('en-NG').format(project.budget_allocated)}</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                                <Clock className="w-5 h-5 text-zinc-400 mb-3" />
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Status Phase</div>
                                <div className="text-sm font-bold text-zinc-900 uppercase">{project.status}</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                                <Calendar className="w-5 h-5 text-zinc-400 mb-3" />
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Inception</div>
                                <div className="text-sm font-bold text-zinc-900 uppercase">{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Pending'}</div>
                            </div>
                        </div>
                    </section>

                    {/* Progress Visuals */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <ImageIcon className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-heading font-black uppercase tracking-tight">Project Intelligence <span className="text-zinc-400 italic font-medium ml-2">Updates.</span></h2>
                        </div>

                        <div className="space-y-8">
                            {updates.length === 0 ? (
                                <div className="bg-zinc-100/50 border border-zinc-200 border-dashed rounded-xl p-12 text-center">
                                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">No visual updates transmitted yet.</p>
                                </div>
                            ) : (
                                updates.map((update, idx) => (
                                    <motion.div
                                        key={update.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm"
                                    >
                                        {update.image_url && (
                                            <div className="aspect-video relative overflow-hidden bg-zinc-100">
                                                <img
                                                    src={update.image_url}
                                                    alt="Project update"
                                                    className="object-cover w-full h-full"
                                                />
                                                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
                                                    <ShieldCheck className="w-3 h-3 text-primary" />
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Expert Verified</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="p-8">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(update.update_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                            <p className="text-zinc-600 font-medium leading-relaxed">
                                                {update.update_text}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Citizen Ground Reports */}
                        {reports.length > 0 && (
                            <div className="pt-12 space-y-8">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    <h2 className="text-xl font-heading font-black uppercase tracking-tight">Verified Citizen <span className="text-zinc-400 italic font-medium ml-2">Ground Truth.</span></h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {reports.map((report) => (
                                        <div key={report.id} className="bg-emerald-50/30 border border-emerald-100 rounded-2xl overflow-hidden">
                                            {report.evidence_url && (
                                                <div className="aspect-video relative bg-zinc-100 border-b border-emerald-100">
                                                    {(report.evidence_url.includes('supabase.co') || report.evidence_url.match(/\.(jpg|jpeg|png|webp|gif)$/i)) ? (
                                                        <img
                                                            src={report.evidence_url}
                                                            alt="Ground evidence"
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-zinc-200 shadow-sm mb-3">
                                                                <ImageIcon className="w-6 h-6 text-zinc-300" />
                                                            </div>
                                                            <a
                                                                href={report.evidence_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2"
                                                            >
                                                                View Digital Evidence <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Confirmed Report</div>
                                                    <div className="text-[9px] font-bold text-zinc-400 uppercase">{new Date(report.created_at).toLocaleDateString()}</div>
                                                </div>
                                                <p className="text-zinc-700 text-sm font-medium leading-relaxed italic mb-4">
                                                    "{report.report_content}"
                                                </p>
                                                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                                                    Transmitted by {report.submitter_name}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                        }
                    </section>
                </div>

                {/* Right Column: Citizen Feedback */}
                <div className="space-y-8 lg:sticky lg:top-[160px] h-fit">
                    <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-heading font-black uppercase tracking-tight">Citizen <span className="text-zinc-400 italic">Audit.</span></h2>
                        </div>

                        {/* Comment Form */}
                        <form onSubmit={handleCommentSubmit} className="space-y-4 mb-10">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Your Name</label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Enter name (optional)"
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Testimony / Feedback</label>
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Share your observation of this project..."
                                    rows={4}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting || !newComment.trim()}
                                className="w-full bg-primary text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 disabled:opacity-50 disabled:brightness-100 transition-all shadow-lg shadow-primary/20"
                            >
                                <Send className="w-3.5 h-3.5" />
                                {isSubmitting ? "Transmitting..." : "Submit Report"}
                            </button>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <div className="h-px bg-primary/20 flex-grow" />
                                {comments.length} Observations
                                <div className="h-px bg-primary/20 flex-grow" />
                            </div>

                            {comments.length === 0 ? (
                                <p className="text-center text-zinc-400 text-[10px] font-bold uppercase tracking-widest py-8">Be the first to audit this project.</p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="group space-y-2 pb-6 border-b border-zinc-100 last:border-0">
                                        <div className="flex justify-between items-start">
                                            <div className="text-[11px] font-black text-zinc-900 uppercase">
                                                {comment.user_name}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-zinc-400 uppercase">
                                                    {new Date(comment.created_at).toLocaleDateString()}
                                                </span>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-zinc-500 text-xs font-medium leading-relaxed">
                                            {comment.comment_text}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
