/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { learningGraph } from "@/ai/graph";
import { LearningState } from "@/types/learning-state";
import { MOCK_RESPONSES } from "@/data/mock-responses";
import { extractFromSource } from "@/lib/dissector";

// Server Action to run the graph
export async function runLearningGraph(
    input: string,
    profile: unknown
): Promise<Partial<LearningState>> {

    // Check for source dissection triggers
    const sourceData = await extractFromSource(input);

    const initialState: Partial<LearningState> = {
        learner_input: input,
        learner_profile: profile as any,
        domain: sourceData.text ? sourceData.metadata.title : "Cloud Architecture",
        messages: [{ role: "user", content: input }],
        routing_log: [],
        source_context: sourceData.text || undefined,
        source_metadata: sourceData.text ? sourceData.metadata : undefined
    };

    if (!process.env.GEMINI_API_KEY) {
        console.warn("WARNING: GEMINI_API_KEY is not set. Agents may fail.");
        // Check for mock match
        const mock = MOCK_RESPONSES[input];
        if (mock) {
            // Return a simulated state based on the mock data
            return {
                learner_input: input,
                detected_intent: "UNDERSTAND",
                personalized_path: mock.personalized_path,
                diagram_json: mock.diagram_json || null,
                concept_prerequisites: mock.concept_prerequisites || null,
                cheat_sheet: mock.cheat_sheet,
                analogy_content: mock.analogy_content,
                flashcards: mock.flashcards,
                external_resources: mock.external_resources,
                retrieved_knowledge: mock.retrieved_knowledge || [],
                feedback_guidance: {
                    summary_bullets: mock.cheat_sheet?.slice(0, 3) || ["Explore the core concepts below."],
                    difficulty_label: "Intermediate",
                    encouragement: "Great choice! Let's dive in.",
                    next_topic: "Advanced concepts",
                    time_estimate: 15,
                    misconceptions_corrected: []
                } as any,
                competency_assessment: mock.competency_assessment || null,
                routing_log: []
            } as Partial<LearningState>;
        }
    }

    try {
        const finalState = await learningGraph.invoke(initialState);
        return finalState;
    } catch (error: any) {
        console.error("Graph Execution Error:", error);
        // Return a safe error message to the client
        throw new Error(error.message || "Failed to execute learning agent.");
    }
}
