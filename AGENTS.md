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
- **Current Version:** v6.3.7
- **Last Update Date:** 2026-05-14

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

- **v6.3.7 (2026-05-14):** UI Clipping & Sage Theme Refinement.
  - *UI:* Applied `pr-1` padding to all italicized banner titles and empty states globally to prevent character clipping.
  - *UI:* Optimized Sage's chat bubbles for all themes using theme-aware solid light backgrounds and high-contrast dark text, ensuring no transparency as requested.
  - *UI:* Renamed "Settings" inner tabs: "calculator" to "Calc" and "level" to "LV." for better density.

- **v6.3.6 (2026-05-14):** Sage Dark Mode Messaging Polish.
  - *UI:* Optimized Emerald Sage message bubbles for dark themes (Night, Forest, Ocean) by switching to a deep slate background with light emerald text, eliminating visual harshness.

- **v6.3.5 (2026-05-14):** Settings UI Compactness Refinement.
  - *UI:* Renamed "Calculator" settings tab to "Calc" and "Level" tab to "LV." for a more compact and mobile-friendly navigation bar.

- **v6.3.4 (2026-05-14):** Sage Messaging Clarity Refinement.
  - *UI:* Updated Emerald Sage chat bubbles to a solid light emerald background (emerald-50) with dark high-contrast text (emerald-950) for maximum readability and visual distinction across all themes.

- **v6.3.3 (2026-05-14):** Sage Branding Refinement.
  - *UI:* Renamed "Emerald Sage" settings tab to "Sage" for a cleaner and more concise interface.

- **v6.3.2 (2026-05-14):** Sage Dark Mode Messaging Refinement.
  - *UI:* Inverted Emerald Sage message bubbles to a dark background (slate-900) with light text (emerald-50) for enhanced readability in dark themes.

- **v6.3.1 (2026-05-14):** Sage Council UI Refinement.
  - *UI:* Optimized AI prompt library buttons with a compact, wrap-around layout for improved visual density.

- **v6.3.0 (2026-05-14):** Sage UX & Theme Integration.
  - *UI:* Unified and themed AI prompt buttons across the Sanctum and Settings, ensuring full synchronization with user-selected color palettes.
  - *UX:* Streamlined the Sage Council starter prompts for a cleaner, more focused experience.

- **v6.2.2 (2026-05-14):** Sage Interface Synchronization.
  - *UI:* Synchronized chat interface CSS between Settings and Dashboard for absolute consistency, including message bubbles, animations, and action placements.

- **v6.2.1 (2026-05-14):** Sage Council UX Refinement.
  - *UX:* Removed redundant default prompts ("Analyze journey", "Mystical challenge") from the Sage's Council chat interface to clear visual clutter.

- **v6.2.0 (2026-05-14):** Advice & Sage Structural Refinement.
  - *UX:* Split the "Advice" settings section into two separate top-level navigation tabs: "Calculator" and "Emerald Sage".
  - *Architecture:* Refactored `AdviceSettingsSection.tsx` into `CalcSettingsSection.tsx` and `SageSettingsSection.tsx` for improved modularity and maintenance.

- **v6.1.8 (2026-05-14):** Sage Interface Unification.
  - *UI:* Unified prompt button styling (backgrounds, borders, hover states) across Sage's Council and Advice settings for a consistent technical and mystical aesthetic.

- **v6.1.7 (2026-05-14):** Sage Council UX Enhancement.
  - *Feature:* Implemented permanently visible Copy and Quote actions for chat bubbles, improving interaction efficiency.

- **v6.1.6 (2026-05-14):** Sage Messaging Readability Fix.
  - *UI:* Inverted the Emerald Sage's message bubble to a dark font (emerald-950) on a light emerald background (emerald-50) for superior readability.

- **v6.1.5 (2026-05-14):** Sage Council Styling Finalization.
  - *UI:* Converted all chat bubbles in Sage's Council to solid, theme-aware colors (indigo for users, deep slate for Sage) without transparency to ensure readability and theme synchronization.

- **v6.0.42 (2026-05-13):** Dev Tooling Background Refinement.
  - *UI:* Updated the Quest Board CSS Debugger to use solid backgrounds and headers, eliminating transparency for a more technical and focused interface.
  - *UI:* Refined the backgrounds of the control panels and action buttons within the debugger to use solid slate and neutral tones.

- **v6.0.41 (2026-05-13):** Prompt Library Integrity & Migration Fix.
  - *Logic:* Improved the data migration engine to ensure default mystical prompts are automatically merged into user libraries.
  - *UX:* Added a "Load Defaults" emergency trigger inside the Sage Library popover for empty collections.

