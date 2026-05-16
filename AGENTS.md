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
- **Current Version:** v6.12.2
- **Last Update Date:** 2026-05-16

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

- **v6.12.2 (2026-05-16):** Vault UI Refinement.
  - *UI:* Removed the Gold Earned, Gold Spent, and XP Earned statistics from the Economy Log banner to streamline the interface.

- **v6.12.1 (2026-05-16):** Vault UI Consolidation.
  - *UI:* Removed the separated dual-page navigation layout taking up space in the Vault. Merged the Economy Log entrance natively into the main view's category tabs for a cleaner, unified flow.

- **v6.12.0 (2026-05-16):** Economy Transaction Log.
  - *Feature:* Added an Economy Log module to the Vault page, tracking every single Gold Coin and XP acquisition and expenditure to ensure complete visibility into resource flow.
  - *Architecture:* Implemented a robust centralized `processTransaction` method in the game state to ensure no economy modifications can slip past the logging system.

- **v6.11.6 (2026-05-16):** Sage AI Light Theme & Output Enhancements.
  - *UI:* Optimized Sage AI persona selector and interactable plan modifier forms specifically for light themes by replacing theme-agnostic styling with context-aware coloring.
  - *Feature:* Added "Help me create tasks" as a standard default preset prompt within the Sage AI library.
  - *Fix:* AI-generated task plans now accurately embed their Total Rooms (`sessions`) metric into the generated output structures instead of defaulting to 1.

- **v6.11.5 (2026-05-16):** Reward Tag Display Fix.
  - *Fix:* Resolved an issue where Dungeon reward tags of type "Item" or "Custom Text" were not displaying in the list.

- **v6.11.4 (2026-05-16):** ReferenceError Bug Fix.
  - *Fix:* Resolved Uncaught ReferenceError: `applyExpeditionPlan` is not defined in the Sage AI consult modal by properly passing the prop down into the modal component closure.

- **v6.11.3 (2026-05-16):** Sage AI Interactive Chat Controls.
  - *Feature:* Added an inline Identity Selector directly above the Sage AI chat input for seamless persona switching (Sage, Friend, Master).
  - *Feature:* Added an explicit "Modify Mode" toggle. AI configuration schemas will now only render as interactive game modifier widgets if this mode is enabled, preventing accidental state changes.
  - *Fix:* Re-wrote JSON response block parsing from the ground up to aggressively strip markdown tags and ensure expedition configuration elements always render reliably even when AI incorrectly formats code blocks.

- **v6.11.2 (2026-05-16):** Sage AI Master Persona.
  - *Feature:* Added "Master" personality mode to Sage AI settings. Forms a strict, highly analytical game master persona to help accurately plan tasks and adjust balance settings logically.

- **v6.11.1 (2026-05-16):** Sage JSON Render Reliability.
  - *Fix:* Improved the fallback JSON parsing engine within the chat interface, ensuring that interactive planners and balance setters always render properly even when AI omits code-block language tags.
  - *Feature:* Added direct configuration rules for 'sessions' requirement values in Expedition Planners, allowing users to modify them natively.

- **v6.11.0 (2026-05-16):** Sage AI Interactive Task Automation.
  - *Feature:* The Sage AI chat can now directly generate fully-configured Expedition Plans including titles, descriptions, goals, and multiple reward tiers based on natural language requests (e.g., "Design an IELTS review expedition").
  - *Feature:* Added `ExpeditionPlanPreview` component that intercepts JSON payloads from Sage and renders them natively as an interactive, editable table within the chat interface.
  - *Feature:* Users can freely customize the AI's proposed tiers, rewards, and requirements before clicking "Accept", which automatically maps and constructs the parent `MajorDungeon` and child `Dungeon` entries directly into the active state.
  - *Feature:* Sage AI can also dynamically adjust global economy balance settings (`devBaseXP`, `devBaseCoins`) via interactive embedded chat UI components.
  - *Prompt Polish:* Overhauled the hidden system prompt inside `sageService.ts` to strictly enforce markdown JSON outputs matching the `expedition_plan` syntax schema.

- **v6.10.8 (2026-05-16):** Stats Chart Alignment.
  - *UI:* Aligned the maximum height of the Weekly bar chart with the Daily bar chart for visual consistency across the Record dashboard.

- **v6.10.7 (2026-05-16):** Stats Today Button Refinement.
  - *UI:* Replaced the "TODAY" text buttons in the Record dashboard's Daily and Weekly modules with a compact "Return" (`RotateCcw`) icon to further conserve horizontal space.

