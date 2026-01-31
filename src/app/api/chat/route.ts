import { NextResponse } from 'next/server';
import { runLearningGraph } from '@/app/actions';
import { readStreamableValue } from "@ai-sdk/rsc";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { messages } = body;

        // Extract the latest user message
        const lastMessage = messages?.[messages.length - 1]?.content || "";

        // Call the server action logic
        // Passing empty profile for testing
        console.log("Calling runLearningGraph...");
        const result = await runLearningGraph(lastMessage, {});
        console.log("runLearningGraph returned:", result);
        const { progress } = result;

        let finalState = null;

        console.log("Starting stream consumption...");
        // Consume the stream to find the final state
        for await (const data of readStreamableValue(progress)) {
            console.log("Stream chunk:", data);
            if (data && 'finalState' in data) {
                finalState = (data as any).finalState;
                break;
            }
        }

        if (!finalState) {
            return NextResponse.json({ error: "Stream ended without final state" }, { status: 500 });
        }

        return NextResponse.json(finalState);
    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
