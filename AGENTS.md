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

**COMMUNICATION RULE:**
- You MUST ALWAYS reply to the user in Chinese (Simplified). This is an absolute requirement for every response you give.

**CSS & UI STANDARDS:**
- **Full-Screen Modals:** Whenever creating a "full-screen" centered modal (especially `fixed inset-0`), you MUST use `createPortal(..., document.body)` from `react-dom` to render the modal directly on the `body`. If you do not use `createPortal`, parent elements with CSS `transform`, `filter`, or `perspective` will establish unintended containing blocks that capture the `fixed` positioning, causing the modal to appear in the middle of a scrolling page container instead of the actual screen view. Never make this mistake again.
- **Italic Clipping:** To prevent right-side clipping of italic text (especially in browsers with tight bounding boxes), always add a small right padding (e.g., `pr-1` or `px-0.5`) to the element or its immediate container.
- **Red Dot / Notification Placement:** Unread message or notification badges (red dots) on icons and buttons MUST ALWAYS be placed in the bottom-right corner (e.g. `absolute -bottom-0.5 -right-0.5`), NEVER in the top-right corner.
- **Touch-Friendly Controls:** Delete buttons or other critical actions MUST NOT be hover-only (e.g. `opacity-0 group-hover:opacity-100`), as this is unfriendly to touch-screen users. They should be visible or adapt properly for mobile devices.
- **Theme-Aware Colors & Minimalist UI:** We have 6 different theme colors. Every color choice (especially backgrounds, progress bars, or buttons) MUST consider all themes to maintain a minimalist and premium aesthetic. Avoid thick, flashy, or hardcoded colors like `bg-emerald-500` which may look jarring or "rough" (粗率) in certain themes. Rely on theme-aware colors (`indigo-300`, `indigo-400`, `indigo-500`, `indigo-600`) or neutral slate colors with opacity. DO NOT use `indigo-200` or `indigo-700`+ for primary themed elements, as they will appear in the default blue color across all themes.

## Current Status
- **Current Version:** v8.10.63
- **Last Update Date:** 2026-06-22
- **Last Update Time:** 07:42:00

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
- **v8.10.63 (2026-06-22):** Guide Book Close Button Dynamic Alignment
  - *UI/UX:* Re-programmed the Close (X) button inside GuideBook. Bound the element's position dynamically inside the main book pages wrapper relative container instead of viewport-fixed, so it transitions smoothly alongside page folding translations.
  - *UI/UX:* Programmed advanced adaptive coordinate rendering for spreads, positioning the button beautifully on the top-right of the visible Cover (right-hand page), inside pages, and the visible Back Cover (left-hand page) respectively to ensure flawless visual parity and zero out-of-bounds floating elements.

- **v8.10.62 (2026-06-22):** Guide Book Theme Contrast Optimization
  - *UI/UX:* Replaced hardcoded amber and emerald CSS color classes across the Guide Book (Pages 5, 8, 9, 10, 11, 12) with custom, theme-aware variables (`--gb-gold-*` and `--gb-xp-*`), completely resolving the poor readability issue in the "Forest" (green) theme.
  - *UI/UX:* Enhanced button styling on info cards with fluid hover states, correct decoration lines, and custom color mappings that beautifully invert on both Light and Dark dynamic systems.

- **v8.10.61 (2026-06-22):** Guide Book Visual & Route Optimization
  - *UI/UX:* Repaired critical word-wrapping and layout misalignment issues across all Guide Book instructional pages by explicitly bounding icon indicators and descriptive text elements under protected flex-item containers.
  - *Feature:* Updated outdated settings routing references specifically under "PRO TIP" sections, properly redirecting players to the new "Timer" configuration panel instead of the legacy "Developer" suite.

- **v8.10.60 (2026-06-21):** Mobile Export Layout Scrolling and Code Compile Fixes
  - *Mobile UI:* Re-engineered the Controls container layout inside the Export Image modal. Converted rigid shrink-0 margins into a flex-1 shrink-0 scrollable pane on mobile viewports, permitting seamless access and scrolling to all hidden knobs, aspect ratio toggles, and Save buttons.
  - *Architecture:* Cleaned up legacy compilation inconsistencies. Properly imported centralized helper functions and resolved type mismatch anomalies across system dialogue handlers.

- **v8.10.59 (2026-06-21):** Export Image Rendering Fidelity Optimization
  - *Rendering:* Re-programmed the html-to-image engine export parameters, eliminating `skipFonts` constraints to guarantee pixel-perfect WYSIWYG text rendering that correctly respects flex layout geometries and prevents italic banner text truncations (`RECO...`).
  - *UI/UX:* Injected a uniform, high-fidelity 32px safe-zone padding directly into the final exported snapshot canvas matrix, yielding a beautiful, frame-ready aesthetic that entirely eliminates cramped edge-collisions on both statistics and diary image exports.

- **v8.10.58 (2026-06-21):** Export Image Mobile Feature Optimization
  - *Feature:* Re-programmed the image generation engine to strictly enforce a realistic 800px minimum viewport width constraint under mobile environments. Resolves text truncation and right-side layout cropping issues across exported statistics.
  - *UI/UX:* Re-structured the Export Image modal layout separating a dedicated persistent mobile header to instantly expose exit controls overriding the default stacked flex order. Guarantees top-down logical clarity without forcing users to scroll past the preview to read the title.

- **v8.10.57 (2026-06-21):** Gacha Mobile Header Layout Optimization
  - *UI/UX:* Re-programmed the Skip Animation button layout inside the Gacha result modal. Center-aligns the button under the subtitle on space-constrained mobile viewports, resolving text overlapping/collision issues on narrow screens while keeping its top-right absolute alignment on desktop displays.

- **v8.10.56 (2026-06-21):** Gacha Mobile View & Layout Optimization
  - *UI/UX:* Re-engineered single reward focus card bounds to expand size gracefully on narrow screens, giving individual draws an immersive premium aesthetic.
  - *UI/UX:* Remapped legacy high-contrast custom glowing box shadows on the primary Claim button to a standard theme-safe drop-shadow model, completely resolving the hardware-accelerated off-axis offset blob rendering glitch.
  - *UI/UX:* Enabled structural shrink-0 preservation on primary action buttons checkmark icon to avoid any structural flex-shrinking distortions in responsive grid viewports.

- **v8.10.55 (2026-06-21):** Quest Board & Achievements Mobile Optimization
  - *UI/UX:* Re-engineered Quest and Achievement card layouts with fluid responsive margins and paddings, avoiding squashed content and text overflows.
  - *UI/UX:* Re-programmed titles to flow seamlessly onto their own line on narrow smartphone screens, letting badges and tags wrap gracefully underneath.
  - *UI/UX:* Standardized checkmark indicator bounds with structural flex shrink preservation and customized theme-matching inline numeric progress pills (`quest.progress/quest.target`) visible on mobile screens.

- **v8.10.54 (2026-06-21):** Guide Book Mobile Ratio Reversion
  - *UI/UX:* Reverted the layout size ratio of the mobile Guide Book modal screen back to its previous dynamic proportional sizing settings, restoring visual parity.

