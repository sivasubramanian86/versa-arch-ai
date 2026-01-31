import { LearningState } from "@/types/learning-state";
import { generateWithFallback } from "@/lib/gemini";

export async function agent_f_evaluator(state: LearningState): Promise<Partial<LearningState>> {
    console.log("Agent F: Evaluating Competency with Gemini 3 Fallback...");

    const systemInstruction = `
            You are the Evaluator Agent. Your job is to assess the learner's competency
            WITHOUT traditional quizzes. Analyze their input, questions, and interaction
            to determine their depth of understanding.

            Output STRICT JSON:
            {
              "current_score": 0-100,
              "confidence_level": 0-1,
              "mastery_indicators": ["Applied concept X", "Asked insightful question about Y"],
              "gaps_detected": ["Misunderstands Z", "Needs more practice with A"],
              "micro_quiz": [
                  {
                      "type": "mcq",
                      "question": "Quick check...",
                      "options": ["A", "B", "C"],
                      "answer": "B",
                      "explanation": "Why B is correct"
                  }
              ]
            }
            `;

    const userPrompt = `
        Learner Input: ${state.learner_input}
        Current Context: ${state.personalized_path?.recommended_topic || "General"}
        Retrieved Knowledge Used: ${state.retrieved_knowledge?.map(k => k.concept).join(", ") || "None"}

        Assess competency and generate a micro-quiz.
        `;

    const mockResponse = {
        current_score: 75,
        confidence_level: 0.7,
        mastery_indicators: ["Engaged with topic"],
        gaps_detected: ["Further depth needed"],
        micro_quiz: [{
            type: "mcq" as const,
            question: "Explain the main component.",
            options: ["A", "B"],
            answer: "A",
            explanation: "Default explanation."
        }]
    };

    try {
        const parsed = await generateWithFallback({
            agentName: "F (Evaluator)",
            systemInstruction,
            userPrompt,
            mockResponse,
            useThinking: true
        }) as Record<string, unknown>;

        // Fix: Explicitly cast and validate micro_quiz types to satisfy TS interfaces
        let finalizedQuiz = undefined;
        if (parsed.micro_quiz && Array.isArray(parsed.micro_quiz)) {
            finalizedQuiz = (parsed.micro_quiz as Record<string, unknown>[]).map((q) => ({
                question: String(q.question ?? ""),
                options: Array.isArray(q.options) ? q.options.map(String) : [],
                answer: String(q.answer ?? ""),
                explanation: String(q.explanation ?? ""),
                type: (["mcq", "trap", "scenario"].includes(String(q.type)) ? q.type : "mcq") as "mcq" | "trap" | "scenario"
            }));
        }

        const assessment = {
            current_score: Number(parsed.current_score ?? 0),
            confidence_level: Number(parsed.confidence_level ?? 0),
            mastery_indicators: Array.isArray(parsed.mastery_indicators) ? parsed.mastery_indicators.map(String) : [],
            gaps_detected: Array.isArray(parsed.gaps_detected) ? parsed.gaps_detected.map(String) : [],
            micro_quiz: finalizedQuiz
        };

        return {
            competency_assessment: assessment,
            routing_log: [
                ...state.routing_log,
                {
                    agent: "F",
                    decision: "Competency Evaluated",
                    details: `Score: ${assessment.current_score}`,
                    timestamp: new Date().toISOString()
                }
            ]
        };
    } catch (error) {
        console.error("Agent F Error:", error);
        return {
            competency_assessment: mockResponse
        };
    }
}
