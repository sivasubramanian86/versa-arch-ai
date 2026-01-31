
import { LearningState } from "@/types/learning-state";
import { generateWithFallback } from "@/lib/gemini";

export async function agent_h3_cheatsheet(state: LearningState): Promise<Partial<LearningState>> {
    console.log("Agent H3: Generating Cheat Sheet...");
    const topic = state.personalized_path?.recommended_topic || state.learner_input;

    const systemInstruction = `
        You are the Cheat Sheet Generator. Create key takeaways.
        Output STRICT JSON: { "cheat_sheet": ["Point 1", "Point 2"] }
    `;
    const userPrompt = `Topic: ${topic}. Level: ${state.learner_profile.skill_level}.`;

    const mock = { cheat_sheet: ["Key Concept 1", "Key Concept 2"] };

    try {
        const parsed = await generateWithFallback({ agentName: "H3", systemInstruction, userPrompt, mockResponse: mock });
        return { cheat_sheet: parsed.cheat_sheet };
    } catch (e) { return { cheat_sheet: mock.cheat_sheet }; }
}
