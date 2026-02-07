
import { LearningState } from "@/types/learning-state";
import { generateWithFallback } from "@/lib/gemini";

export async function agent_h2_flashcards(state: LearningState): Promise<Partial<LearningState>> {
    console.log("Agent H2: Generating Flashcards...");
    const topic = state.personalized_path?.recommended_topic || state.learner_input;
    const isDeepen = state.detected_intent === "DEEPEN";

    const systemInstruction = `
        You are the Flashcards Generator. Create 3-5 study cards.
        ${isDeepen ? "Create ADVANCED/NEW cards." : ""}
        Output STRICT JSON: { "flashcards": [{ "front": "string", "back": "string" }] }
    `;
    const userPrompt = `Topic: ${topic}. Level: ${state.learner_profile.skill_level}.`;

    const mock = { flashcards: [{ front: "Mock Q", back: "Mock A" }] };

    try {
        const parsed = await generateWithFallback({ agentName: "H2", systemInstruction, userPrompt, mockResponse: mock });
        return { flashcards: parsed.flashcards };
    } catch { return { flashcards: mock.flashcards }; }
}
