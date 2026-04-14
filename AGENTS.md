# Project Tracker & Agent Instructions

## Role & Workflow
You are an AI assistant maintaining the "Scholar's Dungeon" project. 
At the start of every interaction, you automatically read this file (injected into your system prompt).

**CRITICAL RULE FOR EVERY UPDATE:**
Whenever you complete a task or make changes to the application:
1. Update the `Current Version` and `Last Update Date` in this `AGENTS.md` file.
2. Log the completed task in the `Task History` section below.
3. Update the version number and release date in `src/components/Settings.tsx` (under the 'about' section) to match the new version and date.

## Current Status
- **Current Version:** v1.4.11
- **Last Update Date:** 2026-04-14

## Task History
- **v1.4.11 (2026-04-14):** Fixed Web Push Notifications on Vercel. Added `/api/push/vapid-public-key` endpoint to serve the VAPID key to the frontend (resolving Vite env var issues) and added rewrite rules in `vercel.json` for `/api/push/*`.
- **v1.4.10 (2026-04-13):** Analyzed Web Push Notification failures on Vercel. Documented root causes (Vite env vars, Vercel routing, and Hobby plan cron limits) in AGENTS.md.
- **v1.4.9 (2026-04-13):** Fixed "Missing localData" error in Vercel cloud sync. Restored API contract in `api/sync.ts` (handling POST-as-fetch, DELETE, and conflict resolution) and added fallback parsing for stringified `req.body`.
- **v1.4.8 (2026-04-13):** Analyzed "Missing localData" error in Vercel cloud sync. Documented root causes (Content-Type header, payload structure, or JSON parsing issues) in AGENTS.md for upcoming fix.
- **v1.4.7 (2026-04-12):** Fixed Cloud Sync missing Dungeon settings. Added stock management and custom icon selection for Shop items. Updated SplashScreen version display.
- **v1.4.6 (2026-04-12):** Enhanced Explore & Sync logic. Focus sessions now auto-start Rest even if Loop is disabled. Added automatic cloud sync check on app launch. Added "Download from Cloud" button to Astral Archives.
- **v1.4.5 (2026-04-12):** Fixed Push Notifications on Vercel. Added `/api/push/check` endpoint and Vercel Cron Job configuration to process scheduled notifications in a serverless environment.
- **v1.4.4 (2026-04-12):** UI/UX Polish. Added Dungeon progress to Explore fullscreen mode. Refactored SplashScreen (removed ring, dynamic colors, version display). Fixed Timer reset bug when Loop is disabled. Simplified PWA icon and updated manifest title.
- **v1.4.3 (2026-04-12):** Refactored API to use standalone Vercel Serverless Functions. Created api/sync.ts, api/push.ts, and api/health.ts to resolve ESM module resolution errors on Vercel.
- **v1.4.2 (2026-04-12):** Improved Redis connection handling for Vercel serverless environments. Implemented lazy connection and simplified vercel.json routing.
- **v1.4.1 (2026-04-12):** Added Vercel deployment support. Created vercel.json for API routing, refactored server.ts to export the app for serverless functions, and added api/index.ts entry point.
- **v1.4.0 (2026-04-12):** Refactored notification settings. Created a dedicated "System Notifications" section in General Settings and replaced the button-based toggle with a switch component.
- **v1.3.1 (2026-04-12):** Fixed Cloud Sync 404 error by adding trailing slash support to API routes and updating frontend fetch calls. Added server-side request logging and JSON 404/error handlers for better diagnostics.
- **v1.3.0 (2026-04-12):** Implemented cross-platform Web Push notifications. Added Redis-based server-side scheduling, Service Worker push handling, and UI settings for notification management.
- **v1.2.2 (2026-04-12):** Fixed mobile sync and import issues. Added trailing slash support to API routes, improved JSON response validation in frontend, and expanded file picker `accept` types for JSON import.
- **v1.2.1 (2026-04-12):** Diagnosed mobile sync and import issues. Identified root causes: 404 HTML response for cloud sync (routing/trailing slash issues) and file picker restrictions for JSON import on mobile.
- **v1.2.0 (2026-04-12):** Performance & UI Polish. Fixed bottom bar jittering (AnimatePresence mode="wait"). Implemented elegant overlay scrollbars. Optimized performance using React.memo for heavy components.
- **v1.1.0 (2026-04-12):** Created project tracker (`AGENTS.md`). Added version and release date to Settings -> About page.
- **v1.0.1 (2026-04-12):** Upgraded PWA installation experience (sword icon, splash screen animation).
- **v1.0.0:** Initial release and subsequent security/UI enhancements (Cloud Sync confirmations, history tracking, etc.).

## Pending Tasks
- Fix performance issues causing lag (state colocation for Timer - partially addressed with memoization).
- Further optimize state management if lag persists.
