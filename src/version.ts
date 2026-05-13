export const APP_VERSION = 'v6.0.9';
export const LAST_UPDATE_DATE = '2026-05-13';
export const LAST_UPDATE_TIME = '10:20:00';

export interface ReleaseLog {
  version: string;
  date: string;
  time: string;
  title: string;
  items: { category: string; description: string }[];
}

export const RELEASE_HISTORY: ReleaseLog[] = [
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
