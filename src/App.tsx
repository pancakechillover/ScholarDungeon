import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sword, 
  Scroll, 
  ShoppingBag, 
  BarChart3, 
  Timer as TimerIcon, 
  ChevronRight, 
  RotateCcw,
  LayoutDashboard,
  Settings as SettingsIcon,
  User,
  LogOut,
  Coins,
  Zap,
  Target,
  X,
  Dna,
  Layers,
  Sparkles,
  Flame,
  Trophy,
  Gift,
  Package,
  Gem,
  Star,
  HelpCircle,
  CheckCircle2,
  FolderPlus,
  Plus,
  Calendar,
  Maximize,
  Minimize,
  RefreshCw,
  Edit2,
  Archive,
  PictureInPicture
} from 'lucide-react';
import { Timer } from './components/Timer';
import { TimerSettings } from './components/TimerSettings';
import { DungeonManager } from './components/DungeonManager';
import { QuestManager } from './components/QuestManager';
import { TalentTree } from './components/TalentTree';
import { Shop } from './components/Shop';
import { Stats } from './components/Stats';
import { Settings } from './components/Settings';
import { RewardHistory } from './components/RewardHistory';
import { RecentSessions } from './components/RecentSessions';
import { DailySummaryModal } from './components/DailySummaryModal';
import { CoinRain } from './components/CoinRain';
import { GachaResultModal } from './components/GachaResultModal';
import { PageHeader } from './components/PageHeader';
import { useGameState } from './hooks/useGameState';
import { useCloudSync } from './hooks/useCloudSync';
import { triggerSimpleConfetti } from './lib/effects';
import { TALENTS } from './constants';
import { TalentIcon } from './components/TalentIcon';
import { cn, getXPForLevel } from './lib/utils';
import { playSound } from './lib/sound';
import { StudySession, Dungeon, RewardCard, MajorDungeon, DungeonReward } from './types';
import { CloudSyncModal } from './components/CloudSyncModal';
import { SplashScreen } from './components/SplashScreen';

import { CompactTimer } from './components/CompactTimer';

const isTalentLevel = (lvl: number) => {
  if (lvl <= 4) return true;
  if (lvl <= 16) return (lvl - 4) % 2 === 0;
  if (lvl <= 43) return (lvl - 16) % 3 === 0;
  return (lvl - 43) % 5 === 0;
};

const getNextTalentLevel = (currentLvl: number, levelRewards?: any[]) => {
  let nextLvl = currentLvl + 1;
  while (true) {
    const customReward = levelRewards?.find(r => r.level === nextLvl);
    if (customReward && customReward.type === 'talentPoint') return nextLvl;
    if (!customReward && isTalentLevel(nextLvl)) return nextLvl;
    nextLvl++;
    if (nextLvl > 1000) return nextLvl;
  }
};

