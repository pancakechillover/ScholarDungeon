export const APP_VERSION = 'v8.10.36';
export const LAST_UPDATE_DATE = '2026-06-20';
export const LAST_UPDATE_TIME = '23:59:59';

export interface ReleaseLog {
  version: string;
  date: string;
  time: string;
  title: string;
  items: { category: string; description: string }[];
}

export const RELEASE_HISTORY: ReleaseLog[] = [
  {
    version: 'v8.10.36',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Explore Viewport Strict Height Enforcements',
    items: [
      { category: 'Architecture', description: 'Removed overflow-hidden constraints allowing normal page scrollability for historical panels gracefully.' },
      { category: 'UI/UX', description: 'Upgraded CSS Grid parameters replacing stretch intrinsic heights with exact viewport offset coordinates (calc). Enforced the Timer module stays perfectly within the fold bounding limits regardless of active tall secondary content.' }
    ]
  },
  {
    version: 'v8.10.35',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Explore Viewport Timer Visibility Restoration',
    items: [
      { category: 'Bug Fix', description: 'Resolved critical disappearance of the active timer and focus controls on widescreen environments.' },
      { category: 'UI/UX', description: 'Re-programmed structural height inheritance inside the flex-grid hybrid layout, securing perfect visibility of all timer buttons without expanding beyond viewport vertical boundaries.' }
    ]
  },
  {
    version: 'v8.10.34',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Explore Viewport Vertical Constraints Optimization II',
    items: [
      { category: 'UI/UX', description: 'Re-programmed the Explore dashboard structural viewport grid calculations from fixed screen heights to dynamic offsets.' },
      { category: 'UI/UX', description: 'Eliminated vertical scrolling on wide landscape screens, natively bounding the timer module perfectly within a single view without clipping buttons or leaving empty whitespace.' }
    ]
  },
  {
    version: 'v8.10.33',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Explore Viewport Vertical Constraints Optimization',
    items: [
      { category: 'UI/UX', description: 'Re-programmed the Explore dashboard structural viewport grid calculations from fixed screen heights to dynamic offsets.' },
      { category: 'UI/UX', description: 'Eliminated vertical scrolling on wide landscape screens, natively bounding the timer module perfectly within a single view without clipping buttons.' }
    ]
  },
  {
    version: 'v8.10.32',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Cloud History Memory Restoration Fix',
    items: [
      { category: 'Bug Fix', description: 'Resolved critical restoration error in Cloud History where pulling backups failed to restore active dungeon and quest data correctly due to internal storage key mismatches.' }
    ]
  },
  {
    version: 'v8.10.31',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Global Page Padding & Layout Standardization',
    items: [
      { category: 'UI/UX', description: 'Standardized layout constraints across all major dashboard views (Expedition, Explore, Talent Tree, Merchant\'s Outpost, Reward Vault, Record) to ensure identical inner padding scaling, unified banner spacing, and symmetrical screen gutters across device viewports.' }
    ]
  },
  {
    version: 'v8.10.30',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Italic Clipping Prevention and Spacer Safety',
    items: [
      { category: 'Bug Fix', description: 'Resolved page header title right-side truncation on the Expedition tab and Agenda views caused by italic text styling.' },
      { category: 'UI/UX', description: 'Added proper trailing safety padding and fluid spacers ensuring dynamic headings preserve geometric rendering bounds across various devices.' }
    ]
  },
  {
    version: 'v8.10.29',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Expedition Horizon Active Day Contrast Enhancement',
    items: [
      { category: 'UI/UX', description: 'Re-engineered the Today active cell on Expedition Horizon using a vibrant, theme-aware background to eliminate any dark, muddy default appearance.' },
      { category: 'UI/UX', description: 'Upgraded typography contrast dynamically, applying soft white text with a prominent light drop shadow on dark themes and a clean dark indigo layout on light themes.' }
    ]
  },
  {
    version: 'v8.10.28',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Expedition Blueprint Mobile Optimization',
    items: [
      { category: 'UI/UX', description: 'Optimized spacing, truncation and alignments for the Expedition Blueprint component on compact mobile viewports.' },
      { category: 'Feature', description: 'Added Fullscreen preview mode for Expedition Blueprint plans for improved reading and editing fidelity.' }
    ]
  },
  {
    version: 'v8.10.26',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Sage Bubble Theme Adaptability',
    items: [
      { category: 'Bug Fix', description: 'Repaired critical legibility issue where Sage\'s chat bubbles rendered with white inverted prose text against Light background themes.' },
      { category: 'UI/UX', description: 'Re-engineered React Markdown components using a custom `.prose-sage` typography class mapped 1:1 with native CSS theme variables.' },
      { category: 'UI/UX', description: 'Restored generous horizontal padding in Sage\'s bubbles by removing restrictive mobile italic-clipping bounds.' }
    ]
  },
  {
    version: 'v8.10.25',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Sage\'s Council Native Theme Inversion Optimization',
    items: [
      { category: 'Architecture', description: 'Removed hardcoded explicit light mode conditional branch blocks (`isDarkTheme ? A : B`) throughout Sage\'s Council layout containers.' },
      { category: 'UI/UX', description: 'Unified structural colors to standard foundational Dark Semantic Tokens (e.g. `bg-slate-900`) to perfectly align with Sanctum Plaza architectures, unlocking the app\'s native CSS inversion engine for Light themes.' }
    ]
  },
  {
    version: 'v8.10.24',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Consultations Sanctum Color Customization',
    items: [
      { category: 'UI/UX', description: 'Re-engineered the Consultations layout color schema in the Dashboard and Settings to perfectly match the sleek "Sanctum Plaza" aesthetic.' },
      { category: 'UI/UX', description: 'Replaced rigid dark indigo backgrounds, borders, and hardcoded texts with polished, theme-aware neutral slate pallets accented with intentional active indicators.' }
    ]
  },
  {
    version: 'v8.10.23',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Consultations Mobile Popup Drawer Layout',
    items: [
      { category: 'UI/UX', description: 'Re-designed Consultations sidebar into an absolute overlay drawer with backdrop strictly on mobile screens, replicating modern AI chat interface spatial behaviors.' },
      { category: 'UI/UX', description: 'Integrated dynamic auto-closing bounds ensuring the Consultations drawer immediately conceals itself upon topic selection saving physical viewport area on constrained devices.' }
    ]
  },
  {
    version: 'v8.10.22',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Expedition Horizon Mobile Header Optimization',
    items: [
      { category: 'UI/UX', description: 'Optimized Expedition Horizon header spacing and padding on mobile screens to prevent text overflow and layout wrapping.' },
      { category: 'UI/UX', description: 'Shortened dynamic title label on narrow displays to custom Horizon form, while preserving the full Expedition Horizon title on standard sizes.' }
    ]
  },
  {
    version: 'v8.10.21',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Study Heatmap Year Summary Layout Refinement',
    items: [
      { category: 'UI/UX', description: 'Displayed the "Year Summary" card fixedly below the large year heatmap calendar, avoiding side-by-side columns and centering it perfectly.' },
      { category: 'UI/UX', description: 'Re-organized the internal sub-cards of the Year Summary into a neat, balanced 2-column/2x2 grid on standard displays for optimal spacing and density.' }
    ]
  },
  {
    version: 'v8.10.20',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Study Heatmap Year Summary',
    items: [
      { category: 'Feature', description: 'Enabled the same detailed summary module (Total/Avg metrics) seamlessly inside the Year View of the Heatmap.' }
    ]
  },
  {
    version: 'v8.10.19',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Study Heatmap Layout Center Alignment',
    items: [
      { category: 'UI/UX', description: 'Centering both the heatmap calendar cards and summary nodes horizontally inside standard container viewports.' }
    ]
  },
  {
    version: 'v8.10.18',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Study Heatmap Cards Centered Layout',
    items: [
      { category: 'UI/UX', description: 'Re-aligned Study Time, Gold Earnings, and EXP Earnings statistics total and average metrics to be beautifully grouped inside the card center, avoiding separation to extreme left and right margins on wide viewports.' }
    ]
  },
  {
    version: 'v8.10.17',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Study Heatmap Cards Realignment',
    items: [
      { category: 'UI/UX', description: 'Consolidated Total Time and Daily Average Time stats into a single unified Study Time metric card.' },
      { category: 'UI/UX', description: 'Standardized and adjusted text labels and icon sizes for Gold Earnings and EXP Earnings cards to align exactly with Focused Days card.' },
      { category: 'Typography', description: 'Optimized typography for the 30 Days Summary header, scaling it down to a more precise, elegant text size.' }
    ]
  },
  {
    version: 'v8.10.16',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Study Heatmap Summary Cards Consolidation',
    items: [
      { category: 'UI/UX', description: 'Consolidated Gold Total and Avg cards into a single elegant metrics card. Consolidated EXP Total and Avg cards into a single card.' },
      { category: 'UI/UX', description: 'Replaced XP badge icons with matching Zap icons from daily metrics.' },
      { category: 'Typography', description: 'Optimized typography hierarchy by scaling up the main 30 Days Summary header to the largest prominent size in the panel.' }
    ]
  },
  {
    version: 'v8.10.15',
    date: '2026-06-20',
    time: '23:59:59',
    title: 'Study Heatmap Rich Summary UI',
    items: [
      { category: 'Feature', description: 'Enriched the 30 Days/Month/Year timeframe summary by showing total accumulated Time, percentages, and cleanly aligned metrics across the board.' },
      { category: 'UI/UX', description: 'Redesigned the heatmap summary card utilizing modern Lucide icon pairings, intelligent mobile-responsive grid spanning, and replacing legacy plain-text emojis.' }
    ]
  }
];
