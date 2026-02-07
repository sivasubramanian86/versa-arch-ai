
import { describe, it, expect } from 'vitest';
import { agent_h_content_generator } from '@/ai/agents/agent-h-content';
import { LearningState } from '@/types/learning-state';

describe('Agent H: Content Generator', () => {
    it('should generate flashcards, cheat sheet, and analogy', async () => {
        const mockState: Partial<LearningState> = {
            learner_input: "Explain Cloud Storage",
            learner_profile: {
                skill_level: 50,
                learning_style: "visual",
                pace: "standard",
                time_budget: 15,
                goal: "Understand",
                learning_history: [],
                knowledge_gaps: [],
                preferred_analogies: []
            },
            personalized_path: {
                recommended_topic: "Cloud Object Storage",
                difficulty_level: 5,
                traditional_duration_estimate: 45,
                learning_sequence: [],
                estimated_duration: 15,
                time_saved_rationale: "AI optimization"
            },
            retrieved_knowledge: [
                { source: "Docs", concept: "Buckets", explanation: "Containers for objects", credibility: 0.9, last_updated: "2024-01-01" }
            ],
            routing_log: []
        };

        const result = await agent_h_content_generator(mockState as LearningState);

        // Verify Flashcards
        expect(result.flashcards).toBeDefined();
        expect(result.flashcards?.length).toBeGreaterThan(0);
        expect(result.flashcards![0]).toHaveProperty('front');
        expect(result.flashcards![0]).toHaveProperty('back');

        // Verify Cheat Sheet
        expect(result.cheat_sheet).toBeDefined();
        expect(result.cheat_sheet?.length).toBeGreaterThan(0);

        // Verify Analogy
        expect(result.analogy_content).toBeDefined();
        expect(result.analogy_content?.analogy).toBeDefined();

        // Verify Resources
        expect(result.external_resources).toBeDefined();
    });

    it('should handle missing context gracefully', async () => {
        const minimalState: Partial<LearningState> = {
            learner_input: "Unknown Topic",
            learner_profile: {
                skill_level: 0,
                learning_style: "verbal",
                pace: "standard",
                time_budget: 0,
                goal: "Learn",
                learning_history: [],
                knowledge_gaps: [],
                preferred_analogies: []
            },
            routing_log: []
        };

        const result = await agent_h_content_generator(minimalState as LearningState);

        // Should still return fallback/mock content rather than crashing
        expect(result.flashcards).toBeDefined();
    });

    it('should generate content for DEEPEN intent', async () => {
        const deepenState: Partial<LearningState> = {
            learner_input: "Give me more",
            detected_intent: "DEEPEN",
            learner_profile: {
                skill_level: 50,
                learning_style: "visual",
                pace: "standard",
                time_budget: 15,
                goal: "Deepen",
                learning_history: [],
                knowledge_gaps: [],
                preferred_analogies: []
            },
            routing_log: []
        };
        const result = await agent_h_content_generator(deepenState as LearningState);
        expect(result.flashcards).toBeDefined();
        // Since we mock the response, we check if it runs without error. 
        // In a real integration test, we'd check if the prompt contained "NEW/ADVANCED".
    });
});
