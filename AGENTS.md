# Project Tracker & Agent Instructions

## Role & Workflow
You are an AI assistant maintaining the "Scholar's Dungeon" project. 
At the start of every interaction, you automatically read this file (injected into your system prompt).

**CRITICAL RULE FOR EVERY UPDATE:**
Whenever you complete a task or make changes to the application:
1. Update the `Current Version` and `Last Update Date` in this `AGENTS.md` file.
2. Log the completed task in the `Task History` section below.
3. Update the version number and release date in `src/components/Settings.tsx` (under the 'about' section) to match the new version and date.

**VERSIONING POLICY (x.y.z):**
- **x (Major):** Critical architectural changes or full-scale system overhauls.
- **y (Minor):** New features, significant UI additions, or functional enhancements.
- **z (Patch):** Bug fixes, micro-optimizations, documentation updates, and UI refinements.

**CSS & UI STANDARDS:**
- **Full-Screen Modals:** Whenever creating a "full-screen" centered modal (especially `fixed inset-0`), you MUST use `createPortal(..., document.body)` from `react-dom` to render the modal directly on the `body`. If you do not use `createPortal`, parent elements with CSS `transform`, `filter`, or `perspective` will establish unintended containing blocks that capture the `fixed` positioning, causing the modal to appear in the middle of a scrolling page container instead of the actual screen view. Never make this mistake again.
- **Italic Clipping:** To prevent right-side clipping of italic text (especially in browsers with tight bounding boxes), always add a small right padding (e.g., `pr-1` or `px-0.5`) to the element or its immediate container.
- **Red Dot / Notification Placement:** Unread message or notification badges (red dots) on icons and buttons MUST ALWAYS be placed in the bottom-right corner (e.g. `absolute -bottom-0.5 -right-0.5`), NEVER in the top-right corner.
- **Touch-Friendly Controls:** Delete buttons or other critical actions MUST NOT be hover-only (e.g. `opacity-0 group-hover:opacity-100`), as this is unfriendly to touch-screen users. They should be visible or adapt properly for mobile devices.
- **Theme-Aware Colors & Minimalist UI:** We have 6 different theme colors. Every color choice (especially backgrounds, progress bars, or buttons) MUST consider all themes to maintain a minimalist and premium aesthetic. Avoid thick, flashy, or hardcoded colors like `bg-emerald-500` which may look jarring or "rough" (粗率) in certain themes. Rely on theme-aware colors (`indigo-300`, `indigo-400`, `indigo-500`, `indigo-600`) or neutral slate colors with opacity. DO NOT use `indigo-200` or `indigo-700`+ for primary themed elements, as they will appear in the default blue color across all themes.

## Current Status
- **Current Version:** v8.1.1
- **Last Update Date:** 2026-06-04
- **Last Update Time:** 15:15:00

## Dark Themes Definition
The following themes are considered "Dark Themes" and form the baseline for vibrant visual effects and high-contrast glowing elements:
- **Night** (`data-theme="night"`)
- **Forest** (`data-theme="forest"`)
- **Ocean** (`data-theme="ocean"`)

## Light Themes Definition
The following themes are considered "Light Themes" and require special CSS handling (e.g., avoiding white text on light backgrounds, using theme-aware colors for modals and charts):
- **Daylight** (`data-theme="daylight"`)
- **Warm Sun** (`state.theme === "warm"`)
- **Candy** (`state.theme === "candy"`)

## Push Notification Troubleshooting Protocols
Due to inconsistencies in Web Push delivery in various environments (Iframes, PWAs), follow this hierarchy:
1. **Execution Context:** Web Push is often blocked in cross-origin IFRAMES. Always test by opening the app in a **New Tab** or as an **Installed PWA**.
2. **Direct Permission Check:** Verify address bar shows "Allowed". 
3. **Service Worker Console:** Switch to `Application -> Service Workers -> Inspect` in DevTools to see SW-specific logs (`[Service Worker]`). Main console may skip these.
4. **OS Level:** Check Windows Focus Assist or macOS Do Not Disturb.
5. **Direct API Test:** Use the "Test Local Notification (Direct)" tool in Developer settings. If this fails, the browser/OS is blocking notifications globally.
6. **VAPID Integrity:** If VAPID keys change, "Clear Server Sub" + "Reset Service Worker" is mandatory.


## Task History

- **v8.1.1 (2026-06-04):** Vercel Deployment Unblock.
  - *Architecture:* Completely removed the `crons` directive from `vercel.json`. Vercel's Hobby Tier imposes strict scheduling suspensions; hitting limits repeatedly disabled the deployment webhook entirely. We now rely exclusively on background clients or manual syncs.

- **v8.1.0 (2026-06-04):** Sanctum Plaza, Fellowship Era & Ultimate V8 Upgrades.
  - *Feature:* **Sanctum Plaza**: Overhauled the placeholder public guilds screen into a localized, premium English "Sanctum Plaza" under-construction layout under the stately Lucide `Landmark` icon.
  - *Feature:* **Fellowship Modules**: Fully integrated multi-user guilds with custom goal systems, target rewards, shared active group messaging, and team contribution pie charts.
  - *Feature:* **Real-time Profiles**: Synchronized individual levels, custom titles, bios, and avatar visuals directly with remote database entries.
  - *Feature:* **Unified Pickers**: Introduced system-wide, customized input DatePicker and TimePicker popups, completely bypassing messy native OS input modules.
  - *Feature:* **Sleep Trackers & Bulk Editor**: Equipped sleep tracking with composed activity charts alongside a continuous multi-entry Bulk Sleep record editor.
  - *Feature:* **Vercel Analytics**: Instrumented `@vercel/analytics` directly into entry boot to capture performance, rendering, and loading latency telemetry in real-time.
  - *Bug Fix:* **Web Push Policies**: Realigned serverless check cron constraints in `vercel.json` to abide by precise quota limitations of Vercel Hobby tier.
  - *Bug Fix:* **Audio Focus Handling**: Dismantled obsolete background loops to strictly avoid interference with local device music (Spotify, Apple Music) or system focus states.
  - *Doc:* **Archive Sync**: Programmatically moved prior development logs (v6.0.0 through v8.0.1) into `/versionArchive.md`, initializing a streamlined new chapter.

*Note: All historical logs from v1.0.0 to v8.0.1 have been successfully archived in `versionArchive.md` to sustain project tracker performance under optimal bounds.*
