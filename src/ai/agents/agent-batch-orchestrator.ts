import { LearningState } from "@/types/learning-state";
import { agent_d_concept_scaffolder } from "./agent-d-scaffolder";
import { agent_c_personalization_engine } from "./agent-c-personalization";
import { agent_e_knowledge_manager } from "./agent-e-knowledge";

// Batch Orchestrator utilizing A2A (Agent-to-Agent) concurrency
export async function agent_batch_understand(state: LearningState): Promise<Partial<LearningState>> {
    console.log("Agent Orchestrator: Running 'Understand' Suite (Scaffolder, Personalizer, Knowledge) in Parallel...");

    try {
        // Execute agents concurrently to minimize latency (ADK Pattern)
        const [scaffoldState, personalState, knowledgeState] = await Promise.all([
            agent_d_concept_scaffolder(state),
            agent_c_personalization_engine(state),
            agent_e_knowledge_manager(state)
        ]);

        console.log("Agent Orchestrator: Batch complete. Merging states...");

        // deep merge or spread
        return {
            ...scaffoldState,
            ...personalState,
            ...knowledgeState,
            routing_log: [
                ...state.routing_log,
                ...(scaffoldState.routing_log || []),
                ...(personalState.routing_log || []),
                ...(knowledgeState.routing_log || []),
                {
                    agent: "Orchestrator",
                    decision: "Batch Execution Complete",
                    timestamp: new Date().toISOString()
                }
            ]
        };
    } catch (error) {
        console.error("Batch Orchestrator Failed:", error);
        return {
            routing_log: [
                ...state.routing_log,
                {
                    agent: "Orchestrator",
                    decision: "Batch Failed",
                    details: String(error),
                    timestamp: new Date().toISOString()
                }
            ]
        };
    }
}
