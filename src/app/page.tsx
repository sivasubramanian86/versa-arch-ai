/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import { useState, Suspense } from "react";
import { runLearningGraph } from "@/app/actions";
import { LearningState } from "@/types/learning-state";
import { AppHeader } from "@/components/ui/app-header";
import { HeroSection } from "@/components/ui/hero-section";
import { LearningSummary } from "@/components/ui/learning-summary";
import { LearningCanvas } from "@/components/ui/learning-canvas";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [learningState, setLearningState] = useState<LearningState | null>(null);

  const handleSubmit = async (input: string) => {
    setLoading(true);
    setError(null);
    setLearningState(null); // Reset for new session

    try {
      // Mock profile for now/demo
      const profile = {
        skill_level: 50,
        learning_style: "visual",
        pace: "standard",
        time_budget: 15,
        goal: "Understand concept",
        // Add dummy fields to satisfy type if needed, or fallback in backend
        learning_history: [],
        knowledge_gaps: [],
        preferred_analogies: ["tech", "everyday"],
      };

      const result = await runLearningGraph(input, profile);
      setLearningState(result as LearningState);
    } catch (error: any) {
      console.error("Error", error);
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-gemini-primary/30">
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Ambient gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gemini-primary/5 blur-[120px]" />
        <div className="absolute top-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-gemini-secondary/5 blur-[100px]" />
      </div>

      <Suspense fallback={<div className="h-16" />}>
        <AppHeader />
      </Suspense>

      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-20 pt-24">
        <HeroSection onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-200 flex items-center justify-center text-center">
            <p>
              <span className="font-bold">Error:</span> {error}
              <br />
              <span className="text-xs text-red-400 mt-1 block">Check console for details or try again after waiting 60s.</span>
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-16 h-1 bg-gradient-to-r from-gemini-primary to-gemini-secondary rounded-full animate-pulse mb-4" />
            <p className="text-foreground/60 font-medium">Orchestrating agents...</p>
            <div className="flex gap-2 mt-2 text-xs text-foreground/40">
              <span>Intent</span>
              <span>→</span>
              <span>Context</span>
              <span>→</span>
              <span>Diagram</span>
              <span>→</span>
              <span>Critique</span>
            </div>
          </div>
        )}

        {learningState && !loading && (
          <div className="animate-fade-in space-y-8">
            <LearningSummary state={learningState} />
            <LearningCanvas state={learningState} />
          </div>
        )}
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 inset-x-0 h-10 bg-background/80 backdrop-blur-md border-t border-foreground/5 flex items-center justify-between px-6 text-[10px] text-foreground/40 z-50">
        <div className="flex items-center gap-4">
          <span>Powered by Gemini 2.0 Flash Thinking</span>
          <span className="hidden md:inline text-foreground/10">|</span>
          <span className="hidden md:inline">Latency: ~4.2s</span>
        </div>
        <div>
          VersaArch AI v0.9 (Beta)
        </div>
      </footer>
    </div>
  );
}
