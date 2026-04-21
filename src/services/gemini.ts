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
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a professional cinematic AI image prompt based on this idea: "${userIdea}".
    
    ${STRICT_CONTENT_RULE}
    
    Return the result in JSON format with the following structure:
    {
      "prompt": "The main high-end cinematic prompt",
      "variations": ["variation 1", "variation 2", "variation 3"],
      "useCases": ["use case 1", "use case 2"]
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          prompt: { type: Type.STRING },
          variations: { type: Type.ARRAY, items: { type: Type.STRING } },
          useCases: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["prompt", "variations", "useCases"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

export async function enhancePrompt(existingPrompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Enhance this AI image prompt to make it more professional, cinematic, and high-end: "${existingPrompt}".
    
    ${STRICT_CONTENT_RULE}
    
    Return the result in JSON format with the following structure:
    {
      "prompt": "The enhanced high-end cinematic prompt",
      "variations": ["variation 1", "variation 2", "variation 3"],
      "useCases": ["use case 1", "use case 2"]
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          prompt: { type: Type.STRING },
          variations: { type: Type.ARRAY, items: { type: Type.STRING } },
          useCases: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["prompt", "variations", "useCases"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}
