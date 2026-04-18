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
- **Current Version:** v1.9.8
- **Last Update Date:** 2026-04-18

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
- **v1.9.8 (2026-04-18):** Enhanced Gacha Scratch-off mechanics.
  - *Feature:* Upgraded the "Scratch-off" system with realistic brushed-metal textures, shimmer highlights, and ICHIBAN watermarks. Added sound feedback for successful reveals.
  - *UI Adjust:* Moved the "Draw Animation" setting to the top of the "General" settings for better discoverability.
  - *Logic:* Implemented "Scratch-to-Claim" logic. Modals now prevent accidental closing during scratching and require all cards to be revealed before the "Claim Rewards" button appears.
- **v1.9.7 (2026-04-18):** New Feature: Interactive Scratch-off Ichiban/Gacha.
  - *Feature:* Implemented a high-fidelity "Scratch-off" card effect for ICHIBAN and Gacha results. Players can now physically "scratch" the card using mouse or touch to reveal their rewards, complete with metallic textures, watermarks, and particle effects.
  - *UI Adjust:* Added a new setting in "Settings > Appearance" to toggle between "Card Flip" and "Scratch-off" animations for both Gacha and Ichiban pulls.
- **v1.9.6 (2026-04-18):** Micro-Responsive Polish (Exploration Card).
  - *UI Adjust:* Further refined the minimum font-size for Active Dungeon titles on ultra-mobile viewports (`clamp` floor lowered to 0.625rem). This ensures layout stability for users with exceptionally long dungeon naming conventions without compromising the aesthetic "Black" font-weight impact.
- **v1.9.5 (2026-04-18):** Micro-Responsive Polish (Explore Tab).
  - *UI Adjust:* Refined the "Active Dungeon" card in the Explore tab for maximum mobile compatibility. Reduced padding, minimized icon sizes (Sword/Target), and adjusted the fluid font-size clamp to ensure the dungeon name and progress fit perfectly on ultra-narrow viewports without vertical or horizontal overflow.
- **v1.9.4 (2026-04-18):** Bugfix: Permanent Quest Checkboxes.
  - *Fix (Backend Logic):* Discovered a core lifecycle flaw where daily/weekly/monthly quests were resetting their `completed` state across date boundaries but failing to properly reset their `claimed` boolean tracking. This caused newly reset routine tasks to be permanently locked out of granting rewards. Hardcoded explicit `claimed: false` reset instructions into the `useGameState` chronological boundary loops.
  - *Fix (Frontend rendering):* Upgraded the `QuestManager` completion indicator ternary loop. Made `CheckSquare` rendering strictly dependent on BOTH `completed == true` AND `claimed == true` to prevent erroneously checking off altered or glitched targets.
- **v1.9.3 (2026-04-18):** Bugfix: Quest Duplicate Checkboxes.
  - *Fix:* Resolved an edge case bug where editing a previously cleared/claimed Quest's target to a higher number caused both the `CheckSquare` (from `claimed == true`) and `Square` (from `completed == false`) logic gates to fire simultaneously. Refactored the UI block to a strict mutually exclusive ternary operation so only one indicator or button can ever render.
- **v1.9.2 (2026-04-18):** Edit Mode across Quests and Achievements.
  - *Feature:* Expanded the unified "Edit Mode" from the main Dungeon Manager into the "Quests" and "Achievements" sections. Structure modification actions (editing, deleting, reordering) are securely hidden behind user toggle.
  - *UI Adjust:* Refactored completion markers on Quests/Achievements array. Swapped static "Claimed" label arrays with dynamic interactive Lucide CheckSquare/Square elements, maintaining 100% cohesion with Dungeon tracker aesthetics.
- **v1.9.1 (2026-04-18):** Dungeons Edit Mode & Explore Rewrite.
  - *Feature:* Renamed "Simple Mode" to "Edit Mode" with a Pen icon and moved it globally to the top header (`App.tsx` PageHeader) next to the "Add Dungeon" button (`+`). Editing actions are now gated behind toggling "Edit Mode" on.
  - *Responsive Polish:* Completely rewrote the `Active Dungeon` module inside the "Explore" tab. It now features an interactive layered card design with smooth 0-min widths and proper DOM hierarchy for `truncate`, ensuring long dungeon names safely hide with an ellipsis ("...") instead of blowing out the side editing buttons on varying viewport sizes.
  - *Bugfix:* Patched `Major Dungeon` and `Sub Dungeon` lists inside `DungeonManager` to use `<div className="min-w-0 flex-1">` wraps so native CSS flexbox truncate handles long strings flawlessly across all devices.
- **v1.9.0 (2026-04-18):** Dungeon Manager Simple Mode & Fluid Layouts.
  - *Feature:* Added a "Simple Mode: On/Off" toggle to the Dungeon Manager list that visually hides bulk action buttons (edit, delete, create nested sub-dungeon).
  - *Feature:* Replaced bare "Cleared" text labels on Sub-Dungeons with a modern Lucide checkbox indicator (CheckSquare/Square) that dynamically reflects their 100% completion status.
  - *Responsive Polish:* Upgraded Active Dungeon text scaling across Sanctum and Explore sections using CSS `clamp()` for perfectly fluid resizing on all viewport widths, ensuring it isn't just bound by `sm:` breakpoints.
