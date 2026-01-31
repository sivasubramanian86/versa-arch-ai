
/**
 * Test script for Gemini JSON parsing logic.
 * Usage: npx tsx scripts/test-json-parsing.ts
 */

function extractJson(responseText: string): any {
    let cleanJson = responseText;

    // 1. Try to extract JSON from code blocks (handling Thinking output)
    const jsonBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
        cleanJson = jsonBlockMatch[1].trim();
    } else {
        // 2. Fallback: If no code blocks, try to find the first '{' and last '}' 
        const firstBrace = responseText.indexOf('{');
        const lastBrace = responseText.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            cleanJson = responseText.substring(firstBrace, lastBrace + 1);
        } else {
            // 3. Last resort: simple replace
            cleanJson = responseText.replace(/```json|```/g, "").trim();
        }
    }

    try {
        return JSON.parse(cleanJson);
    } catch (e) {
        throw new Error(`Parse failed for input: ${responseText.substring(0, 50)}... -> Cleaned: ${cleanJson}`);
    }
}

const testCases = [
    {
        name: "Standard Clean JSON",
        input: '{"key": "value"}',
        expected: { key: "value" }
    },
    {
        name: "Markdown Code Block",
        input: '```json\n{"key": "value"}\n```',
        expected: { key: "value" }
    },
    {
        name: "Thinking Text + Code Block",
        input: 'I am thinking about this...\n```json\n{"key": "value"}\n```',
        expected: { key: "value" }
    },
    {
        name: "Thinking Text + No Code Block (Brace extraction)",
        input: 'Okay, here is the JSON:\n{"key": "value"}',
        expected: { key: "value" }
    },
    {
        name: "Complex Thinking + Mixed Format",
        input: '**Analysis**\nI will generate the response now.\n```\n{\n  "key": "value"\n}\n```',
        expected: { key: "value" }
    }
];

let passed = 0;
let failed = 0;

console.log("Starting JSON Parsing Tests...\n");

testCases.forEach((test, index) => {
    try {
        const result = extractJson(test.input);
        if (JSON.stringify(result) === JSON.stringify(test.expected)) {
            console.log(`✅ Test ${index + 1}: ${test.name} PASSED`);
            passed++;
        } else {
            console.error(`❌ Test ${index + 1}: ${test.name} FAILED`);
            console.error(`   Expected: ${JSON.stringify(test.expected)}`);
            console.error(`   Got:      ${JSON.stringify(result)}`);
            failed++;
        }
    } catch (e) {
        console.error(`❌ Test ${index + 1}: ${test.name} ERROR: ${(e as Error).message}`);
        failed++;
    }
});

console.log(`\nSummary: ${passed} Passed, ${failed} Failed`);

if (failed > 0) process.exit(1);
