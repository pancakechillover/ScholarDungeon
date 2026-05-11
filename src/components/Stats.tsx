import React, { useState, useRef, useMemo } from 'react';
import { 
  format, eachDayOfInterval, isSameDay, 
  startOfWeek, endOfWeek, subDays, addDays, subWeeks, addWeeks,
  startOfMonth, endOfMonth, startOfYear, endOfYear, addMonths, subMonths, addYears, subYears,
  parseISO, isWithinInterval
} from 'date-fns';
import { StudySession, AppState, RewardHistoryItem } from '../types';
import { cn } from '../lib/utils';
import { 
  BarChart2, Zap, Coins, ChevronLeft, ChevronRight, Calendar, Star, StarHalf, Edit2, Save, X, Eye, EyeOff, LineChart as LineChartIcon, Trophy, Sword, Heart
} from 'lucide-react';
import { MOOD_OPTIONS, DEFAULT_ENABLED_MOODS } from '../constants';

import { PageHeader } from './PageHeader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend, LineChart, Line, CartesianGrid, LabelList } from 'recharts';
import Markdown from 'react-markdown';

interface StatsProps {
  state: AppState;
  saveDailyLog: (date: string, rating: number, reflection: string, mood?: string) => void;
}

export const Stats = React.memo<StatsProps>(({ state, saveDailyLog }) => {
  const history = state.history;
  const dailyLogs = state.dailyLogs || {};
  
  const getInitialPeakDate = () => {
    const ts = state.timeSettings || {
      morning: { start: 8, end: 12 },
      afternoon: { start: 14, end: 18 },
      night: { start: 20, end: 24 }
    };
    const now = new Date();
    const hour = now.getHours();
    
    if (ts.night.start > ts.night.end && hour < ts.night.end) {
      return subDays(now, 1);
    }
    return now;
  };

  const [dailyDate, setDailyDate] = useState(getInitialPeakDate());
  const [weeklyDate, setWeeklyDate] = useState(getInitialPeakDate());
  const [weeklyMode, setWeeklyMode] = useState<'calendar' | 'rolling'>('calendar');
  const [heatmapMode, setHeatmapMode] = useState<'30days' | 'month' | 'year'>('30days');
  const [heatmapMetric, setHeatmapMetric] = useState<'time' | 'efficiency'>('time');
  const [heatmapDate, setHeatmapDate] = useState(getInitialPeakDate());

  const [isEditingLog, setIsEditingLog] = useState(false);
  const [editRating, setEditRating] = useState(0);
  const [editReflection, setEditReflection] = useState('');
  const [editMood, setEditMood] = useState<string | undefined>();
  const [isMarkdownPreview, setIsMarkdownPreview] = useState(true);

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
    const hour = date.getHours();
    
    // Morning
    if (ts.morning.start < ts.morning.end) {
      if (hour >= ts.morning.start && hour < ts.morning.end) return { period: 'Morning', assignedDate: date };
    } else {
      if (hour >= ts.morning.start) return { period: 'Morning', assignedDate: date };
      if (hour < ts.morning.end) return { period: 'Morning', assignedDate: subDays(date, 1) };
    }
    
    // Afternoon
    if (ts.afternoon.start < ts.afternoon.end) {
      if (hour >= ts.afternoon.start && hour < ts.afternoon.end) return { period: 'Afternoon', assignedDate: date };
    } else {
      if (hour >= ts.afternoon.start) return { period: 'Afternoon', assignedDate: date };
      if (hour < ts.afternoon.end) return { period: 'Afternoon', assignedDate: subDays(date, 1) };
    }

    // Night
    if (ts.night.start < ts.night.end) {
      if (hour >= ts.night.start && hour < ts.night.end) return { period: 'Night', assignedDate: date };
    } else {
      if (hour >= ts.night.start) return { period: 'Night', assignedDate: date };
      if (hour < ts.night.end) return { period: 'Night', assignedDate: subDays(date, 1) };
    }

    return { period: 'Other', assignedDate: date };
  };

  const isSamePeakDay = (sessionDate: Date, targetDate: Date) => {
    const info = getPeriodInfo(sessionDate);
    return isSameDay(info.assignedDate, targetDate);
  };

  // --- Aggregate Helpers ---
  const getGainsForPeriod = (sessions: StudySession[], rewards: RewardHistoryItem[], dateRange?: { start: Date, end: Date }) => {
    const periodSessions = dateRange 
      ? sessions.filter(s => {
          const sessionDate = new Date(s.timestamp);
          if (heatmapMode === 'year' || weeklyMode === 'calendar') {
             // For long term views, we can stick to calendar days or use the peak logic
             // But for consistency with the daily chart, let's use peak logic if it's a single day or small range
             // Actually, for broad statistics, calendar days are usually preferred, 
             // but if the user specifically asked for this peak logic, let's use it for all categorization.
             const info = getPeriodInfo(sessionDate);
             return isWithinInterval(info.assignedDate, dateRange);
          }
          return isWithinInterval(sessionDate, dateRange);
        })
      : sessions;
    const periodRewards = dateRange
      ? rewards.filter(r => isWithinInterval(new Date(r.timestamp), dateRange))
      : rewards;

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
    const sessions = history.filter(s => isSamePeakDay(new Date(s.timestamp), dailyDate));
    const rewards = (state.rewardHistory || []).filter(r => isSamePeakDay(new Date(r.timestamp), dailyDate));
    
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

  // --- Daily Data ---
  const dailySessions = history.filter(s => isSamePeakDay(new Date(s.timestamp), dailyDate));
  const dailyCounts = { Morning: 0, Afternoon: 0, Night: 0, Other: 0 };
  dailySessions.forEach(s => {
    dailyCounts[getPeriod(new Date(s.timestamp))]++;
  });

  const dailyData = [
    { name: `Morning (${ts.morning.start}-${ts.morning.end})`, sessions: dailyCounts.Morning, fill: '#fde047' },
    { name: `Afternoon (${ts.afternoon.start}-${ts.afternoon.end})`, sessions: dailyCounts.Afternoon, fill: '#f97316' },
    { name: `Night (${ts.night.start}-${ts.night.end})`, sessions: dailyCounts.Night, fill: '#6366f1' },
    ...(state.showOtherInActivityLog !== false ? [{ name: 'Other', sessions: dailyCounts.Other, fill: '#64748b' }] : [])
  ];

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
      const hasSessions = history.some(s => isSamePeakDay(new Date(s.timestamp), date));
      const hasRewards = (state.rewardHistory || []).some(r => isSamePeakDay(new Date(r.timestamp), date));
      return hasSessions || hasRewards;
    }).length;
    return count > 0 ? count : 1;
  }, [weeklyDays, history, state.rewardHistory, ts]);

  const weeklyData = weeklyDays.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = dailyLogs[dateStr];
    const daySessions = history.filter(s => isSamePeakDay(new Date(s.timestamp), date));
    const counts = { Morning: 0, Afternoon: 0, Night: 0, Other: 0 };
    daySessions.forEach(s => {
      counts[getPeriod(new Date(s.timestamp))]++;
    });
    const total = counts.Morning + counts.Afternoon + counts.Night + counts.Other;
    return {
      name: format(date, 'EEE'),
      Morning: counts.Morning,
      Afternoon: counts.Afternoon,
      Night: counts.Night,
      Other: counts.Other,
      total,
      moodHeight: 0,
      mood: log?.mood
    };
  });

  // --- Heatmap Data ---
  let heatmapDays: Date[] = [];
  if (heatmapMode === '30days') {
    heatmapDays = eachDayOfInterval({ start: subDays(heatmapDate, 29), end: heatmapDate });
  } else if (heatmapMode === 'month') {
    heatmapDays = eachDayOfInterval({ start: startOfMonth(heatmapDate), end: endOfMonth(heatmapDate) });
  } else if (heatmapMode === 'year') {
    heatmapDays = eachDayOfInterval({ start: startOfYear(heatmapDate), end: endOfYear(heatmapDate) });
  }

  const getIntensity = (date: Date) => {
    if (heatmapMetric === 'time') {
      const count = history.filter(s => isSamePeakDay(new Date(s.timestamp), date)).length;
      if (count === 0) return 'bg-slate-800/50';
      if (count < 2) return 'bg-indigo-500/20';
      if (count < 4) return 'bg-indigo-500/40';
      if (count < 8) return 'bg-indigo-500/70';
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
    <div className="p-6 space-y-8">
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
        
        {/* Daily Activity */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100">Daily Activity</h3>
            <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1">
              <button onClick={() => setDailyDate(subDays(dailyDate, 1))} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"><ChevronLeft size={16} /></button>
              <div className="relative flex items-center justify-center">
                <button 
                  onClick={() => dailyInputRef.current?.showPicker()}
                  className="text-xs font-bold text-slate-300 w-24 text-center hover:text-indigo-400 transition-colors"
                >
                  {format(dailyDate, 'MMM d, yyyy')}
                </button>
                <input 
                  type="date" 
                  ref={dailyInputRef}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-0 pointer-events-none w-1 h-1" 
                  value={format(dailyDate, 'yyyy-MM-dd')}
                  onChange={(e) => e.target.value && setDailyDate(parseISO(e.target.value))}
                />
              </div>
              <button onClick={() => setDailyDate(addDays(dailyDate, 1))} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"><ChevronRight size={16} /></button>
              <button 
                onClick={() => setDailyDate(new Date())}
                className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
              >
                Today
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
              <BarChart data={dailyData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  cursor={{ fill: '#1e293b' }}
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
                  <button 
                    onClick={() => setIsMarkdownPreview(!isMarkdownPreview)}
                    className={cn(
                      "p-1.5 rounded-lg transition-all",
                      isMarkdownPreview ? "text-indigo-400 bg-indigo-500/10" : "text-slate-500 hover:text-slate-200"
                    )}
                  >
                    {isMarkdownPreview ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button 
                    onClick={saveLog}
                    className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                  >
                    <Save size={14} />
                  </button>
                  <button 
                    onClick={() => setIsEditingLog(false)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
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
                  <textarea
                    value={editReflection}
                    onChange={(e) => setEditReflection(e.target.value)}
                    className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                    placeholder="Reflect on your day..."
                  />
                  {isMarkdownPreview && editReflection && (
                    <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl overflow-y-auto max-h-32 custom-scrollbar">
                      <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-slate-200">
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
                    <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-slate-200">
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

        {/* Weekly Activity */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-slate-100">Weekly Activity</h3>
              <div className="flex bg-slate-800/50 p-1 rounded-lg">
                <button
                  onClick={() => setWeeklyMode('calendar')}
                  className={cn(
                    "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md transition-all whitespace-nowrap",
                    weeklyMode === 'calendar' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  Natural
                </button>
                <button
                  onClick={() => setWeeklyMode('rolling')}
                  className={cn(
                    "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md transition-all whitespace-nowrap",
                    weeklyMode === 'rolling' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  Last 7d
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1 self-start sm:self-auto">
              <button onClick={() => {
                const amount = weeklyMode === 'calendar' ? 1 : 7;
                setWeeklyDate(subDays(weeklyDate, amount));
              }} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"><ChevronLeft size={16} /></button>
              <div className="relative flex items-center justify-center">
                <button 
                  onClick={() => weeklyInputRef.current?.showPicker()}
                  className="text-[10px] font-bold text-slate-300 w-32 text-center hover:text-indigo-400 transition-colors"
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
                className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
              >
                Today
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
            <div className="h-40 min-h-[160px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <BarChart data={weeklyData} margin={{ top: 35, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    cursor={{ fill: '#1e293b' }}
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
                  <LineChart data={weeklyDays.map(date => ({
                    name: format(date, 'EEE'),
                    efficiency: dailyLogs[format(date, 'yyyy-MM-dd')]?.rating || 0
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <YAxis hide domain={[0, 5]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--color-indigo-400, #818cf8)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
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
                title={`${format(date, 'MMM d, yyyy')}: ${history.filter(s => isSamePeakDay(new Date(s.timestamp), date)).length} sessions`}
                className={cn(
                  "rounded-sm transition-colors aspect-square w-full", 
                  getIntensity(date)
                )}
              />
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
    </div>
  );
});
