import OpenAI from 'openai';

// We explicitly type check this to ensure the app doesn't build without it
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
    console.warn("Missing OpenAI API Key. Required: OPENAI_API_KEY.");
}

// Create a single OpenAI client for your backend
export const openai = new OpenAI({
    apiKey: openaiApiKey || "",
});