- **v6.10.6 (2026-05-16):** Stats Controls Polish.
  - *UI:* Consolidated the "Natural" and "Last 7d" Weekly date mode selectors into a single dropdown component, drastically reducing horizontal space usage.
  - *UI:* Narrowed the width of the Weekly date selector specifically to optimize for smaller tablet screens.

- **v6.10.5 (2026-05-16):** Stats Controls Polish.
  - *UI:* Aligned the font size CSS classes for the Weekly module's date selector to perfectly match the Daily module's standard (`text-[10px] sm:text-xs`).

- **v6.10.4 (2026-05-16):** Stats Controls Optimization.
  - *UI:* Refined the styling and dimensions of the Daily and Weekly controls in the Record dashboard. Shifted to smaller padding, tighter gaps, and flexible widths on mobile and tablet screens to prevent overflow and ensure a cohesive view.

- **v6.10.3 (2026-05-16):** Top Bar Coloring Bug Fix.
  - *Bug Fix:* Removed globally invasive `sm:bg-indigo-600` theme overrides from `index.css` that were forcefully coloring mobile narrow-screen level text as pure white instead of matching the adaptive theme-colors of the other elements in the top bar.

- **v6.10.2 (2026-05-16):** Top Bar Adaptive Coloring.
  - *UI:* Reverted level text color on narrow screens to natively inherit theme-aware styling identically to other top-bar attributes, retaining purely white coloration explicitly on wide screens for premium aesthetic alignment.

- **v6.10.1 (2026-05-16):** Top Bar Mobile & Wide UI Refinement.
  - *UI:* Fixed Level Label (LV) to use `text-black-pure` on narrow screens and `text-white-pure` on wide screens, bypassing theme overrides.
  - *Architecture:* Added `.text-black-pure` global utility in `index.css`.

- **v6.10.0 (2026-05-16):** Advanced Multi-Named Preset System.
  - *Feature:* Overhauled the Preset system to support multiple named configurations for Expeditions, Tiers, Quests, and Achievements.
  - *UI:* Centralized preset management into a unified `PresetControl` component integrated exactly into the right side of the banner for all creation modals.
  - *UX:* Enhanced "Auto-Load" capability to intelligently apply the specific active preset name designated by the user whenever a new creation modal is opened.

- **v6.9.4 (2026-05-16):** Top Bar UI Persistence Fix.
  - *Bug Fix:* Resolved CSS specificity conflict in `index.css` ensuring Level Label remains white on wide screens by adding responsive variants to theme-aware white-text overrides.
  - *UI:* Decoupled Level Label font color from global top bar theme defaults for better contrast in light themes.

- **v6.9.3 (2026-05-16):** UI Branding & Icon Polish.
  - *UI:* Applied `.text-white-pure` to the main settings icon in the About screen to ensure it remains white across all themes.
  - *UI:* Optimized level badge color logic to use global white utility.

- **v6.9.2 (2026-05-16):** Level Label UI Polish & Global Utility.
  - *Architecture:* Added `.text-white-pure` global utility in `index.css` to bypass theme-aware color overrides.
  - *UI:* Fixed Level Label (LV) in Top Bar to use pure white color on wide screens across all themes (daylight, warm sun, candy).
  - *UI:* Retained theme-aware adaptive coloring for the Level Label on mobile for optimal legibility.

- **v6.9.1 (2026-05-16):** Wide screen Level Label Polish.
  - *UI:* Fixed Level Label (LV) to ensure it is always solid white and opaque on light themes (daylight, warm sun, candy) for wide screens.

- **v6.9.0 (2026-05-15):** Version 6.9.0 Milestone Update.
  - *Milestone:* Upgraded system version to 6.9.0.
  - *Feature:* Added "Save Preset", "Load", and "Auto-Load" functionality for Expedition Goals, Tiers, Quests, and Achievements creation forms.
  - *Bug Fix:* Resolved iOS-specific input state issue preventing reward editing during initial item creation.

- **v6.8.24 (2026-05-15):** Top Bar Mobile UX Polish.
  - *UI:* Optimized the Top Bar for small mobile screens by conditionally hiding the streak days indicator, converting the XP Bar layout below the level badge, and simplifying the Level badge's CSS styling (removing background and shadows) to conserve horizontal space.

