export const APP_VERSION = 'v6.7.2';
export const LAST_UPDATE_DATE = '2026-05-14';
export const LAST_UPDATE_TIME = '16:35:00';

export interface ReleaseLog {
  version: string;
  date: string;
  time: string;
  title: string;
  items: { category: string; description: string }[];
}

export const RELEASE_HISTORY: ReleaseLog[] = [
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
