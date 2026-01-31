
import { LearningState } from "@/types/learning-state";
import { generateWithFallback } from "@/lib/gemini";

export async function agent_h6_quiz(state: LearningState): Promise<Partial<LearningState>> {
    console.log("Agent H6: Generating Practice Quiz...");
    const topic = state.personalized_path?.recommended_topic || state.learner_input;

    const systemInstruction = `
        You are the Quiz Generator. Create 3 practice questions.
        Output STRICT JSON: 
        { 
          "practice_quiz": [
             { "question": "string", "options": ["a", "b"], "answer": "a", "explanation": "string", "type": "mcq" }
          ]
        }
    `;
    const userPrompt = `Topic: ${topic}.`;

    const mock = {
        practice_quiz: [{
            question: "Sample Q?",
            options: ["Yes", "No"],
            answer: "Yes",
            explanation: "Because.",
            type: "mcq"
        }]
    };

    try {
        const parsed = await generateWithFallback({ agentName: "H6", systemInstruction, userPrompt, mockResponse: mock });
        // @ts-ignore
        return { practice_quiz: parsed.practice_quiz };
    } catch (e) {
        // @ts-ignore
        return { practice_quiz: mock.practice_quiz };
    }
}
