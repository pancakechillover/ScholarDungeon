export const APP_VERSION = 'v8.5.0';
export const LAST_UPDATE_DATE = '2026-06-05';
export const LAST_UPDATE_TIME = '05:46:00';

export interface ReleaseLog {
  version: string;
  date: string;
  time: string;
  title: string;
  items: { category: string; description: string }[];
}

export const RELEASE_HISTORY: ReleaseLog[] = [
  {
    version: 'v8.5.0',
    date: '2026-06-05',
    time: '05:46:00',
    title: 'Standardized Nickname Formatting & Multi-Language Translation',
    items: [
      { category: 'Feature', description: 'Implemented adaptive username validation (maximum 10 Chinese characters or 15 Latin characters) with interactive mode switches and real-time character meters.' },
      { category: 'Feature', description: 'Added a customized, fully high-contrast English confirmation option box (ConfirmModal) explaining that chosen nicknames are visible publicly and will be referenced in notification alerts.' },
      { category: 'UI/UX', description: 'Standardized the chat workspace in TeamModule.tsx to automatically append user student IDs as a neat (ID-XXXXX) suffix directly following the sender\'s nickname.' },
      { category: 'UI/UX', description: 'Eliminated all remaining user-facing Chinese labels in ProfileModal, CloudSettingsSection, ShareRecordModal, DatePicker, and SageSettingsSection, aligning the entire applet to global English localized aesthetics.' }
    ]
  },
  {
    version: 'v8.4.10',
    date: '2026-06-05',
    time: '05:10:00',
    title: 'Synchronized Web Push VAPID Keys & Fallback Engine Alignment',
    items: [
      { category: 'Bug Fix', description: 'Synchronized mismatched default fallback VAPID key pairs between the background tick scheduler (server.ts) and the serverless endpoint (api/push.ts).' },
      { category: 'Bug Fix', description: 'Unified JWT signing key validation and sanitization filters to safeguard against BadJwtToken exceptions, fully preventing server-side purging of valid subscriptions.' }
    ]
  },
  {
    version: 'v8.4.9',
    date: '2026-06-05',
    time: '05:00:00',
    title: 'Upgraded Looping TimePicker & Global English Standardization',
    items: [
      { category: 'Feature', description: 'Implemented custom 3-cycle circular loop infinite scrolling list columns for HH and MM time selectors, enabling seamless wrap-around navigation.' },
      { category: 'UI/UX', description: 'Activated auto-commit value matching immediately on wheel scroll-snapping, rendering click confirmation redundant.' },
      { category: 'UI/UX', description: 'Eradicated all native and custom literal Chinese text labels from the popover display coordinates to serve internationalization standards.' },
      { category: 'UI/UX', description: 'Constrained time selection slider rails with strict horizontal overflow-x-hidden, touch-pan-y, and pointer interaction lock behaviors to prevent sliding jitter.' }
    ]
  },
  {
    version: 'v8.4.8',
    date: '2026-06-05',
    time: '04:30:00',
    title: 'Permanent Student IDs & Roster Layout Polish',
    items: [
      { category: 'Feature', description: 'Assigned unique, stable, random alphanumeric IDs (SD-XXXXX) for every student. This stable ID is preserved securely in local state and synchronized on redis database tables.' },
      { category: 'UI/UX', description: 'Displayed user unique IDs immediately to the left of the honorary titles on both the current user\'s profile modal and within general Fellowship member viewer popups.' },
      { category: 'UI/UX', description: 'Removed the bulky PieChart container from the Fellowship panel, replacing it with focused, elegant member listings pairing custom statuses to individual student profiles.' }
    ]
  },
  {
    version: 'v8.4.7',
    date: '2026-06-05',
    time: '04:05:00',
    title: 'Guild Persistence & Timer Synchronization',
    items: [
      { category: 'Feature', description: 'Synchronized the local Timer Engine directly with the Guild Cloud Service. Automatically dispatches Focus XP and duration metrics to Guild rosters upon successful completion.' },
      { category: 'UI/UX', description: 'Overhauled the Fellowship load lifecycle. If you belong to a guild, the Sanctum now renders an immediate Loading Skeleton instead of flashing the public Plaza.' },
      { category: 'UI/UX', description: 'Restored the overarching Sanctum Plaza navigation button within active Guild dashboards, allowing members to freely browse global public guilds.' },
      { category: 'Bug Fix', description: 'Repaired the global Top Navigation scroll stickiness. Replaced aggressive overflow-hidden directives with overflow-clip to restore native browser CSS sticky behavior.' },
      { category: 'Bug Fix', description: 'Resurrected dynamic Theme-aware styling to the top navigation header which had lost its color synchronization across various environments.' }
    ]
  },
  {
    version: 'v8.4.6',
    date: '2026-06-05',
    time: '03:50:00',
    title: 'Cloud Run CPU Wake-Lock Engine',
    items: [
      { category: 'Architecture', description: 'Implemented an advanced HTTP Response Hold queue within the push check endpoint. This intentionally delays cron responses to keep the Serverless CPU active, resolving 1-minute cron precision limitations and delivering push notifications with exact millisecond precision.' }
    ]
  },
  {
    version: 'v8.4.5',
    date: '2026-06-05',
    time: '03:45:00',
    title: 'iOS PWA UX & Background Notice Sync',
    items: [
      { category: 'UI/UX', description: 'Rebased JS-driven dynamic theme-color injections to export raw HEX coordinates cleanly, resolving an issue where the iPad native Slide-Over indicator handle rendered as an abrupt black bar under light themes.' },
      { category: 'UI/UX', description: 'Refactored sticky header translucent opacities to execute natively without requiring color-mix compilation, matching visual themes accurately on older Safari clients.' },
      { category: 'Bug Fix', description: 'Compacted Flex geometries within the mobile bottom navigation. Scaled boundaries from 40px down to gracefully fluid intervals, completely arresting any horizontal clipping behavior native to 320px Slide-Over environments.' }
    ]
  },
  {
    version: 'v8.4.4',
    date: '2026-06-05',
    time: '03:25:00',
    title: 'iOS PWA Deep Immersion (Slide Over)',
    items: [
      { category: 'UI/UX', description: 'Activated black-translucent status bar properties for PWAs to completely eliminate invasive system-generated top background bounding boxes. Merged the safe-area dynamically.' },
      { category: 'Bug Fix', description: 'Overhauled the logic governing the mobile bottom navbar to flex naturally within iPad Slide Over configurations, permanently eradicating the horizontal scrolling bug.' }
    ]
  },
  {
    version: 'v8.4.3',
    date: '2026-06-05',
    time: '02:45:00',
    title: 'iOS PWA Engine Polish',
    items: [
      { category: 'UI/UX', description: 'Embedded dynamic <meta name="theme-color"> mutations mapped precisely to the active aesthetic theme (e.g. Daylight, Warm Sun). This gracefully merges the persistent iOS top status bar into the designated theme background.' },
      { category: 'Bug Fix', description: 'Intercepted horizontal boundary overflow by aggressively locking overflow-x-hidden onto the absolute root entry wrapper, eliminating unintended lateral swiping jitter.' }
    ]
  },
  {
    version: 'v8.4.2',
    date: '2026-06-04',
    time: '17:35:00',
    title: 'Archive Communion Upgrades',
    items: [
      { category: 'UI/UX', description: 'Overhauled the sync overlay aesthetics to prevent target occlusion, introducing rotating phrases and tooltips with practical, lore-friendly software advice (e.g., "The maiden is praying...").' },
      { category: 'Bug Fix', description: 'Corrected the overflow collision of the Online Activity indicator on Member profile avatars.' }
    ]
  },
  {
    version: 'v8.4.1',
    date: '2026-06-04',
    time: '17:02:00',
    title: 'Adaptive Light/Dark Theme Enhancements',
    items: [
      { category: 'UI/UX', description: 'Refined the Guild Goal progress widget and Detailed Modal to strictly enforce theme-aware primary colors, guaranteeing striking readability and aesthetics across all daylight and night environments without harsh hardcoded shadows.' }
    ]
  },
  {
    version: 'v8.4.0',
    date: '2026-06-04',
    time: '16:55:00',
    title: 'Guild Leadership & Progress Glory',
    items: [
      { category: 'Feature', description: 'Captains are now empowered with the ability to banish members directly from the team profiles.' },
      { category: 'Feature', description: 'Guild Goal cards evolved into rich interactive widgets with pulse effects, which can be clicked to open a celebratory Full-Screen Daily Progress & Leaderboard view.' },
      { category: 'Feature', description: 'Active Fellow members now display an online presence indicator and the registry automatically ranks by Scholar Level.' }
    ]
  },
  {
    version: 'v8.3.0',
    date: '2026-06-04',
    time: '16:34:00',
    title: 'Guild Quality of Life & Message Realism',
    items: [
      { category: 'UI/UX', description: 'Redesigned the "Found a Guild" modal layout, optimizing the vertical headspace and positioning action controls properly to upper right quadrants.' },
      { category: 'Performance', description: 'Eliminated chat transmission latency by implementing full optimistic UI predictive appending on outbound messages.' },
      { category: 'Bug Fix', description: 'Resolved systemic discrepancies preventing newly joined Fellowship members from broadcasting custom Avatar selections (e.g. Cat, Dog) synchronously.' },
      { category: 'Bug Fix', description: 'Repaired the Team Member Identity hash resolver that had invisibly broken Captain Transfer permissions for shared name instances.' }
    ]
  },
  {
    version: 'v8.2.2',
    date: '2026-06-04',
    time: '16:15:00',
    title: 'Guild Goal Approvals & Profile Advancements',
    items: [
      { category: 'Feature', description: 'Implemented the ability for any guild member to respectfully propose edits to the Guild Target Horizon and Vault Rewards, under Democratic unanimous voting systems.' },
      { category: 'Feature', description: 'Proposed votes are now pinned seamlessly at the peak of the Guild Message board showing clear live-progress meters.' },
      { category: 'Feature', description: 'Added the ability for captains to dynamically transfer their role to another deserving team member from the Team Profile Modal View.' }
    ]
  },
  {
    version: 'v8.2.1',
    date: '2026-06-04',
    time: '16:10:00',
    title: 'Guild Settings Redesign',
    items: [
      { category: 'UI Enhancement', description: 'Restructured the "Found a Guild" and "Guild Settings & Goal" modals with a responsive two-column grid on wide screens.' },
      { category: 'Feature', description: 'Added the ability for captains to dynamically edit guild name and description from the settings menu, and unified language to English.' }
    ]
  },
  {
    version: 'v8.2.0',
    date: '2026-06-04',
    time: '16:00:00',
    title: 'Fellowship Profile Auto-Sync & Interface Upgrades',
    items: [
      { category: 'Feature', description: 'Fully synchronized user avatar icons from the personal center into the Fellowship team module.' },
      { category: 'UI Enhancement', description: 'Imbued the Fellowship members list with user level tags (Lv. x), and linked avatar cards directly to live bios, custom titles, and levels.' },
      { category: 'Database Integration', description: 'Architected dynamic real-time profile fetching and updating on the Redis/Express backend for 100% accurate guild profile details.' }
    ]
  },
  {
    version: 'v8.1.1',
    date: '2026-06-04',
    time: '15:15:00',
    title: 'Vercel Deployment Unblock (Cron Removal)',
    items: [
      { category: 'Architecture', description: 'Temporarily removed vercel.json cron configurations entirely to unblock Vercel GitHub webhook suspensions on the Free Tier.' }
    ]
  },
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
