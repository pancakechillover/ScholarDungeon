# Scholar's Dungeon

![Scholar's Dungeon](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styled-blue)
![Tests](https://img.shields.io/badge/Tests-node%3Atest-success)

## 📖 About The Project

**Scholar's Dungeon** is a gamified productivity application that transforms your study or work sessions into an epic RPG adventure. By utilizing the Pomodoro technique, users can focus on their tasks to earn experience points (EXP), gold, and mana, leveling up their character and unlocking new mystical dungeons to explore. 

---

## ✨ Core Features

### ⏱️ Gamified Focus Timer
- **Customizable Sessions:** Set your focus and rest durations to match your workflow.
- **Dynamic States:** Seamlessly transition between "Focusing" (Combat/Exploration) and "Resting" (Camp) states.
- **Session Tracking:** Automatically tracks completed sessions and calculates rewards based on the time spent.
- **Auto-Looping:** Automatically starts the rest timer after claiming rewards, and seamlessly transitions into the next focus session when rest is complete.

### ⚔️ RPG Progression System
- **Level Up:** Gain EXP from focusing to level up your "Scholar" character.
- **Resource Gathering:** Earn Gold and Mana to unlock new areas and features.
- **Account Status:** View your current level, stats, and progress in a beautifully designed dashboard.

### 🗺️ Dungeon Exploration
- **Unlockable Areas:** Spend Gold and Mana to unlock new dungeons (e.g., *The Whispering Library*, *The Clockwork Tower*).
- **Major Dungeons (Bosses):** Face ultimate challenges that require high levels and specific resources to conquer.
- **Visual Progression:** Each dungeon features unique lore, requirements, and visual indicators of your exploration progress.

### ☁️ The Astral Archives - Cloud Sync
- **Cross-Device Play:** Sync your save data across multiple devices using a unique "Brave's Secret Code".
- **Smart Conflict Resolution:** Automatically detects version conflicts between local and cloud saves, allowing the user to choose whether to "Keep Local" or "Download Cloud".
- **Auto-Sync:** Automatically inscribes your progress to the cloud after every successful study session.
- **Secure & Private:** Uses a custom code-based authentication system to partition and protect your data.

### 🎨 Immersive UI/UX
- **Mystical Aesthetic:** A dark, magical theme with glowing accents, glassmorphism effects, and smooth animations.
- **Responsive Design:** Fully optimized for both desktop and mobile experiences.

---

## 📖 User Manual & Recommended Settings

### How to Play
1. **Choose Your Destination:** Go to the "Dungeons" tab and select an unlocked dungeon to explore. Each dungeon represents a study/work session.
2. **Start the Timer:** Head to the "Explore" tab. Set your desired focus time and start the timer. Avoid leaving the page or losing focus!
3. **Claim Rewards:** Upon completing a session, you will earn EXP, Coins, and potentially rare items. 
4. **Upgrade & Unlock:** Use your earned resources in the "Talents" tree to gain passive buffs, or visit the "Shop" to buy items and unlock new Dungeons.
5. **Cloud Sync:** Go to "Settings" -> "Account Status" -> "Cloud Sync". Enter a unique "Brave's Secret Code" to back up your progress.

### Recommended Balanced Settings
To get the best experience without burning out or breaking the game economy, we recommend the following settings:

- **Focus Duration:** 
  - *Classic Pomodoro:* 25 minutes focus + 5 minutes rest. Best for reading or standard tasks.
  - *Deep Work:* 50 minutes focus + 10 minutes rest. Best for coding, writing, or complex problem-solving.
- **Resource Management:** 
  - Do not spend all your coins on the Gacha early on. Save your gold to unlock the first few Sub-Dungeons, which yield better base rewards.
- **Talent Priority:** 
  - Prioritize the **"Wealth"** or **"Wisdom"** branches early on to increase your passive Coin and EXP gain. This will snowball your progression.

---

## 🛠️ Tech Stack

### Frontend
- **[React 18](https://reactjs.org/)**: UI Library
- **[Vite](https://vitejs.dev/)**: Fast build tool and development server
- **[TypeScript](https://www.typescriptlang.org/)**: Static typing for robust code
- **[Tailwind CSS 4](https://tailwindcss.com/)**: Utility-first CSS framework for styling
- **[Motion](https://motion.dev/)**: For fluid, physics-based animations (the library formerly published as Framer Motion)
- **[Lucide React](https://lucide.dev/)**: Beautiful, consistent icon set

### Backend & Infrastructure
- **[Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)**: Custom server for handling API requests
- **[Redis](https://redis.io/)**: High-performance key-value store used for the Cloud Sync backend (via `redis` npm package)

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v22.18 or higher** — the test suite uses Node's built-in TypeScript type stripping and `node:test`, so no test framework needs to be installed.
- npm or yarn
- A Redis instance (local or cloud, e.g., Upstash, Vercel KV). Optional for pure UI work, but required for cloud sync, fellowships and push notifications.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pancakechillover/ScholarDungeon.git
   cd ScholarDungeon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy the example file and fill in what you need:
   ```bash
   cp .env.example .env
   ```
   `.env.example` lists every supported variable — `REDIS_URL` for cloud sync, `GEMINI_API_KEY` for the AI features, `OAUTH_CLIENT_ID` / `OAUTH_CLIENT_SECRET` for Google Drive backup, and the `VAPID_*` keys for push notifications.

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

### Building for Production
```bash
npm run build
npm start
```

### Type Checking & Tests
```bash
npm run typecheck   # tsc --noEmit
npm test            # node --test
```

The test suite runs on Node's built-in runner, so there is no test framework to install and no separate config to maintain. Suites live in `tests/` and cover the security-sensitive server helpers, including the SSRF guard used by the WebDAV proxy.

---

## 📂 Project Structure

```text
├── src/
│   ├── components/       # Reusable UI components (CloudSyncModal, Timer, etc.)
│   ├── hooks/            # Custom React hooks (useGameState, useCloudSync)
│   ├── lib/              # Utility functions
│   ├── types.ts          # Global TypeScript interfaces and types
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # React entry point
│   └── index.css         # Global styles and Tailwind configuration
├── api/                  # Vercel serverless routes (sync, teams, push, webdav, google)
│   └── shared/           # Helpers reused across routes (SSRF guard, JSON parsing)
├── tests/                # Node test-runner suites (npm test)
├── server.ts             # Express backend server — local mirror of the api/ routes
├── package.json          # Project dependencies and scripts
└── vite.config.ts        # Vite configuration
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/pancakechillover/ScholarDungeon/issues).

## 📄 License
This project is licensed under the MIT License.
