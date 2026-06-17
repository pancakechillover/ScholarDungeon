export const APP_VERSION = 'v8.8.0';
export const LAST_UPDATE_DATE = '2026-06-17';
export const LAST_UPDATE_TIME = '05:38:00';

export interface ReleaseLog {
  version: string;
  date: string;
  time: string;
  title: string;
  items: { category: string; description: string }[];
}

export const RELEASE_HISTORY: ReleaseLog[] = [
  {
    version: 'v8.8.0',
    date: '2026-06-17',
    time: '05:38:00',
    title: 'Version Bump',
    items: [
      { category: 'General', description: 'Updated version to 8.8.0.' }
    ]
  },
  {
    version: 'v8.7.42',
    date: '2026-06-17',
    time: '05:35:00',
    title: 'Fellowship Data Parsing Resilience',
    items: [
      { category: 'Bug Fix', description: 'Implemented safeJsonParse in api/teams to securely handle corrupted Redis list entries for members, messages, events, applicants, and proposals. Corrupted data entries are now cleanly skipped instead of inducing fatal 500 errors across the entire Fellowship endpoint.' }
    ]
  },
  {
    version: 'v8.7.41',
    date: '2026-06-17',
    time: '05:27:00',
    title: 'Fellowship Chat Reliability Hardening',
    items: [
      { category: 'Bug Fix', description: 'Strengthened TeamModule sendMessage optimistic UI by adding explicit server validation checks for success, preventing silent message drops and rendering clear error alerts while explicitly rolling back temporary texts upon failure.' },
      { category: 'Security', description: 'Hardened api/teams message endpoint to assert the active requesting userId against current team rosters explicitly, actively blocking external injection.' }
    ]
  },
  {
    version: 'v8.7.40',
    date: '2026-06-17',
    time: '05:25:00',
    title: 'Fellowship Identity Sync Continuity Fixes',
    items: [
      { category: 'Bug Fix', description: 'Hardened identity parsing in api/teams to securely validate userLevel. Existing levels are now safely preserved instead of defaulting to level 1 for empty payloads during background refresh loops.' },
      { category: 'Bug Fix', description: 'Updated Fellowship background polling in App.tsx and manual fetch flows in TeamModule to fully supply standard identity headers (x-user-level, x-user-title, uniqueId, etc.), ensuring guild members dynamically update without information loss over time.' }
    ]
  },
  {
    version: 'v8.7.39',
    date: '2026-06-17',
    time: '11:45:00',
    title: 'Local Storage State Parsing Crash Fix',
    items: [
      { category: 'Bug Fix', description: 'Added proper try-catch handlers when parsing dungeons and majorDungeons from localStorage on init, preventing fatal crashes (white screen) if JSON is corrupted.' }
    ]
  },
  {
    version: 'v8.7.38',
    date: '2026-06-17',
    time: '11:45:00',
    title: 'Dashboard Duration Statistics Core Unification',
    items: [
      { category: 'Architecture', description: 'Unified statistical duration formulas across remaining pages including 24-hour modes in DailyPieChart and day/period divisions in WeeklyPieChart via getSessionEffectiveMinutes.' },
      { category: 'Architecture', description: 'Re-routed ExploreView daily active study time and Talent eligibility meters to rely on precise, history-recalculated minutes rather than simple general multipliers.' }
    ]
  },
  {
    version: 'v8.7.37',
    date: '2026-06-17',
    time: '11:25:00',
    title: 'Quest Progress Recalculation Synchronization',
    items: [
      { category: 'Bug Fix', description: 'Implemented local `recalculateQuestProgressFromHistory` helper within useGameState hook, automatically triggered on study session updates and deletions.' },
      { category: 'Bug Fix', description: 'Synchronized quest progress and completion status for daily, weekly, monthly, and lifetime session metrics while completely preserving already claimed reward records and preventing invalid retroactive rollbacks.' }
    ]
  },
  {
    version: 'v8.7.36',
    date: '2026-06-17',
    time: '11:00:00',
    title: 'Statistics Source Unification',
    items: [
      { category: 'Architecture', description: 'Centralized study session duration parsing application-wide by unifying `Stats`, `DailyPieChart`, and `DashboardView` around the newly synchronized `getSessionEffectiveMinutes` and `getSessionSettlementDate` core metrics engines.' },
      { category: 'Architecture', description: 'Re-routed the `DailySummaryModal` total focus logic to bypass volatile state aggregators in favor of robust array mapping identical to the core heatmaps.' },
      { category: 'Architecture', description: 'Modified absolute timestamp resolution globally to strictly adhere to Custom Day Start properties and includeRestTimeInTasks definitions without regression.' }
    ]
  },
  {
    version: 'v8.7.35',
    date: '2026-06-17',
    time: '04:00:00',
    title: 'Synced Derived Data for Session Alterations',
    items: [
      { category: 'Bug Fix', description: 'Re-architected `updateSession` to precisely measure delta changes in internal progress structures (`focusDuration`, `duration`, `restDuration`). The logic now synchronously propagates differential updates directly to global `dailySessions`, associated `dungeon completedSessions`, baseline `coins`, and core `xp`. Incorporates complete local transaction rollback processing via `processTransaction` correctly preventing sub-zero state corruption while logging explicit historical modification contexts locally whenever a previous session is edited.' }
    ]
  },
  {
    version: 'v8.7.34',
    date: '2026-06-17',
    time: '03:32:00',
    title: 'Unified Quest Reward Application Logic',
    items: [
      { category: 'Architecture', description: 'Created a centralized internal helper `applyQuestReward` in `useGameState.ts` to process quest-related grants uniformly across all subsystems. Replaced hardcoded fragmented reward assignment logic previously scattered inside the automated popup handler, singular manual `claimQuestReward`, and bulk `claimAllQuestRewards` workflows. This guarantees that standard metrics like Experience, Gold, Talent Scrolls, Shards, Death Defying Gold Medals, Double XP, and Double Coin cards all obey exact symmetrical parsing operations with synchronized `rewardHistory` recording strictly without data loss or duplication risks.' }
    ]
  },
  {
    version: 'v8.7.33',
    date: '2026-06-17',
    time: '03:15:00',
    title: 'Cloud Sync Hook Dependencies Update',
    items: [
      { category: 'Bug Fix', description: 'Unified and appended missing React dependencies (`isInitialSyncCheckDone`, `isCooledDown`, `isSyncing`, `isVerifying`, `stripVolatile`, etc.) directly into `syncToCloud`, `checkCloudSync`, and `fetchFromCloud` `useCallback` arrays to eliminate stale closure references.' }
    ]
  },
  {
    version: 'v8.7.32',
    date: '2026-06-17',
    time: '03:12:00',
    title: 'Cloud Auto-Sync Config Triggers Integration',
    items: [
      { category: 'Bug Fix', description: 'Unified automated sync triggers (`debounce`, `interval`, `Visibility API Active`, `beforeunload`) extending support natively for `WebDAV` and `Google Drive` providers without explicitly demanding `state.secretCode` presence. Safeguarded these event triggers fully within `isInitialSyncCheckDone` integrity locks globally.' }
    ]
  },
  {
    version: 'v8.7.31',
    date: '2026-06-17',
    time: '02:55:00',
    title: 'Cloud Sync State Race Fixes',
    items: [
      { category: 'Bug Fix', description: 'Repaired false positive cloud newer conditions. Modified `syncToCloud` internal timestamp comparisons securely falling back to `getSyncFingerprint` evaluation. Eliminates local creation timestamp override loops incorrectly wiping cloud archives passively.' },
      { category: 'Bug Fix', description: 'Hardened hook dependency logic inside `syncToCloud`, accurately tying references back to `isInitialSyncCheckDone` preventing stale closure resets globally.' },
      { category: 'Security', description: 'Barricaded `checkCloudSync` logic explicitly removing auto-sync unlock triggers inside error, catch, and offline paths. System accurately enforces absolute verification checks retaining lock bounds successfully during 404 or down service timeouts.' },
    ]
  },
  {
    version: 'v8.7.30',
    date: '2026-06-17',
    time: '02:40:00',
    title: 'Cloud Sync Fingerprint Comparison & Initial Integrity Lock',
    items: [
      { category: 'Bug Fix', description: 'Replaced strict string comparisons with a robust, order-agnostic fingerprinting engine (`getSyncFingerprint`). This securely excludes local volatile data (e.g., `deviceNickname`, `syncHistory`, `lastUpdated`) eliminating false-positive cloud conflict prompts.' },
      { category: 'Bug Fix', description: 'Added an `isInitialSyncCheckDone` safety mutex explicitly blocking automated background sync triggers (like tab-blur, before-unload, debounce, generic state-initialize logic) until the app successfully queries and compares with the target remote endpoint exactly once at startup, decisively arresting cross-device overwrite races immediately during bootstrap.' },
      { category: 'UI/UX', description: 'Upgraded Conflict Resolution modal text providing definitive overwrite warnings.' }
    ]
  },
  {
    version: 'v8.7.29',
    date: '2026-06-17',
    time: '08:42:00',
    title: 'Quest Auto-Claim Multiple Rewards Support',
    items: [
      { category: 'Bug Fix', description: 'Upgraded quest popup auto-claim logic to accurately process and deploy plural rewards natively for quests supplying multiple simultaneous grants, guaranteeing total payout symmetry with manual user claim pathways.' }
    ]
  },
  {
    version: 'v8.7.28',
    date: '2026-06-17',
    time: '08:38:00',
    title: 'Daily Log Field Preservation Fix',
    items: [
      { category: 'Bug Fix', description: 'Modified saveDailyLog() engine structurally preserving existing sibling attributes like native sleep tracking metrics (sleepTime, wakeTime) by merging current object instances flawlessly prior to asserting incoming rating updates instead of blindly rewriting the targeted date slice and clipping historical sub-elements.' }
    ]
  },
  {
    version: 'v8.7.27',
    date: '2026-06-17',
    time: '07:30:00',
    title: 'State Engine Accuracy Fixes & Progression Hooks',
    items: [
      { category: 'Bug Fix', description: 'Mapped XP and gold coins granted directly through claimDailyTalentReward() explicitly back into core scaling matrices natively.' },
      { category: 'Bug Fix', description: 'Overhauled internal data map dependencies handling immediate major dungeon cascade completion triggers within completeSession(), preventing an uninitialized structural reference from inducing fatal app stalls.' }
    ]
  },
  {
    version: 'v8.7.26',
    date: '2026-06-16',
    time: '22:15:00',
    title: 'Start of the Day Optional Toggle',
    items: [
      { category: 'Feature', description: 'Added a toggle switch within General Settings to enable the "Start of the Day" prompt. The automatic popup is now disabled by default, honoring the minimalist workflow while giving users the option to reactivate the daily check screen on first load.' }
    ]
  },
  {
    version: 'v8.7.25',
    date: '2026-06-16',
    time: '08:20:39',
    title: 'Removed Hardcoded Passwords',
    items: [
      { category: 'Security / UI UX', description: 'Removed all bypassable frontend hardcoded passwords masking Developer Mode and Cloud integrators (like Google Drive). Migrated entry barriers into fully transparent Acknowledgement and experimental warnings dialogues, accurately establishing the testing limits rather than simulating secure walls.' }
    ]
  },
  {
    version: 'v8.7.24',
    date: '2026-06-16',
    time: '08:15:30',
    title: 'WebDAV Proxy SSRF Hardening',
    items: [
      { category: 'Security', description: 'Hardened the WebDAV proxy endpoints against Server-Side Request Forgery. Enforced strict HTTP/HTTPS protocol validation, effectively blocked all interactions with localhost, zero-client network ranges, internal loopbacks, and metadata servers. Restricted payloads to 10MB bounds.' }
    ]
  },
  {
    version: 'v8.7.23',
    date: '2026-06-16',
    time: '03:31:00',
    title: 'Google OAuth Origin Security',
    items: [
      { category: 'Security', description: 'Hardened Google OAuth postMessage flows across server endpoints. Implemented strict isValidOrigin checking to ensure all callback parameters only return tokens to approved application origins.' }
    ]
  },
  {
    version: 'v8.7.22',
    date: '2026-06-16',
    time: '03:22:00',
    title: 'Sage Proxy Model Whitelist',
    items: [
      { category: 'Security', description: 'Hardened the /api/sage proxy endpoint by enforcing a strict model whitelist. Unapproved model names are sanitized and overridden to the baseline default, preventing potential prompt injection or exploitation of unsupported models.' }
    ]
  },
  {
    version: 'v8.7.21',
    date: '2026-06-16',
    time: '03:17:00',
    title: 'VAPID Endpoints 503 Guard',
    items: [
      { category: 'Security', description: 'Explicitly hardened Web Push functionality by asserting isVapidConfigured flags across server.ts and api/push.ts. Active scheduler tick loops and operational endpoints now comprehensively short-circuit with 503 Service Unavailable if server keys are absent, neutralizing silent crashes.' }
    ]
  },
  {
    version: 'v8.7.20',
    date: '2026-06-16',
    time: '03:04:00',
    title: 'Sage Proxy API Security Hardening',
    items: [
      { category: 'Security', description: 'Hardened the /api/sage proxy endpoint against abuse by enforcing strict payload sizes (32KB / 50 messages limit) and suppressing upstream stack traces from client exposure.' }
    ]
  },
  {
    version: 'v8.7.19',
    date: '2026-06-16',
    time: '02:58:00',
    title: 'Safe Export Data Scrubbing',
    items: [
      { category: 'Security', description: 'Hardened the "Safe Export" utility by implementing a recursive credential scrubber, ensuring all sensitive fields (e.g. sageApiKey, access tokens) are completely stripped from the output.' }
    ]
  },
  {
    version: 'v8.7.18',
    date: '2026-06-16',
    time: '02:50:00',
    title: 'Gemini API Key Security Hardening',
    items: [
      { category: 'Security', description: 'Removed GEMINI_API_KEY from vite.config.ts to prevent key injection into the client bundle. Site default Gemini processing now securely proxies through a backend Node.js (/api/sage) instance, whilst fully preserving user custom API key entry capabilities directly on the frontend.' }
    ]
  },
  {
    version: 'v8.7.17',
    date: '2026-06-15',
    time: '19:44:00',
    title: 'VAPID Key Security Hardening',
    items: [
      { category: 'Security', description: 'Extracted hardcoded fallback VAPID private and public keys. Web push securely requires valid environment VAPID_KEY variables exclusively, rejecting unencrypted payloads and hard failures cleanly via console output.' }
    ]
  },
  {
    version: 'v8.7.16',
    date: '2026-06-09',
    time: '15:20:00',
    title: 'Explore View Height Constraint Lock',
    items: [
      { category: 'UI/UX', description: 'Enforced strict absolute height bounds inside the Explore View matrix across desktop and tablet screen sizes subtracting exactly the PageHeader and top navigation menu pixel dimensions explicitly. The countdown timer and control interface now correctly respect container bounds, shrinking dynamically and sealing into the available viewport height cleanly without generating a page scroll.' }
    ]
  },
  {
    version: 'v8.7.15',
    date: '2026-06-09',
    time: '12:45:00',
    title: 'Timer Zero-State Override Bug Fix',
    items: [
      { category: 'Bug Fix', description: "Repaired a severe state race-condition where manually skipping the timer via long-press would strand the display at 0:00 instead of naturally progressing into Rest cycles, next loop phases, or resetting the clock cleanly due to event loop batching issues." }
    ]
  },
  {
    version: 'v8.7.14',
    date: '2026-06-09',
    time: '12:30:00',
    title: 'Loot Pool Real-Time Probability & Frequency Bug Fixes',
    items: [
      { category: 'Feature', description: "Added Real-Time Loot Pool Probability tracker directly inside the reward settings. Users can now view precisely computed drop weights adjusted for their current daily frequency limits." },
      { category: 'Bug Fix', description: "Repaired array length caching logic inside the internal reward card generator causing 'Extra Chance' draws (C1/C2) to occasionally prematurely terminate yielding only 2 or 3 choices instead of a full spread." },
      { category: 'Architecture', description: "Repaired the 'Pending Occurrences' filter logic correctly ignoring the specific chest being actively re-rolled to accurately assess constraints during dynamic shuffles." }
    ]
  },
  {
    version: 'v8.7.13',
    date: '2026-06-09',
    time: '11:30:00',
    title: 'Timer Skip Behaviors & Sync Conflict Prevention',
    items: [
      { category: 'Feature', description: "Enabled single-click skips on the Timer allowing an instant completed-session jump strictly granting full rewards and durations natively." },
      { category: 'Bug Fix', description: "Hardened long-press logic correctly triggering phase transitions natively using strictly modified endTimes matching worker logic securely without batching conflicts." },
      { category: 'Bug Fix', description: "Repaired a severe cloud race condition inside the api server aggressively detecting deviceCode discrepancies, explicitly blocking forceful direct local uploads and triggering 409 Merge Conflict pipelines gracefully even if local timestamps are newer." }
    ]
  },
  {
    version: 'v8.7.12',
    date: '2026-06-08',
    time: '07:30:00',
    title: 'Sidebar Global Pulse & Background Notification',
    items: [
      { category: 'Feature', description: "Integrated an active polling watcher on Fellowship parameters. The main Sanctum navigation icon will now pulse with a red notification dot immediately upon detecting new Guild messages or pending applicants." },
      { category: 'Feature', description: "Bound the active timer state into the overarching navigation layout, automatically activating a persistent red indicator on the Explore tab whenever an active focus session is running." }
    ]
  },
  {
    version: 'v8.7.11',
    date: '2026-06-07',
    time: '15:15:00',
    title: 'Cloud Synchronization Logic & Integrity Repairs',
    items: [
      { category: 'Bug Fix', description: "Repaired a harsh overwrite condition during session completions where `syncToCloud` invoked a forced override by default. It now properly honors device mismatches, pulling up the Conflict Resolution modal seamlessly when foreign device activity is detected." },
      { category: 'Bug Fix', description: "Aligned the 'Manual Sync' button on the Cloud Data UI to strictly run safe identity checks before executing structural overwrites against disjointed remote saves." }
    ]
  },
  {
    version: 'v8.7.10',
    date: '2026-06-07',
    time: '14:40:00',
    title: 'Fellowship Modals & UUID Continuity Fixes',
    items: [
      { category: 'Bug Fix', description: "Repaired broken UUID generation strategies inside Fellowship tools utilizing resilient cross-origin Math.random fallbacks, restoring functionality for joining, updating, and saving team data on insecure or restricted iframes natively." },
      { category: 'UI/UX', description: "Restored and anchored the missing global Confirm Dialog portals directly into the overarching Fellowship components, ensuring critical confirmations and alerts systematically render across all interactions cleanly." }
    ]
  },
  {
    version: 'v8.7.9',
    date: '2026-06-07',
    time: '14:30:00',
    title: 'Expedition Horizon Mobile Refinements & Layout Fixes',
    items: [
      { category: 'UI/UX', description: "Reverted Expedition Horizon layout from horizontal scrollback into an adaptive two-row grid on mobile screens specifically, optimizing layout space." },
      { category: 'Bug Fix', description: "Removed parent hidden constraints allowing zoomed date cards on desktop arrays to smoothly escape bounding boxes naturally instead of shearing edges unpleasantly." }
    ]
  },
  {
    version: 'v8.7.8',
    date: '2026-06-07',
    time: '14:50:00',
    title: 'Sleep Record Exports & Tablet Layout Expansion',
    items: [
      { category: 'Feature', description: "Added independent toggle controls to optionally show or hide the Sleep Tracker specifically when generating shared Image Exports." },
      { category: 'UI/UX', description: "Upgraded the Sleep Tracker chart visualization utilizing a direct point-to-point (linear) slope projection, dramatically improving data path readability." },
      { category: 'UI/UX', description: "Expanded the 30-Days heatmap dashboard to responsively pair alongside the statistics summary widget directly on Tablet screen dimensions (1024px) utilizing fluid flex properties." },
      { category: 'UI/UX', description: "Refactored the Year Heatmap view to properly expose aggregated statistics and unified the entire heatmap Y-axis to dynamically start on Monday globally." }
    ]
  },
  {
    version: 'v8.7.7',
    date: '2026-06-07',
    time: '14:40:00',
    title: 'Expedition Horizon State Persistence & Mobile Expansion',
    items: [
      { category: 'Feature', description: "Persisted the 'Recent 7 Days' and 'Current Week' Expedition Horizon view preferences across sessions by securely wrapping the selector variable inside durable local storage." },
      { category: 'UI/UX', description: "Re-engineered the Expedition Horizon grid into a smooth scrollable horizontal layout specifically for mobile screens, radically expanding the tap target boxes of individual calendar days to resolve narrow compression." }
    ]
  },
  {
    version: 'v8.7.6',
    date: '2026-06-07',
    time: '14:30:00',
    title: 'Long-Press Seamless Automation & Fractional Statistics',
    items: [
      { category: 'Bug Fix', description: "Unconditionally mapped manual long-press skip operations to strictly obey the user's 'Skip Victory Screen' (timerSkipVictoryMode) preferences natively, enabling seamless automatic transitions directly into the respective Rest loop or next interval exactly like a standard timer completion." },
      { category: 'Architecture', description: "Enforced strict integer rounding behavior on elapsed durations during skip operations, ensuring partial skip times uniquely snap to explicit minutes (or minimum 1 minute thresholds). This securely logs exact rounded values directly into Sanctum progress, team logs, records, heatmaps, and quest goals." }
    ]
  },
  {
    version: 'v8.7.5',
    date: '2026-06-07',
    time: '14:00:00',
    title: 'Restored Long-Press Skip Continuity',
    items: [
      { category: 'Bug Fix', description: "Reverted fractional skip logging and restored full-duration credit on manual skip, ensuring skipped sessions once again accurately drive Sanctum, Quests, Expedition, and Fellowship progress identically to previous versions." },
      { category: 'Bug Fix', description: "Permitted manual long-press skips to once again correctly obey user 'Skip Victory Screen' (timerSkipVictoryMode) automation settings, seamlessly entering the Rest loop automatically without popup interruptions." }
    ]
  },
  {
    version: 'v8.7.4',
    date: '2026-06-07',
    time: '13:00:00',
    title: 'Accurate Integer Skip Logic & Rest Continuity',
    items: [
      { category: 'Bug Fix', description: "Repaired the long-press skip action so that the skipped absolute focus duration is correctly logged as a cleanly rounded integer. This resolves fractional timing issues, ensuring that the exact elapsed time correctly factors into Sanctum progress, team charts, Expedition logs, and quests smoothly." },
      { category: 'Bug Fix', description: "Mapped manual long-press skip triggers to unconditionally bypass any automatic timerSkipVictoryMode 'Skip Victory Screen' logic, ensuring the standard reward selection UI popup appears correctly during manual skip." }
    ]
  },
  {
    version: 'v8.7.3',
    date: '2026-06-07',
    time: '12:30:00',
    title: 'Long Press Skip Interaction & Fractional Reward Sync',
    items: [
      { category: 'Feature', description: "Transformed the Timer 'Skip' button into a secure 3-second 'Long-Press to Skip' interaction, complete with an animated SVG radial progress ring to prevent accidental skips." },
      { category: 'Architecture', description: "Upgraded actual duration and focus propagation, injecting partial time accurately into completeSession so that skipped blocks are logged linearly matching EXACT milliseconds elapsed across Sanctum, Fellowship channels, records, Heatmaps, and Quests flawlessly." },
      { category: 'Bug Fix', description: "Repaired the Reward chest logic forcing Math.max(1, drawCount) ensuring short fractional skipped sessions consistently guarantee a minimum 1x baseline reward draw." },
      { category: 'Bug Fix', description: "Repaired a typescript mapping error inside DailySessionsModal resulting from mismatched includeRestTimeInTasks properties." }
    ]
  },
  {
    version: 'v8.7.2',
    date: '2026-06-07',
    time: '11:30:00',
    title: 'Time-Based Calculation Expansion',
    items: [
      { category: 'Feature', description: "Promoted 'Include Rest Time in Tasks' to be enabled by default and relocated its configuration block to the primary Timer Settings dashboard." },
      { category: 'Architecture', description: "Synchronized sessionDurationVal, getAddedProgress, and global statistics engines to uniformly incorporate rest durations into calculations uniformly when the setting is active." },
      { category: 'System', description: "Mapped the extended Rest + Focus unified progression into quests tracking, Sanctum daily progress, Expeditions, records, stats heatmaps, and Fellowship Team aggregate broadcasts seamlessly." },
      { category: 'Bug Fix', description: "Repaired inaccurate Quest type mappings in constants directly converting generic task string checks into true session-scaled increments." }
    ]
  },
  {
    version: 'v8.7.1',
    date: '2026-06-07',
    time: '10:55:00',
    title: 'Manual Talent Triggers',
    items: [
      { category: 'Feature', description: "Reconstructed A2, B2, A3, and B3 to be manually claimed exclusively via the Active Talents tooltip instead of automated quest progression." },
      { category: 'Architecture', description: "Shifted daily time thresholds directly to exact explicit durations (8 hours for A2/B2, 4 hours for A3/B3)." },
      { category: 'UI/UX', description: "Added detailed visual progress bars into the tooltip representing total minutes logged today out of required limits." },
      { category: 'Bug Fix', description: "Expanded active talent descriptions outlining hard limit streak caps precisely up to 10 days." },
      { category: 'System', description: "Removed redundant q_special fallback automated quests directly from generation memory cleanly." }
    ]
  },
  {
    version: 'v8.7.0',
    date: '2026-06-07',
    time: '05:40:00',
    title: 'Streak Record & Missing Day Interactions',
    items: [
      { category: 'Bug Fix', description: "Repaired a synchronization mismatch causing the available Death Defying Gold Medals counter inside the primary Activity Record dashboards to drift away from the core inventory bounds, accurately linking them directly to state." },
      { category: 'Feature', description: "Enforced click actions directly onto missed day grids inside the Start of the Day prompt; failing days now gracefully ask to patch using items or launch a missing item info modal cleanly." }
    ]
  },
  {
    version: 'v8.6.32',
    date: '2026-06-07',
    time: '05:00:00',
    title: 'Events Synchronization & Notification Throttling',
    items: [
      { category: 'Bug Fix', description: "Identified and resolved an asynchronous race condition within the localized timing execution logic triggering rare duplicate record logs inside the recent memory interface concurrently during high latency interactions." },
      { category: 'Bug Fix', description: "Deduplicated active Web Push scheduler queue streams securely in the background container, terminating overlapping reminder notifications globally natively." },
      { category: 'UI/UX', description: "Instructed embedded popup modal sub-navigation sequences (originating from milestone achievements) to explicitly shatter enclosing native browser full-screen contexts automatically prior to cross-routing." }
    ]
  },
  {
    version: 'v8.6.31',
    date: '2026-06-06',
    time: '16:20:00',
    title: 'Top Bar Streak Cross-Day Synchronization',
    items: [
      { category: 'Bug Fix', description: "Unified the top bar streak active calculation logic with the global getSettlementDay engine, ensuring the red/orange streak indicator correctly respects the user's custom Activity Time Peaks thresholds for cross-day study sessions." }
    ]
  },
  {
    version: 'v8.6.30',
    date: '2026-06-06',
    time: '16:05:00',
    title: 'Horizon Typography Contrast Optimization',
    items: [
      { category: 'Bug Fix', description: "Repaired CSS text color mapping issues inside the Expedition popup explicitly targeting Daylight light themes utilizing automated inversion properties perfectly." },
      { category: 'UI/UX', description: "Adapted all primary font headers directly to high-contrast variables internally, resulting in sharp, dark text universally for daylight, candy, and warm themes." }
    ]
  },
  {
    version: 'v8.6.29',
    date: '2026-06-06',
    time: '15:45:00',
    title: 'Horizon Light Theme Adaptability Fix',
    items: [
      { category: 'Bug Fix', description: "Repaired visual inversion glitch causing Expedition Horizon backgrounds to render completely dark under Light Themes. Used standardized bg-slate-900 maps consistently." },
      { category: 'UI/UX', description: "Ensured inner widgets and the calendar grid cleanly transition into bright interfaces for Daylight, Warm Sun, and Candy themes automatically." }
    ]
  },
  {
    version: 'v8.6.28',
    date: '2026-06-06',
    time: '15:25:00',
    title: 'Universal Calendar Interactions',
    items: [
      { category: 'Feature', description: "Detached the Expedition Horizon popover constraints, allowing users to universally trigger information capsules for any selected date across the calendar whether active or not." },
      { category: 'UI/UX', description: "Integrated dynamic 'No Deadlines Today' placeholder states inside empty date tooltips, featuring direct redirection routing cleanly into the main Dungeon management menus." }
    ]
  },
  {
    version: 'v8.6.27',
    date: '2026-06-06',
    time: '15:15:00',
    title: 'Horizon Theme CSS Polish',
    items: [
      { category: 'Feature', description: "Added dynamic DDL counter badge directly onto the Horizon DatePicker trigger and replaced generic star dots with theme-colored dot indicators internally." },
      { category: 'UI/UX', description: "Remapped Expedition Horizon Sword icons and drop-shadows to inherit primary theme mappings (Indigo overrides), perfectly adapting to Daylight, Focus, Ocean, Candy, and Night constraints." }
    ]
  },
  {
    version: 'v8.6.26',
    date: '2026-06-06',
    time: '15:00:00',
    title: 'Dynamic Horizon Date Selection',
    items: [
      { category: 'Feature', description: "Integrated an interactive Date Picker directly into the Expedition Horizon header, allowing seamless arbitrary start-date shifts." },
      { category: 'UI/UX', description: "Hardened calendar cell container scaling by explicitly differentiating light/dark themes utilizing native drop-shadows vs crisp indigo borders contextually." }
    ]
  },
  {
    version: 'v8.6.25',
    date: '2026-06-06',
    time: '14:55:00',
    title: 'Dashboard Calendar Horizon Refinements',
    items: [
      { category: 'Feature', description: "Added a toggle to the Expedition Horizon allowing users to seamlessly switch between a 'Recent 7 Days' rolling perspective and a fixed 'Current Week' schedule." },
      { category: 'UI/UX', description: "Engineered comprehensive CSS updates prioritizing light and dark theme adaptivity across the Calendar matrix, increasing overall refinement." }
    ]
  },
  {
    version: 'v8.6.24',
    date: '2026-06-06',
    time: '14:48:00',
    title: 'Dashboard Calendar & Expedition Tagging Polish',
    items: [
      { category: 'Feature', description: "Added dynamic deadline tags directly onto Expedition entries in the Dungeon Manager, prioritizing visual mapping of active versus overdue states." },
      { category: 'UI/UX', description: "Re-engineered the Sanctum's Expedition Schedule from a monthly grid into a focused, highly visible horizontal 7-day rolling horizon." },
      { category: 'UI/UX', description: "Deployed PopoverPortal integration onto the horizon calendar. Clicking target cells summons a detached, layered interface prioritizing impending task data." }
    ]
  },
  {
    version: 'v8.6.23',
    date: '2026-06-06',
    time: '14:38:00',
    title: 'Expedition Deadline Editor Integration',
    items: [
      { category: 'Feature', description: "Bound the underlying deadline data structures directly to the primary Dungeon Editor modal interfaces." },
      { category: 'UI/UX', description: "Upgraded the Create/Edit Expedition and Add/Edit Tier forms with a native DatePicker, enabling seamless deadline configuration during tier creation." }
    ]
  },
  {
    version: 'v8.6.22',
    date: '2026-06-06',
    time: '14:02:00',
    title: 'Sanctum Calendar & Expedition Deadlines',
    items: [
      { category: 'Feature', description: "Added deadline parameters to Expedition structures allowing properly scheduled timed journeys." },
      { category: 'UI/UX', description: "Replaced the central 'Current Quest' welcome module inside the Sanctum header card with a dynamic, highly responsive monthly calendar schedule that automatically maps deadline nodes to upcoming dates." }
    ]
  },
  {
    version: 'v8.6.21',
    date: '2026-06-06',
    time: '13:35:00',
    title: 'Year Heatmap Dynamic Sizing',
    items: [
      { category: 'UI/UX', description: "Re-engineered Year Heatmap sizing calculations utilizing media queries to flexibly adapt block sizes perfectly across multiple viewports and desktop screens." }
    ]
  },
  {
    version: 'v8.6.20',
    date: '2026-06-06',
    time: '10:25:00',
    title: 'Heatmap Dynamic Sizing & Flexible Alignment',
    items: [
      { category: 'UI/UX', description: "Re-engineered Heatmap sizing calculations utilizing CSS custom properties and media queries to cleanly enlarge and adapt cell dimensions according to viewing screen sizes (tablets/desktops)." },
      { category: 'UI/UX', description: "Unified Heatmap and Summary modules within a naturally stretched flex container, securely centering both clusters relative to the parent bounding box." }
    ]
  },
  {
    version: 'v8.6.19',
    date: '2026-06-06',
    time: '10:20:00',
    title: 'Heatmap Layout Fix & SVG Rendering',
    items: [
      { category: 'Bug Fix', description: "Repaired the Heatmap layout engine where the '30 Days Summary' sidebar was inadvertently crushing the heatmap out of bounds by assigning flexible containment via min-w-0." },
      { category: 'UI/UX', description: "Verified and forced solid white strokes onto the mood SVG embedded within Heatmap grids to stand out against all background colors seamlessly." }
    ]
  },
  {
    version: 'v8.6.18',
    date: '2026-06-06',
    time: '10:10:00',
    title: 'Heatmap Summary Alignment & Icon Polish',
    items: [
      { category: 'UI/UX', description: "Enforced strict horizontal layout for the Heatmap's 30-day and monthly modes, decisively pinning the Month Summary pane to the physical right edge of the screen." },
      { category: 'UI/UX', description: "Re-rendered the Heatmap mood svg icons with a solid white fill and standard drop-shadows, completely wiping out broken native mixing-blend CSS operations that caused fading visual bugs." }
    ]
  },
  {
    version: 'v8.6.17',
    date: '2026-06-05',
    time: '16:21:00',
    title: 'Record Dashboard Polish & Analysis Panel',
    items: [
      { category: 'Feature', description: 'Persisted Record dashboard view preferences securely via local storage memory buffers, auto-restoring weekly bounds, heatmap configurations, and visual layout states upon every returning session.' },
      { category: 'UI/UX', description: 'Engineered a highly dense "Month Summary" statistics widget dynamically injected beside 30-day Heatmap graphs, directly addressing trailing empty space layouts with detailed averages and aggregated metadata.' },
      { category: 'UI/UX', description: 'Unified data widget banner nomenclature across all core sections, assigning absolutely mutually exclusive Lucide visualization symbols for superior structural tracking.' },
      { category: 'UI/UX', description: 'Eliminated confusing decimal remnants from Weekly average timing logs, standardizing mathematical scaling cleanly.' }
    ]
  },
  {
    version: 'v8.6.16',
    date: '2026-06-05',
    time: '16:05:00',
    title: 'PWA Immersion & Boot Sequence Polish',
    items: [
      { category: 'UI/UX', description: 'Realigned the automatic "Start of Day" popup routine to strictly queue and trigger only after the initial application visual splash sequence has fully resolved.' },
      { category: 'Bug Fix', description: 'Silenced unintended sound overlap triggers by removing success chimes when loading the Start of Day module.' },
      { category: 'UI/UX', description: 'Implemented a global viewport CSS override terminating native OS desktop scrollbars across PWA installs, replacing the rigid black vertical track with customized internal invisible fluid scrolling.' }
    ]
  },
  {
    version: 'v8.6.15',
    date: '2026-06-05',
    time: '15:55:00',
    title: 'Image Export Quality & Sync Patches',
    items: [
      { category: 'Feature', description: 'Persisted comprehensive user preferences (export mode, layout options, margin settings) securely in local storage, guaranteeing exact user habits are continuously preserved across sessions.' },
      { category: 'UI/UX', description: 'Removed automatic aggressive canvas generation when toggling export settings. Generates strictly through a newly added explicit confirm button, vastly improving stability.' },
      { category: 'Bug Fix', description: 'Resolved severe DOM cloning overlap where asynchronous clicking generated recursive watermarks on continuous diary exports.' },
      { category: 'Bug Fix', description: 'Eliminated clipping bounds that visually truncated absolute position headers and extreme margins during high-resolution snapshotting of the statistical grid.' }
    ]
  },
  {
    version: 'v8.6.14',
    date: '2026-06-05',
    time: '15:20:00',
    title: 'Export History & Image Rendering Patches',
    items: [
      { category: 'Feature', description: 'Engineered an offline local IndexDB Storage wrapper to preserve a comprehensive history of previously generated image records.' },
      { category: 'UI/UX', description: 'Integrated an interactive History gallery view directly inside the Share Modal that automatically saves and manages all completed image renders without utilizing any cloud space.' },
      { category: 'Feature', description: 'Persisted exact Share layout preferences across sessions (including component selections and layout styles) for seamless user transitions.' },
      { category: 'Performance', description: 'Activated HTML DOM renderer acceleration flags (skipFonts, fontEmbed) drastically cutting image generation times.' },
      { category: 'Bug Fix', description: 'Repaired the image generation pipeline by systematically neutralizing transparent CSS gradient bands in dynamic watermarks which previously crashed vector generation in certain WebKit branches.' }
    ]
  },
  {
    version: 'v8.6.13',
    date: '2026-06-05',
    time: '14:20:00',
    title: 'Visual Enhancements & Popover Overhaul',
    items: [
      { category: 'UI/UX', description: 'Restored proportional scaling to the Heatmap month and 30-day views by systematically increasing individual grid sizes (w-5 h-5), establishing superior visual balance compared to the compact year view.' },
      { category: 'Bug Fix', description: 'Engineered a resilient React global portal engine (PopoverPortal) to extract all primary tooltips, bubbles, and interaction popovers (Heatmap, Routine Tracker) dynamically out of their constraining parent contexts and anchor them firmly above all elements with absolute z-[9999] positioning.' },
      { category: 'Bug Fix', description: 'Implemented native viewport edge detection inside the global popover engine to effortlessly rebound tooltips whenever they collide with the absolute left or right screen boundaries, eradicating off-screen clipping anomalies entirely.' },
      { category: 'Bug Fix', description: 'Injected allowEscapeViewBox policies into all remaining Recharts tooltip containers ensuring unbounded hover visibility.' }
    ]
  },
  {
    version: 'v8.6.12',
    date: '2026-06-05',
    time: '13:50:00',
    title: 'Heatmap Layout Refinements',
    items: [
      { category: 'UI/UX', description: 'Corrected monthly and weekly heatmap matrix spacing issues that caused squares to over-stretch across containers using tight auto column rendering.' },
      { category: 'Feature', description: 'Engineered a dynamic Month labeling system seamlessly mapped over the year-based matrix columns.' },
      { category: 'UI/UX', description: 'Perfectly centered embedded daily mood emojis directly alongside the respective target heatmap cells using precision absolute-positioning.' }
    ]
  },
  {
    version: 'v8.6.11',
    date: '2026-06-05',
    time: '13:35:00',
    title: 'Heatmap GitHub-Style Redesign',
    items: [
      { category: 'UI/UX', description: 'Reconstructed the Heatmap container from a basic flat grid into a strict, horizontally-scrolling grid-flow-col matrix consisting of 7 vertical rows (mimicking the exact layout of a GitHub Contribution Matrix).' },
      { category: 'UI/UX', description: 'Introduced explicit "Mon", "Wed", and "Fri" row labels on the left Y-axis.' },
      { category: 'Feature', description: 'Added a customized "Show Mood" toggle on the bottom left corner, allowing users to embed their corresponding daily mood icon as an overlaid emoji within their heatmap squares.' }
    ]
  },
  {
    version: 'v8.6.10',
    date: '2026-06-05',
    time: '13:20:00',
    title: 'Chat Layout & Avatar Polish',
    items: [
      { category: 'UI/UX', description: 'Stripped away unnecessary borders, rings, and inner drop-shadows across all User / Guild avatars universally.' },
      { category: 'Bug Fix', description: 'Prevented the Fellowship Chat Message Board from infinitely stretching the parent container and instead explicitly enforcing scrolling bounds so the chat input strictly pins to the bottom.' }
    ]
  },
  {
    version: 'v8.6.9',
    date: '2026-06-05',
    time: '13:10:00',
    title: 'User Profile Dashboard Enhancements',
    items: [
      { category: 'UI/UX', description: 'Replaced the generic level indicator and placeholder icon in the main layout\'s left navigation sidebar with dynamic, real-time user avatars and custom nicknames.' },
      { category: 'UI/UX', description: 'Upgraded the mobile top-left profile entry button to accurately reflect the user-selected avatar.' }
    ]
  },
  {
    version: 'v8.6.8',
    date: '2026-06-05',
    time: '12:55:00',
    title: 'Guild Avatars SVG Overhaul & UI Polish',
    items: [
      { category: 'UI/UX', description: 'Replaced emoji placeholders with high-fidelity Lucide-React SVG icons (Scholarly, Adventure, Fantasy themes), enhancing immersion.' },
      { category: 'UI/UX', description: 'Amplified progress bar presence across the Guild dashboard and details modal (increased height and stroke-width).' },
      { category: 'Bug Fix', description: 'Resolved right-side italic clipping for the guild name title globally.' }
    ]
  },
  {
    version: 'v8.6.7',
    date: '2026-06-05',
    time: '12:45:00',
    title: 'Fellowship Branding & Progress Refinements',
    items: [
      { category: 'UI/UX', description: 'Resolved italic boundary clipping on the main Guild Name typography by introducing tailored right padding tracking parameters.' },
      { category: 'UI/UX', description: 'Increased the tracking stroke width and visual height of both linear and radial Fellowship Goal progress bars to significantly amplify visual presence.' },
      { category: 'Feature', description: 'Engineered a complete Guild Avatar icon system allowing Captains to select and broadcast high-fidelity emoji insignia directly into the Sanctum Plaza and primary team dashboards.' }
    ]
  },
  {
    version: 'v8.6.6',
    date: '2026-06-05',
    time: '11:45:00',
    title: 'Unified Modal System & Dialog Overhaul',
    items: [
      { category: 'UI/UX', description: 'Systematically eradicated all native browser window.alert and window.confirm dialogues across the application.' },
      { category: 'Feature', description: 'Implemented a unified ConfirmModal utilizing createPortal, injecting robust, high-contrast custom dialog components into settings and active guild workflows.' },
      { category: 'Bug Fix', description: 'Resolved a visual state mismatch in CloudSyncModal where disconnected WebDAV and Google strategies incorrectly persisted Redis-style password credentials boxes.' }
    ]
  },
  {
    version: 'v8.6.5',
    date: '2026-06-05',
    time: '10:20:00',
    title: 'Cloud Backend Global Restrictions & Invite Locks',
    items: [
      { category: 'Architecture', description: 'Redefined the isRedisUnlocked permission mechanism as an absolute, global gatekeeper against all Cloud Backend operations.' },
      { category: 'Feature', description: 'Added synchronous locked state walls blocking automatic Redis polling, push notification manual saves, WebDAV proxy, and Developer mode push tests unless the global Invite Code is verified.' },
      { category: 'UI/UX', description: 'Replaced the primary Sanctum Plaza (Fellowship Interface) with a secure Locked Screen requiring a developer access invite code prior to granting any entry.' }
    ]
  },
  {
    version: 'v8.6.4',
    date: '2026-06-05',
    time: '10:08:00',
    title: 'Cloud Quota Protection & Storage Optimization',
    items: [
      { category: 'Architecture', description: 'Implemented strict capacity limits for free tier Redis backend: automatically capped total remote active synced users to 300 and total guilds (fellowships) to 50.' },
      { category: 'Feature', description: 'Engineered continuous background garbage collection API (/api/stats) bound to Settings menus to intelligently prune ghost accounts and disbanded guilds.' },
      { category: 'UI/UX', description: 'Upgraded the remote unlock modal to dynamically fetch and display absolute active capacity stats of both Users and Guilds with transparent explanations.' }
    ]
  },
  {
    version: 'v8.6.3',
    date: '2026-06-05',
    time: '09:47:00',
    title: 'Data Management Privacy Enhancements',
    items: [
      { category: 'Feature', description: 'Safe Export now completely scrubs all user identity fields including unique ID, custom avatar, and titles to ensure absolute privacy during data sharing.' },
      { category: 'UI/UX', description: 'Implemented a mandatory confirmation prompt before performing a Full Export to warn users about the inclusion of personal information and cloud sync credentials.' }
    ]
  },
  {
    version: 'v8.6.2',
    date: '2026-06-05',
    time: '08:37:00',
    title: 'Fellowship Goal Appearance Hotfix',
    items: [
      { category: 'UI/UX', description: 'Resolved an issue where long Guild Vault Rewards were being unreadably truncated ("...") by swapping single-line truncations with responsive multi-line line-clamp limits.' },
      { category: 'UI/UX', description: 'Refined typography readability by stripping highly stylized amber glowing text shadows from reward fonts in exchange for clean, elegant indigo solid variations.' }
    ]
  },
  {
    version: 'v8.6.1',
    date: '2026-06-05',
    time: '08:00:00',
    title: 'Push Notification Deduplication & Fellowship Dash',
    items: [
      { category: 'Bug Fix', description: 'Implemented strict Web Push endpoint deduplication and capped maximum active device signatures to prevent users from receiving duplicated notifications.' },
      { category: 'UI/UX', description: 'Replicated the centered progress percentage, prominently centered Guild Vault Reward with glowing visual queues, and dynamic \'CYCLE\' timeline layout directly onto the primary Fellowship goal dashboard card.' }
    ]
  },
  {
    version: 'v8.6.0',
    date: '2026-06-05',
    time: '07:35:00',
    title: 'Fellowship Horizon Enhancements',
    items: [
      { category: 'Feature', description: 'Enabled Captains to configure an exact daily Goal Refresh Schedule (e.g. Midnight, 3 AM, 4 AM) during Guild creation and inside Guild Settings.' },
      { category: 'UI/UX', description: 'Redesigned the Guild Goal modal to prominently center the progress percentage within a larger tracking ring.' },
      { category: 'UI/UX', description: 'Promoted the Guild Vault Reward into a standalone, high-contrast, hovered display card to significantly increase visibility.' },
      { category: 'UI/UX', description: 'Integrated a dynamically calculated CYCLE time-boundary banner to display the precise start and end dates based on the active refresh schedule.' }
    ]
  },
  {
    version: 'v8.5.4',
    date: '2026-06-05',
    time: '07:20:00',
    title: 'Streamlined Navigation Experience Tracking on Mobile',
    items: [
      { category: 'UI/UX', description: 'Simplified mobile XP bar layout by hiding graphic progress indicators and numerical trackers by default, maximizing whitespace.' },
      { category: 'UI/UX', description: 'Preserved level click functionality so tapping the level label instantly triggers the comprehensive floating progress sheet.' }
    ]
  },
  {
    version: 'v8.5.3',
    date: '2026-06-05',
    time: '07:15:00',
    title: 'Restored Classic Top Navigation Level Panel & Perfected Right Alignment',
    items: [
      { category: 'UI/UX', description: 'Restored the high-fidelity, classic responsive layout for Level indicators and detailed XP tracking rails to their highly polished format.' },
      { category: 'UI/UX', description: 'Repositioned status submodules including talent scrolls and gold coins to group elegantly next to mobile navigation buttons on the far-right edge.' }
    ]
  },
  {
    version: 'v8.5.2',
    date: '2026-06-05',
    time: '07:05:00',
    title: 'Optimized Top Navigation Status Layout for Compact Mobile Views',
    items: [
      { category: 'UI/UX', description: 'Transformed raw multi-row XP Progress track into a clickable floating tooltip toggle on screens smaller than sm (mobile devices), preserving core visual estate.' },
      { category: 'UI/UX', description: 'Styled the compact Level indicator as a border-accentuated, theme-aware mini badge on mobile, automatically scaling back to its standard full size on tablet and desktop viewports.' },
      { category: 'UI/UX', description: 'Collapsed unnecessary inactive dungeon navigation text labels and restricted maximum text limits of active dungeons on portrait layouts, fully resolving coin spacing overlap.' }
    ]
  },
  {
    version: 'v8.5.1',
    date: '2026-06-05',
    time: '06:50:00',
    title: 'Polished Responsive Fellowship Layout for Mobile PWAs',
    items: [
      { category: 'UI/UX', description: 'Restructured the active Fellowship dashboard layout from a rigid grid into a modern, fluid column system that stacks elegantly on mobile devices and narrow Slide-Over panels.' },
      { category: 'UI/UX', description: 'Equipped the team member lists with explicit scrollable bounding constraints, preventing overflow and ensuring continuous readability on small frames.' },
      { category: 'UI/UX', description: 'Transformed Lobby search and action menus to wrap cleanly under low screen widths and forced the Join button to be fully visible on touch interfaces.' }
    ]
  },
  {
    version: 'v8.5.0',
    date: '2026-06-05',
    time: '05:46:00',
    title: 'Standardized Nickname Formatting & Multi-Language Translation',
    items: [
      { category: 'Feature', description: 'Implemented adaptive username validation (maximum 10 Chinese characters or 15 Latin characters) with interactive mode switches and real-time character meters.' },
      { category: 'Feature', description: 'Added a customized, fully high-contrast English confirmation option box (ConfirmModal) explaining that chosen nicknames are visible publicly and will be referenced in notification alerts.' },
      { category: 'UI/UX', description: 'Standardized the chat workspace in TeamModule.tsx to automatically append user student IDs as a neat (ID-XXXXX) suffix directly following the sender\'s nickname.' },
      { category: 'UI/UX', description: 'Eliminated all remaining user-facing Chinese labels in ProfileModal, CloudSettingsSection, ShareRecordModal, DatePicker, and SageSettingsSection, aligning the entire applet to global English localized aesthetics.' },
      { category: 'UI/UX', description: 'Bypassed native and synthetic smooth scroll lagging animations for TimePicker scroll columns, enabling immediate snapping values directly showing the exact edit state without delay or random offsets.' }
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
