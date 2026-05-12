# Project Tracker & Agent Instructions

## Role & Workflow
You are an AI assistant maintaining the "Scholar's Dungeon" project. 
At the start of every interaction, you automatically read this file (injected into your system prompt).

**CRITICAL RULE FOR EVERY UPDATE:**
Whenever you complete a task or make changes to the application:
1. Update the `Current Version` and `Last Update Date` in this `AGENTS.md` file.
2. Log the completed task in the `Task History` section below.
3. Update the version number and release date in `src/components/Settings.tsx` (under the 'about' section) to match the new version and date.

**VERSIONING POLICY (x.y.z):**
- **x (Major):** Critical architectural changes or full-scale system overhauls.
- **y (Minor):** New features, significant UI additions, or functional enhancements.
- **z (Patch):** Bug fixes, micro-optimizations, documentation updates, and UI refinements.

**CSS & UI STANDARDS:**
- **Full-Screen Modals:** Whenever creating a "full-screen" centered modal (especially `fixed inset-0`), you MUST use `createPortal(..., document.body)` from `react-dom` to render the modal directly on the `body`. If you do not use `createPortal`, parent elements with CSS `transform`, `filter`, or `perspective` will establish unintended containing blocks that capture the `fixed` positioning, causing the modal to appear in the middle of a scrolling page container instead of the actual screen view. Never make this mistake again.
- **Italic Clipping:** To prevent right-side clipping of italic text (especially in browsers with tight bounding boxes), always add a small right padding (e.g., `pr-1` or `px-0.5`) to the element or its immediate container.
- **Red Dot / Notification Placement:** Unread message or notification badges (red dots) on icons and buttons MUST ALWAYS be placed in the bottom-right corner (e.g. `absolute -bottom-0.5 -right-0.5`), NEVER in the top-right corner.
- **Touch-Friendly Controls:** Delete buttons or other critical actions MUST NOT be hover-only (e.g. `opacity-0 group-hover:opacity-100`), as this is unfriendly to touch-screen users. They should be visible or adapt properly for mobile devices.
- **Theme-Aware Colors & Minimalist UI:** We have 6 different theme colors. Every color choice (especially backgrounds, progress bars, or buttons) MUST consider all themes to maintain a minimalist and premium aesthetic. Avoid thick, flashy, or hardcoded colors like `bg-emerald-500` which may look jarring or "rough" (粗率) in certain themes. Rely on theme-aware colors (`indigo-300`, `indigo-400`, `indigo-500`, `indigo-600`) or neutral slate colors with opacity. DO NOT use `indigo-200` or `indigo-700`+ for primary themed elements, as they will appear in the default blue color across all themes.

## Current Status
- **Current Version:** v5.13.18
- **Last Update Date:** 2026-05-12

## Dark Themes Definition
The following themes are considered "Dark Themes" and form the baseline for vibrant visual effects and high-contrast glowing elements:
- **Night** (`data-theme="night"`)
- **Forest** (`data-theme="forest"`)
- **Ocean** (`data-theme="ocean"`)

## Light Themes Definition
The following themes are considered "Light Themes" and require special CSS handling (e.g., avoiding white text on light backgrounds, using theme-aware colors for modals and charts):
- **Daylight** (`data-theme="daylight"`)
- **Warm Sun** (`state.theme === "warm"`)
- **Candy** (`state.theme === "candy"`)

## Push Notification Troubleshooting Protocols
Due to inconsistencies in Web Push delivery in various environments (Iframes, PWAs), follow this hierarchy:
1. **Execution Context:** Web Push is often blocked in cross-origin IFRAMES. Always test by opening the app in a **New Tab** or as an **Installed PWA**.
2. **Direct Permission Check:** Verify address bar shows "Allowed". 
3. **Service Worker Console:** Switch to `Application -> Service Workers -> Inspect` in DevTools to see SW-specific logs (`[Service Worker]`). Main console may skip these.
4. **OS Level:** Check Windows Focus Assist or macOS Do Not Disturb.
5. **Direct API Test:** Use the "Test Local Notification (Direct)" tool in Developer settings. If this fails, the browser/OS is blocking notifications globally.
6. **VAPID Integrity:** If VAPID keys change, "Clear Server Sub" + "Reset Service Worker" is mandatory.


## Task History
- **v5.13.18 (2026-05-12):** Timer PIP Context Fix.
  - *Bugfix:* Fixed an error where the Picture-in-Picture window would fail to open in iframe contexts. The button is now hidden when the app is embedded, directing users to open it in a new tab or install as a PWA first.
- **v5.13.17 (2026-05-12):** Timer PIP Button OS Requirement.
  - *UX:* The Floating Mini Timer (Always on Top) button now appears on all Windows and Mac systems that support the feature, instead of only appearing when installed as a PWA.