- **v6.8.23 (2026-05-15):** Dungeon Tiers Preset & iOS UX Fix.
  - *Feature:* Added "Save Preset" functionality when creating Dungeon Tiers, allowing users to save their favorite configurations (e.g., standard 20 rooms, 200 coin reward).
  - *Feature:* Added an "Auto-Load" capability that, when enabled, seamlessly applies your saved preset every time you create a new tier.
  - *Bug Fix:* Fixed a critical iOS / Edge bug where modifying reward items while creating a new tier directly edited the parent expedition state, rendering the inputs seemingly frozen.

- **v6.8.22 (2026-05-15):** Routine Reset Synchronization.
  - *Logic:* Synchronized routine resets (`daily`, `weekly`, `monthly`) in Dungeons with the globally configured user day-reset time, calculating against "logical days" instead of generic midnight thresholds.
  - *Data Sync:* Refined "Routine Tracker" matrix logic handling so that routines checked-off in the crossover zone (e.g. 03:29 AM instead of 04:00 AM reset boundaries) accurately log as completed for the *previous* calendar day.
  - *UI:* Visual refresh badges for routines actively respect the customized reset shifts in real-time.

- **v6.8.21 (2026-05-15):** Background Audio Keep-Alive for Mobile PWAs.
  - *Feature:* Implemented a continuous, silent HTML5 Audio track (`useBackgroundKeepAlive`) that loops automatically when the timer is active.
  - *Bug Fix:* Resolved a critical iOS/Android Safari issue where backgrounding the PWA would suspend the JavaScript context, causing timer push notifications to be delayed until the user reopened the app.
  - *Feature:* Hooked MediaSession API to display specific timer progress on the mobile Lock Screen media player.

- **v6.8.20 (2026-05-15):** Timer Loop Progression Fix.
  - *Bug Fix:* Fixed an issue in `Timer` where the countdown would halt at `0:00` waiting for the user to select their focus reward. The timer now automatically progresses to the next step (e.g. resting or loop resets) immediately on completion, while safely leaving the reward modal open in the foreground for the user to make their choice on their own time.

- **v6.8.19 (2026-05-15):** Routine Tracker Dashboard.
  - *Feature:* Added a "Routine Tracker" matrix module to the Record interface placed precisely above the Heatmap.
  - *Feature:* Allowed tracking routine progress linearly across a 'punched card' matrix using Day or Month configurations.
  - *UI:* Sub-dungeons (Tiers) natively inherited the `routine` tagging properties previously extended to Expeditions.

- **v6.8.18 (2026-05-15):** Routine Expeditions Detail.
  - *Feature:* Expanded "Routine" configuration to allow individual Tiers (sub-dungeons) to have routine intervals indepedent of their Expedition Goal.
  - *UI:* The refresh schedule dates (M/D) are now explicitly displayed alongside the routine badges for Daily, Weekly, and Monthly intervals.

- **v6.8.17 (2026-05-15):** Routine Expeditions Feature.
  - *Feature:* Added "Routine" configuration when creating or editing an Expedition Goal. Routine expeditions reset their tier progress recursively on a daily, weekly, or monthly interval to allow replayable challenges and repeated rewards.
  - *UI:* Displayed a Routine badge in the Expedition Goal summary, showing the configured refresh interval and calculated next refresh date.

- **v6.8.16 (2026-05-15):** UI Polish & Convenience Enhancements.
  - *UI:* Updated the color of "Talent Scrolls" icons globally from purple to emerald green for better theme consistency.
  - *UX:* In the Dungeons view, creating a new expedition or tier now automatically defaults to 100 Coins for the Completion Reward, avoiding an empty initial state.

- **v6.8.15 (2026-05-15):** UI Stability & Error Handling Polish.
  - *Bug Fix:* Resolved a React warning regarding uncontrolled inputs changing to controlled states during item/quest editing by enforcing explicit string fallbacks (`|| ""`).
  - *Bug Fix:* Suppressed expected `NotSupportedError` playback failures for missing `page-flip.mp3` files in environments where audio is disabled or absent.

- **v6.8.14 (2026-05-15):** Disable Sub/Parent Transference.
  - *UX/Fix:* Completely disabled the functionality to transfer items between major and sub-levels via dragging. Drag and drop now strictly focuses on simple list reordering to stabilize the application and prevent potential data state losses.

- **v6.8.13 (2026-05-15):** Dungeons Drag & Drop Stability.
  - *Bug Fix:* Fixed a major bug where dragging one dungeon item into another would cause the dropped item to permanently disappear due to stale state closures conflicting with concurrent list reordering logic from Framer Motion. Implemented strict functional state transitions.
  - *UI:* Corrected the reward icon for Talent Scrolls in the Expedition view to properly display a Scroll instead of a Trophy.

