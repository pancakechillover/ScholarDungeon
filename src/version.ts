export const APP_VERSION = 'v5.2.3';
export const LAST_UPDATE_DATE = '2026-05-10';
export const LAST_UPDATE_TIME = '22:30:00';

export interface ReleaseLog {
  version: string;
  date: string;
  time: string;
  title: string;
  items: { category: string; description: string }[];
}

export const RELEASE_HISTORY: ReleaseLog[] = [
  {
    version: 'v5.2.3',
    date: '2026-05-10',
    time: '22:30:00',
    title: 'WebDAV Full Implementation',
    items: [
      { category: 'Architecture', description: 'Standardized synchronization checks, redirecting App startup to use a new `checkCloudSync` routing which intelligently directs to Google Drive, WebDAV, or Redis logic interchangeably.' },
      { category: 'Feature', description: 'Fully integrated WebDAV support as a new primary Sync Provider with a local API proxy addressing CORS restrictions gracefully.' },
      { category: 'UI', description: 'Unlocked the WebDAV options panel in Cloud Sync settings allowing custom server URL (e.g. Nextcloud, Jianguoyun), Usernames, and Application Passwords.' }
    ]
  },
  {
    version: 'v5.2.2',
    date: '2026-05-10',
    time: '22:15:00',
    title: 'Google Drive Developer Access Lock',
    items: [
      { category: 'Architecture', description: 'Added a Developer Password Lock to the Google Drive synchronization feature to prevent unauthorized access while the OAuth App is pending Google Verification.' },
      { category: 'UI', description: 'Updated the Cloud Sync settings interface to dynamically show the lock icon on Google Drive integrations.' },
      { category: 'UX', description: 'Restructured the developer unlock modal to adapt its description text dynamically based on the syncing method being chosen.' }
    ]
  },
  {
    version: 'v5.2.1',
    date: '2026-05-10',
    time: '21:45:00',
    title: 'Quest Board UI Style Sync',
    items: [
      { category: 'UI', description: 'Synchronized all theme-specific `--qb-*` CSS variables with finalized debugger values.' },
      { category: 'UX', description: 'Improved visual contrast for Quest cards and progress bars across all themes.' }
    ]
  },
  {
    version: 'v5.2.0',
    date: '2026-05-10',
    time: '21:30:00',
    title: 'Sync History Metadata',
    items: [
      { category: 'Feature', description: 'Implemented detailed metadata tracking for synchronization history (Method and Provider).' },
      { category: 'Architecture', description: 'Enhanced syncHistory interface and useCloudSync hook to capture and persist sync event metadata.' },
      { category: 'UI', description: 'Updated Cloud Sync Modal and Cloud Settings Section to display detailed sync history logs.' },
      { category: 'Bugfix', description: 'Fixed theme-awareness for secondary text elements in Cloud Settings.' }
    ]
  },
  {
    version: 'v5.1.3',
    date: '2026-05-10',
    time: '20:10:00',
    title: 'Theme-Aware Color Expansion',
    items: [
      { category: 'Architecture', description: 'Added `indigo-300` to the theme-aware color system, allowing all `text-indigo-300` usages to adapt to the active theme.' },
      { category: 'Documentation', description: 'Updated AGENTS.md guidelines for theme-aware colors.' }
    ]
  },
  {
    version: 'v5.1.2',
    date: '2026-05-10',
    time: '20:00:00',
    title: 'Quest Board UI Customization Expansion',
    items: [
      { category: 'UI', description: 'Added outer white border (outline) to the Quest Board container, configurable via CSS variables.' },
      { category: 'Feature', description: 'Expanded Quest Board CSS Debugger with controls for checkbox colors and progress bar text color.' },
      { category: 'Architecture', description: 'Decoupled hardcoded checkbox and progress text colors in QuestManager to use themeable CSS variables.' }
    ]
  },
  {
    version: 'v5.1.1',
    date: '2026-05-10',
    time: '19:20:00',
    title: 'Data Reliability & App Visibility Hooks',
    items: [
      { category: 'Architecture', description: 'Implemented the Visibility API & beforeUnload listeners to forcefully push unsynced changes if the application is closed or loses focus.' },
      { category: 'UI', description: 'Added sync operations history and state under the Cloud tab.' }
    ]
  },
  {
    version: 'v5.1.0',
    date: '2026-05-10',
    time: '18:45:00',
    title: 'Auto-Sync Configuration & Cloud Access',
    items: [
      { category: 'Feature', description: 'Added the ability to choose how data automatically syncs to the backend (Debounce, Interval, or Manual).' },
      { category: 'Feature', description: 'Implemented a Developer Code lock on the Astral Archives due to current Redis storage limitations.' },
      { category: 'UX', description: 'Added fine-grained sliders to customize wait duration for Debounce or Polling limits.' }
    ]
  },
  {
    version: 'v5.0.0',
    date: '2026-05-10',
    time: '18:15:00',
    title: 'Cloud Synchronization Overhaul',
    items: [
      { category: 'Architecture', description: 'Added a dedicated Cloud module in System Settings for managing saving and synchronization preferences.' },
      { category: 'UI', description: 'Moved the Astral Archives from Account Status into the Cloud module to prepare for multi-provider support.' },
      { category: 'Feature', description: 'Added placeholder interfaces for future Google Drive and WebDAV backup solutions.' }
    ]
  },
  {
    version: 'v4.10.20',
    date: '2026-05-10',
    time: '17:30:00',
    title: 'Global Victory Screen',
    items: [
      { category: 'UX', description: 'Implemented global timer monitoring so the Victory! screen automatically forces full-screen and redirects to the Explore tab upon completion, regardless of where the user is browsing or if the tab is in the background.' }
    ]
  },
  {
    version: 'v4.10.19',
    date: '2026-05-10',
    time: '17:20:00',
    title: 'Quest Board UI Polish',
    items: [
      { category: 'UI', description: 'Removed the background styling and "TASK PROGRESS" text from the Quest Board progress bars for a cleaner look.' },
      { category: 'UX', description: 'Synchronized the UI changes to the CSS Debugger preview layout as well.' }
    ]
  },
  {
    version: 'v4.10.18',
    date: '2026-05-10',
    time: '17:15:00',
    title: 'Touch & Scroll Engine Overhaul',
    items: [
      { category: 'Architecture', description: 'Rebuilt root layout engine using a rigid Flexbox structure to completely eliminate iOS Safari scrolling bugs and rubber-banding on the sidebar.' },
      { category: 'Bugfix', description: 'Restored fluent mouse-wheel scrolling by properly enforcing overflow boundaries isolated entirely inside the main workspace.' }
    ]
  },
  {
    version: 'v4.10.17',
    date: '2026-05-10',
    time: '17:01:00',
    title: 'Guidebook Audio File Integration',
    items: [
      { category: 'Audio', description: 'Replaced synthesized page turn logic with the native page-flip.mp3 audio file.' }
    ]
  },
  {
    version: 'v4.10.16',
    date: '2026-05-10',
    time: '16:50:00',
    title: 'iOS Scroll & Touch Stability',
    items: [
      { category: 'Bugfix', description: 'Fixed an issue on iOS devices where scrolling the page would incorrectly move the nav sidebar or rubber-band the viewport.' },
      { category: 'Bugfix', description: 'Restored normal touch scrolling inside the Expedition menu by disabling framer-motion touch-action overrides outside of drag handles.' },
      { category: 'Architecture', description: 'Applied overscroll-contain to scrollable zones and decoupled fixed elements from height-restricted HTML blocks.' }
    ]
  },
  {
    version: 'v4.10.15',
    date: '2026-05-10',
    time: '16:45:00',
    title: 'Guidebook Audio Enhancements',
    items: [
      { category: 'Audio', description: 'Implemented a custom procedural soft "page turn" sound effect using the Web Audio API for the Adventure Guide.' },
      { category: 'UX', description: 'Linked page turn sound effects to swiping, clicking navigation arrows, and using table of contents bookmarks within the Guidebook.' }
    ]
  },
  {
    version: 'v4.10.14',
    date: '2026-05-10',
    time: '16:34:00',
    title: 'CSS Debugger Full Screen & Progress Polish',
    items: [
      { category: 'Architecture', description: 'Moved the CSS Debugger modal to React Portals, enforcing true full-screen overlay across all native UI modules and sidebars.' },
      { category: 'Feature', description: 'Added a Realistic Mode toggle to the CSS Debugger that previews exact procedural card rotations and absolute thumbtack decorations.' },
      { category: 'UI', description: 'Fully integrated progress bar fill and track colors into the Quest Board CSS dynamic overrides system via 3 new root variables.' }
    ]
  },
  {
    version: 'v4.10.13',
    date: '2026-05-10',
    time: '16:15:00',
    title: 'Quest Board CSS Export & Layout Polish',
    items: [
      { category: 'Feature', description: 'Added an Export CSS button to the CSS Debugger, generating minified CSS variables ready for production integration.' },
      { category: 'UI', description: 'Scaled down the preview mockup wrapper to 90%, ensuring it fits flawlessly inside vertically constrained laptops without needing a scrollbar.' },
      { category: 'UX', description: 'Rebuilt the mock representation of checkboxes and task progress elements in the debugger to perfectly match the flex behaviors used on the real Quest Board.' }
    ]
  },
  {
    version: 'v4.10.12',
    date: '2026-05-10',
    time: '16:08:00',
    title: 'Guidebook Swipe Interactions',
    items: [
      { category: 'UX', description: 'Added smooth touch swipe gestures to turn pages intuitively left or right within the Adventure Guide.' }
    ]
  },
  {
    version: 'v4.10.11',
    date: '2026-05-10',
    time: '16:04:00',
    title: 'CSS Debugger GUI Overlay',
    items: [
      { category: 'Feature', description: 'Transformed the CSS Debugger into a robust visual color picker dashboard with discrete inputs.' },
      { category: 'UI', description: 'Expanded layout space for the debugger modal to perfectly capture mockup and pickers at once.' },
      { category: 'UX', description: 'Improved mockup view to precisely showcase progress tracking boxes and checkout elements.' }
    ]
  },
  {
    version: 'v4.10.10',
    date: '2026-05-10',
    time: '15:52:00',
    title: 'Quest Board CSS Live Editor',
    items: [
      { category: 'Feature', description: 'Added an interactive live CSS editor to the Quest Board CSS Debugger modal for real-time styling of `--qb-*` variables.' },
      { category: 'UI', description: 'Decoupled hardcoded style constraints in Quests tab to ensure they natively respect the injected .qb-* classes.' },
      { category: 'Persistance', description: 'Custom CSS from the debugger is permanently stored locally and loads gracefully across app restarts.' }
    ]
  },
  {
    version: 'v4.10.9',
    date: '2026-05-10',
    time: '15:45:00',
    title: 'Expedition Undo Drag Operations',
    items: [
      { category: 'Feature', description: 'Implemented a dedicated Undo button to revert complex hierarchy drag-and-drop operations safely.' },
      { category: 'Architecture', description: 'Deeply integrated drag caching mechanisms into the unified store by precisely capturing the start of dragging actions.' }
    ]
  },
  {
    version: 'v4.10.8',
    date: '2026-05-10',
    time: '15:15:00',
    title: 'Quest Board Developer CSS Toolkit',
    items: [
      { category: 'Feature', description: 'Centralized Quest Board styling logic using CSS variables localized per theme.' },
      { category: 'UI', description: 'Implemented Quest Board CSS Debugger tool within Developer Settings.' },
      { category: 'Architecture', description: 'Fully decoupled standard `.qb-*` classes enabling rapid custom theme updates without cross-contamination.' }
    ]
  },
  {
    version: 'v4.10.7',
    date: '2026-05-10',
    time: '11:22:00',
    title: 'Expedition Drag & Drop Hierarchy Fix',
    items: [
      { category: 'Bugfix', description: 'Resolved a critical race condition where dragging a sub-dungeon across tiers caused items to disappear due to outdated local Reorder state.' },
      { category: 'Architecture', description: 'Refactored onReorder handling for MajorDungeons and Sub-Dungeons to exclusively filter and update based on verified state membership.' }
    ]
  },
  {
    version: 'v4.10.6',
    date: '2026-05-10',
    time: '11:15:00',
    title: 'Dungeon Tier Creation Title Fix',
    items: [
      { category: 'Bugfix', description: 'Fixed a logical error where creating a Tier 1 dungeon goal under an Expedition incorrectly displayed "CREATE TIER 2" as the title.' },
      { category: 'Architecture', description: 'Refined getSubDungeonDepth utility to correctly identify Major Dungeons as the root depth (Level 0).' }
    ]
  },
  {
    version: 'v4.10.5',
    date: '2026-05-10',
    time: '11:00:00',
    title: 'Custom PWA Icon Set Integration',
    items: [
      { category: 'Architecture', description: 'Updated Vite PWA configuration to support multi-size RealFaviconGenerator icon set including maskable and any purpose icons.' },
      { category: 'UI', description: 'Standardized favicon and apple-touch-icon links in index.html for cross-platform consistency (iOS/Android/Desktop).' },
      { category: 'UX', description: 'Added cache-busting versioning to manifest icons to ensure immediate updates on existing installations.' }
    ]
  },
  {
    version: 'v4.10.3',
    date: '2026-05-10',
    time: '10:30:00',
    title: 'Notification API Stability Fix',
    items: [
      { category: 'Bugfix', description: 'Fixed ReferenceError: "Can\'t find variable: Notification" by adding environment safety checks to all Notification API calls.' },
      { category: 'Architecture', description: 'Implemented non-blocking safeguards in Timer, General Settings, and Developer Settings for better cross-browser compatibility.' },
      { category: 'Fix', description: 'Resolved a missing destructuring bug for claimAllQuestRewards in the main application entry point.' }
    ]
  },
  {
    version: 'v4.10.2',
    date: '2026-05-10',
    time: '10:20:00',
    title: 'Bulk Reward Claiming & Unified Summary',
    items: [
      { category: 'Feature', description: 'Implemented a "Claim All" system for quests and achievements, allowing one-click collection of all pending rewards.' },
      { category: 'UI', description: 'Added a dedicated Bulk Claim Modal that displays a comprehensive summary of all items completed and total treasure harvested.' },
      { category: 'UX', description: 'Synchronized bulk claiming with reward history and real-time state updates for seamless progression.' }
    ]
  },
  {
    version: 'v4.10.1',
    date: '2026-05-10',
    time: '10:10:00',
    title: 'Quest History Temporal Filtering',
    items: [
      { category: 'Feature', description: 'Added time-based filtering to Quest History (Today, Last 7 Days, All Time).' },
      { category: 'UI', description: 'Implemented filter tabs in the History view for improved navigation of past deeds.' },
      { category: 'UX', description: 'Optimized empty states to provide context based on active time filters.' }
    ]
  },
  {
    version: 'v4.10.0',
    date: '2026-05-10',
    time: '10:00:00',
    title: 'Quest History & Chronicler Integration',
    items: [
      { category: 'Feature', description: 'Implemented a comprehensive Quest History system that archives all completed and claimed tasks/achievements.' },
      { category: 'UI', description: 'Added a dedicated "History" tab to the Quest Board with high-contrast parchment items and timestamp tracking.' },
      { category: 'UX', description: 'Integrated automatic history recording for both manual reward claims and auto-claimed session rewards.' },
      { category: 'Aesthetic', description: 'Custom "Chronicler" icon and emerald theme accents for historical records.' }
    ]
  },
  {
    version: 'v4.9.5',
    date: '2026-05-09',
    time: '16:50:00',
    title: 'Quest Board High-Contrast & Theme Alignment',
    items: [
      { category: 'UI', description: 'Removed experimental effects (noise, inner shadows, transparency) from Quest Board for a cleaner, high-contrast look.' },
      { category: 'UX', description: 'Improved readability with solid black text on light parchment and theme-consistent dark backgrounds for icons.' },
      { category: 'Aesthetic', description: 'Full architectural redesign of the board colors to better support Light and Dark theme transitions.' }
    ]
  },
  {
    version: 'v4.9.4',
    date: '2026-05-09',
    time: '16:45:00',
    title: 'Quest Board Theme & Readability Optimization',
    items: [
      { category: 'UI', description: 'Simplified Quest Board background to a theme-responsive flat color, removing heavy shadows and noise.' },
      { category: 'UX', description: 'Significantly improved quest item readability with high-contrast text colors and clean reward badges.' },
      { category: 'Aesthetic', description: 'Harmonized overall board styling with the active application theme.' }
    ]
  },
  {
    version: 'v4.9.3',
    date: '2026-05-09',
    time: '16:35:00',
    title: 'Quest Board Theme-Awareness & UI Refinement',
    items: [
      { category: 'Aesthetic', description: 'Synchronized Quest Board appearance with active themes by replacing hardcoded colors with variable-linked scales.' },
      { category: 'Bugfix', description: 'Fixed reward badge visibility issues by removing intrusive dark backgrounds and shadows in favor of a clean, high-contrast design.' }
    ]
  },
  {
    version: 'v4.9.2',
    date: '2026-05-09',
    time: '16:30:00',
    title: 'Quest Board Aesthetic & Updates Cycle',
    items: [
      { category: 'UI', description: 'Redesigned labels and cards in Quest Board to resemble a wooden board with pinned parchment notes.' },
      { category: 'Feature', description: 'Added explicit update cycle indicators (Daily, Weekly, Monthly) to each quest item.' },
      { category: 'Aesthetic', description: 'Implemented deterministic paper rotation and thumbtack decorations for a more authentic task board feel.' }
    ]
  },
  {
    version: 'v4.9.1',
    date: '2026-05-09',
    time: '16:20:00',
    title: 'Drag & Drop Stability & Race Condition Fix',
    items: [
      { category: 'Bugfix', description: 'Fixed edge case where items disappeared during cross-group movement due to event conflicts.' },
      { category: 'Architecture', description: 'Refactored moveDungeonItem to be functionally atomic.' },
      { category: 'UX', description: 'Disabled drag momentum and added layout constraints for mobile stability.' }
    ]
  },
  {
    version: 'v4.9.0',
    date: '2026-05-09',
    time: '16:15:00',
    title: 'Drag & Drop Stability & Mobile UX Fix',
    items: [
      { category: 'Bugfix', description: 'Fixed critical issue where dungeon items would disappear during rapid reordering or cross-level movement.' },
      { category: 'UX', description: 'Fixed mobile/tablet scrolling bug where dragging an item would trigger page-wide scrolling to the bottom.' },
      { category: 'Architecture', description: 'Hardened state synchronization in DungeonManager to handle reorder events and move events safely.' }
    ]
  },
  {
    version: 'v4.8.11',
    date: '2026-05-09',
    time: '16:05:00',
    title: 'Critical TypeError Hotfix',
    items: [
      { category: 'Bugfix', description: 'Fixed a TypeError in moveDungeonItem where it was incorrectly referencing dungeons and majorDungeons via the state object.' }
    ]
  },
  {
    version: 'v4.8.10',
    date: '2026-05-09',
    time: '15:55:00',
    title: 'Hierarchical Nesting & Race Conditions Fix',
    items: [
      { category: 'Bugfix', description: 'Solved a critical edge case where dragging a level 1 or 2 dungeon caused it to disappear due to race conditions during state flush in Reorder.Group.' },
      { category: 'Architecture', description: 'Eliminated nested functional state updates from useGameState which created asynchronous duplication bugs when promoting/demoting hierarchies.' },
      { category: 'UX', description: 'Automatically expands the container directory visually when hovering or dropping sub-dungeons to clearly indicate hierarchy.' }
    ]
  },
  {
    version: 'v4.8.9',
    date: '2026-05-09',
    time: '15:40:00',
    title: 'Drag & Drop Stability & Cycle Prevention',
    items: [
      { category: 'Bugfix', description: 'Fixed a critical issue where items would disappear due to circular hierarchy loops (dragging a parent into its own child).' },
      { category: 'Architecture', description: 'Enhanced state synchronization between MajorDungeons and Sub-Dungeons collectives to prevent duplicate IDs during cross-group movement.' },
      { category: 'Logic', description: 'Implemented a recursive ancestor check in moveDungeonItem to strictly maintain a healthy tree structure.' }
    ]
  },
  {
    version: 'v4.8.8',
    date: '2026-05-09',
    time: '15:15:00',
    title: 'Drag & Drop Stability Fix',
    items: [
      { category: 'Bugfix', description: 'Fixed a critical issue where items would disappear when dragged across different hierarchy levels or into other dungeons.' },
      { category: 'UX', description: 'Improved drop target detection by ignoring the item currently being dragged, preventing self-blocking hit tests.' },
      { category: 'Architecture', description: 'Migrated reorder state updates to non-destructive functional updates to preserve items during cross-group movement.' }
    ]
  },
  {
    version: 'v4.8.7',
    date: '2026-05-09',
    time: '15:10:00',
    title: 'Hierarchical Drag & Drop',
    items: [
      { category: 'Feature', description: 'Implemented full hierarchical reordering and nesting. Drag any level-1 dungeon onto another to make it a child (L2), or move sub-dungeons between parents.' },
      { category: 'UX', description: 'Added drop-target detection using viewport coordinates for intuitive "folder-style" nesting during edit mode.' },
      { category: 'Architecture', description: 'Enhanced state management to automatically handle promoting sub-dungeons to root MajorDungeons when dropped onto the Expedition container.' }
    ]
  },
  {
    version: 'v4.8.6',
    date: '2026-05-09',
    time: '14:40:00',
    title: 'Mobile Drag & Drop Polish',
    items: [
      { category: 'UX', description: 'Repositioned drag-and-drop handles for Expedition, Quests, and Achievements to perfectly align with mobile screens without overflowing the horizontal layout' },
      { category: 'UI', description: 'Ensured edit buttons precisely exist between progress bars and completion checkboxes without requiring hover states' },
      { category: 'UI', description: 'Widened progress numeric ratios across all Dungeons menus strictly preventing clipping when ratios like "100/100" are met' }
    ]
  },
  {
    version: 'v4.8.5',
    date: '2026-05-09',
    time: '14:26:00',
    title: 'Edit Layout & Progress Width Update',
    items: [
      { category: 'UI', description: 'Widened progress bar numeric ratio elements to comfortably fit 3-digit denominators ("100/100")' },
      { category: 'UX', description: 'Reordered Quest and Achievement panels in edit mode so action buttons appear between the progress bar and the completion box' }
    ]
  },
  {
    version: 'v4.8.4',
    date: '2026-05-09',
    time: '14:20:00',
    title: 'Quest Board & Achievement Polish',
    items: [
      { category: 'UI', description: 'Removed rigid spatial gap limitations between progress bar statistics and completion checkboxes on the Quests and Achievement tabs' },
      { category: 'UX', description: 'Fixed an issue where sequence reordering and edit action buttons required mouse hover to appear, maintaining consistent visibility for precise editing' }
    ]
  },
  {
    version: 'v4.8.3',
    date: '2026-05-09',
    time: '14:09:00',
    title: 'Dungeon Checkbox Spacing',
    items: [
      { category: 'UI', description: 'Removed rigid sizing from the Dungeon action container block to allow the Checkbox and progress bar text to sit organically close to each other without absurd gap filling' }
    ]
  },
  {
    version: 'v4.8.2',
    date: '2026-05-09',
    time: '12:43:00',
    title: 'Dungeon Tabs Layout Alignment',
    items: [
      { category: 'UI', description: 'Aligned progress bars, numerical counters, and rightmost action elements perfectly across the Dungeons, Quests, and Achievements tabs in the Dungeons menu' },
      { category: 'UX', description: 'Standardized width sizing using strict container anchoring' }
    ]
  },
  {
    version: 'v4.8.1',
    date: '2026-05-09',
    time: '12:28:00',
    title: 'Dungeon Progress Bar Visibility Fix',
    items: [
      { category: 'UI', description: 'Fixed an issue where the dungeon progress bar in the Dungeons menu was invisible (0px internal height) due to thin height allocations clashing with borders.' },
      { category: 'UX', description: 'Increased the dungeon progress bar thickness to easily display current percentage clearly.' }
    ]
  },
  {
    version: 'v4.8.0',
    date: '2026-05-09',
    time: '12:15:00',
    title: 'Dashboard Quest Navigation Fix',
    items: [
      { category: 'UX', description: 'Updated Guidebook links to correctly redirect Quests and Achievements directly to their respective tabs inside the Dungeons page.' }
    ]
  },
  {
    version: 'v4.7.22',
    date: '2026-05-09',
    time: '12:08:00',
    title: 'Offline Guidebook Markdown & Mobile Compressing',
    items: [
      { category: 'Documentation', description: 'Exported the entire Sanctum Guidebook to a standalone `GUIDEBOOK.md` file in the root directory for offline reading.' },
      { category: 'UI', description: 'Improved the Guidebook modal\'s responsiveness by compressing padding and font sizes on smaller screens to ensure content completely fits on a single mobile page without relying on scrolling.' }
    ]
  },
  {
    version: 'v4.7.21',
    date: '2026-05-09',
    time: '12:05:00',
    title: 'Sanctum Items Deep Linking & Responsive Layout',
    items: [
      { category: 'Feature', description: 'Added interactive hyperlinked terms within the Sanctum Items chapters to instantly route users to matching sections (Dungeon, Quests, Merchant, Talent Tree).' },
      { category: 'UX', description: 'Refined responsive layout for the entire guide book to ensure 100% visibility of all elements on tight mobile viewports without overflowing text.' }
    ]
  },
  {
    version: 'v4.7.20',
    date: '2026-05-09',
    time: '11:57:00',
    title: 'Sanctum Items Refinement',
    items: [
      { category: 'Documentation', description: 'Merged Core Resources and Advanced Items into a single cohesive Sanctum Items chapter.' },
      { category: 'UI', description: 'Added a dedicated bookmark tab for Sanctum Items to clearly identify its section on the right margin.' },
      { category: 'Aesthetic', description: 'Redesign item descriptions using markdown-style bullet points for better legibility.' }
    ]
  },
  {
    version: 'v4.7.19',
    date: '2026-05-09',
    time: '11:51:00',
    title: 'Sanctum Items Guide Expansion',
    items: [
      { category: 'Documentation', description: 'Expanded the "Sanctum Items" guide chapter into 4 dedicated pages, splitting Core Resources and Advanced Items for better readability.' },
      { category: 'Localization', description: 'Renamed "Protection Amulet" to "Death Defying Medal" to better reflect its actual nomenclature.' },
      { category: 'UI', description: 'Integrated the Sanctum Items chapter into the Guide Book\'s Table of Contents with correct page numbering mapping.' }
    ]
  },
  {
    version: 'v4.7.18',
    date: '2026-05-09',
    time: '11:20:00',
    title: 'Sanctum Items Guide Chapter',
    items: [
      { category: 'Feature', description: 'Added a new "Sanctum Items" chapter to the Guide Book containing encyclopedic details of all Core Resources and Advanced Items (Protection Amulet, XP Card, Gold Card).' }
    ]
  },
  {
    version: 'v4.7.17',
    date: '2026-05-09',
    time: '11:13:00',
    title: 'Talent Tree Guide Flow Optimization',
    items: [
      { category: 'UX', description: 'Replaced the standalone "How to get points" modal in the Talent Tree with a direct link to the interactive Guidebook (Talent System Chapter) to centralize all tutorials securely.' }
    ]
  },
  {
    version: 'v4.7.16',
    date: '2026-05-09',
    time: '11:06:00',
    title: 'Dashboard Guide Polish',
    items: [
      { category: 'UI', description: 'Added the Sanctum Map to the Guides section on the Dashboard page.' },
      { category: 'UX', description: 'Renamed the introductory welcome message in the Guidebook from Pathfinder to Seeker to ensure consistent narrative terminology.' }
    ]
  },
  {
    version: 'v4.7.15',
    date: '2026-05-10',
    time: '11:15:00',
    title: 'Guidebook Thematic Polish',
    items: [
      { category: 'UI', description: 'Adjusted Guidebook cover title typography for better responsiveness, utilizing a smaller cascading scale on mobile.' },
      { category: 'Aesthetic', description: 'Refined the Sanctum Map and Record icons in the Guidebook, shifting away from generic slate backgrounds to thematic Sky Blue.' },
      { category: 'Aesthetic', description: 'Synchronized hyperlinked keywords (Quests, Talents, Dungeons) within Guidebook chapters to seamlessly match the dominant color of their respective pages.' },
      { category: 'UX', description: 'Activated deep linking for Quests and Achievements keywords, effortlessly routing players to the Dashboard.' }
    ]
  },
  {
    version: 'v4.7.14',
    date: '2026-05-10',
    time: '11:00:00',
    title: 'Guidebook Navigation Polish',
    items: [
      { category: 'Bugfix', description: 'Fixed broken code structure and syntax errors in the Guidebook\'s pages array.' },
      { category: 'UX', description: 'Synchronized bookmark icons and colors with the new chapter sequence.' },
      { category: 'Logic', description: 'Re-mapped TOC and Bookmark links to correctly point to the updated page indices.' }
    ]
  },
  {
    version: 'v4.7.13',
    date: '2026-05-10',
    time: '10:30:00',
    title: 'Sanctum Navigation & Map Update',
    items: [
      { category: 'Feature', description: 'Added "Map to the Sanctum" chapter to the Guidebook, providing a visual overview of all application modules.' },
      { category: 'UX', description: 'Implemented interactive deep-links within the Guidebook that navigate directly to corresponding application sections (Vault, Merchant, Talents, etc.).' },
      { category: 'UI', description: 'Enhanced Guidebook navigation with updated page limits and bookmark synchronization for the new chapter.' }
    ]
  },
  {
    version: 'v4.7.12',
    date: '2026-05-09',
    time: '10:01:00',
    title: 'Adventure Guide Polish',
    items: [
      { category: 'Aesthetic', description: 'Updated Guidebook cover title to Adventure Guide with dynamic sizing to prevent clipping.' },
      { category: 'Aesthetic', description: 'Applied a luxurious gold gradient effect to the central compass logo.' },
      { category: 'UI', description: 'Changed the ampersand symbol to a sans-serif variant in serif headers to fix an awkward font rendering artifact.' }
    ]
  },
  {
    version: 'v4.7.11',
    date: '2026-05-09',
    time: '09:47:00',
    title: 'Pathfinders Guide Layout & Typography',
    items: [
      { category: 'Aesthetic', description: 'Renamed Guidebook to Pathfinders Guide and added a dedicated welcome/introduction chapter.' },
      { category: 'UI', description: 'Switched primary body text to a highly readable standard font while preserving the serif styling for headings.' },
      { category: 'UX', description: 'Realigned the Table of Contents dynamically and normalized the layout of page numerals with separating bars across all pages at the bottom edge.' }
    ]
  },
  {
    version: 'v4.7.10',
    date: '2026-05-09',
    time: '09:37:00',
    title: 'Guidebook Font Size Balancing',
    items: [
      { category: 'Bugfix', description: 'Rebalanced Guidebook font sizes down to text-xl to prevent content from overflowing on the pages while keeping them readable.' }
    ]
  },
  {
    version: 'v4.7.9',
    date: '2026-05-09',
    time: '09:28:00',
    title: 'Guidebook Aesthetic Polish',
    items: [
      { category: 'Aesthetic', description: 'Redesign Guidebook cover with Playfair Display gilded font and compass.' },
      { category: 'Aesthetic', description: 'Revert Talent System icon to Lucide Network.' }
    ]
  },
  {
    version: 'v4.7.8',
    date: '2026-05-09',
    time: '09:21:00',
    title: 'Guidebook Hand-drawn Icons & Readability Polish',
    items: [
      { category: 'UI', description: 'Replaced standard vector icons in the Sanctum Guidebook with custom procedural hand-drawn SVG icons to complement the vintage paper aesthetic.' },
      { category: 'UX', description: 'Enlarged handwritten font sizes in the "How to Acquire" and "Pro Tip" informational blocks to maximize readability.' }
    ]
  },
  {
    version: 'v4.7.7',
    date: '2026-05-09',
    time: '09:12:00',
    title: 'Retro Handwriting & Paper Texture Polish',
    items: [
      { category: 'Aesthetic', description: 'Explicitly injected Caveat cursive font into all inner-page text fields to bypass default cascading limits.' },
      { category: 'UX', description: 'Enlarged handwritten body text to improve readability against the new paper texture.' }
    ]
  },
  {
    version: 'v4.7.6',
    date: '2026-05-09',
    time: '09:02:00',
    title: 'Retro Handwriting & Paper Texture',
    items: [
      { category: 'Aesthetic', description: 'Replaced all book fonts with a handwritten cursive font (Caveat) and added procedural noise/paper texture to the pages for a retro feel.' },
      { category: 'UI', description: 'Desaturated bookmark tab colors to harmonize with the vintage paper appearance.' }
    ]
  },
  {
    version: 'v4.7.5',
    date: '2026-05-09',
    time: '08:53:00',
    title: 'Fluid 3D Book Layout Mechanics',
    items: [
      { category: 'Animation', description: 'Rewrote the Book Background Base Layer into a 3D split-folding mechanism. Front and back covers now swing synchronously with the pages, eliminating visual overlap and layout thrashing.' },
      { category: 'UX', description: 'Prevented the page from opening to intermediate transparent states during the first render loop and on mobile page tracking bounds.' }
    ]
  },
  {
    version: 'v4.7.4',
    date: '2026-05-09',
    time: '08:41:00',
    title: 'Guide Book Animation & Layout Centering',
    items: [
      { category: 'Bugfix', description: 'Fixed an animation glitch where the book base would transition visually on the first open by synchronously computing initial page states before rendering.' },
      { category: 'UI', description: 'Adjusted closed book container translation to smoothly move the book to the center of the screen when closed (Front Cover and Back Cover states).' }
    ]
  },
  {
    version: 'v4.7.3',
    date: '2026-05-09',
    time: '08:23:00',
    title: 'Closed Book Layout & Scrollbar Polish',
    items: [
      { category: 'UI', description: 'Added Front Cover and Back Cover states to the Guide Book, creating realistic closed states at the start and end of navigation.' },
      { category: 'UI', description: 'Removed internal page scrolling, ensuring all chapter content comfortably fits within a single page spread without scrollbars.' },
      { category: 'UX', description: 'Synchronized textbook font sizes to match the application\'s base text metrics for consistent readability.' }
    ]
  },
  {
    version: 'v4.7.2',
    date: '2026-05-09',
    time: '07:59:00',
    title: 'Guide Book Realistic Animation & B5 Aspect Ratio',
    items: [
      { category: 'UI', description: 'Restructured Guide Book aspect ratio to precisely simulate realistic B5 dimensions for single (mobile) and double pages (desktop).' },
      { category: 'UX', description: 'Improved Framer Motion 3D page flip animation to accurately simulate a book page swinging from the spine rather than spinning the entire layout.' },
      { category: 'UI', description: 'Snapped interactive bookmarks seamlessly to the right edge of the book base outline.' }
    ]
  },
  {
    version: 'v4.7.1',
    date: '2026-05-09',
    time: '07:40:00',
    title: 'Guide Book Mechanics & Mobile UX Polish',
    items: [
      { category: 'UX', description: 'Perfected the Guide Book to display as a single page on mobile devices for improved readability, while retaining the dual-page spread on larger screens.' },
      { category: 'UI', description: 'Implemented 3D page-flip animations (rotateY) across the book\'s layout for an authentic reading experience.' },
      { category: 'UI', description: 'Bookmarks were added to the right-edge of the book linking directly to explicit chapters.' },
      { category: 'UX', description: 'Navigation arrows relocated to the lower corners within the page boundary. Refined content to remove obsolete settings tips.' }
    ]
  },
  {
    version: 'v4.7.0',
    date: '2026-05-09',
    time: '07:18:00',
    title: 'Interactive Sanctum Guide Book',
    items: [
      { category: 'Feature', description: 'Redesigned the Sanctum Guides into a comprehensive, interactive 3D-styled Guide Book.' },
      { category: 'UX', description: 'Unified Coins, XP, and Talent guides into a single paginated modal with a Table of Contents.' },
      { category: 'UI', description: 'Implemented a parchment-themed book aesthetic with left/right page turning and responsive scaling.' }
    ]
  },
  {
    version: 'v4.6.22',
    date: '2026-05-09',
    time: '07:15:00',
    title: 'Sanctum Guides Update',
    items: [
      { category: 'Documentation', description: 'Updated Sanctum Guides to reflect that Coins and XP can be obtained from Quests and Achievements rather than Gacha.' },
      { category: 'UI', description: 'Improved readability of Guide settings redirect buttons by adding background colors and boosting text contrast against the background.' }
    ]
  },
  {
    version: 'v4.6.21',
    date: '2026-05-09',
    time: '07:05:00',
    title: 'Sanctum Guides: Interactive Settings Redirects',
    items: [
      { category: 'Documentation', description: 'Rewrote Sanctum Guide content (Gold, XP, Talents) to be more detailed and accurate.' },
      { category: 'UX', description: 'Added interactive buttons within the Guides that redirect users to the relevant sections in the Settings page.' }
    ]
  },
  {
    version: 'v4.6.20',
    date: '2026-05-09',
    time: '06:50:50',
    title: 'Daily Progress Goal: Synchronization',
    items: [
      { category: 'Feature', description: 'Synchronized Daily Progress Goal settings from General Settings to the Sanctum Dashboard display.' },
      { category: 'Bugfix', description: 'Fixed timezone-aware daily goal synchronization in Sanctum Dashboard.' }
    ]
  },
  {
    version: 'v4.6.19',
    date: '2026-05-09',
    time: '06:30:00',
    title: 'Settings: Daily Progress Goal UI Refinement',
    items: [
      { category: 'UX', description: 'Simplified Daily Progress Goal layout to a concise wrap-flex design for better clarity and space efficiency.' }
    ]
  },
  {
    version: 'v4.6.17',
    date: '2026-05-09',
    time: '06:22:00',
    title: 'Settings: Daily Progress Goals',
    items: [
      { category: 'Feature', description: 'Added the ability to set custom daily session goals per day of the week in General Settings.' }
    ]
  },
  {
    version: 'v4.6.16',
    date: '2026-05-09',
    time: '06:15:00',
    title: 'Dashboard: Guide Module Integration',
    items: [
      { category: 'Feature', description: 'Added a new Guide module to the Sanctum (Dashboard) for quick access to Coin, XP, and Talent system guides.' }
    ]
  },
  {
    version: 'v4.6.15',
    date: '2026-05-11',
    time: '00:15:00',
    title: 'Developer Tools: Talent Tree Reset',
    items: [
      { category: 'Feature', description: 'Reset Talent Tree. Added a dedicated developer action to lock all talents and clear the active build, facilitating testing and progression resets.' },
      { category: 'Security', description: 'Implemented a double-check confirmation modal for talent resets to prevent accidental progress loss.' }
    ]
  },
  {
    version: 'v4.6.14',
    date: '2026-05-11',
    time: '23:50:00',
    title: 'Talent Tree UI & Feedback Polish',
    items: [
      { category: 'UI', description: 'Added lock icons to the collapsed talent tree view for at-a-glance status checks of locked talents.' },
      { category: 'UX', description: 'Implemented a "shake" feedback animation when attempting to unlock a talent with insufficient points, providing immediate intuitive feedback.' }
    ]
  },
  {
    version: 'v4.6.13',
    date: '2026-05-11',
    time: '23:30:00',
    title: 'Talent Network Icon Upgrade',
    items: [
      { category: 'UI', description: 'Updated Talent Tree representation. Exchanged the generic Zap icon with a specialized Network vector across Navigation and Page Headers for better thematic alignment.' }
    ]
  },
  {
    version: 'v4.6.12',
    date: '2026-05-11',
    time: '22:45:00',
    title: 'Precise Theme Schedule & Timezone Logic',
    items: [
      { category: 'Feature', description: 'Full Time Selection. Updated theme transition settings to support full HH:mm precision instead of just hours.' },
      { category: 'UX', description: 'Renamed "Transition Hour" to "Transition Time" for better clarity and alignment with the new time picker.' },
      { category: 'Logic', description: 'Enhanced Timezone Comparison. Implemented robust string-based time comparison for reliable theme switching across all time zones.' }
    ]
  },
  {
    version: 'v4.6.11',
    date: '2026-05-11',
    time: '22:15:00',
    title: 'Mobile Layout Polish for Theme Scheduling',
    items: [
      { category: 'UX', description: 'Day/Night Theme Configuration Stack. Redesigned the theme configuration layout into a three-row vertical stack to ensure perfect visibility on narrow mobile devices.' },
      { category: 'UI', description: 'Reorganized transition time and theme selection elements for better spatial clarity and touch accessibility.' }
    ]
  },
  {
    version: 'v4.6.10',
    date: '2026-05-11',
    time: '21:50:00',
    title: 'Mobile Theme UX & Breakpoint Refinement',
    items: [
      { category: 'UX', description: 'Mobile Theme Layout. Redesigned the theme configuration header to stack vertically on small phones, preventing element clashing.' },
      { category: 'Architecture', description: 'Custom Breakpoints. Added a dedicated xs (400px) breakpoint to the Tailwind configuration for finer mobile UI control.' },
      { category: 'UI', description: 'Timezone Selection Polish. Improved the timezone selector responsiveness to ensure proper rendering on narrow viewports.' }
    ]
  },
  {
    version: 'v4.6.9',
    date: '2026-05-11',
    time: '21:30:00',
    title: 'Scheduled Auto Theme & Timezone Support',
    items: [
      { category: 'Feature', description: 'Scheduled Theme Switching. Added the ability to set specific "Day Start" and "Night Start" hours for automatic theme transitions.' },
      { category: 'Feature', description: 'Timezone Selection. Integrated a timezone selector to allow users to override system detection for theme scheduling.' },
      { category: 'UX', description: 'Simplified Theme Config. Redesigned the auto-theme pairing UI with a more compact, color-bubble selector.' }
    ]
  },
  {
    version: 'v4.6.8',
    date: '2026-05-11',
    time: '21:00:00',
    title: 'Auto Theme Switching & Daylight Default',
    items: [
      { category: 'Feature', description: 'System Theme Sync. Added a toggle to automatically switch between customized Day and Night themes based on system color scheme preference.' },
      { category: 'Feature', description: 'Custom Theme Pairing. Allowed users to independently set which themes are explicitly used for "Day" and "Night" modes.' },
      { category: 'UI', description: 'Default Theme Update. Set "Daylight" as the new default theme for the application.' },
      { category: 'UX', description: 'Theme Settings UI. Integrated auto-switch controls and theme preview selectors into the General Settings dashboard.' }
    ]
  },
  {
    version: 'v4.6.7',
    date: '2026-05-11',
    time: '20:30:00',
    title: 'Midnight Peak Logic & Aggregate Fixes',
    items: [
      { category: 'Logic', description: 'Midnight-Spanning Peak Times. Fully implemented logic for attributing sessions across midnight boundaries based on custom peak settings.' },
      { category: 'Fix', description: 'Peak-Aware Statistics. Updated all aggregation helpers (daily, weekly, heatmap, daily summary) to use the new peak-aware date attribution.' },
      { category: 'UX', description: 'Midnight Warning. Added visual indicators and color-coded labels in Time Settings for ranges that cross the midnight mark.' },
      { category: 'Fix', description: 'Shop Reward Visibility. Adjusted reward categorizations to ensure items purchased from the Merchant Shop appear in the Vault\'s Treasure tab.' }
    ]
  },
  {
    version: 'v4.6.6',
    date: '2026-05-11',
    time: '18:00:00',
    title: 'Modal Polish & Reward Persistence',
    items: [
      { category: 'UX', description: 'Portal Integration. Migrated all primary modals (Reward, Level Up, Gacha, Daily Summary) to React Portals for perfect centering and viewport isolation.' },
      { category: 'UX', description: 'Scroll Management. Integrated useScrollLock across all modals to prevent background content jumping while ensuring modals remain interactive.' },
      { category: 'Fix', description: 'Reward History. Verified that merchant shop item purchases are accurately logged in the Reward Vault even across session transitions.' },
      { category: 'UI', description: 'Explore View Polish. Updated the Reward Breakdown modal to use Portals and standardized z-index layers for depth consistency.' }
    ]
  },
  {
    version: 'v4.6.5',
    date: '2026-05-11',
    time: '17:15:00',
    title: 'Universal Modal Integration',
    items: [
      { category: 'Architecture', description: 'Replaced all native browser-native confirmation dialogs (window.confirm and alert) with a custom, theme-aware ConfirmModal component across the entire application.' },
      { category: 'UX', description: 'Integrated ConfirmModal into Developer Settings for security-sensitive actions and Dungeon Manager for task management confirmations.' },
      { category: 'Refactor', description: 'Centralized modal logic into a reusable component with framer-motion animations and standardized visual states (danger, warning, info).' }
    ]
  },
  {
    version: 'v4.6.4',
    date: '2026-05-11',
    time: '16:45:00',
    title: 'Pool Management & Security UX',
    items: [
      { category: 'Feature', description: 'Pool Renaming. Added a "Pool Name" field to the Gacha and Ichiban Kuji edit modals, allowing users to customize pool names easily.' },
      { category: 'UX', description: 'Reset Confirmations. Implemented "Double Check" warnings when resetting Gacha or Ichiban pools to prevent accidental data loss.' },
      { category: 'UX', description: 'Deletion Security. Standardized deletion confirmation dialogs across Merchant, Shop, and Reward settings for consistent safety.' }
    ]
  },
  {
    version: 'v4.6.3',
    date: '2026-05-11',
    time: '16:15:00',
    title: 'Talent UX & State Persistence',
    items: [
      { category: 'Feature', description: 'Talent Tree State. The collapsed/expanded state of the talent branches is now persisted in localStorage.' },
      { category: 'UX', description: 'Interactive Talent Icons. Talent icons in the Explore view now reveal tooltips on click, improving accessibility for mobile users.' }
    ]
  },
  {
    version: 'v4.6.2',
    date: '2026-05-11',
    time: '15:30:00',
    title: 'Dynamic Talent Descriptions & Formatting',
    items: [
      { category: 'Feature', description: 'Dynamic Crit Description. Linked the "Critical Intuition" (C3) talent description to real-time developer settings (Crit Chance & Multiplier).' },
      { category: 'UX', description: 'Improved numeric formatting in talent tooltips to handle floating-point values gracefully for better precision.' }
    ]
  },
  {
    version: 'v4.6.1',
    date: '2026-05-11',
    time: '12:00:00',
    title: 'Talent Description Accuracy Refinement',
    items: [
      { category: 'Documentation', description: 'Updated talent descriptions for Branch A and B to accurately reflect their trigger conditions (Perfect Theory & Bounty Decree now specify 8th session completion).' },
      { category: 'UX', description: 'Matched all talent descriptions in the Talent Tree with actual game logic implementation to prevent player confusion.' }
    ]
  },
  {
    version: 'v4.6.0',
    date: '2026-05-10',
    time: '09:00:00',
    title: 'Gacha Pool Management Expansion',
    items: [
      { category: 'Feature', description: 'Implemented multi-pool management for both Gacha and Ichiban Kuji, allowing users to create, delete, and rename custom pools.' },
      { category: 'Feature', description: 'Added pool rotation functionality in the Merchant Outpost, enabling seamless switching between different card pools.' },
      { category: 'Feature', description: 'Introduced Import/Export functionality via clipboard, allowing users to share and backup pool configurations in JSON format.' },
      { category: 'Architecture', description: 'Synchronized active pool state across the application to ensure persistence of the selected merchant offerings.' },
    ]
  },
  {
    version: 'v4.5.38',
    date: '2026-05-09',
    time: '11:15:00',
    title: 'Activity Log Personalization',
    items: [
      { category: 'Feature', description: 'Added a toggle in Activity Time Peaks settings to allow users to show or hide the "Other" time segment in activity charts.' },
      { category: 'UI', description: 'Updated the Record tab to dynamically adjust Daily and Weekly activity charts based on the "Other" peak visibility preference.' },
    ]
  },
  {
    version: 'v4.5.37',
    date: '2026-05-09',
    time: '10:55:00',
    title: 'Ichiban Kuji Rarity Values',
    items: [
      { category: 'Feature', description: 'Adjusted the default Ichiban Kuji prize mapping: A Prize is now Rarity 5 (Amber), B is 4 (Purple), C is 3 (Blue), and D is 2 (Emerald).' },
      { category: 'Fix', description: 'Replaced all hardcoded instances of fuchsia color references with the correct rose Mythic color across the codebase.' },
      { category: 'Fix', description: 'Updated Reward History and Shop item color fallbacks to accurately intercept the newly remapped Ichiban / Gacha tiers.' },
    ]
  },
  {
    version: 'v4.5.36',
    date: '2026-05-09',
    time: '10:30:00',
    title: 'Rarity Updates',
    items: [
      { category: 'Feature', description: 'Updated rarity and color mappings sequence to: Common (slate), Uncommon (emerald), Rare (blue), Epic (purple), Legendary (amber), Mythic (rose).' },
    ]
  },
  {
    version: 'v4.5.35',
    date: '2026-05-08',
    time: '18:00:00',
    title: 'Ichiban Kuji Duplication Fix',
    items: [
      { category: 'Bugfix', description: 'Fixed an issue where "Standard Ichiban Kuji" displayed identical prize tiers multiple times instead of consolidating them.' },
      { category: 'System', description: 'Automatically migrated existing corrupt saved data by intelligently grouping items of the same Ichiban Kuji rarity tiers together and recovering standard inventory structures.' }
    ]
  },
  {
    version: 'v4.5.34',
    date: '2026-05-08',
    time: '17:00:00',
    title: 'Universal Rarity Mapping',
    items: [
      { category: 'System', description: 'Established a universal numerical mapping (1-6) for rarity states (Common -> Exotic).' },
      { category: 'Feature', description: 'Ichiban Kuji pools and generic Gacha settings now store and interact with formal rarity values to ensure logic scaling across future updates.' },
      { category: 'UI', description: 'Removed the reddish background from the Last One prize setting card entirely to provide full compatibilty with Light Themes.' }
    ]
  },
  {
    version: 'v4.5.33',
    date: '2026-05-08',
    time: '16:44:00',
    title: 'Ichiban Kuji Theme Compatibility Polish',
    items: [
      { category: 'Feature', description: 'Added default colors to the initial Ichiban Kuji prize tiers.' },
      { category: 'UI', description: 'Fixed an issue where the Last One prize setting block displayed a dark red background/shadow that was incompatible with light themes.' }
    ]
  },
  {
    version: 'v4.5.32',
    date: '2026-05-08',
    time: '16:35:00',
    title: 'Ichiban Kuji Pool Layout & Colors',
    items: [
      { category: 'UI', description: 'Redesigned the Ichiban Kuji settings modal to mirror the new card-based layout introduced in normal Gacha settings.' },
      { category: 'Feature', description: 'Allowed users to assign custom predefined aesthetic color themes to individual Ichiban Kuji prize tiers.' },
      { category: 'System', description: 'Updated Shop and Vault renderings to seamlessly consume custom colors directly from Ichiban Kuji reward data.' }
    ]
  },
  {
    version: 'v4.5.31',
    date: '2026-05-08',
    time: '16:26:00',
    title: 'Gacha Pool Layout Redesign',
    items: [
      { category: 'UI', description: 'Completely redesigned the Gacha pool settings modal with a clear, card-based layout.' },
      { category: 'Feature', description: 'Restricted custom rarity themes strictly to the sequence: Common, Rare, Epic, Legendary, Mythic, Exotic.' },
      { category: 'Feature', description: 'Added automatic Drop Rate (%) percentage calculation to the weight configurations.' }
    ]
  },
  {
    version: 'v4.5.30',
    date: '2026-05-08',
    time: '15:45:00',
    title: 'Custom Gacha Rarities & Colors',
    items: [
      { category: 'Feature', description: 'Gacha pools now support fully customizable rarities, allowing users to add/delete custom rarities and adjust weights for each tier dynamically.' },
      { category: 'UI', description: 'Introduced a curated color palette for rarity tiers, applicable seamlessly to custom Gacha sets.' },
      { category: 'System', description: 'Gacha reward results and Vault inventory table are now fully synchronized to render the custom rarity colors attached to the obtained items.' },
    ]
  },
  {
    version: 'v4.5.29',
    date: '2026-05-08',
    time: '15:10:00',
    title: 'Ichiban Kuji Row Layout Refinement',
    items: [
      { category: 'UI', description: 'Redesigned the Ichiban Kuji prize lists to display as a cohesive row-by-row layout instead of a grid, matching the standard Gacha UI for better readability.' }
    ]
  },
  {
    version: 'v4.5.28',
    date: '2026-05-08',
    time: '14:56:00',
    title: 'Gacha Settings UI Polish',
    items: [
      { category: 'UI', description: 'Redesigned the visualization of standard Gacha prizes in the Merchant settings to use structured cards that clearly split item pools by rarity and drop rates.' },
      { category: 'UI', description: 'Redesign the Ichiban Kuji prize lists into a dedicated grid displaying probability ratios, prize tiers, remaining quantities, and initial quantities cleanly.' }
    ]
  },
  {
    version: 'v4.5.27',
    date: '2026-05-08',
    time: '14:50:00',
    title: 'Developer Mode Security UX Update',
    items: [
      { category: 'UX', description: 'Moved the "Lock & Disable" button to the very bottom of the Developer Settings page.' },
      { category: 'UI', description: 'Redesigned the lock button into a minimalist, centered action with a dedicated icon to prevent accidental triggers and clean up the header.' }
    ]
  },
  {
    version: 'v4.5.26',
    date: '2026-05-08',
    time: '14:45:00',
    title: 'Developer Settings Header Cleanup',
    items: [
      { category: 'UI', description: 'Removed the redundant "Developer Tools" section header from the Developer Settings page.' },
      { category: 'UX', description: 'Relocated the "Lock & Disable" action to the "Resource Modification" header for a more streamlined layout.' }
    ]
  },
  {
    version: 'v4.5.25',
    date: '2026-05-08',
    time: '14:20:00',
    title: 'Universal Numeric Input Refactor',
    items: [
      { category: 'UI/UX', description: 'Replaced all raw numerical input fields across the application with a unified SpinnerInput component.' },
      { category: 'Feature', description: 'SpinnerInput standardizes numerical adjustment styles with increment/decrement arrow buttons and proper bounds validation.' },
      { category: 'Feature', description: 'Added float tracking and step capability to SpinnerInput to robustly handle decimals like Crit Chance.' }
    ]
  },
  {
    version: 'v4.5.24',
    date: '2026-05-08',
    time: '13:50:00',
    title: 'Developer Settings Responsive Layout',
    items: [
      { category: 'UI', description: 'Refined "Resource Modification" grid in Developer Settings to be responsive (1 column on mobile, 2 on tablet, 3 on desktop).' }
    ]
  },
  {
    version: 'v4.5.23',
    date: '2026-05-08',
    time: '13:45:00',
    title: 'Developer Settings Refactor & Layout Update',
    items: [
      { category: 'Architecture', description: 'Extracted Developer Settings from Settings.tsx into a dedicated DeveloperSettings.tsx component for better maintainability.' },
      { category: 'UI', description: 'Modified the "Resource Modification" layout in Developer Settings to statically display 3 columns per row for improved consistency and density.' }
    ]
  },
  {
    version: 'v4.5.22',
    date: '2026-05-08',
    time: '13:35:00',
    title: 'Unconditional Reward Chest Storage',
    items: [
      { category: 'Feature', description: 'Rewrote reward generation to unconditionally push new rewards to the pending reward chest regardless of victory screen skipping settings.' },
      { category: 'Bugfix', description: 'Selecting a reward gracefully removes it from the pending chest, ensuring that refreshing or dismissing the victory modal no longer permanently destroys unclaimed rewards.' },
      { category: 'Theme UI', description: 'Added vertical line connecting trees for release history nodes.' }
    ]
  },
  {
    version: 'v4.5.21',
    date: '2026-05-08',
    time: '12:05:00',
    title: 'Numeric Inputs Empty State & Validation Polish',
    items: [
      { category: 'UX', description: 'Rewrote numeric input controls across Settings to support empty string (`\'\'`) states during editing instead of jumping to 0.' },
      { category: 'Feature', description: 'Added strict validation checks on save operations for numeric inputs, triggering popup alerts when saving missing or invalid numeric data.' }
    ]
  },
  {
    version: 'v4.5.20',
    date: '2026-05-08',
    time: '11:55:00',
    title: 'Shop Stock Adjuster Buttons',
    items: [
      { category: 'UI', description: 'Added increment and decrement buttons to the Stock input in Shop Item settings.' },
      { category: 'UX', description: 'Implemented logic to seamlessly transition between numeric values and infinite (∞) status via adjustment buttons.' }
    ]
  },
  {
    version: 'v4.5.19',
    date: '2026-05-08',
    time: '11:40:00',
    title: 'Shop Stock UI Refinement',
    items: [
      { category: 'UI', description: 'Updated the Stock Availability input in the Shop Item settings to display the infinity symbol "∞" when the value is set to infinite (-1).' },
      { category: 'UX', description: 'Improved input logic to treat empty values as infinite stock.' }
    ]
  },
  {
    version: 'v4.5.18',
    date: '2026-05-08',
    time: '11:35:00',
    title: 'Merchant Settings Icon Update',
    items: [
      { category: 'UI', description: 'Updated Gacha section and pool icons in Merchant settings to use the custom SlotMachine component.' }
    ]
  },
  {
    version: 'v4.5.17',
    date: '2026-05-08',
    time: '11:31:00',
    title: 'Gacha Icon Refinement',
    items: [
      { category: 'UI', description: 'Replaced the SlotMachine vector in SlotMachine.tsx with a new custom SVG.' }
    ]
  },
  {
    version: 'v4.5.16',
    date: '2026-05-08',
    time: '11:23:00',
    title: 'Splash Screen Icon Polish',
    items: [
      { category: 'UI', description: 'Converted pwa-icon.svg into an inline React component (AppIcon.tsx) for dynamic styling.' },
      { category: 'UI', description: 'Stripped background from the Splash Screen icon and applied the theme color, leveraging SVG masks for exact cutout shapes.' }
    ]
  },
  {
    version: 'v4.5.15',
    date: '2026-05-08',
    time: '11:15:00',
    title: 'Splash Screen Icon Change',
    items: [
      { category: 'UI', description: 'Setup pwa-icon.svg as a central custom icon.' },
      { category: 'UI', description: 'Replaced the generic Sword icon inside the Splash Screen with the dynamically responding pwa-icon.svg.' }
    ]
  },
  {
    version: 'v4.5.14',
    date: '2026-05-08',
    time: '09:48:00',
    title: 'Gacha Icon Update',
    items: [
      { category: 'UI', description: 'Created a custom SlotMachine SVG icon and integrated it into the Merchant\'s outposts.' },
      { category: 'UI', description: 'Replaced the generic Sparkles icon with the new SlotMachine icon in the Gacha tab.' }
    ]
  },
  {
    version: 'v4.5.13',
    date: '2026-05-08',
    time: '08:44:12',
    title: 'Settings UI & UX Polish',
    items: [
      { category: 'UI', description: 'Adjusted modal container layouts in ShopSettings and RewardSettings to ensure symmetrical column heights.' },
      { category: 'UX', description: 'Dynamically updated modal titles to reflect "Add New" vs "Edit" depending on whether the item/reward is new.' }
    ]
  },
  {
    version: 'v4.5.12',
    date: '2026-05-08',
    time: '07:45:12',
    title: 'Icon Selection & Reward Visuals',
    items: [
      { category: 'UI', description: 'Overhauled icon selection grid for Shop and Rewards with 50+ thematic icons (Fruits, Food, Nature, Vehicles, Tech).' },
      { category: 'Feature', description: 'Added custom icon support for Loot Pool rewards, visible in both Settings and Victory screen.' },
      { category: 'UI', description: 'Improved Reward Modal layout with centered, larger icon displays for a more impactful collection experience.' }
    ]
  },
  {
    version: 'v4.5.11',
    date: '2026-05-08',
    time: '07:45:12',
    title: 'About Page Refinement',
    items: [
      { category: 'UI', description: 'Updated Release History to includes precise timestamps (HH:MM:SS).' },
      { category: 'UI', description: 'Implemented collapsible grouping for Release History by major/minor versions.' }
    ]
  },
  {
    version: 'v4.5.10',
    date: '2026-05-08',
    time: '07:30:45',
    title: 'Settings UI Visual Cleanup',
    items: [
      { category: 'UI', description: 'Removed background colors from section headers in the Merchant and Loot Pool settings for a flatter look.' }
    ]
  },
  {
    version: 'v4.5.9',
    date: '2026-05-08',
    time: '07:28:15',
    title: 'Merchant Settings Reorganization',
    items: [
      { category: 'UI', description: 'Reordered Merchant tab sections to follow: Shop, Gacha, Ichiban Kuji, and Draw Animation.' },
      { category: 'UX', description: 'Improved the logical flow of merchant configuration by prioritizing fixed items over randomized pools.' }
    ]
  },
  {
    version: 'v4.5.8',
    date: '2026-05-08',
    time: '07:26:00',
    title: 'Settings Header Refinement',
    items: [
      { category: 'UI', description: 'Removed italic styling from all settings section titles for a cleaner look.' },
      { category: 'UI', description: 'Removed bottom borders from section titles to reduce visual clutter.' }
    ]
  },
  {
    version: 'v4.5.7',
    date: '2026-05-08',
    time: '07:20:30',
    title: 'Settings Header Standardization',
    items: [
      { category: 'UI', description: 'Unified all section headers across Settings with standard icon sizes (20px) and typography.' },
      { category: 'UI', description: 'Added decorative bottom borders to all settings section titles for better visual separation.' },
      { category: 'UI', description: 'Applied standardized styling to About, Developer, and Activity Time section headers.' }
    ]
  },
  {
    version: 'v4.5.6',
    date: '2026-05-08',
    time: '07:15:00',
    title: 'Crit Setting UI Refinement',
    items: [
      { category: 'UI', description: 'Added a bordered container for Crit Chance and Multiplier settings.' },
      { category: 'UI', description: 'Moved the Critical Intuition talent notice to a full-width block below the inputs.' },
      { category: 'UI', description: 'Increased font size and visibility for the talent requirement notice.' }
    ]
  },
  {
    version: 'v4.5.5',
    date: '2026-05-08',
    time: '07:10:00',
    title: 'Critical Intuition Talent Notice',
    items: [
      { category: 'Architecture', description: 'Extended onTabChange prop through Settings hierarchy to allow internal navigation.' },
      { category: 'UI', description: 'Added a status badge and helper text to the Crit Chance setting to inform users of the required talent.' },
      { category: 'UX', description: 'Enabled direct jump to the Talents page from the Crit Chance setting notice.' }
    ]
  },
  {
    version: 'v4.5.4',
    date: '2026-05-08',
    time: '07:05:00',
    title: 'Reward Settings Consolidation',
    items: [
      { category: 'Architecture', description: 'Merged "Reward Settings" page into the "Timer" settings tab for improved UX flow.' },
      { category: 'UI', description: 'Consolidated related session configurations by grouping timer settings and reward pools.' },
      { category: 'UI', description: 'Removed the dedicated "Rewards" tab from the Settings navigation bar.' }
    ]
  },
  {
    version: 'v4.5.3',
    date: '2026-05-08',
    time: '07:00:00',
    title: 'Merchant Settings Reorganization',
    items: [
      { category: 'UI', description: 'Renamed "Shop Settings" to "Fixed Shop Items" and moved it after Gacha pools.' },
      { category: 'UI', description: 'Relocated "Draw Animation" settings to the very end of the Merchant tab for better categorization.' },
      { category: 'Fix', description: 'Ensured Standard Gacha and Ichiban Kuji sections appear first in the Merchant dashboard.' }
    ]
  },
  {
    version: 'v4.5.2',
    date: '2026-05-08',
    time: '06:55:00',
    title: 'Push Notification & Stability Fixes',
    items: [
      { category: 'Bugfix', description: 'Resolved VapidPkHashMismatch errors by synchronizing VAPID fallback keys and adding auto-detection for key mismatches in the client.' },
      { category: 'Feature', description: 'Added "Reset Notifications" button in General Settings to manually clear invalid push subscriptions.' },
      { category: 'Optimization', description: 'Fixed TypeScript lint errors related to ImportMeta in the notification registration logic.' }
    ]
  },
  {
    version: 'v4.5.1',
    date: '2026-05-08',
    time: '06:50:00',
    title: 'Merchant Settings Organization',
    items: [
      { category: 'UI', description: 'Separated Gacha and Ichiban Kuji pools into distinct sections within the Merchant settings for better management.' }
    ]
  },
  {
    version: 'v4.5.0',
    date: '2026-05-08',
    time: '06:45:00',
    title: 'Merchant & Level UI Refinement',
    items: [
      { category: 'UI', description: 'Merged "Shop" and "Gacha" into a single "Merchant" tab for a more cohesive management experience.' },
      { category: 'UI', description: 'Renamed "Level Rewards" to "Level" and tightened the overall tab navigation layout for better space efficiency.' }
    ]
  },
  {
    version: 'v4.4.9',
    date: '2026-05-08',
    time: '06:40:00',
    title: 'Settings Tab UX Refinement',
    items: [
      { category: 'UI', description: 'Updated the Settings navigation tabs to a wrapping layout, ensuring all categories are visible without horizontal scrolling.' }
    ]
  },
  {
    version: 'v4.4.8',
    date: '2026-05-08',
    time: '06:35:00',
    title: 'Settings UI Cleanup',
    items: [
      { category: 'UI', description: 'Removed the redundant "Dungeon Settings" banner from the top of the Settings page for a cleaner interface.' }
    ]
  },
  {
    version: 'v4.4.7',
    date: '2026-05-08',
    time: '06:30:00',
    title: 'XP Drop Mode Customization',
    items: [
      { category: 'Feature', description: 'Allowed users to set the XP Drop Mode as either fixed or random in the Session Reward Settings, bringing it to parity with Gold Drop Mode.' }
    ]
  },
  {
    version: 'v4.4.6',
    date: '2026-05-08',
    time: '06:25:00',
    title: 'Timer Skip Count Fix',
    items: [
      { category: 'Bugfix', description: 'Fixed an issue where manually skipping a completed timer state could incorrectly increment the loop counter beyond its maximum limit (e.g. showing 3/2).' }
    ]
  },
  {
    version: 'v4.4.5',
    date: '2026-05-08',
    time: '06:20:00',
    title: 'Timer Loop Sync Polish',
    items: [
      { category: 'Feature', description: 'Refined the Timer Loop counting logic so that loop counters naturally increment only AFTER a full Focus + Rest cycle is fully completed or manually skipped.' }
    ]
  },
  {
    version: 'v4.4.4',
    date: '2026-05-08',
    time: '06:15:00',
    title: 'Service Worker Dev Mode Fix',
    items: [
      { category: 'Bugfix', description: 'Fixed an issue where the Service Worker failed to register in development environments due to missing module type attributes and incorrect paths.' }
    ]
  },
  {
    version: 'v4.4.3',
    date: '2026-05-08',
    time: '06:10:00',
    title: 'Timer Loop State Fix',
    items: [
      { category: 'Bugfix', description: 'Fixed an issue where completing the targeted number of loops would sometimes incorrectly reset the loop count to 0, completely breaking the intended n/n tracking state.' }
    ]
  },
  {
    version: 'v4.4.2',
    date: '2026-05-08',
    time: '06:05:00',
    title: 'Reward Chest & Deferred Rewards',
    items: [
      { category: 'Feature', description: 'Added a "Defer to Chest" option in the Timer Settings, allowing users to skip the Victory Screen but store the rewards in a Chest (stash) to review later.' },
      { category: 'UX', description: 'Added a Reward Chest icon to the Timer banner that shows a notification dot when rewards are pending.' },
      { category: 'UI', description: 'Created a Reward Chest modal to review and select pending rewards, with an "Auto-Pick Best" option for resolving multiple pending reward sessions instantly.' }
    ]
  },
  {
    version: 'v4.4.1',
    date: '2026-05-08',
    time: '06:00:00',
    title: 'Skip Victory Screen Option',
    items: [
      { category: 'Feature', description: 'Added a setting to automatically skip the Victory screen when a timer session finishes, with options to automatically pick the highest rarity reward or discard rewards entirely.' }
    ]
  },
  {
    version: 'v4.4.0',
    date: '2026-05-08',
    time: '05:55:00',
    title: 'Settings Page Componentization',
    items: [
      { category: 'Architecture', description: 'Completely refactored the massive Settings.tsx file by creating a dedicated settings folder and breaking down all sub-sections into independent component files for much better maintainability.' }
    ]
  },
  {
    version: 'v4.3.15',
    date: '2026-05-08',
    time: '05:50:00',
    title: 'Timer Settings Quick Access',
    items: [
      { category: 'UI', description: 'Added a dedicated gear icon to the top-left corner of the Timer Banner for quick access to the Timer settings page.' }
    ]
  },
  {
    version: 'v4.3.14',
    date: '2026-05-08',
    time: '05:45:00',
    title: 'Timer Settings Page Refactor',
    items: [
      { category: 'Architecture', description: 'Extracted Timer specifics (Compact Timer Banner, visible shortcuts, and Session Reward Settings) into a newly created dedicated Timer settings page within the Settings dialog.' }
    ]
  },
  {
    version: 'v4.3.13',
    date: '2026-05-07',
    time: '23:30:00',
    title: 'Talent Icon Overhaul',
    items: [
      { category: 'UI', description: 'Replaced all talent tree node icons with newly assigned Lucide equivalents mapped specifically for each branch and tier.' }
    ]
  },
  {
    version: 'v4.3.12',
    date: '2026-05-07',
    time: '23:00:00',
    title: 'Ichiban Ticket Icon Replacement',
    items: [
      { category: 'UI', description: 'Replaced all Lucide icons representing the \'Ichiban\' feature with Ticket across Settings.tsx.' },
      { category: 'UI', description: 'Added Ticket to the available icon selection array for custom shop and loot items.' }
    ]
  },
  {
    version: 'v4.3.11',
    date: '2026-05-07',
    time: '22:30:00',
    title: 'Timer Loop Counting Display Polish',
    items: [
      { category: 'Feature', description: 'Loop count display now strictly starts at 0/n and logically updates to 1/n only when a full focus task (one cycle unit) is completed.' },
      { category: 'Feature', description: 'Stopping at maximum loops will naturally show n/n.' },
      { category: 'Bugfix', description: 'Modifying loop target or loop activity naturally resets current counts to 0/n, keeping state and UX synchronized.' }
    ]
  },
  {
    version: 'v4.3.10',
    date: '2026-05-07',
    time: '22:00:00',
    title: 'Timer Settings Loop Polish',
    items: [
      { category: 'Feature', description: 'Extracted loop logic into TimerLoopSettings.tsx.' },
      { category: 'Feature', description: 'Allowed user to choose infinite or custom target loop counts.' },
      { category: 'UI', description: 'Displayed {current}/{target} loops format within the timer circle when looping is active.' }
    ]
  },
  {
    version: 'v4.3.9',
    date: '2026-05-07',
    time: '21:30:00',
    title: 'Compact Timer Banner Theme Fix & Theme Standard Rule',
    items: [
      { category: 'Bugfix', description: 'Replaced fixed indigo-300 text colors with indigo-400 in the Compact Timer Banner settings so the text scales properly with the selected custom theme.' },
      { category: 'Documentation', description: 'Added a rule to AGENTS.md explicitly defining which indigo scale ranges correctly adopt theme colors.' }
    ]
  },
  {
    version: 'v4.3.8',
    date: '2026-05-07',
    time: '21:00:00',
    title: 'Timer Banner Customization',
    items: [
      { category: 'Feature', description: 'Added a toggle in Settings to use a Compact Timer Banner (hide navigation shortcuts).' },
      { category: 'Feature', description: 'Added the ability to customize which navigation shortcuts appear in the Timer Banner when not in compact mode.' }
    ]
  },
  {
    version: 'v4.3.7',
    date: '2026-05-07',
    time: '20:30:00',
    title: 'Recent Sessions UI Polish',
    items: [
      { category: 'UI', description: 'Centered the contents of the Actions column in the Recent Sessions table for better alignment with the header.' }
    ]
  },
  {
    version: 'v4.3.6',
    date: '2026-05-07',
    time: '20:00:00',
    title: 'Reward Details View in Recent Sessions',
    items: [
      { category: 'Feature', description: 'Added the ability to click on a Reward in the Recent Sessions table to view its full details (description, rarity, type) based on the current Loot Pool.' }
    ]
  },
  {
    version: 'v4.3.5',
    date: '2026-05-07',
    time: '19:30:00',
    title: 'Centralized Versioning System',
    items: [
      { category: 'Architecture', description: 'Created src/version.ts to centralize application version and release history.' },
      { category: 'Refactor', description: 'Updated Settings and SplashScreen to consume data from the centralized source, making future updates easier.' }
    ]
  },
  {
    version: 'v4.3.4',
    date: '2026-05-07',
    time: '19:00:00',
    title: 'Clockwise Timer Progress Fix',
    items: [
      { category: 'Bugfix', description: 'Corrected the timer progress ring direction to be clockwise starting from 12 o\'clock.' }
    ]
  },
  {
    version: 'v4.3.3',
    date: '2026-05-07',
    time: '18:30:00',
    title: 'Theme-Aware Banner Hover Finish',
    items: [
      { category: 'UI', description: 'Unified all hover states in the Explore tab\'s timer navigation banner to use the theme-aware primary color.' }
    ]
  },
  {
    version: 'v4.3.2',
    date: '2026-05-07',
    time: '18:00:00',
    title: 'Timer Banner Hover Polish',
    items: [
      { category: 'UI', description: 'Unified all hover states in the Explore tab\'s timer navigation banner to use a deep, theme-aware dark color.' }
    ]
  },
  {
    version: 'v4.3.1',
    date: '2026-05-07',
    time: '17:30:00',
    title: 'Type Error Fixes & Technical Infrastructure',
    items: [
      { category: 'TypeScript', description: 'Resolved all reported TS2322, TS2305, and TS2304 errors across the codebase.' },
      { category: 'Refactor', description: 'Completed global renaming of UserState to AppState for semantic clarity.' },
      { category: 'Bugfix', description: 'Corrected function signatures for reorder, draw, and log functions.' }
    ]
  },
  {
    version: 'v4.3.0',
    date: '2026-05-07',
    time: '17:00:00',
    title: 'App.tsx Refactoring & Componentization',
    items: [
      { category: 'Architecture', description: 'Successfully refactored App.tsx into dedicated component files.' },
      { category: 'Architecture', description: 'Encapsulated complex modal logic into standalone components.' },
      { category: 'UI', description: 'Enhanced the Reward Completion experience by integrating the new component.' }
    ]
  }
];
