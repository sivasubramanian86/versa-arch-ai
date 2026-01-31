/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { LearningState } from "@/types/learning-state";
// Removed unused icons
import {
    Network, Sparkles, CheckSquare, BookOpen,
    FileText, BrainCircuit, ExternalLink, Video,
    Library, LayoutPanelTop, Play
} from "lucide-react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import clsx from "clsx";

interface LearningCanvasProps {
    state: LearningState;
}

type Tab = "diagram" | "analogy" | "cheat_sheet" | "memory_map" | "quiz" | "sources" | "resources" | "infographic" | "flashcards";

export function LearningCanvas({ state }: LearningCanvasProps) {
    const [activeTab, setActiveTab] = useState<Tab>("diagram");

    const tabs = [
        { id: "diagram", label: "System Diagram", icon: Network },
        { id: "infographic", label: "Infographic", icon: LayoutPanelTop },
        { id: "analogy", label: "Analogy", icon: Sparkles },
        { id: "cheat_sheet", label: "Cheat Sheet", icon: FileText },
        { id: "flashcards", label: "Flashcards", icon: Play },
        { id: "memory_map", label: "Mental Map", icon: BrainCircuit },
        { id: "quiz", label: "Quick Check", icon: CheckSquare },
        { id: "resources", label: "Resources", icon: Library },
        { id: "sources", label: "Sources", icon: BookOpen },
    ] as const;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
            {/* Main Canvas (Diagram or current focus) */}
            <div className="lg:col-span-2 glass-panel flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center gap-2 p-2 border-b border-foreground/5 bg-background/50 backdrop-blur-md overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                                    isActive
                                        ? "bg-gemini-primary/20 text-gemini-primary ring-1 ring-gemini-primary/50"
                                        : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Content Area */}
                <div className="flex-1 relative bg-background/50">
                    {activeTab === "diagram" && state.diagram_json && (
                        <DiagramView data={state.diagram_json} />
                    )}

                    {activeTab === "infographic" && (
                        <InfographicView state={state} />
                    )}

                    {activeTab === "analogy" && (
                        <AnalogyView state={state} />
                    )}

                    {activeTab === "cheat_sheet" && (
                        <CheatSheetView state={state} />
                    )}

                    {activeTab === "flashcards" && (
                        <FlashcardView state={state} />
                    )}

                    {activeTab === "memory_map" && (
                        <MemoryMapView state={state} />
                    )}

                    {activeTab === "quiz" && (
                        <QuizView state={state} />
                    )}

                    {activeTab === "resources" && (
                        <ResourcesView state={state} />
                    )}

                    {activeTab === "sources" && (
                        <SourcesView state={state} />
                    )}

                    {!state.diagram_json && activeTab === "diagram" && (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            No diagram available.
                        </div>
                    )}
                </div>
            </div>

            {/* Side Rail (Details / Context) */}
            <div className="glass-panel p-6 overflow-y-auto no-scrollbar bg-foreground/5">
                <h4 className="text-sm font-semibold text-foreground/40 uppercase tracking-wider mb-4">
                    Learning Path
                </h4>
                <div className="relative border-l border-foreground/10 ml-3 space-y-8">
                    {state.personalized_path?.learning_sequence?.map((step, i) => (
                        <div key={i} className="relative pl-6">
                            <div className={clsx(
                                "absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-background",
                                i === 0 ? "bg-gemini-primary" : "bg-foreground/20"
                            )} />
                            <p className={clsx(
                                "text-sm font-medium",
                                i === 0 ? "text-foreground" : "text-foreground/40"
                            )}>
                                {step}
                            </p>
                            {i === 0 && (
                                <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] bg-gemini-primary/10 text-gemini-primary border border-gemini-primary/20 line-clamp-1">
                                    Current Focus
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function DiagramView({ data }: { data: any }) {
    return (
        <ReactFlow
            nodes={data.nodes}
            edges={data.edges}
            fitView
            proOptions={{ hideAttribution: true }}
            className="bg-background"
        >
            <Background gap={20} size={1} />
            <Controls className="!bg-background !border-foreground/10 !fill-foreground/40" />
        </ReactFlow>
    );
}

function AnalogyView({ state }: { state: LearningState }) {
    const content = state.analogy_content;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="text-purple-400" />
                    Analogy Mode
                </h3>
                {content ? (
                    <div className="space-y-6">
                        <p className="text-xl font-medium text-foreground">{content.analogy}</p>
                        <p className="text-lg text-foreground/80 leading-relaxed">{content.explanation}</p>
                    </div>
                ) : (
                    <p className="text-lg text-foreground/80 leading-relaxed">
                        &quot;Think of {state.personalized_path?.recommended_topic || "this concept"} like a city traffic system...&quot;
                        <br />
                        <span className="text-sm text-foreground/40 mt-2 block">(No specific analogy generated for this session)</span>
                    </p>
                )}
            </div>
        </div>
    )
}

function FlashcardView({ state }: { state: LearningState }) {
    const flashcards = state.flashcards || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    if (flashcards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-foreground/40">
                <Play className="w-12 h-12 mb-4 opacity-20" />
                <p>No flashcards generated for this topic.</p>
            </div>
        );
    }

    const currentCard = flashcards[currentIndex];

    return (
        <div className="p-8 flex flex-col items-center justify-center h-full max-w-2xl mx-auto">
            <div className="w-full flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Play className="w-5 h-5 text-gemini-primary" />
                    Review Cards
                </h3>
                <span className="text-sm text-foreground/40 font-mono">
                    {currentIndex + 1} / {flashcards.length}
                </span>
            </div>

            <div
                className="w-full aspect-[4/3] relative perspective-1000 group cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className={clsx(
                    "w-full h-full transition-all duration-500 preserve-3d relative",
                    isFlipped ? "rotate-y-180" : ""
                )}>
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden flex items-center justify-center p-12 text-center rounded-[2rem] bg-foreground/5 border border-foreground/10 shadow-xl backdrop-blur-sm overflow-y-auto no-scrollbar">
                        <p className="text-2xl font-medium text-foreground leading-relaxed">
                            {currentCard.front}
                        </p>
                        <div className="absolute bottom-6 text-xs text-foreground/40 uppercase tracking-widest">
                            Click to reveal answer
                        </div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center p-12 text-center rounded-[2rem] bg-gemini-primary/10 border border-gemini-primary/30 shadow-2xl backdrop-blur-md overflow-y-auto no-scrollbar">
                        <p className="text-2xl font-medium text-gemini-primary leading-relaxed">
                            {currentCard.back}
                        </p>
                        <div className="absolute bottom-6 text-xs text-gemini-primary/60 uppercase tracking-widest">
                            Answer
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mt-12 w-full">
                <button
                    disabled={currentIndex === 0}
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(i => i - 1); setIsFlipped(false); }}
                    className="flex-1 py-4 rounded-2xl bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 text-foreground font-medium transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    disabled={currentIndex === flashcards.length - 1}
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(i => i + 1); setIsFlipped(false); }}
                    className="flex-1 py-4 rounded-2xl bg-gemini-primary text-white font-medium hover:bg-gemini-primary/80 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-lg shadow-gemini-primary/20"
                >
                    Next Card
                </button>
            </div>
        </div>
    )
}

