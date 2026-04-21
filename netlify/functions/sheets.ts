import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  try {
    const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzdog1J5djq52THUd9pt_YBK34iP3hgcLPULnv6zwIwdtI5w10AWfOngzirt-nGtoRfnw/exec';
    
    console.log('Attempting to fetch from:', SHEETS_URL);
    const response = await fetch(SHEETS_URL, { redirect: 'follow' });
    
    if (!response.ok) {
       return { 
          statusCode: 200, // Returning 200 to allow the frontend to read the error body
          body: JSON.stringify({ error: `Google Sheets returned status ${response.status}` }) 
       };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return { 
      statusCode: 200, 
      body: JSON.stringify({ error: `Netlify Function Error: ${String(error)}` }) 
    };
  }
};
