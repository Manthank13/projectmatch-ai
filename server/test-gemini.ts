import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('Testing Gemini API key:', apiKey ? `Key exists (length: ${apiKey.length})` : 'MISSING KEY');
  
  if (!apiKey) {
    console.error('No GEMINI_API_KEY found in environment');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  const modelsToTest = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.5-flash-lite'];

  for (const model of modelsToTest) {
    try {
      console.log(`\nAttempting model: ${model}...`);
      const response = await ai.models.generateContent({
        model,
        contents: 'Respond with JSON: {"status": "success", "message": "Connected successfully"}'
      });

      console.log(`✓ SUCCESS with model: ${model}`);
      console.log('Response text:', response.text);
      break;
    } catch (error: any) {
      console.error(`✗ Failed for model ${model}:`, error?.message || error);
    }
  }
}

test();
