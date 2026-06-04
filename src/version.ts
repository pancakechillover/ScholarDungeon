export const APP_VERSION = 'v8.1.0';
export const LAST_UPDATE_DATE = '2026-06-04';
export const LAST_UPDATE_TIME = '14:50:00';

export interface ReleaseLog {
  version: string;
  date: string;
  time: string;
  title: string;
  items: { category: string; description: string }[];
}

export const RELEASE_HISTORY: ReleaseLog[] = [
  {
    version: 'v8.1.0',
    date: '2026-06-04',
    time: '14:50:00',
    title: 'Sanctum Plaza, Fellowship Era & Ultimate V8 Upgrades',
    items: [
      { category: 'Sanctum Plaza', description: 'Replaced Public Guilds with the interactive English Plaza layout under the stately Lucide Landmark icon.' },
      { category: 'Fellowship (Teams)', description: 'Full multiplayer team integration with custom goals, shared message chat, and contribution pool charts.' },
      { category: 'Profile Synchronization', description: 'Real-time level, bio, title, and custom avatar synchronization natively powered by the database proxy.' },
      { category: 'Unified Input Pickers', description: 'Custom DatePicker and TimePicker UI popups with full aesthetic theme-matching support.' },
      { category: 'Sleep Trackers & Editing', description: 'Dual Y-axis sleep duration charts coupled with a robust multi-editing Bulk Sleep record panel.' },
      { category: 'Performance & Telemetry', description: 'Native instrumentation of @vercel/analytics client on app boot for real-time traffic observing.' },
      { category: 'Bug Fix (Web Push)', description: 'Restructured vercel.json cron policies to respect Free Tier quotas and secure deployments.' },
      { category: 'Bug Fix (Audio Focus)', description: 'Removed fallback background silent channels to preserve system media playback rules.' }
    ]
  }
];
