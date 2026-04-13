import { createClient } from 'redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Redis client lazily
let redisClient: any = null;
const getRedisClient = async () => {
  if (redisClient) return redisClient;
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
  // Handle CORS if necessary, but Vercel handles same-origin by default
  
  const client = await getRedisClient();
  if (!client) {
    return res.status(500).json({ error: "Cloud sync is not configured (Redis connection failed)." });
  }

  if (req.method === 'POST') {
    try {
      const { secretCode, localData, forceOverwrite } = req.body;
      if (!secretCode) return res.status(400).json({ error: "Secret code is required" });

      const key = `scholar_sync_${secretCode}`;
      const cloudDataRaw = await client.get(key);
      const cloudData = cloudDataRaw ? JSON.parse(cloudDataRaw.toString()) : null;

      if (!localData) return res.json({ cloudData });

      if (cloudData && cloudData.lastUpdated) {
        const cloudTime = new Date(cloudData.lastUpdated).getTime();
        const localTime = new Date(localData.lastUpdated || 0).getTime();
        if (cloudTime > localTime && !forceOverwrite) {
          return res.status(409).json({ conflict: true, cloudData });
        }
      }

      if (!localData.lastUpdated) localData.lastUpdated = new Date().toISOString();
      await client.set(key, JSON.stringify(localData));
      return res.json({ success: true, cloudData: localData });
    } catch (error) {
      console.error("Sync error:", error);
      return res.status(500).json({ error: "Sync failed" });
    }
  } 
  
  if (req.method === 'DELETE') {
    try {
      const { secretCode } = req.body;
      if (!secretCode) return res.status(400).json({ error: "Secret code is required" });
      
      const key = `scholar_sync_${secretCode}`;
      await client.del(key);
      return res.json({ success: true });
    } catch (error) {
      console.error("Delete error:", error);
      return res.status(500).json({ error: "Delete failed" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
