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
- **Current Version:** v8.7.9
- **Last Update Date:** 2026-06-07
- **Last Update Time:** 14:30:00

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

- **v8.7.9 (2026-06-07):** Expedition Horizon Mobile Refinements & Layout Fixes.
  - *UI/UX:* Reverted Expedition Horizon layout from horizontal scrollback into an adaptive two-row grid on mobile screens specifically, optimizing layout space.
  - *Bug Fix:* Removed parent hidden constraints allowing zoomed date cards on desktop arrays to smoothly escape bounding boxes naturally instead of shearing edges unpleasantly.

- **v8.7.8 (2026-06-07):** Sleep Record Exports & Tablet Layout Expansion.
  - *Feature:* Added independent toggle controls in `ShareRecordModal` to selectively include or hide the Sleep Tracker during image code generation loops.
  - *UI/UX:* Switched Recharts `<Line>` structures for Sleep tracking over to a smooth `linear` mode replacing strictly staggered horizontal stops, rendering intuitive point-to-point progression slopes.
  - *UI/UX:* Unlocked horizontal flex allocations within Heatmap containers targeting Tablet widths (via `lg:flex-row`), allowing matrix blocks and the summary modules to render perfectly parallel.
  - *UI/UX:* Recalculated the core Y-Axis column alignment for `Heatmap` generation to strictly anchor Monday (`Mon`) natively atop row 1 index 0, and synchronized generic `Days Summary` aggregation hooks targeting explicitly active year views correctly.

- **v8.7.7 (2026-06-07):** Expedition Horizon State Persistence & Mobile Expansion.
  - *Feature:* Persisted the 'Recent 7 Days' and 'Current Week' Expedition Horizon view preferences across sessions by securely wrapping the selector variable inside durable `localStorage`.
  - *UI/UX:* Re-engineered the Expedition Horizon grid into a smooth, horizontal scrollable layout specifically for mobile screens (`overflow-x-auto snap-x`), radically expanding the tap target boxes of individual calendar days to resolve narrow compression.

- **v8.7.6 (2026-06-07):** Long-Press Seamless Automation & Fractional Statistics
  - *Bug Fix:* Unconditionally mapped manual long-press skip operations to strictly obey the user's 'Skip Victory Screen' (`timerSkipVictoryMode`) preferences natively, enabling seamless automatic transitions directly into the respective Rest loop or next interval exactly like a standard timer completion.
  - *Architecture:* Enforced strict integer rounding behavior on elapsed durations during skip operations, ensuring partial skip times uniquely snap to explicit minutes (or minimum 1 minute thresholds). This securely logs exact rounded values directly into Sanctum progress, team logs, records, heatmaps, and quest goals.

- **v8.7.5 (2026-06-07):** Restored Long-Press Skip Continuity
  - *Bug Fix:* Reverted fractional skip logging and restored full-duration credit on manual skip, ensuring skipped sessions once again accurately drive Sanctum, Quests, Expedition, and Fellowship progress identically to previous versions.
  - *Bug Fix:* Permitted manual long-press skips to once again correctly obey user 'Skip Victory Screen' (`timerSkipVictoryMode`) automation settings, seamlessly entering the Rest loop automatically without popup interruptions.

- **v8.7.4 (2026-06-07):** Accurate Integer Skip Logic & Rest Continuity
  - *Bug Fix:* Repaired the long-press skip action so that the skipped absolute focus duration is correctly logged as a cleanly rounded integer. This resolves fractional timing issues, ensuring that the exact elapsed time correctly factors into Sanctum progress, team charts, Expedition logs, and quests smoothly.
  - *Bug Fix:* Mapped manual long-press skip triggers to unconditionally bypass any automatic `timerSkipVictoryMode` 'Skip Victory Screen' logic. Consequently, users correctly receive the standard reward selection UI popup during manual skipping operations.
  - *UI/UX:* Verified that gracefully skipping loops immediately launches and correctly cascades into the active Rest phase, ensuring the chronological progression of intervals remains unharmed on a manual jump.

- **v8.7.3 (2026-06-07):** Long Press Skip Interaction & Fractional Reward Sync
  - *Feature:* Transformed the Timer 'Skip' button into a secure 3-second 'Long-Press to Skip' interaction, complete with an animated SVG radial progress ring to prevent accidental skips.
  - *Architecture:* Upgraded actual duration and focus propagation, injecting partial time accurately into `completeSession` so that skipped blocks are logged linearly matching EXACT milliseconds elapsed across Sanctum, Fellowship channels, records, Heatmaps, and Quests flawlessly.
  - *Bug Fix:* Repaired the Reward chest logic forcing `Math.max(1, drawCount)` ensuring short fractional skipped sessions consistently guarantee a minimum 1x baseline reward draw.
  - *Bug Fix:* Repaired a typescript mapping error inside `DailySessionsModal` resulting from mismatched `includeRestTimeInTasks` properties.

