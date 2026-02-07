"use client";

import React from "react";
import { useUIStore } from "@/store/ui-store";
import { CourseCard } from "@/components/ui/course-card";
import {
    Network,
    Code2,
    Cloud,
    Cpu,
    Database,
    BrainCircuit,
    Zap,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CoursesOverlay() {
    const { isCoursesOpen, closeCourses } = useUIStore();

    const featuredCourses = [
        {
            title: "Rust Ownership & Borrowing",
            description: "Master the most challenging part of Rust with interactive diagrams and visual analogies. Learn how the borrow checker ensures memory safety without a garbage collector.",
            duration: "45 min",
            level: "Intermediate",
            rating: 4.9,
            icon: Cpu,
            tags: ["High Performance", "Systems"]
        },
        {
            title: "React State Management 2024",
            description: "Deep dive into modern state patterns. From useState and Context to Zustand and TanStack Query. Visualize how data flows through your component tree.",
            duration: "30 min",
            level: "Beginner",
            rating: 4.8,
            icon: Code2,
            tags: ["Frontend", "React"]
        },
        {
            title: "GCP Architectural Pillars",
            description: "Explore Google Cloud Platform infrastructure. Understand Compute, Storage, and Networking through real-time generated system architecture diagrams.",
            duration: "40 min",
            level: "Advanced",
            rating: 4.7,
            icon: Cloud,
            tags: ["Cloud", "DevOps"]
        }
    ];

    const upcomingCourses = [
        {
            title: "AI Agent Orchestration",
            description: "Build multi-agent systems using Gemini and LangChain. Learn how the borrow checker ensures memory safety without a garbage collector.",
            duration: "60 min",
            level: "Advanced",
            icon: BrainCircuit,
        },
        {
            title: "Edge Database Design",
            description: "Conflict-free replicated data types (CRDTs) and local-first architecture.",
            duration: "50 min",
            level: "Advanced",
            icon: Database,
        },
        {
            title: "Next.js 15 Server Actions",
            description: "The next evolution of the web. Type-safe backend logic within your components.",
            duration: "25 min",
            level: "Intermediate",
            icon: Zap,
        }
    ];

    return (
        <AnimatePresence>
            {isCoursesOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md overflow-y-auto"
                >
                    <div className="max-w-7xl mx-auto px-4 pb-20 pt-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gemini-primary/10 text-gemini-primary">
                                    <Network className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Course Directory</h2>
                                    <p className="text-sm text-foreground/40">Powered by Gemini 3 Architect</p>
                                </div>
                            </div>
                            <button
                                onClick={closeCourses}
                                className="p-3 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                                Learn systems, <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gemini-primary to-gemini-secondary">not just syntax.</span>
                            </h1>
                            <p className="text-lg text-foreground/60 max-w-2xl leading-relaxed mb-12">
                                Browse our collection of agent-powered courses. Each course is uniquely generated
                                and personalized to your learning style in real-time.
                            </p>

                            <section className="mb-20">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {featuredCourses.map((course, i) => (
                                        <motion.div
                                            key={course.title}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + i * 0.1 }}
                                        >
                                            <CourseCard {...course} />
                                        </motion.div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                    <Zap className="text-gemini-accent" />
                                    Upcoming Content
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {upcomingCourses.map((course, i) => (
                                        <motion.div
                                            key={course.title}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + i * 0.1 }}
                                        >
                                            <CourseCard
                                                {...course}
                                                comingSoon
                                                rating={0}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
