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
- **Current Version:** v1.6.5
- **Last Update Date:** 2026-04-16

## Light Themes Definition
The following themes are considered "Light Themes" and require special CSS handling (e.g., avoiding white text on light backgrounds, using theme-aware colors for modals and charts):
- **Daylight** (`data-theme="daylight"`)
- **Warm Sun** (`data-theme="warm"`)
- **Candy** (`data-theme="candy"`)

## Push Notification Troubleshooting Protocols
Due to inconsistencies in Web Push delivery in various environments (Iframes, PWAs), follow this hierarchy:
1. **Execution Context:** Web Push is often blocked in cross-origin IFRAMES. Always test by opening the app in a **New Tab** or as an **Installed PWA**.
2. **Direct Permission Check:** Verify address bar shows "Allowed". 
3. **Service Worker Console:** Switch to `Application -> Service Workers -> Inspect` in DevTools to see SW-specific logs (`[Service Worker]`). Main console may skip these.
4. **OS Level:** Check Windows Focus Assist or macOS Do Not Disturb.
5. **Direct API Test:** Use the "Test Local Notification (Direct)" tool in Developer settings. If this fails, the browser/OS is blocking notifications globally.
6. **VAPID Integrity:** If VAPID keys change, "Clear Server Sub" + "Reset Service Worker" is mandatory.

## Task History
- **v1.6.5 (2026-04-16):** Security Hardening & Version Alignment.
  - *Security:* Removed hardcoded VAPID keys from `api/push.ts` to prevent credential leakage. Switched to strict Environment Variable usage.
  - *Config:* Updated `.env.example` with required notification secrets.
  - *Personalization:* Updated contact email in `api/push.ts`.
- **v1.6.4 (2026-04-16):** Narrowed focus to VAPID identity mismatch.
  - *Breakthrough:* "Direct UI" and "SW Thread" tests confirmed local notification system and Service Worker thread are functional.
  - *Current Problem:* Remote push (via FCM/WNS) is accepted by push services but silently dropped by the browser. 
  - *Root Cause:* Likely VAPID key mismatch between client subscription time and server sending time.
  - *Plan:* Implement "Deep Reset" to force re-handshake and add environment detection for Iframe risks.
- **v1.6.3 (2026-04-16):** Enhanced Push Troubleshooting.
  - *Analysis:* Delivery reported as `sent` by WNS/FCM but no receipt logged in client. Likely environment (Iframe) or OS blocking.
  - *Plan:* Add Direct Notification Test in Settings to isolate OS/Browser vs Push Service issues. Document troubleshooting protocols.
- **v1.6.2 (2026-04-16):** Added deep synchronization logic.
  - *Fix:* Auto-correct `pushEnabled` if subscription missing. Added "Clear Server Sub" and "Reset SW" tools.
- **v1.6.1 (2026-04-16):** Enhanced Service Worker logging and improved toggle error handling.
- **v1.6.0 (2026-04-16):** Diagnosed `processed: 0` and `401 Unauthorized` manifest errors.
  - *Analysis:* `processed: 0` is likely due to server/client clock drift or Redis latency. `401` on manifest is likely Vercel Deployment Protection.
  - *Plan:* Enhance `/api/push/check` with detailed debug info (queue count, server time) and optimize `vercel.json` routing.
- **v1.5.5 (2026-04-16):** Fixed Web Push Notification delivery by implementing automatic subscription syncing.
  - *Auto-Sync Logic:* Added a `useEffect` in `App.tsx` that automatically POSTs the browser's `PushSubscription` to `/api/push/subscribe` whenever `pushEnabled` is true and a `secretCode` is available.
  - *UI Enhancements:* Added a "Force Sync Notifications" button in General Settings.
  - *Developer Tools:* Added a "Notification Testing" section in Developer Settings to allow immediate testing of push notifications with custom content and real-time console logging of `/api/push/check` results.
  - *Bugfix:* Fixed a `ReferenceError` where developer notification states were defined in the wrong component scope.
- **v1.5.4 (2026-04-16):** Analyzed successful Push Subscription but failed notification delivery.
  - *Subscription Success:* Confirmed that the frontend can now successfully generate a valid `PushSubscription` object (WNS endpoint for Windows).
  - *Delivery Failure Analysis:*
    1. **Redis/SecretCode Sync**: Even if the browser subscribes, the subscription must be successfully POSTed to `/api/push/subscribe` with a valid `secretCode`.
    2. **Cron-Job Payload**: The Cron-Job triggers `/api/push/check`, which looks for tasks in Redis. If the timer logic doesn't correctly call `/api/push/schedule`, no tasks will exist.
    3. **Service Worker (sw.js) Event Handling**: The SW must correctly listen for the `push` event and call `self.registration.showNotification`.
  - *New Finding (no_subscription):* Confirmed that `/api/push/check` returns `status: "no_subscription"`. This proves the backend is finding the scheduled task but cannot find the corresponding push subscription in Redis.
  - *Root Cause:* The frontend is either not sending the subscription to the server, or it's being sent with a different `secretCode` than the one used to schedule the task.
  - *Feasibility:* High. We need to ensure the subscription is re-synced whenever the `secretCode` changes or the app initializes.