- **v8.7.2 (2026-06-07):** Time-Based Calculation Expansion
  - *Feature:* Promoted "Include Rest Time in Tasks" to be enabled by default and relocated its configuration block to the primary Timer Settings dashboard.
  - *Architecture:* Synchronized `sessionDurationVal`, `getAddedProgress`, and global statistics engines to uniformly incorporate rest durations into calculations uniformly when the setting is active.
  - *System:* Mapped the extended Rest + Focus unified progression into quests tracking, Sanctum daily progress, Expeditions, records, stats heatmaps, and Fellowship Team aggregate broadcasts seamlessly.
  - *Bug Fix:* Repaired inaccurate Quest type mappings in constants directly converting generic task string checks into true session-scaled increments.

- **v8.7.1 (2026-06-07):** Manual Talent Triggers
  - *Feature:* Reconstructed A2, B2, A3, and B3 to be manually claimed exclusively via the Active Talents tooltip instead of automated quest progression.
  - *Architecture:* Shifted daily time thresholds directly to exact explicit durations (8 hours for A2/B2, 4 hours for A3/B3).
  - *UI/UX:* Added detailed visual progress bars into the tooltip representing total minutes logged today out of required limits.
  - *Bug Fix:* Expanded active talent descriptions outlining hard limit streak caps precisely up to 10 days.
  - *System:* Removed redundant q_special fallback automated quests directly from generation memory cleanly.

- **v8.7.0 (2026-06-07):** Complete Migration to Time-Based Progression.
  - *Feature:* Removed "Compute Tasks by Time" toggle, enforcing a pure time-based tracking architecture application-wide.
  - *Architecture:* Converted core `getAddedProgress` hooks to rely solely on actual session focus duration relative to the configured `standardSessionMinutes`.
  - *System:* Linearly scaled base XP and base Coin generation organically using accurate progress multipliers matching true focus effort.
  - *UI/UX:* Reworked Dashboard, ExploreView, CompactTimer, and Stats components to universally display explicit minute bounds instead of opaque session counts, enhancing immediate progression clarity.
  - *Bug Fix:* Preserved and integrated cross-threshold triggers (Talent A2/B2 "16th Task") perfectly into the unified fractional progress scales.


- **v8.7.0 (2026-06-07):** Complete Migration to Time-Based Progression.
  - *Feature:* Removed "Compute Tasks by Time" toggle, enforcing a pure time-based tracking architecture application-wide.
  - *Architecture:* Converted core `getAddedProgress` hooks to rely solely on actual session focus duration relative to the configured `standardSessionMinutes`.
  - *System:* Linearly scaled base XP and base Coin generation organically using accurate progress multipliers matching true focus effort.
  - *UI/UX:* Reworked Dashboard, ExploreView, CompactTimer, and Stats components to universally display explicit minute bounds instead of opaque session counts, enhancing immediate progression clarity.
  - *Bug Fix:* Preserved and integrated cross-threshold triggers (Talent A2/B2 "16th Task") perfectly into the unified fractional progress scales.


- **v8.7.0 (2026-06-07):** Streak Record & Missing Day Interactions.
  - *Bug Fix:* Repaired a synchronization mismatch causing the available "Death Defying Gold Medals" counter inside the primary Activity Record dashboards to drift directly away from the core inventory bounds, accurately linking them to native state.
  - *Feature:* Enforced click actions directly onto "missed day grids" inside the "Start of the Day" prompt; failing days now gracefully ask to patch using items or gracefully launch a standardized 'missing item' informational modal cleanly.

- **v8.6.32 (2026-06-07):** Notification and Event Triggers Synchronization.
  - *Bug Fix:* Resolved a race condition via a React ref lock in the active timer hook that occasionally dispatched duplicate "session completed" events when resolving the identical sub-second completion frames, preventing duplicated historic inputs.
  - *Bug Fix:* Implemented pre-clearance task checks in the backend Redis Web Push scheduler `api/push/schedule`, explicitly removing previously queued delayed tasks from the index BEFORE executing a new `.zAdd`, terminating duplicate end-of-timer redundant ping bugs entirely.
  - *UI/UX:* Intercepted and cleared the underlying `ExploreView` full-screen container status inside App-level `onNavigate` controllers, ensuring any deep-action buttons embedded within achievement or milestone popups fundamentally terminate browser full-screen views cleanly before transitioning to destination panels.

- **v8.6.31 (2026-06-06):** Top Bar Streak Cross-Day Synchronization Fix.
  - *Bug Fix:* Unified the top bar streak active calculation logic with the global `getSettlementDay` engine, ensuring the red/orange streak indicator correctly respects the user's custom "Activity Time Peaks" thresholds for cross-day study sessions.

