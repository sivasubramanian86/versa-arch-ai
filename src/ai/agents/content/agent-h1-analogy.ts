
import { LearningState } from "@/types/learning-state";
import { generateWithFallback } from "@/lib/gemini";

export async function agent_h1_analogy(state: LearningState): Promise<Partial<LearningState>> {
    console.log("Agent H1: Generating Analogy...");
    const topic = state.personalized_path?.recommended_topic || state.learner_input;

    const systemInstruction = `
        You are the Analogy Generator. Create a vivid, memorable analogy for the topic.
        Output STRICT JSON: { "analogy_content": { "analogy": "string", "explanation": "string" } }
    `;
    const userPrompt = `Topic: ${topic}. Learner Level: ${state.learner_profile.skill_level}. Intent: ${state.detected_intent}`;

    // Mock
    const mock = { analogy_content: { analogy: `${topic} is like a bridge.`, explanation: "Connects two points." } };

    try {
        const parsed = await generateWithFallback({ agentName: "H1", systemInstruction, userPrompt, mockResponse: mock });
        return { analogy_content: parsed.analogy_content };
    } catch (e) { return { analogy_content: mock.analogy_content }; }
}