- **v8.10.53 (2026-06-21):** Guide Book Mobile Sizing and Bookmark Icon Optimization
  - *UI/UX:* Re-programmed the Guide Book modal layout to scale beautifully inside a perfect 3:4 portrait view constraint using native CSS `aspect-[3/4]` combined with `h-auto` and bounding box safety alignments under mobile viewports.
  - *UI/UX:* Enlarged the chapter-selecting bookmark buttons from small footprints to bold padded targets keeping Lucide icons sized to 20px on mobile screens, vastly enhancing hand touch accuracy and visual clarity.

- **v8.10.52 (2026-06-21):** Guide Book Mobile Layout and Close Button Optimization
  - *UI/UX:* Re-programmed the Guide Book modal outer padding, leaving a customized right-hand gutter space strictly on mobile viewports so chapter tags do not crop off the screen edge in portrait orientation.
  - *UI/UX:* Relocated the Close (X) button to sit directly on the top-right margins of the book relative container on mobile screens, avoiding floating viewport overlaps.

- **v8.10.51 (2026-06-21):** Reward Pool Mobile Header Optimization
  - *UI/UX:* Re-designed the Reward Pool Management header configuration, replacing rigid line container rows with a dynamic mobile-responsive multi-line structure that flows, wraps, and aligns beautifully under high-density narrow screens, preventing text or control button overflows permanently.

- **v8.10.50 (2026-06-21):** Mobile Settings Toggle Switch Layout Fix
  - *UI/UX:* Unified all settings toggle components globally with `shrink-0` bounds protection preventing the interactive button capsule from structurally collapsing and rendering switch elements out of bounds on extremely narrow viewports (such as mobile screens displaying long text layouts).

- **v8.10.49 (2026-06-21):** Dungeon Expedition Mobile Overlap Fix
  - *UI/UX:* Re-engineered the Dungeon Expedition inner task container layout replacing strict inline inline-block alignments with a native `flex-wrap` and column-to-row scaling hybrid. This permanently eliminates nasty horizontal overlapping issues between tags, dates, and rewards on compact smartphone viewports.

- **v8.10.48 (2026-06-21):** Dashboard DDL Horizon Theme Refinement
  - *UI/UX:* Re-engineered Expedition Horizon DDL active day cards replacing aggressive dark purple fills with a cohesive, translucent `bg-indigo-500/10` tint mapping seamlessly to both Dark and native Light (slate-100 inverted) dimensions.

- **v8.10.47 (2026-06-21):** Global Time Calculation Unification
  - *Architecture:* Centralized all time-duration calculations globally utilizing the strict getSessionEffectiveMinutes function across all modules (Heatmaps, Export, Recent Sessions, Modals, Daily Overviews).
  - *Bug Fix:* Eliminated disparate focus vs raw duration edge cases securing absolute identical data parity across all analytics, successfully respecting includeRestTimeInTasks state configurations consistently.

- **v8.10.46 (2026-06-21):** Weekly Pie Chart Statistical Consistency
  - *Architecture:* Synchronized data inputs for the Weekly Pie Chart (Donut) avoiding timezone overlaps, strictly inheriting processed assignedDate arrays from the Weekly Bar unified stats engine.
  - *Bug Fix:* Corrected 6-day off-by-one interval bounds in Donut Chart ensuring Sunday sessions are fully tracked and mapped gracefully under precise custom-assigned time slots.

- **v8.10.45 (2026-06-21):** Push Notification Error Log Optomization
  - *Architecture:* Silenced terminal output for expected 401/410 push notification expiration endpoints, keeping the backend stdout clean while silently removing stale offline devices.

- **v8.10.44 (2026-06-21):** Data Consistency on Session Editing
  - *Architecture:* Re-programmed `updateSession` to fully recalculate derived game state (active XP, level down rollbacks, coins, custom daily streaks, and dungeon totalFocusTime) when users modify historical time periods or switch active objective categorizations.
  - *Feature:* Prevented automatic reward re-issuance on edited completions to avoid reward loop token mining out of trivial historic modifications.

- **v8.10.43 (2026-06-21):** Data Consistency on Session Deletion
  - *Architecture:* Re-programmed `deleteSession` and `bulkDeleteSessions` to fully reverse derived game state (active XP, level down rollbacks, coins, custom daily streaks, and dungeon totalFocusTime).
  - *Feature:* Integrated deep automatic reward reversals, stripping items, coins, and talent points initially rewarded if deleting history causes a completed objective dungeon to drop back into active status.

- **v8.10.42 (2026-06-21):** Mobile Modal Scrolling Alignment
  - *UI/UX:* Re-programmed Bulk Manage Sessions modal constraints by strictly enforcing dynamic view height cutoffs (`max-h-[calc(100dvh-2rem)]`) combined with smooth inner vertical scrolling, fully adapting the container to narrow mobile dimensions without layout lock.

- **v8.10.41 (2026-06-21):** Bulk Logic Refinements
  - *Architecture:* Re-programmed bulkCreateSessions to adhere to Plan A: Bulk added sessions now act purely as historical tracking points and do not independently generate game rewards.
  - *Architecture:* Re-programmed bulkDeleteSessions to intelligently subtract derived XP, coins, and objectives correctly when deleting organically rewarded authentic sessions.

- **v8.10.40 (2026-06-20):** Snapshot Comparison Engine
  - *Feature:* Upgraded the local backup restore payload to display a side-by-side data comparison between the current memory and the selected snapshot before overwriting.
  - *UI/UX:* Renamed "LOCAL MEMORY SNAPSHOTS" strictly to "SNAPSHOTS" for a minimalist, cleaner settings interface.

- **v8.10.39 (2026-06-21):** Local Memory Snapshots
  - *Feature:* Added an intuitive Local Memory Snapshots feature under Cloud Sync Settings to hold up to 10 latest local state backups directly in the browser's persistent storage.
  - *UI/UX:* Integrated a sleek, matching dark slate and emerald management panel listing exact save timestamps, current levels, and quick restore capabilities.

- **v8.10.38 (2026-06-21):** Cloud Save History Serverless Endpoint Fix
  - *Bug Fix:* Re-programmed `/api/sync.ts` serverless function to correctly support path-based routing for history lookup and backup generation.
  - *Architecture:* Ported Redis backup list truncation and storage quota constraints to the serverless sync handler ensuring database parity.

- **v8.10.37 (2026-06-20):** Explore Current Build Collapse Fix
  - *Bug Fix:* Resolved critical layout collapse of the Current Build card on narrow-height widescreen environments.
  - *UI/UX:* Replaced flex-1 style on the Current Build card with shrink-0, preserving proportional heights and borders across all viewport sizes.

- **v8.10.36 (2026-06-20):** Explore Viewport Strict Height Enforcements
  - *Architecture:* Removed `overflow-hidden` constraints allowing normal page scrollability for historical panels gracefully without collapsing the grid.
  - *UI/UX:* Upgraded CSS Grid parameters replacing stretch intrinsic heights with exact viewport offset coordinates (`calc(100dvh-12rem)`). Enforced the Timer module stays perfectly vertically balanced within the fold bounding limits regardless of active tall secondary content triggering the scrollbar natively on the right column.