- **v8.6.30 (2026-06-06):** Horizon Typography & Contrast Alignment.
  - *UI/UX:* Addressed the CSS variable mapping matrix causing calendar numerics, dropdown toggles, and popover labels to fade into near-invisible light colors on Daylight and Candy themes by utilizing inverted mapped slate colors correctly.
  - *Bug Fix:* Repaired text colors acting directly on Daylight matrices by transitioning to `text-slate-100` and `text-slate-50` scales natively inverting perfectly to stark black within light environments.

- **v8.6.29 (2026-06-06):** Horizon CSS Context & Light Theme Alignment.
  - *Bug Fix:* Repaired a visual inversion glitch causing Expedition Horizon backgrounds and calendar grids to render completely dark under Light Themes (Daylight, Candy, Warm Sun). Correctly mapped `bg-slate-900` natively triggering light wrappers accurately based on the CSS variable inversion paradigm.
  - *UI/UX:* Ensured empty deadlines feature theme-aware gasified components, preventing contrast crushing under high-value themes.

- **v8.6.28 (2026-06-06):** Universal Calendar Interactions & Theme Synchronization.
  - *Feature:* Detached the Expedition Horizon popover constraints, allowing users to universally trigger information capsules for any selected date across the calendar whether active or not.
  - *UI/UX:* Integrated dynamic "No Deadlines Today" placeholder states inside empty date tooltips, featuring direct redirection routing cleanly into the main Dungeon management menus.
  - *Bug Fix:* Repaired underlying viewport collision policies closing the overarching horizon popovers automatically when clicking empty space.
  - *UI/UX:* Upgraded light-mode base aesthetics within the Expedition Horizon matrix, injecting dedicated `bg-white` variations cleanly distinct from deep dark configurations.

- **v8.6.27 (2026-06-06):** Horizon Theme CSS Polish & Date Picker DDL Counters.
  - *Feature:* Added a responsive red-flag counter dynamically presenting precisely how many raw task deadlines are trapped inside the viewing window directly onto the DatePicker trigger.
  - *UI/UX:* Remapped hardcoded `amber` highlight Sword UI icons and calendar shadows gracefully into `indigo`-derived theme variables, assuring crisp, 100% aesthetic compatibility across Night, Daylight, Ocean, Candy, Warm Sun, and Forest modes.

- **v8.6.26 (2026-06-06):** Dynamic Horizon Date Selection & Comprehensive Theme Scaling.
  - *Feature:* Integrated an interactive Date Picker directly into the Expedition Horizon header, allowing seamless arbitrary start-date shifts.
  - *UI/UX:* Hardened calendar cell container scaling by explicitly differentiating light/dark themes utilizing native drop-shadows vs crisp indigo borders contextually.

- **v8.6.25 (2026-06-06):** Dashboard Calendar Horizon & Theme Refinements.
  - *Feature:* Added visual settings to the Expedition Horizon, allowing users to toggle between a "Recent 7 Days" rolling window and a fixed "Current Week" schedule directly from the widget header.
  - *UI/UX:* Overhauled the Expedition Horizon matrix CSS to gracefully adapt to both Light and Dark themes. Enhanced contrasts and simplified grid aesthetics for a cleaner, unified viewing experience.

- **v8.6.24 (2026-06-06):** Dashboard Calendar & Expedition Tagging Polish.
  - *Feature:* Added dynamic `deadline` tags directly onto Expedition entries in the Dungeon Manager, mapped via high-contrast status colors representing active or overdue states.
  - *UI/UX:* Re-engineered the Sanctum's Expedition Schedule from a static monthly grid into a focused, highly visible horizontal 7-day rolling horizon (spanning past 3 days and next 3 days).
  - *UI/UX:* Deployed the `PopoverPortal` engine onto the horizon calendar cells. Clicking days containing target tasks now summons a detached, layered miniature list specifically prioritizing impending deadlines.

- **v8.6.23 (2026-06-06):** Expedition Deadline Editor Integration.
  - *Feature:* Bound the underlying `deadline` data structures to the primary Dungeon Editor modal interfaces.
  - *UI/UX:* Upgraded the "Create/Edit Expedition" and "Add/Edit Tier" forms with a native `DatePicker`, enabling direct insertion and clearing of target deadlines dynamically during goal creation.

- **v8.6.22 (2026-06-06):** Sanctum Calendar & Expedition Deadlines.
  - *Feature:* Added `deadline` support to Expedition Plan structures and Dungeon nodes allowing strictly timed journeys.
  - *UI/UX:* Replaced the default 'Current Quest' UI block in the Sanctum Welcome card with an elegant, responsive monthly interactive Calendar schedule.
  - *UI/UX:* Active expeditions automatically populate dot indicators directly beneath their corresponding deadline dates in the calendar, with comprehensive layout and typography adjustments.