function CheatSheetView({ state }: { state: LearningState }) {
    const items = state.cheat_sheet || ["No cheat sheet available."];
    return (
        <div className="p-8 max-w-3xl mx-auto overflow-y-auto h-full">
            <h3 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                <FileText className="w-6 h-6 text-gemini-secondary" />
                Cheat Sheet
            </h3>
            <div className="space-y-4">
                {items.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-colors">
                        <span className="text-gemini-secondary font-bold text-lg">{i + 1}.</span>
                        {/* Simple markdown rendering by replacing **bold** */}
                        <p className="text-lg text-foreground/80 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

function MemoryMapView({ state }: { state: LearningState }) {
    // Simulating a "Video" or animated recall view using CSS animations
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gemini-secondary/20 via-transparent to-transparent animate-pulse" />

            <h3 className="text-2xl font-bold mb-8 relative z-10 text-foreground">Mental Recall Map</h3>

            <div className="relative z-10 grid gap-8 max-w-2xl w-full">
                {state.personalized_path?.learning_sequence?.slice(0, 4).map((step, i) => (
                    <div
                        key={i}
                        className="p-6 rounded-2xl bg-background border border-foreground/10 backdrop-blur-xl shadow-xl transform transition-all duration-1000"
                        style={{
                            animation: `fade-in-up 0.5s ease-out ${i * 1.5}s backwards`, // Staggered animation
                        }}
                    >
                        <div className="text-sm text-foreground/40 uppercase tracking-widest mb-1">Step {i + 1}</div>
                        <div className="text-xl font-medium text-foreground">{step}</div>
                    </div>
                ))}
            </div>

            <button className="mt-12 px-6 py-3 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground font-medium transition-colors flex items-center gap-2 relative z-10">
                <BrainCircuit className="w-5 h-5" />
                Replay Visualization
            </button>
        </div>
    )
}

function QuizView({ state }: { state: LearningState }) {
    const quiz = state.competency_assessment?.micro_quiz;

    if (!quiz || quiz.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-foreground/40">
                <Play className="w-12 h-12 mb-4 opacity-10" />
                <p>No micro-quiz generated for this session.</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto overflow-y-auto h-full">
            <h3 className="text-xl font-bold mb-6">Quick Check</h3>
            <div className="space-y-6">
                {quiz.map((q, i) => (
                    <div key={i} className="p-6 rounded-xl bg-foreground/5 border border-foreground/10">
                        <div className="flex items-center justify-between mb-4">
                            <span className="px-2 py-1 rounded text-xs font-bold bg-foreground/10 text-foreground/60 uppercase">
                                {q.type}
                            </span>
                            <span className="text-foreground/40 text-xs">Question {i + 1}</span>
                        </div>
                        <p className="text-lg font-medium text-foreground/80 mb-6">{q.question}</p>
                        <div className="space-y-3">
                            {q.options.map((opt) => (
                                <button
                                    key={opt}
                                    className={clsx(
                                        "w-full text-left px-4 py-3 rounded-lg border transition-all text-sm",
                                        state.competency_assessment
                                            ? opt === q.answer
                                                ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-300"
                                                : "bg-foreground/5 border-foreground/5 text-foreground/40 hover:bg-foreground/10"
                                            : ""
                                    )}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 p-3 rounded bg-blue-500/10 border border-blue-500/20 text-sm text-blue-600 dark:text-blue-200">
                            <strong>Explanation:</strong> {q.explanation}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function ResourcesView({ state }: { state: LearningState }) {
    const resources = state.external_resources || [];

    return (
        <div className="p-8 max-w-4xl mx-auto overflow-y-auto h-full">
            <h3 className="text-2xl font-bold mb-8 text-foreground flex items-center gap-2">
                <Library className="w-6 h-6 text-gemini-primary" />
                Learning Resources
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.map((res, i) => (
                    <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-6 rounded-2xl bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:border-gemini-primary/30 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-xl bg-gemini-primary/10 text-gemini-primary">
                                {res.type === "course" && <Library className="w-6 h-6" />}
                                {res.type === "video" && <Video className="w-6 h-6" />}
                                {res.type === "book" && <BookOpen className="w-6 h-6" />}
                                {res.type === "link" && <ExternalLink className="w-6 h-6" />}
                            </div>
                            <ExternalLink className="w-5 h-5 text-foreground/20 group-hover:text-gemini-primary transition-colors" />
                        </div>
                        <h4 className="text-lg font-bold text-foreground mb-2">{res.title}</h4>
                        <p className="text-sm text-foreground/60 line-clamp-2 mb-4">{res.description}</p>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gemini-secondary">
                            {res.provider || res.type}
                        </div>
                    </a>
                ))}

                {resources.length === 0 && (
                    <div className="col-span-full py-20 text-center opacity-50">
                        <Play className="w-12 h-12 mx-auto mb-4 text-foreground/40" />
                        <p className="text-foreground/40">Searching for high-quality courses and materials...</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function InfographicView({ state }: { state: LearningState }) {
    const summary = state.feedback_guidance?.summary_bullets || ["Decomposing system architecture...", "Mapping core dependencies...", "Optimizing learning flow..."];

    return (
        <div className="p-8 h-full flex items-center justify-center">
            <div className="max-w-xl w-full aspect-video rounded-3xl bg-gradient-to-br from-gemini-primary/20 via-foreground/5 to-gemini-secondary/20 p-1">
                <div className="w-full h-full bg-background rounded-[22px] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gemini-primary/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gemini-secondary/10 blur-3xl translate-x-1/2 translate-y-1/2" />

                    <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gemini-primary to-gemini-secondary mb-8">
                        {state.personalized_path?.recommended_topic || "Concept Overview"}
                    </h3>

                    <div className="grid gap-4 w-full">
                        {summary.map((point, i) => (
                            <div
                                key={point}
                                className="flex items-center gap-4 text-left p-4 rounded-xl bg-foreground/5 border border-foreground/10 animate-fade-in"
                                style={{ animationDelay: `${i * 200}ms` }}
                            >
                                <div className="w-2 h-2 rounded-full bg-gemini-primary shrink-0" />
                                <p className="text-lg text-foreground/80 font-medium">{point}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex items-center gap-6 text-foreground/20 text-sm font-mono uppercase tracking-[0.2em]">
                        <span>Infographic Mode</span>
                        <div className="w-1 h-1 rounded-full bg-foreground/10" />
                        <span>v1.0.4</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SourcesView({ state }: { state: LearningState }) {
    const knowledge = state.retrieved_knowledge || [];

    return (
        <div className="p-8 max-w-3xl mx-auto overflow-y-auto h-full">
            <h3 className="text-xl font-bold mb-6">Retrieved Context</h3>
            <div className="grid gap-4">
                {knowledge.map((k, i) => (
                    <div key={i} className="p-4 rounded-xl bg-foreground/5 border border-foreground/5 hover:border-gemini-primary/30 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono text-gemini-primary">{k.source}</span>
                            <span className="text-xs text-foreground/40">{(k.credibility * 100).toFixed(0)}% credible</span>
                        </div>
                        <p className="text-sm text-foreground/80">{k.explanation}</p>
                    </div>
                ))}
                {knowledge.length === 0 && (
                    <div className="py-20 text-center text-foreground/40">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-10" />
                        <p>No external sources required for this explanation.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
