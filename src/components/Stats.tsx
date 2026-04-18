import React, { useState, useRef } from 'react';
import { 
  format, eachDayOfInterval, isSameDay, 
  startOfWeek, endOfWeek, subDays, addDays, subWeeks, addWeeks,
  startOfMonth, endOfMonth, startOfYear, endOfYear, addMonths, subMonths, addYears, subYears,
  parseISO
} from 'date-fns';
import { StudySession, UserState } from '../types';
import { cn } from '../lib/utils';
import { BarChart2, Zap, Coins, ChevronLeft, ChevronRight, Calendar, Star, StarHalf, Edit2, Save, X, Eye, EyeOff, LineChart as LineChartIcon } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import Markdown from 'react-markdown';

interface StatsProps {
  state: UserState;
  saveDailyLog: (date: string, rating: number, reflection: string) => void;
}

export const Stats = React.memo<StatsProps>(({ state, saveDailyLog }) => {
  const history = state.history;
  const dailyLogs = state.dailyLogs || {};
  
  const [dailyDate, setDailyDate] = useState(new Date());
  const [weeklyDate, setWeeklyDate] = useState(new Date());
  const [heatmapMode, setHeatmapMode] = useState<'30days' | 'month' | 'year'>('30days');
  const [heatmapMetric, setHeatmapMetric] = useState<'time' | 'efficiency'>('time');
  const [heatmapDate, setHeatmapDate] = useState(new Date());

  const [isEditingLog, setIsEditingLog] = useState(false);
  const [editRating, setEditRating] = useState(0);
  const [editReflection, setEditReflection] = useState('');
  const [isMarkdownPreview, setIsMarkdownPreview] = useState(true);

  const dailyDateStr = format(dailyDate, 'yyyy-MM-dd');
  const currentLog = dailyLogs[dailyDateStr];

  const startEditing = () => {
    setEditRating(currentLog?.rating || 0);
    setEditReflection(currentLog?.reflection || '');
    setIsEditingLog(true);
  };

  const saveLog = () => {
    saveDailyLog(dailyDateStr, editRating, editReflection);
    setIsEditingLog(false);
  };

  const dailyInputRef = useRef<HTMLInputElement>(null);
  const weeklyInputRef = useRef<HTMLInputElement>(null);
  const heatmapInputRef = useRef<HTMLInputElement>(null);

  const getPeriod = (date: Date) => {
    const hour = date.getHours();
    if (hour >= 8 && hour < 12) return 'Morning';
    if (hour >= 14 && hour < 18) return 'Afternoon';
    if (hour >= 20 && hour < 24) return 'Night';
    return 'Other';
  };

  // --- Daily Data ---
  const dailySessions = history.filter(s => isSameDay(new Date(s.timestamp), dailyDate));
  const dailyCounts = { Morning: 0, Afternoon: 0, Night: 0, Other: 0 };
  dailySessions.forEach(s => {
    dailyCounts[getPeriod(new Date(s.timestamp))]++;
  });

  const dailyData = [
    { name: 'Morning (8-12)', sessions: dailyCounts.Morning, fill: '#fde047' },
    { name: 'Afternoon (14-18)', sessions: dailyCounts.Afternoon, fill: '#f97316' },
    { name: 'Night (20-24)', sessions: dailyCounts.Night, fill: '#6366f1' },
    { name: 'Other', sessions: dailyCounts.Other, fill: '#64748b' }
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

  // --- Weekly Data ---
  const weekStart = startOfWeek(weeklyDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(weeklyDate, { weekStartsOn: 1 });
  const weeklyDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weeklyData = weeklyDays.map(date => {
    const daySessions = history.filter(s => isSameDay(new Date(s.timestamp), date));
    const counts = { Morning: 0, Afternoon: 0, Night: 0, Other: 0 };
    daySessions.forEach(s => {
      counts[getPeriod(new Date(s.timestamp))]++;
    });
    return {
      name: format(date, 'EEE'),
      Morning: counts.Morning,
      Afternoon: counts.Afternoon,
      Night: counts.Night,
      Other: counts.Other
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
      const count = history.filter(s => isSameDay(new Date(s.timestamp), date)).length;
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
            <h3 className="text-lg font-bold text-slate-200">Daily Activity</h3>
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
                <Star className="text-amber-400 fill-amber-400" size={16} />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Efficiency & Reflection</span>
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
                          <Star size={16} className="text-amber-400 fill-amber-400" />
                        ) : isHalf ? (
                          <StarHalf size={16} className="text-amber-400 fill-amber-400" />
                        ) : (
                          <Star size={16} className="text-slate-700" />
                        )}
                      </button>
                    );
                  })}
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
                      <div className="prose prose-invert prose-sm max-w-none">
                        <Markdown>{editReflection}</Markdown>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {currentLog ? (
                    Array.from({ length: 5 }).map((_, i) => {
                      const val = i + 1;
                      if (val <= currentLog.rating) return <Star key={i} size={16} className="text-amber-400 fill-amber-400" />;
                      if (val - 0.5 === currentLog.rating) return <StarHalf key={i} size={16} className="text-amber-400 fill-amber-400" />;
                      return <Star key={i} size={16} className="text-slate-800" />;
                    })
                  ) : (
                    <span className="text-xs text-slate-600 italic">No rating recorded</span>
                  )}
                </div>
                <div className="text-sm text-slate-300 leading-relaxed">
                  {currentLog?.reflection ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <Markdown>{currentLog.reflection}</Markdown>
                    </div>
                  ) : (
                    <p className="italic text-slate-600">The day's reflections are yet to be chronicled.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-200">Weekly Activity</h3>
            <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1">
              <button onClick={() => setWeeklyDate(subWeeks(weeklyDate, 1))} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"><ChevronLeft size={16} /></button>
              <div className="relative flex items-center justify-center">
                <button 
                  onClick={() => weeklyInputRef.current?.showPicker()}
                  className="text-xs font-bold text-slate-300 w-32 text-center hover:text-indigo-400 transition-colors"
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
              <button onClick={() => setWeeklyDate(addWeeks(weeklyDate, 1))} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"><ChevronRight size={16} /></button>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="h-40 min-h-[160px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <BarChart data={weeklyData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    cursor={{ fill: '#1e293b' }}
                  />
                  <Bar dataKey="Morning" stackId="a" fill="#fde047" />
                  <Bar dataKey="Afternoon" stackId="a" fill="#f97316" />
                  <Bar dataKey="Night" stackId="a" fill="#6366f1" />
                  <Bar dataKey="Other" stackId="a" fill="#64748b" radius={[4, 4, 0, 0]} />
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
              <h3 className="text-lg font-bold text-slate-200">Heatmap</h3>
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
                title={`${format(date, 'MMM d, yyyy')}: ${history.filter(s => isSameDay(new Date(s.timestamp), date)).length} sessions`}
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