- **v8.10.35 (2026-06-20):** Explore Viewport Timer Visibility Restoration
  - *Bug Fix:* Resolved critical disappearance of the active timer and focus controls on widescreen environments.
  - *UI/UX:* Re-programmed structural height inheritance inside the flex-grid hybrid layout, securing perfect visibility of all timer buttons without expanding beyond viewport vertical boundaries.

- **v8.10.34 (2026-06-20):** Explore Viewport Vertical Constraints Optimization II
  - *UI/UX:* Re-programmed the Explore dashboard structural viewport grid calculations from fixed screen heights to dynamic offsets.
  - *UI/UX:* Eliminated vertical scrolling on wide landscape screens, natively bounding the timer module perfectly within a single view without clipping buttons or leaving empty whitespace.

- **v8.10.33 (2026-06-20):** Explore Viewport Vertical Constraints Optimization
  - *UI/UX:* Re-programmed the Explore dashboard structural viewport grid calculations from fixed screen heights to dynamic offsets.
  - *UI/UX:* Eliminated vertical scrolling on wide landscape screens, natively bounding the timer module perfectly within a single view without clipping buttons.

- **v8.10.32 (2026-06-20):** Cloud History Memory Restoration Fix
  - *Bug Fix:* Resolved critical restoration error in Cloud History where pulling backups visually triggered but failed to restore active dungeon and major objective data correctly due to internal local storage key mismatches.

