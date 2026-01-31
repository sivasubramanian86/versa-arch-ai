import { LearningState } from "@/types/learning-state";
import { generateWithFallback } from "@/lib/gemini";

export async function agent_h8_mnemonic(state: LearningState): Promise<Partial<LearningState>> {
    console.log("[Agent H8] Generating Mnemonics...");

    const topic = state.personalized_path?.recommended_topic || state.learner_input;

    const systemInstruction = `
            You are the Mnemonic Maestro. Your job is to create creative, memorable mnemonics 
            (acronyms, phrases, or associations) to help users remember complex concepts.
            
            Output STRICT JSON:
            {
              "mnemonics": [
                { "phrase": "PHRASE1", "expansion": "Expansion of phrase 1", "tip": "Brief memory tip" },
                { "phrase": "PHRASE2", "expansion": "Expansion of phrase 2", "tip": "Brief memory tip" }
              ]
            }
            
            Rules:
            1. Create 1-3 mnemonics.
            2. For acronyms, use ALL CAPS for the phrase.
            3. Make them fun and relatable.
            `;

    const userPrompt = `Create mnemonics for: "${topic}"\nContext: ${state.memory_context}`;

    const mockResponse = {
        mnemonics: [
            {
                phrase: "MOCK",
                expansion: "Memory Optimized Creative Knowledge",
                tip: "Think of this as a default fallback."
            }
        ]
    };

    try {
        const parsed = await generateWithFallback({
            agentName: "H8 (Mnemonic)",
            systemInstruction,
            userPrompt,
            mockResponse
        });

        return {
            mnemonics: parsed.mnemonics
        };
    } catch (error) {
        console.error("Agent H8 Error:", error);
        return {
            mnemonics: []
        };
    }
}