- **v6.8.12 (2026-05-15):** Fullscreen UX Enhancements.
  - *Feature:* Added WakeLock support (`navigator.wakeLock`) to keep the screen on during fullscreen sessions.
  - *Feature:* Unlocked orientation while in fullscreen to permit landscape modes on mobile devices natively.
  - *UI:* Overhauled CSS layouts dedicated to mobile landscape fullscreen displays `[@media(orientation:landscape)...]`. Relocated the progress bar to the bottom and dynamically rescaled the main timer module to prevent vertical overflow.
  - *UI:* Adjusted progress bar alignment and width scaling on narrow mobile screens (portrait) to prevent it from overlapping with the top-right "Exit Fullscreen" button.

- **v6.8.11 (2026-05-15):** Top Bar Polish.
  - *UI:* Unified icon sizes across the top bar. Adapted the Sync button to remove bulky padding, syncing its dimensions with standard info indicators.
  - *UX:* Fixed top bar streak text to use proper pluralization ("Days" vs "Day").

- **v6.8.10 (2026-05-15):** Nomenclature & Iconography Update.
  - *Terminology:* Renamed "Talent Points" globally to "Talent Scrolls".
  - *UI:* Updated the icon for "Talent Scrolls" to a `Scroll` and "Talent Shards" to a `Puzzle`.

- **v6.8.9 (2026-05-15):** UI Consistency.
  - *UI:* Updated the CSS styling of the "Quest History" view to match the modernized "Quest Board" styling for a cohesive interface.
  - *UI:* Exchanged standard `Zap` icons in rewards rendering to `Star` globally when referencing "Talent Scrolls" for clarity.

- **v6.8.8 (2026-05-15):** Sage AI Output & Performance Enhancements.
  - *Feature:* Implemented capability to cancel ongoing AI consultations (AbortController) by clicking a cancel icon next to the loading timer.
  - *UI:* Improved visibility for "reasoning" models by storing reasoning output strictly inside a `<details>` accordion block so that it collapses by default.

- **v6.8.7 (2026-05-15):** Background Timer & Notification Precision.
  - *Architecture:* Delegated timer countdowns to a dedicated Web Worker to prevent browser throttling when the PWA is in the background.
  - *Feature:* Added `{ urgency: 'high' }` flag to Web Push notifications to bypass mobile OS battery-saver deferrals.

- **v6.8.6 (2026-05-14):** Audio Error Handling Refinement.
  - *Bug Fix:* Improved audio playback error handling to silence expected browser autoplay policy errors.

- **v6.8.5 (2026-05-14):**
  - *UI:* Improved visibility of 'Pro Tip' headers in the Talent System guidebook page by updating text color to theme-aware variables.

- **v6.8.4 (2026-05-14):** Talent System Navigation Fix.
  - *Bug Fix:* Fixed Talent System button in dashboard to point to the correct guidebook page.

- **v6.8.3 (2026-05-14):** Dashboard UI Polish.
  - *UX:* Removed redundant "GUIDE" label from Guidebook buttons on the dashboard for a cleaner interface.

- **v6.8.2 (2026-05-14):** Talent Color Polish.
  - *UI:* Brightened Talent System blue colors for improved visibility in Night, Forest, and Ocean themes.

- **v6.8.1 (2026-05-14):** Talent System Interaction Polish.
  - *UI:* Updated Talent System icons and text to use theme-aware CSS variables, ensuring high visibility in all dark and light themes.

- **v6.8.0 (2026-05-14):** Themed Wisdom & Interaction Polish.
  - *Feature:* Overhauled Guidebook theming for NIGHT, FOREST, and OCEAN themes; implemented solid dark backgrounds and light mystical typography across all internal pages.
  - *UX:* Modified Daily Sessions action buttons to be permanently visible, improving accessibility and consistency with Recent Sessions.
  - *UI:* Removed redundant "Daily Record" navigation buttons from chart tooltips (Weekly and Daily view).
  - *Visual:* Refined book cover and spine aesthetics to dynamically adapt to themes using CSS variables.

- **v6.7.2 (2026-05-14):** Interaction & Type Integrity.
  - *UX:* Removed redundant "Daily Record" navigation button from chart tooltips (Weekly and Daily view) to streamline interaction.
  - *Logic:* Hardened `StudySession` type definitions and resolved linting warnings in the session management modules.

