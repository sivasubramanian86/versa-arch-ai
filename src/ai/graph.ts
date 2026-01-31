/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
import { StateGraph, END, START } from "@langchain/langgraph";
import { LearningState, LearnerProfile } from "@/types/learning-state";
import {
    agent_a_intent_classifier,
    agent_b_visualizer,
    agent_c_personalization_engine,
    agent_d_concept_scaffolder,
    agent_e_knowledge_manager,
    agent_f_evaluator,
    agent_g_feedback_engine,
} from "./agents";

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

    messages: { value: (x: any[], y: any[]) => (x ?? []).concat(y ?? []), default: () => [] },
    memory_context: { value: (x: string, y: string) => y ?? x, default: () => "" },
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
graph.addNode("personalization", agent_c_personalization_engine as any);
graph.addNode("scaffolder", agent_d_concept_scaffolder as any);
graph.addNode("knowledge_manager", agent_e_knowledge_manager as any);
graph.addNode("evaluator", agent_f_evaluator as any);
graph.addNode("feedback", agent_g_feedback_engine as any);

// Set Entry Point
// @ts-ignore - Valid node name provided
graph.addEdge(START, "intent_classifier");

// Conditional Routing Logic
function routeFromIntent(state: LearningState) {
    const intent = state.detected_intent;

    // Logic matches the Architecture Protocol
    switch (intent) {
        case "VISUALIZE":
            return ["visualizer"]; // Will flow to evaluator -> feedback
        case "UNDERSTAND":
            return ["scaffolder", "knowledge_manager", "personalization"];
        case "EVALUATE":
            return ["evaluator"];
        case "SCAFFOLD":
            return ["scaffolder", "personalization"];
        case "FIND_GAP":
            return ["evaluator", "personalization"];
        case "DISSECT":
            return ["knowledge_manager", "visualizer", "evaluator"];
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
        knowledge_manager: "knowledge_manager",
        personalization: "personalization",
        evaluator: "evaluator",
        feedback: "feedback"
    }
);

// Define downstream flows (Converging on Evaluator/Feedback)

// VISUALIZE Path: intent -> visualizer -> evaluator -> feedback
// @ts-ignore
graph.addEdge("visualizer", "evaluator");

// UNDERSTAND Path: intent -> [scaffolder, km, personalization] -> evaluator -> feedback
// Note: We need to handle synchronization if these run in parallel. 
// For simplicity in this graph definition, we route them all to evaluator.
// @ts-ignore
graph.addEdge("scaffolder", "evaluator");
// @ts-ignore
graph.addEdge("knowledge_manager", "evaluator");
// @ts-ignore
graph.addEdge("personalization", "evaluator");

// EVALUATE Path: intent -> evaluator -> feedback
// @ts-ignore
graph.addEdge("evaluator", "feedback");

// FEEDBACK Path: feedback -> END
// @ts-ignore
graph.addEdge("feedback", END);

// Compile the graph
export const learningGraph = graph.compile();
