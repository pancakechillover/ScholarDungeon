import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Star, 
  StarHalf, 
  ChevronDown, 
  ChevronUp, 
  Trophy, 
  Coins, 
  Zap, 
  Sword, 
  Target, 
  ShoppingBag, 
  Package,
  Calendar,
  MessageSquare,
  ArrowRight,
  Download,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';
import { AppState, StudySession, RewardHistoryItem, Dungeon, MajorDungeon } from '../types';

import { createPortal } from 'react-dom';
import { useScrollLock } from '../hooks/useScrollLock';

interface DailySummaryModalProps {
  state: AppState;
  dungeons: Dungeon[];
  majorDungeons: MajorDungeon[];
  onClose: () => void;
  onNavigateToStats: () => void;
  onSave: (date: string, rating: number, reflection: string) => void;
}

export const DailySummaryModal: React.FC<DailySummaryModalProps> = ({ state, dungeons, majorDungeons, onClose, onNavigateToStats, onSave }) => {
  useScrollLock(true);
  const [rating, setRating] = useState(0);
  const [reflection, setReflection] = useState('');
  const [isStatsExpanded, setIsStatsExpanded] = useState(true);
  const [isMarkdownEnabled, setIsMarkdownEnabled] = useState(state.defaultMarkdownEnabled ?? true);

  const today = useMemo(() => {
    const ts = state.timeSettings || {
      morning: { start: 8, end: 12 },
      afternoon: { start: 14, end: 18 },
      night: { start: 20, end: 24 }
    };
    const now = new Date();
    const hour = now.getHours();
    
    // If night peak spans midnight and we are currently in that post-midnight block
    if (ts.night.start > ts.night.end && hour < ts.night.end) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString().split('T')[0];
    }
    // If we are before morning start, it's technically still yesterday's period
    if (hour < ts.morning.start) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString().split('T')[0];
    }
    return now.toISOString().split('T')[0];
  }, [state.timeSettings]);

  const dailyStats = useMemo(() => {
    const ts = state.timeSettings || {
      morning: { start: 8, end: 12 },
      afternoon: { start: 14, end: 18 },
      night: { start: 20, end: 24 }
    };

    const getAssignedDate = (date: Date) => {
      const hour = date.getHours();
      
      const peaks = [ts.morning, ts.afternoon, ts.night];
      
      // Night span midnight check
      if (ts.night.start > ts.night.end && hour < ts.night.end) {
        const yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
      }
      
      // Before morning start check
      if (hour < ts.morning.start) {
        const yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
      }

      return date.toISOString().split('T')[0];
    };

    const sessionsToday = state.history.filter(s => getAssignedDate(new Date(s.timestamp)) === today);
    const rewardsToday = state.rewardHistory.filter(r => getAssignedDate(new Date(r.timestamp)) === today);
    
    const goldEarned = sessionsToday.reduce((sum, s) => sum + s.coinsEarned, 0);
    const xpEarned = sessionsToday.reduce((sum, s) => sum + s.xpEarned, 0);
    
    const levelsGained = rewardsToday.filter(r => r.source === 'LevelUp').length;
    
    const highTierItems = rewardsToday.filter(r => 
      r.type === 'item' && (r.rarity === 'epic' || r.rarity === 'legendary')
    );

    const completedDungeonsCount = dungeons.filter(d => d.status === 'completed' && d.completedAt && getAssignedDate(new Date(d.completedAt)) === today).length;
    const completedMajorsCount = majorDungeons.filter(m => m.status === 'completed' && m.completedAt && getAssignedDate(new Date(m.completedAt)) === today).length;
    
    const questsCompletedToday = state.quests.filter(q => q.completed && !q.isAchievement && q.lastReset && getAssignedDate(new Date(q.lastReset)) === today).length;
    const achievementsCompletedToday = state.quests.filter(q => q.completed && q.isAchievement && q.lastReset && getAssignedDate(new Date(q.lastReset)) === today).length;

    const itemsBought = rewardsToday.filter(r => r.source === 'Shop');
    const itemsGacha = rewardsToday.filter(r => r.source === 'Gacha');

    return {
      sessions: sessionsToday.length,
      gold: goldEarned,
      xp: xpEarned,
      levels: levelsGained,
      highTier: highTierItems,
      streak: state.streak,
      dungeons: completedDungeonsCount + completedMajorsCount,
      quests: questsCompletedToday,
      achievements: achievementsCompletedToday,
      bought: itemsBought,
      gacha: itemsGacha
    };
  }, [state, today]);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFull = rating >= i;
      const isHalf = rating >= i - 0.5 && rating < i;
      
      stars.push(
        <button
          key={i}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x < rect.width / 2) {
              setRating(i - 0.5);
            } else {
              setRating(i);
            }
          }}
          className="text-amber-400 hover:scale-110 transition-transform"
        >
          {isFull ? <Star className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" /> : isHalf ? <StarHalf className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" /> : <Star className="w-8 h-8 sm:w-10 sm:h-10" />}
        </button>
      );
    }
    return stars;
  };

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto border-0 m-0"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-slate-900 border border-indigo-500/30 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden my-8 relative"
      >
        {/* Header */}
        <div className="p-5 sm:p-8 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-indigo-500/10 to-transparent">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase italic pr-1">End of the Day</h2>
            <p className="text-sm sm:text-base text-slate-400 font-medium">Reflect on your progress and rest for tomorrow.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white rounded-full hover:bg-slate-800 transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="p-5 sm:p-8 space-y-6 sm:space-y-8 max-h-[80vh] sm:max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Summary Stats */}
          <div className="space-y-4">
            <button 
              onClick={() => setIsStatsExpanded(!isStatsExpanded)}
              className="w-full flex items-center justify-between text-slate-500 hover:text-white transition-colors"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest">Today's Record</h3>
              {isStatsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <AnimatePresence>
              {isStatsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <StatCard icon={Sword} label="Sessions" value={dailyStats.sessions} color="text-indigo-400" />
                    <StatCard icon={Coins} label="Gold" value={dailyStats.gold} color="text-amber-400" />
                    <StatCard icon={Zap} label="XP" value={dailyStats.xp} color="text-emerald-400" />
                    {dailyStats.levels > 0 && <StatCard icon={Trophy} label="Levels" value={`+${dailyStats.levels}`} color="text-rose-400" />}
                    <StatCard icon={Calendar} label="Streak" value={`${dailyStats.streak} Days`} color="text-orange-400" />
                    {(dailyStats.quests > 0 || dailyStats.achievements > 0 || dailyStats.dungeons > 0) && (
                      <StatCard 
                        icon={Target} 
                        label="Completed" 
                        value={`${dailyStats.quests + dailyStats.achievements + dailyStats.dungeons}`} 
                        color="text-blue-400" 
                      />
                    )}
                  </div>

                  {/* High Tier Items & Purchases */}
                  <div className="mt-4 space-y-2">
                    {dailyStats.highTier.length > 0 && (
                      <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700 flex items-center gap-3">
                        <Package className="text-purple-400" size={18} />
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Legendary Finds</p>
                          <p className="text-sm text-white font-medium">{dailyStats.highTier.map(i => i.name).join(', ')}</p>
                        </div>
                      </div>
                    )}
                    {(dailyStats.bought.length > 0 || dailyStats.gacha.length > 0) && (
                      <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700 flex items-center gap-3">
                        <ShoppingBag className="text-amber-400" size={18} />
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Acquisitions</p>
                          <p className="text-sm text-white font-medium">
                            {[...dailyStats.bought, ...dailyStats.gacha].map(i => i.name).join(', ')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Efficiency Rating */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Efficiency Rating</h3>
            <div className="flex justify-center gap-1 sm:gap-2 p-4 sm:p-6 bg-slate-950/50 rounded-3xl border border-slate-800">
              {renderStars()}
            </div>
          </div>

          {/* Daily Reflection */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Daily Reflection</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMarkdownEnabled(!isMarkdownEnabled)}
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                      isMarkdownEnabled 
                        ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" 
                        : "bg-slate-800 text-slate-500 border border-slate-700"
                    )}
                  >
                    {isMarkdownEnabled ? <Eye size={12} /> : <EyeOff size={12} />}
                    <span>Markdown {isMarkdownEnabled ? 'On' : 'Off'}</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.txt,.md';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (re) => setReflection(re.target?.result as string);
                        reader.readAsText(file);
                      }
                    };
                    input.click();
                  }}
                  className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                  title="Import Reflection"
                >
                  <Upload size={16} />
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([reflection], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `reflection-${today}.md`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                  title="Export Reflection"
                >
                  <Download size={16} />
                </button>
                {isMarkdownEnabled && (
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest ml-2">Markdown Supported</span>
                )}
              </div>
            </div>
            <div className={cn(
              "grid gap-4 transition-all duration-300",
              isMarkdownEnabled ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            )}>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Write down your thoughts, achievements, or what you learned today..."
                className="w-full h-40 bg-slate-950 border border-slate-800 rounded-3xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all resize-none"
              />
              {isMarkdownEnabled && (
                <div className="w-full h-40 bg-slate-950/30 border border-slate-800/50 rounded-3xl p-4 overflow-y-auto custom-scrollbar">
                  {reflection ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <Markdown>{reflection}</Markdown>
                    </div>
                  ) : (
                    <p className="text-slate-600 text-sm italic pr-1">Preview will appear here...</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Encouragement */}
          <div className="text-center p-8 bg-indigo-500/5 rounded-3xl border border-indigo-500/10">
            <p className="text-indigo-400 font-bold italic pr-1 text-lg mb-1">Rest well, Seeker.</p>
            <p className="text-slate-500 text-sm">The dungeon will be waiting for your return tomorrow.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-8 bg-slate-950/50 border-t border-slate-800">
          <button
            onClick={() => {
              onSave(today, rating, reflection);
              onNavigateToStats();
            }}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
          >
            <span>View Full Record</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

const StatCard: React.FC<{ icon: any, label: string, value: string | number, color: string }> = ({ icon: Icon, label, value, color }) => (
  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex items-center gap-3">
    <div className={cn("p-2 rounded-xl bg-slate-900", color)}>
      <Icon size={18} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{label}</p>
      <p className="text-lg font-black text-white leading-none truncate">{value}</p>
    </div>
  </div>
);
