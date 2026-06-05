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
- **Current Version:** v8.6.3
- **Last Update Date:** 2026-06-05
- **Last Update Time:** 09:47:00

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
