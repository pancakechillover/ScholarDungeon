import { createClient } from 'redis';
import webpush from 'web-push';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Configure Web Push
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || "BLqju80Sl3cUDF0s-0pEallPIkVpxl-2l5NJMh-X2twNOmvTUU4q1Q2yotukIZEEt92QANtsukbTwk6L7I7LITo";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "OKWnQn0E_X2HGGAVFydaCJA_3_IWTZZIhmtDENJTUgo";
const vapidEmail = process.env.VAPID_EMAIL || "mailto:iz.karakarakarakan@gmail.com";

try {
  webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);
} catch (err) {
  console.error("Failed to set VAPID details:", err);
}

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
  const path = req.url?.split('?')[0];

  if (path?.endsWith('/vapid-public-key')) {
    return res.json({ publicKey: vapidPublicKey });
  }

  const client = await getRedisClient();
  if (!client) return res.status(500).json({ error: "Redis connection failed" });

  if (path?.endsWith('/subscribe')) {
    try {
      const { secretCode, subscription } = req.body;
      if (!secretCode) return res.status(400).json({ error: "Invalid request" });
      const key = `scholar_push_sub_${secretCode}`;
      
      if (subscription === null) {
        await client.del(key);
        return res.json({ success: true, message: "Subscription cleared" });
      }
      
      await client.set(key, JSON.stringify(subscription));
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: "Subscribe failed" });
    }
  }

  if (path?.endsWith('/schedule')) {
    try {
      const { secretCode, delayMinutes, title, body, type } = req.body;
      if (!secretCode || delayMinutes === undefined) return res.status(400).json({ error: "Invalid request" });
      const targetTime = Date.now() + (delayMinutes * 60 * 1000);
      const task = { secretCode, title, body, type, targetTime };
      await client.zAdd('scholar_push_tasks', { score: targetTime, value: JSON.stringify(task) });
      return res.json({ success: true, targetTime });
    } catch (error) {
      return res.status(500).json({ error: "Schedule failed" });
    }
  }

  if (path?.endsWith('/cancel')) {
    try {
      const { secretCode } = req.body;
      if (!secretCode) return res.status(400).json({ error: "Invalid request" });
      const tasks = await client.zRange('scholar_push_tasks', 0, -1);
      for (const taskStr of tasks) {
        const task = JSON.parse(taskStr.toString());
        if (task.secretCode === secretCode) {
          await client.zRem('scholar_push_tasks', taskStr.toString());
        }
      }
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: "Cancel failed" });
    }
  }

  if (path?.endsWith('/check')) {
    try {
      const now = Date.now();
      // Get all tasks that are due
      const tasks = await client.zRangeByScore('scholar_push_tasks', 0, now);
      
      // Get total count for debug
      const totalCount = await client.zCard('scholar_push_tasks');
      // Get the very next task time
      const nextTasks = await client.zRangeWithScores('scholar_push_tasks', 0, 0);
      const nextTaskTime = nextTasks.length > 0 ? nextTasks[0].score : null;

      const results = [];

      for (const taskStr of tasks) {
        const task = JSON.parse(taskStr.toString());
        const subStr = await client.get(`scholar_push_sub_${task.secretCode}`);
        
        if (subStr) {
          const subscription = JSON.parse(subStr.toString());
          try {
            await webpush.sendNotification(subscription, JSON.stringify({
              title: task.title,
              body: task.body,
              data: task.data || { type: task.type }
            }));
            results.push({ secretCode: task.secretCode, status: 'sent' });
          } catch (err: any) {
            console.error(`Push failed for ${task.secretCode}:`, err.message, err.statusCode);
            const errorDetail = {
              message: err.message,
              statusCode: err.statusCode,
              endpoint: subscription.endpoint.substring(0, 30) + '...'
            };
            
            if (err.statusCode === 410 || err.statusCode === 404) {
              await client.del(`scholar_push_sub_${task.secretCode}`);
            }
            results.push({ secretCode: task.secretCode, status: 'failed', error: errorDetail });
          }
        } else {
          results.push({ secretCode: task.secretCode, status: 'no_subscription' });
        }
        await client.zRem('scholar_push_tasks', taskStr.toString());
      }

      return res.json({ 
        success: true, 
        processed: tasks.length, 
        debug: {
          serverTime: now,
          totalPendingInQueue: totalCount,
          nextTaskDueAt: nextTaskTime,
          timeUntilNextMs: nextTaskTime ? nextTaskTime - now : null
        },
        results 
      });
    } catch (error) {
      console.error("Check error:", error);
      return res.status(500).json({ error: "Check failed" });
    }
  }

  return res.status(404).json({ error: "Not found" });
}
