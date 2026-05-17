import React, { useState, useRef, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  format, eachDayOfInterval, isSameDay, 
  startOfWeek, endOfWeek, subDays, addDays, subWeeks, addWeeks,
  startOfMonth, endOfMonth, startOfYear, endOfYear, addMonths, subMonths, addYears, subYears,
  parseISO, isWithinInterval
} from 'date-fns';
import { StudySession, AppState, RewardHistoryItem, Dungeon, MajorDungeon } from '../types';
import { cn } from '../lib/utils';
import { 
  BarChart2, Zap, Coins, ChevronLeft, ChevronRight, ChevronDown, Calendar, Star, StarHalf, Edit2, Save, X, Eye, EyeOff, LineChart as LineChartIcon, Trophy, Sword, Heart, Maximize2, Minimize2, LayoutTemplate, File, FileText, RotateCcw
} from 'lucide-react';
import { MOOD_OPTIONS, DEFAULT_ENABLED_MOODS } from '../constants';

import { motion, AnimatePresence } from 'motion/react';
import { PageHeader } from './PageHeader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend, LineChart, Line, CartesianGrid, LabelList } from 'recharts';
import Markdown from 'react-markdown';
import { ImmersiveReflectionModal } from './ImmersiveReflectionModal';
import { DailySessionsModal } from './DailySessionsModal';
import { RoutineTracker } from './RoutineTracker';

interface StatsProps {
  state: AppState;
  saveDailyLog: (date: string, rating: number, reflection: string, mood?: string) => void;
  onUpdateState?: (updates: Partial<AppState>) => void;
  updateSession?: (id: string, updates: Partial<StudySession>) => void;
  deleteSession?: (id: string) => void;
  dungeons?: Dungeon[];
  majorDungeons?: MajorDungeon[];
}

const SharedPopoverContent = ({
  label,
  totalSessions,
  morning,
  afternoon,
  night,
  other,
  coins,
  xp,
  efficiency,
  mood,
  dateTimestamp,
  period
}: any) => {
  const moodObj = mood ? MOOD_OPTIONS.find(m => m.id === mood) : null;
  const MoodIcon = moodObj ? moodObj.icon : null;

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 shadow-xl shadow-indigo-500/10 rounded-xl p-3 sm:p-4 z-[100] w-[180px] sm:w-[200px]">
      <p className="text-slate-50 font-bold mb-2 pb-2 border-b border-slate-800/50 text-[13px] sm:text-sm">{label}</p>
      <div className="space-y-1.5 text-xs text-slate-300">
        {totalSessions > 0 ? (
          <>
            <div className="flex justify-between gap-4"><span className="text-slate-500">Sessions</span> <span className="text-slate-50 font-bold">{totalSessions}</span></div>
            {morning > 0 && <div className="flex justify-between gap-4"><span className="text-amber-400">Morning</span> <span className="text-slate-200">{morning}</span></div>}
            {afternoon > 0 && <div className="flex justify-between gap-4"><span className="text-orange-400">Afternoon</span> <span className="text-slate-200">{afternoon}</span></div>}
            {night > 0 && <div className="flex justify-between gap-4"><span className="text-indigo-400">Night</span> <span className="text-slate-200">{night}</span></div>}
            {other > 0 && <div className="flex justify-between gap-4"><span className="text-slate-400">Other</span> <span className="text-slate-200">{other}</span></div>}
            <div className="border-t border-slate-800/50 my-1 pt-1 flex justify-between gap-4"><span className="text-yellow-400">Gold</span> <span className="text-slate-200">+{coins}</span></div>
            <div className="flex justify-between gap-4"><span className="text-cyan-400">XP</span> <span className="text-slate-200">+{xp}</span></div>
          </>
        ) : (
          <p className="text-slate-500 italic">No activity</p>
        )}
        
        {efficiency !== undefined && efficiency !== null && (
          <div className="flex justify-between gap-4 pt-1"><span className="text-indigo-400">Efficiency</span> <span className="text-slate-50 font-bold">{efficiency}</span></div>
        )}

        {moodObj && MoodIcon && (
          <div className="border-t border-slate-800/50 pt-1.5 mt-1.5 flex items-center justify-between gap-2">
            <span className="text-slate-500">Mood</span>
            <div className="flex items-center gap-1"><MoodIcon size={14} className={moodObj.color} /> <span className="font-medium text-slate-200">{moodObj.label}</span></div>
          </div>
        )}

        {dateTimestamp && (
          <div className="mt-4 pt-2 border-t border-slate-800/50 space-y-2">
            <button 
              type="button"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => { 
                e.stopPropagation(); 
                window.dispatchEvent(new CustomEvent('statsShowDailySessionsModal', { 
                  detail: { timestamp: dateTimestamp, period: period || 'total' }
                })); 
              }}
              className="w-full text-emerald-400 hover:text-emerald-300 font-medium text-center transition-colors hover:bg-slate-800/30 rounded px-2 py-1 flex items-center justify-center gap-1.5"
            >
              <LayoutTemplate size={12} />
              <span>Show Daily Sessions</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Moved outside to avoid redefining on every render, which causes extreme lag
const CustomWeeklyTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <SharedPopoverContent 
        label={data.fullDate || label}
        totalSessions={data.total}
        morning={data.Morning}
        afternoon={data.Afternoon}
        night={data.Night}
        other={data.Other}
        coins={data.coins}
        xp={data.xp}
        efficiency={data.efficiency}
        mood={data.mood}
        dateTimestamp={data.timestamp}
      />
    );
  }
  return null;
};

const CustomDailyTooltip = ({ active, payload, label, dateTimestamp }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 shadow-xl shadow-indigo-500/10 rounded-xl p-3 z-50 min-w-[120px]">
        <p className="text-slate-50 font-bold mb-1.5 pb-1.5 border-b border-slate-800/50">{label}</p>
        <div className="flex justify-between gap-4 text-xs mb-3">
          <span className="text-slate-400">Sessions</span>
          <span className="text-indigo-400 font-bold">{data.sessions}</span>
        </div>
        {dateTimestamp && (
          <div className="flex flex-col gap-1.5 pt-1.5 border-t border-slate-800/50">
            <button 
              type="button"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => { 
                e.stopPropagation(); 
                window.dispatchEvent(new CustomEvent('statsShowDailySessionsModal', { 
                  detail: { timestamp: dateTimestamp, period: data.periodKey } 
                })); 
              }}
              className="w-full text-emerald-400 hover:text-emerald-300 font-bold text-[10px] uppercase tracking-wider text-center transition-colors hover:bg-slate-800/30 rounded py-1 flex items-center justify-center gap-1"
            >
              <LayoutTemplate size={10} />
              Sessions
            </button>
          </div>
        )}
      </div>
    );
  }
  return null;
};


