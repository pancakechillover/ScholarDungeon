# Project Tracker & Agent Instructions

## Role & Workflow
You are an AI assistant maintaining the "Scholar's Dungeon" project. 
At the start of every interaction, you automatically read this file (injected into your system prompt).

**CRITICAL RULE FOR EVERY UPDATE:**
Whenever you complete a task or make changes to the application:
1. Update the `Current Version` and `Last Update Date` in this `AGENTS.md` file.
2. Log the completed task in the `Task History` section below.
3. Update the version number and release date in `src/components/Settings.tsx` (under the 'about' section) to match the new version and date.

## Current Status
- **Current Version:** v1.2.0
- **Last Update Date:** 2026-04-12

## Task History
- **v1.2.0 (2026-04-12):** Performance & UI Polish. Fixed bottom bar jittering (AnimatePresence mode="wait"). Implemented elegant overlay scrollbars. Optimized performance using React.memo for heavy components.
- **v1.1.0 (2026-04-12):** Created project tracker (`AGENTS.md`). Added version and release date to Settings -> About page.
- **v1.0.1 (2026-04-12):** Upgraded PWA installation experience (sword icon, splash screen animation).
- **v1.0.0:** Initial release and subsequent security/UI enhancements (Cloud Sync confirmations, history tracking, etc.).

## Pending Tasks
- Fix performance issues causing lag (state colocation for Timer - partially addressed with memoization).
- Further optimize state management if lag persists.
