import { LearningState } from "@/types/learning-state";
import { generateWithFallback } from "@/lib/gemini";

export async function agent_e_knowledge_manager(state: LearningState): Promise<Partial<LearningState>> {
    console.log("Agent E: Retrieving and Synthesizing Knowledge with Gemini 3...");

    const topic = state.personalized_path?.recommended_topic || state.learner_input;

    // Simulate retrieval pool
    const knowledgePool = state.source_context
        ? [state.source_context]
        : [
            "VersaArch AI uses a Multi-Agent system to decompose learning goals.",
            "Gemini 3 Pro features 1M token context window and advanced multimodal reasoning.",
            "LangGraph enables complex cycles and state management in agentic workflows."
        ];

    const systemInstruction = `
            You are the Knowledge Manager Agent. Your job is to take raw retrieval data
            and synthesize it into a clean, structured knowledge object for the learner.

            Output STRICT JSON:
            {
              "concept": "Name of concept",
              "explanation": "Deep reasoning and explanation...",
              "source": "Source name",
              "credibility": 0-1
            }
            `;

    const userPrompt = `Synthesize knowledge for: "${topic}"\nRaw Context: ${knowledgePool.join("\n")}`;

    const mockResponse = {
        concept: topic,
        explanation: "Knowledge synthesized from multiple internal sources.",
        source: "Antigravity Knowledge Graph",
        credibility: 0.9
    };

    try {
        const parsed = await generateWithFallback({
            agentName: "E (Knowledge)",
            systemInstruction,
            userPrompt,
            mockResponse
        });

        const formattedKnowledge = [{
            concept: parsed.concept || topic,
            explanation: parsed.explanation || "No explanation provided.",
            source: parsed.source || "Unknown",
            credibility: parsed.credibility || 0.5,
            last_updated: new Date().toISOString()
        }];

        return {
            retrieved_knowledge: formattedKnowledge,
            routing_log: [
                ...state.routing_log,
                {
                    agent: "E",
                    decision: "Knowledge Synthesized",
                    details: `Used ${knowledgePool.length} raw sources`,
                    timestamp: new Date().toISOString()
                }
            ]
        };
    } catch (error) {
        console.error("Agent E Error:", error);
        return {
            retrieved_knowledge: [
                {
                    concept: topic,
                    explanation: "Fallback knowledge provided due to synthesis error.",
                    source: "System Cache",
                    credibility: 0.5,
                    last_updated: new Date().toISOString()
                }
            ]
        };
    }
}
