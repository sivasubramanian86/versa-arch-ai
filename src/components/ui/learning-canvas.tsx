/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { LearningState } from "@/types/learning-state";
import {
    Library, LayoutPanelTop, Play, Zap, Network, Sparkles, FileText, BrainCircuit, CheckSquare, BookOpen, Video, ExternalLink, Newspaper
} from "lucide-react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import clsx from "clsx";
import { InfographicView } from "./infographic-view";

interface LearningCanvasProps {
    state: LearningState;
    onLoadMore: (feature: string) => void;
    loading?: boolean;
}

type Tab = "diagram" | "analogy" | "cheat_sheet" | "memory_map" | "quiz" | "resources" | "infographic" | "flashcards" | "pareto" | "sources" | "mnemonics" | "study_plan";

export function LearningCanvas({ state, onLoadMore, loading }: LearningCanvasProps) {
    const [activeTab, setActiveTab] = useState<Tab>("diagram");

    const tabs = useMemo(() => [
        { id: "diagram", label: "System Diagram", icon: Network },
        { id: "infographic", label: "Infographic", icon: Sparkles },
        { id: "analogy", label: "Analogy", icon: Newspaper },
        { id: "cheat_sheet", label: "Cheat Sheet", icon: FileText },
        { id: "flashcards", label: "Flashcards", icon: Play },
        { id: "memory_map", label: "Mental Map", icon: BrainCircuit },
        { id: "quiz", label: "Quick Check", icon: CheckSquare },
        { id: "resources", label: "Resources", icon: Library },
        { id: "pareto", label: "Pareto (80/20)", icon: Zap },
        { id: "mnemonics", label: "Mnemonics", icon: BrainCircuit },
        { id: "study_plan", label: "Study Plan", icon: LayoutPanelTop },
        { id: "sources", label: "Sources", icon: BookOpen },
    ] as const, []);

    // Listen for tab switch events from other components
    useMemo(() => {
        if (typeof window !== 'undefined') {
            const handleSwitch = (e: any) => {
                const targetTab = e.detail as Tab;
                if (tabs.some(t => t.id === targetTab)) {
                    setActiveTab(targetTab);
                }
            };
            window.addEventListener('switch-tab', handleSwitch);
            return () => window.removeEventListener('switch-tab', handleSwitch);
        }
    }, [tabs]);

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
                        <InfographicView state={state} onLoadMore={() => onLoadMore("infographic")} loading={loading} />
                    )}

                    {activeTab === "analogy" && (
                        <AnalogyView state={state} onLoadMore={() => onLoadMore("analogy")} />
                    )}

                    {activeTab === "cheat_sheet" && (
                        <CheatSheetView state={state} onLoadMore={() => onLoadMore("cheat_sheet")} />
                    )}

                    {activeTab === "flashcards" && (
                        <FlashcardView state={state} onLoadMore={() => onLoadMore("flashcards")} />
                    )}

                    {activeTab === "memory_map" && (
                        <MemoryMapView state={state} />
                    )}

                    {activeTab === "quiz" && (
                        <QuizView state={state} onLoadMore={() => onLoadMore("quiz")} />
                    )}

                    {activeTab === "resources" && (
                        <ResourcesView state={state} onLoadMore={() => onLoadMore("resources")} />
                    )}

                    {activeTab === "pareto" && (
                        <ParetoView state={state} onLoadMore={() => onLoadMore("pareto")} />
                    )}

                    {activeTab === "mnemonics" && (
                        <MnemonicView state={state} onLoadMore={() => onLoadMore("mnemonics")} />
                    )}

                    {activeTab === "study_plan" && (
                        <StudyPlanView state={state} />
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

// React Flow performance constants
// We define empty but stable objects if no custom nodes/edges are used
const BASE_NODE_TYPES = {};
const BASE_EDGE_TYPES = {};

function DiagramView({ data }: { data: any }) {
    const nodes = useMemo(() => data.nodes || [], [data.nodes]);
    const edges = useMemo(() => {
        const nodeIds = new Set(nodes.map((n: any) => n.id));
        return (data.edges || []).filter((e: any) => nodeIds.has(e.source) && nodeIds.has(e.target));
    }, [data.edges, nodes]);
    // Error #002 Fix: Strictest possible memoization for nodeTypes/edgeTypes
    const nodeTypes = useMemo(() => BASE_NODE_TYPES, []);
    const edgeTypes = useMemo(() => BASE_EDGE_TYPES, []);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
            className="bg-background"
        >
            <Background gap={20} size={1} />
            <Controls className="!bg-background !border-foreground/10 !fill-foreground/40" />
        </ReactFlow>
    );
}

function AnalogyView({ state, onLoadMore }: { state: LearningState, onLoadMore?: (feature: string) => void }) {
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

            <div className="mt-8 flex justify-center">
                <button
                    onClick={() => onLoadMore && onLoadMore("analogy")}
                    className="px-6 py-2 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/60 transition-colors text-sm"
                >
                    Generate New Analogy
                </button>
            </div>
        </div>
    )
}