- **v1.8.9 (2026-04-18):** Micro-Responsive Polish.
  - *Fix:* Adjusted Active Dungeon card padding and font sizes (`text-[9px] sm:text-xs`) across Sanctum and Explore components to prevent horizontal text overflow on ultra-narrow screens (e.g., iPhone SE).
- **v1.8.8 (2026-04-18):** VAPID Key Error Handling & Resilience.
  - *Fix:* Resolved "Vapid public key should be 65 bytes long when decoded." errors caused by malformed environment variables. Added string sanitization (stripping quotes, whitespace) and a robust `try/catch` fallback mechanism in both `server.ts` and `api/push.ts`. The push server now automatically recovers using valid internal fallback keys if user-supplied keys in `.env` are broken.
- **v1.8.7 (2026-04-18):** Responsive UI Patches & Dungeon Link Routing. 
  - *Fix:* Re-structured the flexbox layout in Sanctum and Explore "Active Dungeon" components to use `flex-col sm:flex-row`, preventing long dungeon names from overlapping with status labels on narrow phone screens (`truncate` added to titles).
  - *Enhancement:* Upgraded the "View Details" button in the Record (`DungeonManager`) page. Clicking it now dynamically expands the correct parent Major Dungeon and uses `scrollIntoView` to seamlessly scroll to the target Sub-Dungeon row.
- **v1.8.6 (2026-04-18):** Global Scrollbar Annihilation - The Final CSS Spec.
  - *Analysis:* The user identified a continuing double-scrollbar mechanism. While `overflow-x-hidden` was removed from `App.tsx`'s transition wrapper in 1.8.5, the absolute root (`<div id="root">`) in `index.css` *also* still contained `overflow-x: hidden`. According to CSS spec, any `overflow-x: hidden` forces `overflow-y: auto`. Therefore, `#root` itself was acting as the secondary dynamic scroll container when child animations popped out.
  - *Fix:* Upgraded both `body` and `#root` CSS properties to use `overflow-x: clip;` instead of `hidden`. The powerful `clip` property completely severs the CSS `overflow-y: auto` auto-generation loop, allowing content to bleed out vertically (to be caught by the safe `html { overflow-y: scroll }`) without ever spawning an internal root scrollbar again. No secondary scrollbar = zero horizontal layout collapse.
- **v1.8.5 (2026-04-18):** Fixed Page Transition Jitter / Double Scrollbar Conflict.
  - *Analysis:* Found the root cause of the horizontal width snapping during tab transitions (especially Sanctum, Merchant, Record). The main `max-w-[1600px]` transition wrapper had an `overflow-x-hidden` class. During `AnimatePresence popLayout` mode, when a tall exiting component became `position: absolute`, the wrapper physically shrunk to the height of the incoming short component. Because the wrapper had `overflow-x-hidden`, the CSS engine automatically computed its `overflow-y` to `auto`, instantly spawning a new, temporary "small scrollbar" strictly for that wrapper to contain the tall but exiting absolute child. This inner scrollbar shifted the incoming content leftward by 6px, then vanished when the exit animation finished, causing the layout swap jump.
  - *Fix:* Removed `overflow-x-hidden` from the `relative max-w-[1600px]` transition wrapper in `App.tsx`. The horizontal boundary is cleanly managed by `#root` instead, allowing the exit absolute elements to gracefully visually clear the vertical bounding box without triggering any interior nested scrollbars.
- **v1.8.4 (2026-04-18):** Global Scrollbar Lock Architecture.
  - *Analysis:* Resolved layout jitter dynamically caused by `<html>` scrollbar creation/deletion during `Framer Motion popLayout` absolute rendering.
  - *Fix:* Shifted scrolling responsibility from `#root` to the native `html` element. Added `html { scrollbar-gutter: stable; overflow-y: scroll; }` and removed `overflow: hidden` on body. This establishes an unshakeable browser-level vertical scroll track, severing the link between content height and horizontal expansion.
- **v1.8.3 (2026-04-18):** Perfected Page Transition Layout Stability & Fixed Console Warnings.
  - *Fix (Recharts):* Added `minWidth={1}` and `minHeight={1}` to all `<ResponsiveContainer>` components in `Stats.tsx`. This eliminates the persistent `The width(-1) and height(-1) of chart should be greater than 0` warnings in the console caused by Recharts initializing during Framer Motion's virtual DOM absolute-positioning phase before physical dimensions resolve.
  - *Fix (Scrollbar):* Forced `overflow-y: scroll` on `#root` to permanently reserve physical scrollbar space, eliminating the 6px horizontal layout jump when transitioning between short and long pages.
  - *Fix (Animation):* Removed `inset-x-0` bounds from `motion.div` containers in `App.tsx` and `Shop.tsx` to stop absolute positioning conflicts with framer-motion's `popLayout` engine during the 6px width recalculations.
