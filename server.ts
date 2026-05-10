import express from "express";
import path from "path";
import { createClient } from "redis";
import dotenv from "dotenv";
import webpush from "web-push";

dotenv.config();

// Configure Web Push
const cleanKey = (key?: string) => key ? key.replace(/['"]/g, '').trim() : '';

const envPublic = cleanKey(process.env.VAPID_PUBLIC_KEY);
const envPrivate = cleanKey(process.env.VAPID_PRIVATE_KEY);
// Valid fallback keys
const fallbackPublic = "BJgimrTgCLcXvp_P1leS8zy56ZKqfMueXM5iitrQyLMmA1swEho4wNXRovLGJdwP0mftM9-s-EkH_15PyiyM0aw";
const fallbackPrivate = "UKT36f_f6QUyadIQ0JK1PR4rD46bjeQVSCqDvmSfuO4";

const vapidPublicKey = envPublic || fallbackPublic;
const vapidPrivateKey = envPrivate || fallbackPrivate;
const vapidEmailInput = process.env.VAPID_EMAIL || "iz.karakarakarakan@gmail.com";
const vapidSubject = vapidEmailInput.startsWith('http') || vapidEmailInput.startsWith('mailto:')
  ? vapidEmailInput
  : `mailto:${cleanKey(vapidEmailInput)}`;

try {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
} catch (err: any) {
  console.error("Failed to set VAPID details with primary keys:", err.message);
  try {
    webpush.setVapidDetails(vapidSubject, fallbackPublic, fallbackPrivate);
    console.warn("Using FALLBACK VAPID keys because environment keys were invalid.");
  } catch (fallbackErr) {
    console.error("Even fallback VAPID keys failed! Push will not work.");
  }
}

const app = express();
const PORT = 3000;

// Initialize Redis client lazily
let redisClient: any = null;
const getRedisClient = async () => {
  if (redisClient) return redisClient;
  if (process.env.REDIS_URL) {
    try {
      redisClient = createClient({ url: process.env.REDIS_URL });
      redisClient.on('error', (err: any) => console.error('Redis Client Error', err));
      await redisClient.connect();
      console.log("Redis client connected");
      return redisClient;
    } catch (err) {
      console.error("Redis initialization error:", err);
      return null;
    }
  }
  return null;
};

app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Sync API Handler
const syncHandler = async (req: express.Request, res: express.Response) => {
  try {
    const { secretCode, localData } = req.body;
    if (!secretCode) return res.status(400).json({ error: "Secret code is required" });
    
    const client = await getRedisClient();
    if (!client) return res.status(500).json({ error: "Cloud sync is not configured." });

    const key = `scholar_sync_${secretCode}`;
    const cloudDataRaw = await client.get(key);
    const cloudData = cloudDataRaw ? JSON.parse(cloudDataRaw.toString()) : null;

    if (!localData) return res.json({ cloudData });

    if (cloudData && cloudData.lastUpdated) {
      const cloudTime = new Date(cloudData.lastUpdated).getTime();
      const localTime = new Date(localData.lastUpdated || 0).getTime();
      if (cloudTime > localTime && !req.body.forceOverwrite) {
        return res.status(409).json({ conflict: true, cloudData });
      }
    }

    if (!localData.lastUpdated) localData.lastUpdated = new Date().toISOString();
    await client.set(key, JSON.stringify(localData));
    res.json({ success: true, cloudData: localData });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ error: "Sync failed" });
  }
};

const deleteHandler = async (req: express.Request, res: express.Response) => {
  try {
    const { secretCode } = req.body;
    if (!secretCode) return res.status(400).json({ error: "Secret code is required" });
    
    const client = await getRedisClient();
    if (!client) return res.status(500).json({ error: "Cloud sync is not configured." });
    
    const key = `scholar_sync_${secretCode}`;
    await client.del(key);
    res.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Delete failed" });
  }
};

app.post("/api/sync", syncHandler);
app.post("/api/sync/", syncHandler);
app.delete("/api/sync", deleteHandler);
app.delete("/api/sync/", deleteHandler);

// Push Notification Routes
app.get("/api/push/vapid-public-key", (req, res) => {
  res.json({ publicKey: vapidPublicKey });
});

app.post("/api/push/subscribe", async (req, res) => {
  try {
    const { secretCode, subscription } = req.body;
    const client = await getRedisClient();
    if (!secretCode || !client) return res.status(400).json({ error: "Invalid request" });
    
    // Key for sets of subscriptions for this user
    const key = `scholar_push_subs_${secretCode}`;
    
    if (subscription === null) {
      await client.del(key);
      // Also clear legacy format
      await client.del(`scholar_push_sub_${secretCode}`);
      return res.json({ success: true, message: "All subscriptions cleared" });
    }
    
    // Use multi-device set storage (sync with api/push.ts)
    await client.sAdd(key, JSON.stringify(subscription));
    res.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    res.status(500).json({ error: "Subscribe failed" });
  }
});

app.post("/api/push/schedule", async (req, res) => {
  try {
    const { secretCode, delayMinutes, title, body, type } = req.body;
    const client = await getRedisClient();
    if (!secretCode || delayMinutes === undefined || !client) return res.status(400).json({ error: "Invalid request" });
    const targetTime = Date.now() + (delayMinutes * 60 * 1000);
    const task = { secretCode, title, body, type, targetTime };
    const taskStr = JSON.stringify(task);
    
    // Store quick ref for cancellation (sync with api/push.ts)
    await client.set(`scholar_push_task_ref_${secretCode}`, taskStr, { EX: 3600 });
    await client.zAdd('scholar_push_tasks', { score: targetTime, value: taskStr });
    
    res.json({ success: true, targetTime });
  } catch (error) {
    console.error("Schedule error:", error);
    res.status(500).json({ error: "Schedule failed" });
  }
});

