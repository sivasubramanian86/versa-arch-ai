import { LearningState } from "@/types/learning-state";
import { generateWithFallback } from "@/lib/gemini";

export async function agent_d_concept_scaffolder(state: LearningState): Promise<Partial<LearningState>> {
    console.log("Agent D: Scaffolding Concepts with Gemini 3 Fallback...");

    const topic = state.personalized_path?.recommended_topic || state.learner_input;

    const systemInstruction = `
            You are the Concept Scaffolder Agent. Your job is to break down a complex topic
            into a hierarchical dependency tree of prerequisites.

            Output STRICT JSON:
            {
              "primary_concept": "The main topic",
              "prerequisites": ["Concept A", "Concept B"],
              "dependency_tree": {
                 "Concept A": ["Sub-concept 1", "Sub-concept 2"],
                 "Concept B": []
              }
            }
            `;

    const userPrompt = `
        Learner Input: ${state.learner_input}
        Topic to Scaffold: ${topic}
        Learner Level: ${state.learner_profile.skill_level}

        Break this down into manageable scaffolding.
        `;

    const mockResponse = {
        primary_concept: topic,
        prerequisites: ["Core Foundations", "Implementation Details"],
        dependency_tree: { "Core Foundations": ["Basic Syntax", "Environment Setup"] }
    };

    try {
        const parsed = await generateWithFallback({
            agentName: "D (Scaffolder)",
            systemInstruction,
            userPrompt,
            mockResponse,
            useThinking: true
        });

        return {
            concept_prerequisites: parsed,
            routing_log: [
                ...state.routing_log,
                {
                    agent: "D",
                    decision: "Scaffolding Generated",
                    details: `${parsed.prerequisites?.length || 0} prerequisites found`,
                    timestamp: new Date().toISOString()
                }
            ]
        };
    } catch (error) {
        console.error("Agent D Error:", error);
        return {
            concept_prerequisites: mockResponse
        };
    }
}
