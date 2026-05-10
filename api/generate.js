
export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { input } = req.body;
    const apiKey = "ak_4YiIlmnA4GK5GtNWMTlT2F4xqSkO7nyI";
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await fetch("https://api.crun.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert prompt engineer. Generate cinematic, high-end, detailed prompts. Return ONLY valid JSON with no markdown formatting or text outside the JSON object. Do not include ```json." },
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