- **v8.6.21 (2026-06-06):** Year Heatmap Dynamic Sizing.
  - *UI/UX:* Re-engineered Year Heatmap sizing calculations utilizing CSS custom properties and media queries to cleanly enlarge and adapt cell dimensions according to viewing screen sizes (tablets/desktops).

- **v8.6.20 (2026-06-06):** Heatmap Dynamic Sizing & Flexible Alignment.
  - *UI/UX:* Re-engineered Heatmap sizing calculations utilizing CSS custom properties and media queries to cleanly enlarge and adapt cell dimensions according to viewing screen sizes (tablets/desktops).
  - *UI/UX:* Unified Heatmap and Summary modules within a naturally stretched flex container, securely centering both clusters relative to the parent bounding box.

- **v8.6.19 (2026-06-06):** Heatmap Layout Fix & SVG Rendering.
  - *Bug Fix:* Repaired the Heatmap layout engine where the '30 Days Summary' sidebar was inadvertently crushing the heatmap out of bounds by assigning flexible containment via `min-w-0`.
  - *UI/UX:* Verified and forced solid white strokes onto the mood SVG embedded within Heatmap grids to stand out against all background colors seamlessly.

- **v8.6.18 (2026-06-06):** Heatmap Summary Alignment & Icon Polish.
  - *UI/UX:* Enforced strict horizontal layout for the Heatmap's 30-day and monthly modes, decisively pinning the Month Summary pane to the physical right edge of the screen as intelligently requested.
  - *UI/UX:* Re-rendered the Heatmap mood svg icons with a solid `#ffffff` clean-white fill and standard drop-shadows, completely bypassing broken native mixing-blend operations that caused faded anomalies.

- **v8.6.17 (2026-06-05):** Record Dashboard Polish & Analysis Panel.
  - *Feature:* Persisted Record dashboard view preferences securely via local storage memory buffers, auto-restoring weekly/heatmap configurations.
  - *UI/UX:* Engineered a highly dense "Month Summary" statistics widget dynamically injected beside 30-day Heatmap graphs.
  - *UI/UX:* Unified data widget banner nomenclature across all core sections using exclusively dedicated SVG icons (`Calendar`, `CalendarDays`, `CalendarCheck2`, `Flame`).
  - *UI/UX:* Eliminated confusing decimal remnants from Weekly average timing logs, strictly rounding numeric arrays.

- **v8.6.16 (2026-06-05):** PWA Immersion & Boot Sequence Polish.
  - *UI/UX:* Realigned the automatic "Start of Day" popup routine to strictly queue and trigger only after the initial application visual splash sequence has fully resolved.
  - *Bug Fix:* Silenced unintended sound overlap triggers by removing success chimes when loading the Start of Day module.
  - *UI/UX:* Implemented a global viewport CSS override terminating native OS desktop scrollbars across PWA installs, replacing the rigid black vertical track with customized internal invisible fluid scrolling.

- **v8.6.15 (2026-06-05):** Image Export Quality & Sync Patches.
  - *Feature:* Persisted comprehensive user preferences (export mode, layout options, margin settings) securely in local storage.
  - *UI/UX:* Disabled automatic canvas generation when toggling export settings. Generates strictly through a newly added explicit confirm button, vastly improving stability.
  - *Bug Fix:* Resolved severe DOM cloning overlap where asynchronous clicking generated recursive watermarks on continuous diary exports.
  - *Bug Fix:* Eliminated clipping bounding boxes that visually truncated absolute alignment headers and extreme margins during high-resolution snapshotting.

- **v8.6.14 (2026-06-05):** Export History & Image Rendering Patches.
  - *Feature:* Engineered an offline local IndexDB Storage wrapper to preserve a comprehensive history of previously generated image records.
  - *UI/UX:* Integrated an interactive History gallery view directly inside the Share Modal that automatically saves and manages all completed image renders without utilizing any cloud space.
  - *Feature:* Persisted exact Share layout preferences across sessions (including component selections and layout styles) for seamless user transitions.
  - *Performance:* Activated HTML DOM renderer acceleration flags (`skipFonts`, `fontEmbedCSS`) systematically cutting image generation processing time.
  - *Bug Fix:* Repaired the image export pipeline by neutralizing transparent CSS gradient borders in generated watermarks, resolving severe Safari/WebKit rendering crashes leading to broken gradient artifacts.

- **v8.6.13 (2026-06-05):** Visual Enhancements & Popover Overhaul.
  - *UI/UX:* Restored proportional scaling to the Heatmap month and 30-day views by systematically increasing individual grid sizes (w-5 h-5), establishing superior visual balance.
  - *Bug Fix:* Engineered a resilient React global portal engine (PopoverPortal) to extract all primary tooltips, bubbles, and interaction popovers (Heatmap, Routine Tracker) dynamically out of their constraining parent contexts and anchor them firmly above all elements with absolute z-[9999] positioning. Includes native viewport edge detection to rebound tooltips colliding with absolute left or right screen boundaries.
  - *Bug Fix:* Injected allowEscapeViewBox policies into all remaining Recharts tooltip containers ensuring unbounded hover visibility.