- **v5.13.16 (2026-05-12):** Top Bar Sync Button Refinement.
  - *UI:* Reduced the size of the cloud sync button and icon to ensure it doesn't exceed the height of other header elements.
- **v5.13.15 (2026-05-12):** Activity Time Peaks Layout Polish.
  - *UI:* Added horizontal margins to the timeline container to prevent time labels from being clipped at the edges.
- **v5.13.14 (2026-05-12):** Activity Time Peaks Sliding Window.
  - *UX:* Implemented a 24-hour sliding window for the timeline visualization that automatically offsets when periods cross midnight.
  - *UI:* Refined the timeline labels to only display the specific start and end times for each peak period for a cleaner look.
- **v5.13.13 (2026-05-12):** Activity Time Peaks Minimalist UI.
  - *UI:* Removed all text labels (hours, Midnight, Next Day) from the timeline visualization for a clean, minimalist appearance.
- **v5.13.12 (2026-05-12):** Activity Time Peaks Flat UI.
  - *UI:* Removed segment glow effects and internal text for a flatter, cleaner look.
  - *UI:* Widened the cross-day midnight dividing line and increased timeline header text size.
- **v5.13.11 (2026-05-12):** Activity Time Peaks UI Visual Refinement.
  - *UI:* Applied custom high-precision colors (#FDE047, #F97316, #6366F1) to time segments and icons.
  - *UI:* Increased visualization header font size and consistency across the settings module.
  - *UX:* Added "Midnight" marker and "Next Day" patterned background to make cross-day segments highly visible.
- **v5.13.10 (2026-05-12):** Activity Time Peaks UI Final Refinement.
  - *UI:* Increased timeline marker font size and visualization height for better readability.
  - *UI:* Improved marker positioning logic on the dynamic timeline.
  - *Cleanup:* Removed redundant time range previews from period cards and pruned unused imports.
- **v5.13.9 (2026-05-12):** Activity Time Peaks UI Refinement.
  - *UI:* Repositioned the dynamic timeline below time input blocks for better visual hierarchy.
  - *UI:* Removed redundant time range previews from input cards to reduce visual noise.
  - *UI:* Increased font size and improved spacing for time markers on the visualization axis.
- **v5.13.8 (2026-05-12):** Activity Time Peaks UI Overhaul.
  - *UI:* Replaced static time range previews with a dynamic integrated timeline visualization.
  - *UX:* Implemented cross-day extension logic for the timeline, allowing for clear representation of periods spanning across midnight.
  - *Logic:* Added real-time overlap detection with visual warning messages to prevent configuration conflicts.
- **v5.13.7 (2026-05-12):** Gacha Settings UI Refinement.
  - *UI:* Consolidated "Import Pool" and "Add Pool" buttons into the main Gacha section header for better space efficiency.
- **v5.13.6 (2026-05-12):** Daily Progress UI Reordering.
  - *UX:* Reordered the days in the Daily Progress Goal configuration to start with Monday for a more standard weekly view.
- **v5.13.5 (2026-05-12):** Reward Pool UI Consolidation.
  - *UI:* Consolidated Reward Pool Management title and action buttons (Reset/Add Reward) into a single row for better horizontal space efficiency.
- **v5.13.4 (2026-05-12):** Settings Layout Refinement.
  - *UI:* Reordered general settings: "Activity Time Peaks" is now positioned before "End of the Day" for better logical flow.
- **v5.13.3 (2026-05-12):** Reward Pool UI Cleanup.
  - *UI:* Removed redundant "Loot Pool" heading from the Reward Pool Management section in Timer Settings for a cleaner interface.
- **v5.13.2 (2026-05-12):** Settings UI Polishing.
  - *UI:* Added structured frames to Mood Configuration and Daily Progress Goal sections in Settings for better visual organization.
  - *UX:* Added descriptive helper text for the Daily Progress Goal setting to clarify its impact on daily activity tracking.
- **v5.13.1 (2026-05-12):** Sync History UI Final Polish.
  - *UI:* Optimized Sync History table with flexible column widths and improved status clarity for legacy records.
  - *UX:* Added horizontal scrolling for history table to handle longer content without clipping.
- **v5.13.0 (2026-05-12):** Manual Focus Start Option.
  - *Feature:* Added "Manual Focus Start" setting for loop mode. When rest ends, players can now choose to manually confirm before starting the next focus session.
  - *UI:* New sleek confirmation prompt for focus sessions after rest periods.
- **v5.12.1 (2026-05-12):** Sync History UI Refinement.
  - *UI:* Improved the Status column in Sync History with fixed-width layout and clearer labels for better visibility on smaller screens.
- **v5.12.0 (2026-05-12):** Archive History Status & UI.
  - *Feature:* Added a dedicated status column to Sync Status & History, clearly indicating success, failure, or cancellation of cloud operations.
  - *UI:* Redefined the Archive Chronology layout with a table-style grid for better information density and visual clarity.
  - *Logic:* Enhanced sync logging to capture error messages during failed login or sync attempts for easier troubleshooting.
- **v5.11.5 (2026-05-12):** VAPID & Core Robustness.
  - *Bugfix:* Improved VAPID key validation logic to prevent "65 bytes" decoding errors caused by invalid environment variables.
  - *Security:* Rotated fallback VAPID keys and enhanced cleaning logic for platform-provided secrets.
- **v5.11.4 (2026-05-12):** Icon & UI Refinement.
  - *UI:* Updated the "Morning" icon in Activity Time Peaks to "sunrise" for better visual distinction.
- **v5.11.3 (2026-05-12):** Settings UI Polish.
  - *UI:* Updated the "End of the Day" section icon in Settings to "calendar-check" for better visual representation.
- **v5.11.2 (2026-05-12):** Settings UI Consolidation II.
  - *UI:* Moved "Daily Progress Goal" into the "End of the Day" section in Settings for better grouping.
- **v5.11.1 (2026-05-12):** Settings UI Consolidation.
  - *UI:* Consolidated "Default Markdown" and "Mood Configuration" settings into a single "End of the Day" section for better organization.
- **v5.11.0 (2026-05-12):** Archive Visibility & End of Day Polish.
  - *Bugfix:* Fixed Cloud Sync Device Code display issue where it appeared as "?" even when available.
  - *UI:* Significant refinement of the "End of the Day" modal header, progress, and feelings section.
  - *UX:* Support for re-editing daily logs: opening the summary modal now automatically loads existing records for the current day.
- **v5.10.9 (2026-05-12):** Daily Summary Re-editing.
  - *UX:* If a daily log already exists for the current day, it is automatically loaded when opening the End of the Day modal, allowing users to re-edit their saved reflection and rating.
- **v5.10.8 (2026-05-12):** Mood Selection UI Polish.
-   - *UI:* Realignment of mood section title to the left and addition of a section separator for better visual hierarchy in the End of the Day modal.
- **v5.10.7 (2026-05-12):** Mood Selection UI Polish.
  - *UI:* Reduced the size of mood selection buttons and centered the layout for a more balanced and compact appearance in the End of the Day modal.
- **v5.10.6 (2026-05-12):** Daily Progress UI Refinement.
  - *UI:* Restored the "Daily Progress" title and session ratio in a simplified layout within the End of the Day modal.
- **v5.10.5 (2026-05-12):** Daily Summary View Simplification.
  - *UI:* Simplified the End of the Day modal by removing redundant header text and stripping the Daily Progress section down to a minimal interactive bar.
- **v5.10.4 (2026-05-12):** End of Day UI Refinement.
  - *UI:* Refined the "End of the Day" header layout: moved the date range below the title, removed borders, and highlighted the recorded date for better clarity.
- **v5.10.3 (2026-05-12):** Settlement Date Attribution Fix.
  - *Bugfix:* Fixed a critical bug where settlement and bulk session dates were attributed using UTC instead of local/configured time, causing incorrect record dates for users in non-UTC timezones.
- **v5.10.2 (2026-05-12):** End of Day Header Date.
  - *UX:* Added the effective settlement date explicitly at the top of the "End of the Day" modal, making it clearer when logging activities that span across midnight.
- **v5.10.1 (2026-05-12):** Markdown Readability Polish.
  - *UX:* Increased font color intensity for Markdown list items (content after "-") to improve readability across all themes.
- **v5.10.0 (2026-05-12):** Mood Selection UI Polish.
  - *UX:* Improved the "Daily Feelings" selection area by adding padding and allowing scale effects (up to 125%) without clipping, providing better visual feedback.
- **v5.9.9 (2026-05-12):** Modal Layout Polish.
  - *UI:* Adjusted the "End of the Day" modal vertical spacing to ensure a consistent gap from the screen edges on all devices.
- **v5.9.8 (2026-05-12):** Chart Interaction Polish.
  - *Bugfix:* Fixed a bug in Weekly Activity charts where tooltips would not disappear when clicking empty space.
- **v5.9.7 (2026-05-12):** Cloud Sync Comparison UI Enhancement.
  - *UX:* Added "Device Code" row to the comparison tables in the Astral Archives modal, providing better visibility of which device a cloud save belongs to.
- **v5.9.6 (2026-05-12):** Cloud Sync Device Identity Fix.
  - *Bugfix:* Fixed an issue where the unique Device Code was being overwritten during cloud sync or data import, ensuring each platform/device maintains its own identity in the sync history.
- **v5.9.5 (2026-05-12):** Export UI Refinement.
  - *UI:* Unified the visual style of "Safe Export" and "Full Export" buttons for better consistency while maintaining distinct icon colors.
- **v5.9.4 (2026-05-12):** Enhanced Export Portability.
  - *Feature:* Added a dual-mode Export system allowing users to choose between "Full Export" (all data) and "Safe Export" (privacy-focused).
  - *Privacy:* Safe Export automatically strips sensitive synchronization passwords, cloud tokens, and device nicknames from the exported JSON.
- **v5.9.3 (2026-05-12):** Settings Navigation Polish.
  - *UX:* Improved deep linking from Cloud Sync preferences to Data Management; it now accurately navigates and centers the section on screen.
- **v5.9.2 (2026-05-12):** Talent Unlock Celebration.
  - *UX:* Added a colorful confetti effect when successfully unlocking a new talent, providing better visual feedback for progression.
- **v5.9.1 (2026-05-12):** Talent Auto-Activation.
  - *UX:* Newly unlocked talents are now automatically enabled upon purchase, reducing the need for manual activation.
- **v5.9.0 (2026-05-12):** Bulk Session Management.
  - *Feature:* Implemented a Batch Manage tool in Recent Sessions, allowing users to create or delete sessions in bulk within a time range.
  - *Feature:* Bulk created sessions automatically generate reward options that are sent to the Treasure Chest for balance.
  - *UX:* Added clear safety reminders: Batch creation warns about chest rewards, while batch deletion warns that already claimed Gold/XP will not be revoked.
- **v5.8.1 (2026-05-12):** Astral Archives Logic Polish.
  - *UX:* Improved navigation within the cloud sync modal; the header close button now returns to the main archive view when in sub-pages.
  - *UX:* Completely overhauled out-of-date instructional content in the "Archives Info" view.
- **v5.8.0 (2026-05-12):** Astral Archives Robustness.
  - *Feature:* Added a 60-second countdown and manual "Cancel Sync" button during the cloud synchronization phase.
  - *UX:* Improved failure handling with a "Reset & Retry" option when sync stalls or errors occur, improving data reliability.
  - *UX:* Integrated clear error message display within the sync loading/timeout interface.
- **v5.7.1 (2026-05-12):** Expedition Data Portability.
  - *Feature:* Added a direct Download button next to the Copy button in the Expedition Import/Export modal, allowing users to save their list as a Markdown file.
  - *UX:* Improved UI feedback for data export actions.
- **v5.7.0 (2026-05-12):** Expedition Markdown Integration.
  - *Feature:* Implemented Import and Export functionality for the Expedition list using a human-readable Markdown format.
  - *UX:* Added a dedicated Import/Export modal with clipboard copy support and formatting validation.
  - *Logic:* Developed a robust recursive parser to handle multi-tiered expeditions and rewards during import operations.
- **v5.6.5 (2026-05-12):** Data Safety Clarification.
-   - *UX:* Enhanced the data deletion warning modal with a clearer reminder that clearing local data will not impact cloud archives, reducing user anxiety during reset operations.
- **v5.6.4 (2026-05-12):** Top Bar Simplification.
  - *UI:* Removed the page title (e.g., Dashboard) from the top bar for a cleaner, more focused interface.
- **v5.6.3 (2026-05-12):** Top Bar Polish.
  - *UI:* Implemented a "Go Dungeons" link with a sword icon in the top header when no active dungeon is selected, improving site navigation.
- **v5.6.2 (2026-05-12):** Quest Board UI Cleanup.
  - *UI:* Removed decorative pins and "pinned note" rotation from quest items and history list for a cleaner, flatter aesthetic as requested.
- **v5.6.1 (2026-05-12):** Chart Visual Cleanup.
  - *UI:* Completely suppressed default browser focus outlines on all interactive charts using global CSS overrides to ensure a seamless visual experience during interaction.
- **v5.6.0 (2026-05-12):** UI Visual Cleanup.
  - *UI:* Removed default browser focus outlines from interactive charts for a cleaner visual experience.
- **v5.5.9 (2026-05-12):** Chart Interaction Refinement.
  - *UX:* Refined background click detection in Weekly Activity charts to ensure reliable tooltip dismissal when clicking empty space.
  - *UX:* Unified date formatting in Heatmap and Weekly popovers to display both day of week and full date.
  - *Bugfix:* Isolated interactive states between the Bar and Line charts to prevent unintended simultaneous bubble displays.
- **v5.5.8 (2026-05-12):** Interactive Chart Decoupling.
  - *UX:* Completely decoupled the Weekly Activity Bar Chart and Efficiency Trend Line Chart tooltips, ensuring they act individually instead of displaying simultaneously.
  - *Bugfix:* Fixed a bug where interacting with the Bar Chart would not trigger its independent popover immediately.
  - *Bugfix:* Fixed an issue where clicking empty space within the Weekly Activity charts failed to dismiss active tooltips.
