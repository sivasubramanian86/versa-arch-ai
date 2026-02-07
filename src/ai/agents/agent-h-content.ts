import { LearningState, ExternalResource } from "@/types/learning-state";
import { generateWithFallback } from "@/lib/gemini";

export async function agent_h_content_generator(state: LearningState): Promise<Partial<LearningState>> {
    console.log("Agent H: Generating Educational Content (Flashcards, Cheat Sheets)...");

    const topic = state.personalized_path?.recommended_topic || state.learner_input;
    const context = state.retrieved_knowledge?.map(k => `${k.concept}: ${k.explanation}`).join("\n") || "";

    const systemInstruction = `
            You are the Educational Content Generator Agent. 
            Your goal is to create study aids based on the provided topic and context.

            Output STRICT JSON:
            {
              "flashcards": [
                {"front": "Question/Term", "back": "Answer/Definition"}
              ],
              "cheat_sheet": [
                "Key bullet point 1",
                "Key bullet point 2"
              ],
              "analogy_content": {
                "analogy": "The analogy statement...",
                "explanation": "Why this analogy works..."
              },
              "external_resources": [
                {
                  "type": "link",
                  "title": "Resource Title",
                  "url": "https://example.com",
                  "description": "Description"
                }
              ]
            }
            `;

    const isDeepen = state.detected_intent === "DEEPEN";
    const userPrompt = `
        Topic: ${topic}
        Context: ${context}
        Learner Level: ${state.learner_profile.skill_level}
        Intent: ${state.detected_intent}
        
        ${isDeepen
            ? "Generate 3-5 NEW/ADVANCED flashcards, a detailed cheat sheet, and a complex analogy (different from previous if any)."
            : "Generate 3-5 flashcards, a 5-point cheat sheet, and 1 strong analogy."}
        `;

    const mockResponse = {
        flashcards: [
            { front: "What is " + topic + "?", back: "It is a complex system..." },
            { front: "Key Component", back: "The central node..." }
        ],
        cheat_sheet: ["Point 1", "Point 2", "Point 3"],
        analogy_content: {
            analogy: `${topic} is like a city.`,
            explanation: "It has infrastructure, traffic, and governance."
        },
        external_resources: [
            { type: "link", title: "Official Documentation", url: "https://cloud.google.com", description: "Learn more here." }
        ] as ExternalResource[]
    };

    try {
        const parsed = await generateWithFallback({
            agentName: "H (Content)",
            systemInstruction,
            userPrompt,
            mockResponse,
            useThinking: true
        });

        return {
            flashcards: parsed.flashcards,
            cheat_sheet: parsed.cheat_sheet,
            analogy_content: parsed.analogy_content,
            external_resources: parsed.external_resources,
            routing_log: [
                ...state.routing_log,
                {
                    agent: "H",
                    decision: "Content Generated",
                    details: `Generated ${parsed.flashcards?.length} cards`,
                    timestamp: new Date().toISOString()
                }
            ]
        };
    } catch (error) {
        console.error("Agent H Error:", error);
        return {
            ...mockResponse,
            routing_log: [
                ...state.routing_log,
                {
                    agent: "H",
                    decision: "Failed (Fallback)",
                    details: String(error),
                    timestamp: new Date().toISOString()
                }
            ]
        };
    }
}
