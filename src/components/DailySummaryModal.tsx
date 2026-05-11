import React, { useState, useMemo, useRef } from 'react';
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
  EyeOff,
  Clock,
  LayoutTemplate,
  Save,
  Maximize2,
  Minimize2,
  File,
  FileText,
  Indent,
  Sun,
  Cloud,
  CloudLightning,
  Flame,
  Coffee,
  Sparkles,
  Battery,
  BatteryLow,
  Brain,
  Heart,
  Ghost,
  Music,
  Gamepad2,
  Compass,
  Palette,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';
import { AppState, StudySession, RewardHistoryItem, Dungeon, MajorDungeon } from '../types';

import { createPortal } from 'react-dom';
import { useScrollLock } from '../hooks/useScrollLock';

const MOOD_OPTIONS = [
  { id: 'great', label: 'Great', icon: Sun, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
  { id: 'good', label: 'Good', icon: Smile, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
  { id: 'neutral', label: 'Okay', icon: Meh, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
  { id: 'bad', label: 'Bad', icon: Frown, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/30' },
  { id: 'awful', label: 'Awful', icon: CloudLightning, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
  { id: 'productive', label: 'Productive', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { id: 'tired', label: 'Tired', icon: BatteryLow, color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/30' },
  { id: 'inspired', label: 'Inspired', icon: Sparkles, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  { id: 'focused', label: 'Focused', icon: Brain, color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10', border: 'border-fuchsia-400/30' },
  { id: 'chill', label: 'Chill', icon: Coffee, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/30' },
];

interface DailySummaryModalProps {
  state: AppState;
  dungeons: Dungeon[];
  majorDungeons: MajorDungeon[];
  onClose: () => void;
  onNavigateToStats: () => void;
  onSave: (date: string, rating: number, reflection: string, mood?: string) => void;
  onUpdateState?: (update: Partial<AppState>) => void;
}

export const DailySummaryModal: React.FC<DailySummaryModalProps> = ({ state, dungeons, majorDungeons, onClose, onNavigateToStats, onSave, onUpdateState }) => {
  useScrollLock(true);
  const [rating, setRating] = useState(() => Number(localStorage.getItem('scholar_rating_draft')) || 0);
  const [reflection, setReflection] = useState(() => localStorage.getItem('scholar_reflection_draft') || '');
  const [mood, setMood] = useState(() => localStorage.getItem('scholar_mood_draft') || '');
  const [isStatsExpanded, setIsStatsExpanded] = useState(true);
  const [isMarkdownEnabled, setIsMarkdownEnabled] = useState(state.defaultMarkdownEnabled ?? true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [templateMode, setTemplateMode] = useState<'empty' | 'example'>('empty');
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const immersiveTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (format: 'bold' | 'italic' | 'underline' | 'indent') => {
    const textarea = immersiveTextAreaRef.current;
    if (!textarea) return;

    if (format === 'indent') {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start === undefined || end === undefined) return;

      const lines = reflection.split('\n');
      // basic fallback if we want to indent selected lines
      // but simpler: just prepend '- '
      const newText = reflection.substring(0, start) + '- ' + reflection.substring(end);
      setReflection(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === undefined || end === undefined) return;
    
    // if no text is selected, just append empty tags at cursor
    const selectedText = reflection.substring(start, end);
    let replacement = '';
    let offset = 0;

    if (format === 'bold') {
      replacement = `**${selectedText}**`;
      offset = selectedText.length ? 4 : 2;
    } else if (format === 'italic') {
      replacement = `*${selectedText}*`;
      offset = selectedText.length ? 2 : 1;
    } else if (format === 'underline') {
      replacement = `<u>${selectedText}</u>`;
      offset = selectedText.length ? 7 : 3;
    }

    const newText = reflection.substring(0, start) + replacement + reflection.substring(end);
    setReflection(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        selectedText ? start : start + offset, 
        selectedText ? start + replacement.length : start + offset
      );
    }, 0);
  };

  const renderTemplateControls = () => (
    <div className="relative flex items-center gap-0 h-[26px]">
      <button
        onClick={() => setShowTemplates(!showTemplates)}
        className={cn(
          "flex items-center justify-center gap-1.5 h-full px-2 rounded-l-lg text-[10px] font-bold uppercase tracking-wider transition-all border-r-0",
          showTemplates 
            ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" 
            : "bg-slate-800 text-slate-500 border border-slate-700 hover:bg-slate-700"
        )}
      >
        <LayoutTemplate size={12} />
        <span>Templates</span>
      </button>
      <button
        onClick={() => setTemplateMode('empty')}
        className={cn(
          "flex items-center gap-1.5 h-full px-2 border border-slate-700 border-l-0 transition-colors text-[10px] font-bold uppercase tracking-wider",
          templateMode === 'empty' 
            ? "bg-indigo-500/20 text-indigo-400" 
            : "bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-white"
        )}
        title="Blank Template Mode: Load and save templates without examples"
      >
        <File size={12} />
        <span>Blank</span>
      </button>
      <button
        onClick={() => setTemplateMode('example')}
        className={cn(
          "flex items-center gap-1.5 h-full px-2 border border-slate-700 border-l-0 rounded-r-lg transition-colors text-[10px] font-bold uppercase tracking-wider",
          templateMode === 'example' 
            ? "bg-indigo-500/20 text-indigo-400" 
            : "bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-white"
        )}
        title="Example Template Mode: Load and save templates with examples"
      >
        <FileText size={12} />
        <span>Example</span>
      </button>

      {/* Templates Dropdown */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 sm:left-0 sm:right-auto top-full mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-2 space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
              {state.reflectionTemplates?.map((template) => (
                <div key={template.id} className="group relative">
                  {templateToDelete === template.id ? (
                    <div className="flex items-center justify-between w-full px-3 py-2 bg-rose-500/10 rounded-xl">
                      <span className="text-xs text-rose-400 font-medium">Delete {template.name}?</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            if (onUpdateState) {
                              onUpdateState({
                                reflectionTemplates: state.reflectionTemplates?.filter(t => t.id !== template.id)
                              });
                            }
                            setTemplateToDelete(null);
                          }}
                          className="px-2 py-1 bg-rose-500/20 text-rose-400 rounded hover:bg-rose-500/30 text-[10px] font-bold"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setTemplateToDelete(null)}
                          className="px-2 py-1 bg-slate-800 text-slate-400 rounded hover:bg-slate-700 text-[10px] font-bold"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          if (templateMode === 'example' && template.exampleContent) {
                            setReflection(template.exampleContent);
                          } else {
                            setReflection(template.content);
                          }
                          setShowTemplates(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors pr-8"
                      >
                        {template.name}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTemplateToDelete(template.id);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-all"
                        title="Delete Template"
                      >
                        <X size={12} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-slate-800 bg-slate-950/50">
              {isSavingTemplate ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="Template name..."
                    className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTemplateName.trim()) {
                        if (onUpdateState) {
                          const templates = [...(state.reflectionTemplates || [])];
                          const existingIndex = templates.findIndex(t => t.name.toLowerCase() === newTemplateName.trim().toLowerCase());
                          
                          if (existingIndex >= 0) {
                            if (templateMode === 'example') {
                              templates[existingIndex] = { ...templates[existingIndex], exampleContent: reflection };
                            } else {
                              templates[existingIndex] = { ...templates[existingIndex], content: reflection };
                            }
                          } else {
                            templates.push({
                              id: `user-${Date.now()}`,
                              name: newTemplateName.trim(),
                              content: templateMode === 'empty' ? reflection : '',
                              exampleContent: templateMode === 'example' ? reflection : ''
                            });
                          }
                          
                          onUpdateState({ reflectionTemplates: templates });
                        }
                        setNewTemplateName('');
                        setIsSavingTemplate(false);
                      } else if (e.key === 'Escape') {
                        setIsSavingTemplate(false);
                      }
                    }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!reflection.trim()) return;
                    setIsSavingTemplate(true);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 rounded-xl text-xs font-bold transition-all"
                >
                  <Save size={12} />
                  <span>Save as {templateMode === 'example' ? 'Example' : 'Blank'} Template</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  React.useEffect(() => {
    localStorage.setItem('scholar_reflection_draft', reflection);
  }, [reflection]);

  React.useEffect(() => {
    localStorage.setItem('scholar_rating_draft', rating.toString());
  }, [rating]);

  React.useEffect(() => {
    if (mood) localStorage.setItem('scholar_mood_draft', mood);
    else localStorage.removeItem('scholar_mood_draft');
  }, [mood]);

  const today = useMemo(() => {
    const ts = state.timeSettings || {
      morning: { start: 8, end: 12 },
      afternoon: { start: 14, end: 18 },
      night: { start: 20, end: 24 }
    };

    const timezone = state.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    let now = new Date();
    if (state.timezone) {
      try {
        const str = now.toLocaleString('en-US', { timeZone: state.timezone });
        now = new Date(str);
      } catch (e) {
        console.error("Timezone error:", e);
      }
    }

    const currentHour = now.getHours();

    // Start with today's morning
    let startDate = new Date(now);
    startDate.setHours(ts.morning.start, 0, 0, 0);

    let endDate = new Date(now);
    
    // If the night block spans midnight, the 'end' date needs to be the next day relative to the morning start.
    let nightEndHour = ts.night.end;
    let daysToadd = 0;
    if (ts.night.end < ts.night.start) {
        nightEndHour = ts.night.end;
        daysToadd = 1;
    } else if (ts.night.end === 24) {
        nightEndHour = 0;
        daysToadd = 1;
    }
    
    endDate.setHours(nightEndHour, 0, 0, 0);
    endDate.setDate(endDate.getDate() + daysToadd);

    // If we are currently before the morning start, we belong to the previous day's settlement period
    if (currentHour < ts.morning.start) {
        startDate.setDate(startDate.getDate() - 1);
        endDate.setDate(endDate.getDate() - 1);
    }

    const formatDate = (d: Date, is24: boolean = false) => {
      if (is24) {
        const prev = new Date(d);
        prev.setDate(prev.getDate() - 1);
        const mo = (prev.getMonth() + 1).toString().padStart(2, '0');
        const da = prev.getDate().toString().padStart(2, '0');
        const m = d.getMinutes().toString().padStart(2, '0');
        return `${mo}/${da} 24:${m}`;
      }
      const mo = (d.getMonth() + 1).toString().padStart(2, '0');
      const da = d.getDate().toString().padStart(2, '0');
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      return `${mo}/${da} ${h}:${m}`;
    };

    return {
      dateString: startDate.toISOString().split('T')[0],
      settlementPeriod: `${formatDate(startDate)} - ${formatDate(endDate, ts.night.end === 24)}`
    };
  }, [state.timeSettings, state.timezone]);

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

    const sessionsToday = state.history.filter(s => getAssignedDate(new Date(s.timestamp)) === today.dateString);
    const rewardsToday = state.rewardHistory.filter(r => getAssignedDate(new Date(r.timestamp)) === today.dateString);
    
    const goldEarned = sessionsToday.reduce((sum, s) => sum + s.coinsEarned, 0);
    const xpEarned = sessionsToday.reduce((sum, s) => sum + s.xpEarned, 0);
    
    const levelsGained = rewardsToday.filter(r => r.source === 'LevelUp').length;
    
    const highTierItems = rewardsToday.filter(r => 
      r.type === 'item' && (r.rarity === 'epic' || r.rarity === 'legendary')
    );

    const completedDungeonsCount = dungeons.filter(d => d.status === 'completed' && d.completedAt && getAssignedDate(new Date(d.completedAt)) === today.dateString).length;
    const completedMajorsCount = majorDungeons.filter(m => m.status === 'completed' && m.completedAt && getAssignedDate(new Date(m.completedAt)) === today.dateString).length;
    
    const questsCompletedToday = state.quests.filter(q => q.completed && !q.isAchievement && q.lastReset && getAssignedDate(new Date(q.lastReset)) === today.dateString).length;
    const achievementsCompletedToday = state.quests.filter(q => q.completed && q.isAchievement && q.lastReset && getAssignedDate(new Date(q.lastReset)) === today.dateString).length;

    const itemsBought = rewardsToday.filter(r => r.source === 'Shop');
    const itemsGacha = rewardsToday.filter(r => r.source === 'Gacha');

    const timezone = state.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dateStr = new Date().toLocaleString("en-US", { weekday: 'long', timeZone: timezone });
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days.indexOf(dateStr);
    
    const dailyGoal = state.useSameDailyProgressGoalEveryDay ?? true 
      ? (state.dailyProgressGoal ?? 8) 
      : (state.dailyProgressGoalConfig?.[day] ?? 8);

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
      gacha: itemsGacha,
      dailyGoal
    };
  }, [state, today.dateString, dungeons, majorDungeons]);

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
          {/* Daily Progress */}
          <div className="bg-slate-950/50 rounded-3xl border border-slate-800 p-5 sm:p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">Daily Progress</h3>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 bg-slate-800/50 rounded-lg border border-slate-700/50 inline-flex">
                <Clock size={10} className="text-indigo-400" />
                <span className="text-slate-500/80">SETTLEMENT:</span>
                <span className="text-slate-400 font-semibold">{today.settlementPeriod}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-slate-50">{dailyStats.sessions}</span>
              <span className="text-slate-500 text-xs">/ {dailyStats.dailyGoal} Sessions</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-all" 
                style={{ width: `${Math.min((dailyStats.sessions / dailyStats.dailyGoal) * 100, 100)}%` }}
              />
            </div>
          </div>

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

          {/* Mood Selection */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">How did you feel today?</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {MOOD_OPTIONS.map((m) => {
                const isSelected = mood === m.id;
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMood(isSelected ? '' : m.id)}
                    className={cn(
                      "flex flex-col items-center justify-center min-w-[72px] p-3 rounded-2xl border transition-all pointer-events-auto",
                      isSelected 
                        ? `${m.bg} ${m.border} ${m.color} scale-105 shadow-lg` 
                        : "bg-slate-950/50 border-slate-800 text-slate-500 hover:bg-slate-800 hover:border-slate-700"
                    )}
                  >
                    <Icon size={24} className="mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{m.label}</span>
                  </button>
                );
              })}
            </div>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest shrink-0">Daily Reflection</h3>
              <div className="flex flex-wrap items-center gap-2">
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
                  <span>MD {isMarkdownEnabled ? 'On' : 'Off'}</span>
                </button>
                
                <div className="relative flex items-center gap-0 h-[26px]">
                  {renderTemplateControls()}
                </div>

                <button
                  onClick={() => setIsImmersiveMode(true)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20"
                >
                  <Maximize2 size={12} />
                  <span>Immersive</span>
                </button>

                <div className="flex items-center gap-0.5 border-l border-slate-700 pl-2 ml-1">
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
                    className="p-1 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                    title="Import Reflection"
                  >
                    <Upload size={14} />
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([reflection], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `reflection-${today.dateString}.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="p-1 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                    title="Export Reflection"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Split Markdown Pane (Regular Modal View) */}
            <div className={cn(
              "grid gap-4 transition-all duration-300",
              isMarkdownEnabled ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            )}>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Write down your thoughts, achievements, or what you learned today..."
                className="w-full min-h-[160px] bg-slate-950 border border-slate-800 rounded-3xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all resize-y"
              />
              {isMarkdownEnabled && (
                <div className="w-full min-h-[160px] bg-slate-950/30 border border-slate-800/50 rounded-3xl p-4 overflow-y-auto custom-scrollbar">
                  {reflection ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-slate-200">
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
              localStorage.removeItem('scholar_reflection_draft');
              localStorage.removeItem('scholar_rating_draft');
              localStorage.removeItem('scholar_mood_draft');
              onSave(today.dateString, rating, reflection, mood);
              onNavigateToStats();
            }}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
          >
            <span>Save & Rest</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  const immersiveContent = (
    <AnimatePresence>
      {isImmersiveMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-slate-950 flex flex-col m-0 p-0"
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest italic pr-1">Immersive Reflection</h3>
              
              {/* Format Controls */}
              <div className="hidden sm:flex items-center gap-1 border-l border-slate-700 pl-4">
                <button onClick={() => applyFormat('bold')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Bold">
                  <strong className="font-serif">B</strong>
                </button>
                <button onClick={() => applyFormat('italic')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors italic" title="Italic">
                  <em className="font-serif">I</em>
                </button>
                <button onClick={() => applyFormat('underline')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors underline" title="Underline">
                  <span className="font-serif">U</span>
                </button>
                <button onClick={() => applyFormat('indent')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Indent / List">
                  <Indent size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                {renderTemplateControls()}
              </div>
              <button
                onClick={() => setIsMarkdownEnabled(!isMarkdownEnabled)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                  isMarkdownEnabled 
                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" 
                    : "bg-slate-800 text-slate-500 border border-slate-700"
                )}
              >
                {isMarkdownEnabled ? <Eye size={14} /> : <EyeOff size={14} />}
                <span>Markdown {isMarkdownEnabled ? 'On' : 'Off'}</span>
              </button>
              <button 
                onClick={() => setIsImmersiveMode(false)} 
                className="p-2 text-slate-500 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                title="Exit Immersive Mode"
              >
                <Minimize2 size={20} />
              </button>
            </div>
          </div>
          <div className={cn("flex-1 flex overflow-hidden", isMarkdownEnabled ? "flex-col md:flex-row" : "flex-col")}>
            <textarea
              ref={immersiveTextAreaRef}
              className="flex-1 p-6 sm:p-8 bg-slate-950 text-slate-200 text-base md:text-lg leading-relaxed focus:outline-none resize-none border-r border-slate-800/50 custom-scrollbar"
              placeholder="Write your reflection..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              autoFocus
            />
            {isMarkdownEnabled && (
              <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-slate-950/50 custom-scrollbar">
                {reflection ? (
                  <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-slate-200">
                    <Markdown>{reflection}</Markdown>
                  </div>
                ) : (
                  <p className="text-slate-600 italic lg:text-lg">Preview will appear here...</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(
    <>
      {modalContent}
      {immersiveContent}
    </>, 
    document.body
  );
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
