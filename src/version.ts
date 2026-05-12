export const APP_VERSION = 'v6.0.2';
export const LAST_UPDATE_DATE = '2026-05-12';
export const LAST_UPDATE_TIME = '22:33:00';

export interface ReleaseLog {
  version: string;
  date: string;
  time: string;
  title: string;
  items: { category: string; description: string }[];
}

export const RELEASE_HISTORY: ReleaseLog[] = [
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
