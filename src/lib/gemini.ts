import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Robust LLM Wrapper for VersaArch AI (Gemini 3 Hackathon Edition)
 * Implements: Pro -> Flash -> Mock fallback logic.
 */
export async function generateWithFallback(options: {
    agentName: string;
    systemInstruction: string;
    userPrompt: string;
    mockResponse: unknown;
    isJson?: boolean;
    useThinking?: boolean;
}) {
    const { agentName, systemInstruction, userPrompt, mockResponse, isJson = true, useThinking = false } = options;

    if (!process.env.GEMINI_API_KEY) {
        console.warn(`[Agent ${agentName}] No API Key. Falling back to MOCK.`);
        return mockResponse;
    }

    // Modern Gemini 3 Model IDs (Action Era)
    const modelStack = [
        "gemini-3-pro-preview", // Primary: 1M Context, Advanced Reasoning
        "gemini-3-flash-preview" // Fallback: Speed Optimized
    ];

    for (const modelId of modelStack) {
        try {
            console.log(`[Agent ${agentName}] Attempting ${modelId}...`);
            const model = genAI.getGenerativeModel({
                model: modelId,
                systemInstruction: systemInstruction,
            });

            const generationConfig: Record<string, unknown> = {
                temperature: 0.7,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
            };

            // Marathon Agent: Thinking Signatures & Levels
            if (useThinking) {
                generationConfig.thinkingConfig = {
                    includeThoughts: true,
                    budgetTokens: 8000
                };
            }

            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: userPrompt }] }],
                generationConfig
            });

            const responseText = result.response.text();

            if (isJson) {
                const cleanJson = responseText.replace(/```json|```/g, "").trim();
                try {
                    return JSON.parse(cleanJson);
                } catch {
                    console.error(`[Agent ${agentName}] JSON Parse failed for ${modelId}. Response:`, responseText.substring(0, 100));
                    throw new Error("Invalid JSON response from model");
                }
            }

            return responseText;
        } catch (error) {
            console.error(`[Agent ${agentName}] ${modelId} failed:`, error instanceof Error ? error.message : String(error));
            // Continue to next model in stack
        }
    }

    console.warn(`[Agent ${agentName}] All models failed. Falling back to MOCK.`);
    return mockResponse;
}
