"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useThemeStore } from "@/store/theme-store";
import { Sparkles, Moon, Sun, Menu, HelpCircle, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AppHeader() {
    const { theme, toggle } = useThemeStore();
    const [mounted, setMounted] = useState(false);
    const [currentPath, setCurrentPath] = useState("");
    const [faqOpen, setFaqOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        setCurrentPath(window.location.pathname);
    }, []);

    const routes = [
        { name: "Playground", path: "/" },
        { name: "Courses", path: "/courses" },
        { name: "Feedback", path: "/feedback" },
    ];

    const faqs = [
        { q: "What is VersaArch AI?", a: "A multi-agent learning platform that uses specialized Gemini 3 agents to decompose, visualize, and teach complex architectural systems." },
        { q: "Which models are used?", a: "We exclusively use Gemini 3 Pro (Primary) and Gemini 3 Flash (Fallback) to ensure 100% adherence to hackathon guidelines." },
        { q: "What is 'Google Antigravity'?", a: "Antigravity is the agentic orchestration engine powering our 'Vibe Engineering' track, enabling autonomous source dissection." },
        { q: "How do I use 'Source Dissection'?", a: "Paste a YouTube link or use 'Book: Title' in the prompt. Our agents will extract the transcript/context and build a mental map." },
        { q: "Is this just a wrapper?", a: "No. It implements a 7-agent cycle using LangGraph, with specialized reasoning loops for intent, visualization, and competency assessment." }
    ];

    return (
        <>
            <header className="fixed top-0 inset-x-0 z-50 border-b border-foreground/5 bg-background/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gemini-primary to-gemini-secondary flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(71,150,227,0.4)] transition-transform group-hover:scale-110">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-gemini-primary">
                            VersaArch <span className="text-gemini-primary">AI</span>
                        </span>
                    </Link>

                    {/* Nav Links (Desktop) */}
                    <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
                        {routes.map((route) => (
                            <Link
                                key={route.path}
                                href={route.path}
                                className={`transition-colors ${currentPath === route.path
                                    ? "text-gemini-primary font-bold"
                                    : "text-foreground/60 hover:text-foreground"
                                    }`}
                            >
                                {route.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setFaqOpen(true)}
                            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/60 transition-all border border-foreground/5"
                        >
                            <HelpCircle className="w-4 h-4" />
                            <span className="text-xs font-semibold">FAQ</span>
                        </button>

                        <button
                            onClick={toggle}
                            className="p-2 rounded-full hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-colors"
                        >
                            {mounted && (theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
                        </button>

                        <button className="md:hidden p-2 text-foreground/60">
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gemini-primary/5 border border-gemini-primary/20">
                            <div className="w-2 h-2 rounded-full bg-gemini-success animate-pulse" />
                            <span className="text-xs text-gemini-primary font-mono font-bold">GEMINI 3 PRO</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* FAQ Slide-over */}
            <AnimatePresence>
                {faqOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setFaqOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md bg-background border-l border-foreground/10 shadow-2xl p-8 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold">Platform FAQ</h2>
                                    <p className="text-xs text-foreground/40">Powered by Gemini 3 reasoning engine</p>
                                </div>
                                <button
                                    onClick={() => setFaqOpen(false)}
                                    className="p-2 rounded-full hover:bg-foreground/10 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="group p-4 rounded-2xl bg-foreground/5 border border-transparent hover:border-gemini-primary/30 hover:bg-gemini-primary/5 transition-all">
                                        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2 group-hover:text-gemini-primary">
                                            <ChevronRight className="w-4 h-4 text-gemini-primary group-hover:translate-x-1 transition-transform" />
                                            {faq.q}
                                        </h3>
                                        <p className="text-sm text-foreground/60 leading-relaxed group-hover:text-foreground/80 transition-colors">
                                            {faq.a}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-gemini-primary/10 via-gemini-secondary/10 to-transparent border border-gemini-primary/20 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gemini-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <h4 className="text-sm font-bold text-gemini-primary uppercase tracking-widest mb-2 relative z-10">Gemini 3 Hackathon Entry</h4>
                                <p className="text-xs text-foreground/60 mb-4 relative z-10">
                                    This platform is designed to push the boundaries of <strong>multimodal reasoning</strong> and <strong>autonomous learning orchestration</strong> using the Gemini 3 API stack.
                                </p>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase text-foreground/40 font-bold">Primary</span>
                                        <span className="text-xs font-mono font-bold text-gemini-primary">gemini-3-pro</span>
                                    </div>
                                    <div className="w-px h-6 bg-foreground/10" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase text-foreground/40 font-bold">Fallback</span>
                                        <span className="text-xs font-mono font-bold text-gemini-secondary">gemini-3-flash</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
