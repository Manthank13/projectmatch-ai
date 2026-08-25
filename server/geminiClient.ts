import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in process.env. Please configure GEMINI_API_KEY in .env.');
  }
  return new GoogleGenAI({ apiKey });
}

// Models to try in order (Gemini Flash)
export const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash-lite'];

/**
 * Robust helper to call Gemini with structured JSON output and automatic model fallback
 */
export async function callGeminiStructured<T>(params: {
  prompt: string;
  systemInstruction?: string;
  responseSchema?: any;
}): Promise<T> {
  const aiClient = getGeminiClient();

  let lastError: any = null;

  for (const model of GEMINI_MODELS) {
    try {
      console.log(`[ProjectMatch AI] Calling Gemini model: ${model}...`);
      const response = await aiClient.models.generateContent({
        model,
        contents: params.prompt,
        config: {
          systemInstruction: params.systemInstruction || 'You are an elite ProjectMatch AI Architecture Analyst. Return strict JSON matching the schema.',
          responseMimeType: 'application/json',
          responseSchema: params.responseSchema,
          temperature: 0.2
        }
      });

      const rawText = response.text?.trim() || '';
      if (!rawText) {
        throw new Error(`Empty response from model ${model}`);
      }

      // Clean any potential markdown code blocks
      const cleaned = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(cleaned) as T;
      console.log(`[ProjectMatch AI] Gemini model ${model} returned valid structured JSON.`);
      return parsed;
    } catch (error: any) {
      lastError = error;
      console.warn(`[ProjectMatch AI] Model ${model} failed:`, error?.message || error);
      // Try next compatible model (e.g. gemini-3.6-flash if 2.5-flash is 404 in this region)
      continue;
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastError?.message || lastError}`);
}