- **v8.6.12 (2026-06-05):** Heatmap Layout Refinements.
  - *UI/UX:* Corrected monthly and weekly heatmap matrix spacing issues that caused squares to over-stretch across containers using tight auto column rendering.
  - *Feature:* Engineered a dynamic Month labeling system seamlessly mapped over the year-based matrix columns.
  - *UI/UX:* Perfectly centered embedded daily mood emojis directly alongside the respective target heatmap cells using precision absolute-positioning.

- **v8.6.11 (2026-06-05):** Heatmap GitHub-Style Redesign.
  - *UI/UX:* Reconstructed the Heatmap container from a basic flat grid into a strict, horizontally-scrolling `grid-flow-col` matrix consisting of 7 vertical rows (mimicking the exact layout of a GitHub Contribution Matrix). 
  - *UI/UX:* Introduced explicit "Mon", "Wed", and "Fri" row labels on the left Y-axis.
  - *Feature:* Added a customized "Show Mood" toggle on the bottom left corner, allowing users to embed their corresponding daily mood icon as an overlaid, blend-mode adjusted emoji within their heatmap squares.

- **v8.6.10 (2026-06-05):** Chat Layout & Avatar Polish.
  - *UI/UX:* Stripped away unnecessary borders, rings, and inner drop-shadows across all User / Guild avatars universally.
  - *Bug Fix:* Prevented the Fellowship Chat Message Board from infinitely stretching the parent container and instead explicitly enforcing scrolling bounds so the chat input strictly pins to the bottom.

- **v8.6.9 (2026-06-05):** User Profile Dashboard Enhancements.
  - *UI/UX:* Replaced the generic level indicator and placeholder icon in the main layout's left navigation sidebar with dynamic, real-time user avatars and custom nicknames.
  - *UI/UX:* Upgraded the mobile top-left profile entry button to accurately reflect the user-selected avatar.

- **v8.6.8 (2026-06-05):** Guild Avatars SVG Overhaul & UI Polish.
  - *UI/UX:* Replaced emoji placeholders with high-fidelity Lucide-React SVG icons (Scholarly, Adventure, Fantasy themes), enhancing immersion.
  - *UI/UX:* Amplified progress bar presence across the Guild dashboard and details modal (increased height to h-4/h-5 and stroke-width to 10).
  - *Bug Fix:* Resolved right-side italic clipping for the guild name title globally.

- **v8.6.7 (2026-06-05):** Fellowship Branding & Progress Refinements.
  - *UI/UX:* Resolved italic boundary clipping on the main Guild Name typography by introducing tailored right padding bounds.
  - *UI/UX:* Increased the tracking stroke width and visual height of both linear and radial Fellowship Goal progress bars to significantly amplify visual presence.
  - *Feature:* Engineered a complete Guild Avatar icon system allowing Captains to select and broadcast high-fidelity emoji insignia directly into the Sanctum Plaza and primary team dashboards.

- **v8.6.6 (2026-06-05):** Unified Modal System & Dialog Overhaul.
  - *UI/UX:* Systematically eradicated all native browser `window.alert` and `window.confirm` dialogues across the application.
  - *Feature:* Implemented a unified `ConfirmModal` utilizing `createPortal`, injecting robust, high-contrast, theme-aware custom dialog components into settings, guild management, CSS debugging, and daily session screens.
  - *Bug Fix:* Resolved a visual mismatch in `CloudSyncModal` where disconnected WebDAV and Google Drive strategies incorrectly persisted Redis-style password input fields.

- **v8.6.5 (2026-06-05):** Cloud Backend Global Restrictions / Invite Locks.
  - *Architecture:* Redefined the `isRedisUnlocked` permission mechanism as an absolute, global gatekeeper against all Cloud Backend operations to strictly preserve the backend free-tier integrity.
  - *Feature:* Added synchronous locked state walls that actively block automatic Redis polling (`checkCloudSync`), manual Push Notification syncing, scheduling tests in Developer Mode, and WebDAV proxy triggers directly on the client side unless the global Invite Code (derived `NjkwNTE4MDU=`) has been verified. 
  - *UI/UX:* Replaced the primary Sanctum Plaza (Fellowship Network) with an aesthetic "Sanctum Plaza Locked" screen requiring a developer access invite code prior to granting any entry. Updated all related settings modules with transparent warnings ensuring users comprehend these limitations.

