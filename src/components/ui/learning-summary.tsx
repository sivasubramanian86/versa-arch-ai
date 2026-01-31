"use client";

import { motion } from "framer-motion";
import { Clock, BarChart3, ListChecks, Newspaper, Video, Book as BookIcon } from "lucide-react";
import { LearningState } from "@/types/learning-state";

interface SummaryCardProps {
    state: LearningState;
}

export function LearningSummary({ state }: SummaryCardProps) {
    const summary = state.feedback_guidance;
    const metrics = state.competency_assessment;

    if (!summary) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
            {/* Main Summary */}
            <div className="md:col-span-2 bg-foreground/5 backdrop-blur-xl border border-foreground/10 shadow-[0_0_40px_rgba(71,150,227,0.1)] rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ListChecks className="w-24 h-24 text-gemini-primary" />
                </div>

                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <span className="w-2 h-6 rounded-full bg-gemini-primary" />
                        Concept Summary
                    </h3>

                    {state.source_metadata && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-foreground/40">
                            {state.source_metadata.type === "video" && <Video className="w-3 h-3 text-red-500" />}
                            {state.source_metadata.type === "book" && <BookIcon className="w-3 h-3 text-blue-500" />}
                            {!["video", "book"].includes(state.source_metadata.type) && <Newspaper className="w-3 h-3 text-gemini-primary" />}
                            {state.source_metadata.type} Dissection
                        </div>
                    )}
                </div>

                <div className="space-y-2 mb-6">
                    {summary.summary_bullets?.map((bullet, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-foreground/5 border border-foreground/5">
                            <div className="w-5 h-5 rounded-full bg-gemini-primary/20 flex items-center justify-center text-gemini-primary text-xs font-bold mt-0.5">
                                {i + 1}
                            </div>
                            <p className="text-foreground/80 text-sm leading-relaxed">{bullet}</p>
                        </div>
                    ))}
                    {!summary.summary_bullets && (
                        <p className="text-foreground/40 italic">Generating summary points...</p>
                    )}
                </div>

                <div className="flex items-center gap-6 text-sm text-foreground/40">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gemini-secondary" />
                        <span>{summary.time_estimate || 15} min estimate</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-gemini-accent" />
                        <span>{summary.difficulty_label || "Intermediate"}</span>
                    </div>
                </div>
            </div>

            {/* Stats Column */}
            <div className="space-y-6">
                <div className="bg-foreground/5 backdrop-blur-xl border border-foreground/10 shadow-[0_0_40px_rgba(71,150,227,0.1)] rounded-2xl p-6 flex flex-col justify-center items-center text-center h-full">
                    <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-foreground/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                            <path className="text-gemini-success" strokeDasharray={`${metrics?.current_score || 0}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-2xl font-bold text-foreground">{metrics?.current_score || 0}%</span>
                            <span className="text-[10px] text-foreground/40 uppercase tracking-wider">Mastery</span>
                        </div>
                    </div>
                    <p className="text-sm text-foreground/40 mb-2">Confidence Level</p>
                    <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-gemini-primary to-gemini-secondary" style={{ width: `${(metrics?.confidence_level || 0) * 100}%` }} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
