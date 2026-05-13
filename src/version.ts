export const APP_VERSION = 'v6.0.30';
export const LAST_UPDATE_DATE = '2026-05-13';
export const LAST_UPDATE_TIME = '12:55:00';

export interface ReleaseLog {
  version: string;
  date: string;
  time: string;
  title: string;
  items: { category: string; description: string }[];
}

export const RELEASE_HISTORY: ReleaseLog[] = [
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