- **v8.6.4 (2026-06-05):** Cloud Backend Quota Protection & Storage Optimization.
  - *Architecture:* Implemented strict capacity limits for free tier Redis backend: automatically capped total remote active synced users to 300 and total guilds (fellowships) to 50.
  - *Feature:* Engineered continuous background garbage collection API (`/api/stats`) bound to Settings menus to intelligently prune ghost accounts and disbanded guilds that have been structurally inactive for over 15 consecutive days, seamlessly freeing up remote slots.
  - *UI/UX:* Upgraded the remote unlock modal to dynamically fetch and display absolute active capacity stats of both Users and Guilds. Added transparent explanations to users regarding automatic inactive account purging to prevent ghost capacity overflow.

- **v8.6.3 (2026-06-05):** Data Management Privacy Enhancements.
  - *Feature:* Safe Export now completely scrubs all user identity fields including unique ID, custom avatar, and titles to ensure absolute privacy during data sharing.
  - *UI/UX:* Implemented a mandatory confirmation prompt before performing a Full Export to warn users about the inclusion of personal information and cloud sync credentials.

- **v8.6.2 (2026-06-05):** Fellowship Goal Appearance Hotfix.
  - *UI/UX:* Resolved an issue where long Guild Vault Rewards were being unreadably truncated ("...") by swapping single-line truncations with responsive multi-line line-clamp limits.
  - *UI/UX:* Refined typography readability by stripping highly stylized amber glowing text shadows from reward fonts in exchange for clean, elegant `indigo-300` solid variations.

- **v8.6.1 (2026-06-05):** Push Notification Deduplication & Fellowship Dash.
  - *Bug Fix:* Implemented strict Web Push endpoint deduplication and capped maximum active device signatures to prevent users from receiving duplicated notifications (caused by browser subscription rotations or lingering uninstalled PWA profiles on iOS).
  - *UI/UX:* Replicated the centered progress percentage, prominently centered Guild Vault Reward with glowing visual queues, and dynamic 'CYCLE' timeline layout directly onto the primary Fellowship goal dashboard card to match the recently enhanced Detailed Goal Modal.

- **v8.6.0 (2026-06-05):** Fellowship Horizon Enhancements.
  - *Feature:* Enabled Captains to configure an exact daily "Goal Refresh Schedule" (e.g. 00:00, 03:00, 04:00) during Guild creation and inside Guild Settings.
  - *UI/UX:* Redesigned the Guild Goal modal to prominently center the progress percentage within a larger tracking ring.
  - *UI/UX:* Promoted the Guild Vault Reward into a standalone, high-contrast, hovered display card to significantly increase visibility and motivation.
  - *UI/UX:* Integrated a dynamically calculated "CYCLE" time-boundary banner beneath the horizon title to display the precise start and end dates based on the active refresh schedule.

- **v8.5.4 (2026-06-05):** Streamlined Navigation Experience Tracking on Mobile.
  - *UI/UX:* Simplified mobile XP bar layout by hiding graphic progress indicators and numerical trackers by default, maximizing whitespace.
  - *UI/UX:* Preserved level click functionality so tapping the level label instantly triggers the comprehensive floating progress sheet.

- **v8.5.3 (2026-06-05):** Restored Classic Top Level & XP Module and Corrected Far-Right Alignment on Mobile.
  - *UI/UX:* Restored the high-durability classic layout for mobile Level/XP badges and detailed XP progress bars to their responsive visual format.
  - *UI/UX:* Repositioned status submodules including talent scrolls and gold coins to group elegantly next to mobile navigation buttons on the far-right edge via custom margin pushers.

- **v8.5.2 (2026-06-05):** Optimized Top Navigation Status Layout for Compact Mobile Views.
  - *UI/UX:* Transformed raw multi-row XP Progress track into a clickable floating tooltip toggle on screens smaller than sm (mobile devices), preserving core visual estate.
  - *UI/UX:* Styled the compact Level indicator as a border-accentuated, theme-aware mini badge on mobile, automatically scaling back to its standard full size on tablet and desktop viewports.
  - *UI/UX:* Collapsed unnecessary inactive dungeon navigation text labels and restricted maximum text limits of active dungeons on portrait layouts, fully resolving coin spacing overlap.

- **v8.5.1 (2026-06-05):** Polished Responsive Fellowship Layout for Mobile PWAs.
  - *UI/UX:* Restructured active Fellowship dashboard grid into dynamic layouts that collapse cleanly into continuous columns on mobile views, enhancing responsiveness on touchscreens.
  - *UI/UX:* Enforced custom scroll limitations and vertical min-height parameters on Team members list boxes and chat workspaces, avoiding container squashing.
  - *UI/UX:* Enhanced Lobby menus to wrap gracefully and resolved mobile touchscreen touch interaction issues by keeping the "Join" actions visible.

