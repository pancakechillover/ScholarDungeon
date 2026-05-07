import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
        const now = Date.now();
        const pool = (rewardPool || []).filter(card => {
          if (card.limitCount && card.limitPeriodDays) {
            const periodMs = card.limitPeriodDays * 24 * 60 * 60 * 1000;
            const claimsInPeriod = (card.claimHistory || []).filter(ts => (now - new Date(ts).getTime()) < periodMs).length;
            return claimsInPeriod < card.limitCount;
          }
          return true;
        });
        const selectedPool = [...pool];
        const count = activeTalents.includes('c1') ? 4 : 3; // Extra Chance

        for (let i = 0; i < Math.min(count, selectedPool.length); i++) {
          const totalWeight = selectedPool.reduce((acc, r) => acc + r.weight, 0);
          let rand = Math.random() * totalWeight;
          for (let j = 0; j < selectedPool.length; j++) {
            rand -= selectedPool[j].weight;
            if (rand <= 0) {
              choices.push(selectedPool[j]);
              selectedPool.splice(j, 1);
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

      {/* Timer Settings UI removed from here - moved to TimerSettings.tsx */}


      {/* Reward Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showRewards && (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 px-4 py-8 md:p-12 overflow-y-auto no-scrollbar overflow-x-hidden">
              {/* Background Atmosphere */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] aspect-square bg-indigo-500/10 rounded-full blur-[120px]" 
                />
                <div className="absolute top-0 left-0 w-full h-full bg-slate-950/80 [mask-image:radial-gradient(circle_at_50%_50%,transparent_0%,black_100%)]" />
              </div>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.05, opacity: 0 }}
                className="w-full max-w-7xl space-y-6 md:space-y-12 lg:space-y-16 text-center relative z-10 py-6 md:py-10"
              >
              <div className="space-y-2 md:space-y-6">
                <motion.div
                  initial={{ y: -40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                  className={cn(
                    "inline-block p-4 md:p-6 lg:p-8 rounded-full border mb-2 md:mb-6 shadow-2xl",
                    showRewards.session.isCrit 
                      ? "bg-amber-500/20 border-amber-500/30 text-amber-400" 
                      : "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
                  )}
                >
                  <Trophy className="w-8 h-8 md:w-16 md:h-16 lg:w-20 lg:h-20" />
                </motion.div>
                <div className="space-y-2">
                  <motion.h2 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={cn(
                      "text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter italic uppercase",
                      showRewards.session.isCrit ? "text-amber-400" : "text-white"
                    )}
                  >
                    {showRewards.session.isCrit ? 'Critical Victory!' : 'Victory!'}
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm md:text-xl lg:text-2xl text-slate-400 px-4 font-medium"
                  >
                    {showRewards.session.isCrit 
                      ? "Fortune favors the bold. 5x Gold bonus triggered!" 
                      : "Expedition room cleared. Claim your rewards."}
                  </motion.p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-12 lg:gap-16 px-4">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-md px-6 md:px-10 lg:px-14 py-4 md:py-6 lg:py-8 rounded-2xl md:rounded-[2.5rem] border border-emerald-500/30 shadow-xl"
                >
                  <Zap className="text-emerald-400 w-6 h-6 md:w-10 md:h-10 lg:w-12 lg:h-12" />
                  <div className="text-left">
                    <p className="text-[10px] md:text-xs lg:text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">XP Gained</p>
                    <p className="text-2xl md:text-4xl lg:text-5xl font-black text-white">+{showRewards.session.xpEarned}</p>
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className={cn(
                    "flex items-center gap-4 bg-slate-900/50 backdrop-blur-md px-6 md:px-10 lg:px-14 py-4 md:py-6 lg:py-8 rounded-2xl md:rounded-[2.5rem] border transition-all shadow-xl",
                    showRewards.session.isCrit ? "border-amber-400 shadow-amber-500/10" : "border-amber-500/30"
                  )}
                >
                  <Coins className="text-amber-400 w-6 h-6 md:w-10 md:h-10 lg:w-12 lg:h-12" />
                  <div className="text-left">
                    <p className="text-[10px] md:text-xs lg:text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Gold Found</p>
                    <p className="text-2xl md:text-4xl lg:text-5xl font-black text-white">+{showRewards.session.coinsEarned}</p>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-8 px-4 max-w-6xl mx-auto w-full">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-4"
                >
                  <h3 className="text-xs md:text-sm lg:text-base font-bold text-slate-500 uppercase tracking-widest">Rewards Selection</h3>
                  {activeTalents.includes('c2') && !dailyRerollUsed && (
                    <button
                      onClick={onReroll}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-full font-bold uppercase text-[10px] md:text-xs hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25"
                    >
                      <RotateCcw size={14} />
                      Reroll (1 Daily)
                    </button>
                  )}
                </motion.div>
                <div className={cn(
                  "grid gap-6 justify-center",
                  showRewards.choices.length === 3 ? "grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                )}>
                  {showRewards.choices.map((card, idx) => {
                    const now = Date.now();
                    const periodMs = (card.limitPeriodDays || 1) * 24 * 60 * 60 * 1000;
                    const claimsInPeriod = (card.claimHistory || []).filter(ts => (now - new Date(ts).getTime()) < periodMs).length;
                    
                    return (
                      <motion.button
                        key={idx}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9 }} // Removed staggered delay
                        whileHover={{ y: -10, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          triggerSimpleConfetti();
                          
                          onRewardSelect(card, showRewards.session.id);
                          if (card.type === 'item' && card.itemType !== 'talent_shard' && card.itemType !== 'death_defying_medal') {
                            onInventoryAdd(card.id);
                          }
                          if (showRewards.session.triggeredTalents) {
                            setShowTalentPopup(showRewards.session.triggeredTalents);
                          }
                          
                          // Short delay to let the confetti pop before closing
                          setTimeout(() => {
                            setShowRewards(null);
                            
                            // Automatically start rest or next loop
                            if (enableRest) {
                              setIsResting(true);
                              setDuration(restDuration);
                              setTimeLeft(restDuration * 60);
                              setIsActive(true);
                              setEndTime(Date.now() + restDuration * 60 * 1000);
                            } else if (isLooping) {
                              setDuration(focusDuration);
                              setTimeLeft(focusDuration * 60);
                              setIsActive(true);
                              setEndTime(Date.now() + focusDuration * 60 * 1000);
                            } else {
                              setDuration(focusDuration);
                              setTimeLeft(focusDuration * 60);
                            }
                          }, 400);
                        }}
                        className={cn(
                          "relative p-5 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl border-2 text-left transition-all h-full flex flex-col min-h-[160px] md:min-h-[200px]",
                          card.rarity === 'common' ? "bg-slate-900 border-slate-800 hover:border-slate-600" :
                          card.rarity === 'rare' ? "bg-blue-900/20 border-blue-500/50 hover:border-blue-400" :
                          card.rarity === 'epic' ? "bg-purple-900/20 border-purple-500/50 hover:border-purple-400" :
                          "bg-amber-900/20 border-amber-500/50 hover:border-amber-400"
                        )}
                      >
                        <div className="mb-3 md:mb-4 flex items-center justify-between">
                          <span className={cn(
                            "text-xs font-bold uppercase px-2 py-0.5 rounded",
                            card.rarity === 'common' ? "bg-slate-800 text-slate-400" :
                            card.rarity === 'rare' ? "bg-blue-600 text-white" :
                            card.rarity === 'epic' ? "bg-purple-600 text-white" : "bg-amber-500 text-slate-900"
                          )}>
                            {card.rarity}
                          </span>
                          
                          {card.limitCount && (
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                              {claimsInPeriod}/{card.limitCount} Lmt
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2 leading-tight">{card.name}</h4>
                        <p className="text-xs md:text-sm lg:text-base text-slate-400 flex-grow leading-relaxed">{card.description}</p>
                        <div className="mt-4 md:mt-6 flex items-center gap-2 text-indigo-400">
                          <Scroll size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />
                          <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Claim Reward</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showTalentPopup && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
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
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
});
