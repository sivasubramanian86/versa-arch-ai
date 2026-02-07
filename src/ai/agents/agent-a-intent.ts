import { LearningState } from "@/types/learning-state";
import { generateWithFallback } from "@/lib/gemini";

function determine_activated_agents(intent: string, input: string = ""): string[] {
    const lowerInput = input.toLowerCase();

    // Fine-grained activation for DEEPEN/VISUALIZE to prevent global streaming
    if (intent === "VISUALIZE") {
        if (lowerInput.includes("infographic")) return ["h7_infographic"];
        if (lowerInput.includes("diagram")) return ["visualizer"];
        return ["visualizer", "h7_infographic"]; // Evaluator -> Feedback chained downstream
    }

    if (intent === "DEEPEN") {
        const specificAgents = [];
        if (lowerInput.includes("analogy")) specificAgents.push("h1_analogy");
        if (lowerInput.includes("flashcards") || lowerInput.includes("cards")) specificAgents.push("h2_flashcards");
        if (lowerInput.includes("cheat") || lowerInput.includes("sheet")) specificAgents.push("h3_cheatsheet");
        if (lowerInput.includes("resource")) specificAgents.push("h4_resources");
        if (lowerInput.includes("pareto") || lowerInput.includes("80/20")) specificAgents.push("h5_pareto");
        if (lowerInput.includes("quiz")) specificAgents.push("h6_quiz");
        if (lowerInput.includes("mnemonic")) specificAgents.push("h8_mnemonic");

        if (specificAgents.length > 0) return [...specificAgents]; // Feedback chained downstream

        // Default DEEPEN (All Content)
        return ["h1_analogy", "h2_flashcards", "h3_cheatsheet", "h4_resources", "h5_pareto", "h6_quiz", "h7_infographic", "h8_mnemonic"];
    }

    switch (intent) {
        case "UNDERSTAND":
            // Return only parallel content agents. Evaluator and Feedback are chained downstream in graph.ts
            return ["scaffolder", "knowledge_manager", "personalization", "visualizer", "h1_analogy", "h2_flashcards", "h3_cheatsheet", "h4_resources", "h5_pareto", "h6_quiz", "h7_infographic", "h8_mnemonic"];
        case "EVALUATE": return ["evaluator"]; // Feedback is downstream of evaluator
        case "SCAFFOLD": return ["scaffolder", "personalization"]; // Feedback downstream
        case "FIND_GAP": return ["evaluator", "personalization"]; // Feedback downstream
        case "DISSECT": return ["knowledge_manager", "visualizer", "h5_pareto", "evaluator"]; // Feedback downstream
        case "DEEPEN":
            // Only return content agents found in the input, or all of them. 
            // Logic handled above in determining specificAgents, just ensure feedback isn't added there.
            // Wait, the logic above (lines 14-28) adds "feedback". I need to fix that too.
            return ["h1_analogy", "h2_flashcards", "h3_cheatsheet", "h4_resources", "h5_pareto", "h6_quiz", "h7_infographic", "h8_mnemonic"];
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

        // Manual override for specific features to prevent global re-runs
        let finalIntent = validIntents.includes(intentValue) ? intentValue : "UNDERSTAND";

        if (state.learner_input.toLowerCase().includes("infographic")) finalIntent = "VISUALIZE";
        if (state.learner_input.toLowerCase().includes("deepen")) finalIntent = "DEEPEN";
        if (state.learner_input.toLowerCase().includes("quiz")) finalIntent = "EVALUATE";

        return {
            detected_intent: finalIntent as "VISUALIZE" | "UNDERSTAND" | "EVALUATE" | "SCAFFOLD" | "FIND_GAP" | "DISSECT",
            intent_confidence: Number(parsed.confidence || 0.5),
            activated_agents: determine_activated_agents(finalIntent, state.learner_input),
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
            // Fallback: Return everything EXCEPT infographic to avoid auto-generation in error states
            activated_agents: ["scaffolder", "knowledge_manager", "personalization", "visualizer", "h1_analogy", "h2_flashcards", "h3_cheatsheet", "h4_resources", "h5_pareto", "h6_quiz", "h8_mnemonic", "feedback"]
        };
    }
}
