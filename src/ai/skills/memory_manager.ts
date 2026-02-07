import { LearningState } from "@/types/learning-state";

// Memory Manager Skill
// Handles storage and retrieval of long-term user context.
// In a hackathon context, this writes to a local JSON persistent in the graph state,
// but in production, this would use vector DB (Pinecone/Weaviate).

export interface MemoryEntry {
    id: string;
    timestamp: number;
    text: string;
    tags: string[];
    importance: number; // 0-1
}

export const memoryManager = {
    /**
     * Store a significant insight or preference
     */
    storeInsight: async (state: LearningState, text: string, tags: string[] = []): Promise<void> => {
        console.log(`[Skill:Memory] Storing insight: "${text}" [${tags.join(", ")}]`);

        // const entry: MemoryEntry = {
        //     id: generateId(),
        //     timestamp: Date.now(),
        //     text,
        //     tags,
        //     importance: 0.8 // default high importance for explicit insights
        // };

        // In a real app, this would be: await VectorDB.upsert(entry);
        // Here, we just log it. The state graph accumulates it in 'long_term_memory' channel automatically
        // if the agent returns it.

        // This function is mainly a helper to FORMAT the memory update for the agent to return.
        return;
    },

    /**
     * Retrieve relevant context based on current topic
     */
    retrieveContext: async (state: LearningState, query: string): Promise<string[]> => {
        // Mock retrieval logic 
        // In real app: await VectorDB.query(query);

        const memories = (state.long_term_memory as { entries: MemoryEntry[] })?.entries || [];
        if (!memories.length) return [];

        // Simple keyword match for hackathon
        const relevant = memories.filter((m: MemoryEntry) =>
            m.text.includes(query) || m.tags.some(t => query.includes(t))
        );

        return relevant.map((m: MemoryEntry) => m.text);
    }
};

/*
function generateId(): string {
    return Math.random().toString(36).substring(2, 15);
}
*/