export const Stats = React.memo<StatsProps>(({ state, saveDailyLog, onUpdateState, updateSession, deleteSession, dungeons = [], majorDungeons = [] }) => {
  const history = state.history;
  const dailyLogs = state.dailyLogs || {};
  const [showDailySessionsDate, setShowDailySessionsDate] = useState<Date | null>(null);
  const [showDailySessionsPeriod, setShowDailySessionsPeriod] = useState<string | undefined>();
  
  const getInitialPeakDate = () => {
    const ts = state.timeSettings || {
      morning: { start: 8, end: 12 },
      afternoon: { start: 14, end: 18 },
      night: { start: 20, end: 24 }
    };
    
    let now = new Date();
    if (state.timezone) {
      try {
        const str = now.toLocaleString('en-US', { timeZone: state.timezone });
        now = new Date(str);
      } catch (e) {
        console.error("Timezone error:", e);
      }
    }
    
    const hour = now.getHours();
    
    if (ts.night.start > ts.night.end && hour < ts.night.end) {
      return subDays(now, 1);
    } else if (hour < ts.morning.start) {
      return subDays(now, 1);
    }
    return now;
  };

  const [dailyDate, setDailyDate] = useState(getInitialPeakDate());
  const [weeklyDate, setWeeklyDate] = useState(getInitialPeakDate());
  const [weeklyMode, setWeeklyMode] = useState<'calendar' | 'rolling'>('calendar');
  const [heatmapMode, setHeatmapMode] = useState<'30days' | 'month' | 'year'>('30days');
  const [heatmapMetric, setHeatmapMetric] = useState<'time' | 'efficiency'>('time');
  const [selectedHeatmapDate, setSelectedHeatmapDate] = useState<number | null>(null);

  const [chartKeys, setChartKeys] = useState({
    daily: Date.now(),
    weeklyBar: Date.now() + 1,
    weeklyLine: Date.now() + 2
  });

  const handleChartClick = (chartState: any, chart: 'daily' | 'weeklyBar' | 'weeklyLine') => {
    // If no active payload, we clicked empty space - reset ALL keys including current one
    const isEmptyClick = !chartState || !chartState.activePayload || chartState.activePayload.length === 0;

    setChartKeys(prev => ({
      daily: (chart === 'daily' && !isEmptyClick) ? prev.daily : Date.now() + Math.random(),
      weeklyBar: (chart === 'weeklyBar' && !isEmptyClick) ? prev.weeklyBar : Date.now() + Math.random(),
      weeklyLine: (chart === 'weeklyLine' && !isEmptyClick) ? prev.weeklyLine : Date.now() + Math.random()
    }));
  };

  const [isEditingLog, setIsEditingLog] = useState(false);
  const [isFullscreenEdit, setIsFullscreenEdit] = useState(false);
  const [editRating, setEditRating] = useState(0);
  const [editReflection, setEditReflection] = useState('');
  const [editMood, setEditMood] = useState<string | undefined>();
  const [isMarkdownPreview, setIsMarkdownPreview] = useState(true);

  // Refs for auto-save on unmount and stale closures in effects
  const editRatingRef = useRef(editRating);
  const editReflectionRef = useRef(editReflection);
  const editMoodRef = useRef(editMood);
  const isEditingLogRef = useRef(isEditingLog);
  const dailyDateRef = useRef(dailyDate);
  const saveDailyLogRef = useRef(saveDailyLog);

  useEffect(() => {
    editRatingRef.current = editRating;
    editReflectionRef.current = editReflection;
    editMoodRef.current = editMood;
    isEditingLogRef.current = isEditingLog;
    dailyDateRef.current = dailyDate;
    saveDailyLogRef.current = saveDailyLog;
  }, [editRating, editReflection, editMood, isEditingLog, dailyDate, saveDailyLog]);

  useEffect(() => {
    let dismissalTimeout: any = null;

    const handleOutsideInteraction = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Element;
      
      const inHeatmap = !!target.closest('.heatmap-cell-container');
      const inTooltip = !!target.closest('.recharts-tooltip-wrapper') || !!target.closest('.recharts-tooltip-portal');
      const isDataPoint = !!target.closest('.recharts-bar-rectangle') || 
                          !!target.closest('.recharts-dot') || 
                          !!target.closest('.recharts-active-dot') ||
                          !!target.closest('.recharts-sector') ||
                          !!target.closest('.recharts-rectangle');
      
      const isChart = !!target.closest('.recharts-wrapper') || !!target.closest('.recharts-responsive-container');
      
      if (dismissalTimeout) clearTimeout(dismissalTimeout);

      dismissalTimeout = setTimeout(() => {
        if (!inHeatmap) {
          setSelectedHeatmapDate(prev => prev !== null ? null : prev);
        }
        
        if (!inTooltip && (!isChart || (isChart && !isDataPoint))) {
          const tooltips = document.querySelectorAll('.recharts-tooltip-wrapper');
          tooltips.forEach(t => {
            (t as HTMLElement).style.visibility = 'hidden';
            (t as HTMLElement).style.opacity = '0';
          });
        }
      }, 50);
    };

    document.addEventListener('click', handleOutsideInteraction, { capture: true });
    document.addEventListener('touchstart', handleOutsideInteraction, { passive: true, capture: true });

    const handleJump = (e: any) => {
      // Use refs to avoid stale closure in effect
      if (isEditingLogRef.current) {
        saveDailyLogRef.current(format(dailyDateRef.current, 'yyyy-MM-dd'), editRatingRef.current, editReflectionRef.current, editMoodRef.current);
        setIsEditingLog(false);
      }
      setDailyDate(new Date(e.detail));
      setSelectedHeatmapDate(null);
      setChartKeys({
        daily: Date.now() + Math.random(),
        weeklyBar: Date.now() + Math.random(),
        weeklyLine: Date.now() + Math.random()
      });
      document.getElementById('daily-activity-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleShowSessions = (e: any) => {
      const { timestamp, period } = typeof e.detail === 'object' ? e.detail : { timestamp: e.detail, period: undefined };
      setShowDailySessionsDate(new Date(timestamp));
      setShowDailySessionsPeriod(period);
    };

    window.addEventListener('statsNavJump', handleJump);
    window.addEventListener('statsShowDailySessionsModal', handleShowSessions);

    return () => {
      if (dismissalTimeout) clearTimeout(dismissalTimeout);
      document.removeEventListener('click', handleOutsideInteraction, { capture: true });
      document.removeEventListener('touchstart', handleOutsideInteraction, { capture: true });
      window.removeEventListener('statsNavJump', handleJump);
      window.removeEventListener('statsShowDailySessionsModal', handleShowSessions);
      
      // AUTO-SAVE ON UNMOUNT (e.g. switching views)
      if (isEditingLogRef.current) {
        saveDailyLogRef.current(format(dailyDateRef.current, 'yyyy-MM-dd'), editRatingRef.current, editReflectionRef.current, editMoodRef.current);
      }
    };
  }, []);

  const renderHeatmapPopover = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = dailyLogs[dateStr];
    const daySessions = getSessionsForDate(date);
    const dayRewards = getRewardsForDate(date);
    const coins = daySessions.reduce((acc, s) => acc + s.coinsEarned, 0) + 
                  dayRewards.filter(r => r.type === 'coins').reduce((acc, r) => acc + (r.amount || 0), 0);
    const xp = daySessions.reduce((acc, s) => acc + s.xpEarned, 0) + 
               dayRewards.filter(r => r.type === 'xp').reduce((acc, r) => acc + (r.amount || 0), 0);
    
    const counts = { Morning: 0, Afternoon: 0, Night: 0, Other: 0 };
    daySessions.forEach(s => {
      const p = s.period || getPeriod(new Date(s.timestamp));
      if (p in counts) {
        counts[p as keyof typeof counts]++;
      } else {
        counts.Other++;
      }
    });

    return (
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-auto z-[100]">
        <SharedPopoverContent 
            label={format(date, 'EEE, MMM d, yyyy')}
            totalSessions={daySessions.length}
            morning={counts.Morning}
            afternoon={counts.Afternoon}
            night={counts.Night}
            other={counts.Other}
            coins={coins}
            xp={xp}
            efficiency={log?.rating}
            mood={log?.mood}
            dateTimestamp={date.getTime()}
        />
      </div>
    );
  };
  const [heatmapDate, setHeatmapDate] = useState(getInitialPeakDate());

  const [showTemplates, setShowTemplates] = useState(false);
  const [templateMode, setTemplateMode] = useState<'empty' | 'example'>('empty');
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

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
            className="absolute left-0 sm:right-auto top-full mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
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
                            setEditReflection(template.exampleContent);
                          } else {
                            setEditReflection(template.content);
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
                              templates[existingIndex] = { ...templates[existingIndex], exampleContent: editReflection };
                            } else {
                              templates[existingIndex] = { ...templates[existingIndex], content: editReflection };
                            }
                          } else {
                            templates.push({
                              id: `user-${Date.now()}`,
                              name: newTemplateName.trim(),
                              content: templateMode === 'empty' ? editReflection : '',
                              exampleContent: templateMode === 'example' ? editReflection : ''
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
                    if (!editReflection.trim()) return;
                    setIsSavingTemplate(true);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 rounded-xl text-xs font-bold transition-all"
                >
                  <Save size={12} />
                  <span>Save as {templateMode === 'example' ? 'Example' : 'Blank'}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const handleDailyDateChange = (newDate: Date) => {
    if (isEditingLog) {
      saveDailyLog(dailyDateStr, editRating, editReflection, editMood);
      setIsEditingLog(false);
    }
    setDailyDate(newDate);
  };

  const dailyDateStr = format(dailyDate, 'yyyy-MM-dd');
  const currentLog = dailyLogs[dailyDateStr];

  const startEditing = () => {
    setEditRating(currentLog?.rating || 0);
    setEditReflection(currentLog?.reflection || '');
    setEditMood(currentLog?.mood);
    setIsEditingLog(true);
  };

  const saveLog = () => {
    saveDailyLog(dailyDateStr, editRating, editReflection, editMood);
    setIsEditingLog(false);
  };

  const dailyInputRef = useRef<HTMLInputElement>(null);
  const weeklyInputRef = useRef<HTMLInputElement>(null);
  const heatmapInputRef = useRef<HTMLInputElement>(null);

  // --- Date Range Calculations ---
  const weekStart = weeklyMode === 'calendar' 
    ? startOfWeek(weeklyDate, { weekStartsOn: 1 })
    : subDays(weeklyDate, 6);
  const weekEnd = weeklyMode === 'calendar'
    ? endOfWeek(weeklyDate, { weekStartsOn: 1 })
    : weeklyDate;

  const ts = state.timeSettings || {
    morning: { start: 8, end: 12 },
    afternoon: { start: 14, end: 18 },
    night: { start: 20, end: 24 }
  };

  const getPeriodInfo = (date: Date) => {
    let localDate = new Date(date);
    if (state.timezone) {
      try {
        const str = date.toLocaleString('en-US', { timeZone: state.timezone });
        localDate = new Date(str);
      } catch (e) {}
    }
    const hour = localDate.getHours();
    
    // Morning
    if (ts.morning.start > ts.morning.end) {
      if (hour >= ts.morning.start) return { period: 'Morning', assignedDate: localDate };
      if (hour < ts.morning.end) return { period: 'Morning', assignedDate: subDays(localDate, 1) };
    } else if (hour >= ts.morning.start && hour < ts.morning.end) {
      return { period: 'Morning', assignedDate: localDate };
    }
    
    // Afternoon
    if (ts.afternoon.start > ts.afternoon.end) {
      if (hour >= ts.afternoon.start) return { period: 'Afternoon', assignedDate: localDate };
      if (hour < ts.afternoon.end) return { period: 'Afternoon', assignedDate: subDays(localDate, 1) };
    } else if (hour >= ts.afternoon.start && hour < ts.afternoon.end) {
      return { period: 'Afternoon', assignedDate: localDate };
    }

    // Night
    if (ts.night.start > ts.night.end) {
      if (hour >= ts.night.start) return { period: 'Night', assignedDate: localDate };
      if (hour < ts.night.end) return { period: 'Night', assignedDate: subDays(localDate, 1) };
    } else if (hour >= ts.night.start && hour < ts.night.end) {
      return { period: 'Night', assignedDate: localDate };
    }

    // Other (fallback based on day-reset hour)
    const resetHour = ts.night.end;
    if (hour < resetHour) {
      return { period: 'Other', assignedDate: subDays(localDate, 1) };
    }
    
    return { period: 'Other', assignedDate: localDate };
  };

  const processedHistory = useMemo(() => {
    return history.map(s => {
      const info = getPeriodInfo(new Date(s.timestamp));
      return {
        ...s,
        assignedDate: info.assignedDate,
        assignedDateStr: format(info.assignedDate, 'yyyy-MM-dd'),
        period: info.period
      };
    });
  }, [history, state.timezone, state.timeSettings]);

  const processedRewards = useMemo(() => {
    return (state.rewardHistory || []).map(r => {
      const info = getPeriodInfo(new Date(r.timestamp));
      return {
        ...r,
        assignedDate: info.assignedDate,
        assignedDateStr: format(info.assignedDate, 'yyyy-MM-dd'),
      };
    });
  }, [state.rewardHistory, state.timezone, state.timeSettings]);

  const sessionsByDateStr = useMemo(() => {
    const map: Record<string, typeof processedHistory> = {};
    processedHistory.forEach(s => {
      if (!map[s.assignedDateStr]) map[s.assignedDateStr] = [];
      map[s.assignedDateStr].push(s);
    });
    return map;
  }, [processedHistory]);

  const rewardsByDateStr = useMemo(() => {
    const map: Record<string, typeof processedRewards> = {};
    processedRewards.forEach(r => {
      if (!map[r.assignedDateStr]) map[r.assignedDateStr] = [];
      map[r.assignedDateStr].push(r);
    });
    return map;
  }, [processedRewards]);

  const getSessionsForDate = (date: Date) => sessionsByDateStr[format(date, 'yyyy-MM-dd')] || [];
  const getRewardsForDate = (date: Date) => rewardsByDateStr[format(date, 'yyyy-MM-dd')] || [];

  const isSamePeakDay = (sessionDate: Date, targetDate: Date) => {
    const info = getPeriodInfo(sessionDate);
    return isSameDay(info.assignedDate, targetDate);
  };

  // --- Aggregate Helpers ---
  const getGainsForPeriod = (sessions: StudySession[], rewards: RewardHistoryItem[], dateRange?: { start: Date, end: Date }) => {
    const periodSessions = dateRange 
      ? processedHistory.filter(s => {
          if (heatmapMode === 'year' || weeklyMode === 'calendar') {
             return isWithinInterval(s.assignedDate, dateRange);
          }
          return isWithinInterval(new Date(s.timestamp), dateRange);
        })
      : processedHistory;
    const periodRewards = dateRange
      ? processedRewards.filter(r => isWithinInterval(new Date(r.timestamp), dateRange))
      : processedRewards;

    const coins = periodSessions.reduce((acc, s) => acc + s.coinsEarned, 0) + 
                  periodRewards.filter(r => r.type === 'coins').reduce((acc, r) => acc + (r.amount || 0), 0);
    const xp = periodSessions.reduce((acc, s) => acc + s.xpEarned, 0) + 
               periodRewards.filter(r => r.type === 'xp').reduce((acc, r) => acc + (r.amount || 0), 0);
    
    // Tasks = Sessions + Unique Quest/Dungeon reward events
    const questRewards = periodRewards.filter(r => 
      r.name.includes('Quest') || 
      r.name.includes('MAJOR CLEAR') || 
      r.name.includes('QUEST COMPLETE') ||
      r.name.includes('Achievement') ||
      r.name.includes('GOAL ACHIEVED') ||
      r.name.includes('Dungeon Reward')
    );
    const uniqueQuests = new Set(questRewards.map(r => r.timestamp)).size;
    
    return { coins, xp, tasks: periodSessions.length + uniqueQuests };
  };

  const dailyGains = useMemo(() => {
    const sessions = getSessionsForDate(dailyDate);
    const rewards = getRewardsForDate(dailyDate);
    
    const coins = sessions.reduce((acc, s) => acc + s.coinsEarned, 0) + 
                  rewards.filter(r => r.type === 'coins').reduce((acc, r) => acc + (r.amount || 0), 0);
    const xp = sessions.reduce((acc, s) => acc + s.xpEarned, 0) + 
               rewards.filter(r => r.type === 'xp').reduce((acc, r) => acc + (r.amount || 0), 0);
    
    const questRewards = rewards.filter(r => 
      r.name.includes('Quest') || 
      r.name.includes('MAJOR CLEAR') || 
      r.name.includes('QUEST COMPLETE') ||
      r.name.includes('Achievement') ||
      r.name.includes('GOAL ACHIEVED') ||
      r.name.includes('Dungeon Reward')
    );
    const uniqueQuests = new Set(questRewards.map(r => r.timestamp)).size;
    
    return { coins, xp, tasks: sessions.length + uniqueQuests };
  }, [history, state.rewardHistory, dailyDate, ts]);

  const weeklyGains = useMemo(() => {
    const interval = { start: weekStart, end: weekEnd };
    return getGainsForPeriod(history, state.rewardHistory || [], interval);
  }, [history, state.rewardHistory, weekStart, weekEnd, ts]);

  const getPeriod = (date: Date) => {
    return getPeriodInfo(date).period;
  };

  const dailyData = useMemo(() => {
    const dailySessions = getSessionsForDate(dailyDate);
    const dailyCounts = { Morning: 0, Afternoon: 0, Night: 0, Other: 0 };
    dailySessions.forEach(s => {
      const p = s.period || getPeriod(new Date(s.timestamp));
      if (p in dailyCounts) {
        dailyCounts[p as keyof typeof dailyCounts]++;
      } else {
        dailyCounts.Other++;
      }
    });

    return [
      { name: `Morning (${ts.morning.start}-${ts.morning.end})`, sessions: dailyCounts.Morning, fill: '#fde047', periodKey: 'Morning' },
      { name: `Afternoon (${ts.afternoon.start}-${ts.afternoon.end})`, sessions: dailyCounts.Afternoon, fill: '#f97316', periodKey: 'Afternoon' },
      { name: `Night (${ts.night.start}-${ts.night.end})`, sessions: dailyCounts.Night, fill: '#6366f1', periodKey: 'Night' },
      ...(state.showOtherInActivityLog !== false ? [{ name: 'Other', sessions: dailyCounts.Other, fill: '#64748b', periodKey: 'Other' }] : [])
    ];
  }, [dailyDate, getSessionsForDate, ts, state.showOtherInActivityLog]);

  const dailySessions = getSessionsForDate(dailyDate);
  const dailyCounts = { Morning: 0, Afternoon: 0, Night: 0, Other: 0 };
  dailySessions.forEach(s => {
    const p = s.period || getPeriod(new Date(s.timestamp));
    if (p in dailyCounts) {
      dailyCounts[p as keyof typeof dailyCounts]++;
    } else {
      dailyCounts.Other++;
    }
  });

  let maxPeriod = 'Morning';
  let maxCount = dailyCounts.Morning;
  ['Afternoon', 'Night'].forEach(p => {
    if (dailyCounts[p as keyof typeof dailyCounts] > maxCount) {
      maxCount = dailyCounts[p as keyof typeof dailyCounts];
      maxPeriod = p;
    }
  });
  const highestEnergyPrompt = dailySessions.length > 0 
    ? (maxCount > 0 
        ? `Your highest energy period today is ${maxPeriod}!` 
        : "No sessions recorded during main periods today.")
    : "The archives are silent for today. Embark on a new journey to begin your record.";

  const weeklyDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weeklyActiveDaysCount = useMemo(() => {
    const count = weeklyDays.filter(date => {
      const hasSessions = getSessionsForDate(date).length > 0;
      const hasRewards = getRewardsForDate(date).length > 0;
      return hasSessions || hasRewards;
    }).length;
    return count > 0 ? count : 1;
  }, [weeklyDays, sessionsByDateStr, rewardsByDateStr]);

  const weeklyData = useMemo(() => {
    return weeklyDays.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const log = dailyLogs[dateStr];
      const daySessions = getSessionsForDate(date);
      const dayRewards = getRewardsForDate(date);
      const coins = daySessions.reduce((acc, s) => acc + s.coinsEarned, 0) + 
                    dayRewards.filter(r => r.type === 'coins').reduce((acc, r) => acc + (r.amount || 0), 0);
      const xp = daySessions.reduce((acc, s) => acc + s.xpEarned, 0) + 
                 dayRewards.filter(r => r.type === 'xp').reduce((acc, r) => acc + (r.amount || 0), 0);
      const counts = { Morning: 0, Afternoon: 0, Night: 0, Other: 0 };
      daySessions.forEach(s => {
        const p = s.period || getPeriod(new Date(s.timestamp));
        if (p in counts) {
          counts[p as keyof typeof counts]++;
        } else {
          counts.Other++;
        }
      });
      const total = counts.Morning + counts.Afternoon + counts.Night + counts.Other;
      return {
        name: format(date, 'EEE').toUpperCase(),
        fullDate: format(date, 'EEE, MMM d, yyyy'),
        Morning: counts.Morning,
        Afternoon: counts.Afternoon,
        Night: counts.Night,
        Other: counts.Other,
        total,
        xp,
        coins,
        moodHeight: 0,
        mood: log?.mood,
        efficiency: log?.rating || null,
        timestamp: date.getTime(),
      };
    });
  }, [weeklyDays, dailyLogs, getSessionsForDate, getRewardsForDate]);

  // --- Heatmap Data ---
  const heatmapDays = useMemo(() => {
    let days: Date[] = [];
    if (heatmapMode === '30days') {
      days = eachDayOfInterval({ start: subDays(heatmapDate, 29), end: heatmapDate });
    } else if (heatmapMode === 'month') {
      days = eachDayOfInterval({ start: startOfMonth(heatmapDate), end: endOfMonth(heatmapDate) });
    } else if (heatmapMode === 'year') {
      days = eachDayOfInterval({ start: startOfYear(heatmapDate), end: endOfYear(heatmapDate) });
    }
    return days;
  }, [heatmapMode, heatmapDate]);

  const getIntensity = (date: Date) => {
    if (heatmapMetric === 'time') {
      const count = getSessionsForDate(date).length;
      if (count === 0) return 'bg-slate-800/50';
      
      const max = state.heatmapScaleMax ?? 8;
      
      if (count < (max * 0.25)) return 'bg-indigo-500/20';
      if (count < (max * 0.5)) return 'bg-indigo-500/40';
      if (count < max) return 'bg-indigo-500/70';
      return 'bg-indigo-500';
    } else {
      const log = dailyLogs[format(date, 'yyyy-MM-dd')];
      if (!log || log.rating === 0) return 'bg-slate-800/50';
      if (log.rating < 2) return 'bg-indigo-500/20';
      if (log.rating < 3.5) return 'bg-indigo-500/50';
      if (log.rating < 4.5) return 'bg-indigo-500/80';
      return 'bg-indigo-500';
    }
  };

  const renderMoodIcon = (props: any) => {
    const { x, y, width, payload, value } = props;
    // Extract actual payload whether stacked or not
    const actualPayload = payload?.payload || payload;
    if (!actualPayload) return null;

    const moodId = actualPayload.mood;
    const total = actualPayload.total;
    const moodObj = moodId ? MOOD_OPTIONS.find((m) => m.id === moodId) : null;
    const Icon = moodObj ? moodObj.icon : null;

    return (
      <g transform={`translate(${x + width / 2}, ${y - 10})`}>
        {/* Render total value */}
        <text
          x={0}
          y={Icon ? -16 : 0}
          fill="#94a3b8"
          fontSize={10}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {total > 0 ? total : ''}
        </text>
        {/* Render mood icon if available */}
        {Icon && (
          <g transform={`translate(-7, -7)`}>
            <Icon size={14} className={moodObj.color} />
          </g>
        )}
      </g>
    );
  };

  return (
    <div className="p-6 space-y-8" onClick={() => {}} style={{ cursor: 'auto' }}>
      <PageHeader 
        title="Record"
        description="Your journey through the dungeon"
        icon={BarChart2}
        stats={[
          { label: 'Total XP', value: history.reduce((acc, s) => acc + s.xpEarned, 0).toLocaleString(), icon: Zap, color: 'text-indigo-400' },
          { label: 'Total Gold', value: history.reduce((acc, s) => acc + s.coinsEarned, 0).toLocaleString(), icon: Coins, color: 'text-amber-400' }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Daily */}
        <div id="daily-activity-section" className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <h3 className="text-lg font-bold text-slate-100">Daily</h3>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 bg-slate-800/50 rounded-lg p-0.5 sm:p-1 w-full sm:w-auto">
              <button onClick={() => handleDailyDateChange(subDays(dailyDate, 1))} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"><ChevronLeft size={16} /></button>
              <div className="relative flex items-center justify-center flex-1 sm:flex-none">
                <button 
                  onClick={() => dailyInputRef.current?.showPicker()}
                  className="text-[10px] sm:text-xs font-bold text-slate-300 w-full sm:w-24 text-center hover:text-indigo-400 transition-colors"
                >
                  {format(dailyDate, 'MMM d, yyyy')}
                </button>
                <input 
                  type="date" 
                  ref={dailyInputRef}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-0 pointer-events-none w-1 h-1" 
                  value={format(dailyDate, 'yyyy-MM-dd')}
                  onChange={(e) => e.target.value && handleDailyDateChange(parseISO(e.target.value))}
                />
              </div>
              <button onClick={() => handleDailyDateChange(addDays(dailyDate, 1))} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"><ChevronRight size={16} /></button>
              <button 
                onClick={() => handleDailyDateChange(new Date())}
                className="p-1 text-indigo-400 hover:bg-slate-700 hover:text-indigo-300 rounded transition-colors"
                title="Return to Today"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Daily Gains Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Gold</span>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Coins size={12} className="sm:w-4 sm:h-4 shrink-0" />
                <span className="text-sm sm:text-lg font-black font-mono">+{dailyGains.coins}</span>
              </div>
            </div>
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Exp</span>
              <div className="flex items-center gap-1.5 text-indigo-400">
                <Zap size={12} className="sm:w-4 sm:h-4 shrink-0" />
                <span className="text-sm sm:text-lg font-black font-mono">+{dailyGains.xp}</span>
              </div>
            </div>
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Tasks</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Sword size={12} className="sm:w-4 sm:h-4 shrink-0" />
                <span className="text-sm sm:text-lg font-black font-mono">{dailyGains.tasks}</span>
              </div>
            </div>
          </div>

          <div className="h-48 min-h-[192px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={dailyData} onClick={(state) => handleChartClick(state, 'daily')} style={{ outline: 'none', touchAction: 'pan-y' }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip 
                  key={chartKeys.daily}
                  trigger="click"
                  content={<CustomDailyTooltip dateTimestamp={dailyDate.getTime()} />}
                  cursor={{ fill: 'rgba(100, 116, 139, 0.2)' }}
                  wrapperStyle={{ zIndex: 100, pointerEvents: 'auto' }}
                />
                <Bar dataKey="sessions" radius={[4, 4, 0, 0]}>
                  {dailyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Log Section */}
          <div className="bg-slate-950/50 border border-slate-800/50 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="text-amber-400" size={16} />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Daily Record</span>
              </div>
              {!isEditingLog ? (
                <button 
                  onClick={startEditing}
                  className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                >
                  <Edit2 size={14} />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center gap-0 h-[26px]">
                    {renderTemplateControls()}
                  </div>
                  
                  <button 
                    onClick={() => setIsMarkdownPreview(!isMarkdownPreview)}
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                      isMarkdownPreview ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-slate-800 text-slate-500 border border-slate-700"
                    )}
                  >
                    {isMarkdownPreview ? <Eye size={12} /> : <EyeOff size={12} />}
                    <span>MD</span>
                  </button>
                  <button 
                    onClick={saveLog}
                    className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                  >
                    <Save size={14} />
                  </button>
                  <button 
                    onClick={saveLog}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                    title="Finish and Auto-save"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {isEditingLog ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-5">
                  {/* Efficiency Rating Edit */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-0.5 mb-1">Efficiency Rating</div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const val = i + 1;
                        const isFull = editRating >= val;
                        const isHalf = editRating >= val - 0.5 && editRating < val;
                        return (
                          <button
                            key={val}
                            onClick={() => setEditRating(isFull ? val - 0.5 : isHalf ? val - 1 : val)}
                            className="p-0.5 transition-transform hover:scale-110"
                          >
                            {isFull ? (
                              <Star size={18} className="text-amber-400 fill-amber-400" />
                            ) : isHalf ? (
                              <StarHalf size={18} className="text-amber-400 fill-amber-400" />
                            ) : (
                              <Star size={18} className="text-slate-700" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Daily Feelings Edit */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-0.5 mb-1">Daily Feelings</div>
                    <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar items-center">
                      {MOOD_OPTIONS.filter(m => (state.enabledMoods || DEFAULT_ENABLED_MOODS).includes(m.id)).map((m) => {
                        const isSelected = editMood === m.id;
                        const Icon = m.icon;
                        return (
                          <button
                            key={m.id}
                            onClick={() => setEditMood(isSelected ? undefined : m.id)}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap",
                              isSelected 
                                ? `${m.bg} ${m.border} ${m.color} scale-105 shadow-lg` 
                                : "bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                            )}
                          >
                            <Icon size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className={cn("grid gap-4", isMarkdownPreview ? "grid-cols-1" : "grid-cols-1")}>
                  <div className="relative">
                    <textarea
                      value={editReflection}
                      onChange={(e) => setEditReflection(e.target.value)}
                      className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all resize-none custom-scrollbar"
                      placeholder="Reflect on your day..."
                    />
                    <button
                      onClick={() => setIsFullscreenEdit(true)}
                      className="absolute top-2 right-2 p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700 hover:border-slate-600"
                      title="Fullscreen Edit"
                    >
                      <Maximize2 size={14} />
                    </button>
                  </div>
                  {isMarkdownPreview && editReflection && (
                    <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl overflow-y-auto max-h-32 custom-scrollbar">
                      <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-slate-200 prose-li:text-slate-300">
                        <Markdown>{editReflection}</Markdown>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  {/* Efficiency Rating Row */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efficiency</span>
                    <div className="flex items-center gap-1">
                      {currentLog ? (
                        Array.from({ length: 5 }).map((_, i) => {
                          const val = i + 1;
                          if (val <= currentLog.rating) return <Star key={i} size={15} className="text-amber-400 fill-amber-400" />;
                          if (val - 0.5 === currentLog.rating) return <StarHalf key={i} size={15} className="text-amber-400 fill-amber-400" />;
                          return <Star key={i} size={15} className="text-slate-800" />;
                        })
                      ) : (
                        <span className="text-[10px] text-slate-600 italic">No rating</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Daily Feeling Row */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Feelings</span>
                    {currentLog?.mood ? (() => {
                      const moodObj = MOOD_OPTIONS.find(m => m.id === currentLog.mood);
                      if (!moodObj) return <span className="text-[10px] text-slate-600 italic uppercase">None</span>;
                      const Icon = moodObj.icon;
                      return (
                        <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-md border", moodObj.bg, moodObj.border, moodObj.color)}>
                          <Icon size={10} />
                          <span className="text-[9px] font-black uppercase tracking-wider">{moodObj.label}</span>
                        </div>
                      );
                    })() : (
                      <span className="text-[10px] text-slate-600 italic uppercase">None</span>
                    )}
                  </div>
                </div>

                <div className="text-sm text-slate-300 leading-relaxed pt-3 border-t border-slate-900">
                  {currentLog?.reflection ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-slate-200 prose-li:text-slate-300">
                      <Markdown>{currentLog.reflection}</Markdown>
                    </div>
                  ) : (
                    <p className="italic text-xs text-slate-600">The day's reflections are yet to be chronicled.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Weekly */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center justify-between md:justify-start gap-2 sm:gap-4 w-full md:w-auto">
              <h3 className="text-lg font-bold text-slate-100">Weekly</h3>
              <div className="relative bg-slate-800/50 hover:bg-slate-700 transition-colors rounded-lg flex items-center p-0.5 sm:p-1 cursor-pointer group">
                <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wide sm:tracking-widest text-indigo-400 group-hover:text-indigo-300 whitespace-nowrap pointer-events-none flex items-center gap-1">
                  {weeklyMode === 'calendar' ? 'Natural' : 'Last 7d'}
                  <ChevronDown size={12} className="opacity-70" />
                </span>
                <select 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  value={weeklyMode}
                  onChange={(e) => setWeeklyMode(e.target.value as 'calendar' | 'rolling')}
                >
                  <option value="calendar">Natural</option>
                  <option value="rolling">Last 7d</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 bg-slate-800/50 rounded-lg p-0.5 sm:p-1 w-full md:w-auto">
              <button onClick={() => {
                const amount = weeklyMode === 'calendar' ? 1 : 7;
                setWeeklyDate(subDays(weeklyDate, amount));
              }} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"><ChevronLeft size={16} /></button>
              <div className="relative flex items-center justify-center flex-1 sm:flex-none">
                <button 
                  onClick={() => weeklyInputRef.current?.showPicker()}
                  className="text-[10px] sm:text-xs font-bold text-slate-300 w-[90px] sm:w-28 text-center hover:text-indigo-400 transition-colors"
                >
                  {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
                </button>
                <input 
                  type="date" 
                  ref={weeklyInputRef}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-0 pointer-events-none w-1 h-1" 
                  value={format(weeklyDate, 'yyyy-MM-dd')}
                  onChange={(e) => e.target.value && setWeeklyDate(parseISO(e.target.value))}
                />
              </div>
              <button onClick={() => {
                const amount = weeklyMode === 'calendar' ? 1 : 7;
                setWeeklyDate(addDays(weeklyDate, amount));
              }} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"><ChevronRight size={16} /></button>
              <button 
                onClick={() => setWeeklyDate(new Date())}
                className="p-1 text-indigo-400 hover:bg-slate-700 hover:text-indigo-300 rounded transition-colors"
                title="Return to Today"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Weekly Gains Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Daily Avg Gold</span>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Coins size={12} className="sm:w-4 sm:h-4 shrink-0" />
                <span className="text-sm sm:text-lg font-black font-mono">+{Math.round(weeklyGains.coins / weeklyActiveDaysCount)}</span>
              </div>
            </div>
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Daily Avg Exp</span>
              <div className="flex items-center gap-1.5 text-indigo-400">
                <Zap size={12} className="sm:w-4 sm:h-4 shrink-0" />
                <span className="text-sm sm:text-lg font-black font-mono">+{Math.round(weeklyGains.xp / weeklyActiveDaysCount)}</span>
              </div>
            </div>
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Daily Avg Tasks</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Sword size={12} className="sm:w-4 sm:h-4 shrink-0" />
                <span className="text-sm sm:text-lg font-black font-mono">{(weeklyGains.tasks / weeklyActiveDaysCount).toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="h-48 min-h-[192px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <BarChart data={weeklyData} margin={{ top: 35, right: 10, left: 10, bottom: 20 }} onClick={(state) => handleChartClick(state, 'weeklyBar')} style={{ outline: 'none', touchAction: 'pan-y' }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip 
                    key={chartKeys.weeklyBar}
                    trigger="click"
                    content={<CustomWeeklyTooltip />}
                    cursor={{ fill: 'rgba(100, 116, 139, 0.2)' }}
                    wrapperStyle={{ zIndex: 100, pointerEvents: 'auto' }}
                  />
                  <Bar dataKey="Morning" stackId="a" fill="#fde047" />
                  <Bar dataKey="Afternoon" stackId="a" fill="#f97316" />
                  <Bar dataKey="Night" stackId="a" fill="#6366f1" />
                  {state.showOtherInActivityLog !== false && (
                    <Bar dataKey="Other" stackId="a" fill="#64748b" radius={[4, 4, 0, 0]} />
                  )}
                  {/* Mood Icon Layer - Stacked with 0 height to stay at the top */}
                  <Bar dataKey="moodHeight" stackId="a" fill="transparent" isAnimationActive={false}>
                    <LabelList content={renderMoodIcon} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <LineChartIcon className="text-indigo-400" size={16} />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Efficiency Trend</span>
              </div>
              <div className="h-32 min-h-[128px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }} onClick={(state) => handleChartClick(state, 'weeklyLine')} style={{ outline: 'none', touchAction: 'pan-y' }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <YAxis hide domain={[0, 5]} />
                    <Tooltip 
                      key={chartKeys.weeklyLine}
                      trigger="click"
                      content={<CustomWeeklyTooltip />}
                      wrapperStyle={{ zIndex: 100, pointerEvents: 'auto' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={(d) => d.efficiency || 0} 
                      stroke="var(--color-indigo-500, #6366f1)" 
                      strokeWidth={3} 
                      dot={{ fill: 'var(--color-indigo-500, #6366f1)', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-indigo-400, #818cf8)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <RoutineTracker 
          history={state.history} 
          dungeons={dungeons} 
          majorDungeons={majorDungeons} 
          timeSettings={state.timeSettings}
          timezone={state.timezone}
        />

        {/* Study Heatmap */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-slate-100">Heatmap</h3>
              <div className="flex bg-slate-800/50 p-1 rounded-lg">
                <button
                  onClick={() => setHeatmapMetric('time')}
                  className={cn(
                    "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md transition-all",
                    heatmapMetric === 'time' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  Study Time
                </button>
                <button
                  onClick={() => setHeatmapMetric('efficiency')}
                  className={cn(
                    "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md transition-all",
                    heatmapMetric === 'efficiency' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  Efficiency
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex bg-slate-800/50 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
                {(['30days', 'month', 'year'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setHeatmapMode(mode)}
                    className={cn(
                      "flex-1 sm:flex-none px-3 py-1.5 sm:py-1 text-xs font-bold rounded-md transition-all capitalize whitespace-nowrap",
                      heatmapMode === mode ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    {mode === '30days' ? '30 Days' : mode}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between sm:justify-start gap-2 bg-slate-800/50 rounded-lg p-1 w-full sm:w-auto">
                <button 
                  onClick={() => {
                    if (heatmapMode === '30days') setHeatmapDate(subDays(heatmapDate, 30));
                    else if (heatmapMode === 'month') setHeatmapDate(subMonths(heatmapDate, 1));
                    else setHeatmapDate(subYears(heatmapDate, 1));
                  }} 
                  className="p-2 sm:p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="relative flex items-center justify-center flex-1 sm:flex-none">
                  <button 
                    onClick={() => heatmapInputRef.current?.showPicker()}
                    className="text-xs font-bold text-slate-300 w-full sm:w-24 text-center hover:text-indigo-400 transition-colors py-1"
                  >
                    {heatmapMode === '30days' ? 'Custom' : heatmapMode === 'month' ? format(heatmapDate, 'MMM yyyy') : format(heatmapDate, 'yyyy')}
                  </button>
                  <input 
                    type="date" 
                    ref={heatmapInputRef}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-0 pointer-events-none w-1 h-1" 
                    value={format(heatmapDate, 'yyyy-MM-dd')}
                    onChange={(e) => e.target.value && setHeatmapDate(parseISO(e.target.value))}
                  />
                </div>
                <button 
                  onClick={() => {
                    if (heatmapMode === '30days') setHeatmapDate(addDays(heatmapDate, 30));
                    else if (heatmapMode === 'month') setHeatmapDate(addMonths(heatmapDate, 1));
                    else setHeatmapDate(addYears(heatmapDate, 1));
                  }} 
                  className="p-2 sm:p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "gap-[2vw] sm:gap-1.5 grid w-full",
            heatmapMode === 'year' 
              ? "grid-cols-[repeat(15,minmax(0,1fr))] md:grid-cols-[repeat(30,minmax(0,1fr))] max-w-4xl mx-auto" 
              : "grid-cols-10"
          )}>
            {heatmapDays.map((date, i) => (
              <div
                key={i}
                className="relative heatmap-cell-container"
              >
                <button
                  type="button"
                  onClick={() => setSelectedHeatmapDate(selectedHeatmapDate === date.getTime() ? null : date.getTime())}
                  className={cn(
                    "rounded-sm transition-colors aspect-square w-full cursor-pointer hover:ring-2 hover:ring-indigo-500/50 outline-none",
                    selectedHeatmapDate === date.getTime() ? "ring-2 ring-indigo-400 scale-110 z-10 relative" : "",
                    getIntensity(date)
                  )}
                />
                {selectedHeatmapDate === date.getTime() && renderHeatmapPopover(date)}
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-end space-x-2 text-[10px] text-slate-500 uppercase font-bold">
            <span>Less</span>
            <div className="w-3 h-3 rounded-sm bg-slate-800/50" />
            <div className="w-3 h-3 rounded-sm bg-indigo-500/20" />
            <div className="w-3 h-3 rounded-sm bg-indigo-500/40" />
            <div className="w-3 h-3 rounded-sm bg-indigo-500/70" />
            <div className="w-3 h-3 rounded-sm bg-indigo-500" />
            <span>More</span>
          </div>
        </div>

      </div>
      
      <ImmersiveReflectionModal
        isOpen={isFullscreenEdit}
        onClose={() => setIsFullscreenEdit(false)}
        dateString={format(dailyDate, 'MMM d, yyyy')}
        reflection={editReflection}
        setReflection={setEditReflection}
        isMarkdownEnabled={isMarkdownPreview}
        setIsMarkdownEnabled={setIsMarkdownPreview}
        renderTemplateControls={renderTemplateControls}
      />

      {showDailySessionsDate && (
        <DailySessionsModal 
          isOpen={!!showDailySessionsDate}
          onClose={() => {
            setShowDailySessionsDate(null);
            setShowDailySessionsPeriod(undefined);
          }}
          date={showDailySessionsDate}
          history={processedHistory}
          dungeons={dungeons}
          majorDungeons={majorDungeons}
          updateSession={updateSession || (() => {})}
          deleteSession={deleteSession || (() => {})}
          rewardPool={state.rewardPool || []}
          timeSettings={state.timeSettings}
          period={showDailySessionsPeriod}
        />
      )}
    </div>
  );
});
