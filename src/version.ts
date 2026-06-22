export const APP_VERSION = 'v8.10.63';
export const LAST_UPDATE_DATE = '2026-06-22';
export const LAST_UPDATE_TIME = '07:42:00';

export interface ReleaseLog {
  version: string;
  date: string;
  time: string;
  title: string;
  items: { category: string; description: string }[];
}

export const RELEASE_HISTORY: ReleaseLog[] = [
  {
    version: 'v8.10.63',
    date: '2026-06-22',
    time: '07:42:00',
    title: 'Guide Book Close Button Dynamic Alignment',
    items: [
      { category: 'UI/UX', description: 'Moved the Close (X) button relative to the book pages container to automatically follow folding translations.' },
      { category: 'UI/UX', description: 'Engineered custom responsive alignment rules, positioning the button precisely over the top-right margins of Front Cover, standard spreads, and left-aligned Back Cover pages without horizontal drift.' }
    ]
  },
  {
    version: 'v8.10.62',
    date: '2026-06-22',
    time: '07:38:00',
    title: 'Guide Book Theme Contrast Optimization',
    items: [
      { category: 'UI/UX', description: 'Replaced hardcoded amber and emerald CSS color classes across the Guide Book with custom, theme-aware variables, completely resolving the poor readability issue in the Forest (green) theme.' },
      { category: 'UI/UX', description: 'Enhanced button styling on info cards with fluid hover states, correct decoration lines, and custom color mappings that beautifully invert on both Light and Dark dynamic systems.' }
    ]
  },
  {
    version: 'v8.10.61',
    date: '2026-06-22',
    time: '07:30:00',
    title: 'Guide Book Visual & Route Optimization',
    items: [
      { category: 'UI/UX', description: 'Repaired critical word-wrapping and layout misalignment issues across all Guide Book instructional pages by explicitly bounding icon indicators and descriptive text elements under protected flex-item containers.' },
      { category: 'Feature', description: 'Updated outdated settings routing references specifically under "PRO TIP" sections, properly redirecting players to the new "Timer" configuration panel instead of the legacy "Developer" suite.' }
    ]
  },
  {
    version: 'v8.10.60',
    date: '2026-06-21',
    time: '20:20:00',
    title: 'Mobile Export Layout Scrolling and Code Compile Fixes',
    items: [
      { category: 'Mobile UI', description: 'Re-engineered the Controls container layout inside the Export Image modal. Converted rigid shrink-0 margins into a flex-1 shrink-0 scrollable pane on mobile viewports, permitting seamless access and scrolling to all hidden knobs, aspect ratio toggles, and Save buttons.' },
      { category: 'Architecture', description: 'Cleaned up legacy compilation inconsistencies. Properly imported centralized helper functions and resolved type mismatch anomalies across system dialogue handlers.' }
    ]
  },
  {
    version: 'v8.10.59',
    date: '2026-06-21',
    time: '20:15:00',
    title: 'Export Image Rendering Fidelity Optimization',
    items: [
      { category: 'Rendering', description: 'Re-programmed the html-to-image engine export parameters, eliminating `skipFonts` constraints to guarantee pixel-perfect WYSIWYG text rendering that correctly respects flex layout geometries and prevents italic banner text truncations (`RECO...`).' },
      { category: 'UI/UX', description: 'Injected a uniform, high-fidelity 32px safe-zone padding directly into the final exported snapshot canvas matrix, yielding a beautiful, frame-ready aesthetic that entirely eliminates cramped edge-collisions on both statistics and diary image exports.' }
    ]
  },
  {
    version: 'v8.10.58',
    date: '2026-06-21',
    time: '20:10:00',
    title: 'Export Image Mobile Feature Optimization',
    items: [
      { category: 'Feature', description: 'Re-programmed the image generation engine to strictly enforce a realistic 800px minimum viewport width constraint under mobile environments. Resolves text truncation and right-side layout cropping issues across exported statistics.' },
      { category: 'UI/UX', description: 'Re-structured the Export Image modal layout separating a dedicated persistent mobile header to instantly expose exit controls overriding the default stacked flex order. Guarantees top-down logical clarity without forcing users to scroll past the preview to read the title.' }
    ]
  },
  {
    version: 'v8.10.57',
    date: '2026-06-21',
    time: '19:45:00',
    title: 'Gacha Mobile Header Layout Optimization',
    items: [
      { category: 'UI/UX', description: 'Re-programmed the Skip Animation button layout inside the Gacha result modal. Center-aligns the button under the subtitle on space-constrained mobile viewports, resolving text overlapping/collision issues on narrow screens while keeping its top-right absolute alignment on desktop displays.' }
    ]
  },
  {
    version: 'v8.10.56',
    date: '2026-06-21',
    time: '19:40:00',
    title: 'Gacha Mobile Display Optimization',
    items: [
      { category: 'UI/UX', description: 'Re-engineered the mobile Gacha roll view: expanded focus cards for single draws to grant an immersive premium feel, added shrink preservation to the claim icon, and corrected a legacy high-contrast box shadow rendering bug causing off-axis rendering artifacts.' }
    ]
  },
  {
    version: 'v8.10.55',
    date: '2026-06-21',
    time: '19:30:00',
    title: 'Quest Board and Achievements Mobile Optimization',
    items: [
      { category: 'UI/UX', description: 'Optimized Quest Board and Achievements views for mobile screens by implementing responsive card padding, wrapping titles onto multiple lines or stacking badges below them to prevent title truncation, resizing icons dynamically, adding shrink preservation, and enabling numeric progress indicators on smaller displays.' }
    ]
  },
  {
    version: 'v8.10.54',
    date: '2026-06-21',
    time: '19:20:00',
    title: 'Guide Book Mobile Ratio Reversion',
    items: [
      { category: 'UI/UX', description: 'Reverted the layout size ratio of the mobile Guide Book modal screen back to its previous dynamic proportional sizing settings, restoring visual parity.' }
    ]
  },
  {
    version: 'v8.10.53',
    date: '2026-06-21',
    time: '11:55:00',
    title: 'Guide Book Mobile Sizing and Bookmark Icon Optimization',
    items: [
      { category: 'UI/UX', description: 'On mobile viewports, adjusted the Guide Book aspect ratio to a native 3:4 portrait style using CSS aspect-ratio properties, entirely resolving tall page stretching. Enlarged first-class bookmark chapters and their corresponding icons to a generous touch-friendly footprint for easy smartphone navigation.' }
    ]
  },
  {
    version: 'v8.10.52',
    date: '2026-06-21',
    time: '11:45:00',
    title: 'Guide Book Mobile Layout and Close Button Optimization',
    items: [
      { category: 'UI/UX', description: 'Re-programmed the Guide Book modal layout and padding parameters on mobile viewports to provide a dedicated right-hand gutter, perfectly displaying vertical chapter tags without squishing or clipping. Relocated the Close (X) button to sit directly on the top-right margins of the book relative container on mobile screens, avoiding floating viewport overlaps.' }
    ]
  },
  {
    version: 'v8.10.51',
    date: '2026-06-21',
    time: '10:55:00',
    title: 'Reward Pool Mobile Header Optimization',
    items: [
      { category: 'UI/UX', description: 'Re-designed the Reward Pool Management header with responsive space-preserving layout, converting long inline flex elements into multi-line configurations that elegantly wrap and stack on small mobile screens without text or button truncation.' }
    ]
  },
  {
    version: 'v8.10.50',
    date: '2026-06-21',
    time: '10:45:00',
    title: 'Mobile Settings Toggle Switch Layout Fix',
    items: [
      { category: 'UI/UX', description: 'Unified all settings toggle components globally with strict flex boundaries preventing the interactive button capsule from structurally collapsing and rendering switch elements out of bounds on extremely narrow viewports.' }
    ]
  },
  {
    version: 'v8.10.49',
    date: '2026-06-21',
    time: '10:35:00',
    title: 'Dungeon Expedition Mobile Overlap Fix',
    items: [
      { category: 'UI/UX', description: 'Re-engineered the Dungeon Expedition task container layout from strict inline rows to a flexible wrapping and stacking architecture. This eliminates overlapping glitches between deadline tags, routine badges, and reward elements on narrow mobile viewports.' }
    ]
  },
  {
    version: 'v8.10.48',
    date: '2026-06-21',
    time: '10:16:00',
    title: 'Dashboard DDL Horizon Theme Refinement',
    items: [
      { category: 'UI/UX', description: 'Re-engineered Expedition Horizon DDL active day cards replacing aggressive dark purple fills with a cohesive, translucent bg-indigo-500/10 tint mapping seamlessly to both Dark and native Light (slate-100 inverted) dimensions.' }
    ]
  },
  {
    version: 'v8.10.47',
    date: '2026-06-21',
    time: '09:54:00',
    title: 'Global Time Calculation Unification',
    items: [
      { category: 'Architecture', description: 'Centralized all time-duration calculations globally utilizing the strict getSessionEffectiveMinutes function across all modules (Heatmaps, Export, Recent Sessions, Modals, Daily Overviews).' },
      { category: 'Bug Fix', description: 'Eliminated disparate "focus vs raw duration" edge cases securing absolute identical data parity across all analytics, successfully respecting includeRestTimeInTasks state configurations consistently.' }
    ]
  },
  {
    version: 'v8.10.46',
    date: '2026-06-21',
    time: '09:16:00',
    title: 'Weekly Pie Chart Statistical Consistency',
    items: [
      { category: 'Architecture', description: 'Synchronized data inputs for the Weekly Pie Chart (Donut) avoiding timezone overlaps, strictly inheriting processed assignedDate arrays from the Weekly Bar unified stats engine.' },
      { category: 'Bug Fix', description: 'Corrected 6-day off-by-one interval bounds in Donut Chart ensuring Sunday sessions are fully tracked and mapped gracefully under precise custom-assigned time slots.' }
    ]
  },
  {
    version: 'v8.10.45',
    date: '2026-06-21',
    time: '09:14:00',
    title: 'Push Notification Error Log Optomization',
    items: [
      { category: 'Architecture', description: 'Silenced terminal output for expected 401/410 push notification expiration endpoints, keeping the backend stdout clean while silently removing stale offline devices.' }
    ]
  },
  {
    version: 'v8.10.44',
    date: '2026-06-21',
    time: '08:14:00',
    title: 'Data Consistency on Session Editing',
    items: [
      { category: 'Architecture', description: 'Re-programmed `updateSession` to fully recalculate derived game state (active XP, level down rollbacks, coins, custom daily streaks, and dungeon totalFocusTime) when users modify historical time periods or switch active objective categorizations.' },
      { category: 'Feature', description: 'Prevented automatic reward re-issuance on edited completions to avoid reward loop token mining out of trivial historic modifications.' }
    ]
  },
  {
    version: 'v8.10.43',
    date: '2026-06-21',
    time: '08:08:00',
    title: 'Data Consistency on Session Deletion',
    items: [
      { category: 'Architecture', description: 'Re-programmed `deleteSession` and `bulkDeleteSessions` to fully reverse derived game state (active XP, level down rollbacks, coins, custom daily streaks, and dungeon totalFocusTime) preventing desynchronization exploits when removing manually generated past records.' },
      { category: 'Feature', description: 'Integrated deep automatic reward reversals, stripping items, coins, and talent points initially rewarded if deleting history causes a completed objective dungeon to drop back into active status.' }
    ]
  },
  {
    version: 'v8.10.42',
    date: '2026-06-21',
    time: '08:04:00',
    title: 'Mobile Modal Scrolling Alignment',
    items: [
      { category: 'UI/UX', description: 'Re-programmed Bulk Manage Sessions modal constraints by strictly enforcing dynamic view height cutoffs (`max-h-[calc(100dvh-2rem)]`) combined with smooth inner vertical scrolling, fully adapting the container to narrow mobile dimensions without layout lock.' },
    ]
  },
  {
    version: 'v8.10.41',
    date: '2026-06-21',
    time: '08:00:00',
    title: 'Bulk Logic Refinements',
    items: [
      { category: 'Architecture', description: 'Re-programmed bulkCreateSessions to adhere to Plan A: Bulk added sessions now act purely as historical tracking points and do not independently generate game rewards.' },
      { category: 'Architecture', description: 'Re-programmed bulkDeleteSessions to intelligently subtract derived XP, coins, and objectives correctly when deleting organically rewarded authentic sessions.' }
    ]
  },
  {
    version: 'v8.10.40',
    date: '2026-06-20',
    time: '18:25:00',
    title: 'Snapshot Comparison Engine',
    items: [
      { category: 'Feature', description: 'Upgraded the local backup restore payload to display a side-by-side data comparison between the current memory and the selected snapshot before overwriting.' },
      { category: 'UI/UX', description: 'Renamed "LOCAL MEMORY SNAPSHOTS" strictly to "SNAPSHOTS" for a minimalist, cleaner settings interface.' }
    ]
  },
  {
    version: 'v8.10.39',
    date: '2026-06-21',
    time: '00:51:00',
    title: 'Local Memory Snapshots (Max 10)',
    items: [
      { category: 'Feature', description: 'Implemented a new Local Memory Snapshots engine in the Cloud Archives settings, supporting up to 10 native historical backups directly via localStorage.' },
      { category: 'UI/UX', description: 'Framed the Local Snapshot management list with emerald accents, aligned with overarching modal aesthetics for precise restoration and deletion operations.' }
    ]
  },
  {
    version: 'v8.10.38',
    date: '2026-06-21',
    time: '00:30:00',
    title: 'Cloud Save History Serverless Endpoint Fix',
    items: [
      { category: 'Bug Fix', description: 'Re-programmed /api/sync serverless function to correctly support path-based routing for history lookups and backup generation.' },
      { category: 'Architecture', description: 'Ported Redis backup list truncation and storage quota constraints to the serverless sync.ts handler ensuring database parity across environments.' }
    ]
  },
  {
    version: 'v8.10.37',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Explore Current Build Collapse Fix',
    items: [
      { category: 'Bug Fix', description: 'Resolved critical layout collapse of the Current Build card on narrow-height widescreen environments.' },
      { category: 'UI/UX', description: 'Replaced flex-1 style on the Current Build card with shrink-0, preserving proportional heights and borders across all viewport sizes.' }
    ]
  },
  {
    version: 'v8.10.36',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Explore Viewport Strict Height Enforcements',
    items: [
      { category: 'Architecture', description: 'Removed overflow-hidden constraints allowing normal page scrollability for historical panels gracefully.' },
      { category: 'UI/UX', description: 'Upgraded CSS Grid parameters replacing stretch intrinsic heights with exact viewport offset coordinates (calc). Enforced the Timer module stays perfectly within the fold bounding limits regardless of active tall secondary content.' }
    ]
  },
  {
    version: 'v8.10.35',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Explore Viewport Timer Visibility Restoration',
    items: [
      { category: 'Bug Fix', description: 'Resolved critical disappearance of the active timer and focus controls on widescreen environments.' },
      { category: 'UI/UX', description: 'Re-programmed structural height inheritance inside the flex-grid hybrid layout, securing perfect visibility of all timer buttons without expanding beyond viewport vertical boundaries.' }
    ]
  },
  {
    version: 'v8.10.34',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Explore Viewport Vertical Constraints Optimization II',
    items: [
      { category: 'UI/UX', description: 'Re-programmed the Explore dashboard structural viewport grid calculations from fixed screen heights to dynamic offsets.' },
      { category: 'UI/UX', description: 'Eliminated vertical scrolling on wide landscape screens, natively bounding the timer module perfectly within a single view without clipping buttons or leaving empty whitespace.' }
    ]
  },
  {
    version: 'v8.10.33',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Explore Viewport Vertical Constraints Optimization',
    items: [
      { category: 'UI/UX', description: 'Re-programmed the Explore dashboard structural viewport grid calculations from fixed screen heights to dynamic offsets.' },
      { category: 'UI/UX', description: 'Eliminated vertical scrolling on wide landscape screens, natively bounding the timer module perfectly within a single view without clipping buttons.' }
    ]
  },
  {
    version: 'v8.10.32',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Cloud History Memory Restoration Fix',
    items: [
      { category: 'Bug Fix', description: 'Resolved critical restoration error in Cloud History where pulling backups failed to restore active dungeon and quest data correctly due to internal storage key mismatches.' }
    ]
  },
  {
    version: 'v8.10.31',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Global Page Padding & Layout Standardization',
    items: [
      { category: 'UI/UX', description: 'Standardized layout constraints across all major dashboard views (Expedition, Explore, Talent Tree, Merchant\'s Outpost, Reward Vault, Record) to ensure identical inner padding scaling, unified banner spacing, and symmetrical screen gutters across device viewports.' }
    ]
  },
  {
    version: 'v8.10.30',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Italic Clipping Prevention and Spacer Safety',
    items: [
      { category: 'Bug Fix', description: 'Resolved page header title right-side truncation on the Expedition tab and Agenda views caused by italic text styling.' },
      { category: 'UI/UX', description: 'Added proper trailing safety padding and fluid spacers ensuring dynamic headings preserve geometric rendering bounds across various devices.' }
    ]
  },
  {
    version: 'v8.10.29',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Expedition Horizon Active Day Contrast Enhancement',
    items: [
      { category: 'UI/UX', description: 'Re-engineered the Today active cell on Expedition Horizon using a vibrant, theme-aware background to eliminate any dark, muddy default appearance.' },
      { category: 'UI/UX', description: 'Upgraded typography contrast dynamically, applying soft white text with a prominent light drop shadow on dark themes and a clean dark indigo layout on light themes.' }
    ]
  },
  {
    version: 'v8.10.28',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Expedition Blueprint Mobile Optimization',
    items: [
      { category: 'UI/UX', description: 'Optimized spacing, truncation and alignments for the Expedition Blueprint component on compact mobile viewports.' },
      { category: 'Feature', description: 'Added Fullscreen preview mode for Expedition Blueprint plans for improved reading and editing fidelity.' }
    ]
  },
  {
    version: 'v8.10.26',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Sage Bubble Theme Adaptability',
    items: [
      { category: 'Bug Fix', description: 'Repaired critical legibility issue where Sage\'s chat bubbles rendered with white inverted prose text against Light background themes.' },
      { category: 'UI/UX', description: 'Re-engineered React Markdown components using a custom `.prose-sage` typography class mapped 1:1 with native CSS theme variables.' },
      { category: 'UI/UX', description: 'Restored generous horizontal padding in Sage\'s bubbles by removing restrictive mobile italic-clipping bounds.' }
    ]
  },
  {
    version: 'v8.10.25',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Sage\'s Council Native Theme Inversion Optimization',
    items: [
      { category: 'Architecture', description: 'Removed hardcoded explicit light mode conditional branch blocks (`isDarkTheme ? A : B`) throughout Sage\'s Council layout containers.' },
      { category: 'UI/UX', description: 'Unified structural colors to standard foundational Dark Semantic Tokens (e.g. `bg-slate-900`) to perfectly align with Sanctum Plaza architectures, unlocking the app\'s native CSS inversion engine for Light themes.' }
    ]
  },
  {
    version: 'v8.10.24',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Consultations Sanctum Color Customization',
    items: [
      { category: 'UI/UX', description: 'Re-engineered the Consultations layout color schema in the Dashboard and Settings to perfectly match the sleek "Sanctum Plaza" aesthetic.' },
      { category: 'UI/UX', description: 'Replaced rigid dark indigo backgrounds, borders, and hardcoded texts with polished, theme-aware neutral slate pallets accented with intentional active indicators.' }
    ]
  },
  {
    version: 'v8.10.23',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Consultations Mobile Popup Drawer Layout',
    items: [
      { category: 'UI/UX', description: 'Re-designed Consultations sidebar into an absolute overlay drawer with backdrop strictly on mobile screens, replicating modern AI chat interface spatial behaviors.' },
      { category: 'UI/UX', description: 'Integrated dynamic auto-closing bounds ensuring the Consultations drawer immediately conceals itself upon topic selection saving physical viewport area on constrained devices.' }
    ]
  },
  {
    version: 'v8.10.22',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Expedition Horizon Mobile Header Optimization',
    items: [
      { category: 'UI/UX', description: 'Optimized Expedition Horizon header spacing and padding on mobile screens to prevent text overflow and layout wrapping.' },
      { category: 'UI/UX', description: 'Shortened dynamic title label on narrow displays to custom Horizon form, while preserving the full Expedition Horizon title on standard sizes.' }
    ]
  },
  {
    version: 'v8.10.21',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Study Heatmap Year Summary Layout Refinement',
    items: [
      { category: 'UI/UX', description: 'Displayed the "Year Summary" card fixedly below the large year heatmap calendar, avoiding side-by-side columns and centering it perfectly.' },
      { category: 'UI/UX', description: 'Re-organized the internal sub-cards of the Year Summary into a neat, balanced 2-column/2x2 grid on standard displays for optimal spacing and density.' }
    ]
  },
  {
    version: 'v8.10.20',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Study Heatmap Year Summary',
    items: [
      { category: 'Feature', description: 'Enabled the same detailed summary module (Total/Avg metrics) seamlessly inside the Year View of the Heatmap.' }
    ]
  },
  {
    version: 'v8.10.19',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Study Heatmap Layout Center Alignment',
    items: [
      { category: 'UI/UX', description: 'Centering both the heatmap calendar cards and summary nodes horizontally inside standard container viewports.' }
    ]
  },
  {
    version: 'v8.10.18',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Study Heatmap Cards Centered Layout',
    items: [
      { category: 'UI/UX', description: 'Re-aligned Study Time, Gold Earnings, and EXP Earnings statistics total and average metrics to be beautifully grouped inside the card center, avoiding separation to extreme left and right margins on wide viewports.' }
    ]
  },
  {
    version: 'v8.10.17',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Study Heatmap Cards Realignment',
    items: [
      { category: 'UI/UX', description: 'Consolidated Total Time and Daily Average Time stats into a single unified Study Time metric card.' },
      { category: 'UI/UX', description: 'Standardized and adjusted text labels and icon sizes for Gold Earnings and EXP Earnings cards to align exactly with Focused Days card.' },
      { category: 'Typography', description: 'Optimized typography for the 30 Days Summary header, scaling it down to a more precise, elegant text size.' }
    ]
  },
  {
    version: 'v8.10.16',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Study Heatmap Summary Cards Consolidation',
    items: [
      { category: 'UI/UX', description: 'Consolidated Gold Total and Avg cards into a single elegant metrics card. Consolidated EXP Total and Avg cards into a single card.' },
      { category: 'UI/UX', description: 'Replaced XP badge icons with matching Zap icons from daily metrics.' },
      { category: 'Typography', description: 'Optimized typography hierarchy by scaling up the main 30 Days Summary header to the largest prominent size in the panel.' }
    ]
  },
  {
    version: 'v8.10.15',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Study Heatmap Rich Summary UI',
    items: [
      { category: 'Feature', description: 'Enriched the 30 Days/Month/Year timeframe summary by showing total accumulated Time, percentages, and cleanly aligned metrics across the board.' },
      { category: 'UI/UX', description: 'Redesigned the heatmap summary card utilizing modern Lucide icon pairings, intelligent mobile-responsive grid spanning, and replacing legacy plain-text emojis.' }
    ]
  }
];