- **v8.10.31 (2026-06-20):** Global Page Padding & Layout Standardization
  - *UI/UX:* Standardized layout constraints across all major dashboard views (Expedition, Explore, Talent Tree, Merchant's Outpost, Reward Vault, Record).
  - *UI/UX:* Unified all dynamic rendering gutters and space dividers, aligning inner viewport coordinates consistently to identical padding standards.

- **v8.10.30 (2026-06-20):** Italic Title Clipping Prevention & Spacer Safety
  - *Bug Fix:* Resolved right-side clipping of italic banner titles (e.g., "EXPEDITION" and "AGENDA") on mobile and desktop viewports.
  - *UI/UX:* Upgraded custom `PageHeader` layouts and `TodayView` titles with precise padding configurations and flexible spacing boundaries, successfully preventing italic truncation.

- **v8.10.29 (2026-06-20):** Expedition Horizon Active Day High Contrast Enhancement
  - *UI/UX:* Re-engineered children elements and background definitions of the Expedition Horizon Today active cell to adopt a beautiful, theme-aware glowing style, eliminating the dark, dull, greyish look.
  - *UI/UX:* Integrated theme-specific dynamic contrast logic, yielding sharp, glowing white day labels under dark themes and crisp dark indigo text on light themes.

- **v8.10.28 (2026-06-20):** State Updater Pure Function Re-architecture
  - *Bug Fix:* Eliminated critical strict-mode side-effects embedded deep within \`setDungeons\` and \`setMajorDungeons\` updater functions preventing dual-computation reward loops and state duplication.
  - *Architecture:* Synchronized React array mapping patterns utilizing synchronous scope injections instead of relying dynamically on enclosed parameter arrays, natively detaching \`addRewardToHistory\` execution curves from concurrent evaluations safely.

- **v8.10.27 (2026-06-20):** Expedition Blueprint Optimization & Fullscreen Feature
  - *UI/UX:* Resolved truncation and layout clipping on the Expedition Blueprint module inside Sage's Council specifically on compact mobile viewports.
  - *Feature:* Added a standalone togglable Fullscreen display mode to significantly expand the Blueprint container for enhanced reading and detailed editing.

- **v8.10.26 (2026-06-20):** Sage Bubble Theme Adaptability
  - *Bug Fix:* Repaired legibility issue where Sage's Markdown prose retained pure white text (prose-invert) leading to invisible text against light-background themes like Candy.
  - *UI/UX:* Deployed custom `.prose-sage` class to directly bridge `react-markdown` outputs onto the dynamic inverted SLATE dimension palette.
  - *UI/UX:* Restored intended horizontal bubble paddings by eliminating over-zealous manual right-margin clipping rules.

- **v8.10.25 (2026-06-20):** Sage's Council Native Theme Inversion Optomization
  - *Architecture:* Removed hardcoded explicit light mode conditional branch blocks (`isDarkTheme ? A : B`) throughout Sage's Council layout containers.
  - *UI/UX:* Unified structural colors to standard foundational Dark Semantic Tokens (e.g. `bg-slate-900`, `border-slate-800`, `text-slate-300`) to perfectly align with Sanctum Plaza architectures, thereby accurately unlocking the app's native CSS Variable inversion engine to flawlessly project intended Daylight, Warm Sun, and Candy theme palettes natively without artificial background overwriting.
  
- **v8.10.24 (2026-06-20):** Consultations Sanctum Color Customization
  - *UI/UX:* Re-engineered the Consultations layout color schema in both the Dashboard and global Settings modules to fundamentally align with the sleek, high-contrast visual identity of the Sanctum Plaza.
  - *UI/UX:* Replaced static, hardcoded indigo backgrounds, bright borders, and overly blue message bubbles with polished neutral slate architectures featuring intentional, exact indigo active accenting.

- **v8.10.23 (2026-06-20):** Consultations Mobile Popup Drawer Layout
  - *UI/UX:* Re-designed Consultations sidebar into an absolute overlay drawer with backdrop strictly on mobile screens, replicating modern AI chat interface spatial behaviors.
  - *UI/UX:* Integrated dynamic auto-closing bounds ensuring the Consultations drawer immediately conceals itself upon topic selection saving physical viewport area on constrained devices.

- **v8.10.22 (2026-06-20):** Expedition Horizon Mobile Header Optimization
  - *UI/UX:* Optimized Expedition Horizon header spacing and padding on mobile screens to prevent text overflow and layout wrapping.
  - *UI/UX:* Shortened dynamic title label on narrow displays to custom Horizon form, while preserving the full Expedition Horizon title on standard sizes.

- **v8.10.21 (2026-06-20):** Study Heatmap Year Summary Layout Refinement
  - *UI/UX:* Displayed the "Year Summary" card fixedly below the large year heatmap calendar, avoiding side-by-side columns and centering it perfectly.
  - *UI/UX:* Re-organized the internal sub-cards of the Year Summary into a neat, balanced 2-column/2x2 grid on standard displays for optimal spacing and density.

- **v8.10.20 (2026-06-20):** Study Heatmap Year Summary
  - *Feature:* Enabled the same detailed summary module (Total/Avg metrics) seamlessly inside the Year View of the Heatmap.

- **v8.10.19 (2026-06-20):** Study Heatmap Layout Center Alignment
  - *UI/UX:* Centered both the heatmap calendar cards and summary nodes horizontally inside standard container viewports.

- **v8.10.18 (2026-06-20):** Study Heatmap Cards Centered Layout
  - *UI/UX:* Centered and grouped the Total and Avg/Day metric nodes within the consolidated Study Time, Gold Earnings, and EXP Earnings cards, keeping them unified in the center rather than pushed to extreme margins.

- **v8.10.17 (2026-06-20):** Study Heatmap Cards Realignment
  - *UI/UX:* Consolidated Total Time/Tasks and Daily Average Time/Tasks into a single unified "Study Time" metric card leveraging dual-column layout.
  - *UI/UX:* Unified text label sizes and icon sizes of "Gold Earnings" and "EXP Earnings" cards to exactly match the "Focused Days" card standard.
  - *Typography:* Rescaled the main timeframe header of the 30 Days/Month/Year summaries down to a more balanced, elegant typography standard.

- **v8.10.16 (2026-06-20):** Study Heatmap Summary Cards Consolidation
  - *UI/UX:* Merged separate Total Gold and Average Gold stats into a single unified "Gold Earnings" card; merged separate XP stats into a single unified "EXP Earnings" card.
  - *UI/UX:* Replaced any legacy icon badge visuals on the EXP card with matching `Zap` icons to align perfectly with DAILY/WEEKLY page cards.
  - *Typography:* Styled the main summary frame header to be the largest, highly prominent display title in the panel, using elegant italicized bold tracking.

- **v8.10.15 (2026-06-20):** Study Heatmap Rich Summary UI
  - *Feature:* Enriched the 30 Days/Month/Year timeframe summary by showing total accumulated Time, percentages, and cleanly aligned metrics across the board.
  - *UI/UX:* Redesigned the heatmap summary card utilizing modern Lucide icon pairings, intelligent mobile-responsive grid spanning, and replacing legacy plain-text emojis.

- **v8.10.14 (2026-06-20):** Time Display Compact Spacing Optimizer
  - *Bug Fix:* Re-formatted all time duration occurrences across the Daily, Weekly, and Heatmap statistics from "[x] h [y] min" to the compact "[x]h [y]min" format.
  - *UI/UX:* Removed distracting whitespaces around time units to create a seamless, professional, and visually condensed statistical display.

- **v8.10.13 (2026-06-20):** Study Heatmap Header Labels Formatting
  - *Bug Fix:* Replaced generic "Custom" date text label with precise, auto-updating 30-day start and end date ranges formatted in clean sans-serif typography.
  - *UI/UX:* Optimized width of the date range picker container to comfortably display localized spans without ellipsis clipping.

- **v8.10.12 (2026-06-20):** Study Heatmap Mobile Scaling & Layout Alignment
  - *Bug Fix:* Re-aligned the scroll-safe centering architecture using auto flex margins (mx-auto), ensuring the grid is centered across all screens.
  - *UI/UX:* Integrated fluid viewport units (vw) with protective caps to dynamically magnify cells on mobile screens for better visibility and touch interactions.

- **v8.10.11 (2026-06-20):** Study Heatmap Mobile Layout Optimizer
  - *Bug Fix:* Resolved CSS flex centering bug causing scroll clipping on narrow mobile viewports, enabling fluid overflow scroll starting cleanly from the left boundary.
  - *UI/UX:* Compacted heatmap container margins and grid paddings, wrapped action labels to fit smaller smartphone dimensions, and optimized summary widgets.

- **v8.10.10 (2026-06-20):** Sleep Tracker Mobile Layout Optimizer
  - *Bug Fix:* Optimized Sleep activity chart margins and font boundaries on compact screen views, preventing label overflow truncation.
  - *UI/UX:* Re-designed interactive chart containers with responsive fluid paddings and integrated a stylish, high-contrast visual legend.

- **v8.10.9 (2026-06-20):** Chart Tooltips Viewport-Aware Auto-Bounding
  - *Bug Fix:* Re-engineered custom Recharts tooltips (Shared, Daily, and Sleep graphs) using React layout effects to dynamically shift bounding boxes inside viewport gutters.
  - *UI/UX:* Eliminated off-screen popover cropping on extreme mobile viewport margins by applying math-perfect horizontal translateX translation vectors.

- **v8.10.8 (2026-06-20):** Victory Screen Container Overflow Fix
  - *Bug Fix:* Corrected CSS vertical centering on the session complete Reward Screen modal, allowing top-aligned layouts and vertical scrollability on compact mobile viewports.
  - *UI/UX:* Configured safe vertical paddings ensuring session intelligence details and stat gains display cleanly without cropping at the top edge of mobile touchpoints.

- **v8.10.7 (2026-06-20):** Responsive Calendar Popover Bounds Safety
  - *Bug Fix:* Re-engineered PopoverPortal to dynamically calculate popover element widths, bounding calculations perfectly on screen margins and preventing off-screen clipping on mobile screens.
  - *UI/UX:* Enforced synchronous useLayoutEffect paint constraints and set robust safety paddings preserving balanced visual layouts regardless of viewports.

- **v8.10.6 (2026-06-20):** Agenda Mobile Transition Flash Correction
  - *Bug Fix:* Re-synchronized transition handlers and wrapped the Today View page in a dedicated motion container, eliminating blank black frame flashes on mobile screens.
  - *UI/UX:* Upgraded AnimatePresence tab mode to coordinate exit and enter cycles seamlessly, ensuring stable container scale thresholds without heights collapsing.

- **v8.10.5 (2026-06-20):** Agenda Mobile Navigation and Typography Refinements
  - *Bug Fix:* Eliminated target `absolute inset-0 bg-slate-950 z-50` full-viewport layout overlay on Agenda, resolving black/dark-slate frame entry flashes on mobile transitions.
  - *UI/UX:* Re-positioned Agenda integration as standard relative page content inside the dashboard, restoring topbar levels, experience, and coin status headers fully-pinned at the top of the viewpoint.
  - *UI/UX:* Uppercased and italicized the Agenda title with size 3xl and clipping protection, fully matching other page banners.

- **v8.10.4 (2026-06-20):** Mobile Screen Agenda Form Optimizer
  - *UI/UX:* Reduced container layout padding on mobile sizes to prevent clipping of action controls at narrower widths.
  - *UI/UX:* Integrated flex `min-w-0` and proportional flex layout values on layout children to ensure the input form scales seamlessly without squeezing buttons.

- **v8.10.3 (2026-06-20):** End of the Day Compact Spacing Alignment
  - *UI/UX:* Tightened vertical spacing of the right column inside the End of the Day settlement modal by adjusting container gaps.
  - *UI/UX:* Removed redundant top margin from the "Save & Rest" button to allow elements to flow cleanly and match the minimal layout of the Start of the Day modal.

- **v8.10.2 (2026-06-20):** End of the Day Column Dual-Height Absolute Symmetry
  - *UI/UX:* Matched left column wrapper properties symmetrically with the right column, enforcing exact same vertical scaling.
  - *UI/UX:* Re-designed Efficiency Rating card to stretch dynamically and center elements neatly on widescreen, completing absolute high-precision alignment.

- **v8.10.1 (2026-06-20):** End of the Day Column Height Equalization
  - *UI/UX:* Upgraded End of the Day modal structure using standard high-performance flex stretching layout, aligning left and right column heights symmetrically.
  - *UI/UX:* Enabled the Daily Reflection card to dynamically expand and fill all remaining vertical space inside the right column for perfect design proportions.

- **v8.10.0 (2026-06-20):** Start of the Day Agenda List & Dynamic Integration
  - *Feature:* Added an interactive, beautiful "Today's Agenda" Todo card within the Start of the Day modal to fully fill the unoccupied left column workspace.
  - *Feature:* Fully synchronized card state with the application's master Today/Agenda module, allowing seamlessly adding objective checkmarks, delete targets, and custom quests.
  - *Feature:* Integrated dynamic expedition selectors, allowing players to assign specific active dungeon quests directly into their daily focus agenda.

- **v8.9.5 (2026-06-20):** Widescreen Settlement Modal Refining & Button Placement
  - *UI/UX:* Redesigned "Start of the Day" and "End of the Day" modals by completely removing the redundant bottom fixed footer bars.
  - *UI/UX:* Repositioned start/save action buttons inside the right column directly under key content widgets to avoid scrolling clipping.
  - *UI/UX:* Slightly scaled down the header titles (from 2xl/3xl to xl/2xl) and deleted the redundant encouragement block to boost overall readability and layout density.

- **v8.9.4 (2026-06-20):** Widescreen Timeline & Spacing Denseness
  - *UI/UX:* Relocated the daily settlement period timeline so it is displayed side-by-side with the header title on wider screens.
  - *UI/UX:* Compacted margins, paddings, card widths, and grid gaps inside both Start of the Day and End of the Day modals to optimize widescreen density and reveal hidden elements.

- **v8.9.3 (2026-06-20):** Compact Header & Record Symmetrical Grid
  - *UI/UX:* Squeezed height dimensions of "Start of the Day" and "End of the Day" headers to a compact narrow fit.
  - *UI/UX:* Redesigned "Today's Record" stats grid inside daily summary, locking elements neatly into exactly 1 row with 4 columns on larger viewports.
  - *UI/UX:* Standardized study time suffixes and durations from m to min.

- **v8.9.2 (2026-06-20):** Settlement Task Equalization
  - *UI/UX:* Upgraded Start of the Day and End of the Day widescreen grid limits to split evenly at 50/50 instead of skewing content.
  - *UI/UX:* Blank and Example template functionality neatly folded into the Templates popover button list, simplifying the main interface toolbar.

- **v8.9.1 (2026-06-20):** Dual-Column Settlement Flow.
  - *UI/UX:* Redesigned Start of the Day and End of the Day prompts targeting responsive dual-column layouts for wide screens.
  - *UI/UX:* Unified typography styling across modals and fully aligned heading SVG icons.

- **v8.9.0 (2026-06-20):** Full-Page "Today" Agenda View.
  - *Feature:* Introduced a new dedicated "Today" screen accessed from the dashboard, replacing the previous "Daily Progress" module logic.
  - *Feature:* Implemented interactive daily task list management inside the Today view, allowing users to define specific objectives and seamlessly tap into ongoing Expedition dungeons.
  - *UI/UX:* Renamed "Daily Progress" to "Today". Streamlined the widget by removing non-essential Settlement text, stacking the Start/End triggers vertically, setting the exact time suffix to "min", and ensuring the deep-link arrow is persistently visible.

- **v8.8.15 (2026-06-19):** Sanctum Plaza Unlock Independence.
  - *Feature:* Unlocked core Fellowship visibility removing the strict Developer Mode entrance barrier. All users can now normally view available guilds and join the lobby.
  - *Security:* Rerouted strict password constraints specifically to the Guild Creation action instead, preserving server limits via the unified secure password engine.

- **v8.8.14 (2026-06-19):** Developer Access Security Password.
  - *Security:* Hardcoded developer modes, Redis backend synchronization, and Google Drive access flows now require a secure server-sided authentication password rather than being strictly click-through mock unlocks.
  - *UI/UX:* Integrated dynamic password verification text fields directly into Developer Settings and Cloud Settings modal windows for explicit data protection.

- **v8.8.13 (2026-06-19):** Cloud Save History Restorations.
  - *Feature:* Added secure access enabling users to view and surgically restore from the 3 most recently overwritten cloud states (available universally across Redis, Google Drive, and WebDAV endpoints).
  - *UI/UX:* Introduced the Cloud History Modal overlay inside the configuration matrix containing non-blocking parallel fetch queries directly injecting chronologically tracked backups preventing historical state loss.

- **v8.8.12 (2026-06-19):** Cloud Sync Device Overwrite Guard.
  - *Bug Fix:* Resolved critical silent-upload data loss bug where initializing a new device would silently overwrite cloud configurations when standard automatic checkpoints bypassed device mismatch verifications.
  - *Security:* Hardcoded structural device ID boundaries: uploading local payloads to the cloud now strictly enforces a device inheritance lock. You must explicitly download and merge existing cloud progress first (sharing its identity) before the system will authorize any upstream uploads.

- **v8.8.11 (2026-06-19):** Stats View Dashboard Alignment.
  - *UI/UX:* Left-aligned the "Daily" header title relative to its accompanying inline calendar icon within the core Stats/Record dashboard, ensuring symmetrical spacing and preventing extreme right-ward justification across narrow screens.

- **v8.8.10 (2026-06-19):** Explore View Mobile Layout Fixes.

  - *UI/UX:* Resolved horizontal scrolling issue on narrow mobile devices occurring under the Explore tab (Current Build, Active Talents cards). Applied strict horizontal overflow bounds (`overflow-x-hidden`) accurately clipping inner layout spillovers (such as wide tooltip thresholds) preventing structural sliding across the screen.

- **v8.8.9 (2026-06-19):** UI Responsiveness & Refinement.
  - *UI/UX:* Resolved horizontal viewport overflow within `StatsView` causing screen sliding on narrow mobile screens. Migrated `grid-gap` constraints from `gap-3` inside 3-column Daily and Weekly Gain summaries seamlessly down to `gap-1.5` on narrow viewports while shrinking embedded cell padding correctly. Integrated robust text truncation arrays (`line-clamp-1`, `break-all`, `min-w-0`) aggressively securing structural layout limits preventing rigid data inputs (e.g., elongated time duration strings) from distorting grid definitions dynamically.

- **v8.8.8 (2026-06-19):** Daily Statistics Synchronization & Stability.
  - *Bug Fix:* Resolved critical bug where Daily statistics charts (Pie and Donut formats) failed to populate data for the current day due to erroneous date-boundary math causing shifts backwards to yesterday on initial load.
  - *Architecture:* Re-routed the `DailyPieChart` source stream to directly depend on `dailySessions` established centrally within `Stats.tsx`, overriding localized parsing logic and securing 1:1 identical structural symmetry between Bar charts and Donut variations.
  - *Bug Fix:* Eliminated potential `NaN` generation deep within `getSessionEffectiveMinutes` core calculation routines caused by incomplete or corrupted historical timestamp lengths. All non-numeric derivations strictly resolve to 0 defaults safely.

- **v8.8.7 (2026-06-19):** Fixed Avg Time Calculations and Chart Formats.
  - *Bug Fix:* Repaired `NaN` evaluation errors in Javascript causing full statistics unmounting across the application whenever the denominator active days length resolved to zeros or floats inside custom formatDuration tools.
  - *Architecture:* Standardized all Weekly and Heatmap metric engines (`Avg Time`, `Daily Avg Gold`, `Daily Avg Exp`) to calculate their sum strictly across the exact date ranges selected (e.g. ÷ 7 for week scales), instead of solely depending on localized `activeDaysCount` modifiers, ensuring true statistical symmetry for blank inactivity periods.

- **v8.8.6 (2026-06-19):** Unified Time Formatting.
  - *UI/UX:* Upgraded time display formatting across the Record module's Daily, Weekly, and Heatmap statistics. Replaced raw minute counts and compact representations with a consistent, readable `[x] h [y] min` string. Changed corresponding "Time (min)" labels simply to "Time" or "Study Time".

- **v8.8.5 (2026-06-19):** Silent Sync Overwrite Integrity Override.
  - *Bug Fix:* Muted the "一改动就弹窗" (constant conflict popup) defect heavily observed when using background 'Immediate' auto-sync with the Redis provider. Backend endpoints fundamentally enforce un-bypassable `409 Conflict` restrictions tracking purely via device code discrepancy. Repaired frontend `syncToCloud` routines natively injecting runtime `forceOverwrite: true` flags safely bypassing the backend limits ONLY perfectly mapping to authenticated `silent_upload` directives established via local pre-checks whenever local changes identically match or natively branch ahead of the targeted cloud versions.
  - *UI/UX:* Re-instated standard `cloud_newer` disruption modals expressly triggering selectively on runtime `Immediate` sync cycles successfully shielding user payloads when cloud saves independently bypass local timestamps natively, strictly abiding by user specifications.

- **v8.8.4 (2026-06-19):** Cloud Sync Auto-Trigger Lifecycle Rescue.
  - *Bug Fix:* Repaired auto-sync triggers getting completely blocked and resetting silently during application bootstrap. Local mutations are now tracked faithfully via `localDirtyAtRef` and `hasUnsyncedChanges` even if the initial synchronization barrier prevents momentary upload. Once the initial bounds check resolves identically against the cloud, the application correctly executes a flush sequence triggering the queue rather than dropping local progress updates silently.
  - *Architecture:* Fully decoupled tracking of `hasUnsyncedChanges` dirty indicators and component-state `lastUpdated` times arrays. Re-engineered `useCloudSync` to pass a strict success acknowledgment payload executing `onSuccess` solely inside HTTP payload completions ensuring dirty bits are not maliciously cleaned if an upload silently aborts or yields to `cloud_newer` state constraints.

- **v8.8.3 (2026-06-17):** Self-Contained WebDAV Proxy & PROPFIND Probe.
  - *Bug Fix:* Refactored `/api/webdav/proxy.ts` into a self-contained runtime function with zero external shared logic dependencies to prevent Vercel Serverless Function module resolution failures.
  - *UI/UX:* Re-engineered WebDAV connection validation in `CloudSettingsSection.tsx` to utilize `PROPFIND` checking on the actual storage directory instead of attempting a `GET` request on the non-existent `scholars_dungeon_save.json` file. Permits initial setups with empty cloud folders.

- **v8.8.2 (2026-06-17):** Serverless Edge Compatibility.
  - *Bug Fix:* Removed native Node.js `dns/promises` module import explicitly to prevent Vercel Serverless environment worker initialization crashes (`FUNCTION_INVOCATION_FAILED`) when instantiating the WebDAV proxy endpoint.

- **v8.8.1 (2026-06-17):** WebDAV Handshake & Cache Reset.
  - *Bug Fix:* Re-introduced standard `User-Agent` and `Accept` headers into WebDAV HTTP requests allowing cloud backends (like Jianguoyun and Nextcloud) to successfully handshake without immediately throwing network protocol rejections.
  - *UI/UX:* Bumped version strictly to force a browser cache invalidation ensuring recent error-trace reporting logic propagates fully onto the client context preventing misleading generic timeout errors.

- **v8.8.0 (2026-06-17):** WebDAV Resilience & Serverless Optimization
  - *Bug Fix:* Fortified `/api/webdav/proxy` against `FUNCTION_INVOCATION_FAILED` errors on Vercel by introducing comprehensive global try-catch boundaries, safely normalizing dynamic HTTP request bodies into structured JSON, and cleanly converting stream parsing defects into graceful `502` API payloads instead of silent server crashes.
  - *Bug Fix:* Resolved serverless sandbox networking limitations where explicit native DNS system queries (`dns.lookup`) fail due to execution ecosystem limits, allowing them to gracefully fallback and connect cleanly using high-performance host-platform HTTP resolvers.
  - *Feature:* Dramatically reduced WebDAV payload footprints (by eliminating synchronous raw `fullLocalStorage` uploads) while locally validating synchronization packets to gracefully reject oversized payloads (>=3.5MB) prior to transmission, stabilizing tight cloud limitations.
  - *UI/UX:* Upgraded `CloudSettingsSection` WebDAV diagnostic workflows to natively accept `404` (File Not Found) responses as successful structural connections, permitting users to actively store configurations toward verified, albeit empty, directory targets, and prevented silent error masking by displaying descriptive response errors explicitly.

- **v8.8.0 (2026-06-17):** Version Bump
  - *General:* Updated version to 8.8.0.

- **v8.7.42 (2026-06-17):** Fellowship Data Parsing Resilience.
  - *Bug Fix:* Implemented `safeJsonParse` in `api/teams.ts` to securely handle corrupted Redis list entries for members, messages, events, applicants, and proposals. Corrupted data entries are now cleanly skipped instead of inducing fatal 500 errors across the entire Fellowship endpoint.

- **v8.7.41 (2026-06-17):** Fellowship Chat Reliability Hardening.
  - *Bug Fix:* Strengthened `TeamModule`'s `sendMessage` optimistic UI by adding explicit server validation checks for `success`, preventing silent message drops and rendering clear error alerts while explicitly rolling back temporary texts upon failure.
  - *Security:* Hardened `api/teams.ts` `action=message` endpoint to assert the active requesting `userId` against current team rosters explicitly, actively blocking external injection and ensuring 403 errors surface properly.

- **v8.7.40 (2026-06-17):** Fellowship Identity Sync Continuity Fixes.
  - *Bug Fix:* Hardened identity parsing in `api/teams.ts` to securely validate `userLevel`. Existing levels are now safely preserved instead of defaulting to level 1 for empty payloads during background refresh loops.
  - *Bug Fix:* Updated Fellowship background polling in `App.tsx` and manual fetch flows in `TeamModule` to fully supply standard identity headers (`x-user-level`, `x-user-title`, `x-user-unique-id`, etc.), ensuring guild members dynamically update without information loss over time.

- **v8.7.39 (2026-06-17):** Local Storage State Parsing Crash Fix.
  - *Bug Fix:* Added proper try-catch handlers when parsing `dungeons` and `majorDungeons` from `localStorage` on initialization. This securely prevents the entire application from failing to mount (white screen) if a specific key was corrupted or contained invalid JSON payloads.

- **v8.7.38 (2026-06-17):** Unified Dashboard Duration Statistics.
  - *Architecture:* Synchronized duration calculation formulas across all active stats visuals. Integrated `getSessionEffectiveMinutes` into 24-hour modes in `DailyPieChart` and day/period formats in `WeeklyPieChart`, passing necessary parameters Downstream.
  - *Architecture:* Re-routed `ExploreView`'s active study time and Talent eligibility meters away from simplified session counters to rely directly on exact history-recalculated daily effective focus minutes.

- **v8.7.37 (2026-06-17):** Quest Progress Recalculation Synchronization.
  - *Bug Fix:* Implemented a local `recalculateQuestProgressFromHistory` helper within the `useGameState` state engine, executing automatically on any edit/deletion of study sessions.
  - *Bug Fix:* Synchronizes quest progress and completion states for `daily_sessions`, `weekly_sessions`, `monthly_sessions`, and `total_sessions` metrics based strictly on current `state.history` while preserving reward integrity for already claimed quests without rolling back currency or logging history.

- **v8.7.36 (2026-06-17):** Statistics Source Unification.
  - *Architecture:* Centralized study session duration parsing application-wide by unifying `Stats`, `DailyPieChart`, and `DashboardView` around the newly synchronized `getSessionEffectiveMinutes` and `getSessionSettlementDate` core metrics engines.
  - *Architecture:* Re-routed the `DailySummaryModal` total focus logic to bypass volatile state aggregators in favor of robust array mapping identical to the core heatmaps. Modified absolute timestamp resolution globally to strictly adhere to Custom Day Start properties and includeRestTimeInTasks definitions without regression.

- **v8.7.35 (2026-06-17):** Synced Derived Data for Session Alterations.
  - *Bug Fix:* Re-architected `updateSession` to precisely measure delta changes in internal progress structures (`focusDuration`, `duration`, `restDuration`). The logic now synchronously propagates differential updates directly to global `dailySessions`, associated `dungeon completedSessions`, baseline `coins`, and core `xp`. Incorporates complete local transaction rollback processing via `processTransaction` correctly preventing sub-zero state corruption while logging explicit historical modification contexts locally whenever a previous session is edited.

- **v8.7.34 (2026-06-17):** Unified Quest Reward Application Logic.
  - *Architecture:* Created a centralized internal helper `applyQuestReward` in `useGameState.ts` to process quest-related grants uniformly across all subsystems. Replaced hardcoded fragmented reward assignment logic previously scattered inside the automated popup handler, singular manual `claimQuestReward`, and bulk `claimAllQuestRewards` workflows. This guarantees that standard metrics like Experience, Gold, Talent Scrolls, Shards, Death Defying Gold Medals, Double XP, and Double Coin cards all obey exact symmetrical parsing operations with synchronized `rewardHistory` recording strictly without data loss or duplication risks.

- **v8.7.33 (2026-06-17):** Cloud Sync Hook Dependencies Update.
  - *Bug Fix:* Unified and appended missing React dependencies (`isInitialSyncCheckDone`, `isCooledDown`, `isSyncing`, `isVerifying`, `stripVolatile`, etc.) directly into `syncToCloud`, `checkCloudSync`, and `fetchFromCloud` `useCallback` arrays to eliminate stale closure references.

- **v8.7.32 (2026-06-17):** Cloud Auto-Sync Config Triggers Integration.
  - *Bug Fix:* Unified automated sync triggers (`debounce`, `interval`, `Visibility API Active`, `beforeunload`) extending support natively for 'WebDAV' and 'Google Drive' providers without explicitly demanding `state.secretCode` presence. Safeguarded these event triggers fully within `isInitialSyncCheckDone` integrity locks globally.

- **v8.7.31 (2026-06-17):** Cloud Sync State Race Fixes.
  - *Bug Fix:* Repaired false positive cloud newer conditions. Modified `syncToCloud` internal timestamp comparisons securely falling back to `getSyncFingerprint` evaluation. Eliminates local creation timestamp override loops incorrectly wiping cloud archives passively.
  - *Bug Fix:* Hardened hook dependency logic inside `syncToCloud`, accurately tying references back to `isInitialSyncCheckDone` preventing stale closure resets globally.
  - *Security:* Barricaded `checkCloudSync` logic explicitly removing auto-sync unlock triggers inside error, catch, and offline paths. System accurately enforces absolute verification checks retaining lock bounds successfully during 404 or down service timeouts.

- **v8.7.30 (2026-06-17):** Cloud Sync Fingerprint Comparison & Initial Integrity Lock.
  - *Bug Fix:* Replaced strict string comparisons with a robust, order-agnostic fingerprinting engine (`getSyncFingerprint`). This securely excludes local volatile data (e.g., `deviceNickname`, `syncHistory`, `lastUpdated`) eliminating false-positive cloud conflict prompts.
  - *Bug Fix:* Added an `isInitialSyncCheckDone` safety mutex explicitly blocking automated background sync triggers (like tab-blur, before-unload, debounce, generic state-initialize logic) until the app successfully queries and compares with the target remote endpoint exactly once at startup, decisively arresting cross-device overwrite races immediately during bootstrap.
  - *UI/UX:* Upgraded Conflict Resolution modal text providing definitive overwrite warnings.

- **v8.7.29 (2026-06-17):** Quest Auto-Claim Multiple Rewards Support.
  - *Bug Fix:* Upgraded quest popup auto-claim logic to accurately process and deploy plural rewards natively for quests supplying multiple simultaneous grants, guaranteeing total payout symmetry with manual user claim pathways.

- **v8.7.28 (2026-06-17):** Daily Log Field Preservation Fix.
  - *Bug Fix:* Modified `saveDailyLog()` engine structurally preserving existing sibling attributes like native sleep tracking metrics (`sleepTime`, `wakeTime`) by merging current object instances flawlessly prior to asserting incoming rating updates instead of blindly rewriting the targeted date slice and clipping historical sub-elements.

- **v8.7.27 (2026-06-17):** State Engine Accuracy Fixes & Progression Hooks.
  - *Bug Fix:* Mapped XP and gold coins granted directly through `claimDailyTalentReward()` explicitly back into core scaling matrices natively (previously recorded strictly into audit logs but failed to inject directly into absolute stats).
  - *Bug Fix:* Overhauled internal data map dependencies handling immediate major dungeon cascade completion triggers within `completeSession()`, preventing an uninitialized structural reference from inducing fatal app stalls upon native subtree completion.

- **v8.7.26 (2026-06-16):** Start of the Day Optional Toggle.
  - *Feature:* Added a toggle switch within General Settings to enable the "Start of the Day" prompt. The automatic popup is now disabled by default, honoring the minimalist workflow while giving users the option to reactivate the daily check screen on first load.

- **v8.7.25 (2026-06-16):** Removed Client-Side Hardcoded Passwords.
  - *Security / UI UX:* Removed all easily bypassed client-side hardcoded static passwords (old front-end testing passwords have been removed). Upgraded the Developer Mode and Cloud Integrations access overlays from pseudo-security barriers into explicit, clear-text behavioral warning dialogues acknowledging local restrictions and experimental limits prior to allowing proceed triggers instead.

- **v8.7.24 (2026-06-16):** WebDAV Proxy SSRF Hardening.
  - *Security:* Hardened the backend `/api/webdav/proxy` endpoint against SSRF (Server-Side Request Forgery) attacks. Enforced a strict protocol whitelist (only HTTPS allowed, or HTTP in local development), blocked internal/metadata IP ranges, implemented a 10-second timeout using AbortController, limited acceptable methods, restricted payload size to 10MB, and scrubbed upstream stack traces and errors to prevent fingerprinting. Consolidated the duplicate proxy implementation directly within `server.ts` into a unified handler.

- **v8.7.23 (2026-06-16):** Google OAuth Origin Security.
  - *Security:* Hardened Google OAuth window messaging routines across `server.ts` and `api/google/url.ts`. Added a strict `isValidOrigin` barrier to sanitize user-provided cross-origin redirects preventing arbitrary token dispatch. The `window.opener.postMessage` functions now explicitly demand validated target `origin` bounds instead of standard `*` wildcards, successfully fortifying the endpoint from message hijacking vectors while retaining fluid frontend interactions.

- **v8.7.22 (2026-06-16):** Sage Proxy Model Whitelist.
  - *Security:* Hardened the backend `/api/sage` AI proxy endpoint by enforcing a strict model whitelist (`gemini-2.5-flash`, `gemini-2.5-flash-lite`, `gemini-3-flash-preview`). Requests containing unapproved arbitrary model names are strictly sanitized and securely overridden to the default base model, preventing any payload manipulation exploits.

- **v8.7.21 (2026-06-16):** VAPID Endpoints 503 Guard.
  - *Security:* Explicitly hardened Web Push functionality by asserting `isVapidConfigured` flags across `server.ts` and `api/push.ts`. Active scheduler tick loops (`processPushQueue`) and operational endpoints (`/vapid-public-key`, `/subscribe`, `/schedule`, `/check`) now comprehensively short-circuit with `503 Service Unavailable` if server keys are absent, neutralizing silent crashes and fully decoupling from any fallback references.

- **v8.7.20 (2026-06-16):** Sage Proxy API Security Hardening.
  - *Security:* Hardened the backend `/api/sage` AI proxy endpoint against potential abuse. Explicitly enforced strict POST-only methods, added 32KB payload character limits, restricted the conversation context array size, and scrubbed upstream stack traces and detailed error messages from client-facing responses to prevent fingerprinting or internal service leakage.

- **v8.7.19 (2026-06-16):** Safe Export Data Scrubbing.
  - *Security:* Hardened the "Safe Export" process by implementing a recursive object scrubber. It automatically identifies and eliminates all variations of API keys, authentication tokens, and secrets (e.g. `sageApiKey`, `accessToken`, `password`) from the local state JSON tree before generation, ensuring zero credentials leak through file sharing.

- **v8.7.18 (2026-06-16):** Gemini API Key Security Hardening.
  - *Security:* Prevented `GEMINI_API_KEY` from being injected into the client-side frontend bundle through `vite.config.ts`. Extracted default AI proxy logic into a secure backend endpoint (`/api/sage`) preventing key exposure, while safely preserving user-provided API token functionality directly.

- **v8.7.16 (2026-06-09):** Explore View Height Constraint Lock.
  - *UI/UX:* Enforced strict absolute height bounds inside the Explore View matrix across desktop and tablet screen sizes subtracting exactly the PageHeader and top navigation menu pixel dimensions explicitly. The countdown timer and control interface now correctly respect container bounds, shrinking dynamically and sealing into the available viewport height cleanly without generating a page scroll.

- **v8.7.15 (2026-06-09):** Timer Zero-State Override Bug Fix.
  - *Bug Fix:* Repaired a severe state race-condition where manually skipping the timer via long-press would strand the display at `0:00` instead of naturally progressing into Rest cycles, next loop phases, or resetting the clock cleanly. By detaching skip operations from simulated end times and routing directly into finalization scopes, execution now consistently transitions phases instantly and identically to organic countdowns.

- **v8.7.14 (2026-06-09):** Loot Pool Real-Time Probability & Frequency Bug Fixes.
  - *Feature:* Added Real-Time Loot Pool Probability tracker directly inside the reward settings. Users can now view precisely computed drop weights adjusted for their current daily frequency limits.
  - *Bug Fix:* Repaired array length caching logic inside the internal reward card generator causing "Extra Chance" (C1/C2) draws to terminate loop limits early resulting in fewer selectable cards.
  - *Architecture:* Synchronized the "Pending Occurrences" filter logic accurately releasing limits from specific active chests currently queued for a reroll block.

- **v8.7.13 (2026-06-09):** Timer Skip Behaviors & Cloud Sync Overwrite Race Condition Fix.
  - *Feature:* Enabled single-click skips on the Timer allowing an instant completed-session jump strictly granting full rewards and durations natively.
  - *UI/UX:* Hardened long-press logic correctly triggering phase transitions natively using strictly modified endTimes matching worker logic securely without batching conflicts.
  - *Bug Fix:* Repaired a severe cloud race condition inside `server.ts`. The main node server now aggressively detects `savedByDeviceCode` discrepancies, explicitly blocking forceful direct local uploads and triggering 409 Merge Conflict pipelines gracefully even if local timestamp dates are technically newer than the cloud version.

- **v8.7.12 (2026-06-08):** Sidebar Global Pulse & Background Notification.
  - *Feature:* Integrated an active polling watcher on Fellowship parameters. The main Sanctum navigation icon will now pulse with a red notification dot immediately upon detecting new Guild messages or pending applicants.
  - *Feature:* Bound the active timer state into the overarching navigation layout, automatically activating a persistent red indicator on the Explore tab whenever an active focus session is running.

- **v8.7.11 (2026-06-07):** Cloud Synchronization Logic & Integrity Repairs.
  - *Bug Fix:* Repaired a forceful overwrite condition inside standard task completions and manual sync triggers modifying `syncToCloud` parameters, guaranteeing device-id comparisons properly open the Conflict Screen before blindly uploading.

- **v8.7.10 (2026-06-07):** Fellowship Modals & UUID Continuity Fixes.
  - *Bug Fix:* Repaired broken UUID generation strategies inside Fellowship tools utilizing resilient cross-origin Math.random fallbacks, restoring functionality for joining, updating, and saving team data on insecure or restricted iframes natively.
  - *UI/UX:* Restored and anchored the missing global Confirm Dialog portals directly into the overarching Fellowship components, ensuring critical confirmations and alerts systematically render across all interactions cleanly.

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
  - *Feature:* Added synchronous locked state walls that actively block automatic Redis polling (`checkCloudSync`), manual Push Notification syncing, scheduling tests in Developer Mode, and WebDAV proxy triggers directly on the client side unless the global Invite Code (old front-end testing password) has been verified. 
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
