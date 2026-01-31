/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { learningGraph } from "@/ai/graph";
import { LearningState } from "@/types/learning-state";
import { MOCK_RESPONSES } from "@/data/mock-responses";
import { extractFromSource } from "@/lib/dissector";

import { createStreamableValue } from "@ai-sdk/rsc";

// Server Action to run the graph
export async function runLearningGraph(
    input: string,
    profile: unknown,
    previousState?: Partial<LearningState>
) {

    // Check for source dissection triggers
    const sourceData = await extractFromSource(input);

    const initialState: Partial<LearningState> = {
        ...(previousState || {}),
        learner_input: input,
        learner_profile: profile as any,
        domain: sourceData.text ? sourceData.metadata.title : (previousState?.domain || "Cloud Architecture"),
        messages: [...(previousState?.messages || []), { role: "user", content: input }],
        routing_log: [...(previousState?.routing_log || [])],
        source_context: sourceData.text || previousState?.source_context,
        source_metadata: (sourceData.text ? sourceData.metadata : undefined) || previousState?.source_metadata
    };

    // Environment check (logging only, agents handle fallback)
    if (!process.env.GEMINI_API_KEY) {
        console.warn("WARNING: GEMINI_API_KEY is not set. Agents will use internal mocks.");
    }

    // Use createStreamableValue to stream progress updates AND partial data to the client
    const progressStream = createStreamableValue<{
        agent: string;
        status: string;
        partialState?: Partial<LearningState>;
        finalState?: LearningState;
    }>();

    (async () => {
        try {
            // Use .stream() instead of .invoke() to get intermediate steps
            const stream = await learningGraph.stream(initialState, {
                streamMode: "updates",
            });

            for await (const chunk of stream) {
                // Chunk keys correspond to the node names that just finished
                // e.g., { intent_classifier: { ... } }
                // @ts-ignore
                for (const nodeName of Object.keys(chunk)) {
                    let displayName = "Processing...";
                    let status = "Working";
                    // Extract the output state from this node to stream partially
                    // @ts-ignore
                    const partialData = chunk[nodeName];

                    switch (nodeName) {
                        case "intent_classifier": displayName = "Agent A: Classifying Intent"; status = "Analyzing"; break;
                        case "visualizer": displayName = "Agent B: Visualizing Architecture"; status = "Drawing"; break;
                        case "batch_understand": displayName = "Agents C, D, E: Processing in Parallel"; status = "Orchestrating"; break;
                        case "personalization": displayName = "Agent C: Personalizing Content"; status = "Tailoring"; break;
                        case "scaffolder": displayName = "Agent D: Scaffolding Concepts"; status = "Structuring"; break;
                        case "knowledge_manager": displayName = "Agent E: Retrieving Knowledge"; status = "Searching"; break;

                        case "h1_analogy": displayName = "Agent H1: Generating Analogy"; status = "Imagining"; break;
                        case "h2_flashcards": displayName = "Agent H2: Creating Flashcards"; status = "Drafting"; break;
                        case "h3_cheatsheet": displayName = "Agent H3: Compiling Cheat Sheet"; status = "Summarizing"; break;
                        case "h4_resources": displayName = "Agent H4: Curating Resources"; status = "Searching"; break;
                        case "h5_pareto": displayName = "Agent H5: Calculating Pareto Digest"; status = "Optimizing"; break;
                        case "h6_quiz": displayName = "Agent H6: Writing Quiz"; status = "Testing"; break;

                        case "evaluator": displayName = "Agent F: Evaluating Competency"; status = "Reviewing"; break;
                        case "feedback": displayName = "Agent G: Generating Feedback"; status = "Summarizing"; break;
                    }

                    progressStream.update({
                        agent: displayName,
                        status,
                        partialState: partialData
                    });
                }
            }

            // Get final state for the return value
            // (We re-run invoke or just trust the last chunk? Stream usually gives partials. 
            // Better to capture the final accumulated state if possible, or just let the client reload/wait.
            // For simplicity in this architecture, we will return the final object via the stream or 
            // separate the concerns. 
            // APPROACH: The client will receive the *final state* as the resolution of the promise, 
            // but we can't easily return both a stream and a promise in the same Server Action return type 
            // without using the specific AI SDK patterns.

            // Standard Pattern: Return object containing the stream and the final result promise
            // But runLearningGraph currently returns Promise<Partial<LearningState>>.
            // We'll change the return type to include the stream.

            // Since we need the Final State for the UI to render, let's do a full invoke *after* or 
            // concurrently? No, that's wasteful.
            // efficient way: maintain state accumulator.

            const finalState = await learningGraph.invoke(initialState);
            // @ts-ignore
            progressStream.done({ agent: "Complete", status: "Done", finalState });

        } catch (error) {
            console.error("Streaming Error:", error);
            progressStream.error(error);
        }
    })();

    return {
        progress: progressStream.value
    };
}
