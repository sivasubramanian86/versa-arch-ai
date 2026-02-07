/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { learningGraph } from "@/ai/graph";
import { LearningState } from "@/types/learning-state";
import { extractFromSource } from "@/lib/dissector";

import { createStreamableValue } from "@ai-sdk/rsc";

// Server Action to run the graph
// Server Action to run the graph
export async function runLearningGraph(
    input: string,
    profile: unknown,
    previousState?: Partial<LearningState>
) {
    // Use createStreamableValue to stream progress updates AND partial data to the client
    const progressStream = createStreamableValue<{
        agent: string;
        status: string;
        partialState?: Partial<LearningState>;
        finalState?: LearningState;
    }>();

    (async () => {
        try {
            // Send initial ping to wake up the UI
            progressStream.update({ agent: "System", status: "Initializing..." });

            // Check for source dissection triggers (Async now!)
            let sourceData: { text: string; metadata: { type: "book" | "video" | "audio" | "article"; title: string; url?: string } } =
                { text: "", metadata: { type: "article", title: "", url: "" } };
            try {
                // Update status for potentially slow operation
                progressStream.update({ agent: "System", status: "Analyzing Source..." });
                sourceData = await extractFromSource(input);
            } catch (e) {
                console.warn("Dissection failed, proceeding without source context", e);
            }

            const initialState: Partial<LearningState> = {
                ...(previousState || {}),
                learner_input: input,
                learner_profile: profile as any,
                domain: sourceData.text ? sourceData.metadata.title : (previousState?.domain || "Cloud Architecture"),
                messages: [...(previousState?.messages || []), { role: "user", content: input }],
                routing_log: [...(previousState?.routing_log || [])],
                source_context: sourceData.text || previousState?.source_context,
                source_metadata: (JSON.stringify(sourceData.metadata) !== JSON.stringify({ title: "", url: "" }) ? sourceData.metadata : undefined) || previousState?.source_metadata
            };

            // Environment check (logging only, agents handle fallback)
            if (!process.env.GEMINI_API_KEY) {
                console.warn("WARNING: GEMINI_API_KEY is not set. Agents will use internal mocks.");
            }

            // Use .stream() instead of .invoke() to get intermediate steps
            // streamMode: "updates" emits as soon as a node finishes
            const stream = await learningGraph.stream(initialState, {
                streamMode: "updates",
            });

            // Start with initial state
            let accumulatedState = { ...initialState } as LearningState;

            for await (const chunk of stream as any) {
                // Chunk keys correspond to the node names that just finished
                for (const nodeName of Object.keys(chunk)) {
                    let displayName = "Processing...";
                    let status = "Working";
                    // Extract the output state from this node to stream partially
                    const partialData = chunk[nodeName];

                    // Simple accumulation for the final signal (approximation)
                    accumulatedState = { ...accumulatedState, ...partialData };

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
                        case "h7_infographic": displayName = "Agent H7: Visualizing Info"; status = "Drawing"; break;
                        case "h8_mnemonic": displayName = "Agent H8: Mastering Memory"; status = "Drafting"; break;

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

            // Ensure done() is ALWAYS called to close the stream successfully
            progressStream.done({ agent: "Complete", status: "Done", finalState: accumulatedState });

        } catch (error) {
            console.error("Streaming Error:", error);
            progressStream.error(error);
        }
    })();

    return {
        progress: progressStream.value
    };
}