- **v6.7.1 (2026-05-14):** Chart Tooltip Optimization.
  - *UX:* Removed redundant "Daily Record" navigation button from chart tooltips (Weekly Activity and Daily Periods) to streamline the interaction flow and focus on session management within the Record dashboard.

- **v6.7.0 (2026-05-14):** Period-Aware Sessions Modal & Data Integrity.
  - *Feature:* Enhanced the "Daily Sessions Modal" to support time-of-day filtering. Clicking segments in the Daily Chart now opens the modal pre-filtered for Morning/Afternoon/Night.
  - *Feature:* Implemented chronological sorting (Morning to Night) for session records within the modal.
  - *UI:* Added period dividers and "Recent Sessions" style CSS separators for the Weekly view trigger.
  - *Logic:* Integrated "cross-day" session detection using the configured day reset hour (e.g., 04:00 AM) to ensure data accuracy in the modal.

- **v6.6.1 (2026-05-14):** Daily Sessions Modal Refinement.
  - *UI:* Modified session action buttons (Edit/Delete) to be permanently visible instead of hover-only, improving accessibility and ease of use for touch-screen and desktop users alike.

- **v6.6.0 (2026-05-14):** Daily Session Modal & UX Synchronization.
  - *Feature:* Implemented "Daily Sessions Modal" in the Record (Stats) interface. Now, clicking "Sessions" or "Show Daily Sessions" in chart tooltips captures a local modal instead of navigating away to a different tab.
  - *UI:* The newly added modal mirrors the `RecentSessions` table CSS for consistency while providing localized editing and deletion capabilities.
  - *UX:* Improved chart interaction flow: users can now inspect and manage their session records without losing their current scroll position or context in the activity dashboard.

- **v6.5.2 (2026-05-14):** Touch & Navigation Refinement.
  - *Fix:* Resolved navigation anchor bug: Clicking "view sessions record" in the Record chart now correctly scrolls to the target table.
  - *Fix:* Fixed touch scrolling issues: Adjusted global overscroll behavior and Recharts tooltip pointer events to ensure smooth page sliding on mobile.
  - *UX:* Refined tooltip interactivity: Improved button hitboxes and click detection for chart bubbles on touch devices.

- **v6.5.1 (2026-05-14):** Startup Performance Optimization.
  - *Perf:* Eliminated the "white flash" on startup by implementing inline background styles directly in `index.html`.
  - *UX:* Added auto-save logic to the Daily Record editor to prevent accidental data loss.
  - *Fix:* Synchronized PWA manifest colors to ensure a seamless dark transition during app launch.

- **v6.5.0 (2026-05-14):** Interactive Navigation & Calculator Polish.
  - *Feature:* Enhanced calculators with detailed help tooltips and a master metric overview for better visibility into earning multipliers.
  - *UI:* Optimized Dashboard layout: aligned Oracle's Insight module height with existing guides for a balanced wide-screen bento grid aesthetic.
  - *UX:* Implemented cross-section navigation: clicking a daily chart segment now jumps specifically to that day's filtered session list in the Record table.
  - *Bug Fix:* Fixed audio context errors on mobile/iframes by implementing aggressive resume-on-gesture logic.
  - *Doc:* Created `FEATURES.md` to introduce the application's extensive mystical and technical capabilities.

- **v6.4.2 (2026-05-14):** Daily Record Auto-Save.
  - *UX:* Implemented auto-save for the Daily Record/Reflection editor in the Stats interface. Now, switching dates or clicking the "X" (Cancel) button will automatically persist current edits instead of discarding them.

- **v6.4.1 (2026-05-14):** Calculator Insights & Targeted Shop.
  - *Feature:* Added a help button (?) to the income calculator to reveal all active multipliers (Talents) and constants (Base XP/Gold) for transparency.
  - *Feature:* Implemented "Targeted Goal" in the Fixed Shop calculator, allowing users to calculate the exact sessions and days needed for a single specific item.
  - *UI:* Moved the Goal selector to the bottom of the calculator section for a cleaner layout.
  - *UX:* Added context-aware help tooltips/drawers to Level Progression and Economy modules.

- **v6.4.0 (2026-05-14):** Version 6.4.0 Milestone Update.
  - *Milestone:* Upgraded system version to 6.4.0.

- **v6.3.20 (2026-05-14):** Immersive Reflection Unification.
  - *Architecture:* Extracted the Immersive Reflection modal into a shared component to ensure parity between the Record dashboard and the End of Day summary screen.

