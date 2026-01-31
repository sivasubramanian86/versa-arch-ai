"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";

interface HeroSectionProps {
    onSubmit: (input: string) => void;
    loading: boolean;
}

export function HeroSection({ onSubmit, loading }: HeroSectionProps) {
    const [input, setInput] = useState("");
    const [style, setStyle] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            const finalQuery = style.trim() ? `${input} (Explain as ${style})` : input;
            onSubmit(finalQuery);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative text-center pt-20 pb-12"
        >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gemini-primary/10 border border-gemini-primary/20 text-gemini-primary text-xs font-medium mb-6">
                <Sparkles className="w-3 h-3" />
                <span>Powered by Vertex AI & LangGraph</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                Learn any system{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gemini-primary via-gemini-secondary to-gemini-accent">10x faster</span>
            </h1>

            <p className="text-lg text-foreground/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                Diagrams, analogies, and micro-quizzes generated from your prompt, <span className="text-gemini-primary font-medium">YouTube links</span>, or <span className="text-gemini-secondary font-medium">Books</span>.
            </p>

            {/* Input Card */}
            <div className="max-w-3xl mx-auto p-1 rounded-[2rem] bg-gradient-to-br from-foreground/10 to-transparent shadow-[0_0_50px_-10px_rgba(71,150,227,0.3)]">
                <div className="relative bg-background/80 backdrop-blur-xl rounded-[1.8rem] p-2 border border-foreground/5">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2 pr-2">
                        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Explain Kubernetes..."
                                className="flex-1 bg-transparent border-none text-lg px-6 py-4 text-foreground placeholder:text-foreground/40 focus:ring-0 outline-none w-full"
                                disabled={loading}
                            />
                            {/* Hidden separate style input for now, or just append to prompt? 
                                User asked for input from user for visual analogy.
                                Let's add a small secondary input.
                            */}
                            <div className="h-8 w-[1px] bg-foreground/10 hidden md:block" />
                            <input
                                type="text"
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                                placeholder="Style (e.g. LOTR)"
                                className="w-full md:w-48 bg-transparent border-none text-sm px-4 py-2 text-gemini-secondary placeholder:text-foreground/20 focus:ring-0 outline-none"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="p-4 rounded-2xl bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            ) : (
                                <ArrowRight className="w-6 h-6" />
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
                {["GCP Architecture", "YouTube: https://youtu.be/kOa_llowQ1E", "Book: Clean Architecture", "Rust Borrow Checker"].map((suggestion) => (
                    <button
                        key={suggestion}
                        onClick={() => { setInput(suggestion); onSubmit(suggestion); }}
                        className="px-4 py-2 rounded-full bg-foreground/5 border border-foreground/5 hover:bg-foreground/10 text-sm text-foreground/40 transition-colors"
                    >
                        {suggestion.startsWith("https") ? "Video Dissection" : suggestion}
                    </button>
                ))}
            </div>
        </motion.div>
    );
}
