import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sword, Play, Pause, RotateCcw, SkipForward, Trophy, Coins, Zap, Scroll, Flame, Settings2, RefreshCw, Coffee, Maximize } from 'lucide-react';
import { RewardCard, StudySession, Dungeon } from '../types';
import { cn } from '../lib/utils';
import { triggerSimpleConfetti } from '../lib/effects';

interface TimerProps {
  currentDungeon: Dungeon | null;
  rewardPool: RewardCard[];
  activeTalents: string[];
  dailyRerollUsed: boolean;
  history: StudySession[];
  onComplete: (duration: number, focusDuration?: number, restDuration?: number) => StudySession | null;
  onRestComplete?: () => void;
  onInventoryAdd: (id: string) => void;
  onReroll: () => void;
  onRewardSelect: (reward: RewardCard, sessionId: string) => void;
  setShowCoinRain: (show: boolean) => void;
  isFullscreen?: boolean;
  secretCode?: string;
  pushEnabled?: boolean;
  onTogglePip?: () => void;
  // External Config
  focusDuration: number;
  restDuration: number;
  enableRest: boolean;
  isLooping: boolean;
  setIsResting: (val: boolean) => void;
  isResting: boolean;
  setDuration: (val: number) => void;
  duration: number;
  setTimeLeft: (val: number) => void;
  timeLeft: number;
  setIsActive: (val: boolean) => void;
  isActive: boolean;
  setEndTime: (val: number | null) => void;
  endTime: number | null;
}

export interface TimerRef {
  reset: () => void;
  applyPreset: (focus: number, rest: number) => void;
  handleCustomChange: (focus: number, rest: number) => void;
  isResting: boolean;
  isActive: boolean;
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
  pushEnabled,
  onTogglePip,
  focusDuration,
  restDuration,
  enableRest,
  isLooping,
  setIsResting,
  isResting,
  setDuration,
  duration,
  setTimeLeft,
  timeLeft,
  setIsActive,
  isActive,
  setEndTime,
  endTime
}) => {
  const [showRewards, setShowRewards] = useState<{ session: StudySession; choices: RewardCard[] } | null>(null);
  const [showTalentPopup, setShowTalentPopup] = useState<StudySession['triggeredTalents'] | null>(null);

  // Sync to localStorage moved to App.tsx or handled via state setters passed down

  // Push Notification Scheduling
  useEffect(() => {
    if (!pushEnabled || !secretCode) return;

    if (isActive && endTime) {
      const delayMinutes = (endTime - Date.now()) / (60 * 1000);
      if (delayMinutes > 0.1) { // Only schedule if more than 6 seconds left
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
        }).catch(err => console.debug('Push schedule skipped or failed:', err));
      }
    } else {
      fetch('/api/push/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretCode })
      }).catch(err => console.debug('Push cancel skipped or failed:', err));
    }
  }, [isActive, endTime, pushEnabled, secretCode, isResting]);

  const handleComplete = useCallback((silent: boolean = false) => {
    setIsActive(false);
    setEndTime(null);

    // Show local notification if possible
    if (!silent && pushEnabled && 'serviceWorker' in navigator && Notification.permission === 'granted') {
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
      const session = onComplete(duration, focusDuration, restDuration);
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
  }, [duration, isResting, focusDuration, restDuration, enableRest, isLooping, onComplete, onRestComplete, rewardPool, activeTalents, setShowCoinRain, setIsActive, setEndTime, setIsResting, setDuration, setTimeLeft, pushEnabled]);

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
  }, [isActive, endTime, handleComplete, setIsActive, setEndTime, setTimeLeft]);

  const canPip = 'documentPictureInPicture' in window;
  const isPWA = window.matchMedia('(display-mode: standalone)').matches;
  const isDesktop = !('ontouchstart' in window);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative flex flex-col items-center space-y-8 w-full">
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
          <div 
            className={cn(
              "font-black font-mono text-white tracking-tighter flex items-center justify-center",
              isFullscreen ? "text-6xl sm:text-7xl md:text-[5rem]" : "text-6xl sm:text-7xl lg:text-7xl"
            )}
          >
            {formatTime(timeLeft).split('').map((char, i) => (
              <span
                key={i}
                className="inline-block"
              >
                {char}
              </span>
            ))}
          </div>
          <div className={cn(
              "font-bold uppercase tracking-widest text-xs mt-2 flex items-center gap-1",
              isResting ? "text-emerald-500" : "text-indigo-400"
            )}>
            {(() => {
              const statusText = (isResting ? (isActive ? 'Resting...' : 'Ready to Rest') : (isActive ? 'Exploring...' : 'Ready to Delve'));
              const charArray = statusText.split('');
              const totalItems = charArray.length + 1; // +1 for the icon
              const animationDuration = 0.6;
              const repeatDelay = (totalItems - 1) * animationDuration;

              return (
                <>
                  <motion.span
                    animate={isActive ? { y: [0, -8, 0] } : { y: 0 }}
                    transition={{
                      duration: animationDuration,
                      repeat: isActive ? Infinity : 0,
                      ease: "easeInOut",
                      delay: 0,
                      repeatDelay: repeatDelay
                    }}
                    className="inline-block mr-1"
                  >
                    {isResting ? <Coffee size={14} /> : <Sword size={14} />}
                  </motion.span>
                  {charArray.map((char, i) => (
                    <motion.span
                      key={i}
                      animate={isActive ? { y: [0, -8, 0] } : { y: 0 }}
                      transition={{
                        duration: animationDuration,
                        repeat: isActive ? Infinity : 0,
                        ease: "easeInOut",
                        delay: (i + 1) * animationDuration, // Delay based on its position in sequence
                        repeatDelay: repeatDelay
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </>
              );
            })()}
          </div>
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
          onClick={() => handleComplete(true)}
          className="p-4 bg-slate-900 text-slate-400 hover:text-white rounded-full border border-slate-800 transition-all"
          title="Skip Session"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* PiP Mode Toggle - Desktop PWA Only */}
      {canPip && isPWA && isDesktop && onTogglePip && (
        <div className="pt-4">
          <button
            onClick={onTogglePip}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 text-indigo-400 rounded-xl border border-indigo-500/20 hover:bg-indigo-600/20 transition-all text-xs font-bold uppercase tracking-widest"
          >
            <Maximize size={14} />
            <span>Floating Mode</span>
          </button>
        </div>
      )}

      {/* Timer Settings UI removed from here - moved to TimerSettings.tsx */}


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
                      onClick={onReroll}
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
                        onRewardSelect(card, showRewards.session.id);
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
