import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Redis client
  let redisClient: ReturnType<typeof createClient> | null = null;
  if (process.env.REDIS_URL) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    await redisClient.connect().catch(console.error);
    console.log("Connected to Redis via REDIS_URL");
  }

  app.use(express.json({ limit: '10mb' }));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Sync API
  app.post("/api/sync", async (req, res) => {
    try {
      const { secretCode, localData } = req.body;
      
      if (!secretCode) {
        return res.status(400).json({ error: "Secret code is required" });
      }

      if (!redisClient) {
        return res.status(500).json({ error: "Cloud sync is not configured on the server (Missing REDIS_URL)." });
      }

      const key = `scholar_sync_${secretCode}`;
      
      // Get existing cloud data
      const cloudDataRaw = await redisClient.get(key);
      const cloudDataString = cloudDataRaw ? cloudDataRaw.toString() : null;
      const cloudData = cloudDataString ? JSON.parse(cloudDataString) : null;

      // If no local data provided, just return cloud data (GET equivalent)
      if (!localData) {
        return res.json({ cloudData });
      }

      // Conflict Resolution
      if (cloudData && (cloudData as any).lastUpdated) {
        const cloudTime = new Date((cloudData as any).lastUpdated).getTime();
        const localTime = new Date(localData.lastUpdated || 0).getTime();

        // If cloud is newer and we are not forcing overwrite
        if (cloudTime > localTime && !req.body.forceOverwrite) {
          return res.status(409).json({ 
            conflict: true, 
            cloudData,
            message: "The cloud remembers a different path."
          });
        }
      }

      // Ensure lastUpdated is set
      if (!localData.lastUpdated) {
        localData.lastUpdated = new Date().toISOString();
      }

      // Save to KV
      await redisClient.set(key, JSON.stringify(localData));
      
      res.json({ success: true, cloudData: localData });
    } catch (error) {
      console.error("Sync error:", error);
      res.status(500).json({ error: "Failed to commune with the ancient archives." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
