export const APP_VERSION = 'v5.13.18';
export const LAST_UPDATE_DATE = '2026-05-12';
export const LAST_UPDATE_TIME = '14:30:00';

export interface ReleaseLog {
  version: string;
  date: string;
  time: string;
  title: string;
  items: { category: string; description: string }[];
}

export const RELEASE_HISTORY: ReleaseLog[] = [
  {
    version: 'v5.13.18',
    date: '2026-05-12',
    time: '14:30:00',
    title: 'Timer PIP Context Fix',
    items: [
      { category: 'Bugfix', description: 'Fixed an error where the Picture-in-Picture window would fail to open in iframe contexts. The button is now hidden when the app is embedded, directing users to open it in a new tab or install as a PWA first.' }
    ]
  },
  {
    version: 'v5.13.17',
    date: '2026-05-12',
    time: '14:15:00',
    title: 'Timer PIP Button OS Requirement',
    items: [
      { category: 'UX', description: 'The Floating Mini Timer (Always on Top) button now appears on all Windows and Mac systems that support the feature, instead of only appearing when installed as a PWA.' }
    ]
  },
  {
    version: 'v5.13.16',
    date: '2026-05-12',
    time: '14:00:00',
    title: 'Top Bar Sync Button Refinement',
    items: [
      { category: 'UI', description: 'Reduced the size of the cloud sync button and its icon for a more compact and consistent top bar layout.' }
    ]
  },
  {
    version: 'v5.13.15',
    date: '2026-05-12',
    time: '13:45:00',
    title: 'Activity Time Peaks Layout Polish',
    items: [
      { category: 'UI', description: 'Added horizontal margins to the timeline container to prevent time labels from being clipped at the edges.' }
    ]
  },
  {
    version: 'v5.13.14',
    date: '2026-05-12',
    time: '13:30:00',
    title: 'Activity Time Peaks Sliding Window',
    items: [
      { category: 'UX', description: 'Implemented a 24-hour sliding window for the timeline visualization.' },
      { category: 'UI', description: 'Simplified labels to only show period boundaries.' }
    ]
  },
  {
    version: 'v5.13.13',
    date: '2026-05-12',
    time: '13:15:00',
    title: 'Activity Time Peaks Minimalist UI',
    items: [
      { category: 'UI', description: 'Removed all text labels (hours, Midnight, Next Day) from the timeline visualization for a clean, minimalist appearance.' }
    ]
  },
  {
    version: 'v5.13.12',
    date: '2026-05-12',
    time: '13:00:00',
    title: 'Activity Time Peaks Flat UI',
    items: [
      { category: 'UI', description: 'Removed segment glow effects and internal text for a flatter, cleaner look.' },
      { category: 'UI', description: 'Widened the cross-day midnight dividing line and increased timeline header text size.' }
    ]
  },
  {
    version: 'v5.13.11',
    date: '2026-05-12',
    time: '12:45:00',
    title: 'Activity Time Peaks UI Visual Refinement',
    items: [
      { category: 'UI', description: 'Applied high-precision colors (#FDE047, #F97316, #6366F1) for peak periods and increased header sizes.' },
      { category: 'UX', description: 'Enhanced cross-day visualization with a prominent "Midnight" marker and "Next Day" background.' }
    ]
  },
  {
    version: 'v5.13.10',
    date: '2026-05-12',
    time: '12:15:00',
    title: 'Activity Time Peaks UI Final Refinement',
    items: [
      { category: 'UI', description: 'Increased timeline marker font size and visualization height for better readability.' },
      { category: 'UI', description: 'Improved marker positioning logic on the dynamic timeline.' },
      { category: 'Cleanup', description: 'Removed redundant time range previews from period cards and pruned unused imports.' }
    ]
  },
  {
    version: 'v5.13.9',
    date: '2026-05-12',
    time: '12:00:00',
    title: 'Activity Time Peaks UI Refinement',
    items: [
      { category: 'UI', description: 'Repositioned the dynamic timeline below time input blocks for better visual hierarchy.' },
      { category: 'UI', description: 'Removed redundant time range previews from input cards and increased visualization font size.' }
    ]
  },
  {
    version: 'v5.13.8',
    date: '2026-05-12',
    time: '11:45:00',
    title: 'Activity Time Peaks UI Overhaul',
    items: [
      { category: 'UI', description: 'Replaced static time range previews with a dynamic integrated timeline visualization.' },
      { category: 'UX', description: 'Implemented cross-day extension logic for the timeline for periods spanning across midnight.' },
      { category: 'Logic', description: 'Added real-time overlap detection with visual warning messages to prevent configuration conflicts.' }
    ]
  },
  {
    version: 'v5.13.7',
    date: '2026-05-12',
    time: '11:25:00',
    title: 'Gacha Settings UI Refinement',
    items: [
      { category: 'UI', description: 'Consolidated "Import Pool" and "Add Pool" buttons into the main Gacha section header for better space efficiency.' }
    ]
  },
  {
    version: 'v5.13.6',
    date: '2026-05-12',
    time: '11:15:00',
    title: 'Daily Progress UI Reordering',
    items: [
      { category: 'UX', description: 'Reordered the days in the Daily Progress Goal configuration to start with Monday for a more standard weekly view.' }
    ]
  },
  {
    version: 'v5.13.5',
    date: '2026-05-12',
    time: '11:00:00',
    title: 'Reward Pool UI Consolidation',
    items: [
      { category: 'UI', description: 'Consolidated Reward Pool Management title and action buttons (Reset/Add Reward) into a single row for better horizontal space efficiency.' }
    ]
  },
  {
    version: 'v5.13.4',
    date: '2026-05-12',
    time: '10:45:00',
    title: 'Settings Layout Refinement',
    items: [
      { category: 'UI', description: 'Reordered general settings: "Activity Time Peaks" is now positioned before "End of the Day" for better logical flow.' }
    ]
  },
  {
    version: 'v5.13.3',
    date: '2026-05-12',
    time: '10:30:00',
    title: 'Reward Pool UI Cleanup',
    items: [
      { category: 'UI', description: 'Removed redundant "Loot Pool" heading from the Reward Pool Management section in Timer Settings.' }
    ]
  },
  {
    version: 'v5.13.2',
    date: '2026-05-12',
    time: '10:15:00',
    title: 'Settings UI Polishing',
    items: [
      { category: 'UI', description: 'Added structured frames to Mood Configuration and Daily Progress Goal sections in Settings.' },
      { category: 'UX', description: 'Added descriptive helper text for the Daily Progress Goal setting for better clarity.' }
    ]
  },
  {
    version: 'v5.13.1',
    date: '2026-05-12',
    time: '10:00:00',
    title: 'Sync History UI Final Polish',
    items: [
      { category: 'UI', description: 'Optimized Sync History table with flexible column widths and improved status clarity for legacy records.' },
      { category: 'UX', description: 'Added horizontal scrolling for history table to handle longer content without clipping.' }
    ]
  },
  {
    version: 'v5.13.0',
    date: '2026-05-12',
    time: '09:45:00',
    title: 'Manual Focus Start Option',
    items: [
      { category: 'Feature', description: 'Added "Manual Focus Start" setting for loop mode. When rest ends, players can now choose to manually confirm before starting the next focus session.' },
      { category: 'UI', description: 'New sleek confirmation prompt for focus sessions after rest periods.' }
    ]
  },
  {
    version: 'v5.12.1',
    date: '2026-05-12',
    time: '09:30:00',
    title: 'Sync History UI Refinement',
    items: [
      { category: 'UI', description: 'Improved the Status column in Sync History with fixed-width layout and clearer labels for better visibility on smaller screens.' }
    ]
  },
  {
    version: 'v5.12.0',
    date: '2026-05-12',
    time: '09:20:00',
    title: 'Archive History Status & UI',
    items: [
      { category: 'Feature', description: 'Added a dedicated status column to Sync History, clearly indicating success, failure, or cancellation of cloud operations.' },
      { category: 'UI', description: 'Redefined the Archive Chronology layout with a table-style grid for better information density and visual clarity.' },
      { category: 'Logic', description: 'Enhanced sync logging to capture error messages during failed login or sync attempts for easier troubleshooting.' }
    ]
  },
  {
    version: 'v5.11.5',
    date: '2026-05-12',
    time: '09:10:00',
    title: 'VAPID & Core Robustness',
    items: [
      { category: 'Bugfix', description: 'Improved VAPID key validation logic to prevent "65 bytes" decoding errors caused by invalid environment variables.' },
      { category: 'Security', description: 'Rotated fallback VAPID keys and enhanced cleaning logic for platform-provided secrets.' }
    ]
  },
  {
    version: 'v5.11.4',
    date: '2026-05-12',
    time: '09:00:00',
    title: 'Icon & UI Refinement',
    items: [
      { category: 'UI', description: 'Updated the "Morning" icon in Activity Time Peaks to a sunrise for better visual distinction.' }
    ]
  },
  {
    version: 'v5.11.3',
    date: '2026-05-12',
    time: '08:55:00',
    title: 'Settings UI Polish',
    items: [
      { category: 'UI', description: 'Updated the "End of the Day" section icon to a calendar-check for better visual representation.' }
    ]
  },
  {
    version: 'v5.11.2',
    date: '2026-05-12',
    time: '08:50:00',
    title: 'Settings UI Consolidation II',
    items: [
      { category: 'UI', description: 'Moved the "Daily Progress Goal" configuration into the "End of the Day" section for better thematic grouping.' }
    ]
  },
  {
    version: 'v5.11.1',
    date: '2026-05-12',
    time: '08:45:00',
    title: 'Settings UI Consolidation',
    items: [
      { category: 'UI', description: 'Consolidated "Default Markdown" and "Mood Configuration" settings into a single "End of the Day" section for better organization.' }
    ]
  },
  {
    version: 'v5.11.0',
    date: '2026-05-12',
    time: '08:35:00',
    title: 'Archive Visibility & End of Day Polish',
    items: [
      { category: 'Bugfix', description: 'Fixed Cloud Sync Device Code display where it appeared as "?" even when available.' },
      { category: 'UI', description: 'Significant refinement of the "End of the Day" modal: clean header layout, highlighted settlement dates, and minimal daily progress bar.' },
      { category: 'UX', description: 'Support for re-editing daily logs: opening the summary modal now automatically loads existing records for the current day.' }
    ]
  },
  {
    version: 'v5.10.9',
    date: '2026-05-12',
    time: '08:20:00',
    title: 'Daily Summary Re-editing',
    items: [
      { category: 'UX', description: 'If a daily log already exists for the current day, it is automatically loaded when opening the End of the Day modal, allowing users to re-edit their saved reflection and rating.' }
    ]
  },
  {
    version: 'v5.10.8',
    date: '2026-05-12',
    time: '08:15:00',
    title: 'Mood Selection UI Polish',
    items: [
      { category: 'UI', description: 'Realignment of mood section title and addition of a section separator for better visual hierarchy.' }
    ]
  },
  {
    version: 'v5.10.7',
    date: '2026-05-12',
    time: '08:12:00',
    title: 'Mood Selection UI Polish',
    items: [
      { category: 'UX', description: 'Reduced the size of mood selection buttons and centered the layout for a more balanced and compact appearance in the End of the Day modal.' }
    ]
  },
  {
    version: 'v5.10.6',
    date: '2026-05-12',
    time: '08:08:00',
    title: 'Daily Progress UI Refinement',
    items: [
      { category: 'UI', description: 'Restored the "Daily Progress" title and session ratio in a simplified layout within the End of the Day modal.' }
    ]
  },
  {
    version: 'v5.10.5',
    date: '2026-05-12',
    time: '08:05:00',
    title: 'Daily Summary View Simplification',
    items: [
      { category: 'UI', description: 'Simplified the End of the Day modal by removing redundant header text and stripping the Daily Progress section down to a minimal interactive bar.' }
    ]
  },
  {
    version: 'v5.10.4',
    date: '2026-05-12',
    time: '08:02:00',
    title: 'End of Day UI Refinement',
    items: [
      { category: 'UI', description: 'Refined the "End of the Day" header layout: moved the date range below the title, removed borders, and highlighted the recorded date for better clarity.' }
    ]
  },
  {
    version: 'v5.10.3',
    date: '2026-05-12',
    time: '07:50:00',
    title: 'Settlement Date Attribution Fix',
    items: [
      { category: 'Bugfix', description: 'Fixed a critical bug where settlement and bulk session dates were attributed using UTC instead of local/configured time, causing incorrect record dates for users in non-UTC timezones.' }
    ]
  },
  {
    version: 'v5.10.2',
    date: '2026-05-12',
    time: '07:44:00',
    title: 'End of Day Header Date',
    items: [
      { category: 'UX', description: 'Added the effective settlement date explicitly at the top of the "End of the Day" modal, making it clearer when logging activities that span across midnight.' }
    ]
  },
  {
    version: 'v5.10.1',
    date: '2026-05-12',
    time: '07:35:00',
    title: 'Markdown Readability Polish',
    items: [
      { category: 'UX', description: 'Increased font color intensity for Markdown list items (content after "-") to improve readability across all themes.' }
    ]
  },
  {
    version: 'v5.10.0',
    date: '2026-05-12',
    time: '07:30:00',
    title: 'Mood Selection UI Polish',
    items: [
      { category: 'UX', description: 'Improved the "Daily Feelings" selection area by adding padding and allowing scale effects (up to 125%) without clipping, providing better visual feedback.' }
    ]
  },
  {
    version: 'v5.9.9',
    date: '2026-05-12',
    time: '07:28:00',
    title: 'Modal Layout Polish',
    items: [
      { category: 'UI', description: 'Adjusted the "End of the Day" modal vertical spacing to ensure a consistent gap from the screen edges on all devices.' }
    ]
  },
  {
    version: 'v5.9.8',
    date: '2026-05-12',
    time: '07:25:00',
    title: 'Chart Interaction Polish',
    items: [
      { category: 'Bugfix', description: 'Fixed a bug in Weekly Activity charts where tooltips would not disappear when clicking empty space.' }
    ]
  },
  {
    version: 'v5.9.7',
    date: '2026-05-12',
    time: '07:16:00',
    title: 'Cloud Sync Comparison UI Enhancement',
    items: [
      { category: 'UX', description: 'Added "Device Code" row to the comparison tables in the Astral Archives modal, providing better visibility of which device a cloud save belongs to.' }
    ]
  },
  {
    version: 'v5.9.6',
    date: '2026-05-12',
    time: '07:15:00',
    title: 'Cloud Sync Device Identity Fix',
    items: [
      { category: 'Bugfix', description: 'Fixed an issue where the unique Device Code was being overwritten during cloud sync or data import, ensuring each platform/device maintains its own identity in the sync history.' }
    ]
  },
  {
    version: 'v5.9.5',
    date: '2026-05-12',
    time: '07:05:00',
    title: 'Export UI Refinement',
    items: [
      { category: 'UI', description: 'Unified the visual style of "Safe Export" and "Full Export" buttons for better consistency while maintaining distinct icon colors.' }
    ]
  },
  {
    version: 'v5.9.4',
    date: '2026-05-12',
    time: '07:01:00',
    title: 'Enhanced Export Portability',
    items: [
      { category: 'Feature', description: 'Added a dual-mode Export system allowing users to choose between Full Export (all data) and Safe Export (privacy-focused).' },
      { category: 'Privacy', description: 'Safe Export automatically strips sensitive synchronization passwords, cloud tokens, and device nicknames from the exported JSON.' }
    ]
  },
  {
    version: 'v5.9.3',
    date: '2026-05-12',
    time: '06:58:00',
    title: 'Settings Navigation Polish',
    items: [
      { category: 'UX', description: 'Improved deep linking from Cloud Sync preferences to Data Management; it now accurately navigates and centers the section on screen.' }
    ]
  },
  {
    version: 'v5.9.2',
    date: '2026-05-12',
    time: '06:55:00',
    title: 'Talent Unlock Celebration',
    items: [
      { category: 'UX', description: 'Added a colorful confetti effect when successfully unlocking a new talent, providing better visual feedback for progression.' }
    ]
  },
  {
    version: 'v5.9.1',
    date: '2026-05-12',
    time: '06:53:00',
    title: 'Talent Auto-Activation',
    items: [
      { category: 'UX', description: 'Newly unlocked talents are now automatically enabled upon purchase, reducing the need for manual activation.' }
    ]
  },
  {
    version: 'v5.9.0',
    date: '2026-05-12',
    time: '06:50:00',
    title: 'Bulk Session Management',
    items: [
      { category: 'Feature', description: 'Implemented a Bulk Manage tool in Recent Sessions for batch session creation and deletion.' },
      { category: 'Logic', description: 'Batch created sessions now generate random reward options stored in the Treasure Chest for manual claiming.' },
      { category: 'UX', description: 'Added protective warnings for destructive bulk deletions and reminders for multi-tier reward handling.' }
    ]
  },
  {
    version: 'v5.8.1',
    date: '2026-05-12',
    time: '06:42:00',
    title: 'Astral Archives Usability',
    items: [
      { category: 'UX', description: 'Improved sub-page navigation in the Astral Archives modal: the close button now returns to the main view instead of closing the modal.' },
      { category: 'Feature', description: 'Updated outdated instructional content in the Archives modal to reflect current cloud sync mechanics.' }
    ]
  },
  {
    version: 'v5.8.0',
    date: '2026-05-12',
    time: '06:40:00',
    title: 'Astral Archives Robustness',
    items: [
      { category: 'Feature', description: 'Added a 60-second countdown and manual "Cancel Sync" button during cloud synchronization.' },
      { category: 'UX', description: 'Implemented a dedicated "Reset & Retry" UI for handling connection timeouts and sync failures.' },
      { category: 'UX', description: 'Enhanced error reporting during communal archive operations.' }
    ]
  },
  {
    version: 'v5.7.1',
    date: '2026-05-12',
    time: '06:35:00',
    title: 'Expedition Data Portability',
    items: [
      { category: 'Feature', description: 'Added a direct Download button to save Expeditions as a .md file for easier offline archiving.' },
      { category: 'UI', description: 'Added Tooltips and improved interaction feedback for the Import/Export modal.' }
    ]
  },
  {
    version: 'v5.7.0',
    date: '2026-05-12',
    time: '06:30:00',
    title: 'Expedition Markdown Integration',
    items: [
      { category: 'Feature', description: 'Implemented Import and Export functionality for Expeditions using a custom Markdown format.' },
      { category: 'UX', description: 'Added a dedicated modal for managing expedition list serialization and sharing.' },
      { category: 'Logic', description: 'Developed a robust Markdown parser to handle nested tiers and completion rewards during import.' }
    ]
  },
  {
    version: 'v5.6.5',
    date: '2026-05-12',
    time: '06:25:00',
    title: 'Data Safety Clarification',
    items: [
      { category: 'UX', description: 'Enhanced the data deletion warning modal with a reminder that local deletion does not affect cloud-stored archives.' }
    ]
  },
  {
    version: 'v5.6.4',
    date: '2026-05-12',
    time: '06:23:00',
    title: 'Top Bar Simplification',
    items: [
      { category: 'UI', description: 'Removed the redundant page title (e.g., Dashboard) from the header for a more minimalist look.' }
    ]
  },
  {
    version: 'v5.6.3',
    date: '2026-05-12',
    time: '06:21:00',
    title: 'Top Bar Navigation Polish',
    items: [
      { category: 'UI', description: 'Added a persistent "Go Dungeons" link to the top bar when no dungeon is active for better accessibility.' }
    ]
  },
  {
    version: 'v5.6.2',
    date: '2026-05-12',
    time: '06:18:00',
    title: 'Quest Board UI Cleanup',
    items: [
      { category: 'UI', description: 'Removed decorative pins and pinned note rotation from quest items and history list for a cleaner, flatter aesthetic.' }
    ]
  },
  {
    version: 'v5.6.1',
    date: '2026-05-12',
    time: '06:16:00',
    title: 'Chart Visual Cleanup',
    items: [
      { category: 'UI', description: 'Completely suppressed default browser focus outlines on all interactive charts using global CSS overrides.' }
    ]
  },
  {
    version: 'v5.6.0',
    date: '2026-05-12',
    time: '06:14:00',
    title: 'UI Visual Cleanup',
    items: [
      { category: 'UI', description: 'Removed default browser focus outlines from interactive charts for a cleaner visual experience.' }
    ]
  },
  {
    version: 'v5.5.9',
    date: '2026-05-12',
    time: '06:10:00',
    title: 'Chart Interaction Refinement',
    items: [
      { category: 'UX', description: 'Refined background click detection in Weekly Activity charts to ensure reliable tooltip dismissal when clicking empty space.' },
      { category: 'UX', description: 'Unified date formatting in Heatmap and Weekly popovers to display both day of week and full date.' },
      { category: 'Bugfix', description: 'Isolated interactive states between the Bar and Line charts to prevent unintended simultaneous bubble displays.' }
    ]
  },
  {
    version: 'v5.5.8',
    date: '2026-05-12',
    time: '05:48:00',
    title: 'Interactive Chart Decoupling',
    items: [
      { category: 'UX', description: 'Completely decoupled the Weekly Activity Bar Chart and Efficiency Trend Line Chart tooltips, ensuring they act individually instead of displaying simultaneously.' },
      { category: 'Bugfix', description: 'Fixed a bug where interacting with the Bar Chart would not trigger its independent popover immediately.' },
      { category: 'Bugfix', description: 'Fixed an issue where clicking empty space within the Weekly Activity charts failed to dismiss active tooltips.' }
    ]
  }
];
