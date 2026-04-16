import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sword, Play, Pause, RotateCcw, SkipForward, Trophy, Coins, Zap, Scroll, Flame, Settings2, RefreshCw, Coffee } from 'lucide-react';
import { RewardCard, StudySession, Dungeon } from '../types';
import { cn } from '../lib/utils';
import { triggerSimpleConfetti } from '../lib/effects';

interface TimerProps {
  currentDungeon: Dungeon | null;
  rewardPool: RewardCard[];
  activeTalents: string[];
  dailyRerollUsed: boolean;
  history: StudySession[];
  onComplete: (duration: number) => StudySession | null;
  onRestComplete?: () => void;
  onInventoryAdd: (id: string) => void;
  onReroll: () => void;
  onRewardSelect: (reward: RewardCard) => void;
  setShowCoinRain: (show: boolean) => void;
  isFullscreen?: boolean;
  secretCode?: string;
  pushEnabled?: boolean;
}

export const Timer = React.memo<TimerProps>(({ 
  currentDungeon, 
  rewardPool, 
  activeTalents,
  dailyRerollUsed,
  history,
  onComplete, 
  onRestComplete,
  onInventoryAdd,
  onReroll,
  onRewardSelect,
  setShowCoinRain,
  isFullscreen = false,
  secretCode,
  pushEnabled
}) => {
  const [focusDuration, setFocusDuration] = useState(() => parseInt(localStorage.getItem('timer_focusDuration') || '25', 10));
  const [restDuration, setRestDuration] = useState(() => parseInt(localStorage.getItem('timer_restDuration') || '5', 10));
  const [enableRest, setEnableRest] = useState(() => localStorage.getItem('timer_enableRest') === 'true');
  const [isLooping, setIsLooping] = useState(() => localStorage.getItem('timer_isLooping') === 'true');
  const [isResting, setIsResting] = useState(() => localStorage.getItem('timer_isResting') === 'true');

  const [duration, setDuration] = useState(() => {
    const saved = localStorage.getItem('timer_duration');
    return saved ? parseInt(saved, 10) : 25;
  });

  const [isActive, setIsActive] = useState(() => {
    return localStorage.getItem('timer_isActive') === 'true';
  });

  const [endTime, setEndTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('timer_endTime');
    return saved ? parseInt(saved, 10) : null;
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('timer_timeLeft');
    return saved ? parseInt(saved, 10) : 25 * 60;
  });

  const [showRewards, setShowRewards] = useState<{ session: StudySession; choices: RewardCard[] } | null>(null);
  const [showTalentPopup, setShowTalentPopup] = useState<StudySession['triggeredTalents'] | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('timer_focusDuration', focusDuration.toString());
    localStorage.setItem('timer_restDuration', restDuration.toString());
    localStorage.setItem('timer_enableRest', enableRest.toString());
    localStorage.setItem('timer_isLooping', isLooping.toString());
    localStorage.setItem('timer_isResting', isResting.toString());
    localStorage.setItem('timer_duration', duration.toString());
    localStorage.setItem('timer_isActive', isActive.toString());
    if (endTime) {
      localStorage.setItem('timer_endTime', endTime.toString());
    } else {
      localStorage.removeItem('timer_endTime');
    }
    localStorage.setItem('timer_timeLeft', timeLeft.toString());
  }, [focusDuration, restDuration, enableRest, isLooping, isResting, duration, isActive, endTime, timeLeft]);

  // Push Notification Scheduling
  useEffect(() => {
    if (!pushEnabled || !secretCode) return;

    if (isActive && endTime) {
      const delayMinutes = (endTime - Date.now()) / (60 * 1000);
      if (delayMinutes > 0) {
        fetch('/api/push/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secretCode,
            delayMinutes,
            title: isResting ? "Rest Over!" : "Focus Over!",
            body: isResting ? "Time to return to the dungeon." : "You have cleared the room. Take a rest?",
            type: isResting ? 'rest_end' : 'timer_end'
          })
        }).catch(err => console.error('Failed to schedule push:', err));
      }
    } else if (timeLeft > 0) {
      // ONLY cancel when manually paused or reset (timeLeft > 0)
      // If timeLeft is 0, it was a natural finish, let the task be handled or expire
      fetch('/api/push/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretCode })
      }).catch(err => console.error('Failed to cancel push:', err));
    }
  }, [isActive, endTime, pushEnabled, secretCode, isResting, timeLeft]);

  const handleComplete = useCallback(() => {
    setIsActive(false);
    setEndTime(null);

    // Show local notification if possible
    if (pushEnabled && 'serviceWorker' in navigator && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(isResting ? "Rest Over!" : "Focus Over!", {
          body: isResting ? "Time to return to the dungeon." : "You have cleared the room. Take a rest?",
          icon: '/pwa-icon.svg',
          tag: 'timer_complete',
          renotify: true,
          vibrate: [200, 100, 200],
          actions: [
            { action: 'open', title: 'Back to Dungeon' }
          ]
        } as any);
      }).catch(err => console.error('Local notification failed:', err));
    }
    
    if (isResting) {
      // Finished rest
      setIsResting(false);
      setDuration(focusDuration);
      setTimeLeft(focusDuration * 60);
      
      if (onRestComplete) {
        onRestComplete();
      }
      
      if (isLooping) {
        // Automatically start the next loop
        setIsActive(true);
        setEndTime(Date.now() + focusDuration * 60 * 1000);
      }
    } else {
      // Finished focus
      const session = onComplete(duration);
      if (session) {
        // Generate choices from rewardPool
        const choices: RewardCard[] = [];
        const pool = [...rewardPool];
        const count = activeTalents.includes('c1') ? 4 : 3; // Extra Chance

        for (let i = 0; i < Math.min(count, pool.length); i++) {
          const totalWeight = pool.reduce((acc, r) => acc + r.weight, 0);
          let rand = Math.random() * totalWeight;
          for (let j = 0; j < pool.length; j++) {
            rand -= pool[j].weight;
            if (rand <= 0) {
              choices.push(pool[j]);
              pool.splice(j, 1);
              break;
            }
          }
        }

        setShowRewards({ session, choices });
        triggerSimpleConfetti();
        if (session.isCrit) {
          setShowCoinRain(true);
        }
      }
    }
  }, [duration, isResting, focusDuration, restDuration, enableRest, isLooping, onComplete, onRestComplete, rewardPool, activeTalents, setShowCoinRain]);

  useEffect(() => {
    let interval: any = null;
    
    const checkTime = () => {
      if (!isActive || !endTime) return;
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
      
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        setIsActive(false);
        setEndTime(null);
        handleComplete();
      }
    };

    if (isActive && endTime) {
      checkTime(); // Check immediately
      interval = setInterval(checkTime, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, endTime, handleComplete]);

  const toggleTimer = () => {
    if (isActive) {
      setIsActive(false);
      setEndTime(null);
    } else {
      setIsActive(true);
      setEndTime(Date.now() + timeLeft * 1000);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setEndTime(null);
    setIsResting(false);
    setDuration(focusDuration);
    setTimeLeft(focusDuration * 60);
  };

  const applyPreset = (focus: number, rest: number) => {
    setFocusDuration(focus);
    setRestDuration(rest);
    setIsResting(false);
    setDuration(focus);
    setTimeLeft(focus * 60);
    setIsActive(false);
    setEndTime(null);
  };

  const handleCustomChange = (focus: number, rest: number) => {
    const safeFocus = Math.max(1, focus);
    const safeRest = Math.max(1, rest);
    setFocusDuration(safeFocus);
    setRestDuration(safeRest);
    if (!isActive) {
      if (isResting) {
        setDuration(safeRest);
        setTimeLeft(safeRest * 60);
      } else {
        setDuration(safeFocus);
        setTimeLeft(safeFocus * 60);
      }
    }
  };

  const handleReroll = () => {
    if (activeTalents.includes('c2') && !dailyRerollUsed) {
      onReroll();
      // Regenerate choices
      const choices: RewardCard[] = [];
      const pool = [...rewardPool];
      const count = activeTalents.includes('c1') ? 4 : 3;

      for (let i = 0; i < Math.min(count, pool.length); i++) {
        const totalWeight = pool.reduce((acc, r) => acc + r.weight, 0);
        let rand = Math.random() * totalWeight;
        for (let j = 0; j < pool.length; j++) {
          rand -= pool[j].weight;
          if (rand <= 0) {
            choices.push(pool[j]);
            pool.splice(j, 1);
            break;
          }
        }
      }
      if (showRewards) {
        setShowRewards({ ...showRewards, choices });
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative flex flex-col items-center space-y-8 w-full">
      {/* Dungeon Progress in Fullscreen */}
      {isFullscreen && currentDungeon && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl px-6 py-4 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl flex items-center gap-6"
        >
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/20 shrink-0">
            <Sword size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-end mb-2">
              <h4 className="text-sm font-black text-white uppercase italic tracking-tight truncate">{currentDungeon.name}</h4>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {currentDungeon.completedSessions}/{currentDungeon.totalSessions}
              </span>
            </div>
            <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(currentDungeon.completedSessions / currentDungeon.totalSessions) * 100}%` }}
                className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Timer Display */}
      <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[480px] aspect-square">
        <svg viewBox="0 0 320 320" className="w-full h-full transform -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="150"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-800"
          />
          <motion.circle
            cx="160"
            cy="160"
            r="150"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 150}
            initial={{ strokeDashoffset: (2 * Math.PI * 150) * (1 - timeLeft / ((duration || 25) * 60)) }}
            animate={{ strokeDashoffset: (2 * Math.PI * 150) * (1 - timeLeft / ((duration || 25) * 60)) }}
            className={isResting ? "text-emerald-500" : "text-indigo-500"}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl sm:text-7xl lg:text-8xl font-black font-mono text-white tracking-tighter">
            {formatTime(timeLeft)}
          </span>
          <span className={cn(
            "font-bold uppercase tracking-widest text-xs mt-2 flex items-center gap-2",
            isResting ? "text-emerald-500" : "text-slate-500"
          )}>
            {isResting ? <Coffee size={14} /> : null}
            {isResting ? (isActive ? 'Resting...' : 'Ready to Rest') : (isActive ? 'Exploring...' : 'Ready to Delve')}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-6">
        <button
          onClick={resetTimer}
          className="p-4 bg-slate-900 text-slate-400 hover:text-white rounded-full border border-slate-800 transition-all"
          title="Reset Timer"
        >
          <RotateCcw size={24} />
        </button>
        <button
          onClick={toggleTimer}
          className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl",
            isActive 
              ? (isResting ? "bg-slate-900 text-emerald-500 border-2 border-emerald-500" : "bg-slate-900 text-indigo-500 border-2 border-indigo-500") 
              : (isResting ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-indigo-600 text-white hover:bg-indigo-500")
          )}
        >
          {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
        </button>
        <button
          onClick={handleComplete}
          className="p-4 bg-slate-900 text-slate-400 hover:text-white rounded-full border border-slate-800 transition-all"
          title="Skip Session"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* Timer Settings & Presets */}
      {!isFullscreen && (
        <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Settings2 size={16} />
            Timer Settings
          </h3>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-300 cursor-pointer group">
              <div className={cn(
                "w-8 h-5 rounded-full transition-colors relative",
                enableRest ? "bg-emerald-500" : "bg-slate-700"
              )}>
                <div className={cn(
                  "absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform",
                  enableRest ? "translate-x-3" : "translate-x-0"
                )} />
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={enableRest}
                onChange={(e) => {
                  setEnableRest(e.target.checked);
                  if (!e.target.checked && isResting) {
                    setIsResting(false);
                    setDuration(focusDuration);
                    setTimeLeft(focusDuration * 60);
                    setIsActive(false);
                    setEndTime(null);
                  }
                }}
              />
              Rest
            </label>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-300 cursor-pointer group">
              <div className={cn(
                "w-8 h-5 rounded-full transition-colors relative",
                isLooping ? "bg-indigo-500" : "bg-slate-700"
              )}>
                <div className={cn(
                  "absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform",
                  isLooping ? "translate-x-3" : "translate-x-0"
                )} />
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={isLooping}
                onChange={(e) => setIsLooping(e.target.checked)}
              />
              <RefreshCw size={14} className={isLooping ? "text-indigo-400" : "text-slate-500"} />
              Loop
            </label>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {enableRest ? (
            <>
              <button
                onClick={() => applyPreset(25, 5)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                  focusDuration === 25 && restDuration === 5 ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/30" : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white"
                )}
              >
                25 + 5
              </button>
              <button
                onClick={() => applyPreset(50, 10)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                  focusDuration === 50 && restDuration === 10 ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/30" : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white"
                )}
              >
                50 + 10
              </button>
            </>
          ) : (
            <>
              {[10, 25, 45, 60].map(d => (
                <button
                  key={d}
                  onClick={() => applyPreset(d, restDuration)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                    focusDuration === d ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/30" : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white"
                  )}
                >
                  {d} min
                </button>
              ))}
            </>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Focus (min)</span>
            <input 
              type="number" 
              min="1"
              value={focusDuration} 
              onChange={(e) => handleCustomChange(parseInt(e.target.value) || 1, restDuration)}
              className="w-20 bg-slate-950 border border-slate-700 rounded-xl py-2 text-center text-white font-mono focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          {enableRest && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rest (min)</span>
              <input 
                type="number" 
                min="1"
                value={restDuration} 
                onChange={(e) => handleCustomChange(focusDuration, parseInt(e.target.value) || 1)}
                className="w-20 bg-slate-950 border border-slate-700 rounded-xl py-2 text-center text-emerald-400 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          )}
        </div>
      </div>
      )}

      {/* Reward Modal */}
      <AnimatePresence>
        {showRewards && (
          <div className="fixed inset-0 z-[100] flex justify-center p-4 bg-black/95 backdrop-blur-xl overflow-y-auto custom-scrollbar">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-4xl w-full my-auto py-8 md:py-12 space-y-6 md:space-y-12 text-center relative z-10"
            >
              <div className="space-y-2 md:space-y-4">
                <motion.div
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  className={cn(
                    "inline-block p-2 md:p-4 rounded-full border mb-1 md:mb-4",
                    showRewards.session.isCrit 
                      ? "bg-amber-500/20 border-amber-500/30 text-amber-400 animate-pulse" 
                      : "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
                  )}
                >
                  <Trophy size={28} className="md:w-12 md:h-12" />
                </motion.div>
                <h2 className={cn(
                  "text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter italic uppercase",
                  showRewards.session.isCrit ? "text-amber-400" : "text-white"
                )}>
                  {showRewards.session.isCrit ? 'Critical Victory!' : 'Victory!'}
                </h2>
                <p className="text-xs md:text-base text-slate-400 px-4">
                  {showRewards.session.isCrit 
                    ? "Your intuition was sharp! 5x Gold bonus triggered!" 
                    : "You've successfully cleared the room."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-8 px-4">
                <div className="flex items-center gap-3 bg-slate-900 px-5 md:px-8 py-2 md:py-4 rounded-xl md:rounded-3xl border border-emerald-500/30">
                  <Zap className="text-emerald-400 md:w-8 md:h-8" size={20} />
                  <div className="text-left">
                    <p className="text-xs md:text-sm font-bold text-slate-500 uppercase">XP Gained</p>
                    <p className="text-lg md:text-3xl font-black text-white">+{showRewards.session.xpEarned}</p>
                  </div>
                </div>
                <div className={cn(
                  "flex items-center gap-3 bg-slate-900 px-5 md:px-8 py-2 md:py-4 rounded-xl md:rounded-3xl border transition-all",
                  showRewards.session.isCrit ? "border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]" : "border-amber-500/30"
                )}>
                  <Coins className="text-amber-400 md:w-8 md:h-8" size={20} />
                  <div className="text-left">
                    <p className="text-xs md:text-sm font-bold text-slate-500 uppercase">Gold Found</p>
                    <p className="text-lg md:text-3xl font-black text-white">+{showRewards.session.coinsEarned}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 px-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <h3 className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">Select Your Reward</h3>
                  {activeTalents.includes('c2') && !dailyRerollUsed && (
                    <button
                      onClick={handleReroll}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30 hover:bg-indigo-600/30 transition-all"
                    >
                      <RotateCcw size={14} />
                      <span className="text-xs md:text-sm font-bold uppercase">Reroll (1 Daily)</span>
                    </button>
                  )}
                </div>
                <div className={cn(
                  "grid gap-4",
                  showRewards.choices.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                )}>
                  {showRewards.choices.map((card, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ y: -5, scale: 1.02 }}
                      onClick={() => {
                        onRewardSelect(card);
                        if (card.type === 'item' && card.itemType !== 'talent_shard' && card.itemType !== 'death_defying_medal') {
                          onInventoryAdd(card.id);
                        }
                        if (showRewards.session.triggeredTalents) {
                          setShowTalentPopup(showRewards.session.triggeredTalents);
                        }
                        setShowRewards(null);
                        
                        // Automatically start rest or next loop
                        if (enableRest) {
                          setIsResting(true);
                          setDuration(restDuration);
                          setTimeLeft(restDuration * 60);
                          // If loop is on, start rest immediately. 
                          // If loop is off but rest is on, we still start rest automatically as requested.
                          setIsActive(true);
                          setEndTime(Date.now() + restDuration * 60 * 1000);
                        } else if (isLooping) {
                          setDuration(focusDuration);
                          setTimeLeft(focusDuration * 60);
                          setIsActive(true);
                          setEndTime(Date.now() + focusDuration * 60 * 1000);
                        } else {
                          // Reset timer if not looping and no rest
                          setDuration(focusDuration);
                          setTimeLeft(focusDuration * 60);
                        }
                      }}
                      className={cn(
                        "relative p-5 md:p-6 rounded-2xl md:rounded-3xl border-2 text-left transition-all h-full flex flex-col",
                        card.rarity === 'common' ? "bg-slate-900 border-slate-800 hover:border-slate-600" :
                        card.rarity === 'rare' ? "bg-blue-900/20 border-blue-500/50 hover:border-blue-400" :
                        card.rarity === 'epic' ? "bg-purple-900/20 border-purple-500/50 hover:border-purple-400" :
                        "bg-amber-900/20 border-amber-500/50 hover:border-amber-400"
                      )}
                    >
                      <div className="mb-3 md:mb-4">
                        <span className={cn(
                          "text-xs font-bold uppercase px-2 py-0.5 rounded",
                          card.rarity === 'common' ? "bg-slate-800 text-slate-400" :
                          card.rarity === 'rare' ? "bg-blue-600 text-white" :
                          card.rarity === 'epic' ? "bg-purple-600 text-white" : "bg-amber-500 text-slate-900"
                        )}>
                          {card.rarity}
                        </span>
                      </div>
                      <h4 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2 leading-tight">{card.name}</h4>
                      <p className="text-xs md:text-sm text-slate-400 flex-grow leading-relaxed">{card.description}</p>
                      <div className="mt-4 md:mt-6 flex items-center gap-2 text-indigo-400">
                        <Scroll size={14} />
                        <span className="text-xs font-bold uppercase tracking-widest">Claim Reward</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTalentPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 w-full max-w-md rounded-3xl border border-indigo-500/30 overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-indigo-900/20">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Flame className="text-indigo-400" />
                  Talent Triggered!
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {showTalentPopup.flowExperience && (
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <h4 className="text-sm font-bold text-indigo-400 mb-2">Flow Experience (16th Session)</h4>
                    <div className="flex gap-4">
                      {showTalentPopup.flowExperience.xp > 0 && (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Zap size={14} /> +{showTalentPopup.flowExperience.xp} XP
                        </span>
                      )}
                      {showTalentPopup.flowExperience.coins > 0 && (
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Coins size={14} /> +{showTalentPopup.flowExperience.coins} Gold
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {showTalentPopup.perfectTheory && (
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <h4 className="text-sm font-bold text-indigo-400 mb-2">Streak Bonus (Perfect Theory / Bounty Decree)</h4>
                    <div className="flex gap-4">
                      {showTalentPopup.perfectTheory.xp > 0 && (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Zap size={14} /> +{showTalentPopup.perfectTheory.xp} XP
                        </span>
                      )}
                      {showTalentPopup.perfectTheory.coins > 0 && (
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Coins size={14} /> +{showTalentPopup.perfectTheory.coins} Gold
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setShowTalentPopup(null)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors mt-4"
                >
                  Awesome!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});
