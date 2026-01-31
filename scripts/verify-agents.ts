
/**
 * Verification script for running agents via API.
 * Usage: npx tsx scripts/verify-agents.ts
 */

async function verifyAgents() {
    const PORT = 3004;
    const BASE_URL = `http://localhost:${PORT}`;

    console.log(`Verifying Agents on ${BASE_URL}...`);

    try {
        // 1. Test Chat API (Agent A)
        console.log("Testing /api/chat (Agent A)...");
        const response = await fetch(`${BASE_URL}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [{ role: "user", content: "I want to learn about GCP Architecture" }]
            })
        });

        if (!response.ok) {
            throw new Error(`Agent A API failed with ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Response:", JSON.stringify(data, null, 2));

        // Basic validation: check if 'content' or 'messages' exists in response
        // Basic validation: check if 'content' or 'messages' exists in response
        if (data.flashcards && data.flashcards.length > 0) {
            console.log("✅ Flashcards Present");
        } else {
            console.log("⚠️ Flashcards Missing (Expected for 'Understand' flow)");
        }

        if (data.infographic && data.infographic.imageUrl) {
            console.log("✅ Infographic Present");
        } else {
            console.log("⚠️ Infographic Missing");
        }

        if (data.content || (data.messages && data.messages.length > 0) || data.final_output) {
            console.log("✅ Agent A Response Valid");
        } else {
            console.error("❌ Agent A Response Invalid structure");
            process.exit(1);
        }

    } catch (error) {
        console.error("❌ Verification Failed:", error);
        process.exit(1);
    }
}

verifyAgents();
