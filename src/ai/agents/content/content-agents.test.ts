
import { describe, it, expect } from 'vitest';
import {
    agent_h1_analogy,
    agent_h2_flashcards,
    agent_h3_cheatsheet,
    agent_h4_resources,
    agent_h5_pareto,
    agent_h6_quiz
} from '@/ai/agents';
import { LearningState } from '@/types/learning-state';

describe('Content Sub-Agents (Parallel Execution)', () => {
    const mockState: Partial<LearningState> = {
        learner_input: "Explain Cloud Computing",
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
            recommended_topic: "Cloud Computing Basics",
            difficulty_level: 1,
            estimated_duration: 15,
            learning_sequence: []
        },
        detected_intent: "UNDERSTAND"
    };

    it('H1 Analogy should return analogy_content', async () => {
        const result = await agent_h1_analogy(mockState as LearningState);
        expect(result.analogy_content).toBeDefined();
        expect(result.analogy_content?.analogy).toBeDefined();
    });

    it('H2 Flashcards should return flashcards', async () => {
        const result = await agent_h2_flashcards(mockState as LearningState);
        expect(result.flashcards).toBeDefined();
        expect(Array.isArray(result.flashcards)).toBe(true);
    });

    it('H3 CheatSheet should return cheat_sheet', async () => {
        const result = await agent_h3_cheatsheet(mockState as LearningState);
        expect(result.cheat_sheet).toBeDefined();
        expect(Array.isArray(result.cheat_sheet)).toBe(true);
    });

    it('H4 Resources should return external_resources', async () => {
        const result = await agent_h4_resources(mockState as LearningState);
        expect(result.external_resources).toBeDefined();
    });

    it('H5 Pareto should return pareto_digest', async () => {
        const result = await agent_h5_pareto(mockState as LearningState);
        expect(result.pareto_digest).toBeDefined();
        expect(result.pareto_digest?.principle).toBeDefined();
    });

    it('H6 Quiz should return practice_quiz', async () => {
        const result = await agent_h6_quiz(mockState as LearningState);
        expect(result.practice_quiz).toBeDefined();
        expect(Array.isArray(result.practice_quiz)).toBe(true);
    });

    it('DEEPEN intent should trigger flashcards generator', async () => {
        const deepenState = { ...mockState, detected_intent: "DEEPEN" };
        const result = await agent_h2_flashcards(deepenState as LearningState);
        expect(result.flashcards).toBeDefined();
    });
});