- **v6.0.40 (2026-05-13):** AI Global Context & Advanced Analysis.
  - *Logic:* Significantly expanded the data context sent to the Emerald Sage AI. It now perceives complete application state including Active Quests, Reward Yields (XP/Gold), Timer configurations, and up to 30 days of detailed performance logs.
  - *Feature:* Injected 4 new specialized default prompts into the Prompt Library: "App Intro", "Balance Guide", "Weekly Analysis", and "Monthly Review".
  - *UX:* Improved AI analysis precision by providing multi-dimensional user data for more accurate time-to-level estimates and mood-productivity correlation.

- **v6.0.39 (2026-05-13):** Dev Tooling UI Polish.
  - *UI:* Optimized the "Quest Board CSS Debugger" interface with better readability, theme-aware backgrounds, and polished variable editor cards.
  - *UX:* Added "Copy Variable" functionality and improved the color picking experience in the debugger.

- **v6.0.38 (2026-05-13):** Sage AI Chat Enhancements.
  - *Feature:* Added a Prompt Library selector (Library icon) to the left of the chat input, with 6 pre-configured mystical prompts for quick consultation.
  - *Feature:* Implemented a Prompt Manager in Sage Settings, allowing users to create, edit, or delete prompts, with a "Restore Defaults" option.
  - *Feature:* Implemented "Copy" and "Quote" message actions. The Quote feature prepends the selected message as a Markdown quote to the input field.
  - *UI:* Improved the chat input area in both the Settings and Dashboard Consult modal with a more balanced layout.

- **v6.0.37 (2026-05-13):** AI Output Markdown Rendering.

- **v6.0.36 (2026-05-13):** AI Personality Selector & Customizable Prompts.
  - *Feature:* Implemented an "AI Personality Selector" in Advice Settings, allowing users to choose between preset identities ("SAGE" and "FRIEND") or define a "CUSTOM" personality.
  - *Feature:* Added a "Identity" manager in Sage configuration where users can modify the base character prompts for any personality.
  - *Logic:* SAGE personality retains mystical game-like metaphors; FRIEND personality uses supportive, life-oriented, and natural language.

- **v6.0.35 (2026-05-13):** IOS Interaction & Tooltip Refinement.
  - *Bug Fix:* Resolved iOS double-click issue in the Record interface by optimizing event delegation and converting interactive heatmap elements to native buttons.
  - *Bug Fix:* Fixed chart tooltip dismissal bug where detail bubbles would persist after clicking elsewhere; implemented a robust global intersection listener to reliably clear active chart states.

- **v6.0.34 (2026-05-13):** VAPID Integrity & Sync Refinement.
  - *Feature:* Implemented a full AI Model Management system in Advice Settings. Users can now save multiple model profiles (different providers, keys, model names, and base URLs) and switch between them.
  - *Feature:* Added a Prompt Library allowing users to save custom prompts as "One-tap Consultation" buttons.
  - *UI:* Repositioned the "Oracle's Insight" card in the Sanctum to be directly below the Welcome module.
  - *Bug Fix:* Resolved a VAPID key validation error on server startup by implementing stricter key length checks and updating fallback keys.
  - *UX:* Improved mobile responsiveness of consultation buttons.

- **v6.0.32 (2026-05-13):** Sage AI Chat Persistence & Structure.
  - *Feature:* Implemented persistent chat history for the Emerald Sage, allowing users to continue past conversations.
  - *Logic:* Enhanced the Sage's AI engine to support multi-turn dialogues and context-aware responses.
  - *Logic:* Optimized the Sage's output with structural guidelines (Revelation, Observations, Path Forward, Encouragement) for clearer guidance.
  - *UI:* Balanced the chat interface across both Settings and Dashboard views with consistent back-and-forth styling.

- **v6.0.31 (2026-05-13):** The Emerald Sage AI Integration.
  - *Feature:* Fully implemented "From Sage's" (The Emerald Sage) module. 
  - *Feature:* Integrated Gemini and OpenAI/Compatible APIs with local key storage for personalized AI coaching.
  - *UI:* Added a "Sage's Council" consultation modal in the Sanctum (Dashboard) for direct access to AI insights.
  - *Logic:* SAGE now analyzes historical records, efficiency trends, daily moods, and written reflections to provide tailored learning advice.
  - *UI:* Polished the AI configuration interface with provider selection, custom endpoints, and theme-synchronized response displays.

- **v6.0.30 (2026-05-13):** Advice & Calculators Layout Polish.
  - *UI:* Completely redesigned the "Advice & Calculators" layout into a clean Bento Grid configuration with floating styles, gradients, and hover effects.
  - *UI:* Bound the General Advice font colors to theme-aware indigo classes, adapting optimally across dark and light themes.

