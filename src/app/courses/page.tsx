"use client";

import React from "react";
import { AppHeader } from "@/components/ui/app-header";
import { CourseCard } from "@/components/ui/course-card";
import {
    Network,
    Code2,
    Cloud,
    Cpu,
    Database,
    BrainCircuit,
    Zap
} from "lucide-react";
import { motion } from "framer-motion";

export default function CoursesPage() {
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
            description: "Build multi-agent systems using Gemini and LangChain. Learn how to manage intent and feedback loops.",
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
        <div className="min-h-screen bg-background text-foreground selection:bg-gemini-primary/30">
            <AppHeader />

            <main className="relative z-10 max-w-7xl mx-auto px-4 pb-20 pt-24">
                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-gemini-primary font-mono text-sm uppercase tracking-widest mb-4"
                    >
                        <Network className="w-4 h-4" />
                        Course Directory
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
                    >
                        Learn systems, <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gemini-primary to-gemini-secondary">not just syntax.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-foreground/60 max-w-2xl leading-relaxed"
                    >
                        Browse our collection of agent-powered courses. Each course is uniquely generated
                        and personalized to your learning style in real-time.
                    </motion.p>
                </div>

                <section className="mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredCourses.map((course, i) => (
                            <motion.div
                                key={course.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
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
                                transition={{ delay: 0.6 + i * 0.1 }}
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
            </main>

            {/* Ambient gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-gemini-primary/5 blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gemini-secondary/5 blur-[150px]" />
            </div>
        </div>
    );
}
