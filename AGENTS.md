# Project Tracker & Agent Instructions

## Role & Workflow
You are an AI assistant maintaining the "Scholar's Dungeon" project. 
At the start of every interaction, you automatically read this file (injected into your system prompt).

**ACTIVE DEVELOPMENT DIRECTIVE:**
- Currently developing features step-by-step strictly according to the multi-phase implementation roadmap in `Plan.md` (Workstation Presence & Target Focus Time Upgrade).

**CRITICAL RULE FOR EVERY UPDATE:**
We now separate updates into **Preview Updates** (预览更新) and **Official Updates** (正式更新):

**1. Preview Updates (预览更新 - Default):**
- Update the `APP_VERSION` in `src/version.ts`.
- Update the `Current Version` and `Last Update Date` in this `AGENTS.md` file.
- Log the completed task in the `Task History` section below.
- *Do not* modify `RELEASE_HISTORY` in `src/version.ts` or `public/version.json`.

**2. Official Updates (正式更新 - Only when requested):**
- Do all the steps for Preview Updates.
- Aggregate all features/fixes logged in `AGENTS.md` since the last Official Update.
- Write a comprehensive changelog summarizing these updates.
- Update `RELEASE_HISTORY` in `src/version.ts` with this aggregated changelog.
- Update `public/version.json` with the new version and changelog to trigger the app update popup.

**VERSIONING POLICY (x.y.z):**
- **x (Major):** Critical architectural changes or full-scale system overhauls.
- **y (Minor):** New features, significant UI additions, or functional enhancements.
- **z (Patch):** Bug fixes, micro-optimizations, documentation updates, and UI refinements.

**COMMUNICATION RULE:**
- You MUST ALWAYS reply to the user in Chinese (Simplified). This is an absolute requirement for every response you give.

**CSS & UI STANDARDS:**
- **Strict English UI Standard:** All UI elements across the application (labels, titles, headings, buttons, badges, tabs, tooltips, placeholders, modal dialogs, and settings descriptions) MUST strictly and exclusively be in English. NEVER use Chinese characters or bilingual slash labels (such as `English / 中文`) in the application interface or code. (Note: The assistant still replies to the user in Chinese (Simplified) during chat interactions, but the app UI itself is 100% pure English).
- **Full-Screen Modals:** Whenever creating a "full-screen" centered modal (especially `fixed inset-0`), you MUST use `createPortal(..., document.body)` from `react-dom` to render the modal directly on the `body`. If you do not use `createPortal`, parent elements with CSS `transform`, `filter`, or `perspective` will establish unintended containing blocks that capture the `fixed` positioning, causing the modal to appear in the middle of a scrolling page container instead of the actual screen view. Never make this mistake again.
- **Italic Clipping:** To prevent right-side clipping of italic text (especially in browsers with tight bounding boxes), always add a small right padding (e.g., `pr-1` or `px-0.5`) to the element or its immediate container.
- **Red Dot / Notification Placement:** Unread message or notification badges (red dots) on icons and buttons MUST ALWAYS be placed in the bottom-right corner (e.g. `absolute -bottom-0.5 -right-0.5`), NEVER in the top-right corner.
- **Touch-Friendly Controls:** Delete buttons or other critical actions MUST NOT be hover-only (e.g. `opacity-0 group-hover:opacity-100`), as this is unfriendly to touch-screen users. They should be visible or adapt properly for mobile devices.
- **Theme-Aware Colors & Minimalist UI:** We have 6 different theme colors. Every color choice (especially backgrounds, progress bars, or buttons) MUST consider all themes to maintain a minimalist and premium aesthetic. Avoid thick, flashy, or hardcoded colors like `bg-emerald-500` which may look jarring or "rough" (粗率) in certain themes. Rely on theme-aware colors (`indigo-300`, `indigo-400`, `indigo-500`, `indigo-600`) or neutral slate colors with opacity. DO NOT use `indigo-200` or `indigo-700`+ for primary themed elements, as they will appear in the default blue color across all themes.

