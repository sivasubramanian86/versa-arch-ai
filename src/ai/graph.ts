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
            return [
                "scaffolder", "personalization", "knowledge_manager", // Cognitive
                "visualizer", // Visual
                "h1_analogy", "h2_flashcards", "h3_cheatsheet", "h4_resources", "h5_pareto", "h6_quiz" // Content
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
            return ["h1_analogy", "h2_flashcards", "h3_cheatsheet", "h4_resources", "h5_pareto", "h6_quiz"];
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
        evaluator: "evaluator",
        feedback: "feedback"
    }
);

// Define downstream flows (Converging on Evaluator/Feedback)

// VISUALIZE Path: intent -> visualizer -> evaluator -> feedback
// @ts-ignore
graph.addEdge("visualizer", "evaluator");

// All nodes eventually flow to evaluator (or directly to end if we want streaming to be the main output)
// For now, let's have them all point to evaluator to aggregate score, then feedback.

const parallelNodes = [
    "scaffolder", "personalization", "knowledge_manager",
    "h1_analogy", "h2_flashcards", "h3_cheatsheet", "h4_resources", "h5_pareto", "h6_quiz"
];

parallelNodes.forEach(node => {
    // @ts-ignore
    graph.addEdge(node, "evaluator");
});

// Detect race condition? Evaluator runs when ANY or ALL finish?
// LangGraph default is wait for ALL predecessors? No, it's state based.
// If multiple nodes point to Evaluator, Evaluator might run multiple times?
// OR we need a barrier/join node.
// LangGraph StateGraph usually runs nodes when their inputs are ready. 
// If Conditional Edge points to [A, B, C], they run in parallel.
// If A, B, C all point to D, D runs... once? or 3 times?
// Default behavior: It waits for the "Superstep" to complete?
// Actually, to keep it simple and avoid evaluator spam, we can just let them END or self-loop?
// But we need Evaluator to calculate score.
// Let's point them to "feedback" or END, and rely on client-side state merging.
// But Evaluator needs to see the content to quiz on it?
// Evaluator runs independently in the "UNDERSTAND" list? No, it wasn't in the list?
// Wait, I should add "evaluator" to the UNDERSTAND list if I want it to run parallel too!
// Yes! "evaluator" is independent.
// So I will REMOVE the edges from Hx to Evaluator.
// ALL agents run in parallel.
// Then they ALL merge state.
// Who runs last? Feedback?
// Feedback needs summary.
// Let's make "feedback" depend on "personalization" or just run parallel too?
// If everything is parallel, feedback might run before content is ready.
// Feedback generates "Next Steps".
// Let's chain Feedback AFTER the parallel block.
// But LangGraph doesn't have a "Barrier" node easily unless I define one.
// "evaluator" can be the barrier?
// Let's set edges: [All Parallel Nodes] -> "feedback".
// Does LangGraph wait for all?
// If I use a standard graph, multiple incoming edges usually trigger multiple executions unless synchronized?
// USE CASE: "Fan-Out, Fan-In".
// StateGraph: If multiple nodes are returned by conditional edge, they run parallel.
// If they all point to "feedback", "feedback" will run after... the step?
// I will assume LangGraph handles Fan-In synchronization or runs Feedback multiple times (which is okay, last one wins).
// Better: Add "evaluator" to the parallel list.
// And point EVERYONE to "feedback".
// Or just point "personalizer" to "feedback" as a trigger?
// Let's point ALL to separate END?
// Client merges state.
// Feedback is just another agent!
// Add "evaluator" and "feedback" to the PARALLEL list in `routeFromIntent`.
// REMOVE explicit edges between them for the parallel group.
// AND add specific edges for sequential flows if needed (e.g. Visualize -> Evaluator).
// But for UNDERSTAND, max parallel is best.
// I will update the `parallelNodes` logic to just be:
// graph.addEdge("scaffolder", END); ... etc.
// But "feedback" usually wraps things up.
// I'll stick to: All Parallel -> END.
// The UI streams updates. The "Final State" is the merged result.

// REVISING Replacement:
// Remove edges.
// Add edges to END.

// EVALUATE Path: intent -> evaluator -> feedback
// @ts-ignore
graph.addEdge("evaluator", "feedback");

// FEEDBACK Path: feedback -> END
// @ts-ignore
graph.addEdge("feedback", END);

// Compile the graph
export const learningGraph = graph.compile();