function App() {
  const [appReady, setAppReady] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'explore' | 'dungeons' | 'talents' | 'shop' | 'stats' | 'settings' | 'vault'>('explore');
  const [pipWindow, setPipWindow] = useState<Window | null>(null);

  const canPip = 'documentPictureInPicture' in window;
  const isPWA = window.matchMedia('(display-mode: standalone)').matches;
  const isDesktop = !('ontouchstart' in window);

  // Timer States
  const [focusDuration, setFocusDuration] = useState(() => parseInt(localStorage.getItem('timer_focusDuration') || '25', 10));
  const [restDuration, setRestDuration] = useState(() => parseInt(localStorage.getItem('timer_restDuration') || '5', 10));
  const [enableRest, setEnableRest] = useState(() => localStorage.getItem('timer_enableRest') === 'true');
  const [isLooping, setIsLooping] = useState(() => localStorage.getItem('timer_isLooping') === 'true');
  const [isResting, setIsResting] = useState(() => localStorage.getItem('timer_isResting') === 'true');
  const [duration, setDuration] = useState(() => {
    const saved = localStorage.getItem('timer_duration');
    return saved ? parseInt(saved, 10) : 25;
  });
  const [isTimerActive, setIsTimerActive] = useState(() => localStorage.getItem('timer_isActive') === 'true');
  const [timerEndTime, setTimerEndTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('timer_endTime');
    return saved ? parseInt(saved, 10) : null;
  });
  const [timerTimeLeft, setTimerTimeLeft] = useState(() => {
    const saved = localStorage.getItem('timer_timeLeft');
    return saved ? parseInt(saved, 10) : 25 * 60;
  });

  const [timerPresets, setTimerPresets] = useState<{focus: number, rest: number}[]>(() => {
    const saved = localStorage.getItem('timer_presets');
    if (!saved) return [{focus: 25, rest: 5}, {focus: 50, rest: 10}];
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse timer presets:', e);
      return [{focus: 25, rest: 5}, {focus: 50, rest: 10}];
    }
  });

  // Timer Sync
  useEffect(() => {
    localStorage.setItem('timer_focusDuration', focusDuration.toString());
    localStorage.setItem('timer_restDuration', restDuration.toString());
    localStorage.setItem('timer_enableRest', enableRest.toString());
    localStorage.setItem('timer_isLooping', isLooping.toString());
    localStorage.setItem('timer_isResting', isResting.toString());
    localStorage.setItem('timer_duration', duration.toString());
    localStorage.setItem('timer_isActive', isTimerActive.toString());
    if (timerEndTime) {
      localStorage.setItem('timer_endTime', timerEndTime.toString());
    } else {
      localStorage.removeItem('timer_endTime');
    }
    localStorage.setItem('timer_timeLeft', timerTimeLeft.toString());
    localStorage.setItem('timer_presets', JSON.stringify(timerPresets));
  }, [focusDuration, restDuration, enableRest, isLooping, isResting, duration, isTimerActive, timerEndTime, timerTimeLeft, timerPresets]);

  const addTimerPreset = (focus: number, rest: number) => {
    if (!timerPresets.find(p => p.focus === focus && p.rest === rest)) {
      setTimerPresets(prev => [...prev, { focus, rest }]);
    }
  };

  const removeTimerPreset = (focus: number, rest: number) => {
    setTimerPresets(prev => prev.filter(p => !(p.focus === focus && p.rest === rest)));
  };

  const applyTimerPreset = (focus: number, rest: number) => {
    setFocusDuration(focus);
    setRestDuration(rest);
    setIsResting(false);
    setDuration(focus);
    setTimerTimeLeft(focus * 60);
    setIsTimerActive(false);
    setTimerEndTime(null);
  };

  const togglePip = async () => {
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
      return;
    }

    if ('documentPictureInPicture' in window) {
      try {
        // @ts-ignore
        const pip = await window.documentPictureInPicture.requestWindow({
          width: 320,
          height: 380,
        });

        const copyStyles = () => {
          [...document.styleSheets].forEach((styleSheet) => {
            try {
              const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join("");
              const style = document.createElement("style");
              style.textContent = cssRules;
              pip.document.head.appendChild(style);
            } catch (e) {
              const link = document.createElement("link");
              if (styleSheet.href) {
                link.rel = "stylesheet";
                link.href = styleSheet.href;
                pip.document.head.appendChild(link);
              }
            }
          });
        };

        copyStyles();
        pip.document.body.style.backgroundColor = '#020617';
        pip.document.body.style.margin = '0';
        pip.document.body.style.overflow = 'hidden';

        pip.addEventListener("pagehide", () => {
             setPipWindow(null);
        });
        setPipWindow(pip);
      } catch (err) {
        console.error('Failed to enter PiP mode:', err);
      }
    }
  };

  const handleTimerCustomChange = (focus: number, rest: number) => {
    const safeFocus = Math.max(1, focus);
    const safeRest = Math.max(1, rest);
    setFocusDuration(safeFocus);
    setRestDuration(safeRest);
    if (!isTimerActive) {
      if (isResting) {
        setDuration(safeRest);
        setTimerTimeLeft(safeRest * 60);
      } else {
        setDuration(safeFocus);
        setTimerTimeLeft(safeFocus * 60);
      }
    }
  };
  const [dungeonSubTab, setDungeonSubTab] = useState<'list' | 'quests' | 'achievements'>('list');
  const [isAddingMajor, setIsAddingMajor] = useState(false);
  const [isDungeonEditMode, setIsDungeonEditMode] = useState(false);
  const [isAddingQuest, setIsAddingQuest] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', isSidebarCollapsed.toString());
  }, [isSidebarCollapsed]);
  const [isActiveTalentsCollapsed, setIsActiveTalentsCollapsed] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [drawResult, setDrawResult] = useState<{item: string, rarity: string, poolType: 'gacha' | 'ichiban'}[] | null>(null);
  const [showCoinRain, setShowCoinRain] = useState(false);
  const [showBuildDetails, setShowBuildDetails] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState<number[] | null>(null);
  const [showXPGuide, setShowXPGuide] = useState(false);
  const [showCoinGuide, setShowCoinGuide] = useState(false);
  const [showTalentGuide, setShowTalentGuide] = useState(false);
  const [showDailySummary, setShowDailySummary] = useState(false);
  const [showCloudSync, setShowCloudSync] = useState(false);
  const [isFullscreenExplore, setIsFullscreenExplore] = useState(false);
  const [isArchiveView, setIsArchiveView] = useState(false);
  
  const { 
    state, 
    dungeons, 
    setDungeons, 
    majorDungeons,
    setMajorDungeons,
    addXP,
    addCoins,
    addRewardToHistory,
    toggleRewardRedeemed,
    completeSession, 
    drawGacha,
    resetIchibanPool,
    unlockTalent, 
    toggleTalent,
    setState,
    reorderMajorDungeon,
    reorderSubDungeon,
    finalizeMajorDungeon: finalizeMajorDungeonBase,
    updateQuests,
    updateSession,
    deleteSession,
    claimQuestReward,
    saveDailyLog,
    purchaseShopItem,
    forceCompleteSubDungeon,
    selectReward,
    resetLootPool
  } = useGameState();

  const {
    isSyncing,
    syncError,
    syncCheckResult,
    syncToCloud,
    resolveConflict,
    fetchFromCloud,
    unbindFromCloud,
    deleteCloudData,
    setSyncCheckResult,
    logSyncEvent
  } = useCloudSync(state, setState, setDungeons, setMajorDungeons);

  const [hasUnsyncedChanges, setHasUnsyncedChanges] = useState(() => {
    return localStorage.getItem('scholars_dungeon_unsynced') === 'true';
  });

  React.useEffect(() => {
    localStorage.setItem('scholars_dungeon_unsynced', hasUnsyncedChanges.toString());
  }, [hasUnsyncedChanges]);

  const isInitialMount = React.useRef(true);
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setHasUnsyncedChanges(true);
  }, [state, dungeons, majorDungeons]);

  const isInitialMountSync = React.useRef(true);
  React.useEffect(() => {
    if (isInitialMountSync.current) {
      isInitialMountSync.current = false;
      return;
    }
    setHasUnsyncedChanges(false);
  }, [state.lastUpdated]);

  React.useEffect(() => {
    if (state.theme) {
      document.documentElement.setAttribute('data-theme', state.theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [state.theme]);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreenExplore(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const [prevLevel, setPrevLevel] = useState(state.level);
  const [isSyncingPush, setIsSyncingPush] = useState(false);
  const wasSyncingRef = React.useRef(false);

  // Track if we were recently syncing to handle React 18 state batching
  useEffect(() => {
    if (isSyncing) {
      wasSyncingRef.current = true;
    } else {
      const timer = setTimeout(() => {
        wasSyncingRef.current = false;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSyncing]);

  // Sync prevLevel with state.level during synchronization to prevent level-up popups
  useEffect(() => {
    if (isSyncing) {
      setPrevLevel(state.level);
    }
  }, [isSyncing, state.level]);

  // Sync Push Subscription to server whenever secretCode or pushEnabled changes
  useEffect(() => {
    const syncPushSubscription = async () => {
      if (state.pushEnabled && state.secretCode && !isSyncingPush) {
        setIsSyncingPush(true);
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
              console.log('Push sync: Syncing subscription for', state.secretCode);
              const res = await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  secretCode: state.secretCode,
                  subscription
                })
              });
              if (res.ok) {
                console.log('Push sync: Success');
              } else {
                console.error('Push sync: Failed with status', res.status);
              }
            } else {
              console.warn('Push sync: No subscription found in browser even though pushEnabled is true. Auto-correcting state.');
              setState(prev => ({ ...prev, pushEnabled: false, pushSubscription: null }));
            }
          }
        } catch (error) {
          console.error('Push sync: Error', error);
        } finally {
          setIsSyncingPush(false);
        }
      }
    };

    if (appReady) {
      syncPushSubscription();
    }
  }, [state.pushEnabled, state.secretCode, appReady]);

  const handlePurchase = useCallback((itemId: string) => {
    console.log('Purchasing item:', itemId);
    purchaseShopItem(itemId);
    triggerSimpleConfetti();
    playSound('reward', state.soundVolume, state.soundEnabled);
  }, [purchaseShopItem, state.soundVolume, state.soundEnabled]);

  React.useEffect(() => {
    if (state.level > prevLevel) {
      // If we are syncing or just finished syncing, just update the baseline without showing UI
      if (isSyncing || wasSyncingRef.current) {
        setPrevLevel(state.level);
        return;
      }
      const levelsGained = [];
      for (let l = prevLevel + 1; l <= state.level; l++) {
        levelsGained.push(l);
      }
      setShowLevelUp(levelsGained);
      triggerSimpleConfetti();
      playSound('levelUp', state.soundVolume, state.soundEnabled);
      setPrevLevel(state.level);
    }
  }, [state.level, prevLevel, state.soundVolume, state.soundEnabled, isSyncing]);

  const handleDraw = (poolId: string, amount: number) => {
    setDrawResult(null);
    setTimeout(() => {
      const results = drawGacha(poolId, amount);
      if (results && results.length > 0) {
        setDrawResult(results);
        triggerSimpleConfetti();
        playSound('gacha', state.soundVolume, state.soundEnabled);
      }
    }, 50);
  };

  const handleSaveProfile = () => {
    setState(prev => ({
      ...prev,
      userName: editName,
      userBio: editBio
    }));
    setIsEditingProfile(false);
  };

  const currentLevelUp = showLevelUp?.[0];

  const openProfile = () => {
    setEditName(state.userName || 'Scholar');
    setEditBio(state.userBio || 'Master of the Study Dungeon');
    setShowProfile(true);
    setIsEditingProfile(false);
  };

  const currentDungeon = useMemo(() => 
    dungeons.find(d => d.id === state.currentDungeonId),
    [dungeons, state.currentDungeonId]
  );

  const nextSessionStats = useMemo(() => {
    let xp = state.devModeEnabled ? (state.devBaseXP ?? 100) : 100;
    let minCoins = 0;
    let maxCoins = 0;

    if (state.devModeEnabled) {
      if (state.devCoinMode === 'fixed') {
        minCoins = maxCoins = state.devBaseCoins ?? 10;
      } else {
        minCoins = state.devMinCoins ?? 5;
        maxCoins = state.devMaxCoins ?? 15;
      }
    } else {
      minCoins = 5;
      maxCoins = 15;
    }

    const breakdown: { source: string; xpEffect?: string; coinEffect?: string }[] = [];
    breakdown.push({ 
      source: 'Base Reward', 
      xpEffect: `+${xp}`, 
      coinEffect: minCoins === maxCoins ? `+${minCoins}` : `+${minCoins}-${maxCoins}` 
    });

    if (state.activeTalents.includes('a1')) {
      xp *= 1.1;
      breakdown.push({ source: 'Talent: Mind Lubrication', xpEffect: '+10%' });
    }
    if (state.activeTalents.includes('b1')) {
      minCoins += 2;
      maxCoins += 2;
      breakdown.push({ source: 'Talent: Alchemy', coinEffect: '+2' });
    }
    if (state.activeTalents.includes('c3')) {
      const critChance = state.devModeEnabled ? (state.devCritChance ?? 0.05) : 0.05;
      const critMult = state.devModeEnabled ? (state.devCritMultiplier ?? 5) : 5;
      breakdown.push({ source: 'Talent: Critical Intuition', coinEffect: `${critChance * 100}% chance for x${critMult}` });
    }
    
    // Daily 16
    if (state.dailySessions === 15) {
      if (state.activeTalents.includes('a2')) {
        xp += 200;
        breakdown.push({ source: 'Talent: Deep Focus (16th Session)', xpEffect: '+200' });
      }
      if (state.activeTalents.includes('b2')) {
        minCoins += 50;
        maxCoins += 50;
        breakdown.push({ source: 'Talent: Treasure Hunter (16th Session)', coinEffect: '+50' });
      }
    }

    // Streak
    if (state.streak >= 2 && state.streak <= 10 && state.dailySessions === 7) {
      if (state.activeTalents.includes('a3')) {
        xp += 20 * state.streak;
        breakdown.push({ source: `Talent: Consistency (Streak ${state.streak})`, xpEffect: `+${20 * state.streak}` });
      }
      if (state.activeTalents.includes('b3')) {
        minCoins += 10 * state.streak;
        maxCoins += 10 * state.streak;
        breakdown.push({ source: `Talent: Momentum (Streak ${state.streak})`, coinEffect: `+${10 * state.streak}` });
      }
      if (state.streak === 10) {
        if (state.activeTalents.includes('a3')) {
          xp += 1000;
          breakdown.push({ source: 'Talent: Consistency (10 Day Bonus)', xpEffect: '+1000' });
        }
        if (state.activeTalents.includes('b3')) {
          minCoins += 100;
          maxCoins += 100;
          breakdown.push({ source: 'Talent: Momentum (10 Day Bonus)', coinEffect: '+100' });
        }
      }
    }

    // Inventory
    (state.inventory || []).forEach(cardId => {
      const card = (state.rewardPool || []).find(c => c.id === cardId);
      if (card && card.type === 'item') {
        if (card.itemType === 'xp_bonus_percent') {
          xp *= (1 + (card.amount || 0) / 100);
          breakdown.push({ source: `Card: ${card.name}`, xpEffect: `+${card.amount}%` });
        }
        if (card.itemType === 'coin_bonus_percent') {
          minCoins *= (1 + (card.amount || 0) / 100);
          maxCoins *= (1 + (card.amount || 0) / 100);
          breakdown.push({ source: `Card: ${card.name}`, coinEffect: `+${card.amount}%` });
        }
        if (card.itemType === 'double_xp') {
          xp *= 2;
          breakdown.push({ source: `Card: ${card.name}`, xpEffect: 'x2' });
        }
        if (card.itemType === 'double_coin') {
          minCoins *= 2;
          maxCoins *= 2;
          breakdown.push({ source: `Card: ${card.name}`, coinEffect: 'x2' });
        }
      }
    });

    return { xp: Math.floor(xp), minCoins: Math.floor(minCoins), maxCoins: Math.floor(maxCoins), breakdown };
  }, [state.devModeEnabled, state.devBaseXP, state.devCoinMode, state.devBaseCoins, state.devMinCoins, state.devMaxCoins, state.activeTalents, state.dailySessions, state.streak, state.inventory, state.rewardPool]);

  const finalizeMajorDungeon = (id: string) => {
    finalizeMajorDungeonBase(id);
    setHasUnsyncedChanges(true);
  };

  const archiveMajorDungeon = useCallback((id: string) => {
    setMajorDungeons(prev => prev.map(m => m.id === id ? { ...m, status: 'archived' } : m));
    // Clear active dungeon if it belongs to the archived major dungeon
    if (state.currentDungeonId) {
      const activeDungeon = dungeons.find(d => d.id === state.currentDungeonId);
      if (activeDungeon && activeDungeon.parentId === id) {
        setState(prev => ({ ...prev, currentDungeonId: null }));
      }
    }
  }, [setMajorDungeons, state.currentDungeonId, dungeons, setState]);

  const handleCreateMajor = (name: string, description: string, rewards?: DungeonReward[]) => {
    const newMajor: MajorDungeon = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      status: 'active' as const,
      rewards
    };
    setMajorDungeons([...majorDungeons, newMajor]);
  };

  const handleUpdateMajor = (id: string, updates: Partial<MajorDungeon>) => {
    setMajorDungeons(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const handleUpdateSub = (id: string, updates: Partial<Dungeon>) => {
    setDungeons(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const handleCreateSub = (dungeon: Omit<Dungeon, 'id' | 'completedSessions' | 'status'>) => {
    const newSub: Dungeon = {
      ...dungeon,
      id: Math.random().toString(36).substr(2, 9),
      completedSessions: 0,
      status: 'active'
    };
    setDungeons([...dungeons, newSub]);
  };

  const handleDeleteMajor = (id: string) => {
    const dungeonsToDelete = new Set<string>();
    const rootSubs = dungeons.filter(d => d.parentId === id);
    
    const collectAllDescendants = (parentId: string) => {
      dungeonsToDelete.add(parentId);
      dungeons.filter(d => d.parentId === parentId).forEach(child => {
        collectAllDescendants(child.id);
      });
    };

    rootSubs.forEach(sub => collectAllDescendants(sub.id));
    
    setMajorDungeons(majorDungeons.filter(m => m.id !== id));
    setDungeons(dungeons.filter(d => d.parentId !== id && !dungeonsToDelete.has(d.id)));
  };

  const handleDeleteSub = (id: string) => {
    const dungeonsToDelete = new Set<string>();
    
    const collectAllDescendants = (parentId: string) => {
      dungeonsToDelete.add(parentId);
      dungeons.filter(d => d.parentId === parentId).forEach(child => {
        collectAllDescendants(child.id);
      });
    };

    collectAllDescendants(id);

    setDungeons(dungeons.filter(d => !dungeonsToDelete.has(d.id)));
    if (state.currentDungeonId && dungeonsToDelete.has(state.currentDungeonId)) {
      setState(prev => ({ ...prev, currentDungeonId: null }));
    }
  };

  const progressToNextLevel = (state.xp / getXPForLevel(state.level)) * 100;

  const unclaimedQuestsCount = state.quests.filter(q => !q.isAchievement && q.completed && !q.claimed).length;
  const unclaimedAchievementsCount = state.quests.filter(q => q.isAchievement && q.completed && !q.claimed).length;

  const navItems = [
    { id: 'dashboard', label: 'Sanctum', icon: LayoutDashboard },
    { id: 'dungeons', label: 'Dungeons', icon: Sword },
    { id: 'explore', label: 'Explore', icon: TimerIcon },
    { id: 'talents', label: 'Talents', icon: Zap },
    { id: 'shop', label: 'Merchant', icon: ShoppingBag },
    { id: 'vault', label: 'Vault', icon: Package },
    { id: 'stats', label: 'Record', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  useEffect(() => {
    if (appReady && state.secretCode) {
      // Auto check sync on load if logged in
      fetchFromCloud(state.secretCode);
    }
  }, [appReady]); // Only run once when app becomes ready

  const handleSplashComplete = useCallback(() => setAppReady(true), []);

  return (
    <>
      <AnimatePresence>
        {!appReady && <SplashScreen key="splash" onComplete={handleSplashComplete} />}
      </AnimatePresence>

      {pipWindow && createPortal(
        <CompactTimer 
          timeLeft={timerTimeLeft}
          isActive={isTimerActive}
          isResting={isResting}
          currentDungeon={currentDungeon || null}
          duration={duration}
        />,
        pipWindow.document.body
      )}

      {syncCheckResult && (
        <CloudSyncModal 
          isOpen={true}
          onClose={() => setSyncCheckResult(null)}
          secretCode={state.secretCode}
          isSyncing={isSyncing}
          syncError={syncError}
          syncCheckResult={syncCheckResult}
          onConnect={fetchFromCloud}
          onResolveConflict={resolveConflict}
          onCancelConnect={() => setSyncCheckResult(null)}
          onManualSync={() => syncToCloud(true)}
          onUnbind={unbindFromCloud}
          onDeleteCloudData={deleteCloudData}
          syncHistory={state.syncHistory}
          localState={state}
        />
      )}

      <div className="min-h-[100dvh] bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Sidebar Navigation - Hidden on mobile, visible on tablet/desktop */}
      {!isFullscreenExplore && (
        <nav className={cn(
          "hidden md:flex fixed left-0 top-0 h-[100dvh] bg-slate-900 border-r border-slate-800 z-[70] flex-col transition-all duration-300",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}>
        <div className={cn(
          "p-4 md:px-5 md:py-5 flex items-center",
          isSidebarCollapsed ? "justify-center" : "justify-between"
        )}>
          <div className="flex items-center space-x-3">
            {!isSidebarCollapsed && (
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                <Sword className="text-[#ffffff]" size={20} />
              </div>
            )}
            {!isSidebarCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-bold text-lg tracking-tight text-white whitespace-nowrap"
              >
                Scholar's Dungeon
              </motion.span>
            )}
          </div>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronRight size={18} className="rotate-180" />}
          </button>
        </div>

        <div className="flex-grow px-3 py-6 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map(item => (
            <NavItem 
              key={item.id}
              active={activeTab === item.id} 
              onClick={() => setActiveTab(item.id as any)} 
              icon={<item.icon size={22} />} 
              label={item.label} 
              collapsed={isSidebarCollapsed}
              showDot={item.id === 'dungeons' && state.unclaimedQuests > 0 && state.questNotificationStyle === 'red_dot'}
            />
          ))}
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={openProfile}
            className={cn(
              "w-full flex items-center p-3 rounded-xl hover:bg-slate-800 transition-colors group",
              isSidebarCollapsed ? "justify-center" : "space-x-3"
            )}
          >
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all shrink-0">
              <User size={20} />
            </div>
            {!isSidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-left overflow-hidden"
              >
                <p className="text-sm font-bold text-white">Level {state.level}</p>
                <p className="text-xs text-slate-500">View Profile</p>
              </motion.div>
            )}
          </button>
        </div>
      </nav>
      )}

      {/* Main Content - Adjust margin based on sidebar visibility */}
      <main className={cn(
        "min-h-[100dvh] flex flex-col md:pb-0",
        isFullscreenExplore ? "m-0 p-0" : (isSidebarCollapsed ? "md:ml-20" : "md:ml-64")
      )}>
        {!isFullscreenExplore && (
          <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-3 sm:px-8 py-2.5 flex items-center justify-between gap-2">
          {/* Logo/Title - Hidden on mobile to save space */}
          <div className="hidden lg:flex items-center space-x-4">
            <h1 className="text-base font-black text-white uppercase tracking-tighter italic pr-1">{activeTab}</h1>
          </div>

          {/* Persistent Active Dungeon Widget - Simplified */}
          {currentDungeon && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-2 sm:gap-3 group cursor-pointer transition-all max-w-[140px] xs:max-w-[180px] sm:max-w-none px-2"
            >
              <div className="flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Sword size={14} className="text-indigo-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-xs font-bold text-white truncate max-w-[60px] xs:max-w-[100px] sm:max-w-[180px] leading-tight">
                    {currentDungeon.name}
                  </span>
                  <span className="text-[9px] font-black text-slate-600 tabular-nums shrink-0">
                    {currentDungeon.completedSessions}/{currentDungeon.totalSessions}
                  </span>
                </div>
                <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentDungeon.completedSessions / currentDungeon.totalSessions) * 100}%` }}
                    className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.3)]"
                  />
                </div>
              </div>
            </motion.div>
          )}
          
          <div className="flex-1 flex items-center justify-between sm:justify-end gap-2 sm:gap-4 md:gap-6">

            {/* XP Bar */}
            <div className="flex items-center gap-1.5 sm:gap-2 group relative" title="Experience">
              <span className="text-[10px] sm:text-xs font-black text-white bg-indigo-600 px-1.5 sm:px-2 py-0.5 rounded-lg italic pr-1 leading-none shrink-0 shadow-lg shadow-indigo-600/20">
                LV.{state.level}
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-8 sm:w-16 md:w-20 h-1 sm:h-2 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50 shrink-0">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.4)] transition-all duration-700 ease-in-out" 
                    style={{ width: `${(state.xp / getXPForLevel(state.level)) * 100}%` }} 
                  />
                </div>
                <div className="hidden sm:flex items-center gap-1 shrink-0">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 tabular-nums whitespace-nowrap">
                    {state.xp.toLocaleString()}
                    <span className="text-slate-600 ml-1">/ {getXPForLevel(state.level).toLocaleString()}</span>
                  </span>
                </div>
              </div>

              {/* Tooltip on Hover */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 whitespace-nowrap scale-95 group-hover:scale-100 origin-top">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-6">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Next Level</span>
                    <span className="text-[10px] font-bold text-slate-500 italic pr-1">{(state.xp / getXPForLevel(state.level) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-[1px] w-full bg-slate-800 my-1" />
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Remaining</span>
                    <span className="text-xs font-black text-white italic pr-1">{(getXPForLevel(state.level) - state.xp).toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Talent Shards */}
            <div className={cn(
              "items-center space-x-1.5",
              isSidebarCollapsed ? "hidden md:flex" : "hidden xl:flex"
            )} title="Talent Shards">
              <Star className="text-amber-400" size={16} />
              <span className="font-bold text-white text-sm">{state.talentShards}<span className="text-slate-500 text-xs">/3</span></span>
            </div>

            {/* Talent Points */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0" title="Talent Points">
              <Zap className="text-emerald-400 shrink-0" size={14} />
              <span className="font-bold text-white text-xs sm:text-sm">{state.talentPoints}</span>
            </div>

            {/* Coins */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
              <Coins className="text-amber-500 shrink-0" size={14} />
              <span className="font-bold text-white text-xs sm:text-sm">{state.coins.toLocaleString()}</span>
            </div>

            {/* Streak */}
            <div className={cn(
              "items-center space-x-1 sm:space-x-1.5 shrink-0",
              isSidebarCollapsed ? "flex" : "hidden sm:flex"
            )}>
              <Flame className="text-orange-500 shrink-0" size={14} />
              <span className="font-bold text-white text-xs sm:text-sm">{state.streak} <span className="hidden lg:inline text-[10px] text-slate-500">Day</span></span>
            </div>
            
            {/* Mobile-only Profile and Settings */}
            <div className="flex items-center space-x-2 md:hidden">
              <button 
                onClick={openProfile}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 border border-slate-700 hover:bg-slate-700 transition-all"
              >
                <User size={16} />
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border border-slate-700 transition-all",
                  activeTab === 'settings' ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                )}
              >
                <SettingsIcon size={16} />
              </button>
            </div>
          </div>
        </header>
        )}

        <div className={cn("relative max-w-[1600px] mx-auto w-full flex-grow", isFullscreenExplore ? "h-[100dvh] flex flex-col justify-center" : "pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:pb-8")}>
          <AnimatePresence mode="popLayout" initial={false}>
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full p-6 lg:p-8 space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Sword size={120} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {state.history.length === 0 ? "Welcome, Brave Seeker." : "Welcome back, Seeker."}
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-md">
                      {state.history.length === 0 
                        ? "A new legend is about to be written. Are you ready to begin your first exploration?" 
                        : "Your journey through the Scholar's Dungeon continues. Ready for the next session?"}
                    </p>
                    
                    {currentDungeon ? (
                      <div className="bg-slate-950/50 p-4 sm:p-6 rounded-2xl border border-indigo-500/20">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                          <span className="text-[10px] sm:text-xs font-bold text-indigo-400 uppercase tracking-widest">Current Quest</span>
                          <span className="text-[9px] sm:text-xs text-slate-500">{currentDungeon.completedSessions}/{currentDungeon.totalSessions} Sessions Cleared</span>
                        </div>
                        <h3 className="font-bold text-white mb-4 truncate pr-2" style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)' }}>{currentDungeon.name}</h3>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentDungeon.completedSessions / currentDungeon.totalSessions) * 100}%` }}
                            className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                          />
                        </div>
                        <button 
                          onClick={() => setActiveTab('explore')}
                          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all"
                        >
                          <span>Enter Dungeon</span>
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                        <p className="text-slate-500 mb-4">No active dungeon exploration.</p>
                        <button 
                          onClick={() => setActiveTab('dungeons')}
                          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                        >
                          {state.history.length === 0 ? "Start Your First Dungeon" : "Delve into Goal"}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Daily Progress</h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-white">{state.dailySessions}</span>
                        <span className="text-slate-500 text-xs">/ 16 Sessions</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
                        <div 
                          className="h-full bg-emerald-500" 
                          style={{ width: `${Math.min((state.dailySessions / 16) * 100, 100)}%` }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          setShowDailySummary(true);
                          playSound('success', state.soundVolume, state.soundEnabled);
                        }}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-slate-700 flex items-center justify-center gap-2"
                      >
                        <Calendar size={14} className="text-indigo-400" />
                        End the Day
                      </button>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'explore' && (
              <motion.div
                key="explore"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "w-full flex-1 min-h-0 flex flex-col",
                  isFullscreenExplore ? "h-[100dvh] items-center justify-center p-0 m-0" : "px-4 py-4 sm:px-8 sm:py-6"
                )}
              >
                {!isFullscreenExplore && (
                  <div className="shrink-0 mb-2 sm:mb-3">
                    <PageHeader 
                      title="Explore"
                      description="Venture into the unknown and sharpen your mind"
                      icon={TimerIcon}
                    />
                  </div>
                )}

                {isFullscreenExplore && (
                  <button
                    onClick={() => {
                      setIsFullscreenExplore(false);
                      if (document.fullscreenElement) {
                        document.exitFullscreen().catch(() => {});
                      }
                    }}
                    className="fixed top-6 right-6 z-50 p-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-all shadow-lg"
                  >
                    <Minimize size={24} />
                  </button>
                )}

                <div className={cn(
                  "w-full flex-1 min-h-0",
                  isFullscreenExplore ? "flex items-center justify-center w-full h-full" : "px-4 sm:px-6 lg:px-8"
                )}>
                  <div className={cn(
                    "w-full h-full",
                    !isFullscreenExplore ? "grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_440px] 2xl:grid-cols-[1fr_500px] gap-6 xl:gap-8 2xl:gap-12" : "flex flex-col items-center justify-center h-full w-full"
                  )}>
                    {/* Left Column: Timer & Timer Settings area */}
                    <div className={cn(
                      "w-full h-full flex flex-col min-h-0",
                      !isFullscreenExplore ? "gap-6" : ""
                    )}>
                      {!isFullscreenExplore && (
                        <div className="flex-1 min-h-0 relative bg-slate-900/20 rounded-[2.5rem] border border-slate-800/50 p-4 sm:p-8 flex flex-col items-center justify-center">
                          <div className="absolute top-6 right-6 z-[20] flex items-center gap-2">
                            {canPip && isPWA && isDesktop && (
                              <button 
                                onClick={togglePip}
                                className="p-2 bg-slate-800/80 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl transition-all shadow-lg border border-slate-700/50 group"
                                title="Floating Mini Timer (Always on Top)"
                              >
                                <PictureInPicture size={18} className="group-hover:scale-110 transition-transform" />
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                setIsFullscreenExplore(true);
                                if (document.documentElement.requestFullscreen) {
                                  document.documentElement.requestFullscreen().catch(() => {});
                                }
                              }}
                              className="p-2 bg-slate-800/80 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl transition-all shadow-lg border border-slate-700/50 group"
                              title="Fullscreen Mode"
                            >
                              <Maximize size={18} className="group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                          
                          <div className="w-full max-w-md aspect-square sm:aspect-auto flex items-center justify-center scale-90 sm:scale-100">
                            <Timer 
                              currentDungeon={currentDungeon || null}
                              rewardPool={state.rewardPool || []}
                              activeTalents={state.activeTalents}
                              dailyRerollUsed={state.dailyRerollUsed}
                              history={state.history}
                              critChance={state.devModeEnabled ? (state.devCritChance ?? 0.05) : 0.05}
                              critMultiplier={state.devModeEnabled ? (state.devCritMultiplier ?? 5) : 5}
                              onComplete={(duration, fDur, rDur) => {
                                const result = completeSession(state.currentDungeonId || null, duration, fDur, rDur);
                                playSound('success', state.soundVolume, state.soundEnabled);
                                if (result && state.secretCode) {
                                  syncToCloud(true);
                                }
                                return result;
                              }}
                              onRestComplete={() => {
                                playSound('success', state.soundVolume, state.soundEnabled);
                              }}
                              onInventoryAdd={(id) => setState(prev => ({ ...prev, inventory: [...prev.inventory, id] }))}
                              onReroll={() => setState(prev => ({ ...prev, dailyRerollUsed: true }))}
                              onRewardSelect={(reward, sessionId) => {
                                selectReward(reward, sessionId);
                                playSound('reward', state.soundVolume, state.soundEnabled);
                              }}
                              setShowCoinRain={setShowCoinRain}
                              isFullscreen={isFullscreenExplore}
                              secretCode={state.secretCode}
                              pushEnabled={state.pushEnabled}
                              onTogglePip={togglePip}
                              focusDuration={focusDuration}
                              restDuration={restDuration}
                              enableRest={enableRest}
                              isLooping={isLooping}
                              setIsResting={setIsResting}
                              isResting={isResting}
                              setDuration={setDuration}
                              duration={duration}
                              setTimeLeft={setTimerTimeLeft}
                              timeLeft={timerTimeLeft}
                              setIsActive={setIsTimerActive}
                              isActive={isTimerActive}
                              setEndTime={setTimerEndTime}
                              endTime={timerEndTime}
                            />
                          </div>
                        </div>
                      )}

                       {isFullscreenExplore && (
                        <div className="w-full h-[100dvh] flex flex-col items-center justify-center p-8 relative overflow-hidden bg-slate-950">
                           {/* Simplified Progress Bar for Fullscreen Mode */}
                           {currentDungeon && (
                             <motion.div 
                               initial={{ opacity: 0, y: -20 }}
                               animate={{ opacity: 1, y: 0 }}
                               className="absolute top-8 sm:top-12 left-1/2 -translate-x-1/2 w-full max-w-sm space-y-2 z-[30] px-8"
                             >
                                <div className="flex justify-between items-center px-1">
                                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{currentDungeon.name}</span>
                                  <span className="text-[10px] font-bold text-slate-500">{currentDungeon.completedSessions}/{currentDungeon.totalSessions} Sessions</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-900 rounded-full border border-slate-800 overflow-hidden">
                                   <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(currentDungeon.completedSessions / currentDungeon.totalSessions) * 100}%` }}
                                      className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                                   />
                                </div>
                             </motion.div>
                           )}

                           {/* Scaled Timer for Fullscreen Experience */}
                           <div className="scale-110 md:scale-125 lg:scale-[1.35] origin-center transform transition-transform">
                             <Timer 
                                currentDungeon={currentDungeon || null}
                                rewardPool={state.rewardPool || []}
                                activeTalents={state.activeTalents}
                                dailyRerollUsed={state.dailyRerollUsed}
                                history={state.history}
                                critChance={state.devModeEnabled ? (state.devCritChance ?? 0.05) : 0.05}
                                critMultiplier={state.devModeEnabled ? (state.devCritMultiplier ?? 5) : 5}
                                onComplete={(duration, fDur, rDur) => {
                                  const result = completeSession(state.currentDungeonId || null, duration, fDur, rDur);
                                  playSound('success', state.soundVolume, state.soundEnabled);
                                  if (result && state.secretCode) {
                                    syncToCloud(true);
                                  }
                                  return result;
                                }}
                                onRestComplete={() => {
                                  playSound('success', state.soundVolume, state.soundEnabled);
                                }}
                                onInventoryAdd={(id) => setState(prev => ({ ...prev, inventory: [...prev.inventory, id] }))}
                                onReroll={() => setState(prev => ({ ...prev, dailyRerollUsed: true }))}
                                onRewardSelect={(reward, sessionId) => {
                                  selectReward(reward, sessionId);
                                  playSound('reward', state.soundVolume, state.soundEnabled);
                                }}
                                setShowCoinRain={setShowCoinRain}
                                isFullscreen={isFullscreenExplore}
                                secretCode={state.secretCode}
                                pushEnabled={state.pushEnabled}
                                onTogglePip={togglePip}
                                focusDuration={focusDuration}
                                restDuration={restDuration}
                                enableRest={enableRest}
                                isLooping={isLooping}
                                setIsResting={setIsResting}
                                isResting={isResting}
                                setDuration={setDuration}
                                duration={duration}
                                setTimeLeft={setTimerTimeLeft}
                                timeLeft={timerTimeLeft}
                                setIsActive={setIsTimerActive}
                                isActive={isTimerActive}
                                setEndTime={setTimerEndTime}
                                endTime={timerEndTime}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                    {/* Right Column: Active Talents & Current Build */}
                    {!isFullscreenExplore && (
                      <div className="w-full h-full flex flex-col gap-6 min-h-0 overflow-y-auto lg:overflow-visible custom-scrollbar">
                        {/* Timer Settings (Moved Here for Wide Screens) */}
                        <TimerSettings 
                          focusDuration={focusDuration}
                          setFocusDuration={setFocusDuration}
                          restDuration={restDuration}
                          setRestDuration={setRestDuration}
                          enableRest={enableRest}
                          setEnableRest={setEnableRest}
                          isLooping={isLooping}
                          setIsLooping={setIsLooping}
                          isActive={isTimerActive}
                          isResting={isResting}
                          applyPreset={applyTimerPreset}
                          handleCustomChange={handleTimerCustomChange}
                          presets={timerPresets}
                          addPreset={addTimerPreset}
                          removePreset={removeTimerPreset}
                        />

                        {/* Active Talents */}
                        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6 backdrop-blur-sm shrink-0">
                          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-6">
                            <Sparkles size={14} className="text-indigo-400" />
                            Active Talents
                          </h3>
                          
                          <div className="flex flex-wrap gap-4 justify-start">
                            {state.activeTalents.length === 0 ? (
                              <p className="text-xs text-slate-600 italic">No talents active...</p>
                            ) : (
                              state.activeTalents
                                .map(id => TALENTS.find(t => t.id === id))
                                .filter((t): t is typeof TALENTS[0] => !!t)
                                .sort((a, b) => {
                                  if (a.branch !== b.branch) {
                                    return a.branch.localeCompare(b.branch);
                                  }
                                  return a.tier - b.tier;
                                })
                                .map(talent => {
                                  const branchColors: Record<string, string> = {
                                    'A': 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
                                    'B': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                                    'C': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                  };
                                  const colorClass = branchColors[talent.branch] || 'text-slate-400 bg-slate-800 border-slate-700';
                                  
                                  return (
                                    <div key={talent.id} className="group relative hover:z-[100]">
                                      <div className={cn(
                                        "w-12 h-12 flex items-center justify-center rounded-xl border transition-all hover:scale-110",
                                        colorClass
                                      )}>
                                        <TalentIcon iconName={talent.icon || 'Scroll'} size={24} />
                                      </div>

                                      {/* Tooltip */}
                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[100] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                                        <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl min-w-[200px]">
                                          <div className={cn("text-sm font-black mb-1", branchColors[talent.branch].split(' ')[0])}>
                                            {talent.name}
                                          </div>
                                          <p className="text-xs text-slate-400 leading-relaxed">
                                            {talent.description}
                                          </p>
                                          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2">
                                            <div className={cn("w-1.5 h-1.5 rounded-full", branchColors[talent.branch].split(' ')[1])} />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                              Branch {talent.branch} • Tier {talent.tier}
                                            </span>
                                          </div>
                                        </div>
                                        {/* Arrow */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-slate-700" />
                                      </div>
                                    </div>
                                  );
                                })
                            )}
                          </div>
                        </div>

                        {/* Current Build */}
                        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6 backdrop-blur-sm flex-1 min-h-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Layers size={14} className="text-indigo-400" />
                                Current Build
                              </h3>
                              <button 
                                onClick={() => setShowBuildDetails(true)}
                                className="p-1 text-slate-500 hover:text-white transition-colors rounded-full hover:bg-slate-800"
                                title="View Reward Breakdown"
                              >
                                <HelpCircle size={16} />
                              </button>
                            </div>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Next XP Gain</span>
                                <span className="text-sm font-bold text-emerald-400">+{nextSessionStats.xp}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Next Gold Gain</span>
                                <span className="text-sm font-bold text-amber-400">
                                  +{nextSessionStats.minCoins === nextSessionStats.maxCoins 
                                    ? nextSessionStats.minCoins 
                                    : `${nextSessionStats.minCoins}-${nextSessionStats.maxCoins}`}
                                </span>
                              </div>
                              <div className="h-px bg-slate-800" />
                            </div>
                          </div>
                          <div className="space-y-4 mt-6">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400">Daily Sessions</span>
                              <span className="text-sm font-bold text-white">{state.dailySessions}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-400">No-Damage Streak</span>
                              <span className="text-sm font-bold text-indigo-400">{state.streak}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {!isFullscreenExplore && (
                  <div id="recent-sessions-anchor" className="mt-8 shrink-0 w-full px-4 sm:px-6 lg:px-8">
                    <RecentSessions 
                      history={state.history}
                      dungeons={dungeons}
                      majorDungeons={majorDungeons}
                      updateSession={updateSession}
                      deleteSession={deleteSession}
                    />
                  </div>
                )}

      {createPortal(
        <AnimatePresence>
          {showBuildDetails && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 w-full max-w-md rounded-3xl border border-slate-700 overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <BarChart3 className="text-indigo-400" />
                    Reward Breakdown
                  </h3>
                  <button 
                    onClick={() => setShowBuildDetails(false)}
                    className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div className="space-y-3">
                    {nextSessionStats.breakdown.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <span className="text-sm font-medium text-slate-300">{item.source}</span>
                        <div className="flex items-center gap-3">
                          {item.xpEffect && (
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                              <Zap size={12} /> {item.xpEffect}
                            </span>
                          )}
                          {item.coinEffect && (
                            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                              <Coins size={12} /> {item.coinEffect}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-400">Total Expected XP</span>
                      <span className="text-lg font-black text-emerald-400">+{nextSessionStats.xp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-400">Total Expected Gold</span>
                      <span className="text-lg font-black text-amber-400">
                        +{nextSessionStats.minCoins === nextSessionStats.maxCoins 
                          ? nextSessionStats.minCoins 
                          : `${nextSessionStats.minCoins}-${nextSessionStats.maxCoins}`}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

                {/* Recent Explorations (At the very bottom) */}
              </motion.div>
            )}

            {activeTab === 'vault' && (
              <motion.div
                key="vault"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full p-6 lg:p-8"
              >
                <RewardHistory 
                  history={state.rewardHistory} 
                  onToggleRedeemed={(id) => {
                    toggleRewardRedeemed(id);
                    playSound('redeem', state.soundVolume, state.soundEnabled);
                  }}
                />
              </motion.div>
            )}

            {activeTab === 'dungeons' && (
              <motion.div
                key="dungeons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full p-6 lg:p-8 space-y-8"
              >
                <PageHeader 
                  title={dungeonSubTab === 'list' ? "Dungeon Explorer" : dungeonSubTab === 'quests' ? "Quest Board" : "Achievements"} 
                  description={dungeonSubTab === 'list' ? "Manage your study goals" : dungeonSubTab === 'quests' ? "Complete tasks for extra rewards" : "Your legendary milestones"} 
                  icon={dungeonSubTab === 'list' ? Sword : dungeonSubTab === 'quests' ? Target : Trophy} 
                >
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => setDungeonSubTab('list')}
                        className={cn(
                          "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2",
                          dungeonSubTab === 'list' ? "bg-indigo-500/20 text-indigo-400" : "text-slate-500 hover:text-slate-300"
                        )}
                      >
                        <Sword size={14} className="sm:w-4 sm:h-4" />
                        Dungeons
                      </button>
                      <button
                        onClick={() => setDungeonSubTab('quests')}
                        className={cn(
                          "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 relative",
                          dungeonSubTab === 'quests' ? "bg-indigo-500/20 text-indigo-400" : "text-slate-500 hover:text-slate-300"
                        )}
                      >
                        <Target size={14} className="sm:w-4 sm:h-4" />
                        Quests
                        {unclaimedQuestsCount > 0 && state.questNotificationStyle === 'red_dot' && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-950" />
                        )}
                      </button>
                      <button
                        onClick={() => setDungeonSubTab('achievements')}
                        className={cn(
                          "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 relative",
                          dungeonSubTab === 'achievements' ? "bg-amber-500/20 text-amber-400" : "text-slate-500 hover:text-slate-300"
                        )}
                      >
                        <Trophy size={14} className="sm:w-4 sm:h-4" />
                        Achievements
                        {unclaimedAchievementsCount > 0 && state.questNotificationStyle === 'red_dot' && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-950" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsDungeonEditMode(!isDungeonEditMode)}
                        className={cn(
                          "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl transition-all shadow-lg shrink-0",
                          isDungeonEditMode 
                            ? "bg-indigo-600 text-white shadow-indigo-500/20" 
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        )}
                        title={isDungeonEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
                      >
                        <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </button>

                      {dungeonSubTab === 'list' && (
                        <button
                          onClick={() => setIsAddingMajor(true)}
                          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 shrink-0"
                          title="CREATE EXPEDITION GOAL"
                        >
                          <Plus size={18} />
                        </button>
                      )}
                      
                      {dungeonSubTab === 'list' && (
                        <button
                          onClick={() => setIsArchiveView(!isArchiveView)}
                          className={cn(
                            "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl transition-all shadow-lg border shrink-0",
                            isArchiveView 
                              ? "bg-amber-600 border-amber-500 text-white" 
                              : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                          )}
                          title="Toggle Archive"
                        >
                          <Archive size={18} />
                        </button>
                      )}

                      {dungeonSubTab === 'quests' && (
                        <button
                          onClick={() => setIsAddingQuest(true)}
                          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 shrink-0"
                          title="Add Quest"
                        >
                          <Plus size={18} />
                        </button>
                      )}

                      {dungeonSubTab === 'achievements' && (
                        <button
                          onClick={() => setIsAddingQuest(true)}
                          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all shadow-lg shadow-amber-500/20 shrink-0"
                          title="Add Achievement"
                        >
                          <Plus size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </PageHeader>

                {dungeonSubTab === 'list' ? (
                  <DungeonManager 
                    dungeons={dungeons}
                    majorDungeons={majorDungeons}
                    currentDungeonId={state.currentDungeonId}
                    isAddingMajor={isAddingMajor}
                    setIsAddingMajor={setIsAddingMajor}
                    isEditMode={isDungeonEditMode}
                    activeTab={isArchiveView ? 'archive' : 'active'}
                    onSelect={(id) => setState(prev => ({ ...prev, currentDungeonId: prev.currentDungeonId === id ? null : id }))}
                    onCreateMajor={handleCreateMajor}
                    onCreateSub={handleCreateSub}
                    onUpdateMajor={handleUpdateMajor}
                    onUpdateSub={handleUpdateSub}
                    onDeleteMajor={handleDeleteMajor}
                    onDeleteSub={handleDeleteSub}
                    onReorderMajor={reorderMajorDungeon}
                    onReorderSub={reorderSubDungeon}
                    onFinalizeMajor={finalizeMajorDungeon}
                    onArchiveMajor={archiveMajorDungeon}
                    onForceCompleteSub={forceCompleteSubDungeon}
                  />
                ) : dungeonSubTab === 'quests' ? (
                  <QuestManager 
                    quests={state.quests}
                    activeTalents={state.activeTalents}
                    isAdding={isAddingQuest}
                    setIsAdding={setIsAddingQuest}
                    isEditMode={isDungeonEditMode}
                    onUpdateQuests={(quests) => setState(prev => ({ ...prev, quests }))}
                    onClaimReward={claimQuestReward}
                    forceTab="quests"
                  />
                ) : (
                  <QuestManager 
                    quests={state.quests}
                    activeTalents={state.activeTalents}
                    isAdding={isAddingQuest}
                    setIsAdding={setIsAddingQuest}
                    isEditMode={isDungeonEditMode}
                    onUpdateQuests={(quests) => setState(prev => ({ ...prev, quests }))}
                    onClaimReward={claimQuestReward}
                    forceTab="achievements"
                  />
                )}
              </motion.div>
            )}

            {activeTab === 'talents' && (
              <motion.div
                key="talents"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                <TalentTree 
                  points={state.talentPoints}
                  shards={state.talentShards}
                  unlockedIds={state.unlockedTalents}
                  activeIds={state.activeTalents}
                  onUnlock={unlockTalent}
                  onToggle={toggleTalent}
                />
              </motion.div>
            )}

            {activeTab === 'shop' && (
              <motion.div
                key="shop"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                <Shop 
                  coins={state.coins} 
                  shopItems={state.shopItems || []}
                  gachaPools={state.gachaPools || []}
                  onPurchase={handlePurchase}
                  onDrawGacha={handleDraw}
                  onResetIchiban={(id) => {
                    resetIchibanPool(id);
                    setTimeout(() => setDrawResult(null), 50);
                  }}
                  onShowCoinGuide={() => setShowCoinGuide(true)}
                />
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                <Stats state={state} saveDailyLog={saveDailyLog} />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                <Settings 
                  state={state}
                  setState={setState}
                  rewardPool={state.rewardPool || []}
                  shopItems={state.shopItems || []}
                  gachaPools={state.gachaPools || []}
                  onUpdateRewards={(pool) => setState(prev => ({ ...prev, rewardPool: pool }))}
                  onUpdateShop={(items) => setState(prev => ({ ...prev, shopItems: items }))}
                  onUpdateGacha={(pools) => setState(prev => ({ ...prev, gachaPools: pools }))}
                  onResetRewards={resetLootPool}
                  addXP={addXP}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {showDailySummary && (
          <DailySummaryModal 
            state={state}
            dungeons={dungeons}
            majorDungeons={majorDungeons}
            onClose={() => setShowDailySummary(false)}
            onNavigateToStats={() => {
              setShowDailySummary(false);
              setActiveTab('stats');
            }}
            onSave={saveDailyLog}
          />
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      {createPortal(
        <AnimatePresence>
          {showProfile && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-slate-950 w-full max-w-xl rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col relative"
              >
                <div className="relative p-4 sm:p-8 pr-12 sm:pr-24 flex justify-between items-start shrink-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full">
                    <div className="relative group shrink-0">
                      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-indigo-400 shadow-2xl relative overflow-hidden">
                        <User className="w-10 h-10 sm:w-14 sm:h-14" />
                        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-8 h-8 sm:w-12 sm:h-12 bg-slate-950 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-slate-950 flex items-center justify-center shadow-lg">
                        <span className="text-white font-black text-sm sm:text-lg">
                          {state.level}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 flex-grow w-full">
                      {isEditingProfile ? (
                        <div className="space-y-2 w-full">
                          <input 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-transparent border-b-2 border-indigo-500 text-2xl sm:text-3xl font-black text-white tracking-tight italic pr-1 uppercase focus:outline-none w-full"
                            placeholder="Your Name"
                            autoFocus
                          />
                          <input 
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            className="bg-transparent border-b border-slate-700 text-sm sm:text-base text-slate-400 font-medium focus:outline-none w-full mt-1"
                            placeholder="Your Signature"
                          />
                          <div className="flex gap-2 pt-1 w-full max-w-xs">
                            <button onClick={handleSaveProfile} className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all">Save</button>
                            <button onClick={() => setIsEditingProfile(false)} className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="group">
                          <div className="flex items-center justify-between gap-3 w-full">
                            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight italic pr-1 uppercase truncate flex-grow">
                              {state.userName || 'Scholar'}
                            </h2>
                            <button 
                              onClick={() => setIsEditingProfile(true)}
                              className="p-1.5 sm:p-2 bg-slate-900 hover:bg-slate-800 rounded-lg sm:rounded-xl text-slate-500 hover:text-indigo-400 transition-all border border-slate-800 shrink-0"
                            >
                              <SettingsIcon size={16} />
                            </button>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-400 font-medium line-clamp-2">{state.userBio || 'Master of the Study Dungeon'}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-md border border-indigo-500/20">
                              {state.level >= 20 ? 'Grandmaster' : state.level >= 10 ? 'Veteran' : 'Novice'} Explorer
                            </span>
                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-md border border-amber-500/20">
                              {state.streak} Day Streak
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowProfile(false)}
                    className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 sm:p-3 bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white rounded-xl sm:rounded-2xl transition-all border border-slate-800 shrink-0 z-10"
                  >
                    <X size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>

                <div className="px-4 sm:px-8 pb-4 sm:pb-8 overflow-y-auto custom-scrollbar space-y-4 sm:space-y-8 relative z-10">
                  {/* Main Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="p-3 sm:p-5 bg-slate-900/50 rounded-2xl sm:rounded-[2rem] border border-slate-800 hover:border-amber-500/30 transition-colors group">
                      <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-1 sm:mb-3 gap-1 sm:gap-0">
                        <div className="p-1.5 sm:p-2 bg-amber-500/10 rounded-lg sm:rounded-xl text-amber-500 group-hover:scale-110 transition-transform">
                          <Coins size={16} className="sm:w-5 sm:h-5" />
                        </div>
                        <span className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Gold</span>
                      </div>
                      <div className="text-lg sm:text-2xl font-black text-white tracking-tight text-center sm:text-left">
                        {state.coins.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="p-3 sm:p-5 bg-slate-900/50 rounded-2xl sm:rounded-[2rem] border border-slate-800 hover:border-emerald-500/30 transition-colors group">
                      <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-1 sm:mb-3 gap-1 sm:gap-0">
                        <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-lg sm:rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                          <Zap size={16} className="sm:w-5 sm:h-5" />
                        </div>
                        <span className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Talent</span>
                      </div>
                      <div className="text-lg sm:text-2xl font-black text-white tracking-tight text-center sm:text-left">
                        {state.talentPoints}
                      </div>
                    </div>

                    <div className="p-3 sm:p-5 bg-slate-900/50 rounded-2xl sm:rounded-[2rem] border border-slate-800 hover:border-indigo-500/30 transition-colors group">
                      <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-1 sm:mb-3 gap-1 sm:gap-0">
                        <div className="p-1.5 sm:p-2 bg-indigo-500/10 rounded-lg sm:rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                          <Trophy size={16} className="sm:w-5 sm:h-5" />
                        </div>
                        <span className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Medals</span>
                      </div>
                      <div className="text-lg sm:text-2xl font-black text-white tracking-tight text-center sm:text-left">
                        {state.deathDefyingMedals}
                      </div>
                    </div>
                  </div>

                  {/* XP & Leveling Card */}
                  <div className="p-4 sm:p-8 bg-slate-900 rounded-2xl sm:rounded-[2.5rem] border border-slate-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Zap className="w-20 h-20 sm:w-[120px] sm:h-[120px] text-indigo-500" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-end mb-4 sm:mb-6">
                        <div>
                          <h4 className="text-[10px] sm:text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Experience Progress</h4>
                          <div className="text-2xl sm:text-3xl font-black text-white italic pr-1 uppercase tracking-tighter">Level {state.level}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] sm:text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Next Level</div>
                          <div className="text-base sm:text-xl font-black text-white">{state.xp} <span className="text-slate-600 text-xs sm:text-base">/ {getXPForLevel(state.level)} XP</span></div>
                        </div>
                      </div>
                      
                      <div className="relative h-3 sm:h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mb-4 sm:mb-6">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(state.xp / getXPForLevel(state.level)) * 100}%` }}
                          className="h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                        </motion.div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-indigo-500/5 rounded-xl sm:rounded-2xl border border-indigo-500/10">
                        <div className="p-1.5 sm:p-2 bg-indigo-500/20 rounded-lg">
                          <Star size={16} className="sm:w-5 sm:h-5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-[8px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-widest">Next Reward</p>
                          <p className="text-xs sm:text-sm font-bold text-white">
                            {state.levelRewards?.find(r => r.level === state.level + 1) ? (
                              `+${state.levelRewards.find(r => r.level === state.level + 1)?.amount} ${state.levelRewards.find(r => r.level === state.level + 1)?.type === 'talentPoint' ? 'Talent Point' : 'Gold'}`
                            ) : (
                              ((state.level + 1) <= 3 || ((state.level + 1) <= 9 && ((state.level + 1) - 3) % 2 === 0) || ((state.level + 1) > 9 && ((state.level + 1) - 9) % 3 === 0)) ? '+1 Talent Point' : 'New Dungeon Access'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 sm:space-y-4">
                      <h4 className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-2">Account Status</h4>
                      <div className="p-4 sm:p-6 bg-slate-900 rounded-2xl sm:rounded-[2rem] border border-slate-800 space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-slate-400">Cloud Sync</span>
                          <button 
                            onClick={() => setShowCloudSync(true)}
                            className={cn(
                              "px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase rounded-lg border transition-colors",
                              state.secretCode 
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" 
                                : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white"
                            )}
                          >
                            {state.secretCode ? 'Active' : 'Connect'}
                          </button>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                          <span className="text-xs sm:text-sm text-slate-400 whitespace-nowrap">Sync Time</span>
                          <span className="text-[10px] sm:text-xs font-bold text-slate-300 text-right">
                            {state.lastUpdated ? new Date(state.lastUpdated).toLocaleString() : 'Never'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-slate-400">Sync Status</span>
                          <span className="text-[10px] sm:text-xs font-bold text-right flex items-center gap-1">
                            {!state.secretCode ? (
                              <span className="text-slate-500">Not connected</span>
                            ) : isSyncing ? (
                              <>
                                <RefreshCw size={12} className="animate-spin text-indigo-400" />
                                <span className="text-indigo-400">Syncing...</span>
                              </>
                            ) : hasUnsyncedChanges ? (
                              <span className="text-amber-400">Not sync yet</span>
                            ) : state.lastUpdated ? (
                              <span className="text-emerald-400">Up to date</span>
                            ) : (
                              <span className="text-slate-500">No cloud save</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-end gap-2 sm:gap-3">
                      <button 
                        onClick={() => { setActiveTab('settings'); setShowProfile(false); }}
                        className="w-full py-3 sm:py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all flex items-center justify-center gap-2 border border-slate-800"
                      >
                        <SettingsIcon size={16} />
                        System Settings
                      </button>
                      <button 
                        onClick={() => setShowProfile(false)}
                        className="w-full py-3 sm:py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all shadow-xl shadow-indigo-500/20"
                      >
                        Return to Dungeon
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Reward Completion Popup */}
      {createPortal(
        <AnimatePresence>
          {state.lastCompletionRewards && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="bg-slate-900 w-full max-w-md rounded-[40px] border-2 border-indigo-500/50 overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.3)] relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
                <div className="p-8 text-center relative z-10">
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <div className="w-24 h-24 bg-indigo-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-indigo-500/40 rotate-12">
                      <Trophy size={48} className="text-white -rotate-12" />
                    </div>
                    <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">
                      {state.lastCompletionRewards.type === 'dungeon' ? 'Dungeon Cleared!' : 
                       state.lastCompletionRewards.type === 'quest' ? 'Quest Completed!' : 
                       'Achievement Unlocked!'}
                    </h2>
                    <h3 className="text-3xl font-bold text-white tracking-tighter mb-8 italic pr-1">{state.lastCompletionRewards.dungeonName}</h3>
                  </motion.div>
                  <div className="space-y-3 mb-10">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rewards Acquired</p>
                    <div className="grid grid-cols-1 gap-2">
                      {state.lastCompletionRewards.rewards.map((reward, idx) => (
                        <motion.div key={idx} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + idx * 0.1 }} className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                              {reward.type === 'coins' ? <Coins size={16} /> : reward.type === 'xp' ? <Zap size={16} /> : reward.type === 'talentPoint' ? <Zap size={16} className="text-emerald-400" /> : <Gift size={16} />}
                            </div>
                            <span className="text-sm font-bold text-white">
                              {reward.type === 'text' ? reward.rewardText : reward.type === 'talentPoint' ? 'Talent Points' : reward.type === 'coins' ? 'Gold Coins' : reward.type === 'xp' ? 'Experience' : (reward.itemName || 'Item')}
                            </span>
                          </div>
                          <span className="text-lg font-black text-indigo-400">+{reward.amount}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => setState(s => ({ ...s, lastCompletionRewards: null }))} className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-400 transition-colors shadow-xl">
                      {state.lastCompletionRewards.type === 'dungeon' ? 'Claim Dungeon Rewards' : 
                       state.lastCompletionRewards.type === 'quest' ? 'Claim Quest Rewards' : 
                       'Claim Achievement Rewards'}
                    </button>
                    <button 
                      onClick={() => {
                        setState(s => ({ ...s, lastCompletionRewards: null }));
                        setActiveTab('dungeons');
                        if (state.lastCompletionRewards?.type === 'quest') setDungeonSubTab('quests');
                        if (state.lastCompletionRewards?.type === 'achievement') setDungeonSubTab('achievements');
                      }} 
                      className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-colors"
                    >
                      {state.lastCompletionRewards.type === 'dungeon' ? 'Back to Dungeon' : 
                       state.lastCompletionRewards.type === 'quest' ? 'View Quests' : 
                       'View Achievements'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Modern Floating Bottom Navigation for Mobile */}
      {!isFullscreenExplore && (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-[90] pb-[env(safe-area-inset-bottom)]">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-[2rem] p-2 flex justify-between items-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] shadow-indigo-500/10 mx-auto max-w-sm">
            {navItems.filter(i => i.id !== 'settings').map(item => (
              <MobileNavItem 
                key={item.id}
                active={activeTab === item.id} 
                onClick={() => setActiveTab(item.id as any)} 
                icon={<item.icon size={22} />} 
                label={item.label}
                showDot={item.id === 'dungeons' && state.unclaimedQuests > 0 && state.questNotificationStyle === 'red_dot'}
              />
            ))}
          </div>
        </div>
      )}
      <CoinRain active={showCoinRain} onComplete={() => setShowCoinRain(false)} />

      {/* Cloud Sync Modal */}
      {createPortal(
        <AnimatePresence>
          {showCloudSync && (
            <CloudSyncModal
              isOpen={showCloudSync}
              onClose={() => setShowCloudSync(false)}
              secretCode={state.secretCode}
              isSyncing={isSyncing}
              syncError={syncError}
              syncCheckResult={syncCheckResult}
              onConnect={fetchFromCloud}
              onResolveConflict={resolveConflict}
              onCancelConnect={(code) => {
                setSyncCheckResult(null);
                logSyncEvent('cancel_login', code);
              }}
              onManualSync={() => syncToCloud(true)}
              onUnbind={unbindFromCloud}
              onDeleteCloudData={deleteCloudData}
              syncHistory={state.syncHistory}
            />
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* XP Guide Modal */}
      {createPortal(
        <AnimatePresence>
          {showXPGuide && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-emerald-500/30 p-6 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-xl relative"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                      <Zap className="text-emerald-400" size={24} />
                    </div>
                    XP & Leveling Guide
                  </h3>
                  <button onClick={() => setShowXPGuide(false)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <p className="text-xs text-emerald-300 font-bold uppercase tracking-widest mb-2">How to earn XP</p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Complete study sessions in <strong>Explore</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Clear rooms in <strong>Dungeons</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Win XP rewards from the <strong>Gacha</strong></span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                    <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-2">Pro Tip: Customization</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      You can customize how much XP you earn! Go to <strong>Settings &gt; Developer</strong> to adjust base XP rates, or <strong>Settings &gt; Level Rewards</strong> to change what you get when you level up.
                    </p>
                  </div>

                  <button 
                    onClick={() => setShowXPGuide(false)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 mt-2"
                  >
                    Got it!
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Coin Guide Modal */}
      {createPortal(
        <AnimatePresence>
          {showCoinGuide && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-amber-500/30 p-6 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-xl relative"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 rounded-xl">
                      <Coins className="text-amber-400" size={24} />
                    </div>
                    Gold Coins Guide
                  </h3>
                  <button onClick={() => setShowCoinGuide(false)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                    <p className="text-xs text-amber-300 font-bold uppercase tracking-widest mb-2">How to earn Gold</p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>Complete study sessions in <strong>Explore</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>Clear rooms in <strong>Dungeons</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>Win Gold rewards from the <strong>Gacha</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>Level up rewards (if configured)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                    <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-2">Pro Tip: Customization</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      You can customize how much Gold you earn! Go to <strong>Settings &gt; Developer</strong> to adjust base Gold rates, or <strong>Settings &gt; Level Rewards</strong> to change what you get when you level up.
                    </p>
                  </div>

                  <button 
                    onClick={() => setShowCoinGuide(false)}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 mt-2"
                  >
                    Got it!
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Talent Guide Modal */}
      {createPortal(
        <AnimatePresence>
          {showTalentGuide && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-indigo-500/30 p-6 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-xl relative"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-xl">
                      <Star className="text-indigo-400" size={24} />
                    </div>
                    Talent System Guide
                  </h3>
                  <button onClick={() => setShowTalentGuide(false)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                    <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-2">The Rule of Three</p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Collect <span className="text-amber-400 font-bold">3 Talent Shards</span> to automatically forge <span className="text-indigo-400 font-bold">1 Talent Point</span>.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <Zap className="text-emerald-400" size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white">Leveling Up</p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Points are granted at specific level milestones.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                        <Star className="text-amber-400" size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white">Finding Shards</p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Shards are rare drops in <span className="text-indigo-400">Dungeons</span> or won from the <span className="text-amber-400">Gacha</span>.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                    <p className="text-xs text-amber-300 font-bold uppercase tracking-widest mb-2">Pro Tip: Customization</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Want more Talent Points? You can set them as rewards for clearing Dungeons or reaching specific levels in <strong>Settings</strong>!
                    </p>
                  </div>

                  <button 
                    onClick={() => setShowTalentGuide(false)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 mt-2"
                  >
                    Got it!
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {createPortal(
        <AnimatePresence>
          {showLevelUp && currentLevelUp && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <motion.div
                key={currentLevelUp}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -20 }}
                className="bg-slate-900 w-full max-w-md rounded-3xl border border-indigo-500/30 overflow-hidden text-center"
              >
                <div className="p-8 bg-gradient-to-b from-indigo-500/10 to-transparent">
                  <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="text-indigo-400 w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-50 mb-2">Level Up!</h2>
                  <p className="text-indigo-400 font-bold text-xl mb-6">You reached Level {currentLevelUp}</p>
                  
                  <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Rewards</h3>
                      <button 
                        onClick={() => setShowXPGuide(true)}
                        className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 flex items-center gap-1 uppercase tracking-widest transition-colors"
                      >
                        <HelpCircle size={12} />
                        How to get XP
                      </button>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 text-lg font-bold text-white">
                      {state.levelRewards?.find(r => r.level === currentLevelUp) ? (
                        <div className="w-full space-y-3">
                          {(() => {
                            const reward = state.levelRewards.find(r => r.level === currentLevelUp);
                            if (reward?.type === 'text') {
                              return (
                                <div className="flex flex-col items-center gap-3 py-2">
                                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                    <Scroll className="text-emerald-400" size={24} />
                                  </div>
                                  <span className="text-xl font-black text-slate-50 text-center leading-tight">
                                    {reward.rewardText}
                                  </span>
                                </div>
                              );
                            }
                            return (
                              <>
                                <div className="flex items-center justify-center gap-2">
                                  {reward?.type === 'talentPoint' && <Zap size={20} className="text-indigo-400" />}
                                  {reward?.type === 'coins' && <Coins size={20} className="text-amber-400" />}
                                  <span>+{reward?.amount} {reward?.type === 'talentPoint' ? 'Talent Point' : 'Gold'}</span>
                                </div>
                                {reward?.type === 'talentPoint' && (
                                  <p className="text-xs text-slate-500 mt-2">Check the Talents tab to spend it!</p>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      ) : (
                        <>
                          {isTalentLevel(currentLevelUp) ? (
                            <>
                              <div className="flex items-center gap-2">
                                <Zap size={20} className="text-indigo-400" />
                                <span>+1 Talent Point</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-2">Check the Talents tab to spend it!</p>
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-slate-500 text-sm">No specific reward for this level</span>
                              <span className="text-indigo-400/80 text-xs font-medium">
                                Next Talent Point in {getNextTalentLevel(currentLevelUp, state.levelRewards) - currentLevelUp} level(s)
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowLevelUp(prev => {
                        if (!prev || prev.length <= 1) return null;
                        return prev.slice(1);
                      });
                    }}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all"
                  >
                    {showLevelUp.length > 1 ? `Next Level (${showLevelUp.length - 1} more)` : 'Claim Rewards'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {createPortal(
        <AnimatePresence>
          {drawResult && (
            <GachaResultModal 
              results={drawResult as any} 
              allowOverlap={state.gachaAllowOverlap}
              gachaAnimation={state.gachaAnimation}
              ichibanAnimation={state.ichibanAnimation}
              soundEnabled={state.soundEnabled}
              soundVolume={state.soundVolume}
              onClose={() => setDrawResult(null)} 
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
    </>
  );
}

function NavItem({ active, onClick, icon, label, collapsed, showDot }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; collapsed?: boolean; showDot?: boolean; key?: string }) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "w-full flex items-center p-3 rounded-xl transition-all group relative",
        collapsed ? "justify-center" : "space-x-3",
        active 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
          : "text-slate-500 hover:bg-slate-800 hover:text-slate-200"
      )}
    >
      <div className={cn("transition-transform group-hover:scale-110 shrink-0 relative", active ? "scale-110" : "")}>
        {icon}
        {showDot && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-950" />
        )}
      </div>
      {!collapsed && (
        <span className="font-bold text-sm tracking-wide whitespace-nowrap overflow-hidden">
          {label}
        </span>
      )}
    </button>
  );
}

function MobileNavItem({ active, onClick, icon, label, showDot }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; showDot?: boolean; key?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all relative group",
        active ? "text-indigo-400 bg-indigo-500/10" : "text-slate-500 hover:text-slate-300"
      )}
    >
      <div className={cn("relative transition-transform duration-300", active ? "-translate-y-2 opacity-100 scale-110" : "opacity-80")}>
        {icon}
        {showDot && (
          <span className="absolute -bottom-0 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-900" />
        )}
      </div>
      <AnimatePresence>
        {active && (
          <motion.span 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-1 text-[9px] font-black tracking-wider text-indigo-400"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export default App;
