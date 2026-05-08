export const APP_VERSION = 'v4.4.2';
export const LAST_UPDATE_DATE = '2026-05-08';

export interface ReleaseLog {
  version: string;
  date: string;
  title: string;
  items: { category: string; description: string }[];
}

export const RELEASE_HISTORY: ReleaseLog[] = [
  {
    version: 'v4.4.2',
    date: '2026-05-08',
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
    title: 'Skip Victory Screen Option',
    items: [
      { category: 'Feature', description: 'Added a setting to automatically skip the Victory screen when a timer session finishes, with options to automatically pick the highest rarity reward or discard rewards entirely.' }
    ]
  },
  {
    version: 'v4.4.0',
    date: '2026-05-08',
    title: 'Settings Page Componentization',
    items: [
      { category: 'Architecture', description: 'Completely refactored the massive Settings.tsx file by creating a dedicated settings folder and breaking down all sub-sections into independent component files for much better maintainability.' }
    ]
  },
  {
    version: 'v4.3.15',
    date: '2026-05-08',
    title: 'Timer Settings Quick Access',
    items: [
      { category: 'UI', description: 'Added a dedicated gear icon to the top-left corner of the Timer Banner for quick access to the Timer settings page.' }
    ]
  },
  {
    version: 'v4.3.14',
    date: '2026-05-08',
    title: 'Timer Settings Page Refactor',
    items: [
      { category: 'Architecture', description: 'Extracted Timer specifics (Compact Timer Banner, visible shortcuts, and Session Reward Settings) into a newly created dedicated Timer settings page within the Settings dialog.' }
    ]
  },
  {
    version: 'v4.3.13',
    date: '2026-05-07',
    title: 'Talent Icon Overhaul',
    items: [
      { category: 'UI', description: 'Replaced all talent tree node icons with newly assigned Lucide equivalents mapped specifically for each branch and tier.' }
    ]
  },
  {
    version: 'v4.3.12',
    date: '2026-05-07',
    title: 'Ichiban Ticket Icon Replacement',
    items: [
      { category: 'UI', description: 'Replaced all Lucide icons representing the \'Ichiban\' feature with Ticket across Settings.tsx.' },
      { category: 'UI', description: 'Added Ticket to the available icon selection array for custom shop and loot items.' }
    ]
  },
  {
    version: 'v4.3.11',
    date: '2026-05-07',
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
    title: 'Compact Timer Banner Theme Fix & Theme Standard Rule',
    items: [
      { category: 'Bugfix', description: 'Replaced fixed indigo-300 text colors with indigo-400 in the Compact Timer Banner settings so the text scales properly with the selected custom theme.' },
      { category: 'Documentation', description: 'Added a rule to AGENTS.md explicitly defining which indigo scale ranges correctly adopt theme colors.' }
    ]
  },
  {
    version: 'v4.3.8',
    date: '2026-05-07',
    title: 'Timer Banner Customization',
    items: [
      { category: 'Feature', description: 'Added a toggle in Settings to use a Compact Timer Banner (hide navigation shortcuts).' },
      { category: 'Feature', description: 'Added the ability to customize which navigation shortcuts appear in the Timer Banner when not in compact mode.' }
    ]
  },
  {
    version: 'v4.3.7',
    date: '2026-05-07',
    title: 'Recent Sessions UI Polish',
    items: [
      { category: 'UI', description: 'Centered the contents of the Actions column in the Recent Sessions table for better alignment with the header.' }
    ]
  },
  {
    version: 'v4.3.6',
    date: '2026-05-07',
    title: 'Reward Details View in Recent Sessions',
    items: [
      { category: 'Feature', description: 'Added the ability to click on a Reward in the Recent Sessions table to view its full details (description, rarity, type) based on the current Loot Pool.' }
    ]
  },
  {
    version: 'v4.3.5',
    date: '2026-05-07',
    title: 'Centralized Versioning System',
    items: [
      { category: 'Architecture', description: 'Created src/version.ts to centralize application version and release history.' },
      { category: 'Refactor', description: 'Updated Settings and SplashScreen to consume data from the centralized source, making future updates easier.' }
    ]
  },
  {
    version: 'v4.3.4',
    date: '2026-05-07',
    title: 'Clockwise Timer Progress Fix',
    items: [
      { category: 'Bugfix', description: 'Corrected the timer progress ring direction to be clockwise starting from 12 o\'clock.' }
    ]
  },
  {
    version: 'v4.3.3',
    date: '2026-05-07',
    title: 'Theme-Aware Banner Hover Finish',
    items: [
      { category: 'UI', description: 'Unified all hover states in the Explore tab\'s timer navigation banner to use the theme-aware primary color.' }
    ]
  },
  {
    version: 'v4.3.2',
    date: '2026-05-07',
    title: 'Timer Banner Hover Polish',
    items: [
      { category: 'UI', description: 'Unified all hover states in the Explore tab\'s timer navigation banner to use a deep, theme-aware dark color.' }
    ]
  },
  {
    version: 'v4.3.1',
    date: '2026-05-07',
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
    title: 'App.tsx Refactoring & Componentization',
    items: [
      { category: 'Architecture', description: 'Successfully refactored App.tsx into dedicated component files.' },
      { category: 'Architecture', description: 'Encapsulated complex modal logic into standalone components.' },
      { category: 'UI', description: 'Enhanced the Reward Completion experience by integrating the new component.' }
    ]
  }
];
