import { useState, useEffect, useCallback } from 'react';
import { UserState, Dungeon, StudySession, Talent, RewardCard, MajorDungeon, RewardHistoryItem, DungeonReward, Quest } from '../types';
import { TALENTS, INITIAL_REWARD_POOL, INITIAL_GACHA, DEFAULT_QUESTS } from '../constants';
import { format, isSameDay, parseISO, differenceInDays } from 'date-fns';

import { getXPForLevel, getDefaultRewardForLevel, getDeviceType } from '../lib/utils';

const STORAGE_KEY = 'scholars_dungeon_state';

export function useGameState() {
  const [state, setState] = useState<UserState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const defaultState: UserState = {
      level: 1,
      xp: 0,
      coins: 0,
      talentPoints: 0,
      talentShards: 0,
      deathDefyingMedals: 0,
      unlockedTalents: [],
      activeTalents: [],
      currentDungeonId: null,
      history: [],
      rewardHistory: [],
      lastStudyDate: null,
      streak: 0,
      dailySessions: 0,
      lastDailyReset: null,
      dailyRerollUsed: false,
      inventory: [],
      userName: 'Scholar',
      userBio: 'Master of the Study Dungeon',
      quests: DEFAULT_QUESTS,
      questNotificationStyle: 'red_dot',
      unclaimedQuests: 0,
      devModeEnabled: false,
      pushEnabled: false,
      pushSubscription: null,
      deviceType: getDeviceType(),
      timeSettings: {
        morning: { start: 8, end: 12 },
        afternoon: { start: 14, end: 18 },
        night: { start: 20, end: 24 }
      },
      devBaseXP: 100,
      devBaseCoins: 10,
      devMinCoins: 5,
      devMaxCoins: 15,
      devCoinMode: 'random',
      devCritChance: 0.05,
      devCritMultiplier: 5,
      gachaAnimation: 'card',
      ichibanAnimation: 'scratch',
      gachaAllowOverlap: false,
      defaultMarkdownEnabled: true,
      dailyLogs: {},
      rewardPool: INITIAL_REWARD_POOL,
      shopItems: [
        { id: '1', name: 'Watch a Movie', price: 500, description: 'Treat yourself to a cinema experience' },
        { id: '2', name: 'Buy New Clothes', price: 2000, description: 'Refresh your wardrobe' },
        { id: '3', name: 'Weekend Trip', price: 10000, description: 'A well-deserved getaway' },
      ],
      gachaPools: [
        {
          id: 'standard_gacha',
          name: 'Gacha',
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
          name: 'ICHIBAN',
          type: 'ichiban',
          cost: 50,
          items: [
            { rarity: 'A Prize', name: 'Premium Figure / Limited Artbook', count: 1, initialCount: 1 },
            { rarity: 'B Prize', name: 'Luxury Cushion / Desk Mat', count: 2, initialCount: 2 },
            { rarity: 'C Prize', name: 'Acrylic Stand / Keychain Set', count: 5, initialCount: 5 },
            { rarity: 'D Prize', name: 'Sticker Pack / Badge', count: 12, initialCount: 12 },
            { rarity: 'LastOne', name: 'Golden Trophy / Special Edition Figure', count: 1, initialCount: 1 }
          ]
        }
      ]
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Migration: gachaEffect to split animations
        if (parsed.gachaEffect) {
          if (!parsed.gachaAnimation) parsed.gachaAnimation = parsed.gachaEffect;
          if (!parsed.ichibanAnimation) parsed.ichibanAnimation = parsed.gachaEffect;
        } else {
          if (!parsed.gachaAnimation) parsed.gachaAnimation = 'card';
          if (!parsed.ichibanAnimation) parsed.ichibanAnimation = 'scratch';
        }
        
        // Migration: Update rewardPool to new structure if needed
        if (parsed.rewardPool) {
          parsed.rewardPool = parsed.rewardPool.map((card: any) => {
            // If it's an old 'functional' type or missing the new types, migrate it
            if (card.type === 'functional' || !['coins', 'xp', 'item', 'text'].includes(card.type)) {
              const migrated = { ...card };
              migrated.type = 'item';
              
              // Map old effects to new itemTypes
              if (card.effect) {
                if (card.effect.type === 'xp_boost') {
                  migrated.itemType = 'xp_bonus_percent';
                  migrated.amount = card.effect.value * 100;
                } else if (card.effect.type === 'double_xp') {
                  migrated.itemType = 'double_xp';
                } else if (card.effect.type === 'double_coin') {
                  migrated.itemType = 'double_coin';
                }
              }
              
              // Handle specific items by name if effect is missing
              if (card.name === 'Talent Shard') {
                migrated.itemType = 'talent_shard';
                migrated.amount = 1;
              }
              if (card.name === 'Death Defying Gold Medal') {
                migrated.itemType = 'death_defying_medal';
                migrated.amount = 1;
              }
              if (card.name === 'Small Wallet') {
                migrated.type = 'coins';
                migrated.amount = 5;
              }
              if (card.name === 'Tea Break') {
                migrated.type = 'text';
              }
              
              return migrated;
            }

            // Even if type is correct, fix missing amounts for specific items
            if (card.type === 'item') {
              if (card.itemType === 'talent_shard' && (card.amount === undefined || card.amount === 0)) {
                return { ...card, amount: 1 };
              }
              if (card.itemType === 'death_defying_medal' && (card.amount === undefined || card.amount === 0)) {
                return { ...card, amount: 1 };
              }
            }
            if (card.name === 'Small Wallet' && card.type !== 'coins') {
              return { ...card, type: 'coins', amount: 5 };
            }
            if (card.name === 'Tea Break' && card.type !== 'text') {
              return { ...card, type: 'text' };
            }

            return card;
          });
        }

        // Migration: Update rewardHistory
        if (parsed.rewardHistory) {
          parsed.rewardHistory = parsed.rewardHistory.map((item: any) => {
            if (item.type === 'functional' || !['coins', 'xp', 'item', 'text'].includes(item.type)) {
              return { ...item, type: 'item' };
            }
            return item;
          });
        }

        // Migration: Default timeSettings if missing
        if (!parsed.timeSettings) {
          parsed.timeSettings = defaultState.timeSettings;
        }

        return { ...defaultState, ...parsed };
      } catch (e) {
        console.error('Failed to parse saved state', e);
        return defaultState;
      }
    }
    return defaultState;
  });

  const [dungeons, setDungeons] = useState<Dungeon[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_dungeons');
    if (saved) return JSON.parse(saved);
    // Fallback: try to load from the main state if it exists there (legacy)
    const mainSaved = localStorage.getItem(STORAGE_KEY);
    if (mainSaved) {
      const parsed = JSON.parse(mainSaved);
      if (parsed.dungeons) return parsed.dungeons;
    }
    return [];
  });

  const [majorDungeons, setMajorDungeons] = useState<MajorDungeon[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_major_dungeons');
    if (saved) return JSON.parse(saved);
    // Fallback: try to load from the main state if it exists there (legacy)
    const mainSaved = localStorage.getItem(STORAGE_KEY);
    if (mainSaved) {
      const parsed = JSON.parse(mainSaved);
      if (parsed.majorDungeons) return parsed.majorDungeons;
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_dungeons', JSON.stringify(dungeons));
  }, [dungeons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_major_dungeons', JSON.stringify(majorDungeons));
  }, [majorDungeons]);

  useEffect(() => {
    const currentDeviceType = getDeviceType();
    if (state.deviceType !== currentDeviceType) {
      setState(prev => ({ ...prev, deviceType: currentDeviceType }));
    }
  }, [state.deviceType]);

  // Daily Reset Logic
  useEffect(() => {
    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');
    const currentWeekStr = format(now, 'yyyy-' + Math.ceil(now.getDate() / 7)); // Simple weekly grouping, or use date-fns getISOWeek
    const currentMonthStr = format(now, 'yyyy-MM');

    let needsUpdate = false;
    let updates: Partial<UserState> = {};

    if (state.lastDailyReset !== todayStr) {
      needsUpdate = true;
      updates.dailySessions = 0;
      updates.dailyRerollUsed = false;
      updates.lastDailyReset = todayStr;
      updates.streak = state.lastStudyDate ? (differenceInDays(now, parseISO(state.lastStudyDate)) <= 1 ? state.streak : 0) : 0;
      
      // Reset daily quests
      if (state.quests) {
        updates.quests = state.quests.map(q => {
          if (q.type === 'daily_sessions') {
            return { ...q, progress: 0, completed: false, claimed: false };
          }
          return q;
        });
      }
    }

    if (state.lastWeeklyReset !== currentWeekStr) {
      needsUpdate = true;
      updates.lastWeeklyReset = currentWeekStr;
      if (state.quests) {
        updates.quests = (updates.quests || state.quests).map(q => {
          if (q.type === 'weekly_sessions') {
            return { ...q, progress: 0, completed: false, claimed: false };
          }
          return q;
        });
      }
    }

    if (state.lastMonthlyReset !== currentMonthStr) {
      needsUpdate = true;
      updates.lastMonthlyReset = currentMonthStr;
      if (state.quests) {
        updates.quests = (updates.quests || state.quests).map(q => {
          if (q.type === 'monthly_sessions') {
            return { ...q, progress: 0, completed: false, claimed: false };
          }
          return q;
        });
      }
    }

    if (needsUpdate) {
      setState(prev => ({ ...prev, ...updates }));
    }
  }, [state.lastDailyReset, state.lastWeeklyReset, state.lastMonthlyReset, state.lastStudyDate, state.streak, state.quests]);

  // Helper functions for state updates
  const processXP = (state: UserState, amount: number): UserState => {
    let newXP = state.xp + amount;
    let newLevel = state.level;
    let newTalentPoints = state.talentPoints;
    let newCoins = state.coins;
    let newRewardHistory = [...state.rewardHistory];

    while (newXP >= getXPForLevel(newLevel)) {
      newXP -= getXPForLevel(newLevel);
      newLevel++;
      
      const customReward = state.levelRewards?.find(r => r.level === newLevel);
      if (customReward) {
        if (customReward.type === 'talentPoint') newTalentPoints += customReward.amount;
        else if (customReward.type === 'coins') newCoins += customReward.amount;
        
        newRewardHistory.unshift({
          id: Math.random().toString(36).substr(2, 9),
          name: customReward.type === 'text' ? (customReward.rewardText || 'Custom Reward') : `${customReward.amount} ${customReward.type}`,
          rarity: 'common',
          source: 'LevelUp',
          timestamp: new Date().toISOString(),
          type: customReward.type === 'text' ? 'text' : (customReward.type === 'coins' ? 'coins' : 'item'),
          redeemed: true
        });
      } else {
        const defaultReward = getDefaultRewardForLevel(newLevel);
        if (defaultReward) {
          if (defaultReward.type === 'talentPoint') newTalentPoints += defaultReward.amount;
          else if (defaultReward.type === 'coins') newCoins += defaultReward.amount;
          
          newRewardHistory.unshift({
            id: Math.random().toString(36).substr(2, 9),
            name: `${defaultReward.amount} ${defaultReward.type}`,
            rarity: 'common',
            source: 'LevelUp',
            timestamp: new Date().toISOString(),
            type: defaultReward.type === 'coins' ? 'coins' : 'item',
            redeemed: true
          });
        }
      }
    }

    return { ...state, xp: newXP, level: newLevel, talentPoints: newTalentPoints, coins: newCoins, rewardHistory: newRewardHistory };
  };

  const processShards = (state: UserState, amount: number): UserState => {
    let newShards = state.talentShards + amount;
    let newTalentPoints = state.talentPoints;

    while (newShards >= 3) {
      newShards -= 3;
      newTalentPoints += 1;
    }

    return { ...state, talentShards: newShards, talentPoints: newTalentPoints };
  };

  const addXP = useCallback((amount: number) => {
    setState(prev => processXP(prev, amount));
  }, []);

  const addShards = useCallback((amount: number) => {
    setState(prev => processShards(prev, amount));
  }, []);

  const addCoins = useCallback((amount: number) => {
    setState(prev => ({ ...prev, coins: prev.coins + amount }));
  }, []);

  const addRewardToHistory = useCallback((reward: Omit<RewardHistoryItem, 'id' | 'timestamp' | 'redeemed'>, linkToSessionId?: string) => {
    setState(prev => {
      const newItem: RewardHistoryItem = {
        ...reward,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        redeemed: reward.type !== 'item' && reward.type !== 'text'
      };

      let newState = { ...prev, rewardHistory: [newItem, ...prev.rewardHistory] };

      if (linkToSessionId) {
        newState.history = newState.history.map(s => 
          s.id === linkToSessionId ? { ...s, rewardName: reward.name } : s
        );
      }

      // Special handling for immediate value rewards
      if (reward.type === 'coins') {
        newState.coins += reward.amount || 0;
      } else if (reward.type === 'xp') {
        newState = processXP(newState, reward.amount || 0);
      } else if (reward.type === 'item') {
        if (reward.itemType === 'talent_shard') {
          newState = processShards(newState, reward.amount || 1);
          newItem.redeemed = true;
        } else if (reward.itemType === 'death_defying_medal') {
          newState.deathDefyingMedals += reward.amount || 1;
          newItem.redeemed = true;
        }
      }

      return newState;
    });
  }, []);

  const finalizeMajorDungeon = useCallback((id: string) => {
    setMajorDungeons(prevMajors => {
      const major = prevMajors.find(m => m.id === id);
      if (!major || major.isFinalized) return prevMajors;

      const updatedMajors = prevMajors.map(m => m.id === id ? { ...m, isFinalized: true } : m);
      
      // Check if it should be completed immediately
      const subs = dungeons.filter(d => d.parentId === id);
      const allCompleted = subs.length > 0 && subs.every(d => d.status === 'completed');

      if (allCompleted) {
        // Trigger rewards
        if (major.rewards) {
          major.rewards.forEach(reward => {
            if (reward.type === 'coins') addCoins(reward.amount);
            else if (reward.type === 'talentPoint') setState(s => ({ ...s, talentPoints: s.talentPoints + reward.amount }));
            else if (reward.type === 'xp') addXP(reward.amount);
            
            addRewardToHistory({
              name: reward.type === 'text' ? (reward.rewardText || 'Dungeon Goal Reward') : 
                    reward.type === 'talentPoint' ? `+${reward.amount} Talent Points` :
                    reward.type === 'coins' ? `+${reward.amount} Gold Coins` :
                    reward.type === 'xp' ? `+${reward.amount} Experience` :
                    (reward.itemName || 'Item'),
              rarity: 'rare',
              source: 'Explore',
              type: reward.type === 'text' ? 'text' : (reward.type === 'coins' ? 'coins' : (reward.type === 'xp' ? 'xp' : 'item')),
              amount: reward.amount,
              itemType: reward.itemType
            });
          });

          setState(s => ({
            ...s,
            lastCompletionRewards: {
              dungeonName: `GOAL ACHIEVED: ${major.name}`,
              type: 'dungeon',
              rewards: major.rewards || []
            }
          }));
        }
        return updatedMajors.map(m => m.id === id ? { ...m, status: 'completed', completedAt: new Date().toISOString() } : m);
      }

      return updatedMajors;
    });
  }, [dungeons, addCoins, addXP, addRewardToHistory]);

  const completeSession = useCallback((dungeonId: string | null, duration: number, focusDuration?: number, restDuration?: number) => {
    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');
    
    // Calculate rewards
    let baseXP = state.devModeEnabled ? (state.devBaseXP ?? 100) : 100;
    let baseCoins = 0;
    
    if (state.devModeEnabled) {
      if (state.devCoinMode === 'fixed') {
        baseCoins = state.devBaseCoins ?? 10;
      } else {
        // Random mode: between min and max
        const min = state.devMinCoins ?? 5;
        const max = state.devMaxCoins ?? 15;
        baseCoins = Math.floor(min + Math.random() * (max - min + 1));
      }
    } else {
      baseCoins = Math.floor(Math.random() * 11) + 5;
    }

    // Apply talents
    if (state.activeTalents.includes('a1')) baseXP *= 1.1; // Mind Lubrication
    if (state.activeTalents.includes('b1')) baseCoins += 2; // Alchemy
    
    // Critical Intuition
    let isCrit = false;
    const critChance = state.devModeEnabled ? (state.devCritChance ?? 0.05) : 0.05;
    const critMult = state.devModeEnabled ? (state.devCritMultiplier ?? 5) : 5;

    if (state.activeTalents.includes('c3') && Math.random() < critChance) {
      baseCoins *= critMult;
      isCrit = true;
    }

    // Apply Inventory Effects
    (state.inventory || []).forEach(cardId => {
      const card = (state.rewardPool || []).find(c => c.id === cardId);
      if (card && card.type === 'item') {
        if (card.itemType === 'xp_bonus_percent') baseXP *= (1 + (card.amount || 0) / 100);
        if (card.itemType === 'coin_bonus_percent') baseCoins *= (1 + (card.amount || 0) / 100);
        if (card.itemType === 'double_xp') baseXP *= 2;
        if (card.itemType === 'double_coin') baseCoins *= 2;
      }
    });

    // Daily 16 session bonuses
    const is16th = state.dailySessions === 15; // 15 because we haven't incremented yet
    const triggeredTalents: StudySession['triggeredTalents'] = {};

    if (is16th) {
      const a2Active = state.activeTalents.includes('a2');
      const b2Active = state.activeTalents.includes('b2');
      if (a2Active || b2Active) {
        triggeredTalents.flowExperience = { xp: 0, coins: 0 };
        if (a2Active) {
          baseXP += 200;
          triggeredTalents.flowExperience.xp = 200;
        }
        if (b2Active) {
          baseCoins += 50;
          triggeredTalents.flowExperience.coins = 50;
        }
      }
    }

    // Streak bonuses (Perfect Theory / Bounty Decree)
    // These are complex (20*n and 10*n). We'll apply them if streak >= 2
    if (state.streak >= 2 && state.streak <= 10 && state.dailySessions === 7) { // 8th session of the day
      const a3Active = state.activeTalents.includes('a3');
      const b3Active = state.activeTalents.includes('b3');
      if (a3Active || b3Active) {
        triggeredTalents.perfectTheory = { xp: 0, coins: 0 };
        if (a3Active) {
          const xpBonus = 20 * state.streak + (state.streak === 10 ? 1000 : 0);
          baseXP += xpBonus;
          triggeredTalents.perfectTheory.xp = xpBonus;
        }
        if (b3Active) {
          const coinBonus = 10 * state.streak + (state.streak === 10 ? 100 : 0);
          baseCoins += coinBonus;
          triggeredTalents.perfectTheory.coins = coinBonus;
        }
      }
    }

    const session: StudySession = {
      id: Math.random().toString(36).substr(2, 9),
      dungeonId: dungeonId || 'free_study',
      duration,
      focusDuration,
      restDuration,
      timestamp: now.toISOString(),
      coinsEarned: Math.floor(baseCoins),
      xpEarned: Math.floor(baseXP),
      isCrit,
      triggeredTalents: Object.keys(triggeredTalents).length > 0 ? triggeredTalents : undefined
    };

    setState(prev => {
      const isNewDay = prev.lastStudyDate !== todayStr;
      const newStreak = isNewDay ? prev.streak + 1 : prev.streak;
      
      // Update shop stock if applicable
      const newShopItems = prev.shopItems.map(item => {
        if (dungeonId && item.id === dungeonId && item.stock !== undefined && item.stock > 0) {
          return { ...item, stock: item.stock - 1 };
        }
        return item;
      });

      let newState = {
        ...prev,
        history: [...prev.history, session],
        lastStudyDate: todayStr,
        streak: newStreak,
        dailySessions: prev.dailySessions + 1,
        coins: prev.coins + Math.floor(baseCoins),
        inventory: [], // Clear inventory after session
        shopItems: newShopItems
      };

      // Process Quests
      if (newState.quests) {
        let questsUpdated = false;
        let newlyCompletedQuests = 0;
        const updatedQuests = newState.quests.map(q => {
          if (q.completed) return q;

          // Check if quest is locked by talent
          if (q.talentRequired && !newState.activeTalents.includes(q.talentRequired)) {
            return q;
          }

          let newProgress = q.progress;
          if (q.type === 'daily_sessions' || q.type === 'weekly_sessions' || q.type === 'monthly_sessions' || q.type === 'total_sessions') {
            newProgress += 1;
          } else if (q.type === 'consecutive_days') {
            newProgress = newStreak;
          }

          if (newProgress !== q.progress) {
            questsUpdated = true;
            if (newProgress >= q.target) {
              newlyCompletedQuests += 1;
              return { ...q, progress: newProgress, completed: true };
            }
            return { ...q, progress: newProgress };
          }
          return q;
        });

        if (questsUpdated) {
          newState.quests = updatedQuests;
          if (newlyCompletedQuests > 0) {
            newState.unclaimedQuests = (newState.unclaimedQuests || 0) + newlyCompletedQuests;
            
            // Handle instant popup
            if (newState.questNotificationStyle === 'popup') {
              const completedQuests = updatedQuests.filter(q => q.completed && !q.claimed && prev.quests.find(oldQ => oldQ.id === q.id && !oldQ.completed));
              const questRewards: DungeonReward[] = completedQuests.map(q => ({
                type: q.reward.type as any,
                amount: q.reward.amount,
                itemName: q.reward.itemName,
                rewardText: q.reward.rewardText
              }));

              if (questRewards.length > 0) {
                newState.lastCompletionRewards = {
                  dungeonName: newlyCompletedQuests === 1 ? `QUEST COMPLETE: ${completedQuests[0].title}` : `${newlyCompletedQuests} QUESTS COMPLETED`,
                  type: completedQuests.some(q => q.isAchievement) ? 'achievement' : 'quest',
                  rewards: questRewards
                };
                
                // Auto-claim and apply rewards
                completedQuests.forEach(q => {
                  const r = q.reward;
                  if (r.type === 'coins') {
                    newState.coins += r.amount;
                  } else if (r.type === 'xp') {
                    newState = processXP(newState, r.amount);
                  } else if (r.type === 'talentPoint') {
                    newState.talentPoints += r.amount;
                  } else if (r.type === 'item') {
                    if (r.itemName === 'Talent Shard') {
                      newState = processShards(newState, r.amount);
                    } else if (r.itemName === 'Death Defying Gold Medal') {
                      newState.deathDefyingMedals += r.amount;
                    }
                  }
                  
                  // Add to history
                  newState.rewardHistory = [{
                    id: Math.random().toString(36).substr(2, 9),
                    name: r.type === 'text' ? (r.rewardText || 'Quest Reward') : 
                          r.type === 'talentPoint' ? `+${r.amount} Talent Points` :
                          r.type === 'coins' ? `+${r.amount} Gold Coins` :
                          r.type === 'xp' ? `+${r.amount} Experience` :
                          (r.itemName || 'Item'),
                    rarity: q.isAchievement ? 'epic' : 'rare',
                    source: 'Explore',
                    timestamp: new Date().toISOString(),
                    type: r.type === 'text' ? 'text' : (r.type === 'coins' ? 'coins' : (r.type === 'xp' ? 'xp' : 'item')),
                    amount: r.amount,
                    redeemed: r.type !== 'item' && r.type !== 'text'
                  }, ...newState.rewardHistory];
                });

                newState.quests = newState.quests.map(q => {
                  if (completedQuests.find(cq => cq.id === q.id)) {
                    return { ...q, claimed: true };
                  }
                  return q;
                });
                newState.unclaimedQuests = Math.max(0, newState.unclaimedQuests - newlyCompletedQuests);
              }
            }
          }
        }
      }

      return processXP(newState, Math.floor(baseXP));
    });

    if (dungeonId) {
      setDungeons(prevDungeons => {
        const updatedDungeons = prevDungeons.map(d => {
          if (d.id === dungeonId) {
            const newCompleted = d.completedSessions + 1;
            if (newCompleted >= d.totalSessions && d.status !== 'completed') {
              // Dungeon completed rewards
              const allRewards: DungeonReward[] = [];
              if (d.rewardXP > 0) allRewards.push({ type: 'xp', amount: d.rewardXP });
              if (d.rewardCoins > 0) allRewards.push({ type: 'coins', amount: d.rewardCoins });
              if (d.rewards) allRewards.push(...d.rewards);

              // Process rewards
              allRewards.forEach(reward => {
                if (reward.type === 'coins') addCoins(reward.amount);
                else if (reward.type === 'talentPoint') setState(s => ({ ...s, talentPoints: s.talentPoints + reward.amount }));
                else if (reward.type === 'xp') addXP(reward.amount);
                
                addRewardToHistory({
                  name: reward.type === 'text' ? (reward.rewardText || 'Dungeon Reward') : 
                        reward.type === 'talentPoint' ? `+${reward.amount} Talent Points` :
                        reward.type === 'coins' ? `+${reward.amount} Gold Coins` :
                        reward.type === 'xp' ? `+${reward.amount} Experience` :
                        (reward.itemName || 'Item'),
                  rarity: 'common',
                  source: 'Explore',
                  type: reward.type === 'text' ? 'text' : (reward.type === 'coins' ? 'coins' : (reward.type === 'xp' ? 'xp' : 'item')),
                  amount: reward.amount,
                  itemType: reward.itemType
                });
              });

              // Set completion rewards for popup
              setState(s => ({
                ...s,
                lastCompletionRewards: {
                  dungeonName: d.name,
                  type: 'dungeon',
                  rewards: allRewards
                }
              }));

              // Check for Major Dungeon completion
              if (d.parentId) {
                setMajorDungeons(prevMajors => {
                  const major = prevMajors.find(m => m.id === d.parentId);
                  const otherSubs = updatedDungeons.filter(sd => sd.parentId === d.parentId && sd.id !== d.id);
                  const allOtherCompleted = otherSubs.every(sd => sd.status === 'completed');
                  
                  if (allOtherCompleted && major?.isFinalized && major.status !== 'completed') {
                    // Major Dungeon Rewards
                    if (major.rewards) {
                      major.rewards.forEach(reward => {
                        if (reward.type === 'coins') addCoins(reward.amount);
                        else if (reward.type === 'talentPoint') setState(s => ({ ...s, talentPoints: s.talentPoints + reward.amount }));
                        else if (reward.type === 'xp') addXP(reward.amount);
                        
                        addRewardToHistory({
                          name: reward.type === 'text' ? (reward.rewardText || 'Dungeon Goal Reward') : 
                                reward.type === 'talentPoint' ? `+${reward.amount} Talent Points` :
                                reward.type === 'coins' ? `+${reward.amount} Gold Coins` :
                                reward.type === 'xp' ? `+${reward.amount} Experience` :
                                (reward.itemName || 'Item'),
                          rarity: 'rare',
                          source: 'Explore',
                          type: reward.type === 'text' ? 'text' : (reward.type === 'coins' ? 'coins' : (reward.type === 'xp' ? 'xp' : 'item')),
                          amount: reward.amount,
                          itemType: reward.itemType
                        });
                      });

                      setState(s => ({
                        ...s,
                        lastCompletionRewards: {
                          dungeonName: `GOAL ACHIEVED: ${major.name}`,
                          type: 'dungeon',
                          rewards: major.rewards || []
                        }
                      }));
                    }
                    return prevMajors.map(m => m.id === d.parentId ? { ...m, status: 'completed', completedAt: new Date().toISOString() } : m);
                  }
                  return prevMajors;
                });
              }

              return { ...d, completedSessions: newCompleted, status: 'completed' as const, completedAt: new Date().toISOString() };
            }
            return { ...d, completedSessions: newCompleted };
          }
          return d;
        });
        return updatedDungeons;
      });
    }

    return session;
  }, [addXP, addCoins, state.activeTalents, state.dailySessions, state.streak, state.inventory, state.rewardPool, state.devModeEnabled, state.devBaseXP, state.devCoinMode, state.devBaseCoins, state.devMinCoins, state.devMaxCoins, state.devCritChance, state.devCritMultiplier]);

  const forceCompleteSubDungeon = useCallback((dungeonId: string) => {
    setDungeons(prevDungeons => {
      const dungeonIndex = prevDungeons.findIndex(d => d.id === dungeonId);
      if (dungeonIndex === -1) return prevDungeons;
      const d = prevDungeons[dungeonIndex];
      if (d.status === 'completed') return prevDungeons;

      const updatedDungeons = [...prevDungeons];
      
      const allRewards: DungeonReward[] = [];
      if (d.rewardXP > 0) allRewards.push({ type: 'xp', amount: d.rewardXP });
      if (d.rewardCoins > 0) allRewards.push({ type: 'coins', amount: d.rewardCoins });
      if (d.rewards) allRewards.push(...d.rewards);

      allRewards.forEach(reward => {
        if (reward.type === 'coins') addCoins(reward.amount);
        else if (reward.type === 'talentPoint') setState(s => ({ ...s, talentPoints: s.talentPoints + reward.amount }));
        else if (reward.type === 'xp') addXP(reward.amount);
        
        addRewardToHistory({
          name: reward.type === 'text' ? (reward.rewardText || 'Dungeon Reward') : 
                reward.type === 'talentPoint' ? `+${reward.amount} Talent Points` :
                reward.type === 'coins' ? `+${reward.amount} Gold Coins` :
                reward.type === 'xp' ? `+${reward.amount} Experience` :
                (reward.itemName || 'Item'),
          rarity: 'common',
          source: 'Explore',
          type: reward.type === 'text' ? 'text' : (reward.type === 'coins' ? 'coins' : (reward.type === 'xp' ? 'xp' : 'item')),
          amount: reward.amount,
          itemType: reward.itemType
        });
      });

      setState(s => ({
        ...s,
        lastCompletionRewards: {
          dungeonName: d.name,
          type: 'dungeon',
          rewards: allRewards
        }
      }));

      if (d.parentId) {
        setMajorDungeons(prevMajors => {
          const major = prevMajors.find(m => m.id === d.parentId);
          const otherSubs = updatedDungeons.filter(sd => sd.parentId === d.parentId && sd.id !== d.id);
          const allOtherCompleted = otherSubs.every(sd => sd.status === 'completed');
          
          if (allOtherCompleted && major?.isFinalized && major.status !== 'completed') {
            if (major.rewards) {
              major.rewards.forEach(reward => {
                if (reward.type === 'coins') addCoins(reward.amount);
                else if (reward.type === 'talentPoint') setState(s => ({ ...s, talentPoints: s.talentPoints + reward.amount }));
                else if (reward.type === 'xp') addXP(reward.amount);
                
                addRewardToHistory({
                  name: reward.type === 'text' ? (reward.rewardText || 'Major Reward') : 
                        reward.type === 'talentPoint' ? `+${reward.amount} Talent Points` :
                        reward.type === 'coins' ? `+${reward.amount} Gold Coins` :
                        reward.type === 'xp' ? `+${reward.amount} Experience` :
                        (reward.itemName || 'Item'),
                  rarity: 'rare',
                  source: 'Explore',
                  type: reward.type === 'text' ? 'text' : (reward.type === 'coins' ? 'coins' : (reward.type === 'xp' ? 'xp' : 'item')),
                  amount: reward.amount,
                  itemType: reward.itemType
                });
              });

              setState(s => ({
                ...s,
                lastCompletionRewards: {
                  dungeonName: `MAJOR CLEAR: ${major.name}`,
                  type: 'dungeon',
                  rewards: major.rewards || []
                }
              }));
            }
            return prevMajors.map(m => m.id === d.parentId ? { ...m, status: 'completed', completedAt: new Date().toISOString() } : m);
          }
          return prevMajors;
        });
      }

      updatedDungeons[dungeonIndex] = { ...d, status: 'completed', completedAt: new Date().toISOString() };
      return updatedDungeons;
    });
  }, [addXP, addCoins, addRewardToHistory]);

  const drawGacha = useCallback((poolId: string, amount: number = 1) => {
    let pullResults: { item: string; rarity: string; poolType: 'gacha' | 'ichiban' }[] = [];
    let success = false;

    setState(prev => {
      const pool = prev.gachaPools.find(p => p.id === poolId);
      if (!pool || prev.coins < pool.cost * amount) return prev;
      const poolType = pool.type;

      let newCoins = prev.coins;
      let newPools = [...prev.gachaPools];
      let currentPool = { ...pool, items: pool.items.map(i => ({ ...i })) };
      const results: { item: string; rarity: string; poolType: 'gacha' | 'ichiban' }[] = [];
      
      for (let pull = 0; pull < amount; pull++) {
        if (currentPool.type === 'gacha') {
          const weights = currentPool.weights || { SSR: 5, SR: 15, R: 80 };
          const totalWeight = weights.SSR + weights.SR + weights.R;
          const rand = Math.random() * totalWeight;

          let rarity: 'SSR' | 'SR' | 'R';
          if (rand < weights.SSR) rarity = 'SSR';
          else if (rand < weights.SSR + weights.SR) rarity = 'SR';
          else rarity = 'R';

          const itemEntry = currentPool.items.find(i => i.rarity === rarity);
          if (!itemEntry) continue;

          const itemList = itemEntry.name.split('/').map(s => s.trim()).filter(s => s.length > 0);
          if (itemList.length === 0) continue;

          const selectedItem = itemList[Math.floor(Math.random() * itemList.length)];
          newCoins -= currentPool.cost;
          results.push({ item: selectedItem, rarity, poolType: pool.type });
          
        } else if (currentPool.type === 'ichiban') {
          const availableItems = currentPool.items.filter(i => (i.count || 0) > 0 && i.rarity !== 'LastOne');
          const totalAvailable = availableItems.reduce((acc, i) => acc + (i.count || 0), 0);
          
          if (totalAvailable === 0) break; // Pool empty

          const rand = Math.floor(Math.random() * totalAvailable);
          let current = 0;
          let selectedEntry = availableItems[0];

          for (const item of availableItems) {
            current += (item.count || 0);
            if (rand < current) {
              selectedEntry = item;
              break;
            }
          }

          newCoins -= currentPool.cost;
          
          // Update counts
          currentPool.items = currentPool.items.map(i => {
            if (i.rarity === selectedEntry.rarity && i.name === selectedEntry.name) {
              return { ...i, count: (i.count || 0) - 1 };
            }
            return i;
          });

          const subItems = selectedEntry.name.split('/').map(s => s.trim()).filter(s => s.length > 0);
          const finalItemName = subItems.length > 0 ? subItems[Math.floor(Math.random() * subItems.length)] : selectedEntry.name;

          results.push({ item: finalItemName, rarity: selectedEntry.rarity, poolType: pool.type });

          // Check if LastOne should be awarded
          const remaining = currentPool.items.filter(i => i.rarity !== 'LastOne').reduce((acc, i) => acc + (i.count || 0), 0);
          if (remaining === 0) {
            const lastOne = currentPool.items.find(i => i.rarity === 'LastOne');
            if (lastOne && (lastOne.count || 0) > 0) {
              const lastOneSubItems = lastOne.name.split('/').map(s => s.trim()).filter(s => s.length > 0);
              
              if (lastOneSubItems.length > 1) {
                // Award all sub-items
                lastOneSubItems.forEach(subItem => {
                  results.push({ item: subItem, rarity: 'LastOne', poolType: pool.type });
                });
              } else {
                results.push({ item: lastOne.name, rarity: 'LastOne', poolType: pool.type });
              }

              // Mark LastOne as taken
              currentPool.items = currentPool.items.map(i => 
                i.rarity === 'LastOne' ? { ...i, count: 0 } : i
              );
            }
          }
        }
      }

      newPools = newPools.map(p => p.id === poolId ? currentPool : p);
      pullResults = results;
      success = true;

      return {
        ...prev,
        coins: newCoins,
        gachaPools: newPools
      };
    });

    // We need to return the results. Since setState callback is usually synchronous in event handlers, 
    // pullResults should be populated. If not, we might need a different approach, but for now 
    // let's ensure we process history if success is true.
    
    if (pullResults.length > 0) {
      pullResults.forEach(res => {
        addRewardToHistory({
          name: res.item,
          rarity: res.rarity as any,
          source: 'Gacha',
          type: 'text',
        });
      });
    }

    return pullResults;
  }, [addRewardToHistory]);

  const resetIchibanPool = useCallback((poolId: string) => {
    setState(prev => ({
      ...prev,
      gachaPools: prev.gachaPools.map(p => {
        if (p.id === poolId && p.type === 'ichiban') {
          return {
            ...p,
            items: p.items.map(i => ({ 
              ...i, 
              count: i.initialCount !== undefined ? i.initialCount : i.count 
            }))
          };
        }
        return p;
      })
    }));
  }, []);

  const unlockTalent = useCallback((talentId: string) => {
    const talent = TALENTS.find(t => t.id === talentId);
    if (!talent) return;

    setState(prev => {
      if (prev.talentPoints >= talent.cost && !prev.unlockedTalents.includes(talentId)) {
        return {
          ...prev,
          talentPoints: prev.talentPoints - talent.cost,
          unlockedTalents: [...prev.unlockedTalents, talentId]
        };
      }
      return prev;
    });
  }, []);

  const toggleTalent = useCallback((talentId: string) => {
    setState(prev => {
      if (!prev.unlockedTalents.includes(talentId)) return prev;
      
      const isActive = prev.activeTalents.includes(talentId);
      if (isActive) {
        return { ...prev, activeTalents: prev.activeTalents.filter(id => id !== talentId) };
      } else {
        // Check conflicts (if any)
        return { ...prev, activeTalents: [...prev.activeTalents, talentId] };
      }
    });
  }, []);

  const toggleRewardRedeemed = useCallback((rewardId: string) => {
    setState(prev => ({
      ...prev,
      rewardHistory: prev.rewardHistory.map(item => 
        item.id === rewardId ? { ...item, redeemed: !item.redeemed } : item
      )
    }));
  }, []);

  const reorderMajorDungeon = useCallback((id: string, direction: 'up' | 'down') => {
    setMajorDungeons(prev => {
      const idx = prev.findIndex(m => m.id === id);
      if (idx < 0) return prev;
      if (direction === 'up' && idx > 0) {
        const newArr = [...prev];
        [newArr[idx - 1], newArr[idx]] = [newArr[idx], newArr[idx - 1]];
        return newArr;
      }
      if (direction === 'down' && idx < prev.length - 1) {
        const newArr = [...prev];
        [newArr[idx], newArr[idx + 1]] = [newArr[idx + 1], newArr[idx]];
        return newArr;
      }
      return prev;
    });
  }, []);

  const reorderSubDungeon = useCallback((id: string, direction: 'up' | 'down') => {
    setDungeons(prev => {
      const idx = prev.findIndex(d => d.id === id);
      if (idx < 0) return prev;
      const parentId = prev[idx].parentId;
      
      // Get all siblings
      const siblings = prev.filter(d => d.parentId === parentId);
      const siblingIdx = siblings.findIndex(d => d.id === id);
      
      if (direction === 'up' && siblingIdx > 0) {
        const targetId = siblings[siblingIdx - 1].id;
        const targetGlobalIdx = prev.findIndex(d => d.id === targetId);
        const newArr = [...prev];
        [newArr[targetGlobalIdx], newArr[idx]] = [newArr[idx], newArr[targetGlobalIdx]];
        return newArr;
      }
      if (direction === 'down' && siblingIdx < siblings.length - 1) {
        const targetId = siblings[siblingIdx + 1].id;
        const targetGlobalIdx = prev.findIndex(d => d.id === targetId);
        const newArr = [...prev];
        [newArr[idx], newArr[targetGlobalIdx]] = [newArr[targetGlobalIdx], newArr[idx]];
        return newArr;
      }
      return prev;
    });
  }, []);

  const updateQuests = useCallback((quests: Quest[]) => {
    setState(prev => ({ ...prev, quests }));
  }, []);

  const updateSession = useCallback((sessionId: string, updates: Partial<StudySession>) => {
    setState(prev => {
      const session = prev.history.find(s => s.id === sessionId);
      if (!session) return prev;

      const newHistory = prev.history.map(s => s.id === sessionId ? { ...s, ...updates } : s);
      
      // If dungeonId changed, we need to update dungeons completedSessions
      if (updates.dungeonId && updates.dungeonId !== session.dungeonId) {
         setDungeons(prevDungeons => {
            return prevDungeons.map(d => {
               if (d.id === session.dungeonId) {
                  return { ...d, completedSessions: Math.max(0, d.completedSessions - 1), status: 'active' };
               }
               if (d.id === updates.dungeonId) {
                  const newCount = d.completedSessions + 1;
                  const isCompleted = newCount >= d.totalSessions;
                  return { ...d, completedSessions: newCount, status: isCompleted ? 'completed' : 'active', completedAt: isCompleted ? new Date().toISOString() : undefined };
               }
               return d;
            });
         });
      }

      return { ...prev, history: newHistory };
    });
  }, [setDungeons]);

  const deleteSession = useCallback((sessionId: string) => {
    setState(prev => {
      const session = prev.history.find(s => s.id === sessionId);
      if (!session) return prev;

      const newHistory = prev.history.filter(s => s.id !== sessionId);

      if (session.dungeonId !== 'free_study') {
         setDungeons(prevDungeons => {
            return prevDungeons.map(d => {
               if (d.id === session.dungeonId) {
                  return { ...d, completedSessions: Math.max(0, d.completedSessions - 1), status: 'active' };
               }
               return d;
            });
         });
      }

      return { ...prev, history: newHistory };
    });
  }, [setDungeons]);

  const claimQuestReward = useCallback((questId: string) => {
    setState(prev => {
      const quest = prev.quests.find(q => q.id === questId);
      if (!quest || !quest.completed || quest.claimed) return prev;

      const rewards = quest.rewards || [quest.reward];
      
      let newState = { 
        ...prev, 
        quests: prev.quests.map(q => q.id === questId ? { ...q, claimed: true } : q),
        unclaimedQuests: Math.max(0, (prev.unclaimedQuests || 0) - 1)
      };

      rewards.forEach(reward => {
        // Add to history
        const newItem: RewardHistoryItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: reward.type === 'text' ? (reward.rewardText || 'Quest Reward') : 
                reward.type === 'talentPoint' ? `+${reward.amount} Talent Points` :
                reward.type === 'coins' ? `+${reward.amount} Gold Coins` :
                reward.type === 'xp' ? `+${reward.amount} Experience` :
                (reward.itemName || 'Item'),
          rarity: quest.isAchievement ? 'epic' : 'rare',
          source: 'Explore',
          timestamp: new Date().toISOString(),
          type: reward.type === 'text' ? 'text' : (reward.type === 'coins' ? 'coins' : (reward.type === 'xp' ? 'xp' : 'item')),
          amount: reward.amount,
          redeemed: reward.type !== 'item' && reward.type !== 'text'
        };

        newState.rewardHistory = [newItem, ...newState.rewardHistory];

        // Apply rewards immediately if not item/text
        if (reward.type === 'coins') {
          newState.coins += reward.amount;
        } else if (reward.type === 'xp') {
          newState = processXP(newState, reward.amount);
        } else if (reward.type === 'talentPoint') {
          newState.talentPoints += reward.amount;
        } else if (reward.type === 'item') {
          if (reward.itemName === 'Talent Shard') {
            newState = processShards(newState, reward.amount);
            newItem.redeemed = true;
          } else if (reward.itemName === 'Death Defying Gold Medal') {
            newState.deathDefyingMedals += reward.amount;
            newItem.redeemed = true;
          }
        }
      });

      return newState;
    });
  }, []);

  const saveDailyLog = useCallback((date: string, rating: number, reflection: string) => {
    setState(prev => ({
      ...prev,
      dailyLogs: {
        ...(prev.dailyLogs || {}),
        [date]: { rating, reflection }
      }
    }));
  }, []);

  const resetLootPool = useCallback(() => {
    setState(prev => ({
      ...prev,
      rewardPool: INITIAL_REWARD_POOL
    }));
  }, []);

  const purchaseShopItem = useCallback((itemId: string) => {
    setState(prev => {
      const item = prev.shopItems.find(i => i.id === itemId);
      if (!item || prev.coins < item.price) return prev;
      if (item.stock !== undefined && item.stock === 0) return prev;

      const newShopItems = prev.shopItems.map(i => {
        if (i.id === itemId && i.stock !== undefined && i.stock > 0) {
          return { ...i, stock: i.stock - 1 };
        }
        return i;
      });

      addRewardToHistory({
        name: item.name,
        rarity: 'rare',
        source: 'Shop',
        type: 'item',
      });

      return {
        ...prev,
        coins: prev.coins - item.price,
        shopItems: newShopItems
      };
    });
  }, [addRewardToHistory]);

  const selectReward = useCallback((reward: RewardCard, sessionId: string) => {
    addRewardToHistory({
      name: reward.name,
      rarity: reward.rarity,
      source: 'Explore',
      type: reward.type,
      amount: reward.amount,
      itemType: reward.itemType
    }, sessionId);

    setState(prev => ({
      ...prev,
      rewardPool: (prev.rewardPool || []).map(card => 
        card.id === reward.id 
          ? { ...card, claimHistory: [...(card.claimHistory || []), new Date().toISOString()] }
          : card
      )
    }));
  }, [addRewardToHistory]);

  return {
    state,
    dungeons,
    setDungeons,
    majorDungeons,
    setMajorDungeons,
    addXP,
    addCoins,
    addRewardToHistory,
    toggleRewardRedeemed,
    resetLootPool,
    completeSession,
    selectReward,
    forceCompleteSubDungeon,
    purchaseShopItem,
    drawGacha,
    resetIchibanPool,
    unlockTalent,
    toggleTalent,
    setState,
    reorderMajorDungeon,
    reorderSubDungeon,
    finalizeMajorDungeon,
    updateQuests,
    updateSession,
    deleteSession,
    claimQuestReward,
    saveDailyLog
  };
}
