console.log('Server starting...');
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // API Proxy for TronGrid to avoid CORS and TronScan 401 errors
  app.get('/api/blockchain/transfers', async (req, res) => {
    try {
      const { contract_address, toAddress, limit } = req.query;
      // Using TronGrid API which is more reliable for public requests
      const url = `https://api.trongrid.io/v1/accounts/${toAddress}/transactions/trc20?limit=${limit || 20}&contract_address=${contract_address}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`TronGrid API Error (${response.status}):`, text.substring(0, 500));
        return res.status(response.status).json({ error: `Blockchain API error: ${response.status}` });
      }

      const data = await response.json();
      
      // Map TronGrid format to a simplified format for the frontend
      // TronGrid returns data in 'data' array, values are in 'value' field (raw units)
      const transfers = (data.data || []).map((t: any) => ({
        transaction_id: t.transaction_id,
        quant: t.value, // Keep as string to match previous logic
        from: t.from,
        to: t.to,
        timestamp: t.block_timestamp
      }));

      res.json({ token_transfers: transfers });
    } catch (error) {
      console.error('Blockchain Proxy Error:', error);
      res.status(500).json({ error: 'Failed to fetch from blockchain' });
    }
  });

  // In-memory cache for Google Sheets data
  let sheetsCache: any = null;
  let lastFetchTime = 0;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Google Sheets Proxy to avoid CORS
  app.get('/api/sheets', async (req, res) => {
    console.log('Received request for /api/sheets');
    
    const now = Date.now();
    if (sheetsCache && (now - lastFetchTime < CACHE_DURATION)) {
      console.log('Returning cached Google Sheets data');
      return res.json(sheetsCache);
    }

    try {
      // Use the user-provided Apps Script URL
      const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzdog1J5djq52THUd9pt_YBK34iP3hgcLPULnv6zwIwdtI5w10AWfOngzirt-nGtoRfnw/exec';

      const response = await fetch(SHEETS_URL, {
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
          }
        });
      
      console.log('Google Sheets response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Sheets error response body:', errorText.substring(0, 1000));
        
        if (sheetsCache) {
          console.log('Returning stale cache as fallback due to GAS error');
          return res.json(sheetsCache);
        }
        
        return res.status(response.status).json({ error: `Failed to fetch from Google Sheets: ${response.status}` });
      }

      const data = await response.json();
      console.log('Successfully fetched and parsed data from Google Sheets');
      
      // Update cache
      sheetsCache = data;
      lastFetchTime = now;
      
      res.json(data);
    } catch (error) {
      console.error('Sheets Proxy Error:', error);
      
      // Fallback to cache on network error
      if (sheetsCache) {
        console.log('Returning stale cache as fallback due to network error');
        return res.json(sheetsCache);
      }
      
      res.status(500).json({ error: 'Internal server error fetching sheets' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
