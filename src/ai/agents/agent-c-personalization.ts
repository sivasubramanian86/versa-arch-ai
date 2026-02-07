import { LearningState } from "@/types/learning-state";
import { generateWithFallback } from "@/lib/gemini";

export async function agent_c_personalization_engine(state: LearningState): Promise<Partial<LearningState>> {
    console.log("Agent C: Personalizing Path with Gemini 3 Fallback...");

    // const topic = state.learner_input;

    const systemInstruction = `
            You are the Personalization Engine. Your job is to recommend a learning path
            that respects:
            1. Learner's current skill level (0-100)
            2. Preferred learning style (visual, verbal, kinesthetic, mixed)
            3. Available time
            4. Past learning history and knowledge gaps
            5. Domain-specific learning outcomes

            Output STRICT JSON:
            {
              "recommended_topic": "string",
              "difficulty_level": number (1-10),
              "estimated_duration": number (minutes),
              "traditional_duration_estimate": number (minutes, usually 2-3x AI duration),
              "learning_sequence": ["topic 1", "topic 2", ...],
              "personalization_rationale": "Why this path?",
              "time_saved_rationale": "How Versa Arch AI optimized this"
            }
            `;

    const userPrompt = `
        Learner Profile:
        - Skill Level: ${state.learner_profile.skill_level}/100
        - Learning Style: ${state.learner_profile.learning_style}
        - Available Time: ${state.learner_profile.time_budget} minutes
        - Domain: ${state.domain}
        - Learning History: ${JSON.stringify(state.learner_profile.learning_history)}
        - Knowledge Gaps: ${state.learner_profile.knowledge_gaps.join(", ")}

        Current Learner Input: ${state.learner_input}

        Recommend a personalized learning path.
        `;

    const mockResponse = {
        recommended_topic: state.learner_input,
        difficulty_level: 5,
        estimated_duration: 30,
        traditional_duration_estimate: 90,
        learning_sequence: ["Basics", "Advanced"],
        personalization_rationale: "Default path due to API limit.",
        time_saved_rationale: "AI focuses on core architectural bottlenecks."
    };

    try {
        const parsed = await generateWithFallback({
            agentName: "C (Personalization)",
            systemInstruction,
            userPrompt,
            mockResponse,
            useThinking: true
        });

        return {
            personalized_path: parsed,
            routing_log: [
                ...state.routing_log,
                {
                    agent: "C",
                    decision: "Path Generated",
                    details: parsed.personalization_rationale,
                    timestamp: new Date().toISOString()
                }
            ]
        };

    } catch (error) {
        console.error("Agent C Error:", error);
        return {
            personalized_path: mockResponse
        };
    }
}
