import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const STRICT_CONTENT_RULE = `
CRITICAL RULE:
- NO women under any condition.
- NO human faces visible.
- Men are allowed ONLY if their faces are NOT visible (e.g., back view, silhouette, blurred, cropped).
- Focus on products, luxury commercial-style compositions, nature, and futuristic environments.
- Lighting should be cinematic, soft glow, natural reflections.
- Materials: glass, water, mist, light particles.
`;

export async function generatePrompt(userIdea: string) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: `Generate a professional cinematic AI image prompt based on this idea: "${userIdea}".\n\n${STRICT_CONTENT_RULE}\n\nReturn the result in JSON format with the following structure:\n{\n  "prompt": "The main high-end cinematic prompt",\n  "variations": ["variation 1", "variation 2", "variation 3"],\n  "useCases": ["use case 1", "use case 2"]\n}` })
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  
  // Clean markdown JSON formatting if present
  let resultString = data.result || '';
  resultString = resultString.replace(/```json/g, '').replace(/```/g, '').trim();
  
  // Try parsing the string to JSON if it's stringified
  try {
    return JSON.parse(resultString);
  } catch (e) {
    // Basic fallback if JSON parsing fails
    return {
      prompt: data.result || userIdea,
      variations: [],
      useCases: []
    };
  }
}

export async function enhancePrompt(existingPrompt: string) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: `Enhance this AI image prompt to make it more professional, cinematic, and high-end: "${existingPrompt}".\n\n${STRICT_CONTENT_RULE}\n\nReturn the result in JSON format with the following structure:\n{\n  "prompt": "The enhanced high-end cinematic prompt",\n  "variations": ["variation 1", "variation 2", "variation 3"],\n  "useCases": ["use case 1", "use case 2"]\n}` })
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  
  // Clean markdown JSON formatting if present
  let resultString = data.result || '';
  resultString = resultString.replace(/```json/g, '').replace(/```/g, '').trim();
  
  try {
    return JSON.parse(resultString);
  } catch (e) {
    return {
      prompt: data.result || existingPrompt,
      variations: [],
      useCases: []
    };
  }
}