- **v6.3.19 (2026-05-14):** iOS Touch & Tooltip Refinement.
  - *Bug Fix:* Fixed tooltip dismissal and unresponsiveness on mobile devices by securely deferring DOM mutations during the event capture phase and using stateless callbacks.
  - *Bug Fix:* Fixed heatmap popovers not dismissing when clicking outside.

- **v6.3.18 (2026-05-14):** Immersive Reflection Shared Modal.
  - *Feature:* Extracted the "End of the Day" Immersive Reflection module into a shared modal and integrated it into the Record/Stats view for a consistent distraction-free writing experience.

- **v6.3.17 (2026-05-14):** iOS Touch Interaction Bug Fix.
  - *Bug Fix:* Resolved double-tap requirement for navigation and interactions on iOS touch devices by optimising event handling in the Stats interface.

- **v6.3.16 (2026-05-14):** UI Decoupling: Oracle Insight Icon.
  - *UI:* Removed the icon to the left of "Oracle's Insight" in the Dashboard for a cleaner layout.

- **v6.3.15 (2026-05-14):** English Default Prompts.
  - *UX:* Translated the default Sage prompts from Chinese to English.

- **v6.3.14 (2026-05-14):** Input Box Readability & Complete Theme Inversion Fix.
  - *UX:* Fixed unreadable text in the input box for AI consultation interfaces by using appropriate light/dark indigo variants instead of the inverted white/slate palette.
  - *UI:* Replaced `bg-white` and hardcoded colors across prompt selectors and inputs to ensure high contrast in daylight, warm, and candy themes.

- **v6.3.13 (2026-05-14):** Sage Light Theme Background Sync.
  - *UI:* Synchronized the AI chat main message area background to exactly match the sidebar background (`bg-indigo-50`) in all light themes for improved consistency.

- **v6.3.12 (2026-05-14):** Sage UI Full-Spectrum Theme Fix.
  - *Architecture:* Overhauled global index.css to provide the full spectrum of theme-aware indigo variables (50 to 950), ensuring light theme accents correctly adapt to Warm and Candy palettes instead of defaulting to blue/purple.
  - *UI:* Polished Sage's Council modal sidebar, banner, and message bubbles directly observing Dark/Light system preferences.
  - *UX:* Implemented transparency logic (`bg-[color]/10`) for all AI interaction components in dark mode, fulfilling deep aesthetic contrast rules.

- **v6.3.11 (2026-05-14):** Sage Interface Complete Theme Synchronization.
  - *UI:* Stripped the hardcoded standard "emerald" colors from the entire Sage's Council and Advice settings.
  - *UI:* Replaced these colors with theme-aware variables (handled via "indigo" aliases in Tailwind), ensuring the AI interface beautifully adapts to "Warm", "Candy", "Ocean", and other selected themes.
  - *UI:* Fixed the Prompt Library selector and Chat Input components in the Sage Interface to dynamically swap backgrounds and text colors perfectly for Day/Light themes instead of staying stuck in dark-mode aesthetics.

- **v6.3.10 (2026-05-14):** Sage Interface Theme Polish.
  - *UI:* Fully synchronized the Sage Consultation sidebar and main chat background with the user's selected light/dark theme rules.
  - *Feature:* Added an inline edit functionality (pencil icon) in the sidebar to let users rename their saved chat history topics manually.

- **v6.3.9 (2026-05-14):** Sage Conversations & Export Feature.
  - *Feature:* Added a collapsible sidebar to the Sage AI chat interface allowing multiple conversations.
  - *Feature:* Users can now easily switch between active and past AI consultations.
  - *Feature:* Implemented specific conversation export functionality (JSON download) for the Sage's wisdom.
  - *Logic:* Migrated legacy monotonic `sageChatHistory` string to structured multiple `sageConversations` supporting automatic title generation.

- **v6.3.8 (2026-05-14):** AI Consulting Timeout & Loading Enhancements.
  - *Feature:* Sage AI conversations now persist their loading state (background loading) even if the user switches tabs or closes the consultation modal.
  - *Feature:* Added a live loading timer while the Sage consults the scrolls, letting users track exact wait times.
  - *Feature:* Enforced an automatic 180-second timeout cancellation logic for API requests—returns a friendly message if the Sage takes too long instead of hanging endlessly.
  - *Feature:* Native support for the `reasoning_content` field (DeepSeek's "Thought process", etc.); it automatically prepends the model's inner monologue as a markdown blockquote if the provider returns it.

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