- **v8.5.0 (2026-06-05):** Standardized Nickname Formatting & Multi-Language Translation.
  - *Feature:* Implemented adaptive username validation (maximum 10 Chinese characters or 15 Latin characters) with interactive mode switches and real-time character meters.
  - *Feature:* Added a customized, fully high-contrast English confirmation option box (`ConfirmModal`) explaining that chosen nicknames are visible publicly and will be referenced in notification alerts.
  - *UI/UX:* Standardized the chat workspace in `TeamModule.tsx` to automatically append user student IDs as a neat `(ID-XXXXX)` suffix directly following the sender's nickname.
  - *UI/UX:* Eliminated all remaining user-facing Chinese labels in `ProfileModal`, `CloudSettingsSection`, `ShareRecordModal`, `DatePicker`, and `SageSettingsSection`, aligning the entire applet to global English localized aesthetics.
  - *UI/UX:* Eliminated lingering smooth-scroll delays and animations inside `TimePicker` scroll columns, assuring instantaneous, exact snapping to the active input time values on popover trigger.

- **v8.4.10 (2026-06-05):** Synchronized Web Push VAPID Keys & Fallback Engine Alignment.
  - *Bug Fix:* Synchronized mismatched default fallback VAPID key pairs between the background tick scheduler (`server.ts`) and the serverless endpoint (`api/push.ts`).
  - *Bug Fix:* Unified JWT signing key validation and sanitization filters to safeguard against `BadJwtToken` exceptions, fully preventing server-side purging of valid subscriptions.

- **v8.4.9 (2026-06-05):** Upgraded Looping TimePicker & Global English Standardization.
  - *Feature:* Implemented custom 3-cycle circular loop infinite scrolling list columns for HH and MM time selectors, enabling seamless wrap-around navigation.
  - *UI/UX:* Activated auto-commit value matching immediately on wheel scroll-snapping, rendering click confirmation redundant.
  - *UI/UX:* Eradicated all native and custom literal Chinese text labels from the popover display coordinates to serve internationalization standards.
  - *UI/UX:* Constrained time selection slider rails with strict horizontal overflow-x-hidden, touch-pan-y, and pointer interaction lock behaviors to prevent sliding jitter.

- **v8.4.8 (2026-06-05):** Permanent Student IDs & Roster Layout Polish.
  - *Feature:* Assigned unique, stable, random alphanumeric IDs (SD-XXXXX) for every student. This stable ID is preserved securely in local state and synchronized on redis database tables.
  - *UI/UX:* Displayed user unique IDs immediately to the left of the honorary titles on both the current user's profile modal and within general Fellowship member viewer popups.
  - *UI/UX:* Removed the bulky PieChart container from the Fellowship panel, replacing it with focused, elegant member listings pairing custom statuses to individual student profiles.

- **v8.4.7 (2026-06-05):** Guild Persistence & Timer Synchronization.
  - *Feature:* Synchronized the local Timer Engine directly with the Guild Cloud Service. Automatically dispatches Focus XP and duration metrics to Guild rosters upon successful completion.
  - *UI/UX:* Overhauled the Fellowship load lifecycle. If you belong to a guild, the Sanctum now renders an immediate Loading Skeleton instead of flashing the public Plaza. Restored the overarching Sanctum Plaza navigation button within active Guild dashboards.
  - *Bug Fix:* Repaired the global Top Navigation scroll stickiness. Replaced aggressive overflow-hidden directives with overflow-clip to restore native browser CSS sticky behavior, and resurrected dynamic Theme-aware styling to the top navigation header.

- **v8.4.6 (2026-06-05):** Cloud Run CPU Wake-Lock Engine.
  - *Architecture:* Developed a sophisticated HTTP "Wake-Lock" strategy for the Vercel/Cloud Run serverless environments. The backend now strategically delays the response lifecycle of 1-minute cron-job pings if it detects any pending notification tasks within the next 58 seconds. This entirely circumvents the CPU freeze mechanism of Serverless containers, guaranteeing absolute second-perfect precision for timer notifications without needing the app to be active in the foreground.

- **v8.4.5 (2026-06-05):** iOS PWA UX Polish.
  - *UI/UX:* Rebased dynamic `theme-color` mutations to strictly utilize hex arrays, explicitly bypassing Safari's broken rgb compilation sequence and correcting the black Slide-Over interaction bar on DayLight themes. Hardcoded dynamic conditional classes for translucent headers instead of tailwind color-mixing for older iOS stability.
  - *Bug Fix:* Completely reined in the mobile 7-item navigation grid to intelligently squish inside a 320px Slide-Over screen edge to prevent the root div from triggering iOS horizontal bounce overflow.

- **v8.4.4 (2026-06-05):** iOS PWA Deep Immersion (Slide Over).
  - *UI/UX:* Activated `black-translucent` status bar properties for Apple PWAs to eliminate the system-generated invasive top background bar during Slide Over multiplexing. Applied real safe-area-inset padding to top boundaries to perfectly merge the screen real-estate safely.
  - *Bug Fix:* Intercepted and solved the horizontal swiping bug on iPad Slide Over configurations. Overhauled the mobile navigation bar layout algorithms to intelligently scale and shrink beneath the tight constraint of 320px bounding box edges.

