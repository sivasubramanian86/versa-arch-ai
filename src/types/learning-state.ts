export interface LearnerProfile {
    skill_level: number; // 0-100
    learning_style: "visual" | "verbal" | "kinesthetic" | "mixed";
    pace: "fast" | "standard" | "slow";
    learning_history: Record<string, unknown>[]; // Previous sessions
    knowledge_gaps: string[];
    preferred_analogies: string[];
    time_budget: number; // Minutes available
    goal?: string;
}

export interface RetrievedKnowledge {
    concept: string;
    explanation: string;
    source: string;
    credibility: number;
    last_updated: string;
}

export interface ExternalResource {
    type: "course" | "video" | "book" | "link";
    title: string;
    url: string;
    description: string;
    provider?: string;
}

export interface LearningState {
    // ... existing fields ...
    learner_input: string;
    learner_id: string;
    domain: string;

    learner_profile: LearnerProfile;
    detected_intent: "VISUALIZE" | "UNDERSTAND" | "EVALUATE" | "SCAFFOLD" | "FIND_GAP" | "DISSECT" | "DEEPEN";
    intent_confidence: number;
    activated_agents: string[];

    source_context?: string;
    source_metadata?: {
        type: "book" | "video" | "audio" | "article";
        url?: string;
        title?: string;
    };

    diagram_json: Record<string, unknown> | null;
    infographic?: {
        imageUrl: string;
        altText: string;
    } | null;
    long_term_memory?: Record<string, unknown>; // Persistent user context (key-value store)
    personalized_path: {
        recommended_topic: string;
        difficulty_level: number;
        traditional_duration_estimate: number;
        estimated_duration: number;
        learning_sequence: string[];
        time_saved_rationale: string;
        personalization_rationale?: string;
    } | null;

    cheat_sheet?: string[];
    pareto_digest?: {
        principle: string;
        crucial_20_percent: string[];
        outcome_80_percent: string;
    };
    analogy_content?: {
        analogy: string;
        explanation: string;
    };

    flashcards?: {
        front: string;
        back: string;
    }[];
    mnemonics?: {
        phrase: string;
        expansion: string;
        tip?: string;
    }[];

    external_resources?: ExternalResource[];

    concept_prerequisites: {
        primary_concept: string;
        prerequisites: string[];
        dependency_tree: Record<string, unknown>;
    } | null;

    retrieved_knowledge: RetrievedKnowledge[];

    competency_assessment: {
        current_score: number;
        confidence_level: number;
        mastery_indicators: string[];
        gaps_detected: string[];
        micro_quiz?: {
            question: string;
            options: string[];
            answer: string;
            explanation: string;
            type: "mcq" | "trap" | "scenario";
        }[];
    } | null;

    practice_quiz?: {
        question: string;
        options: string[];
        answer: string;
        explanation: string;
        type: "mcq" | "trap" | "scenario";
    }[];

    feedback_guidance: {
        encouragement: string;
        next_topic: string;
        time_estimate: number;
        misconceptions_corrected: string[];
        summary_bullets?: string[];
        difficulty_label?: string;
    } | null;

    messages: { role: string; content: string }[];
    memory_context: string;
    routing_log: Record<string, unknown>[];
    final_output: Record<string, unknown>;
}
