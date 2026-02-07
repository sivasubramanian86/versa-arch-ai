import { describe, it, expect } from 'vitest';
import { routeFromIntent, learningGraph } from '../ai/graph';
import { LearningState } from '@/types/learning-state';

describe('Learning Graph', () => {
    it('should be defined', () => {
        expect(learningGraph).toBeDefined();
    });

    describe('routeFromIntent', () => {
        const mockState = {
            learner_id: 'test-learner',
            learner_profile: {},
            activated_agents: [] as string[],
        } as LearningState;

        it('should route VISUALIZE to visualizer and infographic', () => {
            const state = { ...mockState, detected_intent: "VISUALIZE" as const };
            const nextNodes = routeFromIntent(state);
            expect(nextNodes).toContain("visualizer");
            expect(nextNodes).toContain("h7_infographic");
            // Evaluator and Feedback are downstream
            expect(nextNodes).not.toContain("evaluator");
            expect(nextNodes).not.toContain("feedback");
        });

        it('should route UNDERSTAND to content agents only', () => {
            const state = { ...mockState, detected_intent: "UNDERSTAND" as const };
            const nextNodes = routeFromIntent(state);
            expect(nextNodes).toContain("scaffolder");
            expect(nextNodes).toContain("knowledge_manager");
            expect(nextNodes).toContain("h1_analogy");
            // Should NOT contain feedback/evaluator directly (they are downstream)
            expect(nextNodes).not.toContain("feedback");
            expect(nextNodes).not.toContain("evaluator");
        });

        it('should respect activated_agents if provided', () => {
            const state = {
                ...mockState,
                detected_intent: "UNDERSTAND" as const,
                activated_agents: ["h7_infographic", "visualizer", "evaluator", "feedback"]
            };
            const nextNodes = routeFromIntent(state);
            // Should filter out feedback/evaluator for initial parallel execution
            expect(nextNodes).toContain("h7_infographic");
            expect(nextNodes).toContain("visualizer");
            expect(nextNodes).not.toContain("feedback");
            expect(nextNodes).not.toContain("evaluator");
        });
    });
});
