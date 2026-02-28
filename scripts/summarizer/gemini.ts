import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-2.5-flash';
const MAX_CALLS = 250;
let callCount = 0;

function getClient(): GoogleGenAI | null {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

export async function summarizeWithGemini(title: string, description: string): Promise<string | null> {
  if (callCount >= MAX_CALLS) return null;
  const client = getClient();
  if (!client) return null;

  callCount++;
  const prompt = `以下の記事タイトルと説明文を、日本語で30文字以内の1行要約にしてください。\nタイトル: ${title}\n説明: ${description}`;

  try {
    const response = await client.models.generateContent({
      model: MODEL,
      contents: prompt,
    });
    return response.text ?? null;
  } catch (err) {
    console.error(`Gemini API error: ${err}`);
    return null;
  }
}

export function fallbackSummary(description: string): string {
  if (description.length <= 40) return description;
  return description.slice(0, 40) + '…';
}

export function isAvailable(): boolean {
  return !!process.env.GOOGLE_API_KEY;
}