- **v1.8.2 (2026-04-18):** Advanced Layout Stability for Merchant Page.
  - *Fix (Jitter):* Enforced `w-full` and `left-0` on all tab transition containers in `App.tsx` to stabilize `popLayout` absolute positioning.
  - *Fix (Shop):* Verticalized all internal tab animations in `Shop.tsx` and ensured 100% width on all sub-containers to prevent sub-pixel horizontal shifts during deep nesting.
- **v1.8.1 (2026-04-17):** Critical Transition Jitter Fix.
  - *Fix (Jitter):* Switched all tab transitions from horizontal (`x`) to vertical (`y`) movement. This completely circumvents horizontal sub-pixel calculation errors and `mx-auto` layout shifts during `popLayout` absolute positioning.
  - *Fix (Layout):* Added `scrollbar-gutter: stable` to global CSS to prevent the entire page from shifting horizontally when scrollbars appear or disappear between tabs of different heights.
- **v1.8.0 (2026-04-17):** Layout and Chart Stability.
  - *Fix (Recharts):* Added `min-height` to all chart containers in `Stats.tsx`. This resolves the "width/height (-1)" warnings caused by Recharts elements being initialized before the parent container's dimensions were fully calculated by the browser during tab transitions.
- **v1.7.9 (2026-04-17):** Push Notification Stability & Performance.
  - *Fix (NetworkError):* Resolved `NetworkError` when canceling push by removing `timeLeft` from the scheduling `useEffect` in `Timer.tsx`. This stops the app from sending rescheduling requests every single second.
  - *Optimization (Backend):* Refactored `api/push.ts` to use a O(1) task reference lookup for cancellations, replacing the previous O(N) loop that scanned the entire task queue.
- **v1.7.8 (2026-04-17):** Mobile Polish & UI Adjustments.
  - *Fix (Jitter):* Added `w-full` class to all tab root `motion.div` containers inside `AnimatePresence`. This prevents `popLayout`'s `position: absolute` from causing a momentary width collapse and sub-pixel snapping reflow during transitions on mobile devices.
  - *UI Adjust:* Relocated the notification red dot on the bottom navigation bar (`MobileNavItem`) from the top-right (`-top-1 -right-1`) to the bottom-right (`-bottom-0 -right-1`) to better align with game UI conventions.
- **v1.7.7 (2026-04-17):** Fixed UI Right-side Black Border.
  - *Analysis:* Found that `body` had `background: black;`, which was exposed when navigating because `AnimatePresence popLayout` turns exiting elements to `position: absolute`, stretching viewport horizontally.
  - *Fix:* Added `overflow-x: hidden` to `#root`, removed hardcoded explicit `background: black;` inside `index.css`, and placed `relative` block on the main animating container in `App.tsx` (`max-w-[1600px]`).
- **v1.7.6 (2026-04-17):** Minor refactor and prep for layout fixing.
- **v1.7.4 (2026-04-16):** Stability & Layout Polish.
  - *Fix:* Removed global layout transitions causing jitter during Tab switching.
  - *Fix:* Switched to Framer Motion `mode="popLayout"` to stabilize content entry/exit and prevent vertical layout jumps.
  - *Fix:* Implemented root-level `overscroll-behavior: none` to prevent iPad PWA black edges when dragging.
  - *Fix:* Relocated mobile bottom bar padding to the content wrapper to stabilize header position.
- **v1.7.3 (2026-04-16):** Polished UI/UX. Fixed tablet fullscreen timer text size, added description field to sub-dungeons, fixed clipping of italic dungeon names, and corrected viewport meta tag to prevent zooming issues on tablet PWAs.
- **v1.7.2 (2026-04-16):** Fixed Android PWA 'push service error' by injecting generic gcm_sender_id into manifest.
- **v1.7.1 (2026-04-16):** Android/PWA Compatibility & Multi-Device Sync logic Fix.
  - *UI:* Added detailed `alert` error messages in `Settings.tsx` to debug Android/PWA subscription failures.
  - *Logic:* Added 10-second timeout to Service Worker registration to prevent UI lockup.
  - *Multi-Device:* Added `deviceInfo` tracking during subscription to help server distinguish browsers.
- **v1.7.0 (2026-04-16):** Enhanced Navigation & Sync Stability.
  - *UI:* Added "Back to Dungeon" button to reward modals and notification actions.
  - *Bugfix:* Fixed bug where downloading cloud saves re-triggered all previous level-up popups by syncing `prevLevel` during active synchronization.
  - *Service Worker:* Upgraded to v1.7.0 with consistent "Back to Dungeon" action labels.
- **v1.6.6 (2026-04-16):** Multi-Device Synchronization & Notification Fallbacks.
  - *Backend:* Implemented Redis Set-based subscription storage in `api/push.ts` to support multiple devices per `secretCode` (e.g., Firefox and Edge simultaneously).
  - *Timer:* Added local `navigator.serviceWorker.showNotification` fallback when the tab is active.
  - *Logic:* Fixed bug where naturally finishing timers incorrectly cancelled server-side push tasks.
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
