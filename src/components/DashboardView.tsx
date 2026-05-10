import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Sword, 
  ChevronRight, 
  Calendar,
  BookOpen, 
  HelpCircle,
  Coins,
  Zap,
  Compass,
  Package,
  Clock
} from 'lucide-react';
import { AppState, Dungeon } from '../types';
import { playSound } from '../lib/sound';

interface DashboardViewProps {
  state: AppState;
  currentDungeon: Dungeon | null;
  setActiveTab: (tab: any) => void;
  setShowDailySummary: (show: boolean) => void;
  openGuideBook: (chapter: number) => void;
  saveDailyLog: (date: string, rating: number, reflection: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  currentDungeon,
  setActiveTab,
  setShowDailySummary,
  openGuideBook,
  saveDailyLog
}) => {
  const settlementPeriod = useMemo(() => {
    const ts = state.timeSettings || {
      morning: { start: 8, end: 12 },
      afternoon: { start: 14, end: 18 },
      night: { start: 20, end: 24 }
    };

    const timezone = state.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    let now = new Date();
    if (state.timezone) {
      try {
        const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        now = tzDate;
      } catch (e) {}
    }

    const hour = now.getHours();
    let baseDate = new Date(now);

    // If night peak spans midnight and we are currently in that post-midnight block, 
    // or if we are simply before the morning peak starts, the current settlement "day" started yesterday
    if (ts.night.start > ts.night.end && hour < ts.night.end) {
      baseDate.setDate(baseDate.getDate() - 1);
    } else if (hour < ts.morning.start) {
      baseDate.setDate(baseDate.getDate() - 1);
    }
    
    // Start Date: morning.start of baseDate
    const startDate = new Date(baseDate);
    startDate.setHours(ts.morning.start, 0, 0, 0);
    
    // End Date: night.end of baseDate (might be tomorrow)
    const endDate = new Date(baseDate);
    if (ts.night.end <= ts.night.start) {
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(ts.night.end === 24 ? 0 : ts.night.end, 0, 0, 0);
    } else {
        if (ts.night.end === 24) {
             endDate.setDate(endDate.getDate() + 1);
             endDate.setHours(0, 0, 0, 0);
        } else {
             endDate.setHours(ts.night.end, 0, 0, 0);
        }
    }

    const formatDate = (d: Date) => {
      const mo = (d.getMonth() + 1).toString().padStart(2, '0');
      const da = d.getDate().toString().padStart(2, '0');
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      return `${mo}/${da} ${h}:${m}`;
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }, [state.timeSettings, state.timezone]);

  return (
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
          <h2 className="text-3xl font-bold text-slate-50 mb-2">
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
              <h3 className="font-bold text-slate-50 mb-4 truncate pr-2" style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)' }}>{currentDungeon.name}</h3>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentDungeon.completedSessions / currentDungeon.totalSessions) * 100}%` }}
                  className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                />
              </div>
              <button 
                onClick={() => setActiveTab('explore')}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-slate-50 rounded-xl font-bold transition-all"
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
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-50 rounded-xl font-bold transition-colors"
              >
                {state.history.length === 0 ? "Start Your First Dungeon" : "Delve into Goal"}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Daily Progress</h3>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                <Clock size={10} className="text-indigo-400" />
                <span>SETTLEMENT: {settlementPeriod}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-slate-50">{state.dailySessions}</span>
              {(() => {
                const timezone = state.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
                const dateString = new Date().toLocaleString("en-US", { weekday: 'long', timeZone: timezone });
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const day = days.indexOf(dateString);
                
                const dailyGoal = state.useSameDailyProgressGoalEveryDay ?? true 
                  ? (state.dailyProgressGoal ?? 8) 
                  : (state.dailyProgressGoalConfig?.[day] ?? 8);
                return <span className="text-slate-500 text-xs">/ {dailyGoal} Sessions</span>;
              })()}
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
              {(() => {
                const timezone = state.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
                const dateString = new Date().toLocaleString("en-US", { weekday: 'long', timeZone: timezone });
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const day = days.indexOf(dateString);
                
                const dailyGoal = state.useSameDailyProgressGoalEveryDay ?? true 
                  ? (state.dailyProgressGoal ?? 8) 
                  : (state.dailyProgressGoalConfig?.[day] ?? 8);
                return (
                  <div 
                    className="h-full bg-emerald-500" 
                    style={{ width: `${Math.min((state.dailySessions / dailyGoal) * 100, 100)}%` }}
                  />
                );
              })()}
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

          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <BookOpen size={16} /> Guides
            </h3>
            <div className="space-y-2">
              <button onClick={() => openGuideBook(1)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 transition-colors border border-slate-800/50 text-xs text-slate-300">
                  <Compass size={16} className="text-sky-400" /> Sanctum Map Guide
              </button>
              <button onClick={() => openGuideBook(2)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 transition-colors border border-slate-800/50 text-xs text-slate-300">
                  <Package size={16} className="text-rose-400" /> Sanctum Items Guide
              </button>
              <button onClick={() => openGuideBook(3)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 transition-colors border border-slate-800/50 text-xs text-slate-300">
                  <Coins size={16} className="text-amber-400" /> Gold Coins Guide
              </button>
              <button onClick={() => openGuideBook(4)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 transition-colors border border-slate-800/50 text-xs text-slate-300">
                  <BookOpen size={16} className="text-emerald-400" /> XP & Leveling Guide
              </button>
              <button onClick={() => openGuideBook(5)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 transition-colors border border-slate-800/50 text-xs text-slate-300">
                  <Zap size={16} className="text-indigo-400" /> Talent System Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