- **v1.5.3 (2026-04-14):** Analyzed ongoing Web Push Notification failures. 
  - *Toggle Failure Analysis:* Identified that the "System Notifications" toggle fails if:
    1. **Service Worker Registration hangs**: `navigator.serviceWorker.ready` never resolves if the SW isn't registered.
    2. **Invalid VAPID Key**: The current public key (`BOnH4u...`) is 68 chars (likely invalid; should be ~87 chars), causing `subscribe()` to fail.
    3. **Missing Redis/SecretCode**: Backend requires `REDIS_URL` and frontend requires `secretCode` to persist the subscription.
  - *Cron-Job Failure Analysis:* 
    1. **No Subscriptions**: If the toggle fails, no subscription is stored in Redis for the Cron-Job to use.
    2. **Task Score/Time**: Cron-Job only processes tasks where `targetTime <= now`.
    3. **VAPID Mismatch**: Backend keys must match the keys used for subscription.
- **v1.5.2 (2026-04-14):** Fixed CSS bugs related to Light Themes ("Daylight", "Warm Sun", "Candy"). Updated `CloudSyncModal` to use theme-aware colors for "Echoes of the Past Found", Help section, and confirmation dialogs. Added double-check confirmation prompts for "Keep Local" and "Download Cloud" buttons. Formatted dates to English with year. Updated `Stats` heatmap and efficiency trend chart to use theme-aware colors (`var(--color-indigo-500)`).
- **v1.5.1 (2026-04-14):** Fixed silent sync failure by stripping volatile fields (`lastUpdated`, `syncHistory`, `deviceType`, `pushSubscription`, `secretCode`) before comparison. Added side-by-side data comparison UI in `CloudSyncModal`. Updated Cloud Sync and Export Data to include the entire `localStorage` payload (`fullLocalStorage`) to ensure absolutely no user data (like timer settings) is missed.
- **v1.5.0 (2026-04-14):** Implemented Smart Cloud Sync (silent identical sync) and Device Tracking. Added `deviceType` to `UserState` and sync history. Updated `CloudSyncModal` to display Cloud and Local device types during conflicts and in the sync history view.
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
- **[Analysis] Web Push Notification Failures (v1.5.3):**
  - *Current State:* Notifications are still failing despite VAPID keys and Vercel Cron endpoints being added.
  - *Possible Root Causes:*
    1. **Vercel Cron Limitations (Hobby Tier):** Vercel's free tier only allows 1 cron job execution per day. If we rely on cron to check Redis and send notifications, they will not arrive in real-time.
    2. **iOS/Safari Restrictions:** Web Push on iOS requires the app to be installed to the Home Screen (PWA) and requires iOS 16.4+. It will silently fail in a standard Safari tab.
    3. **Redis Connection Timeouts:** In a serverless environment, the Redis connection might be dropping or failing to connect in time, meaning scheduled pushes are never retrieved.
    4. **Service Worker Scope/Lifecycle:** Vite's PWA plugin might be overriding our custom `sw.js`, or the service worker is going to sleep and failing to wake up for the push event.
    5. **Missing/Invalid VAPID Env Vars:** The Vercel environment variables (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`) might be missing or incorrectly formatted in the Vercel dashboard.
  - *Feasibility & Next Steps:*
    - **Cron Fix:** Very difficult on Vercel Hobby. *Alternative:* Switch to client-side scheduling (using Service Worker `setTimeout`, though unreliable) or trigger the check endpoint (`/api/push/check`) on every app load/interaction instead of relying solely on Cron.
    - **iOS Fix:** Cannot fix via code. Must add UI to detect iOS and prompt the user to "Add to Home Screen" before enabling notifications.
    - **Redis Fix:** Add robust error logging to the `/api/push/check` endpoint to see if Redis is the bottleneck.
- **[Bugfix & Feature] Fix Silent Sync & Add Data Comparison UI (v1.5.1):**
  - *Analysis of Silent Sync Failure:*
    1. **Root Cause:** The `JSON.stringify` comparison in `useCloudSync.ts` is too strict. While we ignored `lastUpdated`, we forgot to ignore other volatile fields. Specifically, `syncHistory` is different between local and cloud (every sync adds an event, and local might have a different history length), `deviceType` might differ, and `pushSubscription` might differ. If any of these differ, `JSON.stringify` returns false, triggering the modal.
    2. **Fix Plan:** Create a robust `compareGameStates` utility function. This function will explicitly strip out volatile fields (`lastUpdated`, `syncHistory`, `deviceType`, `pushSubscription`, `secretCode`) from both local and cloud states before performing a deep comparison.
  - *Feasibility of Data Comparison UI:*
    1. **Feasibility:** Highly feasible. We already have `syncCheckResult.cloudData.state` and the local `state` available in `CloudSyncModal.tsx`.
    2. **Action Plan:** Redesign the conflict view in `CloudSyncModal.tsx`. Instead of just showing the cloud level and time, we will create a side-by-side comparison table/grid showing: Level, Coins, Total Sessions (history length), Device Type, and Last Updated Time for BOTH Local and Cloud. We can highlight the higher values in green to make it obvious which save is more advanced.
- Fix performance issues causing lag (state colocation for Timer - partially addressed with memoization).
- Further optimize state management if lag persists.
