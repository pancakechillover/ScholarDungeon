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
- **Current Version:** v6.0.16
- **Last Update Date:** 2026-05-13

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

- **v6.0.16 (2026-05-13):** PIP Adaptive "Mini" Layout.
  - *UI:* Implemented a condensed layout for the Always-on-top (PIP) window that activates at small dimensions (<240px height or <180px width).
  - *UX:* Reduced font sizes, thinned progress bars, and moved control buttons to the right side of the timer in condensed mode for better space efficiency.

- **v6.0.15 (2026-05-13):** PIP Session Goal & Progress.
  - *UI:* Added a session-specific progress bar and target duration display to the top of the Always-on-top (PIP) window.
  - *UX:* Users can now monitor their current focus or rest session completion percentage directly from the compact view.

- **v6.0.14 (2026-05-13):** Splash Screen UX Improvement.
  - *UX:* Repositioned the version number in the opening animation to be more prominently visible in the central content area.

- **v6.0.13 (2026-05-13):** Sidebar Branding Alignment.
  - *UI:* Replaced the generic sword icon in the sidebar title with the custom `AppIcon` for consistent branding.
  - *UX:* The icon is now visible even when the sidebar is collapsed, providing better visual context.

- **v6.0.12 (2026-05-13):** Splash Screen Logo Refinement.
  - *UI:* Removed the outer frame and backdrop from the logo in the opening animation for a cleaner, more focused arrival experience.

- **v6.0.11 (2026-05-13):** Session Metadata in Reward Chest & Vault.
  - *UX:* Reward Chests (Victory Modal and Pending Chests) now display the duration and goal of the completed session.
  - *UI:* The Reward Vault (VAULT) table now includes a "Session Info" column, showing the session context (Duration and Goal) for each earned treasure.

- **v6.0.10 (2026-05-13):** Merchant Shop Categorization.
  - *UX:* Reclassified items purchased from the Merchant Shop as "Custom" rewards in the Vault (VAULT). These items now appear in the "Custom" tab, allowing users to manually check them off as redeemed.

- **v6.0.9 (2026-05-13):** Stats Tooltip Dismissal Fix.
  - *Bug Fix:* Re-engineered the global click listener in `Stats.tsx` to reliably dismiss chart tooltips and heatmap popovers when clicking any blank area or non-data UI element.

- **v6.0.8 (2026-05-13):** Custom Time Mocking & Talent Enforcement.
  - *Feature:* Added Time Manipulation to Developer Mode, allowing users to enable custom simulated time and set offsets (+/- days or specific dates) for testing.
  - *Feature:* Talent unlocking now strictly requires prerequisites (sequential locking).
  - *UI:* Improved visual feedback for failed talent unlocks with theme-synchronized floating bubbles.

- **v6.0.7 (2026-05-13):** Talent Prerequisite Enforcement & Visual Feedback.
  - *Feature:* Enforced sequential talent unlocking (e.g., Tier 1 must precede Tier 2).
  - *UX:* Added a mystical floating bubble notification when attempting to bypass prerequisites, which dismisses automatically upon clicking anywhere else.
  - *UI:* The bubble dynamically displays the name of the missing predecessor and matches the branch's unique theme colors.

- **v6.0.6 (2026-05-13):** Global Cloud Unbind Synchronization.
  - *Bug Fix:* Resolved a critical race condition where secondary tabs would continue syncing with a dropped secret code. Added immediate cancellation triggers across all tabs via `activeSyncRequestRef` incrementation on state clear. Synchronized the Cloud Sync Modal input field with backend state to prevent re-authentication with stale codes in concurrent windows.
  - *Bug Fix:* Fixed a linter error in `useCloudSync` by correctly importing React hooks.

- **v6.0.5 (2026-05-13):** Enhanced Sync Error Messaging.
  - *UX:* Improved sync failure transparency by mapping raw errors to specific "Reason" and "Solution" blocks in the Cloud Sync Modal. Added support for Network, Rate-limit (429), Not Found (404), and Server configuration error types with dedicated icons and mystical themes.

- **v6.0.4 (2026-05-13):** Cloud Sync Multi-tab Drift & Ghost Push Fix.
  - *Bug Fix:* Completely scrubbed `secretCode` and provider profiles from memory upon `Unbind Local` via deep delete. Added cross-tab storage syncing so unbinding in one tab safely terminates sync polling loops in all other concurrent tabs. Corrected push notification system to officially `/unsubscribe` background channels immediately upon manual unbind.

- **v6.0.3 (2026-05-12):** PIP Responsive Controls.
  - *UI:* Automatically hide timer controls (Reset, Play/Pause, Skip) in the PIP window when resized below a certain height threshold for a cleaner minimal timer view.
- **v6.0.2 (2026-05-12):** PIP Dimensions & Theme Alignment.
  - *UI:* Reduced default PIP window dimensions to 220x300 for a more compact footprint.
  - *UI:* Synchronized the PIP window theme with the main application, including dynamic background and accent color updates.
- **v6.0.1 (2026-05-12):** PIP Timer Throttling Fix.
  - *Bug Fix:* Re-engineered the PIP (Always-on-top) timer component to use local `requestAnimationFrame` loops, preventing the timer from freezing when the main browser window is minimized or inactive.
- **v6.0.0 (2026-05-12):** Version 6.0.0 Milestone & PIP UI Alignment.
  - *Milestone:* Archived previous v5 updates into Git history and reset the release log.
  - *UI:* Aligned Always-on-top (PIP) timer UI with the main page, including synchronized text tags and timer control buttons (Play/Pause, Reset, Skip).
