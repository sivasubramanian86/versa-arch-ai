import { LearningState } from "@/types/learning-state";
import { generateWithFallback } from "@/lib/gemini";

export async function agent_b_visualizer(state: LearningState): Promise<Partial<LearningState>> {
    console.log("Agent B: Generating Visualization (Speed Optimized)...");

    const topic = state.personalized_path?.recommended_topic || state.learner_input;

    const systemInstruction = `
            You are the Visualizer Agent. Your job is to generate a React Flow node diagram
            to visually explain a concept.

            Output STRICT JSON with this structure:
            {
              "nodes": [
                { "id": "1", "type": "input", "data": { "label": "Main Concept" }, "position": { "x": 250, "y": 0 } },
                { "id": "2", "data": { "label": "Sub Concept" }, "position": { "x": 100, "y": 100 } }
              ],
              "edges": [
                { "id": "e1-2", "source": "1", "target": "2", "animated": true, "label": "includes" }
              ]
            }

            Rules:
            1. Use a clear hierarchical layout (Top-down).
            2. Limit to 5-10 nodes max for clarity.
            3. Use short labels.
            4. "animated": true for active flows.
            5. "label" on edges explains the relationship.
            `;

    const userPrompt = `Visualize this concept for a ${state.learner_profile?.learning_style || "visual"} learner: "${topic}"`;

    const mockResponse = {
        nodes: [
            { id: '1', type: 'input', data: { label: topic }, position: { x: 250, y: 0 } },
            { id: '2', data: { label: 'Concept Overview' }, position: { x: 250, y: 150 } }
        ],
        edges: [{ id: 'e1-2', source: '1', target: '2', animated: true, label: 'visualizing...' }]
    };

    try {
        const parsed = await generateWithFallback({
            agentName: "B (Visualizer)",
            systemInstruction,
            userPrompt,
            mockResponse
        });

        return {
            diagram_json: parsed,
            routing_log: [
                ...state.routing_log,
                {
                    agent: "B",
                    decision: "Diagram Generated",
                    timestamp: new Date().toISOString()
                }
            ]
        };
    } catch (error) {
        console.error("Agent B Error:", error);
        return {
            diagram_json: {
                nodes: [
                    { id: '1', type: 'input', data: { label: topic }, position: { x: 250, y: 0 } },
                    { id: '2', data: { label: 'Error generating detail' }, position: { x: 250, y: 100 } }
                ],
                edges: [
                    { id: 'e1-2', source: '1', target: '2', animated: true }
                ]
            }
        };
    }
}

export async function agent_c_personalizer(state: LearningState): Promise<Partial<LearningState>> {
    console.log("Agent C: Personalizing Learning Path...");

    const systemInstruction = `
            You are the Personalization Engine. Your job is to tailor the learning content
            to the user's profile and suggest a learning path.

            Output STRICT JSON:
            {
              "recommended_topic": "string",
              "difficulty_level": number (1-10),
              "estimated_duration": number (minutes),
              "learning_sequence": ["topic 1", "topic 2", ...],
              "personalization_rationale": "Why this path?"
            }
            `;

    const userPrompt = `Personalize learning for input: "${state.learner_input}"\nProfile: ${JSON.stringify(state.learner_profile)}`;

    const mockResponse = {
        recommended_topic: state.learner_input,
        difficulty_level: 5,
        estimated_duration: 30,
        learning_sequence: ["Basics", "Advanced"],
        personalization_rationale: "Default path due to API limit."
    };

    try {
        const parsed = await generateWithFallback({
            agentName: "C (Personalization)",
            systemInstruction,
            userPrompt,
            mockResponse
        });

        return {
            personalized_path: parsed,
            routing_log: [
                ...state.routing_log,
                {
                    agent: "C",
                    decision: "Personalized Path Generated",
                    timestamp: new Date().toISOString()
                }
            ]
        };
    } catch (error) {
        console.error("Agent C Error:", error);
        return {
            personalized_path: {
                recommended_topic: state.learner_input,
                difficulty_level: 5,
                estimated_duration: 30,
                traditional_duration_estimate: 90,
                learning_sequence: ["Error: Could not personalize"],
                time_saved_rationale: "Optimized path generated.",
                personalization_rationale: "Failed to generate personalized path."
            }
        };
    }
}