- **v6.0.29 (2026-05-13):** Sage Advice & Income Calculators.
  - *Feature:* Added a new Advice module in Settings allowing users to calculate their anticipated XP, Gold, and Talent Shard yields per session based on custom input and active talents.
  - *UI:* Implemented the "Basically" tab with interactive inputs and data visualizations for deep balance checking, plus stubs for a future "From Sage's" theorycrafting module.
  - *Tool:* Built complex live calculators that estimate the exact sequence of sessions and days required to acquire shop items, gacha/ichiban pulls, and the next 3 level-up milestones.

- **v6.0.28 (2026-05-13):** PIP Window Victory Screen Behaviors.
  - *UI:* PIP Window responsive adjustments for the non-modal reward summary, ensuring content is cleanly visible in ultra-compact view.
  - *UX:* When "Show Victory Screen" is active, PIP window intelligently maximizes to full screen to display the native reward selection choices, and restores its layout after picking.

- **v6.0.27 (2026-05-13):** Reward Chest Session Metadata.
  - *UX:* Pending Reward Chest items now display their completion timestamp and the exact target objective/dungeon they stem from to provide better session context.

- **v6.0.26 (2026-05-13):** PIP Window Interactive Logic.
  - *UI:* Implemented a non-modal reward summary (XP and Gold) in the Always-on-top (PIP) window that triggers when a focus session ends if "Show Screen" is enabled.
  - *UX:* Integrated a "Start Focus" prompt in the PIP window that appears after rest ends if "Manual Focus Start" is active, allowing full session control from the compact view.

- **v6.0.25 (2026-05-13):** Chart Layout Refinement.
  - *Bug Fix:* Adjusted Weekly Activity chart margins in the Record interface to provide more vertical space for X-axis labels, preventing them from being obscured or clipped by the parent container.

- **v6.0.24 (2026-05-13):** Chart X-Axis Label Fix.
  - *Bug Fix:* Fixed an issue where the "MON" (Monday) label was missing from the Efficiency Trend line chart and other activity charts by forcing Recharts to show all x-axis ticks (`interval={0}`) and adding consistent margins to prevent clipping.
  - *UI:* Standardized x-axis labels to uppercase (e.g. MON, TUE) across all weekly charts for better visibility and a more premium technical aesthetic.

- **v6.0.23 (2026-05-13):** PIP Portal CSS Performance & Cleanup.
  - *Performance:* Re-engineered the PIP layout responsiveness to utilize pure CSS media queries, completely eliminating the React render lag and screen flickering during window resizing.
  - *UI:* Removed the redundant session progress section to further declutter and prioritize the timer display.

- **v6.0.22 (2026-05-13):** Chart Mood Icon Display.
  - *UI:* Reconfigured the Weekly Activity bar chart to reliably display daily mood icons above the bars by anchoring them to the total column height instead of a zero-height stack segment, fixing an issue where they were sometimes dropped or misaligned by Recharts.

- **v6.0.21 (2026-05-13):** PIP Portal Resize Observer Fix.
  - *Bug Fix:* Replaced `window.innerWidth` with a React `ResizeObserver` on the `CompactTimer` container. This ensures the app correctly identifies resizing events when rendered inside a disconnected Picture-in-Picture window portal, properly triggering the condensed "Mini" layout.

- **v6.0.20 (2026-05-13):** Safe Export Integrity Fix.
  - *Security:* Updated Safe Export logic to thoroughly scrub all cloud sync metadata, including Redis/Google/WebDAV unlock statuses, connection strings, and auto-sync preferences. This ensures that manual backups shared between users or devices do not carry sensitive credentials or unintended feature unlocks.

- **v6.0.19 (2026-05-13):** PIP Window Interactive Logic.
  - *UI:* Implemented a non-modal reward summary (XP and Gold) in the Always-on-top (PIP) window that triggers when a focus session ends if "Show Screen" is enabled.
  - *UX:* Integrated a "Start Focus" prompt in the PIP window that appears after rest ends if "Manual Focus Start" is active, allowing full session control from the compact view.

- **v6.0.18 (2026-05-13):** Sidebar Branding Collapse Logic.
  - *UI:* Hid the branding `AppIcon` when the sidebar is collapsed for a cleaner, strictly minimal vertical bar.

- **v6.0.17 (2026-05-13):** Sidebar Collapsed Symmetry.
  - *UI:* Forced sidebar navigation buttons to maintain a perfect square aspect ratio (`w-12 h-12`) when collapsed for a cleaner, centered icon-only layout.
  - *UI:* Added smooth entry animations for sidebar labels when expanding.

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
