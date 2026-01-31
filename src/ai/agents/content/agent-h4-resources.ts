
import { LearningState } from "@/types/learning-state";
import { generateWithFallback } from "@/lib/gemini";

export async function agent_h4_resources(state: LearningState): Promise<Partial<LearningState>> {
    console.log("Agent H4: Curating Resources...");
    const topic = state.personalized_path?.recommended_topic || state.learner_input;

    const systemInstruction = `
        You are the Resource Curator. Suggest 2-3 links/books.
        Output STRICT JSON: { "external_resources": [{ "type": "link", "title": "string", "url": "string", "description": "string" }] }
    `;
    const userPrompt = `Topic: ${topic}.`;

    const mock = { external_resources: [{ type: "link", title: "Docs", url: "https://example.com", description: "Ref" }] };

    try {
        const parsed = await generateWithFallback({ agentName: "H4", systemInstruction, userPrompt, mockResponse: mock });
        // @ts-ignore
        return { external_resources: parsed.external_resources };
    } catch (e) {
        // @ts-ignore
        return { external_resources: mock.external_resources };
    }
}
