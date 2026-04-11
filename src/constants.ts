import { RewardCard, Talent, GachaPool, Quest } from './types';

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
  {
    id: 'energy_drink',
    name: 'Energy Drink',
    description: 'Next session XP +20%',
    rarity: 'common',
    type: 'item',
    itemType: 'xp_bonus_percent',
    amount: 20,
    weight: 70
  },
  {
    id: 'lucky_charm',
    name: 'Lucky Charm',
    description: 'Next session coins +20%',
    rarity: 'common',
    type: 'item',
    itemType: 'coin_bonus_percent',
    amount: 20,
    weight: 70
  },
  {
    id: 'tea_break',
    name: 'Tea Break',
    description: 'Force a 10-min rest (Once per day)',
    rarity: 'common',
    type: 'text',
    weight: 50
  },
  {
    id: 'small_wallet',
    name: 'Small Wallet',
    description: 'Instantly gain 5 coins',
    rarity: 'common',
    type: 'coins',
    amount: 5,
    weight: 70
  },
  {
    id: 'focus_potion',
    name: 'Focus Potion',
    description: 'Next session coins doubled',
    rarity: 'rare',
    type: 'item',
    itemType: 'double_coin',
    weight: 20
  },
  {
    id: 'double_xp_card',
    name: 'Double XP Card',
    description: 'Next session XP doubled',
    rarity: 'rare',
    type: 'item',
    itemType: 'double_xp',
    weight: 20
  },
  {
    id: 'talent_shard',
    name: 'Talent Shard',
    description: 'Collect 3 for 1 Talent Point',
    rarity: 'epic',
    type: 'item',
    itemType: 'talent_shard',
    amount: 1,
    weight: 9
  },
  {
    id: 'death_defying',
    name: 'Death Defying Gold Medal',
    description: 'Protects streak if a day is missed',
    rarity: 'legendary',
    type: 'item',
    itemType: 'death_defying_medal',
    amount: 1,
    weight: 1
  }
];

export const TALENTS: Talent[] = [
  // Branch A: Truth Crown
  { id: 'a1', name: 'Mind Lubrication', description: 'Base XP +10% per session', branch: 'A', tier: 1, cost: 1, effect: 'xp_10', icon: 'Zap', unlocked: false, active: false },
  { id: 'a2', name: 'Flow Experience α', description: 'Gain 200 XP after 16 sessions in one day', branch: 'A', tier: 2, cost: 2, effect: 'daily_16_xp', icon: 'Flame', unlocked: false, active: false },
  { id: 'a3', name: 'Perfect Theory', description: 'Streak bonus XP (20*n). 1000 XP at day 10.', branch: 'A', tier: 3, cost: 3, effect: 'streak_xp', icon: 'Trophy', unlocked: false, active: false },
  
  // Branch B: Golden Law
  { id: 'b1', name: 'Alchemy', description: 'Base coins +2 per session', branch: 'B', tier: 1, cost: 1, effect: 'coin_2', icon: 'Coins', unlocked: false, active: false },
  { id: 'b2', name: 'Flow Experience β', description: 'Gain 50 coins after 16 sessions in one day', branch: 'B', tier: 2, cost: 2, effect: 'daily_16_coin', icon: 'Gem', unlocked: false, active: false },
  { id: 'b3', name: 'Bounty Decree', description: 'Streak bonus coins (10*n). 100 coins at day 10.', branch: 'B', tier: 3, cost: 3, effect: 'streak_coin', icon: 'ShoppingBag', unlocked: false, active: false },

  // Branch C: Fate Dice
  { id: 'c1', name: 'Extra Chance', description: 'Loot choice becomes 4-of-1', branch: 'C', tier: 1, cost: 1, effect: 'loot_4', icon: 'Target', unlocked: false, active: false },
  { id: 'c2', name: 'Shuffler', description: '1 reroll for loot per day', branch: 'C', tier: 2, cost: 2, effect: 'loot_reroll', icon: 'Zap', unlocked: false, active: false },
  { id: 'c3', name: 'Critical Intuition', description: '5% chance for 5x coins', branch: 'C', tier: 3, cost: 3, effect: 'coin_crit', icon: 'BarChart3', unlocked: false, active: false },
];

export const INITIAL_GACHA: GachaPool[] = [
  {
    id: 'standard_gacha',
    name: 'Standard Gacha',
    type: 'gacha',
    cost: 100,
    weights: { SSR: 5, SR: 15, R: 80 },
    items: [
      { rarity: 'SSR', name: 'Big Lego Set / New Gadget / Weekend Trip' },
      { rarity: 'SR', name: 'Fancy Dinner / Movie Night / Dessert' },
      { rarity: 'R', name: '1 Hour Gaming / 15m Nap / Favorite Snack' }
    ]
  },
  {
    id: 'ichiban_1',
    name: 'Standard Ichiban Kuji',
    type: 'ichiban',
    cost: 50,
    items: [
      { rarity: 'A Prize', name: 'Premium Figure', count: 1, initialCount: 1 },
      { rarity: 'A Prize', name: 'Limited Artbook', count: 1, initialCount: 1 },
      { rarity: 'B Prize', name: 'Luxury Cushion', count: 1, initialCount: 1 },
      { rarity: 'B Prize', name: 'Desk Mat', count: 1, initialCount: 1 },
      { rarity: 'C Prize', name: 'Acrylic Stand', count: 2, initialCount: 2 },
      { rarity: 'C Prize', name: 'Keychain Set', count: 3, initialCount: 3 },
      { rarity: 'D Prize', name: 'Sticker Pack', count: 6, initialCount: 6 },
      { rarity: 'D Prize', name: 'Badge', count: 6, initialCount: 6 },
      { rarity: 'LastOne', name: 'Golden Trophy / Special Edition Figure', count: 1, initialCount: 1 }
    ]
  }
];
