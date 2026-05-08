export const APP_VERSION = 'v4.5.21';
export const LAST_UPDATE_DATE = '2026-05-08';
export const LAST_UPDATE_TIME = '12:05:00';

export interface ReleaseLog {
  version: string;
  date: string;
  time?: string;
  title: string;
  items: { category: string; description: string }[];
}

export const RELEASE_HISTORY: ReleaseLog[] = [
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
