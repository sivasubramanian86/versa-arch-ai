/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
import { StateGraph, END, START } from "@langchain/langgraph";
import { LearningState, LearnerProfile } from "@/types/learning-state";
import { agent_a_intent_classifier } from "./agents/agent-a-intent";
import { agent_b_visualizer } from "./agents/agent-b-visualizer";
import { agent_c_personalization_engine } from "./agents/agent-c-personalization";
import { agent_d_concept_scaffolder } from "./agents/agent-d-scaffolder";
import { agent_e_knowledge_manager } from "./agents/agent-e-knowledge";
import { agent_f_evaluator } from "./agents/agent-f-evaluator";
import { agent_g_feedback_engine } from "./agents/agent-g-feedback";
import { agent_h1_analogy } from "./agents/content/agent-h1-analogy";
import { agent_h2_flashcards } from "./agents/content/agent-h2-flashcards";
import { agent_h3_cheatsheet } from "./agents/content/agent-h3-cheatsheet";
import { agent_h4_resources } from "./agents/content/agent-h4-resources";
import { agent_h5_pareto } from "./agents/content/agent-h5-pareto";
import { agent_h6_quiz } from "./agents/content/agent-h6-quiz";
import { agent_h7_infographic } from "./agents/content/agent-h7-infographic";
import { agent_h8_mnemonic } from "./agents/content/agent-h8-mnemonic";

// Define the state channels configuration
// We cast to any to allow the generic reducers to be accepted by the strict StateGraph typing
// while ensuring runtime behavior is correct with proper defaults.
const stateChannels: any = {
    learner_input: { value: (x: string, y: string) => y ?? x, default: () => "" },
    learner_id: { value: (x: string, y: string) => y ?? x, default: () => "" },
    domain: { value: (x: string, y: string) => y ?? x, default: () => "" },
    learner_profile: {
        value: (x: LearnerProfile, y: LearnerProfile) => y ?? x,
        default: () => ({
            skill_level: 0,
            learning_style: "mixed",
            pace: "standard",
            learning_history: [],
            knowledge_gaps: [],
            preferred_analogies: [],
            time_budget: 0
        })
    },

    detected_intent: { value: (x: any, y: any) => y ?? x, default: () => null },
    intent_confidence: { value: (x: number, y: number) => y ?? x, default: () => 0 },
    activated_agents: { value: (x: string[], y: string[]) => y ?? x, default: () => [] },

    diagram_json: { value: (x: any, y: any) => y ?? x, default: () => null },
    personalized_path: { value: (x: any, y: any) => y ?? x, default: () => null },
    concept_prerequisites: { value: (x: any, y: any) => y ?? x, default: () => null },
    retrieved_knowledge: { value: (x: any[], y: any[]) => y ?? x, default: () => [] },
    competency_assessment: { value: (x: any, y: any) => y ?? x, default: () => null },
    feedback_guidance: { value: (x: any, y: any) => y ?? x, default: () => null },

    // Content Channels
    analogy_content: { value: (x: any, y: any) => y ?? x, default: () => null },
    flashcards: { value: (x: any[], y: any[]) => y ?? x, default: () => [] },
    cheat_sheet: { value: (x: string[], y: string[]) => y ?? x, default: () => [] },
    external_resources: { value: (x: any[], y: any[]) => y ?? x, default: () => [] },
    pareto_digest: { value: (x: any, y: any) => y ?? x, default: () => null },
    practice_quiz: { value: (x: any[], y: any[]) => y ?? x, default: () => [] },
    infographic: { value: (x: any, y: any) => y ?? x, default: () => null },
    mnemonics: { value: (x: any[], y: any[]) => y ?? x, default: () => [] },

    messages: { value: (x: any[], y: any[]) => (x ?? []).concat(y ?? []), default: () => [] },
    memory_context: { value: (x: string, y: string) => y ?? x, default: () => "" },
    long_term_memory: { value: (x: any, y: any) => ({ ...x, ...y }), default: () => ({}) }, // New Channel
    routing_log: { value: (x: any[], y: any[]) => (x ?? []).concat(y ?? []), default: () => [] },
    final_output: { value: (x: any, y: any) => y ?? x, default: () => ({}) },

    source_context: { value: (x: string, y: string) => y ?? x, default: () => "" },
    source_metadata: { value: (x: any, y: any) => y ?? x, default: () => null },
};

// Create StateGraph
const graph = new StateGraph<LearningState>({
    channels: stateChannels
});

// Add Nodes (Agents)
// TS might complain about the return type matching the full channel specs, but runtime is fine with Partial
graph.addNode("intent_classifier", agent_a_intent_classifier as any);
graph.addNode("visualizer", agent_b_visualizer as any);
// graph.addNode("personalization", agent_c_personalization_engine as any); // Replaced by batch
// graph.addNode("scaffolder", agent_d_concept_scaffolder as any); // Replaced by batch
// graph.addNode("knowledge_manager", agent_e_knowledge_manager as any); // Replaced by batch

// graph.addNode("batch_understand", agent_batch_understand as any);

// Cognitive Agents (Restored individual nodes for full parallelism)
graph.addNode("personalization", agent_c_personalization_engine as any);
graph.addNode("scaffolder", agent_d_concept_scaffolder as any);
graph.addNode("knowledge_manager", agent_e_knowledge_manager as any);

