import * as fs from 'fs';
import * as path from 'path';

// Manually parse .env.local to avoid adding dotenv dependency
const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = process.env.GEMINI_API_KEY;

if (!apiKey && fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GEMINI_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
    }
}

if (!apiKey) {
    console.error("No GEMINI_API_KEY found in .env.local or environment");
    process.exit(1);
}

interface GeminiModel {
    name: string;
    version: string;
    displayName: string;
    description: string;
    inputTokenLimit: number;
    outputTokenLimit: number;
    supportedGenerationMethods: string[];
    temperature?: number;
    topP?: number;
    topK?: number;
}

interface ModelsResponse {
    models?: GeminiModel[];
}

async function listModels() {
    // Note: v1beta is the current standard for these models
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    console.log(`Querying: ${url.replace(apiKey || '', 'HIDDEN_KEY')}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error(text);
            return;
        }

        const data = await response.json() as ModelsResponse;

        if (data.models) {
            console.log("\n------ AVAILABLE IMAGE GENERATION MODELS ------");
            // Filter for models that likely support image generation
            // Usually 'imagen' in name or supportedGenerationMethods including 'generateImages' or 'predict' on vision models
            const imageModels = data.models.filter((m) =>
                m.name.includes('imagen') ||
                (m.supportedGenerationMethods && m.supportedGenerationMethods.some(method => method.includes('image') || method.includes('predict')))
            );

            if (imageModels.length > 0) {
                imageModels.forEach((m) => {
                    console.log(`\nModel: ${m.name}`);
                    console.log(`Version: ${m.version}`);
                    console.log(`Methods: ${m.supportedGenerationMethods.join(', ')}`);
                });
            } else {
                console.log("No specific 'imagen' models found in the standard list. Printing ALL models to be sure:");
                data.models.forEach((m) => {
                    console.log(`- ${m.name} [${m.supportedGenerationMethods.join(', ')}]`);
                });
            }

        } else {
            console.log("No models found or error structure:", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
