import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { contract_address, toAddress, limit } = req.query;
    if (!toAddress || !contract_address) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const url = `https://api.trongrid.io/v1/accounts/${toAddress}/transactions/trc20?limit=${limit || 20}&contract_address=${contract_address}`;
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Blockchain API error: ${response.status}` });
    }

    const data = await response.json();
    const transfers = (data.data || []).map((t: any) => ({
      transaction_id: t.transaction_id,
      quant: t.value,
      from: t.from,
      to: t.to,
      timestamp: t.block_timestamp
    }));

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ token_transfers: transfers });
  } catch (error) {
    console.error('Blockchain Proxy Error:', error);
    return res.status(500).json({ error: 'Failed to fetch from blockchain' });
  }
}
