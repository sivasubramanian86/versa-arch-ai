import { LearningState } from "@/types/learning-state";
import { generateImageSkill } from "@/ai/skills/generate_image";

export async function agent_h7_infographic(state: LearningState) {
    const topic = state.personalized_path?.recommended_topic || "System Architecture";
    const context = state.memory_context || "general technical context";

    console.log(`[Agent H7] Generating Infographic for: ${topic}`);

    // Create a specialized prompt for visual generation
    const visualPrompt = `${topic} explained via ${context}. Flat design, minimalist, educational infographic.`;

    // Use the Skill
    const result = await generateImageSkill(visualPrompt, process.env.GEMINI_API_KEY);

    return {
        infographic: result
    };
}
