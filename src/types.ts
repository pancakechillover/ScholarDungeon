export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface RewardCard {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  type: 'coins' | 'xp' | 'item' | 'text';
  amount?: number;
  itemType?: 'double_xp' | 'double_coin' | 'talent_shard' | 'death_defying_medal' | 'xp_bonus_percent' | 'coin_bonus_percent';
  icon?: string;
  weight: number;
  limitCount?: number; // Max occurrences in the period
  limitPeriodDays?: number; // Period in days
  claimHistory?: string[]; // Timestamps of claims
}

export interface Talent {
  id: string;
  name: string;
  description: string;
  branch: 'A' | 'B' | 'C';
  tier: 1 | 2 | 3;
  cost: number;
  effect: string;
  icon: string;
  unlocked: boolean;
  active: boolean;
  conflictsWith?: string[];
}

export interface DungeonReward {
  type: 'talentPoint' | 'coins' | 'item' | 'text' | 'xp';
  amount: number;
  itemName?: string;
  rewardText?: string;
  itemType?: 'double_xp' | 'double_coin' | 'talent_shard' | 'death_defying_medal' | 'xp_bonus_percent' | 'coin_bonus_percent';
}

export interface Dungeon {
  id: string;
  name: string;
  description?: string;
  totalSessions: number;
  completedSessions: number;
  rewardCoins: number;
  rewardXP: number;
  rewardText: string;
  rewards?: DungeonReward[];
  isLongTerm: boolean;
  status: 'active' | 'completed' | 'archived';
  parentId?: string; // ID of the Major Dungeon
  completedAt?: string;
}

export interface MajorDungeon {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  isFinalized?: boolean;
  rewards?: DungeonReward[];
  completedAt?: string;
}

export interface RewardHistoryItem {
  id: string;
  name: string;
  rarity: string;
  color?: string;
  source: 'Explore' | 'Gacha' | 'Shop' | 'LevelUp';
  timestamp: string;
  type: 'coins' | 'xp' | 'item' | 'text';
  amount?: number;
  itemType?: 'double_xp' | 'double_coin' | 'talent_shard' | 'death_defying_medal' | 'xp_bonus_percent' | 'coin_bonus_percent';
  redeemed: boolean;
}

export interface LevelReward {
  level: number;
  type: 'talentPoint' | 'coins' | 'item' | 'text';
  amount: number;
  itemName?: string;
  rewardText?: string;
}

export type QuestType = 'daily_sessions' | 'weekly_sessions' | 'monthly_sessions' | 'consecutive_days' | 'total_sessions';

export interface QuestReward {
  type: 'coins' | 'xp' | 'talentPoint' | 'item' | 'text';
  amount: number;
  itemType?: 'talent_shard' | 'death_defying_medal' | 'double_xp' | 'double_coin';
  itemName?: string;
  rewardText?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  target: number;
  progress: number;
  reward: QuestReward;
  rewards?: QuestReward[];
  completed: boolean;
  claimed?: boolean;
  lastReset?: string;
  order: number;
  isAchievement: boolean;
  isSpecial?: boolean;
  talentRequired?: string;
}

export interface TimeSettings {
  morning: { start: number; end: number };
  afternoon: { start: number; end: number };
  night: { start: number; end: number };
}

export interface QuestHistoryItem {
  id: string;
  questId: string;
  title: string;
  type: QuestType;
  timestamp: string;
  rewards: QuestReward[];
  isAchievement: boolean;
  talentRequired?: string;
}

export interface ReflectionTemplate {
  id: string;
  name: string;
  content: string;
  exampleContent?: string;
}

