import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('API Request: /api/sheets');
  
  try {
    const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzdog1J5djq52THUd9pt_YBK34iP3hgcLPULnv6zwIwdtI5w10AWfOngzirt-nGtoRfnw/exec';
    
    const response = await fetch(SHEETS_URL, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Failed to fetch from Google Sheets: ${response.status}` });
    }

    const data = await response.json();
    
    // Add CORS headers for direct access if needed
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Sheets Proxy Error:', error);
    return res.status(500).json({ error: 'Internal server error fetching sheets' });
  }
}
