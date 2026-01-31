"use client";

import React, { useState } from "react";
import { AppHeader } from "@/components/ui/app-header";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, CheckCircle2, Sparkles } from "lucide-react";
import clsx from "clsx";

export default function FeedbackPage() {
    const [rating, setRating] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-gemini-primary/30">
            <AppHeader />

            <main className="relative z-10 max-w-4xl mx-auto px-4 pb-20 pt-24 text-center">
                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-panel p-12 bg-foreground/5 border-foreground/10"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gemini-primary/10 text-gemini-primary flex items-center justify-center mx-auto mb-8">
                                <MessageSquare className="w-8 h-8" />
                            </div>

                            <h1 className="text-4xl font-bold mb-4">Share your Experience</h1>
                            <p className="text-foreground/60 mb-12 max-w-lg mx-auto">
                                How is your journey with Versa Arch AI? Your feedback helps us build
                                a better learning experience for everyone.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-12">
                                {/* Rating */}
                                <div>
                                    <label className="text-sm font-semibold uppercase tracking-widest text-foreground/40 block mb-6">
                                        Overall Satisfaction
                                    </label>
                                    <div className="flex justify-center gap-2 md:gap-4">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                onMouseEnter={() => setHoveredRating(num)}
                                                onMouseLeave={() => setHoveredRating(null)}
                                                onClick={() => setRating(num)}
                                                className={clsx(
                                                    "w-8 h-12 md:w-12 md:h-16 rounded-xl border font-bold transition-all",
                                                    (hoveredRating !== null ? num <= hoveredRating : rating !== null && num <= rating)
                                                        ? "bg-gemini-primary border-gemini-primary text-white shadow-lg shadow-gemini-primary/20"
                                                        : "bg-foreground/5 border-foreground/10 text-foreground/60 hover:border-foreground/20"
                                                )}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Text Area */}
                                <div className="text-left">
                                    <label className="text-sm font-semibold uppercase tracking-widest text-foreground/40 block mb-4">
                                        What can we improve?
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="Features you'd like to see, bugs you've found, or just a hello..."
                                        className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-6 text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-gemini-primary/30 transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={rating === null}
                                    className="w-full py-4 rounded-2xl bg-gemini-primary text-white font-bold text-lg hover:bg-gemini-primary/90 transition-all disabled:opacity-20 disabled:cursor-not-allowed group flex items-center justify-center gap-3 shadow-xl shadow-gemini-primary/20"
                                >
                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    Submit Feedback
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-20"
                        >
                            <div className="w-24 h-24 rounded-full bg-gemini-success/10 text-gemini-success flex items-center justify-center mx-auto mb-8 border border-gemini-success/20">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <h2 className="text-4xl font-bold mb-4">Thank You!</h2>
                            <p className="text-foreground/60 text-lg mb-12">
                                Your insights have been captured and sent to the core agents.
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="px-8 py-3 rounded-full bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-all"
                                >
                                    Back to Home
                                </button>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="px-8 py-3 rounded-full bg-gemini-primary/10 text-gemini-primary border border-gemini-primary/20 hover:bg-gemini-primary/20 transition-all flex items-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Submit Another
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gemini-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gemini-secondary/5 blur-[120px]" />
            </div>
        </div>
    );
}