export interface AppState {
  level: number;
  xp: number;
  coins: number;
  talentPoints: number;
  talentShards: number;
  deathDefyingMedals: number;
  unlockedTalents: string[];
  activeTalents: string[];
  currentDungeonId: string | null;
  history: StudySession[];
  rewardHistory: RewardHistoryItem[];
  questHistory: QuestHistoryItem[];
  lastStudyDate: string | null;
  streak: number;
  dailySessions: number;
  lastDailyReset: string | null;
  lastWeeklyReset?: string | null;
  lastMonthlyReset?: string | null;
  dailyRerollUsed: boolean; // Track if Shuffler reroll was used today
  inventory: string[]; // IDs of functional cards active for next session
  userName?: string;
  userBio?: string;
  // Quests & Achievements
  quests: Quest[];
  questNotificationStyle: 'red_dot' | 'popup';
  unclaimedQuests: number;
  // Developer Mode Settings
  devModeEnabled?: boolean;
  devBaseXP?: number;
  devMinXP?: number;
  devMaxXP?: number;
  devXpMode?: 'fixed' | 'random';
  devBaseCoins?: number;
  devMinCoins?: number;
  devMaxCoins?: number;
  devCoinMode?: 'fixed' | 'random';
  devCritChance?: number;
  devCritMultiplier?: number;
  theme?: string;
  autoTheme?: boolean;
  dayTheme?: string;
  nightTheme?: string;
  autoThemeNightStart?: string; // HH:mm
  autoThemeDayStart?: string;   // HH:mm
  timezone?: string;
  gachaEffect?: 'card' | 'scratch'; // Deprecated but kept for migration
  gachaAnimation?: 'card' | 'scratch';
  ichibanAnimation?: 'card' | 'scratch';
  gachaAllowOverlap?: boolean;
  soundEnabled?: boolean;
  soundVolume?: number;
  defaultMarkdownEnabled?: boolean;
  timerBannerCompactMode?: boolean;
  timerSkipVictoryMode?: 'none' | 'auto_pick_highest' | 'skip_rewards' | 'defer_to_chest';
  timerBannerShortcuts?: string[];
  pendingRewardChest?: { session: StudySession; choices: RewardCard[]; }[];
  // Editable Pools
  rewardPool: RewardCard[];
  shopItems: ShopItem[];
  gachaPools: GachaPool[];
  activeGachaPoolId?: string;
  activeIchibanPoolId?: string;
  levelRewards?: LevelReward[];
  lastCompletionRewards?: {
    dungeonName: string;
    type: 'dungeon' | 'quest' | 'achievement';
    rewards: DungeonReward[];
  } | null;
  bulkClaimResult?: {
    items: { title: string; rewards: QuestReward[]; isAchievement: boolean }[];
    timestamp: string;
  } | null;
  dailyLogs?: {
    [date: string]: {
      rating: number;
      reflection: string;
      mood?: string;
      moodScore?: number;
    };
  };
  reflectionTemplates?: ReflectionTemplate[];
  enabledMoods?: string[];
  lastUpdated?: string;
  secretCode?: string;
  isRedisUnlocked?: boolean;
  isGoogleDriveUnlocked?: boolean;
  syncProvider?: 'Redis' | 'Google Drive' | 'WebDAV';
  googleDriveTokens?: {
    access_token: string;
    refresh_token?: string;
    expires_at: number;
  };
  googleDriveFileId?: string;
  webdavSettings?: {
    url: string;
    username: string;
    password?: string; // Stored securely if possible, or we just store an auth token
  };
  autoSyncMode?: 'debounce' | 'interval' | 'manual';
  autoSyncDebounceSeconds?: number;
  autoSyncIntervalMinutes?: number;
  deviceType?: string;
  deviceNickname?: string;
  syncHistory?: {
    type: 'login' | 'force_sync' | 'local_to_cloud' | 'cloud_to_local' | 'cancel_login' | 'unbind_local' | 'delete_cloud';
    code: string;
    timestamp: string;
    deviceType?: string;
    deviceNickname?: string;
    deviceCode?: string;
    syncMethod?: 'Manual' | 'Immediate' | 'Interval polling' | 'Visibility API Active';
    syncProvider?: 'Redis' | 'Google Drive' | 'WebDAV';
  }[];
  pushEnabled?: boolean;
  pushSubscription?: any;
  timeSettings?: TimeSettings;
  showOtherInActivityLog?: boolean;
  dailyProgressGoalConfig?: Record<number, number>;
  useSameDailyProgressGoalEveryDay?: boolean;
  dailyProgressGoal?: number;
}

export interface StudySession {
  id: string;
  dungeonId: string;
  duration: number; // total minutes
  focusDuration?: number; // focus minutes
  restDuration?: number; // rest minutes
  timestamp: string;
  coinsEarned: number;
  xpEarned: number;
  rewardName?: string;
  rewardIcon?: string;
  isCrit?: boolean;
  triggeredTalents?: {
    flowExperience?: { xp: number; coins: number };
    perfectTheory?: { xp: number; coins: number };
  };
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  description: string;
  stock?: number; // -1 for infinite
  icon?: string; // Lucide icon name
}

export interface GachaPool {
  id: string;
  name: string;
  type: 'gacha' | 'ichiban';
  cost: number;
  weights?: Record<string, number>;
  rarities?: {
    id: string;
    name: string;
    color: string;
    weight: number;
    rarityValue?: number;
  }[];
  items: {
    rarity: string;
    name: string;
    count?: number; // For Ichiban
    initialCount?: number; // For Ichiban
    color?: string; // For Ichiban custom colors
    rarityValue?: number; // numeric value (1-6)
  }[];
}
