
import { LearningState } from "@/types/learning-state";
import { generateWithFallback } from "@/lib/gemini";

export async function agent_h5_pareto(state: LearningState): Promise<Partial<LearningState>> {
    console.log("Agent H5: Generated Pareto Digest...");
    const topic = state.personalized_path?.recommended_topic || state.learner_input;

    const systemInstruction = `
        You are the Pareto Principle Agent. Identify the 20% of concepts that give 80% of the value.
        Output STRICT JSON: 
        { 
          "pareto_digest": {
            "principle": "The core insight",
            "crucial_20_percent": ["Concept A", "Concept B"],
            "outcome_80_percent": "What you can do with this"
          }
        }
    `;
    const userPrompt = `Topic: ${topic}. Minimize effort, maximize outcome.`;

    const mock = {
        pareto_digest: {
            principle: "Focus on the basics.",
            crucial_20_percent: ["Core Syntax", "Data Flow"],
            outcome_80_percent: "Build 80% of apps."
        }
    };

    try {
        const parsed = await generateWithFallback({ agentName: "H5", systemInstruction, userPrompt, mockResponse: mock });
        return { pareto_digest: parsed.pareto_digest };
    } catch (e) { return { pareto_digest: mock.pareto_digest }; }
}
