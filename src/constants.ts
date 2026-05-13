import { RewardCard, Talent, GachaPool, Quest } from './types';
import { Sun, CloudLightning, Flame, BatteryLow, Sparkles, Brain, Coffee, Smile, Frown, Meh } from 'lucide-react';

export const MOOD_OPTIONS = [
  { id: 'great', label: 'Great', icon: Sun, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
  { id: 'good', label: 'Good', icon: Smile, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
  { id: 'neutral', label: 'Okay', icon: Meh, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
  { id: 'bad', label: 'Bad', icon: Frown, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/30' },
  { id: 'awful', label: 'Awful', icon: CloudLightning, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
  { id: 'productive', label: 'Productive', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { id: 'tired', label: 'Tired', icon: BatteryLow, color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/30' },
  { id: 'inspired', label: 'Inspired', icon: Sparkles, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  { id: 'focused', label: 'Focused', icon: Brain, color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10', border: 'border-fuchsia-400/30' },
  { id: 'chill', label: 'Chill', icon: Coffee, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/30' }
];

export const DEFAULT_ENABLED_MOODS = ['great', 'good', 'neutral', 'bad', 'awful'];

export const DEFAULT_QUESTS: Quest[] = [
  // Daily Quests
  { id: 'q_daily_1', title: 'Daily Warmup', description: 'Complete 1 session today', type: 'daily_sessions', target: 1, progress: 0, reward: { type: 'xp', amount: 50 }, completed: false, order: 1, isAchievement: false },
  { id: 'q_daily_2', title: 'Daily Grind', description: 'Complete 3 sessions today', type: 'daily_sessions', target: 3, progress: 0, reward: { type: 'coins', amount: 10 }, completed: false, order: 2, isAchievement: false },
  { id: 'q_daily_3', title: 'Daily Master', description: 'Complete 5 sessions today', type: 'daily_sessions', target: 5, progress: 0, reward: { type: 'item', amount: 1, itemName: 'Small Wallet' }, completed: false, order: 3, isAchievement: false },
  
  // Weekly Quests
  { id: 'q_weekly_1', title: 'Weekly Scholar', description: 'Complete 10 sessions this week', type: 'weekly_sessions', target: 10, progress: 0, reward: { type: 'xp', amount: 300 }, completed: false, order: 4, isAchievement: false },
  { id: 'q_weekly_2', title: 'Weekly Dedication', description: 'Complete 25 sessions this week', type: 'weekly_sessions', target: 25, progress: 0, reward: { type: 'coins', amount: 50 }, completed: false, order: 5, isAchievement: false },
  
  // Monthly Quests
  { id: 'q_monthly_1', title: 'Monthly Marathon', description: 'Complete 50 sessions this month', type: 'monthly_sessions', target: 50, progress: 0, reward: { type: 'talentPoint', amount: 1 }, completed: false, order: 6, isAchievement: false },
  
  // Special Quests (Talent based)
  { id: 'q_special_a2', title: 'Flow Experience α', description: 'Complete 16 sessions in one day', type: 'daily_sessions', target: 16, progress: 0, reward: { type: 'xp', amount: 200 }, completed: false, order: 7, isAchievement: false, isSpecial: true, talentRequired: 'a2' },
  { id: 'q_special_b2', title: 'Flow Experience β', description: 'Complete 16 sessions in one day', type: 'daily_sessions', target: 16, progress: 0, reward: { type: 'coins', amount: 50 }, completed: false, order: 8, isAchievement: false, isSpecial: true, talentRequired: 'b2' },
  { id: 'q_special_a3', title: 'Perfect Theory', description: 'Maintain a 10-day streak', type: 'consecutive_days', target: 10, progress: 0, reward: { type: 'xp', amount: 1000 }, completed: false, order: 9, isAchievement: true, isSpecial: true, talentRequired: 'a3' },
  { id: 'q_special_b3', title: 'Bounty Decree', description: 'Maintain a 10-day streak', type: 'consecutive_days', target: 10, progress: 0, reward: { type: 'coins', amount: 100 }, completed: false, order: 10, isAchievement: true, isSpecial: true, talentRequired: 'b3' },

  // Achievements
  { id: 'a_total_10', title: 'First Steps', description: 'Complete 10 sessions in total', type: 'total_sessions', target: 10, progress: 0, reward: { type: 'coins', amount: 20 }, completed: false, order: 11, isAchievement: true },
  { id: 'a_total_50', title: 'Getting Serious', description: 'Complete 50 sessions in total', type: 'total_sessions', target: 50, progress: 0, reward: { type: 'xp', amount: 500 }, completed: false, order: 12, isAchievement: true },
  { id: 'a_total_100', title: 'Centurion', description: 'Complete 100 sessions in total', type: 'total_sessions', target: 100, progress: 0, reward: { type: 'talentPoint', amount: 1 }, completed: false, order: 13, isAchievement: true },
  { id: 'a_streak_3', title: 'Warming Up', description: 'Maintain a 3-day streak', type: 'consecutive_days', target: 3, progress: 0, reward: { type: 'coins', amount: 15 }, completed: false, order: 14, isAchievement: true },
  { id: 'a_streak_7', title: 'Unstoppable', description: 'Maintain a 7-day streak', type: 'consecutive_days', target: 7, progress: 0, reward: { type: 'item', amount: 1, itemName: 'Death Defying Gold Medal' }, completed: false, order: 15, isAchievement: true },
];

export const INITIAL_REWARD_POOL: RewardCard[] = [
  // COMMON
  { id: 'lucky_penny', name: 'Lucky Penny', description: 'Gain 1 Gold Coin', rarity: 'common', type: 'coins', amount: 1, weight: 100 },
  { id: 'copper_bag', name: 'Copper Bag', description: 'Gain 3 Gold Coins', rarity: 'common', type: 'coins', amount: 3, weight: 60 },
  { id: 'small_wallet', name: 'Small Wallet', description: 'Gain 5 Gold Coins', rarity: 'common', type: 'coins', amount: 5, weight: 40 },
  { id: 'energy_drink', name: 'Energy Drink', description: 'Next XP +20%', rarity: 'common', type: 'item', itemType: 'xp_bonus_percent', amount: 20, weight: 70 },
  { id: 'lucky_charm', name: 'Lucky Charm', description: 'Next Coins +20%', rarity: 'common', type: 'item', itemType: 'coin_bonus_percent', amount: 20, weight: 70 },
  { id: 'coffee_bean', name: 'Coffee Bean', description: 'Next XP +10%', rarity: 'common', type: 'item', itemType: 'xp_bonus_percent', amount: 10, weight: 85 },
  { id: 'bookmark', name: 'Bookmark', description: 'Next Coins +10%', rarity: 'common', type: 'item', itemType: 'coin_bonus_percent', amount: 10, weight: 85 },
  { 
    id: 'game_break', 
    name: 'Game Break', 
    description: '10 min gaming break', 
    rarity: 'common', 
    type: 'text', 
    weight: 50, 
    limitCount: 3, 
    limitPeriodDays: 1 
  },
  { 
    id: 'chocolate', 
    name: 'Chocolate', 
    description: 'Eat a small snack', 
    rarity: 'common', 
    type: 'text', 
    weight: 50, 
    limitCount: 3, 
    limitPeriodDays: 1 
  },
  { 
    id: 'fresh_air', 
    name: 'Fresh Air', 
    description: '10 min walking break', 
    rarity: 'common', 
    type: 'text', 
    weight: 50, 
    limitCount: 1, 
    limitPeriodDays: 1 
  },
  { 
    id: 'fruit_bowl', 
    name: 'Fruit Bowl', 
    description: 'Eat some fresh fruit', 
    rarity: 'common', 
    type: 'text', 
    weight: 50, 
    limitCount: 1, 
    limitPeriodDays: 1 
  },

  // RARE
  { id: 'double_xp', name: 'Double Experience', description: 'Double XP next session', rarity: 'rare', type: 'item', itemType: 'double_xp', amount: 100, weight: 25 },
  { id: 'focus_pot', name: 'Focus Potion', description: 'Double Coins next session', rarity: 'rare', type: 'item', itemType: 'double_coin', amount: 100, weight: 25 },
  { 
    id: 'music_pass', 
    name: 'Music Pass', 
    description: 'Listen to music next session', 
    rarity: 'rare', 
    type: 'text', 
    weight: 30, 
    limitCount: 2, 
    limitPeriodDays: 1 
  },

  // EPIC
  { id: 'talent_shard', name: 'Talent Shard', description: 'Talent point piece (1/3)', rarity: 'epic', type: 'item', itemType: 'talent_shard', amount: 1, weight: 12 },
  { 
    id: 'milk_tea', 
    name: 'Milk Tea', 
    description: 'Enjoy a cup of Milk Tea', 
    rarity: 'epic', 
    type: 'text', 
    weight: 5, 
    limitCount: 1, 
    limitPeriodDays: 1 
  },

  // LEGENDARY
  { 
    id: 'death_gold', 
    name: 'Death Defying Medal', 
    description: 'Prevent one streak break', 
    rarity: 'legendary', 
    type: 'item', 
    itemType: 'death_defying_medal', 
    amount: 1, 
    weight: 1, 
    limitCount: 1, 
    limitPeriodDays: 1 
  }
];

export const TALENTS: Talent[] = [
  // Branch A: Truth Crown
  { id: 'a1', name: 'Mind Lubrication', description: 'Base XP +10% per session', branch: 'A', tier: 1, cost: 1, effect: 'xp_10', icon: 'BicepsFlexed', unlocked: false, active: false },
  { id: 'a2', name: 'Flow Experience α', description: 'The 16th session of the day gains +200 XP', branch: 'A', tier: 2, cost: 2, effect: 'daily_16_xp', icon: 'BrainCircuit', unlocked: false, active: false },
  { id: 'a3', name: 'Perfect Theory', description: '8th session of the day gains bonus XP (20 * Streak). Extra +1000 XP at Day 10.', branch: 'A', tier: 3, cost: 3, effect: 'streak_xp', icon: 'Rocket', unlocked: false, active: false },
  
  // Branch B: Golden Law
  { id: 'b1', name: 'Alchemy', description: 'Base coins +2 per session', branch: 'B', tier: 1, cost: 1, effect: 'coin_2', icon: 'Pickaxe', unlocked: false, active: false },
  { id: 'b2', name: 'Flow Experience β', description: 'The 16th session of the day gains +50 Coins', branch: 'B', tier: 2, cost: 2, effect: 'daily_16_coin', icon: 'BrainCog', unlocked: false, active: false },
  { id: 'b3', name: 'Bounty Decree', description: '8th session of the day gains bonus Coins (10 * Streak). Extra +100 Coins at Day 10.', branch: 'B', tier: 3, cost: 3, effect: 'streak_coin', icon: 'Goal', unlocked: false, active: false },

  // Branch C: Fate Dice
  { id: 'c1', name: 'Extra Chance', description: 'Loot choice becomes 4-of-1', branch: 'C', tier: 1, cost: 1, effect: 'loot_4', icon: 'HeartPlus', unlocked: false, active: false },
  { id: 'c2', name: 'Shuffler', description: '1 reroll for loot per day', branch: 'C', tier: 2, cost: 2, effect: 'loot_reroll', icon: 'Dices', unlocked: false, active: false },
  { id: 'c3', name: 'Critical Intuition', description: '5% chance for 5x coins', branch: 'C', tier: 3, cost: 3, effect: 'coin_crit', icon: 'HandCoins', unlocked: false, active: false },
];

export const INITIAL_GACHA: GachaPool[] = [
  {
    id: 'standard_gacha',
    name: 'Standard Gacha',
    type: 'gacha',
    cost: 100,
    rarities: [
      { id: 'SSR', name: 'SSR', color: 'amber', weight: 5, rarityValue: 5 },
      { id: 'SR', name: 'SR', color: 'purple', weight: 15, rarityValue: 4 },
      { id: 'R', name: 'R', color: 'blue', weight: 80, rarityValue: 3 },
    ],
    items: [
      { rarity: 'SSR', name: 'Big Lego Set / New Gadget / Weekend Trip', rarityValue: 5 },
      { rarity: 'SR', name: 'Fancy Dinner / Movie Night / Dessert', rarityValue: 4 },
      { rarity: 'R', name: '1 Hour Gaming / 15m Nap / Favorite Snack', rarityValue: 3 }
    ]
  },
  {
    id: 'ichiban_1',
    name: 'Standard Ichiban Kuji',
    type: 'ichiban',
    cost: 50,
    items: [
      { rarity: 'A Prize', name: 'Premium Figure / Limited Artbook', count: 1, initialCount: 1, color: 'amber', rarityValue: 5 },
      { rarity: 'B Prize', name: 'Luxury Cushion / Desk Mat', count: 2, initialCount: 2, color: 'purple', rarityValue: 4 },
      { rarity: 'C Prize', name: 'Acrylic Stand / Keychain Set', count: 5, initialCount: 5, color: 'blue', rarityValue: 3 },
      { rarity: 'D Prize', name: 'Sticker Pack / Badge', count: 12, initialCount: 12, color: 'emerald', rarityValue: 2 },
      { rarity: 'LastOne', name: 'Golden Trophy / Special Edition Figure', count: 1, initialCount: 1, color: 'rose', rarityValue: 6 }
    ]
  }
];

export const DEFAULT_SAGE_PROMPTS = [
  { id: 'prompt_welcome', title: '初次见面', prompt: 'Sage，请向我介绍一下这个“学者密室（Scholar\'s Dungeon）”程序。它的核心玩法、收益机制以及我该如何在这里开始我的成长旅程？' },
  { id: 'prompt_balance', title: '平衡建议', prompt: '请根据我目前的等级、金币获取频率和商店物品价格，建议我该如何设置我的游戏平衡？比如每次 Focus Session 的 XP 与 Gold 奖励应该如何分配才最公平且有驱动力？' },
  { id: 'prompt_week', title: '周度分析', prompt: '请调取我过去 7 天的学习记录，分析我的专注力高峰时段、情绪状态与产出的正相关性。请用直观的数据观察总结出我这一周的整体表现。' },
  { id: 'prompt_month', title: '月度复盘', prompt: '我想对过去一个月进行深度回想。请分析我的月度进步曲线，我是否在某个领域停滞了？基于我的成长速度，给我下个月制定三个具体的“阶梯型目标”。' },
  { id: 'prompt_1', title: '效率改进', prompt: '请分析我最近的学习效率趋势，并给出三个切实可行的改进建议。' },
  { id: 'prompt_3', title: '寻求鼓励', prompt: '我最近有点疲惫，请给我一些鼓励和动力。' }
];
