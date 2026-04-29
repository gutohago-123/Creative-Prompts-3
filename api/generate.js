export default async function handler(req, res) {
  // السماح بطلبات POST فقط
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { input } = req.body;
    
    // استدعاء المتغيرات من إعدادات Vercel
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.MODEL_ID || "google/gemini-pro-1.5:free";
    const siteUrl = "https://creativepromptss.vercel.app"; // تأكد أنه نفس دومين موقعك

    if (!apiKey) {
      return res.status(500).json({ error: 'API key is not configured in Vercel' });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // هذه الإعدادات ضرورية لعمل النماذج المجانية في OpenRouter
        "HTTP-Referer": siteUrl,
        "X-Title": "Creative Prompts",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "You are an expert prompt engineer. Generate cinematic, high-end, detailed prompts. Return only the final result." },
          { role: "user", content: input }
        ]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
        console.error('OpenRouter API Error:', data);
        return res.status(response.status).json({ error: data.error?.message || 'API request failed' });
    }

    res.status(200).json({ result: data.choices?.[0]?.message?.content });
  } catch (err) {
    console.error('Server Internal Error:', err);
    res.status(500).json({ error: err.message });
  }
}