- **v8.4.3 (2026-06-05):** iOS PWA Engine Polish.
  - *UI/UX:* Embedded dynamic `<meta name="theme-color">` mutations mapped precisely to the active aesthetic theme (`daylight`, `warm`, `candy`, etc.). This gracefully merges the persistent iOS top status bar into the designated theme background and eliminates the intrusive rigid black rendering bug.
  - *Bug Fix:* Intercepted horizontal boundary overflow by aggressively locking `overflow-x-hidden` onto the absolute root entry `min-h-[100dvh]` wrapper. This eliminates the unintended ability to sideways swipe or jitter across the canvas (such as sweeping across the timer modules under "侧拉" edge conditions).

- **v8.4.2 (2026-06-04):** Archive Communion Upgrades.
  - *UI/UX:* Redesigned the cloud synchronization overlay to prevent the progress timer from being obscured by the spinner ring.
  - *Feature:* Implemented a word-by-word typing effect for alternating loading phrases containing practical usage tips (e.g. "The maiden is praying..."), which cycles every 5 seconds.
  - *Bug Fix:* Repaired the Guild Roster module where active online indicator dots (emerald) were being improperly clipped by a parent container's `overflow-hidden` constraints.

- **v8.4.1 (2026-06-04):** Adaptive Light/Dark Theme Enhancements.
  - *UI/UX:* Refined the Guild Goal progress widget and Detailed Modal to strictly enforce theme-aware primary colors, ensuring readability and aesthetics match all 6 daylight and night environments without harsh hardcoded shadows.

- **v8.4.0 (2026-06-04):** Guild Leadership & Progress Glory.
  - *Feature:* **Captain Moderation:** Captains now possess the explicit authority to banish specific users from the active roster directly within the Profile detail modal.
  - *Feature:* **Victory Target Portals:** Reimagined the Team Goal module into an interactive widget boasting hover trails and infinite-pulse progress indicators. Clicking it portals the user into a massive full-screen celebratory accomplishment pane containing detailed contribution leaderboards.
  - *Feature:* **Live Rosters:** Imbued live rosters with level-based sorting logic and integrated a subtle emerald 'Online' presence indicator based on the members' 5-minute activity telemetry.

- **v8.3.0 (2026-06-04):** Guild Quality of Life & Message Realism.
  - *UI/UX:* Redesigned the "Found a Guild" modal layout, correcting vertical headspace and re-anchoring action controls to standard upper-right placement.
  - *Performance:* Eliminated chat transmission latency by implementing active optimistic UI predictive appending on outbound messages.
  - *Bug Fix:* Repaired discrepancies preventing newly joined Fellowship members from broadcasting custom Avatar selections (e.g. Cat, Dog) synchronously.
  - *Bug Fix:* Mended the Team Member Identity hash resolver that had invisibly broken Captain Transfer permissions for shared user-names.

- **v8.2.2 (2026-06-04):** Guild Goal Approvals & Profile Advancements.
    - *Feature:* **Democratic Proposals**: Implemented the ability for any guild member to respectfully propose edits to the Guild Target Horizon and Vault Rewards, under Democratic unanimous voting systems.
    - *Feature:* **Prominent Pinned Proposals**: Proposed votes are now pinned seamlessly at the peak of the Guild Message board showing clear live-progress meters.
    - *Feature:* **Captain Succession**: Added the ability for captains to dynamically transfer their role to another deserving team member from the Team Profile Modal View.

- **v8.2.1 (2026-06-04):** Guild Settings Redesign.
  - *Feature:* **Guild Modal Overhaul**: Restructured the "Found a Guild" and "Guild Settings & Goal" modals with a responsive two-column grid on wide screens (xl). Enhanced visual hierarchy with new icons for "Identity & Access" and "Goal Configuration" sections.
  - *Feature:* **Edit Guild Profile**: Added the ability for captains to dynamically rename their guild and edit its description from the settings menu. Translated all Chinese text fragments to English for global consistency.

- **v8.2.0 (2026-06-04):** Fellowship Profiles & Advanced Synchronization.
  - *Feature:* **Unified Avatar Renderer**: Synchronized custom student profiles and high-contrast avatar icons (Cat, Dog, Ghost, etc.) from `ProfileModal` directly into the team communication feeds, active member rosters, and individual profile view popups.
  - *Feature:* **Level Badge Integration**: Imbued the Fellowship member card list with explicit, live `Lv. x` indicators so other players can track leveling progress in high fidelity.
  - *Feature:* **Instant Backend Auto-Sync**: Designed automatic, real-time sync checkpoints inside `/api/teams.ts` (GET) to dynamically capture profile edits of active members (custom names, selected avatar icons, real student levels, biography texts, and custom profile titles) instantly.

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
