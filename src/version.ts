export const APP_VERSION = 'v7.5.4';
export const LAST_UPDATE_DATE = '2026-06-02';
export const LAST_UPDATE_TIME = '15:00:00';

export interface ReleaseLog {
  version: string;
  date: string;
  time: string;
  title: string;
  items: { category: string; description: string }[];
}

export const RELEASE_HISTORY: ReleaseLog[] = [
  {
    version: 'v7.5.4',
    date: '2026-06-02',
    time: '23:30:00',
    title: 'Record Dashboard Data Interactions',
    items: [
      { category: 'Feature', description: 'Added "Return to Day" jump buttons inside tooltips across the Record dashboard to jump specifically to that date.' },
      { category: 'Feature', description: 'Interactive statistics popovers added for individual history checks within the Routine Tracker.' },
      { category: 'UI', description: 'Daily statistics and Weekly charts now clearly display "No activity" placeholders on zero-value segments.' }
    ]
  },
  {
    version: 'v7.5.3',
    date: '2026-06-02',
    time: '23:00:00',
    title: 'Record Dashboard UI & Sync Polish',
    items: [
      { category: 'UI', description: 'Aligned the base and maximum rendering height of the Weekly bar chart with the Daily bar chart for visual consistency across the grid.' },
      { category: 'UI', description: 'Fixed an issue on mobile where the top bar Profile Sync red dot indicator would persist on fully synced states.' },
    ]
  },
  {
    version: 'v7.5.1',
    date: '2026-06-02',
    time: '15:00:00',
    title: 'XP Table Multi-Reward Architecture',
    items: [
      { category: 'Feature', description: 'Upgraded Level Up rewards to support setting and granting multiple different rewards per milestone level.' },
      { category: 'UI', description: 'Redesigned the custom Level Rewards manager inside Settings to display an interactive modular sub-rewards list constructor.' },
      { category: 'UI', description: 'Changed Talent point rewards representation to green Talent Scroll icons throughout the XP lists, Modals, and Settings.' }
    ]
  },
  {
    version: 'v7.5.0',
    date: '2026-06-02',
    time: '14:50:00',
    title: 'XP Tied Epithet Customization',
    items: [
      { category: 'Feature', description: 'Re-linked title (称号) milestones to level progression achievements directly integrated within the XP list.' },
      { category: 'UI', description: 'Employed high-contrast horizontal divider rows to separate rank tiers (Novice: 1-3, Veteran: 4-15, Master: 16-47, Grandmaster: 48+).' },
      { category: 'UX', description: 'Removed the previous manual title setting form from Settings, making player badges earned purely as level-up reward milestones.' }
    ]
  },
  {
    version: 'v7.4.14',
    date: '2026-06-02',
    time: '14:20:00',
    title: 'Settings Navigation Redesign',
    items: [
      { category: 'UX', description: 'Redesigned the Settings tabs into a compact row-by-row navigation menu layout, improving scannability and structure.' },
      { category: 'UI', description: 'Moved the "Back to Menu" action button to the far-right of settings sub-page headers on all devices.' },
      { category: 'Feature', description: 'The settings screen persistently remembers the last opened tab compartment between user sessions using localStorage.' }
    ]
  },
  {
    version: 'v7.4.13',
    date: '2026-06-02',
    time: '14:00:00',
    title: 'Reward Vault Navigation Polish',
    items: [
      { category: 'Feature', description: 'Merged Treasures and Custom Rewards channels into All Rewards sub-tabs for simplified layout.' },
      { category: 'UI', description: 'Relocated the "Back to Vault" action button to the rightmost side of sub-page headers across all compartments.' },
    ]
  },
  {
    version: 'v7.4.12',
    date: '2026-06-02',
    time: '13:45:00',
    title: 'Reward Vault Navigation Redesign',
    items: [
      { category: 'UX', description: 'Redesigned the Reward Vault into a nested menu structure, showing one distinct compartment per row on the root screen.' },
      { category: 'Feature', description: 'The Vault now persistently remembers the last opened compartment between sessions using local storage.' },
    ]
  },
  {
    version: 'v7.4.11',
    date: '2026-06-02',
    time: '13:40:00',
    title: 'Reward Vault Mobile Polish',
    items: [
      { category: 'UI', description: 'Modified the Reward Vault tabs container to be horizontally scrollable on mobile devices, ensuring all options remain fully accessible even on narrow screens.' }
    ]
  },
  {
    version: 'v7.4.10',
    date: '2026-06-02',
    time: '13:35:00',
    title: 'Reward Vault UI Cleanup',
    items: [
      { category: 'UI', description: 'Removed redundant "Treasures" and "Custom" counter blocks in the Reward Vault header to declutter the interface and maintain visual consistency.' }
    ]
  },
  {
    version: 'v7.4.9',
    date: '2026-06-02',
    time: '13:30:00',
    title: 'Talent Tree UI Cleanup',
    items: [
      { category: 'UI', description: 'Removed redundant point and shard trackers strictly within the Talent Tree header to avoid overlapping with the universal Top Bar indicators.' }
    ]
  },
  {
    version: 'v7.4.8',
    date: '2026-06-02',
    time: '13:25:00',
    title: 'Top Bar Polish & Talent Logic',
    items: [
      { category: 'Fix', description: 'Fixed Talent Scrolls tooltip opening animation jitter by isolating hover/active bounds out of the absolute wrapper.' },
      { category: 'UI', description: 'Added proper "X/3" Shards indicator within the Talent Forge tooltip.' },
      { category: 'UI', description: 'Capped displayed Top Bar Gold Coin amount strictly to 6 digits (using a 999,999+ maximum).' },
      { category: 'UI', description: 'Realigned flex-box gaps between Talent, Coins, and Streak to be perfectly symmetrical.' }
    ]
  },
  {
    version: 'v7.4.7',
    date: '2026-06-02',
    time: '13:00:00',
    title: 'Top Bar Sync & Resource Upgrades',
    items: [
      { category: 'UI', description: 'Talent Shards strictly render at 1280px screen widths, independent of the sidebar state.' },
      { category: 'Feature', description: 'Retired auto-conversion of Shards into Scrolls. They are now combined side-by-side physically in a dedicated click-to-open manual interaction popover.' },
      { category: 'UX', description: 'Cloud Sync button on mobile devices transitioned cleanly to a minimal red dot attached globally to the User Profile.' }
    ]
  },
  {
    version: 'v7.4.6',
    date: '2026-06-02',
    time: '12:50:00',
    title: 'Guidebook Audio Update',
    items: [
      { category: 'UX', description: 'Added a physical page-turning sound effect when directly jumping to specific Guidebook chapters from external shortcuts.' }
    ]
  },
  {
    version: 'v7.4.5',
    date: '2026-06-02',
    time: '12:47:00',
    title: 'Guidebook Indexing Bug Fix',
    items: [
      { category: 'Bug Fix', description: 'Rebuilt Guidebook sub-chapter mapping to fix a legacy offset issue that caused buttons to load the wrong chapter.' },
      { category: 'Bug Fix', description: 'Repaired the Streak Record modal Help button so it now accurately targets the Death Defying Medal guidebook page.' }
    ]
  },
  {
    version: 'v7.4.4',
    date: '2026-06-02',
    time: '11:28:00',
    title: 'Streak Record UX Improvements',
    items: [
      { category: 'UX', description: 'The 7-Day Activity Record modal now includes an explicit reminder banner detailing if you have studied today.' },
      { category: 'UX', description: 'Added a Help icon to the Streak Repair Modules section to directly open the Guidebook.' }
    ]
  },
  {
    version: 'v7.4.3',
    date: '2026-06-02',
    time: '11:20:00',
    title: 'Streak UI Refinement',
    items: [
      { category: 'UI', description: 'Simplified the top bar streak reminder by removing the exclamation mark badge and directly turning the text and icon red if the daily session is incomplete.' }
    ]
  },
  {
    version: 'v7.4.2',
    date: '2026-06-02',
    time: '11:15:00',
    title: 'UI Polishing & Detailed Expectations',
    items: [
      { category: 'UI', description: 'Matched the top bar unread session (!)-badge to identical styling as the main system profile indicator.' },
      { category: 'UX', description: 'Experience bar tooltips on the top bar now require a direct click to toggle.' },
      { category: 'UX', description: 'Clicking the streak icon on the top bar now directly summons the 1-Week Activity Record modal.' },
      { category: 'Math', description: 'Updated reward expectation displays to explicitly note the multipliers applied by Talent A1 (Mind Lubrication) and Talent B1 (Alchemy).' }
    ]
  },
  {
    version: 'v7.4.1',
    date: '2026-06-02',
    time: '10:55:00',
    title: 'Streak & Probability Model Enhancements',
    items: [
      { category: 'UI', description: 'Added a small red exclamation mark to the top bar Streak icon to remind you to complete today\'s session.' },
      { category: 'Math', description: 'Refined Economy Expectation modal to use multi-draw occurrence probabilities combining Base stats, Pool drop tables, and Talent limits.' }
    ]
  },
  {
    version: 'v7.4.0',
    date: '2026-06-01',
    time: '16:35:00',
    title: 'Reward Economy Stats Integration',
    items: [
      { category: 'Feature', description: 'Added a mathematical expectation modal in Reward Pool Management to show expected Gold/XP values.' },
      { category: 'Math', description: 'Automatically maps setup configurations, pool items, and talent buffs to compute expected average session gains.' }
    ]
  },
  {
    version: 'v7.3.3',
    date: '2026-06-01',
    time: '16:25:00',
    title: 'Profile Avatar & Edit UI Polish',
    items: [
      { category: 'Feature', description: 'Added support for selecting a custom profile avatar from a curated list of Lucide icons.' },
      { category: 'UI', description: 'Exchanged profile edit settings icon to a Pencil-Line for better visual semantics.' }
    ]
  },
  {
    version: 'v7.3.2',
    date: '2026-06-01',
    time: '16:21:00',
    title: 'Profile Modal UI Polish',
    items: [
      { category: 'UI', description: 'Renamed the Talent attribute card to Scroll and updated the visual icon to match the broader system.' }
    ]
  },
  {
    version: 'v7.3.1',
    date: '2026-06-01',
    time: '16:15:00',
    title: 'Inventory Ledger Enhancements',
    items: [
      { category: 'Feature', description: 'Advanced logging implemented to track physical usages of Talent Scrolls, Medals, and Buff cards.' },
      { category: 'UI', description: 'Upgraded the Inventory history tabs to feature an Economy-Log style quantity modifier badge (+1/-1).' }
    ]
  },
  {
    version: 'v7.3.0',
    date: '2026-06-01',
    time: '16:04:00',
    title: 'Vault Inventory Storage System',
    items: [
      { category: 'Feature', description: 'Added an Inventory tab inside the Vault interface to track active held items.' },
      { category: 'Feature', description: 'Transformed Double Buffs into manually activated consumable items.' },
      { category: 'UX', description: 'Added item acquisition and usage historical grid.' }
    ]
  },
  {
    version: 'v7.2.0',
    date: '2026-06-01',
    time: '15:50:00',
    title: 'Profile Modal UI Cleanup',
    items: [
      { category: 'UI', description: 'Removed the redundant streak badge next to the level title in the Profile Modal.' }
    ]
  },
  {
    version: 'v7.1.13',
    date: '2026-06-01',
    time: '15:46:00',
    title: 'Streak Reminder Notification',
    items: [
      { category: 'UI', description: 'Added a highly visible notification badge directly to the Streak widget on the Profile Dashboard, displaying an exclamation mark when the daily session has not yet been completed.' }
    ]
  },
  {
    version: 'v7.1.12',
    date: '2026-06-01',
    time: '15:40:00',
    title: 'Profile Modal Next Reward Bug Fix',
    items: [
      { category: 'Bug Fix', description: 'Fixed an issue where the Profile Modal Next Reward always showed the default generic text instead of correctly calculating and displaying custom Leveling Rewards configured in settings.' },
    ]
  },
  {
    version: 'v7.1.11',
    date: '2026-06-01',
    time: '15:35:00',
    title: 'Fate Dice: Shuffler Enhancement',
    items: [
      { category: 'Feature', description: 'Upgraded the "Shuffler" talent effect from 1 daily reroll to 1 free reroll per chest draw, greatly expanding flexibility.' },
      { category: 'UI', description: 'Integrated individual reroll buttons natively into the delayed Reward Chest interface for Shuffler owners.' }
    ]
  },
  {
    version: 'v7.1.10',
    date: '2026-06-01',
    time: '15:20:00',
    title: 'Streak Timezone Bug Fix',
    items: [
      { category: 'Bug Fix', description: 'Fixed a timezone discrepancy in the streak patch system that caused patched days to incorrectly connect with mathematically shifted prior sessions, inflating the streak by +1 day incorrectly.' }
    ]
  },
  {
    version: 'v7.1.9',
    date: '2026-06-01',
    time: '15:10:00',
    title: 'Streak Modal UI Polish',
    items: [
      { category: 'UI', description: 'Removed the medal count badge from the top right corner of the Streak stat card to keep the design cleaner.' },
      { category: 'UX', description: 'In the 7-Day Activity Record, the "X" marker directly behaves as the patch button (instead of a hover menu), triggering a confirmation double-check before using a Death Defying Medal.' },
      { category: 'UI', description: 'Added the short date (MM/dd) above the weekday label in the 7-Day Activity Record.' }
    ]
  },
  {
    version: 'v7.1.8',
    date: '2026-06-01',
    time: '14:55:00',
    title: 'Streak Repair System',
    items: [
      { category: 'Feature', description: 'Transformed the Medal counter in the Profile Modal to a "Streak Status" button. Clicking the Streak badge opens an interactive 7-Day Activity Record, allowing the user to seamlessly use their "Death Defying Gold Medals" to patch manually missed days (Duolingo-style retroactive check-ins).' }
    ]
  },
  {
    version: 'v7.1.7',
    date: '2026-06-01',
    time: '14:34:00',
    title: 'Timer Bulk Advanced Configuration',
    items: [
      { category: 'Feature', description: 'In Timer Bulk Session creation, added the ability to define custom \'Focus\' and \'Rest\' durations, as well as an option to auto-calculate the appropriate number of bulk sessions directly based on a specific time range.' }
    ]
  },
  {
    version: 'v7.1.6',
    date: '2026-06-01',
    time: '14:26:00',
    title: 'Timer Bulk Session Rewards',
    items: [
      { category: 'Bug Fix', description: 'Unified the chest reward logic used during normal session clears and Timer Bulk Manage operations. Bulk added sessions will now accurately consider talent effects and limits checks.' }
    ]
  },
  {
    version: 'v7.1.5',
    date: '2026-06-01',
    time: '14:11:00',
    title: 'Ichiban Box Theme-Aware Polish',
    items: [
      { category: 'UI', description: 'Exchanged hardcoded green (emerald) styling in the Box Gacha "Ichiban" view for theme-adaptive indigo classes to maintain perfect continuity with light and dark themes.' }
    ]
  },
  {
    version: 'v7.1.4',
    date: '2026-06-01',
    time: '14:04:00',
    title: 'Shop UI Polish',
    items: [
      { category: 'UI', description: 'Made the active purchase button in the Merchant Shop much more prominent with solid theme colors, dynamic scale hovers, and shadows when items are affordable.' }
    ]
  },
  {
    version: 'v7.1.3',
    date: '2026-05-24',
    time: '15:10:00',
    title: 'Ichiban Box Gacha UI Polish',
    items: [
      { category: 'UI', description: 'Aligned the "Ichiban" section of the shop with the recent Gacha View redesign, expanding it into a complete two-column layout with a highly visual aesthetic.' },
      { category: 'UI', description: 'Improved visibility of prize quantity, lineup structure, and integrated themed accent styling to better differentiate standard rewards from the \'Last One\' prize.' }
    ]
  },
  {
    version: 'v7.1.2',
    date: '2026-05-24',
    time: '14:58:00',
    title: 'Gacha Summoning UI Polish',
    items: [
      { category: 'UI', description: 'Increased the size of Draw 1x and Draw 10x buttons in the Gacha View for better accessibility.' },
      { category: 'UI', description: 'Fixed an issue in the Summoning Results screen where element cards overlapped across screens by introducing dynamic scaling and adaptive aspect ratios.' }
    ]
  },
  {
    version: 'v7.1.1',
    date: '2026-05-24',
    time: '14:52:00',
    title: 'Gacha View Redesign',
    items: [
      { category: 'UI', description: 'Redesigned the Gacha view for better aesthetics, placing the visual draw interface on the left and prominently displaying precise pool probabilities and contents on the right side.' }
    ]
  },
  {
    version: 'v7.1.0',
    date: '2026-05-24',
    time: '14:20:00',
    title: 'Merchant Shop Shelf UX Redesign',
    items: [
      { category: 'UI', description: 'Redesigned the Merchant Shop display to a minimalistic, flat shelf aesthetic, adapting seamlessly to active themes.' }
    ]
  },
  {
    version: 'v7.0.12',
    date: '2026-05-24',
    time: '14:10:00',
    title: 'Vault UI Clean up',
    items: [
      { category: 'UI', description: 'Removed legacy explicit quantity displays (x100) for "Double Coins" or "Double XP" items in the Reward History table.' }
    ]
  },
  {
    version: 'v7.0.11',
    date: '2026-05-24',
    time: '14:03:00',
    title: 'Top Bar & PIP Time-Based Support',
    items: [
      { category: 'Feature', description: 'Top Bar and Picture-in-Picture window active dungeon progress bar now natively display requirements correctly when "Compute Tasks by Time" is enabled.' }
    ]
  },
  {
    version: 'v7.0.10',
    date: '2026-05-24',
    time: '13:58:00',
    title: 'Settings UI Refinement',
    items: [
      { category: 'UI', description: 'Extracted "Compute Tasks by Time" functionality into a dedicated standalone section with a proper header in the General Settings page for better discoverability.' }
    ]
  },
  {
    version: 'v7.0.9',
    date: '2026-05-24',
    time: '13:51:00',
    title: 'Chestbox Auto-Pick Summary',
    items: [
      { category: 'Feature', description: 'In the pending Reward Chest, clicking "Auto-Pick Best" now displays an organized summary modal detailing all rewards obtained, instead of immediately closing.' },
      { category: 'UI', description: 'Added a shortcut button in the Auto-Pick Summary to directly jump to the Vault screen.' }
    ]
  },
  {
    version: 'v7.0.8',
    date: '2026-05-24',
    time: '13:45:00',
    title: 'Chestbox Reward Limit Display',
    items: [
      { category: 'UI', description: 'Added reward frequency limit display to the cards within the pending Reward Chest modal to match the standard victory interface.' }
    ]
  },
  {
    version: 'v7.0.7',
    date: '2026-05-24',
    time: '13:40:00',
    title: 'Chestbox Loot Limit Fix',
    items: [
      { category: 'Bug Fix', description: 'Rewards with usage limits (e.g., 1 per day) will now correctly factor in occurrences where they have been drawn but are sitting unchosen inside the pending Reward Chest.' }
    ]
  },
  {
    version: 'v7.0.6',
    date: '2026-05-18',
    time: '11:15:00',
    title: 'Routine Refresh Logic Update',
    items: [
      { category: 'Bug Fix', description: 'Routine Tasks (Tiers/Expeditions) now actively reset their session progress recursively to 0 during cyclic refreshes even if the goal was not completed in the prior cycle. Previously, only "completed" status routines would reset their progress.' }
    ]
  },
  {
    version: 'v7.0.5',
    date: '2026-05-17',
    time: '23:05:00',
    title: 'Time-Based Reward Multipliers',
    items: [
      { category: 'Feature', description: 'In Time-Based mode, completing a focus session that is a multiple of the standard session size now triggers the reward generation recursively, granting multiple reward chests at once.' },
      { category: 'UI', description: 'Updated the "End of the Day" rest prompt to accurately display the Daily Progress tracker in time format when Time-Based mode is active.' }
    ]
  },
  {
    version: 'v7.0.4',
    date: '2026-05-17',
    time: '22:50:00',
    title: 'Time-Based Progress Synchronization Fix',
    items: [
      { category: 'Bug Fix', description: 'Fixed the underlying `dailySessions` state calculation for Time-Based Mode, ensuring that real-time timer durations accurately translate into proportional dashboard progress, instead of only counting single physical sessions.' }
    ]
  },
  {
    version: 'v7.0.3',
    date: '2026-05-17',
    time: '22:45:00',
    title: 'Delete Session Fix',
    items: [
      { category: 'Bug Fix', description: 'Replaced native window.confirm with custom ConfirmModal in Recent Sessions. This fixes an issue where the delete session button failed to execute due to restricted environment policies.' }
    ]
  },
  {
    version: 'v7.0.2',
    date: '2026-05-17',
    time: '22:30:00',
    title: 'Limited Mental Effort Mode',
    items: [
      { category: 'Feature', description: 'Added a "Limited Mental Effort Mode" toggle in General Settings. When enabled, reaching the Daily Progress Goal automatically replaces the timer interface with an "End the Day" prompt, actively preventing further sessions and encouraging rest.' }
    ]
  },
  {
    version: 'v7.0.1',
    date: '2026-05-17',
    time: '22:08:00',
    title: 'Daily Progress Synchronization',
    items: [
      { category: 'Bug Fix', description: 'Fixed an issue where deleting a session from Explore (Recent Sessions) failed to synchronize and decrement the Daily Progress bar on the Dashboard.' },
      { category: 'Data Sync', description: 'When a session is manually deleted, the system now automatically retracts the Gold and XP earned from that session, and removes any unredeemed chest rewards associated with it without penalizing the current level.' }
    ]
  },
  {
    version: 'v7.0.0',
    date: '2026-05-17',
    time: '21:37:00',
    title: 'Time-Based Sessions Calculation',
    items: [
      { category: 'Feature', description: 'Added "Time-Based Calculation" settings under General Settings. When enabled, task requirements and rewards scales are converted from fixed session numbers to time equivalents using a customizable standard session duration.' },
      { category: 'Feature', description: 'Dungeons now natively present target times (e.g. 75 mins instead of 3 sessions).' },
      { category: 'UI', description: 'The Stats layout and Record dashboard have been updated to present Tasks and Sessions in calculated minutes.' }
    ]
  },
  {
    version: 'v6.12.4',
    date: '2026-05-17',
    time: '09:00:00',
    title: 'Heatmap Range Configuration',
    items: [
      { category: 'Feature', description: 'Added the ability to customize the heatmap saturation range in Settings -> General, supporting both [0-8] and [0-16] modes for users with higher daily session counts.' }
    ]
  },
  {
    version: 'v6.12.3',
    date: '2026-05-16',
    time: '11:51:00',
    title: 'Timer Loop Progression Fix',
    items: [
      { category: 'Bug Fix', description: 'Fixed a bug where the timer would halt at 0:00 instead of automatically progressing to the resting phase or next loop when a focus session concluded.' },
    ]
  },
  {
    version: 'v6.12.2',
    date: '2026-05-16',
    time: '11:41:00',
    title: 'Vault UI Refinement',
    items: [
      { category: 'UI', description: 'Removed the Gold Earned, Gold Spent, and XP Earned statistics from the Economy Log banner to streamline the interface.' },
    ]
  },
  {
    version: 'v6.12.1',
    date: '2026-05-16',
    time: '11:40:00',
    title: 'Vault UI Consolidation',
    items: [
      { category: 'UI', description: 'Consolidated the Reward Vault and Economy Log navigation into a single unified tab row to optimize screen space and improve overall Vault coherence.' },
    ]
  },
  {
    version: 'v6.12.0',
    date: '2026-05-16',
    time: '11:27:00',
    title: 'Economy Transaction Log',
    items: [
      { category: 'Feature', description: 'Added an Economy Log module to the Vault page, tracking every single Gold Coin and XP acquisition and expenditure to ensure complete visibility into resource flow.' },
      { category: 'Architecture', description: 'Implemented a robust centralized transaction methodology in the game state to ensure no economy modifications can slip past the logging system.' }
    ]
  },
  {
    version: 'v6.11.6',
    date: '2026-05-16',
    time: '07:54:00',
    title: 'Sage AI Light Theme & Output Enhancements',
    items: [
      { category: 'UI', description: 'Optimized Sage AI persona selector and interactable plan modifier forms specifically for light themes by replacing theme-agnostic styling with context-aware coloring.' },
      { category: 'Feature', description: 'Added "Help me create tasks" as a standard default preset prompt within the Sage AI library.' },
      { category: 'Fix', description: 'AI-generated task plans now accurately embed their Total Rooms (`sessions`) metric into the generated output structures instead of defaulting to 1.' }
    ]
  },
  {
    version: 'v6.11.5',
    date: '2026-05-16',
    time: '07:46:00',
    title: 'Reward Tag Display Fix',
    items: [
      { category: 'Fix', description: 'Resolved an issue where Dungeon reward tags of type "Item" or "Custom Text" were not displaying in the list.' }
    ]
  },
  {
    version: 'v6.11.4',
    date: '2026-05-16',
    time: '07:42:00',
    title: 'ReferenceError Bug Fix',
    items: [
      { category: 'Fix', description: 'Resolved Uncaught ReferenceError: applyExpeditionPlan is not defined in the Sage AI consult modal.' }
    ]
  },
  {
    version: 'v6.11.3',
    date: '2026-05-16',
    time: '07:35:00',
    title: 'Sage AI Interactive Chat Controls',
    items: [
      { category: 'Feature', description: 'Added an inline Identity Selector directly above the Sage AI chat input for seamless persona switching (Sage, Friend, Master).' },
      { category: 'Feature', description: 'Added an explicit "Modify Mode" toggle. AI configuration schemas will now only render as interactive game modifier widgets if this mode is enabled, preventing accidental state changes.' },
      { category: 'Fix', description: 'Re-wrote JSON response block parsing from the ground up to aggressively strip markdown tags and ensure expedition configuration elements always render reliably even when AI incorrectly formats code blocks.' }
    ]
  },
  {
    version: 'v6.11.2',
    date: '2026-05-16',
    time: '07:29:00',
    title: 'Sage AI Master Persona',
    items: [
      { category: 'Feature', description: 'Added "Master" personality mode to Sage AI settings. Forms a strict, highly analytical game master persona to help accurately plan tasks and adjust balance settings logically.' }
    ]
  },
  {
    version: 'v6.11.1',
    date: '2026-05-16',
    time: '04:22:00',
    title: 'Sage JSON Render Reliability',
    items: [
      { category: 'Fix', description: 'Improved the fallback JSON parsing engine within the chat interface, ensuring that interactive planners and balance setters always render properly even when AI omits code-block language tags.' },
      { category: 'Feature', description: 'Added direct configuration rules for \'sessions\' requirement values in Expedition Planners, allowing users to modify them natively.' }
    ]
  },
  {
    version: 'v6.11.0',
    date: '2026-05-16',
    time: '04:10:00',
    title: 'Sage AI Interactive Task Automation',
    items: [
      { category: 'Feature', description: 'The Sage AI chat can now directly generate fully-configured Expedition Plans including titles, descriptions, goals, and multiple reward tiers based on natural language requests.' },
      { category: 'Feature', description: 'Added ExpeditionPlanPreview component that intercepts JSON payloads from Sage and renders them natively as an interactive, editable table within the chat interface.' },
      { category: 'Feature', description: 'Users can freely customize the AI\'s proposed tiers, rewards, and requirements before clicking "Accept", which automatically maps and constructs the parent MajorDungeon and child Dungeon entries directly into the active state.' },
      { category: 'Feature', description: 'Sage AI can also dynamically adjust global economy balance settings via interactive embedded chat UI components.' },
      { category: 'Prompt Polish', description: 'Overhauled the hidden system prompt inside sageService.ts to strictly enforce markdown JSON outputs matching the expedition_plan syntax schema.' }
    ]
  },
  {
    version: 'v6.10.8',
    date: '2026-05-16',
    time: '03:18:00',
    title: 'Stats Chart Alignment',
    items: [
      { category: 'UI', description: 'Aligned the maximum height of the Weekly bar chart with the Daily bar chart for visual consistency across the Record dashboard.' }
    ]
  },
  {
    version: 'v6.10.7',
    date: '2026-05-16',
    time: '03:14:00',
    title: 'Stats Today Button Refinement',
    items: [
      { category: 'UI', description: 'Replaced the "TODAY" text buttons in the Record dashboard\'s Daily and Weekly modules with a compact "Return" (RotateCcw) icon to further conserve horizontal space.' }
    ]
  },
  {
    version: 'v6.10.6',
    date: '2026-05-16',
    time: '03:10:00',
    title: 'Stats Controls Polish',
    items: [
      { category: 'UI', description: 'Consolidated the "Natural" and "Last 7d" Weekly date mode selectors into a single dropdown component, drastically reducing horizontal space usage.' },
      { category: 'UI', description: 'Narrowed the width of the Weekly date selector specifically to optimize for smaller tablet screens.' }
    ]
  },
  {
    version: 'v6.10.5',
    date: '2026-05-16',
    time: '03:04:00',
    title: 'Stats Controls Polish',
    items: [
      { category: 'UI', description: 'Aligned the font size CSS classes for the Weekly module\'s date selector to perfectly match the Daily module.' }
    ]
  },
  {
    version: 'v6.10.4',
    date: '2026-05-16',
    time: '03:00:00',
    title: 'Stats Controls Optimization',
    items: [
      { category: 'UI', description: 'Refined the styling and dimensions of the Daily and Weekly controls in the Record dashboard to prevent overflow and ensure a cohesive view on mobile/tablet.' }
    ]
  },
  {
    version: 'v6.10.3',
    date: '2026-05-16',
    time: '02:49:00',
    title: 'Top Bar Coloring Bug Fix',
    items: [
      { category: 'Bug Fix', description: 'Removed globally invasive sm:bg-indigo-600 theme overrides from index.css that were forcefully coloring mobile narrow-screen level text as pure white instead of matching the adaptive theme-colors of the other elements in the top bar.' }
    ]
  },
  {
    version: 'v6.10.2',
    date: '2026-05-16',
    time: '02:40:00',
    title: 'Top Bar Adaptive Coloring',
    items: [
      { category: 'UI', description: 'Reverted level text color on narrow screens to uniquely inherit theme-aware styling similarly to other attributes, whilst retaining purely white coloration specifically on wide screens.' }
    ]
  },
  {
    version: 'v6.10.1',
    date: '2026-05-16',
    time: '02:37:00',
    title: 'Top Bar Mobile & Wide UI Refinement',
    items: [
      { category: 'UI', description: 'Fixed Level Label (LV) to use text-black-pure on narrow screens and text-white-pure on wide screens.' },
      { category: 'Architecture', description: 'Added .text-black-pure global utility in index.css.' }
    ]
  },
  {
    version: 'v6.10.0',
    date: '2026-05-16',
    time: '03:10:00',
    title: 'Advanced Multi-Named Preset System',
    items: [
      { category: 'Feature', description: 'Overhauled the Preset system to support multiple named configurations for Expeditions, Tiers, Quests, and Achievements.' },
      { category: 'UI', description: 'Centralized preset management into a unified "PresetControl" component integrated into the banner of all creation modals.' },
      { category: 'UX', description: 'Enhanced Auto-Load functionality to reliably apply the specific active preset designated by the user upon modal opening.' }
    ]
  },
  {
    version: 'v6.9.4',
    date: '2026-05-16',
    time: '02:30:00',
    title: 'Top Bar UI Persistence Fix',
    items: [
      { category: 'Bug Fix', description: 'Resolved CSS specificity conflict in index.css ensuring Level Label remains white on wide screens.' },
      { category: 'UI', description: 'Decoupled Level Label font color from global top bar theme defaults.' }
    ]
  },
  {
    version: 'v6.9.3',
    date: '2026-05-16',
    time: '02:28:00',
    title: 'UI Branding & Icon Polish',
    items: [
      { category: 'UI', description: 'Applied .text-white-pure to the main settings icon in the About screen to ensure it remains white across all themes.' },
      { category: 'UI', description: 'Optimized level badge color logic to use global white utility.' }
    ]
  },
  {
    version: 'v6.9.2',
    date: '2026-05-16',
    time: '02:26:00',
    title: 'Level Label UI Polish',
    items: [
      { category: 'Architecture', description: 'Added .text-white-pure global utility in index.css to bypass theme-aware color overrides.' },
      { category: 'UI', description: 'Fixed Level Label (LV) in Top Bar to use pure white color on wide screens across all themes (daylight, warm sun, candy).' },
      { category: 'UI', description: 'Retained theme-aware adaptive coloring for the Level Label on mobile for optimal legibility.' }
    ]
  },
  {
    version: 'v6.9.1',
    date: '2026-05-16',
    time: '02:03:00',
    title: 'Level Label Polish',
    items: [
      { category: 'UI', description: 'Fixed Level Label (LV) to ensure it is always solid white and opaque on light themes (daylight, warm sun, candy) for wide screens.' }
    ]
  },
  {
    version: 'v6.9.0',
    date: '2026-05-15',
    time: '16:57:00',
    title: 'Preset System & iOS Fix',
    items: [
      { category: 'Feature', description: 'Added "Save Preset", "Load", and "Auto-Load" functionality for Expedition Goals, Tiers, Quests, and Achievements creation forms.' },
      { category: 'Bug Fix', description: 'Resolved iOS-specific input state issue preventing reward editing during initial item creation.' }
    ]
  },
  {
    version: 'v6.8.24',
    date: '2026-05-15',
    time: '16:46:00',
    title: 'Top Bar Mobile UX Polish',
    items: [
      { category: 'UI', description: 'Optimized the Top Bar for small mobile screens by conditionally hiding the streak days indicator, converting the XP Bar layout below the level badge, and simplifying the Level badge\'s CSS styling.' }
    ]
  },
  {
    version: 'v6.8.23',
    date: '2026-05-15',
    time: '16:45:00',
    title: 'Dungeon Tiers Preset & iOS UX Fix',
    items: [
      { category: 'Feature', description: 'Added "Save Preset" functionality when creating Dungeon Tiers, allowing users to save their favorite configurations (e.g., standard 20 rooms, 200 coin reward).' },
      { category: 'Feature', description: 'Added an "Auto-Load" capability that, when enabled, seamlessly applies your saved preset every time you create a new tier.' },
      { category: 'Bug Fix', description: 'Fixed a critical iOS / Edge bug where modifying reward items while creating a new tier directly edited the parent expedition state, rendering the inputs seemingly frozen.' }
    ]
  },
  {
    version: 'v6.8.22',
    date: '2026-05-15',
    time: '16:32:00',
    title: 'Routine Reset Synchronization',
    items: [
      { category: 'Logic', description: 'Routine expeditions now strictly align to the custom reset time defined in Settings, rather than standard midnight rollovers.' },
      { category: 'Logic', description: 'Completing a routine task during late-night crossover hours (e.g. 03:00 AM) now properly credits the previous calendar day instead of prematurely checking off the next day.' },
      { category: 'UI', description: 'Dungeon UI refresh schedule badges now correctly display the logical day calculated against your custom night-end offset.' }
    ]
  },
  {
    version: 'v6.8.21',
    date: '2026-05-15',
    time: '14:58:00',
    title: 'Mobile PWA Background Precision',
    items: [
      { category: 'Architecture', description: 'Implemented a continuous HTML5 silent audio track that guarantees JavaScript execution on mobile devices when the PWA is backgrounded or the screen is locked.' },
      { category: 'Bug Fix', description: 'Solved the issue where Timer notifications would not deliver until the player reopened the Web App by forcing background wake-locks via the audio stream.' },
      { category: 'Feature', description: 'Active timers will now display natively on your lock screen using the Media Session API!' }
    ]
  },
  {
    version: 'v6.8.20',
    date: '2026-05-15',
    time: '14:31:00',
    title: 'Timer Progression Sync',
    items: [
      { category: 'Bug Fix', description: 'Fixed an issue where the timer would wait at 0:00 for reward selection. The timer now automatically jumps to the next state (Resting/Focus) even while the reward modal stays open for you to pick an item on your own time.' }
    ]
  },
  {
    version: 'v6.8.19',
    date: '2026-05-15',
    time: '13:35:00',
    title: 'Routine Tracker Dashboard',
    items: [
      { category: 'Feature', description: 'Added a "Routine Tracker" matrix module to the Record interface placed precisely above the Heatmap to display daily/monthly completion progress for all Routine-tagged Expeditions.' },
      { category: 'UX', description: 'Tier configuration now directly exposes the "Routine Expedition" toggle previously only available on parent goals.' }
    ]
  },
  {
    version: 'v6.8.18',
    date: '2026-05-15',
    time: '13:22:00',
    title: 'Routine Expeditions Detail',
    items: [
      { category: 'Feature', description: 'Expanded "Routine" configuration to allow individual Tiers (sub-dungeons) to have routine intervals indepedent of their Expedition Goal.' },
      { category: 'UI', description: 'The refresh schedule dates (M/D) are now explicitly displayed alongside the routine badges for Daily, Weekly, and Monthly intervals.' }
    ]
  },
  {
    version: 'v6.8.17',
    date: '2026-05-15',
    time: '12:44:00',
    title: 'Routine Expeditions',
    items: [
      { category: 'Feature', description: 'Added "Routine" configuration when creating or editing an Expedition Goal. Routine expeditions reset their tier progress recursively on a daily, weekly, or monthly interval to allow replayable challenges and repeated rewards.' }
    ]
  },
  {
    version: 'v6.8.16',
    date: '2026-05-15',
    time: '12:30:00',
    title: 'UI Polish & Convenience Enhancements',
    items: [
      { category: 'UI', description: 'Updated the color of "Talent Scrolls" icons globally from purple to emerald green for better theme consistency.' },
      { category: 'UX', description: 'In the Dungeons view, creating a new expedition or tier now automatically defaults to 100 Coins for the Completion Reward, avoiding an empty initial state.' }
    ]
  },
  {
    version: 'v6.8.15',
    date: '2026-05-15',
    time: '12:22:00',
    title: 'UI Stability & Error Handling Polish',
    items: [
      { category: 'Bug Fix', description: 'Resolved a React warning regarding uncontrolled inputs changing to controlled states during item/quest editing by enforcing explicit string fallbacks (value || "").' },
      { category: 'Bug Fix', description: 'Suppressed expected NotSupportedError playback failures for missing page-flip.mp3 files in environments where audio is disabled or absent.' }
    ]
  },
  {
    version: 'v6.8.14',
    date: '2026-05-15',
    time: '12:15:00',
    title: 'Disable Sub/Parent Transference',
    items: [
      { category: 'UX/Fix', description: 'Completely disabled the functionality to transfer items between major and sub-levels via dragging. Drag and drop now strictly focuses on simple list reordering to stabilize the application and prevent potential data state losses.' }
    ]
  },
  {
    version: 'v6.8.13',
    date: '2026-05-15',
    time: '11:40:00',
    title: 'Dungeons Drag & Drop Stability',
    items: [
      { category: 'Bug Fix', description: 'Resolved a critical bug where dragging one dungeon item into another caused the item to be "swallowed" and disappear. Implementing strictly functional state updates fixes conflicts between drag state and list reordering UI states.' },
      { category: 'UI', description: 'Corrected the icon for Talent Scrolls rewards in the Expedition view to properly display a Scroll instead of a Trophy.' }
    ]
  },
  {
    version: 'v6.8.12',
    date: '2026-05-15',
    time: '11:27:00',
    title: 'Fullscreen UX & WakeLock Support',
    items: [
      { category: 'Feature', description: 'Added Screen WakeLock support to prevent the device from sleeping during fullscreen sessions.' },
      { category: 'Feature', description: 'Screen orientation is dynamically unlocked during fullscreen, allowing landscape viewing natively on mobile.' },
      { category: 'UI', description: 'Overhauled mobile landscape fullscreen layout. Rescaled main timer module and relocated progress UI to bottom to prevent vertical overflow issues.' },
      { category: 'UI', description: 'Adjusted narrow screen portrait layout for the fullscreen progress bar. Ensures right-edge spacing prevents overlap with the Exit Fullscreen button.' }
    ]
  },
  {
    version: 'v6.8.11',
    date: '2026-05-15',
    time: '11:15:00',
    title: 'Top Bar Polish',
    items: [
      { category: 'UI', description: 'Unified icon sizes across the top bar. Adapted the Sync button to remove bulky padding, syncing its dimensions with standard info indicators.' },
      { category: 'UX', description: 'Fixed top bar streak text to use proper pluralization ("Days" vs "Day").' }
    ]
  },
  {
    version: 'v6.8.10',
    date: '2026-05-15',
    time: '10:48:00',
    title: 'Nomenclature & Iconography Update',
    items: [
      { category: 'Terminology', description: 'Renamed "Talent Points" mathematically to "Talent Scrolls" across all UI, settings, and quest reward tables.' },
      { category: 'UI', description: 'Updated the icon for Talent Scrolls from a Star to a Scroll, and altered Talent Shards to a Puzzle icon to better fit the fantasy aesthetic.' }
    ]
  },
  {
    version: 'v6.8.9',
    date: '2026-05-15',
    time: '09:41:00',
    title: 'UI Consistency',
    items: [
      { category: 'UI', description: 'Updated the CSS styling of the "Quest History" view to match the modernized "Quest Board" styling for a cohesive interface.' },
      { category: 'UI', description: 'Exchanged standard Zap icons in rewards rendering to Star globally when referencing "Talent Points" for clarity.' }
    ]
  },
  {
    version: 'v6.8.8',
    date: '2026-05-15',
    time: '08:10:00',
    title: 'Sage AI Output & Performance Enhancements',
    items: [
      { category: 'Feature', description: 'Implemented capability to cancel ongoing AI consultations if the Sage is taking too long.' },
      { category: 'UI', description: 'Collapsible thought process for "reasoning" models like DeepSeek to reduce clutter in chat history.' }
    ]
  },
  {
    version: 'v6.8.7',
    date: '2026-05-15',
    time: '07:33:00',
    title: 'Background Timer & Notification Precision',
    items: [
      { category: 'Architecture', description: 'Delegated timer countdowns to a dedicated Web Worker to prevent browser throttling when the PWA is in the background.' },
      { category: 'Feature', description: 'Added high urgency flag to Web Push notifications to bypass mobile OS battery-saver deferrals.' }
    ]
  },
  {
    version: 'v6.8.6',
    date: '2026-05-14',
    time: '17:05:00',
    title: 'Audio Error Handling Refinement',
    items: [
      { category: 'Bug Fix', description: 'Improved audio playback error handling to silence expected browser autoplay policy errors.' }
    ]
  },
  {
    version: 'v6.8.5',
    date: '2026-05-14',
    time: '17:03:00',
    title: 'Guidebook Scrollbar Refinement',
    items: [
      { category: 'UI', description: 'Improved visibility of \'Pro Tip\' headers in the Talent System guidebook page by updating text color to theme-aware variables.' }
    ]
  },
  {
    version: 'v6.8.4',
    date: '2026-05-14',
    time: '16:58:00',
    title: 'Talent System Navigation Fix',
    items: [
      { category: 'Bug Fix', description: 'Fixed Talent System button in dashboard to point to the correct guidebook page.' }
    ]
  },
  {
    version: 'v6.8.3',
    date: '2026-05-14',
    time: '16:55:00',
    title: 'Dashboard UI Polish',
    items: [
      { category: 'UX', description: 'Removed redundant "GUIDE" label from Guidebook buttons on the dashboard for a cleaner interface.' }
    ]
  },
  {
    version: 'v6.8.2',
    date: '2026-05-14',
    time: '16:52:00',
    title: 'Talent Color Polish',
    items: [
      { category: 'UI', description: 'Brightened Talent System blue colors for improved visibility in Night, Forest, and Ocean themes.' }
    ]
  },
  {
    version: 'v6.8.1',
    date: '2026-05-14',
    time: '16:50:00',
    title: 'Talent System Interaction Polish',
    items: [
      { category: 'UI', description: 'Updated Talent System icons and text to use theme-aware CSS variables, ensuring high visibility in all dark and light themes.' }
    ]
  },
  {
    version: 'v6.8.0',
    date: '2026-05-14',
    time: '16:45:00',
    title: 'Themed Wisdom & Interaction Polish',
    items: [
      { category: 'Feature', description: 'Implemented comprehensive Guidebook theming for NIGHT, FOREST, and OCEAN; solid dark backgrounds with light mystical typography.' },
      { category: 'UX', description: 'Enhanced Daily Sessions modal with permanently visible action buttons for better accessibility and touch support.' },
      { category: 'UI', description: 'Removed redundant "Daily Record" buttons from chart tooltips to streamline the interaction flow.' },
      { category: 'Visual', description: 'Polished book cover and spine aesthetics across all themes for improved immersion.' }
    ]
  },
  {
    version: 'v6.7.2',
    date: '2026-05-14',
    time: '16:35:00',
    title: 'Interaction & Type Integrity',
    items: [
      { category: 'UX', description: 'Removed redundant "Daily Record" navigation button from chart tooltips to streamline interaction.' },
      { category: 'Fix', description: 'Hardened StudySession type definitions and resolved linting warnings in the daily sessions component.' }
    ]
  },
  {
    version: 'v6.7.1',
    date: '2026-05-14',
    time: '16:32:00',
    title: 'Chart Tooltip Optimization',
    items: [
      { category: 'UX', description: 'Removed redundant "Daily Record" navigation button from chart tooltips to streamline the interaction flow in the Record dashboard.' }
    ]
  },
  {
    version: 'v6.7.0',
    date: '2026-05-14',
    time: '16:30:00',
    title: 'Period-Aware Sessions Modal',
    items: [
      { category: 'Feature', description: 'Daily chart segments now open sessions modal filtered by Morning/Afternoon/Night.' },
      { category: 'UI', description: 'Added chronological sorting (Morning to Night) and period separators matching Recent Sessions CSS.' },
      { category: 'Logic', description: 'Improved session retrieval using calculated daily boundaries (assignedDate) for consistency with charts.' }
    ]
  },
  {
    version: 'v6.6.1',
    date: '2026-05-14',
    time: '16:22:00',
    title: 'Daily Sessions Modal Refinement',
    items: [
      { category: 'UI', description: 'Modified session action buttons to be permanently visible instead of hover-only for improved accessibility and touch support.' }
    ]
  },
  {
    version: 'v6.6.0',
    date: '2026-05-14',
    time: '16:15:00',
    title: 'Daily Session Modal & UX Synchronization',
    items: [
      { category: 'Feature', description: 'Implemented "Daily Sessions Modal" in the Record (Stats) interface; inspect sessions without tab switching.' },
      { category: 'UI', description: 'Modal design synchronized with Recent Sessions table CSS while providing localized editing and deletion.' },
      { category: 'UX', description: 'Enhanced chart interaction flow to prevent loss of scroll position and context in the dashboard.' }
    ]
  },
  {
    version: 'v6.5.2',
    date: '2026-05-14',
    time: '15:55:00',
    title: 'Touch & Navigation Refinement',
    items: [
      { category: 'Fix', description: 'Fixed navigation anchor bug: Clicking "view sessions record" in the Record chart now correctly scrolls to the target table.' },
      { category: 'Fix', description: 'Fixed touch scrolling issues: Adjusted global overscroll behavior and Recharts tooltip pointer events to ensure smooth page sliding on mobile.' },
      { category: 'UX', description: 'Refined tooltip interactivity: Improved button hitboxes and click detection for chart bubbles on touch devices.' }
    ]
  },
  {
    version: 'v6.5.1',
    date: '2026-05-14',
    time: '15:45:00',
    title: 'Startup Performance Optimization',
    items: [
      { category: 'Perf', description: 'Eliminated the "white flash" on startup by implementing inline background styles and PWA splash screen sync.' },
      { category: 'UX', description: 'Added auto-save to Daily Record reflections to prevent data loss when switching dates or closing the editor.' }
    ]
  },
  {
    version: 'v6.5.0',
    date: '2026-05-14',
    time: '15:35:00',
    title: 'Interactive Navigation & Calculator Polish',
    items: [
      { category: 'UX', description: 'Implemented cross-section navigation: clicking a daily chart segment now jumps specifically to that day\'s filtered session list in the Record table.' },
      { category: 'Feature', description: 'Enhanced calculators with detailed help tooltips and a master metric overview for better visibility into earning multipliers.' },
      { category: 'UI', description: 'Optimized Dashboard layout: aligned Oracle\'s Insight module height with existing guides for a balanced wide-screen aesthetic.' },
      { category: 'Bug Fix', description: 'Fixed audio context errors on mobile/iframes by implementing aggressive resume-on-gesture logic.' },
      { category: 'Documentation', description: 'Created FEATURES.md to introduce the application\'s extensive mystical and technical capabilities.' }
    ]
  },
  {
    version: 'v6.4.2',
    date: '2026-05-14',
    time: '15:21:00',
    title: 'Daily Record Auto-Save',
    items: [
      { category: 'UX', description: 'Implemented auto-save for reflections; switching dates or closing the editor now automatically persists changes.' }
    ]
  },
  {
    version: 'v6.4.1',
    date: '2026-05-14',
    time: '14:55:00',
    title: 'Calculator Insights & Targeted Shop',
    items: [
      { category: 'Feature', description: 'Added a help button to the calculator to display all underlying multipliers and constant values.' },
      { category: 'Feature', description: 'Implemented Targeted Shop Calculation: users can now select a specific item to calculate exact session and day requirements.' },
      { category: 'UI', description: 'Moved the Goal selector to the bottom of the section and added help details to all modules.' }
    ]
  },
  {
    version: 'v6.4.0',
    date: '2026-05-14',
    time: '14:30:00',
    title: 'Version 6.4.0 Milestone',
    items: [
      { category: 'Milestone', description: 'Upgraded system version to 6.4.0.' }
    ]
  },
  {
    version: 'v6.3.20',
    date: '2026-05-14',
    time: '13:28:00',
    title: 'Immersive Reflection Unification',
    items: [
      { category: 'Architecture', description: 'Extracted the Immersive Reflection modal into a shared component to ensure parity between the Record dashboard and the End of Day summary screen.' }
    ]
  },
  {
    version: 'v6.3.19',
    date: '2026-05-14',
    time: '13:17:00',
    title: 'iOS Touch & Tooltip Refinement',
    items: [
      { category: 'Bug Fix', description: 'Fixed tooltip dismissal and unresponsiveness on mobile devices by securely deferring DOM mutations during the event capture phase.' }
    ]
  },
  {
    version: 'v6.3.18',
    date: '2026-05-14',
    time: '13:13:00',
    title: 'Immersive Reflection',
    items: [
      { category: 'Feature', description: 'Added a fullscreen edit mode for daily reflections, providing a distraction-free writing experience.' }
    ]
  },
  {
    version: 'v6.3.17',
    date: '2026-05-14',
    time: '13:09:00',
    title: 'iOS Touch Interaction Bug Fix',
    items: [
      { category: 'Bug Fix', description: 'Resolved double-tap requirement for navigation and interactions on iOS touch devices by optimising event handling in the Stats interface.' }
    ]
  },
  {
    version: 'v6.3.16',
    date: '2026-05-14',
    time: '12:57:00',
    title: 'UI Decoupling: Oracle Insight Icon',
    items: [
      { category: 'UI', description: 'Removed the icon to the left of "Oracle\'s Insight" in the Dashboard for a cleaner layout.' }
    ]
  },
  {
    version: 'v6.3.15',
    date: '2026-05-14',
    time: '12:50:00',
    title: 'English Default Prompts',
    items: [
      { category: 'UX', description: 'Translated the default Sage prompts from Chinese to English per user request.' }
    ]
  },
  {
    version: 'v6.3.14',
    date: '2026-05-14',
    time: '12:15:00',
    title: 'Input Box Readability & Complete Theme Inversion Fix',
    items: [
      { category: 'UX', description: 'Fixed unreadable text in the input box for AI consultation interfaces by using appropriate light/dark indigo variants instead of the inverted white/slate palette.' },
      { category: 'UI', description: 'Replaced `bg-white` and hardcoded colors across prompt selectors and inputs to ensure high contrast in daylight, warm, and candy themes.' }
    ]
  },
  {
    version: 'v6.3.13',
    date: '2026-05-14',
    time: '12:05:00',
    title: 'Sage Light Theme Background Sync',
    items: [
      { category: 'UI', description: 'Synchronized the AI chat main message area background to exactly match the sidebar background (`bg-indigo-50`) in all light themes for improved consistency.' }
    ]
  },
  {
    version: 'v6.3.12',
    date: '2026-05-14',
    time: '11:58:00',
    title: 'Sage UI Full-Spectrum Theme Fix',
    items: [
      { category: 'Architecture', description: 'Overhauled global index.css to provide the full spectrum of theme-aware indigo variables (50 to 950), ensuring light theme accents correctly adapt to Warm and Candy palettes instead of defaulting to blue/purple.' },
      { category: 'UI', description: 'Polished Sage\'s Council modal sidebar, banner, and message bubbles directly observing Dark/Light system preferences.' },
      { category: 'UX', description: 'Implemented transparency logic (`bg-[color]/10`) for all AI interaction components in dark mode, fulfilling deep aesthetic contrast rules.' }
    ]
  },
  {
    version: 'v6.3.11',
    date: '2026-05-14',
    time: '11:45:00',
    title: 'Sage Interface Complete Theme Synchronization',
    items: [
      { category: 'UI', description: 'Stripped the hardcoded standard "emerald" colors from the entire Sage\'s Council and Advice settings.' },
      { category: 'UI', description: 'Replaced these colors with theme-aware variables (handled via "indigo" aliases in Tailwind), ensuring the AI interface beautifully adapts to "Warm", "Candy", "Ocean", and other selected themes.' },
      { category: 'UI', description: 'Fixed the Prompt Library selector and Chat Input components in the Sage Interface to dynamically swap backgrounds and text colors perfectly for Day/Light themes instead of staying stuck in dark-mode aesthetics.' }
    ]
  },
  {
    version: 'v6.3.10',
    date: '2026-05-14',
    time: '11:30:00',
    title: 'Sage UI Polish & Renaming',
    items: [
      { category: 'UI', description: 'Fully synchronized the new Sage Consultation sidebar with custom light/dark theme rules.' },
      { category: 'Feature', description: 'You can now manually rename your saved consultation threads using the pencil icon in the sidebar.' }
    ]
  },
  {
    version: 'v6.3.9',
    date: '2026-05-14',
    time: '11:20:00',
    title: 'Sage Conversations & Archives',
    items: [
      { category: 'Feature', description: 'Added a collapsible sidebar to the Sage AI interface to manage multiple conversation threads.' },
      { category: 'Feature', description: 'You can now start new consultations and easily switch between past discussion topics.' },
      { category: 'Feature', description: 'Added the ability to export and download individual Sage conversation scroll histories.' }
    ]
  },
  {
    version: 'v6.3.8',
    date: '2026-05-14',
    time: '11:15:00',
    title: 'AI Timeout & Background Loading',
    items: [
      { category: 'Feature', description: 'Sage AI conversations now persist their loading state even if you switch tabs or close the modal.' },
      { category: 'Feature', description: 'Added a live timer while the Sage consults the scrolls to track response duration.' },
      { category: 'Feature', description: 'Implemented a 180-second timeout to prevent infinite hanging when APIs fail to respond.' },
      { category: 'Feature', description: 'Added native support for viewing the deep thought processes (reasoning_content) of specific reasoning AI models.' }
    ]
  },
  {
    version: 'v6.3.7',
    date: '2026-05-14',
    time: '10:45:00',
    title: 'UI Clipping & Sage Theme Refinement',
    items: [
      { category: 'UI', description: 'Applied pr-1 padding to all italicized banner titles and empty states globally to prevent character clipping.' },
      { category: 'UI', description: 'Optimized Sage\'s chat bubbles for all themes using theme-aware solid light backgrounds and high-contrast dark text, ensuring no transparency.' },
      { category: 'UI', description: 'Renamed "Settings" inner tabs: "calculator" to "Calc" and "level" to "LV." for better density.' }
    ]
  },
  {
    version: 'v6.3.6',
    date: '2026-05-14',
    time: '10:30:00',
    title: 'Sage Dark Mode Messaging Polish',
    items: [
      { category: 'UI', description: 'Optimized Emerald Sage message bubbles for dark themes (Night, Forest, Ocean) by switching to a deep slate background with light emerald text, eliminating visual harshness.' }
    ]
  },
  {
    version: 'v6.3.5',
    date: '2026-05-14',
    time: '10:25:00',
    title: 'Settings UI Compactness Refinement',
    items: [
      { category: 'UI', description: 'Renamed "Calculator" settings tab to "Calc" and "Level" tab to "LV." for a more compact and mobile-friendly navigation bar.' }
    ]
  },
  {
    version: 'v6.3.4',
    date: '2026-05-14',
    time: '10:20:00',
    title: 'Emerald Sage Messaging Clarity',
    items: [
      { category: 'UI', description: 'Updated Sage\'s chat bubbles to use a solid light emerald background with high-contrast dark text, strictly adhering to the "Emerald" identity while ensuring superior readability.' }
    ]
  },
  {
    version: 'v6.3.3',
    date: '2026-05-14',
    time: '10:15:00',
    title: 'Sage Branding Refinement',
    items: [
      { category: 'UI', description: 'Renamed "Emerald Sage" settings tab to "Sage" for a cleaner and more concise interface.' }
    ]
  },
  {
    version: 'v6.3.2',
    date: '2026-05-14',
    time: '10:10:00',
    title: 'Sage Dark Mode Messaging Fix',
    items: [
      { category: 'UI', description: 'Inverted the Emerald Sage\'s message bubble to a dark background (slate-900) with light text (emerald-50) for superior readability in dark themes and a more mystical consistency.' }
    ]
  },
  {
    version: 'v6.3.1',
    date: '2026-05-14',
    time: '10:05:00',
    title: 'Sage Council UI Refinement',
    items: [
      { category: 'UI', description: 'Optimized AI prompt library buttons with a compact, wrap-around layout for improved visual density and mobile ergonomics.' }
    ]
  },
  {
    version: 'v6.3.0',
    date: '2026-05-14',
    time: '10:00:00',
    title: 'Sage UX & Theme Integration',
    items: [
      { category: 'UI', description: 'Unified and themed AI prompt buttons across the Sanctum and Settings, ensuring full synchronization with user-selected color palettes.' },
      { category: 'UX', description: 'Streamlined the Sage Council starter prompts for a cleaner, more focused ritual experience.' }
    ]
  },
  {
    version: 'v6.2.2',
    date: '2026-05-14',
    time: '09:55:00',
    title: 'Sage Interface Synchronization',
    items: [
      { category: 'UI', description: 'Synchronized chat interface CSS between Settings and Dashboard for absolute consistency, including message bubbles, animations, and action placements.' }
    ]
  },
  {
    version: 'v6.2.1',
    date: '2026-05-14',
    time: '09:50:00',
    title: 'Sage Council UX Refinement',
    items: [
      { category: 'UX', description: 'Removed redundant default prompts ("Analyze journey", "Mystical challenge") from the Sage\'s Council chat interface to clear visual clutter.' }
    ]
  },
  {
    version: 'v6.2.0',
    date: '2026-05-14',
    time: '07:40:00',
    title: 'Advice & Sage Structural Refinement',
    items: [
      { category: 'UX', description: 'Split the "Advice" settings section into two separate top-level tabs: "Calculator" and "Emerald Sage" for better navigation and focus.' },
      { category: 'UI', description: 'Updated the settings navigation bar with new specialized icons and labels for the split sections.' }
    ]
  },
  {
    version: 'v6.1.8',
    date: '2026-05-14',
    time: '07:32:00',
    title: 'Sage Interface Unification',
    items: [
      { category: 'UI', description: 'Unified prompt button styling across Sage\'s Council and Advice settings for a consistent mystical aesthetic.' }
    ]
  },
  {
    version: 'v6.1.7',
    date: '2026-05-14',
    time: '07:35:00',
    title: 'Sage Council UX Enhancement',
    items: [
      { category: 'Feature', description: 'Added permanently visible Copy and Quote actions under chat bubbles in Sage\'s Council for easier interaction.' }
    ]
  },
  {
    version: 'v6.1.6',
    date: '2026-05-14',
    time: '07:30:00',
    title: 'Emerald Sage Messaging Refinement',
    items: [
      { category: 'UI', description: 'Inverted Sage\'s chat bubble to dark font on a light emerald background for enhanced readability as per user request.' }
    ]
  },
  {
    version: 'v6.1.5',
    date: '2026-05-14',
    time: '07:25:00',
    title: 'Sage Council Solid Styling',
    items: [
      { category: 'UI', description: 'Updated Sage\'s Council chat bubbles to use solid, theme-aware colors without transparency for maximum contrast and visual stability.' }
    ]
  },
  {
    version: 'v6.1.4',
    date: '2026-05-14',
    time: '07:22:00',
    title: 'Sage Council Visual Polish',
    items: [
      { category: 'UI', description: 'Harmonized chat bubble styles in Sage\'s Council with theme-aware deep dark backgrounds and high-contrast mystical text colors.' }
    ]
  },
  {
    version: 'v6.1.3',
    date: '2026-05-14',
    time: '07:15:00',
    title: 'Sage Chat UI Refinement',
    items: [
      { category: 'UI', description: 'Updated user chat bubbles in Sage\'s Council to use theme-aware dark background and light text for a more harmonious appearance.' }
    ]
  },
  {
    version: 'v6.1.2',
    date: '2026-05-14',
    time: '07:12:00',
    title: 'Sage Chat Styling Refinement',
    items: [
      { category: 'UI', description: 'Updated user chat bubbles in Sage\'s Council to use dark font styling for improved readability.' }
    ]
  },
  {
    version: 'v6.1.1',
    date: '2026-05-14',
    time: '07:08:00',
    title: 'Oracle UI Standardization',
    items: [
      { category: 'UI', description: 'Standardized the Oracle\'s Insight module CSS to match the welcome/dashboard bento grid style.' }
    ]
  },
  {
    version: 'v6.1.0',
    date: '2026-05-14',
    time: '07:05:00',
    title: 'Mobile Header Stability Fix',
    items: [
      { category: 'Bug Fix', description: 'Fixed layout flickering on mobile by truncating long dungeon names in the page header.' }
    ]
  },
  {
    version: 'v6.0.42',
    date: '2026-05-13',
    time: '23:35:00',
    title: 'Dev Tooling Background Refinement',
    items: [
      { category: 'UI', description: 'Updated Quest Board CSS Debugger to use solid backgrounds and headers for improved readability.' },
      { category: 'UI', description: 'Refined action button backgrounds in the developer utility panel to align with solid theme standards.' }
    ]
  },
  {
    version: 'v6.0.41',
    date: '2026-05-13',
    time: '23:30:00',
    title: 'Prompt Library Integrity & Migration Fix',
    items: [
      { category: 'Logic', description: 'Improved the data migration engine to ensure default mystical prompts are automatically merged into user libraries.' },
      { category: 'UX', description: 'Added a "Load Defaults" emergency trigger inside the Sage Library popover for empty collections.' }
    ]
  },
  {
    version: 'v6.0.40',
    date: '2026-05-13',
    time: '23:20:00',
    title: 'AI Global Context & Advanced Analysis',
    items: [
      { category: 'Logic', description: 'Enhanced Sage AI with access to full application parameters (Quests, Gold/XP rates, Timer settings, 30-day history).' },
      { category: 'Feature', description: 'Expanded Prompt Library with specialized analysis prompts (App Intro, Game Balance, Week/Month Analysis).' }
    ]
  },
  {
    version: 'v6.0.39',
    date: '2026-05-13',
    time: '23:25:00',
    title: 'Dev Tooling UI Polish',
    items: [
      { category: 'UI', description: 'Optimized Quest Board CSS Debugger with theme-aligned backgrounds and refined typography.' },
      { category: 'UX', description: 'Redesigned variable editor cards with shortcut copy buttons and larger color swatches.' },
      { category: 'Visual', description: 'Applied backdrop-blur and glassmorphism effects to the debugger control panel.' }
    ]
  },
  {
    version: 'v6.0.38',
    date: '2026-05-13',
    time: '23:15:00',
    title: 'Sage AI Chat Enhancements',
    items: [
      { category: 'Feature', description: 'Added a Prompt Library selector (Library icon) to the left of the chat input, with 6 pre-configured mystical prompts for quick consultation.' },
      { category: 'Feature', description: 'Implemented a Prompt Manager in Sage Settings, allowing users to create, edit, or delete prompts, with a "Restore Defaults" option for safety.' },
      { category: 'Feature', description: 'Implemented "Copy" and "Quote" message actions (Quote prepends message as Markdown quote to input).' },
      { category: 'UI', description: 'Improved the chat input area in both Settings and Dashboard modals with better alignment and staggered animations.' }
    ]
  },
  {
    version: 'v6.0.37',
    date: '2026-05-13',
    time: '23:10:00',
    title: 'AI Output Markdown Rendering',
    items: [
      { category: 'Feature', description: 'Implemented Markdown rendering for AI chat outputs using react-markdown.' },
      { category: 'UI', description: 'Enhanced chat bubble typography with tailwindcss/typography (prose) support.' }
    ]
  },
  {
    version: 'v6.0.36',
    date: '2026-05-13',
    time: '17:00:00',
    title: 'AI Personality Selector & Customizable Prompts',
    items: [
      { category: 'Feature', description: 'Implemented AI Personality Selector (Sage, Friend, Custom).' },
      { category: 'Feature', description: 'Added Identity manager to modify base character prompts.' },
      { category: 'Logic', description: 'Updated Sage service to respect chosen personality prompts.' }
    ]
  },
  {
    version: 'v6.0.35',
    date: '2026-05-13',
    time: '16:55:00',
    title: 'IOS Interaction & Tooltip Refinement',
    items: [
      { category: 'Bug Fix', description: 'Resolved iOS double-click issue in the Record interface.' },
      { category: 'Bug Fix', description: 'Fixed chart tooltip persistence bug with improved global dismissal logic.' }
    ]
  },
  {
    version: 'v6.0.34',
    date: '2026-05-13',
    time: '16:50:00',
    title: 'VAPID Integrity & Sync Refinement',
    items: [
      { category: 'Bug Fix', description: 'Resolved "Vapid public key should be 65 bytes long" error by generating fresh VAPID keys and implementing stricter validation in the backend.' },
      { category: 'Logic', description: 'Synchronized VAPID fallback keys across server and client configurations for consistent push notification behavior.' },
      { category: 'Security', description: 'Enhanced VAPID key sanitization to strip invalid characters from environment variables.' }
    ]
  },
  {
    version: 'v6.0.33',
    date: '2026-05-13',
    time: '16:40:00',
    title: 'AI Model Management & Prompt Library',
    items: [
      { category: 'Feature', description: 'Implemented AI Model Management system for multiple provider profiles (Gemini, OpenAI).' },
      { category: 'Feature', description: 'Added a Prompt Library for "One-tap Consultation" buttons.' },
      { category: 'UI', description: 'Repositioned "Oracle\'s Insight" in the Sanctum to be below the Welcome module.' },
      { category: 'Bug Fix', description: 'Fixed VAPID key validation error on server startup.' }
    ]
  },
  {
    version: 'v6.0.32',
    date: '2026-05-13',
    time: '15:20:00',
    title: 'Sage AI Chat Persistence & Structure',
    items: [
      { category: 'Feature', description: 'Implemented persistent chat history for the Emerald Sage, allowing multi-turn dialogues.' },
      { category: 'Logic', description: 'Optimized Sage output with specific structural guidelines for clearer guidance.' },
      { category: 'UI', description: 'Synchronized chat interfaces across Settings and Dashboard modals.' }
    ]
  },
  {
    version: 'v6.0.31',
    date: '2026-05-13',
    time: '15:05:00',
    title: 'The Emerald Sage AI Integration',
    items: [
      { category: 'Feature', description: 'Fully implemented "From Sage\'s" (The Emerald Sage) module for personalized AI coaching.' },
      { category: 'Feature', description: 'Integrated Gemini and OpenAI/Compatible APIs with local key storage for secure advisory.' },
      { category: 'UI', description: 'Added a "Sage\'s Council" consultation modal in the Sanctum (Dashboard) for direct access to AI insights.' },
      { category: 'Logic', description: 'SAGE now analyzes historical records, efficiency trends, daily moods, and written reflections.' }
    ]
  },
  {
    version: 'v6.0.30',
    date: '2026-05-13',
    time: '12:55:00',
    title: 'Advice & Calculators Layout Polish',
    items: [
      { category: 'UI', description: 'Completely redesigned the "Advice & Calculators" layout into a clean Bento Grid configuration with floating styles, gradients, and hover effects.' },
      { category: 'UI', description: 'Bound the General Advice font colors to theme-aware indigo classes, adapting optimally across dark and light themes.' }
    ]
  },
  {
    version: 'v6.0.29',
    date: '2026-05-13',
    time: '12:45:00',
    title: 'Sage Advice & Income Calculators',
    items: [
      { category: 'Feature', description: 'Added a new Advice module in Settings allowing users to calculate their anticipated XP, Gold, and Talent Shard yields per session based on custom input and active talents.' },
      { category: 'Tool', description: 'Interactive calculators now estimate the exact number of sessions and days required to afford Shop items, Gacha/Ichiban Kuji pulls, and next 3 level-up milestones.' },
      { category: 'UI', description: 'Implemented the "Basically" tab with interactive sliders and data visualizations for deep balance checking, preparing the "From Sage\'s" module for future complex game theory.' }
    ]
  },
  {
    version: 'v6.0.28',
    date: '2026-05-13',
    time: '12:26:00',
    title: 'PIP Window Victory Screen Behaviors',
    items: [
      { category: 'UI', description: 'PIP Window responsive adjustments for the non-modal reward summary, ensuring content is cleanly visible in ultra-compact view.' },
      { category: 'UX', description: 'When "Show Victory Screen" is active, PIP window intelligently maximizes to full screen to display the native reward selection choices, and restores its layout after picking.' }
    ]
  },
  {
    version: 'v6.0.27',
    date: '2026-05-13',
    time: '12:15:00',
    title: 'Reward Chest Session Metadata',
    items: [
      { category: 'UX', description: 'Reward Chest items now cleanly display their completion timestamp and the name of the objective/dungeon they stem from.' }
    ]
  },
  {
    version: 'v6.0.26',
    date: '2026-05-13',
    time: '12:05:00',
    title: 'PIP Window Interactive Logic',
    items: [
      { category: 'UI', description: 'Implemented a non-modal reward summary (XP and Gold) in the Always-on-top (PIP) window that triggers when a focus session ends if "Show Screen" is enabled.' },
      { category: 'UX', description: 'Integrated a "Start Focus" prompt in the PIP window that appears after rest ends if "Manual Focus Start" is active, allowing full session control from the compact view.' }
    ]
  },
  {
    version: 'v6.0.25',
    date: '2026-05-13',
    time: '11:48:00',
    title: 'Chart Layout Refinement',
    items: [
      { category: 'Bug Fix', description: 'Adjusted chart margins to provide more breathing room for the X-axis labels, preventing them from being clipped by the container boundaries.' }
    ]
  },
  {
    version: 'v6.0.24',
    date: '2026-05-13',
    time: '11:45:00',
    title: 'Chart X-Axis Label & Style Fix',
    items: [
      { category: 'Bug Fix', description: 'Fixed an issue where "MON" (Monday) label was missing from chart axes by forcing interval={0} and adding chart margins.' },
      { category: 'UI', description: 'Standardized chart X-axis labels to uppercase (e.g. MON, TUE) for better consistency and visibility.' }
    ]
  },
  {
    version: 'v6.0.23',
    date: '2026-05-13',
    time: '11:35:00',
    title: 'PIP Portal CSS Performance & Cleanup',
    items: [
      { category: 'Performance', description: 'Re-engineered the PIP layout responsiveness to utilize pure CSS media queries, completely eliminating the React render lag and screen flickering during window resizing.' },
      { category: 'UI', description: 'Removed the redundant session progress section to further declutter and prioritize the timer display.' }
    ]
  },
  {
    version: 'v6.0.22',
    date: '2026-05-13',
    time: '11:25:00',
    title: 'Chart Mood Icon Display',
    items: [
      { category: 'UI', description: 'Reconfigured the Weekly Activity bar chart to reliably display daily mood icons above the bars by anchoring them to the total column height instead of a zero-height stack segment.' }
    ]
  },
  {
    version: 'v6.0.21',
    date: '2026-05-13',
    time: '11:22:00',
    title: 'PIP Portal Resize Observer Fix',
    items: [
      { category: 'Bug Fix', description: 'Replaced window.innerWidth with a ResizeObserver in the CompactTimer to correctly track dimensions when rendered inside the separate Document context of a Picture-in-Picture window.' }
    ]
  },
  {
    version: 'v6.0.20',
    date: '2026-05-13',
    time: '11:20:00',
    title: 'Safe Export Integrity Fix',
    items: [
      { category: 'Security', description: 'Updated Safe Export to thoroughly scrub cloud sync unlock statuses, Redis settings, and auto-sync preferences to prevent data leakage during manual migration.' }
    ]
  },
  {
    version: 'v6.0.19',
    date: '2026-05-13',
    time: '11:15:00',
    title: 'PIP Window Interactive Logic',
    items: [
      { category: 'UI', description: 'Implemented a non-modal reward summary (XP and Gold) in the Always-on-top (PIP) window that triggers when a focus session ends if "Show Screen" is enabled.' },
      { category: 'UX', description: 'Integrated a "Start Focus" prompt in the PIP window that appears after rest ends if "Manual Focus Start" is active, allowing full session control from the compact view.' }
    ]
  },
  {
    version: 'v6.0.18',
    date: '2026-05-13',
    time: '11:05:00',
    title: 'Sidebar Branding Collapse Logic',
    items: [
      { category: 'UI', description: 'Hid the branding icon when the sidebar is collapsed for a strictly minimal vertical interface.' }
    ]
  },
  {
    version: 'v6.0.17',
    date: '2026-05-13',
    time: '11:00:00',
    title: 'Sidebar Collapsed Symmetry',
    items: [
      { category: 'UI', description: 'Forced sidebar navigation buttons to maintain a perfect square aspect ratio (w-12 h-12) when collapsed for a cleaner, centered icon-only layout.' },
      { category: 'UI', description: 'Added smooth entry animations for sidebar labels when expanding.' }
    ]
  },
  {
    version: 'v6.0.16',
    date: '2026-05-13',
    time: '10:55:00',
    title: 'PIP Adaptive "Mini" Layout',
    items: [
      { category: 'UI', description: 'Implemented a condensed layout for Always-on-top (PIP) window triggering at small sizes.' },
      { category: 'UX', description: 'Moved controls to the right and reduced typography scales for better compact visibility.' }
    ]
  },
  {
    version: 'v6.0.15',
    date: '2026-05-13',
    time: '10:45:00',
    title: 'PIP Session Goal & Progress',
    items: [
      { category: 'UI', description: 'Added session progress bar and target duration to the top of the Always-on-top (PIP) window.' },
      { category: 'UX', description: 'Real-time completion percentage tracking in compact view.' }
    ]
  },
  {
    version: 'v6.0.14',
    date: '2026-05-13',
    time: '10:42:00',
    title: 'Splash Screen UX Improvement',
    items: [
      { category: 'UX', description: 'Repositioned the version number in the opening animation to be more prominently visible.' }
    ]
  },
  {
    version: 'v6.0.13',
    date: '2026-05-13',
    time: '10:40:00',
    title: 'Sidebar Branding Alignment',
    items: [
      { category: 'UI', description: 'Replaced generic sidebar sword icon with custom AppIcon for consistent branding.' },
      { category: 'UX', description: 'Ensured logo visibility in both expanded and collapsed sidebar states.' }
    ]
  },
  {
    version: 'v6.0.12',
    date: '2026-05-13',
    time: '10:35:00',
    title: 'Splash Screen Logo Refinement',
    items: [
      { category: 'UI', description: 'Removed the outer frame and backdrop from the logo in the opening animation for a cleaner, more focused arrival experience.' }
    ]
  },
  {
    version: 'v6.0.11',
    date: '2026-05-13',
    time: '10:30:00',
    title: 'Session Metadata in Reward Chest & Vault',
    items: [
      { category: 'UX', description: 'Reward Chests (Victory Modal and Pending Chests) now display the duration and goal of the completed session.' },
      { category: 'UI', description: 'The Reward Vault (VAULT) table now includes a "Session Info" column, showing the session context (Duration and Goal) for each earned treasure.' }
    ]
  },
  {
    version: 'v6.0.10',
    date: '2026-05-13',
    time: '10:25:00',
    title: 'Merchant Shop Categorization',
    items: [
      { category: 'UX', description: 'Reclassified items purchased from the Merchant Shop as "Custom" rewards in the Vault, enabling manual redemption/tracking.' }
    ]
  },
  {
    version: 'v6.0.9',
    date: '2026-05-13',
    time: '10:20:00',
    title: 'Stats Tooltip Dismissal Fix',
    items: [
      { category: 'Bug Fix', description: 'Re-engineered the global click listener in Stats.tsx to reliably dismiss chart tooltips and heatmap popovers when clicking any blank area.' }
    ]
  },
  {
    version: 'v6.0.8',
    date: '2026-05-13',
    time: '10:15:00',
    title: 'Custom Time Mocking & Talent Enforcement',
    items: [
      { category: 'Feature', description: 'Added Time Manipulation to Developer Mode, allowing users to enable custom simulated time and set offsets (+/- days or specific dates) for testing resets and daily events.' },
      { category: 'Feature', description: 'Talent unlocking now strictly requires prerequisites (sequential locking).' },
      { category: 'UI', description: 'Improved visual feedback for failed talent unlocks with theme-synchronized floating bubbles.' }
    ]
  },
  {
    version: 'v6.0.7',
    date: '2026-05-13',
    time: '10:10:00',
    title: 'Talent Prerequisite Enforcement',
    items: [
      { category: 'Feature', description: 'Enforced sequential talent unlocking (e.g., Tier 1 must precede Tier 2).' },
      { category: 'UX', description: 'Added a mystical floating bubble notification when attempting to bypass prerequisites, which dismisses automatically upon clicking anywhere else.' }
    ]
  },
  {
    version: 'v6.0.6',
    date: '2026-05-13',
    time: '10:05:00',
    title: 'Global Cloud Unbind Synchronization',
    items: [
      { category: 'Bug Fix', description: 'Resolved a critical race condition where secondary tabs would continue syncing with a dropped secret code. Added immediate cancellation triggers across all tabs via activeSyncRequestRef incrementation on state clear.' },
      { category: 'Bug Fix', description: 'Synchronized the Cloud Sync Modal input field with backend state to prevent re-authentication with stale codes in secondary windows.' }
    ]
  },
  {
    version: 'v6.0.5',
    date: '2026-05-13',
    time: '10:00:00',
    title: 'Enhanced Sync Error Messaging',
    items: [
      { category: 'UX', description: 'Improved sync failure transparency by mapping raw errors to specific "Reason" and "Solution" blocks in the Cloud Sync Modal. Added support for Network, Rate-limit (429), Not Found (404), and Server configuration error types with dedicated icons and mystical themes.' }
    ]
  },
  {
    version: 'v6.0.4',
    date: '2026-05-13',
    time: '01:10:00',
    title: 'Ghost Push & Sync Drift Fixed',
    items: [
      { category: 'Bug Fix', description: 'Completely scrubbed secretCode and provider profiles from memory upon Unbind Local via deep delete. Added cross-tab storage syncing so unbinding in one tab safely terminates sync polling loops in all other concurrent tabs.' },
      { category: 'Bug Fix', description: 'Corrected push notification system to officially /unsubscribe background channels immediately upon manual unbind.' }
    ]
  },
  {
    version: 'v6.0.3',
    date: '2026-05-12',
    time: '23:09:00',
    title: 'PIP Responsive Controls',
    items: [
      { category: 'UI', description: 'Automatically hide timer controls (Reset, Play/Pause, Skip) in the PIP window when resized below a certain height threshold for a cleaner minimal timer view.' }
    ]
  },
  {
    version: 'v6.0.2',
    date: '2026-05-12',
    time: '22:33:00',
    title: 'PIP Dimensions & Theme Alignment',
    items: [
      { category: 'UI', description: 'Reduced default PIP window dimensions to 220x300 for a more compact footprint.' },
      { category: 'UI', description: 'Synchronized the PIP window theme with the main application, including dynamic background and accent color updates.' }
    ]
  },
  {
    version: 'v6.0.1',
    date: '2026-05-12',
    time: '18:18:00',
    title: 'PIP Timer Throttling Fix',
    items: [
      { category: 'Bug Fix', description: 'Re-engineered the PIP (Always-on-top) timer component to use local requestAnimationFrame loops instead of relying on the main window\'s intervals, which solves the issue of the timer freezing when the main window is minimized or inactive.' }
    ]
  },
  {
    version: 'v6.0.0',
    date: '2026-05-12',
    time: '18:00:00',
    title: 'Version 6.0.0 Milestone & PIP UI Alignment',
    items: [
      { category: 'Milestone', description: 'Archived previous updates and commenced Version 6.0.0.' },
      { category: 'UI', description: 'Aligned Always-on-top (PIP) timer UI with the main page, including synchronized text tags and timer control buttons (Play/Pause, Reset, Skip).' }
    ]
  }
];
