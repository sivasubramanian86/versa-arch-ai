"use client";

import React from "react";
import { ArrowRight, Clock, BarChart3, Star } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface CourseCardProps {
    title: string;
    description: string;
    duration: string;
    level: string;
    rating: number;
    icon: React.ElementType;
    comingSoon?: boolean;
    onClick?: () => void;
}

export function CourseCard({
    title,
    description,
    duration,
    level,
    rating,
    icon: Icon,
    comingSoon,
    onClick
}: CourseCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={clsx(
                "group relative p-6 rounded-3xl transition-all duration-300",
                comingSoon
                    ? "bg-foreground/[0.02] border border-foreground/5 cursor-not-allowed opacity-60"
                    : "glass-panel bg-foreground/5 border-foreground/10 cursor-pointer hover:bg-foreground/[0.07] hover:border-gemini-primary/30"
            )}
            onClick={!comingSoon ? onClick : undefined}
        >
            <div className="flex items-start justify-between mb-6">
                <div className={clsx(
                    "p-4 rounded-2xl",
                    comingSoon ? "bg-foreground/5 text-foreground/20" : "bg-gemini-primary/10 text-gemini-primary group-hover:bg-gemini-primary group-hover:text-white transition-colors"
                )}>
                    <Icon className="w-8 h-8" />
                </div>
                {!comingSoon && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gemini-accent/10 text-gemini-accent text-xs font-bold">
                        <Star className="w-3 h-3 fill-current" />
                        {rating}
                    </div>
                )}
            </div>

            <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
            <p className="text-sm text-foreground/60 leading-relaxed mb-8 line-clamp-3">
                {description}
            </p>

            <div className="flex items-center gap-4 text-xs text-foreground/40 font-medium pb-8 border-b border-foreground/5 mb-6">
                <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {duration}
                </div>
                <div className="flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4" />
                    {level}
                </div>
            </div>

            {comingSoon ? (
                <div className="flex items-center justify-center py-2 text-xs font-bold uppercase tracking-widest text-foreground/20">
                    Coming Soon
                </div>
            ) : (
                <div className="flex items-center justify-between text-sm font-bold text-gemini-primary group-hover:translate-x-1 transition-transform">
                    <span>Explore Course</span>
                    <ArrowRight className="w-5 h-5" />
                </div>
            )}
        </motion.div>
    );
}
