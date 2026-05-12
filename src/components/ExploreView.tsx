import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer as TimerIcon, 
  Sword, 
  Target, 
  Trophy, 
  History, 
  Package, 
  PictureInPicture, 
  Maximize,
  Minimize,
  Sparkles,
  Layers,
  HelpCircle,
  Zap,
  Coins,
  BarChart3,
  X,
  Settings as SettingsIcon,
  Archive
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useScrollLock } from '../hooks/useScrollLock';
import { PageHeader } from './PageHeader';
import { Timer } from './Timer';
import { TimerSettings } from './TimerSettings';
import { RecentSessions } from './RecentSessions';
import { TalentIcon } from './TalentIcon';
import { RewardChestModal } from './RewardChestModal';
import { TreasureChestIcon } from './icons/TreasureChestIcon';
import { TALENTS } from '../constants';
import { cn } from '../lib/utils';
import { playSound } from '../lib/sound';
import { AppState, Dungeon, MajorDungeon, RewardCard } from '../types';

interface ExploreViewProps {
  state: AppState;
  dungeons: Dungeon[];
  majorDungeons: MajorDungeon[];
  currentDungeon: Dungeon | null;
  nextSessionStats: any;
  isTimerActive: boolean;
  setIsTimerActive: (active: boolean) => void;
  isResting: boolean;
  setIsResting: (resting: boolean) => void;
  timeLeft: number;
  setTimeLeft: (time: number) => void;
  duration: number;
  setDuration: (dur: number) => void;
  endTime: number | null;
  setEndTime: (time: number | null) => void;
  focusDuration: number;
  setFocusDuration: (dur: number) => void;
  restDuration: number;
  setRestDuration: (dur: number) => void;
  enableRest: boolean;
  setEnableRest: (enable: boolean) => void;
  isLooping: boolean;
  setIsLooping: (loop: boolean) => void;
  loopTarget: number;
  setLoopTarget: (val: number) => void;
  loopCount: number;
  setLoopCount: (val: number) => void;
  timerPresets: {focus: number, rest: number}[];
  addTimerPreset: (focus: number, rest: number) => void;
  removeTimerPreset: (focus: number, rest: number) => void;
  applyTimerPreset: (focus: number, rest: number) => void;
  handleTimerCustomChange: (focus: number, rest: number) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  setDungeonSubTab: (tab: any) => void;
  isFullscreenExplore: boolean;
  setIsFullscreenExplore: (full: boolean) => void;
  showCoinRain: boolean;
  setShowCoinRain: (show: boolean) => void;
  showBuildDetails: boolean;
  setShowBuildDetails: (show: boolean) => void;
  completeSession: (dungeonId: string | null, duration: number, fDur: number, rDur: number) => any;
  selectReward: (reward: any, sessionId: string) => void;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  syncToCloud: (forceOverwrite?: boolean, specificState?: AppState, syncMethod?: 'Manual' | 'Immediate' | 'Interval polling' | 'Visibility API Active') => void;
  updateSession: (id: string, updates: any) => void;
  deleteSession: (id: string) => void;
  bulkCreateSessions: (data: { count: number, objectiveId: string, startTime: string, endTime: string }) => void;
  bulkDeleteSessions: (data: { startTime: string, endTime: string }) => void;
  togglePip: () => void;
  canPip: boolean;
  isPWA: boolean;
  isDesktop: boolean;
  unclaimedQuestsCount: number;
  unclaimedAchievementsCount: number;
  openTimerSettings: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  state,
  dungeons,
  majorDungeons,
  currentDungeon,
  nextSessionStats,
  isTimerActive,
  setIsTimerActive,
  isResting,
  setIsResting,
  timeLeft,
  setTimeLeft,
  duration,
  setDuration,
  endTime,
  setEndTime,
  focusDuration,
  setFocusDuration,
  restDuration,
  setRestDuration,
  enableRest,
  setEnableRest,
  isLooping,
  setIsLooping,
  loopTarget,
  setLoopTarget,
  loopCount,
  setLoopCount,
  timerPresets,
  addTimerPreset,
  removeTimerPreset,
  applyTimerPreset,
  handleTimerCustomChange,
  activeTab,
  setActiveTab,
  setDungeonSubTab,
  isFullscreenExplore,
  setIsFullscreenExplore,
  showCoinRain,
  setShowCoinRain,
  showBuildDetails,
  setShowBuildDetails,
  completeSession,
  selectReward,
  setState,
  syncToCloud,
  updateSession,
  deleteSession,
  bulkCreateSessions,
  bulkDeleteSessions,
  togglePip,
  canPip,
  isPWA,
  isDesktop,
  unclaimedQuestsCount,
  unclaimedAchievementsCount,
  openTimerSettings
}) => {
  const [showChestModal, setShowChestModal] = React.useState(false);
  const [activeTooltipId, setActiveTooltipId] = React.useState<string | null>(null);

  useScrollLock(showBuildDetails || showChestModal);


  // Close tooltip when clicking outside
  React.useEffect(() => {
    if (!activeTooltipId) return;
    const handleGlobalClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.talent-icon-container')) {
        setActiveTooltipId(null);
      }
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, [activeTooltipId]);
  
  return (
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
              <div className="flex flex-col flex-1 min-h-0 bg-slate-900/20 rounded-[2.5rem] border border-slate-800/50 overflow-hidden">
                {/* Top Banner: Navigation & Controls */}
                <div className="flex items-center bg-slate-900/40 border-b border-slate-800/50 p-3 px-5 backdrop-blur-sm shrink-0 justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={openTimerSettings}
                      className="p-2 bg-slate-800/80 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-400 rounded-xl transition-all border border-slate-700/50 hover:border-indigo-500/30 group"
                      title="Timer Settings"
                    >
                      <SettingsIcon size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                    {!state.timerBannerCompactMode && (
                      <>
                        <div className="w-[1px] h-6 bg-slate-800 mx-1"></div>
                        {(!state.timerBannerShortcuts || state.timerBannerShortcuts.includes('dungeons')) && (
                        <button
                          onClick={() => { setActiveTab('dungeons'); setDungeonSubTab('list'); }}
                          className="p-2 bg-slate-800/80 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-400 rounded-xl transition-all border border-slate-700/50 hover:border-indigo-500/30 group"
                          title="Dungeons"
                        >
                          <Sword size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                      )}
                      {(!state.timerBannerShortcuts || state.timerBannerShortcuts.includes('quests')) && (
                        <button
                          onClick={() => { setActiveTab('dungeons'); setDungeonSubTab('quests'); }}
                          className="p-2 bg-slate-800/80 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-400 rounded-xl transition-all border border-slate-700/50 hover:border-indigo-500/30 group relative"
                          title="Quests"
                        >
                          <Target size={16} className="group-hover:scale-110 transition-transform" />
                          {unclaimedQuestsCount > 0 && state.questNotificationStyle === 'red_dot' && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-indigo-500 rounded-full border border-slate-900" />
                          )}
                        </button>
                      )}
                      {(!state.timerBannerShortcuts || state.timerBannerShortcuts.includes('achievements')) && (
                        <button
                          onClick={() => { setActiveTab('dungeons'); setDungeonSubTab('achievements'); }}
                          className="p-2 bg-slate-800/80 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-400 rounded-xl transition-all border border-slate-700/50 hover:border-indigo-500/30 group relative"
                          title="Achievements"
                        >
                          <Trophy size={16} className="group-hover:scale-110 transition-transform" />
                          {unclaimedAchievementsCount > 0 && state.questNotificationStyle === 'red_dot' && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-indigo-500 rounded-full border border-slate-900" />
                          )}
                        </button>
                      )}
                      {(!state.timerBannerShortcuts || (state.timerBannerShortcuts.includes('dungeons') || state.timerBannerShortcuts.includes('quests') || state.timerBannerShortcuts.includes('achievements')) && (state.timerBannerShortcuts.includes('recent') || state.timerBannerShortcuts.includes('vault'))) && (
                        <div className="w-[1px] h-6 bg-slate-800 mx-1"></div>
                      )}
                      {(!state.timerBannerShortcuts || state.timerBannerShortcuts.includes('recent')) && (
                        <button
                          onClick={() => {
                            // If we are not in explore tab, go to explore first
                            if (activeTab !== 'explore') {
                              setActiveTab('explore');
                              setTimeout(() => document.getElementById('recent-sessions-anchor')?.scrollIntoView({ behavior: 'smooth' }), 100);
                            } else {
                              document.getElementById('recent-sessions-anchor')?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="p-2 bg-slate-800/80 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-400 rounded-xl transition-all border border-slate-700/50 hover:border-indigo-500/30 group"
                          title="Recent Sessions"
                        >
                          <History size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                      )}
                      {(!state.timerBannerShortcuts || state.timerBannerShortcuts.includes('vault')) && (
                        <button
                          onClick={() => setActiveTab('vault')}
                          className="p-2 bg-slate-800/80 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-400 rounded-xl transition-all border border-slate-700/50 hover:border-indigo-500/30 group"
                          title="Vault"
                        >
                          <Package size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                      )}
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {state.pendingRewardChest && state.pendingRewardChest.length > 0 && (
                      <button 
                        onClick={() => setShowChestModal(true)}
                        className="relative p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded-xl transition-all border border-emerald-500/30 hover:border-emerald-400/50 group"
                        title="Reward Chest"
                      >
                        <TreasureChestIcon size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
                      </button>
                    )}
                    {canPip && typeof window !== 'undefined' && /Win|Mac/i.test(navigator.userAgent || navigator.platform) && (
                      <button 
                        onClick={togglePip}
                        className="p-2 bg-slate-800/80 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-400 rounded-xl transition-all border border-slate-700/50 hover:border-indigo-500/30 group"
                        title="Floating Mini Timer (Always on Top)"
                      >
                        <PictureInPicture size={16} className="group-hover:scale-110 transition-transform" />
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setIsFullscreenExplore(true);
                        if (document.documentElement.requestFullscreen) {
                          document.documentElement.requestFullscreen().catch(() => {});
                        }
                      }}
                      className="p-2 bg-slate-800/80 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-400 rounded-xl transition-all border border-slate-700/50 hover:border-indigo-500/30 group"
                      title="Fullscreen Mode"
                    >
                      <Maximize size={16} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 relative p-4 sm:p-8 flex flex-col items-center justify-center">
                
                <div className="w-full max-w-md aspect-square sm:aspect-auto flex items-center justify-center scale-90 sm:scale-100">
                  <Timer 
                    currentDungeon={currentDungeon || null}
                    rewardPool={state.rewardPool || []}
                    activeTalents={state.activeTalents}
                    timerSkipVictoryMode={state.timerSkipVictoryMode}
                    dailyRerollUsed={state.dailyRerollUsed}
                    history={state.history}
                    critChance={state.devModeEnabled ? (state.devCritChance ?? 0.05) : 0.05}
                    critMultiplier={state.devModeEnabled ? (state.devCritMultiplier ?? 5) : 5}
                    onComplete={(duration, fDur, rDur) => {
                      const result = completeSession(state.currentDungeonId || null, duration, fDur, rDur);
                      playSound('success', state.soundVolume, state.soundEnabled);
                      if (result && state.secretCode) {
                        syncToCloud(true, undefined, 'Manual');
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
                      if (state.secretCode) {
                        syncToCloud(true, undefined, 'Manual');
                      }
                      setState(prev => ({
                        ...prev,
                        pendingRewardChest: prev.pendingRewardChest?.filter(item => item.session.id !== sessionId) || []
                      }));
                    }}
                    onDeferReward={(session, choices) => {
                      setState(prev => ({
                        ...prev,
                        pendingRewardChest: [...(prev.pendingRewardChest || []), { session, choices }]
                      }));
                    }}
                    setShowCoinRain={setShowCoinRain}
                    isFullscreen={isFullscreenExplore}
                    secretCode={state.secretCode}
                    pushEnabled={state.pushEnabled}
                    onTogglePip={togglePip}
                    requireFocusConfirmation={state.requireFocusConfirmation}
                    focusDuration={focusDuration}
                    restDuration={restDuration}
                    enableRest={enableRest}
                    isLooping={isLooping}
                    loopTarget={loopTarget}
                    loopCount={loopCount}
                    setLoopCount={setLoopCount}
                    setIsResting={setIsResting}
                    isResting={isResting}
                    setDuration={setDuration}
                    duration={duration}
                    setTimeLeft={setTimeLeft}
                    timeLeft={timeLeft}
                    setIsActive={setIsTimerActive}
                    isActive={isTimerActive}
                    setEndTime={setEndTime}
                    endTime={endTime}
                  />
                </div>
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
                      <div className="h-2 flex w-full bg-slate-900 rounded-full border border-slate-800 overflow-hidden">
                         <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentDungeon.completedSessions / currentDungeon.totalSessions) * 100}%` }}
                            className={cn("h-full shadow-[0_0_15px_rgba(99,102,241,0.6)]", currentDungeon.status === 'completed' ? "bg-emerald-500" : "bg-indigo-500")}
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
                      timerSkipVictoryMode={state.timerSkipVictoryMode}
                      dailyRerollUsed={state.dailyRerollUsed}
                      history={state.history}
                      critChance={state.devModeEnabled ? (state.devCritChance ?? 0.05) : 0.05}
                      critMultiplier={state.devModeEnabled ? (state.devCritMultiplier ?? 5) : 5}
                      onComplete={(duration, fDur, rDur) => {
                        const result = completeSession(state.currentDungeonId || null, duration, fDur, rDur);
                        playSound('success', state.soundVolume, state.soundEnabled);
                        if (result && state.secretCode) {
                          syncToCloud(true, undefined, 'Manual');
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
                        if (state.secretCode) {
                          syncToCloud(true, undefined, 'Manual');
                        }
                        setState(prev => ({
                          ...prev,
                          pendingRewardChest: prev.pendingRewardChest?.filter(item => item.session.id !== sessionId) || []
                        }));
                      }}
                      onDeferReward={(session, choices) => {
                        setState(prev => ({
                          ...prev,
                          pendingRewardChest: [...(prev.pendingRewardChest || []), { session, choices }]
                        }));
                      }}
                      setShowCoinRain={setShowCoinRain}
                      isFullscreen={isFullscreenExplore}
                      secretCode={state.secretCode}
                      pushEnabled={state.pushEnabled}
                      onTogglePip={togglePip}
                      requireFocusConfirmation={state.requireFocusConfirmation}
                      focusDuration={focusDuration}
                      restDuration={restDuration}
                      enableRest={enableRest}
                      isLooping={isLooping}
                      loopTarget={loopTarget}
                      loopCount={loopCount}
                      setLoopCount={setLoopCount}
                      setIsResting={setIsResting}
                      isResting={isResting}
                      setDuration={setDuration}
                      duration={duration}
                      setTimeLeft={setTimeLeft}
                      timeLeft={timeLeft}
                      setIsActive={setIsTimerActive}
                      isActive={isTimerActive}
                      setEndTime={setEndTime}
                      endTime={endTime}
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
                loopTarget={loopTarget}
                setLoopTarget={setLoopTarget}
                loopCount={loopCount}
                setLoopCount={setLoopCount}
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
                          <div 
                            key={talent.id} 
                            className="group relative hover:z-[100] talent-icon-container"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTooltipId(activeTooltipId === talent.id ? null : talent.id);
                            }}
                          >
                            <div className={cn(
                              "w-12 h-12 flex items-center justify-center rounded-xl border transition-all hover:scale-110 cursor-pointer",
                              colorClass,
                              activeTooltipId === talent.id && "ring-2 ring-indigo-500 scale-110 bg-indigo-500/20 border-indigo-500/40"
                            )}>
                              <TalentIcon iconName={talent.icon || 'Scroll'} size={24} />
                            </div>

                            {/* Tooltip */}
                            <div className={cn(
                              "absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[100] transition-all duration-200 pointer-events-none",
                              activeTooltipId === talent.id 
                                ? "visible opacity-100 translate-y-0" 
                                : "invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0"
                            )}>
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
            bulkCreateSessions={bulkCreateSessions}
            bulkDeleteSessions={bulkDeleteSessions}
            rewardPool={state.rewardPool}
          />
        </div>
      )}

      {createPortal(
        <AnimatePresence>
          {showBuildDetails && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm border-0 m-0">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 w-full max-w-md rounded-3xl border border-slate-700 overflow-hidden shadow-2xl relative z-10"
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
                    {nextSessionStats.breakdown.map((item: any, idx: number) => (
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
      
      {showChestModal && state.pendingRewardChest && (
        <RewardChestModal
          chest={state.pendingRewardChest}
          onSelect={(reward, sessionId) => {
            if (reward) {
              selectReward(reward, sessionId);
              if (reward.type === 'item' && reward.itemType !== 'talent_shard' && reward.itemType !== 'death_defying_medal') {
                setState(prev => ({ ...prev, inventory: [...(prev.inventory || []), reward.id] }));
              }
            }
            // remove this session from pending chest
            setState(prev => ({
              ...prev,
              pendingRewardChest: prev.pendingRewardChest?.filter(item => item.session.id !== sessionId) || []
            }));
            
            // if empty, close it
            setState(prev => {
              if (prev.pendingRewardChest?.length === 0) setShowChestModal(false);
              return prev;
            });
          }}
          onClose={() => setShowChestModal(false)}
        />
      )}
    </motion.div>
  );
};
