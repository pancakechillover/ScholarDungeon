export const APP_VERSION = 'v4.6.12';
export const LAST_UPDATE_DATE = '2026-05-11';
export const LAST_UPDATE_TIME = '22:45:00';

export interface ReleaseLog {
  version: string;
  date: string;
  time?: string;
  title: string;
  items: { category: string; description: string }[];
}

export const RELEASE_HISTORY: ReleaseLog[] = [
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