app.post("/api/push/cancel", async (req, res) => {
  try {
    const { secretCode } = req.body;
    const client = await getRedisClient();
    if (!secretCode || !client) return res.status(400).json({ error: "Invalid request" });
    
    // 1. Try quick reference cancel
    const taskStr = await client.get(`scholar_push_task_ref_${secretCode}`);
    if (taskStr) {
      await client.zRem('scholar_push_tasks', taskStr);
      await client.del(`scholar_push_task_ref_${secretCode}`);
    } else {
      // 2. Fallback scan (Legacy/Emergency)
      const tasks = await client.zRange('scholar_push_tasks', 0, -1);
      for (const tStr of tasks) {
        const task = JSON.parse(tStr.toString());
        if (task.secretCode === secretCode) {
          await client.zRem('scholar_push_tasks', tStr.toString());
        }
      }
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Cancel error:", error);
    res.status(500).json({ error: "Cancel failed" });
  }
});

// Common logic for processing push queue
const processPushQueue = async (client: any) => {
  const now = Date.now();
  const tasks = await client.zRangeByScore('scholar_push_tasks', 0, now);
  let processed = 0;

  for (const taskStr of tasks) {
    const task = JSON.parse(taskStr.toString());
    
    // Try modern multi-device Key
    const subs = await client.sMembers(`scholar_push_subs_${task.secretCode}`);
    
    if (subs && subs.length > 0) {
      for (const subStr of subs) {
        const subscription = JSON.parse(subStr.toString());
        try {
          await webpush.sendNotification(subscription, JSON.stringify({
            title: task.title,
            body: task.body,
            data: { type: task.type }
          }));
        } catch (err: any) {
          const bodyMsg = err.body ? (typeof err.body === 'string' ? err.body : JSON.stringify(err.body)) : '';
          console.error(`Push failed for ${task.secretCode}:`, err.message, bodyMsg);
          
          if (err.statusCode === 410 || err.statusCode === 404 || err.statusCode === 400 || err.statusCode === 401 || err.statusCode === 403 || bodyMsg.includes('VapidPkHashMismatch')) {
            console.warn(`Removing invalid subscription for ${task.secretCode} due to error: ${err.message}`);
            await client.sRem(`scholar_push_subs_${task.secretCode}`, subStr);
          }
        }
      }
    } else {
      // Fallback for legacy single-sub key
      const subStr = await client.get(`scholar_push_sub_${task.secretCode}`);
      if (subStr) {
        const subscription = JSON.parse(subStr.toString());
        try {
          await webpush.sendNotification(subscription, JSON.stringify({
            title: task.title,
            body: task.body,
            data: { type: task.type }
          }));
        } catch (err: any) {
          const bodyMsg = err.body ? (typeof err.body === 'string' ? err.body : JSON.stringify(err.body)) : '';
          console.error(`Legacy push failed for ${task.secretCode}:`, err.message, bodyMsg);
          
          if (err.statusCode === 410 || err.statusCode === 404 || err.statusCode === 400 || err.statusCode === 401 || err.statusCode === 403 || bodyMsg.includes('VapidPkHashMismatch')) {
            console.warn(`Removing invalid legacy subscription for ${task.secretCode} due to error: ${err.message}`);
            await client.del(`scholar_push_sub_${task.secretCode}`);
          }
        }
      }
    }
    await client.zRem('scholar_push_tasks', taskStr.toString());
    processed++;
  }
  return processed;
};

app.get("/api/push/check", async (req, res) => {
  try {
    const client = await getRedisClient();
    if (!client) return res.status(500).json({ error: "Redis not configured" });
    const processed = await processPushQueue(client);
    res.json({ success: true, processed });
  } catch (error) {
    console.error("Manual check error:", error);
    res.status(500).json({ error: "Check failed" });
  }
});

// Polling loop for scheduled tasks (Only in non-Vercel environments)
const startScheduler = async () => {
  const client = await getRedisClient();
  if (client && !process.env.VERCEL) {
    setInterval(async () => {
      try {
        await processPushQueue(client);
      } catch (error) {
        console.error("Scheduler error:", error);
      }
    }, 10000);
  }
};

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Google OAuth Routes
app.get('/api/auth/google/url', (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const redirectUri = `${protocol}://${host}/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: process.env.OAUTH_CLIENT_ID || '',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/drive.appdata', // Google Drive appdata only
    access_type: 'offline', // For refresh token
    prompt: 'consent'
  });
  
  res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
});

app.get(['/auth/google/callback', '/auth/google/callback/'], async (req, res) => {
  const { code } = req.query;
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const redirectUri = `${protocol}://${host}/auth/google/callback`;

  if (!code) {
    return res.send('<html><body><p>Authentication failed: No code provided.</p></body></html>');
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.OAUTH_CLIENT_ID || '',
        client_secret: process.env.OAUTH_CLIENT_SECRET || '',
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }).toString()
    });

    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || tokens.error || 'Failed to exchange token');
    }

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'GOOGLE_OAUTH_SUCCESS', tokens: JSON.parse('${JSON.stringify(tokens)}') }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error("OAuth error:", error);
    res.send(`<html><body><p>Authentication failed: ${error.message}</p></body></html>`);
  }
});

async function startServer() {
  // Vite middleware
  try {
    if (process.env.NODE_ENV !== "production") {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
    }
  } catch (err) {
    console.error("Vite/Static middleware error:", err);
  }

  // Start scheduler for non-Vercel environments
  startScheduler();

  // Only listen if not on Vercel
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server listening on port ${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer().catch(err => console.error("Fatal startup error:", err));
}

export default app;
