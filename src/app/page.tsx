/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import { useState, Suspense } from "react";
import { runLearningGraph } from "@/app/actions";
import { LearningState } from "@/types/learning-state";
import { AppHeader } from "@/components/ui/app-header";
import { HeroSection } from "@/components/ui/hero-section";
import { LearningSummary } from "@/components/ui/learning-summary";
import { LearningCanvas } from "@/components/ui/learning-canvas";

import { readStreamableValue } from "@ai-sdk/rsc";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [learningState, setLearningState] = useState<LearningState | null>(null);
  const [currentAgent, setCurrentAgent] = useState<{ agent: string; status: string } | null>(null);

  const handleSubmit = async (input: string) => {
    setLoading(true);
    setError(null);
    setLearningState(null);
    setCurrentAgent({ agent: "Initializing", status: "Starting" });

    try {
      // Mock profile for now/demo
      const profile = {
        skill_level: 50,
        learning_style: "visual",
        pace: "standard",
        time_budget: 15,
        goal: "Understand concept",
        learning_history: [],
        knowledge_gaps: [],
        preferred_analogies: ["tech", "everyday"],
      };

      const { progress } = await runLearningGraph(input, profile);

      for await (const chunk of readStreamableValue(progress)) {
        const data = chunk as any;
        if (data) {
          if (data.finalState) {
            setLearningState(data.finalState as LearningState);
            setLoading(false);
            setCurrentAgent(null);
          } else {
            setCurrentAgent({ agent: data.agent, status: data.status });

            // Progressive Rendering Logic:
            // If partial state is present (e.g. flashcards ready), merge it immediately
            if (data.partialState) {
              setLearningState(prev => {
                // Initialize empty if null
                const current = prev || {} as LearningState;
                return {
                  ...current,
                  ...data.partialState,
                  // Deep merge specific arrays if needed, but simple spread is usually fine for these distinct keys
                };
              });
            }
          }
        }
      }

    } catch (error: any) {
      console.error("Error", error);
      setError(error.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleLoadMore = async (feature: string) => {
    if (!learningState) return;

    // We don't set loading=true for the whole page, maybe just a local indicator? 
    // Or we do set loading but keep the UI visible (which is handled by {learningState && ...})
    // Let's set currentAgent to show activity
    setLoading(true);
    setCurrentAgent({ agent: "Starting Update...", status: "Requesting" });

    try {
      const { progress } = await runLearningGraph(
        feature === "infographic" ? `Generate visual infographic for ${learningState.learner_input}` : `Deepen understanding of ${feature} for ${learningState.learner_input}`,
        learningState.learner_profile,
        learningState // Pass current state as context
      );

      for await (const chunk of readStreamableValue(progress)) {
        const data = chunk as any;
        if (data) {
          if (data.finalState) {
            setLearningState(data.finalState as LearningState);
            setLoading(false);
            setCurrentAgent(null);
          } else {
            setCurrentAgent({ agent: data.agent, status: data.status });
            if (data.partialState) {
              setLearningState(prev => {
                const current = prev || {} as LearningState;
                return { ...current, ...data.partialState };
              });
            }
          }
        }
      }
    } catch (e) {
      console.error("Load More Failed", e);
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

        {loading && currentAgent && (
          <div className={`flex flex-col items-center justify-center animate-fade-in ${learningState ? 'py-4 opacity-75' : 'py-20'}`}>
            <div className={`w-64 h-2 bg-secondary rounded-full overflow-hidden relative mb-6 ${learningState ? 'scale-75' : ''}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-gemini-primary to-gemini-secondary animate-pulse-width" style={{ width: '100%' }} />
              <div className="absolute inset-0 bg-white/20 animate-shimmer" />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gemini-primary animate-ping" />
              <p className={learningState ? "text-lg font-light text-foreground/70" : "text-xl font-light text-foreground/90"}>
                {currentAgent.agent}
              </p>
            </div>
            <p className="text-sm text-foreground/50 mt-2 font-mono uppercase tracking-widest">{currentAgent.status}</p>

            {!learningState && (
              <div className="flex gap-2 mt-8 text-xs text-foreground/30 font-mono">
                <span className={currentAgent.agent.includes("Intent") ? "text-gemini-primary font-bold" : ""}>INTENT</span>
                <span>→</span>
                <span className={currentAgent.agent.includes("Knowledge") ? "text-gemini-primary font-bold" : ""}>CTX</span>
                <span>→</span>
                <span className={currentAgent.agent.includes("Study") ? "text-gemini-primary font-bold" : ""}>GEN</span>
                <span>→</span>
                <span className={currentAgent.agent.includes("Visualizing") ? "text-gemini-primary font-bold" : ""}>VIS</span>
                <span>→</span>
                <span className={currentAgent.agent.includes("Feedback") ? "text-gemini-primary font-bold" : ""}>REV</span>
              </div>
            )}
          </div>
        )}

        {learningState && (
          <div className="animate-fade-in space-y-8">
            <LearningSummary state={learningState} />
            <LearningCanvas
              state={learningState}
              onLoadMore={handleLoadMore}
              loading={loading}
            />
          </div>
        )}
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 inset-x-0 h-10 bg-background/80 backdrop-blur-md border-t border-foreground/5 flex items-center justify-between px-6 text-[10px] text-foreground/40 z-50">
        <div className="flex items-center gap-4">
          <span>Powered by Gemini 3.0 Flash Thinking</span>
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