// Content Agents (Granular)
graph.addNode("h1_analogy", agent_h1_analogy as any);
graph.addNode("h2_flashcards", agent_h2_flashcards as any);
graph.addNode("h3_cheatsheet", agent_h3_cheatsheet as any);
graph.addNode("h4_resources", agent_h4_resources as any);
graph.addNode("h5_pareto", agent_h5_pareto as any);
graph.addNode("h6_quiz", agent_h6_quiz as any);
graph.addNode("h7_infographic", agent_h7_infographic as any);
graph.addNode("h8_mnemonic", agent_h8_mnemonic as any);

graph.addNode("evaluator", agent_f_evaluator as any);
graph.addNode("feedback", agent_g_feedback_engine as any);

// Set Entry Point
// @ts-ignore - Valid node name provided
graph.addEdge(START, "intent_classifier");

// Conditional Routing Logic
export function routeFromIntent(state: LearningState) {
    const intent = state.detected_intent;

    // DYNAMIC ROUTING: If Agent A specified activated agents, use them!
    if (state.activated_agents && state.activated_agents.length > 0) {
        // Filter out "feedback" from parallel execution if it's meant to be sequential, 
        // OR just return the whole list if standard graph lets them run.
        // LangGraph conditional edge returns a list of *Node Names* to run next.
        // We must ensure these names exist in the graph.
        // Note: We filter "feedback" because it's usually wired after the parallel block.
        // But wait, if I return ["h1", "feedback"], they run in parallel?
        // In my graph structure, "feedback" is AFTER the parallel block?
        // Let's check the edges.
        // I have: intent_classifier -> [conditional]
        // And: [parallelNodes] -> evaluator -> feedback
        // So if I return "h1", h1 runs, then h1 -> evaluator -> feedback.
        // If I return "feedback" directly, it runs parallel to h1 ??
        // Actually, if "feedback" is in the list from 'intent_classifier', it runs immediately.
        // But "feedback" is also downstream of "h1".
        // Use case: "Generate just infographic".
        // activated_agents = ["h7_infographic"]
        // route returns ["h7_infographic"].
        // h7 runs. h7 -> evaluator -> feedback.
        // Perfect.

        // What if activated_agents = ["feedback"]? (e.g. just chat)
        // route returns ["feedback"]. feedback runs. feedback -> END.
        // Perfect.

        // So I should return everything EXCEPT "feedback" if "feedback" is also downstream?
        // If I return ["h7", "feedback"], h7 and feedback run parallel.
        // Then h7 -> evaluator -> feedback runs AGAIN.
        // So yes, I should filter "feedback" out of the parallel start list IF there are other nodes.
        const parallelNodes = state.activated_agents.filter(a => a !== "feedback" && a !== "evaluator");
        if (parallelNodes.length > 0) {
            return parallelNodes;
        }
        // If only feedback/evaluator is left, return them.
        return state.activated_agents;
    }

    // Fallback (Logic matches the Architecture Protocol)
    switch (intent) {
        case "VISUALIZE":
            return ["visualizer", "h7_infographic"]; // Will flow to evaluator -> feedback
        case "UNDERSTAND":
            return [
                "scaffolder", "personalization", "knowledge_manager", // Cognitive
                "visualizer", // Visual
                "h1_analogy", "h2_flashcards", "h3_cheatsheet", "h4_resources", "h5_pareto", "h6_quiz", "h8_mnemonic", "h7_infographic" // Content
            ];
        case "EVALUATE":
            return ["evaluator"];
        case "SCAFFOLD":
            return ["scaffolder", "personalization"];
        case "FIND_GAP":
            return ["evaluator", "personalization"];
        case "DISSECT":
            return ["knowledge_manager", "visualizer", "evaluator", "h5_pareto"];
        case "DEEPEN":
            return ["h1_analogy", "h2_flashcards", "h3_cheatsheet", "h4_resources", "h5_pareto", "h6_quiz", "h7_infographic", "h8_mnemonic"];
        default:
            return ["feedback"]; // Fallback
    }
}

// Add conditional edges from Intent Classifier
graph.addConditionalEdges(
    // @ts-ignore
    "intent_classifier",
    routeFromIntent,
    {
        visualizer: "visualizer",
        scaffolder: "scaffolder",
        personalization: "personalization",
        knowledge_manager: "knowledge_manager",
        h1_analogy: "h1_analogy",
        h2_flashcards: "h2_flashcards",
        h3_cheatsheet: "h3_cheatsheet",
        h4_resources: "h4_resources",
        h5_pareto: "h5_pareto",
        h6_quiz: "h6_quiz",
        h7_infographic: "h7_infographic",
        h8_mnemonic: "h8_mnemonic",
        evaluator: "evaluator",
        feedback: "feedback"
    }
);

// Define downstream flows
// We allow all agents to run in parallel and stream their results independently.
// The client aggregates the state.

// Visualizer Path: intent -> visualizer -> evaluator -> feedback
// @ts-ignore
graph.addEdge("visualizer", "evaluator");

// Evaluator -> Feedback
// @ts-ignore
graph.addEdge("evaluator", "feedback");

// Feedback -> END
// @ts-ignore
graph.addEdge("feedback", END);

// Parallel Content Nodes
const parallelNodes = [
    "scaffolder", "personalization", "knowledge_manager",
    "h1_analogy", "h2_flashcards", "h3_cheatsheet", "h4_resources", "h5_pareto", "h6_quiz", "h8_mnemonic", "h7_infographic"
];

parallelNodes.forEach(node => {
    // @ts-ignore
    graph.addEdge(node, "evaluator");
});

// Compile the graph
export const learningGraph = graph.compile();
