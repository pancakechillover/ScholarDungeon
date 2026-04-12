import { createClient } from 'redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Redis client
const client = createClient({ url: process.env.REDIS_URL });
client.on('error', (err) => console.error('Redis Client Error', err));

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!client.isOpen) await client.connect();

    // Get secretCode (from query for GET, body for POST)
    const secretCode = (req.method === 'GET' ? req.query.secretCode : req.body.secretCode) as string;
    
    if (!secretCode) {
      return res.status(400).json({ error: 'Missing secretCode' });
    }

    const key = `dungeon_state:${secretCode}`;

    if (req.method === 'GET') {
      const data = await client.get(key);
      return res.status(200).json(data ? JSON.parse(data) : null);
    } 
    
    if (req.method === 'POST') {
      const { localData } = req.body;
      if (!localData) return res.status(400).json({ error: 'Missing localData' });
      
      await client.set(key, JSON.stringify(localData));
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Sync Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