## Current Status
- **Current Version:** v9.3.39
- **Last Update Date:** 2026-09-11
- **Last Update Time:** 16:46:33

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
> Detailed task history is archived and maintained in `TaskHistory.md` (retaining at most the 3 most recent entries).

- **v9.3.39 (2026-09-11):** WebDAV Proxy SSRF Guard Hardening, Shared API Helpers & Zero-Dependency Test Suite
  - *SSRF Guard Rewrite:* Replaced prefix-based host matching in `api/shared/webdavSecurity.ts` with proper CIDR arithmetic. The previous guard was bypassed by six classes of internal address — `[::1]`, `[::]`, `[::ffff:127.0.0.1]`, `100.64.0.0/10` (CGNAT), `198.18.0.0/15` and `192.0.0.0/24` — because `URL.hostname` keeps the brackets on IPv6 literals, defeating both the exact-match and `startsWith` checks. Added `::ffff:0:0/96` and `64:ff9b::/96` unwrapping, `.local` / `.internal` suffix rejection, and a best-effort DNS lookup.
  - *WebDAV Helper Deduplication:* `api/webdav/proxy.ts` now imports the shared guard instead of carrying a private inline copy, so the Vercel route and the `server.ts` development mirror enforce identical rules. The previously dead `resolveAndValidateHostname` stub is now implemented through a lazily imported `node:dns/promises` that cannot break cold start.
  - *Resilient Redis Reads:* Added `api/shared/json.ts` and routed `api/sync.ts` / `api/teams.ts` through it, so a corrupt or partially written save blob degrades to a fallback instead of returning HTTP 500.
  - *PWA Precache Guard Restored:* Fixed `maximumFileSizeToCacheInBytes` in `vite.config.ts`, which read `6000000 * 1024 * 1024` (roughly 6 TB) and therefore never enforced any limit.
  - *Zero-Dependency Test Suite:* Added `tests/` (29 cases, run with `npm test`) on Node's built-in test runner with native TypeScript stripping — no test framework or config required. Also repaired a double-encoded em dash in `vite.config.ts` and synced the `package.json` version to the app version.

- **v9.3.38 (2026-09-11):** Guild / Fellowship Team Goal Real-Time Focus Time Aggregation & Cycle Synchronization
  - *Centralized Cycle State Engine:* Created `/src/lib/teamUtils.ts` with standardized cycle date boundaries (`getCycleBounds`), cycle unique keys (`getCycleKey`), and user total / cycle focus accumulators (`calculateUserTotalFocus`, `calculateUserCycleFocus`, `getTeamCycleState`) with fallback calculation matching study session history and rest time preferences.
  - *Full-Stack Member Progress Synchronization:* Synchronized user total and cycle focus time from study session completion broadcasts (`useGameState.ts`) and polling headers (`x-user-total-focus`, `x-user-cycle-focus`, `x-user-cycle-key`, `x-user-target-type` in `TeamModule.tsx`), persisting updated member stats seamlessly into Redis backend storage.
  - *Guild Goal UI & Cycle Alignment:* Integrated real-time local statistics into `TeamModule.tsx` dashboard cards, `GoalDetailsModal.tsx`, and `DetailedGoalModal.tsx`, guaranteeing that all daily, weekly, monthly, yearly, and total goal meters reflect accurate focus minutes.

- **v9.3.37 (2026-09-10):** Markdown Live Editor Multi-Line Paste, Delete Merging & Escape Preview
  - *Multi-Line Content Paste Expansion:* Added clipboard handler to automatically decompose multi-line pasted text into individual rows and position cursor at the tail of pasted block.
  - *Line-End Forward Delete Merging:* Enabled `Delete` key at the end of a line to smoothly merge subsequent rows into the active line.
  - *Escape Quick Preview & Typography Polish:* Enabled `Esc` to instantly blur active line and preview complete rendered markdown; optimized rich rendering of bold (`**`), italic (`*`), and strikethrough (`~~`).
