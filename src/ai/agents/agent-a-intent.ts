import { LearningState } from "@/types/learning-state";
import { generateWithFallback } from "@/lib/gemini";

function determine_activated_agents(intent: string): string[] {
    switch (intent) {
        case "VISUALIZE": return ["visualizer", "evaluator", "feedback"];
        case "UNDERSTAND": return ["scaffolder", "knowledge_manager", "personalization", "visualizer", "h1_analogy", "h2_flashcards", "h3_cheatsheet", "h4_resources", "h5_pareto", "h6_quiz", "feedback"];
        case "EVALUATE": return ["evaluator", "feedback"];
        case "SCAFFOLD": return ["scaffolder", "personalization", "feedback"];
        case "FIND_GAP": return ["evaluator", "personalization", "feedback"];
        case "DISSECT": return ["knowledge_manager", "visualizer", "evaluator", "h5_pareto", "feedback"];
        case "DEEPEN": return ["h1_analogy", "h2_flashcards", "h3_cheatsheet", "h4_resources", "h5_pareto", "h6_quiz", "feedback"]; // Re-run content
        default: return ["feedback"];
    }
}

export async function agent_a_intent_classifier(state: LearningState): Promise<Partial<LearningState>> {
    console.log("Agent A: Classifying Intent with Extended Thinking...");

    const systemInstruction = `
            You are the Intent Classifier agent. Your job is to analyze learner input 
            and decide what kind of learning help they need.

            Intent categories:
            - VISUALIZE: "Show me", "Design", "Architecture of"
            - UNDERSTAND: "Explain", "What is", "How do"
            - EVALUATE: "Test me", "Quiz", "Am I ready"
            - SCAFFOLD: "How do I learn", "Prerequisite", "Break it down"
            - FIND_GAP: "What should I know", "What am I missing"
            - DISSECT: "Analyze this", "Summarize this video", "Extract from this book", "Map this link"
            - DEEPEN: "More examples", "Give me another analogy", "Load more flashcards", "Deep dive", "Generate infographic", "Visual summary"

            Consider learner's current profile (skill_level, time_budget, learning_style).

            Output STRICT JSON:
            {
              "intent": "VISUALIZE" | "UNDERSTAND" | "EVALUATE" | "SCAFFOLD" | "FIND_GAP" | "DISSECT" | "DEEPEN",
              "confidence": 0.95,
              "reasoning": "Brief explanation..."
            }
            `;

    const userPrompt = `Analysis needed for input: "${state.learner_input}"\nLearner Profile: ${JSON.stringify(state.learner_profile)}`;

    const mockResponse = {
        intent: "UNDERSTAND",
        confidence: 0.8,
        reasoning: "Fallback mock response due to API issues."
    };

    try {
        const parsed = await generateWithFallback({
            agentName: "A (Intent)",
            systemInstruction,
            userPrompt,
            mockResponse,
            useThinking: true
        }) as Record<string, unknown>;

        const intentValue = String(parsed.intent || "UNDERSTAND");
        const validIntents = ["VISUALIZE", "UNDERSTAND", "EVALUATE", "SCAFFOLD", "FIND_GAP", "DISSECT", "DEEPEN"];
        const finalIntent = validIntents.includes(intentValue) ? intentValue : "UNDERSTAND";

        return {
            detected_intent: finalIntent as "VISUALIZE" | "UNDERSTAND" | "EVALUATE" | "SCAFFOLD" | "FIND_GAP" | "DISSECT",
            intent_confidence: Number(parsed.confidence || 0.5),
            activated_agents: determine_activated_agents(finalIntent),
            routing_log: [
                ...state.routing_log,
                {
                    agent: "A",
                    decision: `Intent: ${finalIntent}`,
                    details: String(parsed.reasoning || "No reasoning"),
                    timestamp: new Date().toISOString()
                }
            ]
        };
    } catch (error) {
        console.error("Agent A Error:", error);
        return {
            detected_intent: "UNDERSTAND",
            intent_confidence: 0.5,
            activated_agents: ["scaffolder", "feedback"]
        };
    }
}
