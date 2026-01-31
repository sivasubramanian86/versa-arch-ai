import { LearningState } from "@/types/learning-state";
import { generateWithFallback } from "@/lib/gemini";

export async function agent_g_feedback_engine(state: LearningState): Promise<Partial<LearningState>> {
    console.log("Agent G: Generating Feedback with Gemini 3 Fallback...");

    const systemInstruction = `
            You are the Feedback Engine. Your goal is to provide EMPATHETIC, actionable
            feedback. Do not just say "Good job". Explain WHY it was good and guide
            them to the next step.

            If source_context is provided, summarize the key takeaways from THAT SPECIFIC SOURCE (video/book) rather than general knowledge.

            Output STRICT JSON:
            {
              "encouragement": "Warm, specific praise...",
              "next_topic": "The logical next step...",
              "time_estimate": minutes,
              "misconceptions_corrected": ["Clarification 1", ...],
              "summary_bullets": ["Key point 1", "Key point 2", "Key point 3"],
              "difficulty_label": "Beginner | Intermediate | Advanced"
            }
            `;

    const userPrompt = `
        Learner Profile: ${JSON.stringify(state.learner_profile)}
        Competency Assessment: ${JSON.stringify(state.competency_assessment)}
        Source Context Present: ${!!state.source_context}
        `;

    const mockResponse = {
        encouragement: "Great work! You've shown strong progress.",
        next_topic: "Advanced Architectural Patterns",
        time_estimate: 15,
        misconceptions_corrected: [],
        summary_bullets: ["Continuous integration", "System decomposition"],
        difficulty_label: "Intermediate"
    };

    try {
        const parsed = await generateWithFallback({
            agentName: "G (Feedback)",
            systemInstruction,
            userPrompt,
            mockResponse,
            useThinking: true
        });

        return {
            feedback_guidance: parsed,
            routing_log: [
                ...state.routing_log,
                {
                    agent: "G",
                    decision: "Feedback Generated",
                    timestamp: new Date().toISOString()
                }
            ],
            final_output: parsed
        };
    } catch (error) {
        console.error("Agent G Error:", error);
        return {
            feedback_guidance: mockResponse,
            final_output: mockResponse
        };
    }
}
