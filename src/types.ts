export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface RewardCard {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  type: 'coins' | 'xp' | 'item' | 'text';
  amount?: number;
  itemType?: 'double_xp' | 'double_coin' | 'talent_shard' | 'death_defying_medal' | 'xp_bonus_percent' | 'coin_bonus_percent';
  weight: number;
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
  status: 'active' | 'completed';
  isFinalized?: boolean;
  rewards?: DungeonReward[];
  completedAt?: string;
}

export interface RewardHistoryItem {
  id: string;
  name: string;
  rarity: string;
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

export interface UserState {
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
  devBaseCoins?: number;
  devMinCoins?: number;
  devMaxCoins?: number;
  devCoinMode?: 'fixed' | 'random';
  devCritChance?: number;
  devCritMultiplier?: number;
  theme?: string;
  soundEnabled?: boolean;
  soundVolume?: number;
  defaultMarkdownEnabled?: boolean;
  // Editable Pools
  rewardPool: RewardCard[];
  shopItems: ShopItem[];
  gachaPools: GachaPool[];
  levelRewards?: LevelReward[];
  lastCompletionRewards?: {
    dungeonName: string;
    type: 'dungeon' | 'quest' | 'achievement';
    rewards: DungeonReward[];
  } | null;
  dailyLogs?: {
    [date: string]: {
      rating: number;
      reflection: string;
    };
  };
  lastUpdated?: string;
  secretCode?: string;
  deviceType?: string;
  syncHistory?: {
    type: 'login' | 'force_sync' | 'local_to_cloud' | 'cloud_to_local' | 'cancel_login' | 'unbind_local' | 'delete_cloud';
    code: string;
    timestamp: string;
    deviceType?: string;
  }[];
  pushEnabled?: boolean;
  pushSubscription?: any;
}

export interface StudySession {
  id: string;
  dungeonId: string;
  duration: number; // minutes
  timestamp: string;
  coinsEarned: number;
  xpEarned: number;
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
  weights?: {
    SSR: number;
    SR: number;
    R: number;
  };
  items: {
    rarity: string;
    name: string;
    count?: number; // For Ichiban
    initialCount?: number; // For Ichiban
  }[];
}
