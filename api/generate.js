
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { input } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-pro-1.5:free",
        messages: [
          { role: "system", content: "You are an expert prompt engineer. Generate cinematic, high-end, detailed prompts. Return only the final result." },
          { role: "user", content: input }
        ]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
        console.error('OpenRouter error:', data);
        return res.status(response.status).json({ error: 'Failed to generate prompt' });
    }

    res.status(200).json({ result: data.choices?.[0]?.message?.content });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message });
  }
}
