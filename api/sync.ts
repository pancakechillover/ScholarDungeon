import { createClient } from 'redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Redis client lazily to reuse connection in serverless environment
let redisClient: any = null;
const getRedisClient = async () => {
  if (redisClient && redisClient.isOpen) return redisClient;
  if (process.env.REDIS_URL) {
    try {
      redisClient = createClient({ url: process.env.REDIS_URL });
      redisClient.on('error', (err: any) => console.error('Redis Client Error', err));
      await redisClient.connect();
      return redisClient;
    } catch (err) {
      console.error("Redis initialization error:", err);
      return null;
    }
  }
  return null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const client = await getRedisClient();
    if (!client) {
      return res.status(500).json({ error: "Cloud sync is not configured (Redis connection failed)." });
    }

    // Parse body if it's a string (fallback for missing Content-Type)
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error("Failed to parse string body:", e);
      }
    }

    if (req.method === 'POST') {
      const { secretCode, localData, forceOverwrite } = body || {};
      if (!secretCode) return res.status(400).json({ error: "Secret code is required" });

      const key = `scholar_sync_${secretCode}`;
      const cloudDataRaw = await client.get(key);
      const cloudData = cloudDataRaw ? JSON.parse(cloudDataRaw.toString()) : null;

      // If no localData is provided, this is a FETCH request
      if (!localData) {
        return res.status(200).json({ cloudData });
      }

      // Conflict resolution
      if (cloudData && cloudData.lastUpdated) {
        const cloudTime = new Date(cloudData.lastUpdated).getTime();
        const localTime = new Date(localData.lastUpdated || 0).getTime();
        if (cloudTime > localTime && !forceOverwrite) {
          return res.status(409).json({ conflict: true, cloudData });
        }
      }

      if (!localData.lastUpdated) localData.lastUpdated = new Date().toISOString();
      await client.set(key, JSON.stringify(localData));
      return res.status(200).json({ success: true, cloudData: localData });
    } 
    
    if (req.method === 'DELETE') {
      const { secretCode } = body || {};
      if (!secretCode) return res.status(400).json({ error: "Secret code is required" });
      
      const key = `scholar_sync_${secretCode}`;
      await client.del(key);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Sync error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