function FlashcardView({ state, onLoadMore }: { state: LearningState, onLoadMore?: () => void }) {
    const flashcards = state.flashcards || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    if (flashcards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-foreground/40">
                <Play className="w-12 h-12 mb-4 opacity-20" />
                <p>No flashcards generated for this topic.</p>
                <button
                    onClick={() => onLoadMore && onLoadMore()}
                    className="mt-4 px-4 py-2 rounded-lg bg-gemini-primary/10 text-gemini-primary hover:bg-gemini-primary/20 transition-colors"
                >
                    Generate Flashcards
                </button>
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
                    onClick={() => onLoadMore && onLoadMore()}
                    className="px-6 rounded-2xl bg-foreground/5 hover:bg-foreground/10 text-foreground font-medium transition-all"
                >
                    Load More
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

function CheatSheetView({ state, onLoadMore }: { state: LearningState, onLoadMore?: () => void }) {
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
            <div className="mt-8 text-center">
                <button
                    onClick={onLoadMore}
                    className="px-6 py-2 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/60 transition-colors text-sm"
                >
                    Expand Cheat Sheet
                </button>
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

function QuizView({ state, onLoadMore }: { state: LearningState, onLoadMore?: () => void }) {
    const quiz = state.competency_assessment?.micro_quiz;

    if (!quiz || quiz.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-foreground/40">
                <Play className="w-12 h-12 mb-4 opacity-10" />
                <p>No micro-quiz generated for this session.</p>
                <button
                    onClick={() => onLoadMore && onLoadMore()}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-gemini-primary text-background font-bold hover:opacity-90 transition-all shadow-lg shadow-gemini-primary/20"
                >
                    Generate Practice Quiz
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto overflow-y-auto h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Quick Check</h3>
                <button
                    onClick={onLoadMore}
                    className="px-4 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/60 transition-colors text-sm"
                >
                    New Questions
                </button>
            </div>

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

function ResourcesView({ state, onLoadMore }: { state: LearningState, onLoadMore?: () => void }) {
    const resources = state.external_resources || [];

    return (
        <div className="p-8 max-w-4xl mx-auto overflow-y-auto h-full">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Library className="w-6 h-6 text-gemini-primary" />
                    Learning Resources
                </h3>
                <button
                    onClick={onLoadMore}
                    className="px-4 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/60 transition-colors text-sm"
                >
                    Find More
                </button>
            </div>

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
                        <button
                            onClick={onLoadMore}
                            className="mt-4 px-6 py-2 rounded-full bg-gemini-primary text-white hover:bg-gemini-primary/80 transition-colors"
                        >
                            Start Search
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}




function MnemonicView({ state, onLoadMore }: { state: LearningState, onLoadMore?: () => void }) {
    const mnemonics = state.mnemonics || [];

    return (
        <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    Mnemonic Maestro
                </h3>
                <button
                    onClick={onLoadMore}
                    className="px-4 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/60 transition-colors text-sm"
                >
                    Refresh Aids
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mnemonics.map((m, i) => (
                    <div
                        key={i}
                        className="group relative p-8 rounded-[2rem] bg-gradient-to-br from-foreground/[0.02] to-foreground/[0.05] border border-foreground/10 hover:border-yellow-400/30 transition-all hover:scale-[1.02] duration-500 overflow-hidden"
                    >
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 blur-[50px] -translate-x-[-20%] -translate-y-[20%] group-hover:bg-yellow-400/10 transition-colors" />

                        <div className="relative z-10">
                            <div className="text-xs font-mono uppercase tracking-[0.3em] text-foreground/30 mb-4">
                                Mnemonic {i + 1}
                            </div>
                            <h4 className="text-4xl font-black text-yellow-400 mb-4 tracking-tight">
                                {m.phrase}
                            </h4>
                            <p className="text-xl font-medium text-foreground/90 leading-tight mb-6">
                                {m.expansion}
                            </p>
                            {m.tip && (
                                <div className="p-4 rounded-2xl bg-foreground/5 border border-foreground/5 text-sm text-foreground/50 italic flex items-start gap-3">
                                    <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-yellow-400/50" />
                                    {m.tip}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {mnemonics.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-foreground/5 flex items-center justify-center">
                            <Zap className="w-10 h-10 text-foreground/10" />
                        </div>
                        <h4 className="text-xl font-bold text-foreground/40 mb-2">No Mnemonics Yet</h4>
                        <p className="text-foreground/30 mb-8 max-w-xs mx-auto">Let the Mnemonic Maestro craft some sticky memory aids for this topic.</p>
                        <button
                            onClick={onLoadMore}
                            className="px-8 py-3 rounded-full bg-yellow-400 text-black font-bold hover:scale-105 transition-transform shadow-lg shadow-yellow-400/20"
                        >
                            Draft Memory Aids
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
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

function StudyPlanView({ state }: { state: LearningState }) {
    const path = state.personalized_path;
    if (!path) return <div className="p-8 text-center text-foreground/40">Analyzing your study path...</div>;

    const aiTime = path.estimated_duration;
    const tradTime = path.traditional_duration_estimate;
    const timeSaved = tradTime - aiTime;

    return (
        <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h3 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                        <LayoutPanelTop className="w-8 h-8 text-gemini-primary" />
                        AI-Optimized Study Plan
                    </h3>
                    <p className="text-foreground/60">Tailored Roadmap for {path.recommended_topic}</p>
                </div>
            </div>

            {/* Time Saved Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 rounded-[2rem] bg-gemini-primary/10 border border-gemini-primary/20 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-mono uppercase tracking-widest text-gemini-primary/60 mb-2">Traditional Time</span>
                    <span className="text-4xl font-black text-foreground opacity-40">{tradTime}m</span>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-foreground text-background shadow-2xl scale-110 z-10 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-mono uppercase tracking-[0.3em] text-background/50 mb-3">AI Path</span>
                    <span className="text-5xl font-black mb-2">{aiTime}m</span>
                    <div className="px-3 py-1 rounded-full bg-gemini-primary text-white text-[10px] font-bold">OPTIMIZED</div>
                </div>
                <div className="p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-mono uppercase tracking-widest text-emerald-500/60 mb-2">Time Saved</span>
                    <span className="text-4xl font-black text-emerald-500">-{timeSaved}m</span>
                </div>
            </div>

            <div className="p-6 rounded-2xl bg-foreground/[0.02] border border-foreground/5 mb-12 flex items-start gap-4 italic text-foreground/70">
                <Sparkles className="w-5 h-5 text-gemini-primary shrink-0 mt-1" />
                <p>&quot;{path.time_saved_rationale}&quot;</p>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
                <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Network className="w-5 h-5 text-foreground/40" />
                    Learning Sequence
                </h4>
                {path.learning_sequence.map((step, i) => (
                    <div key={i} className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-foreground/5 transition-all">
                        <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center font-black text-foreground/20 group-hover:bg-gemini-primary/20 group-hover:text-gemini-primary transition-colors">
                            {i + 1}
                        </div>
                        <div>
                            <p className="text-lg font-bold text-foreground/80">{step}</p>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs font-mono text-foreground/30 uppercase tracking-widest">Mastery Focus</span>
                                <div className="h-1 w-24 bg-foreground/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gemini-primary animate-pulse"
                                        style={{ width: `${Math.random() * 40 + 40}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ParetoView({ state, onLoadMore }: { state: LearningState, onLoadMore?: () => void }) {
    const data = state.pareto_digest;

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-foreground/40">
                <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                <p>Generating default Pareto Principle analysis...</p>
                <button
                    onClick={() => onLoadMore && onLoadMore()}
                    className="mt-4 px-4 py-2 rounded-lg bg-gemini-primary/10 text-gemini-primary hover:bg-gemini-primary/20 transition-colors"
                >
                    Generate Now
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-3xl mx-auto h-full overflow-y-auto">
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <Sparkles className="text-emerald-500" />
                    The 80/20 Principle
                </h3>
                <p className="text-lg font-medium text-foreground/90">{data.principle}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-foreground/5 border border-foreground/10">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gemini-primary mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gemini-primary" />
                        The Vital Few (20%)
                    </h4>
                    <ul className="space-y-3">
                        {data.crucial_20_percent.map((item, i) => (
                            <li key={i} className="flex gap-3 text-foreground/90 font-medium">
                                <span className="opacity-50">{i + 1}.</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-6 rounded-2xl bg-foreground/5 border border-foreground/10">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-foreground/40 mb-4">
                        The Useful Many (80%) Result
                    </h4>
                    <p className="text-foreground/70 leading-relaxed">
                        {data.outcome_80_percent}
                    </p>
                </div>
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={() => onLoadMore && onLoadMore()}
                    className="px-6 py-2 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/60 transition-colors text-sm"
                >
                    Deepen Analysis
                </button>
            </div>
        </div>
    )
}
