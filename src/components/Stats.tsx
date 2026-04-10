import React, { useState, useRef } from 'react';
import { 
  format, eachDayOfInterval, isSameDay, 
  startOfWeek, endOfWeek, subDays, addDays, subWeeks, addWeeks,
  startOfMonth, endOfMonth, startOfYear, endOfYear, addMonths, subMonths, addYears, subYears,
  parseISO
} from 'date-fns';
import { StudySession } from '../types';
import { cn } from '../lib/utils';
import { BarChart2, Zap, Coins, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

interface StatsProps {
  history: StudySession[];
}

export const Stats: React.FC<StatsProps> = ({ history }) => {
  const [dailyDate, setDailyDate] = useState(new Date());
  const [weeklyDate, setWeeklyDate] = useState(new Date());
  const [heatmapMode, setHeatmapMode] = useState<'30days' | 'month' | 'year'>('30days');
  const [heatmapDate, setHeatmapDate] = useState(new Date());

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
  const highestEnergyPrompt = maxCount > 0 
    ? `Your highest energy period today is ${maxPeriod}!` 
    : "No sessions recorded during main periods today.";

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
    const count = history.filter(s => isSameDay(new Date(s.timestamp), date)).length;
    if (count === 0) return 'bg-slate-800/50';
    if (count < 2) return 'bg-indigo-900';
    if (count < 4) return 'bg-indigo-700';
    if (count < 8) return 'bg-indigo-500';
    return 'bg-indigo-300';
  };

  return (
    <div className="p-6 space-y-8">
      <PageHeader 
        title="Chronicle"
        description="Your journey through the dungeon"
        icon={BarChart2}
        stats={[
          { label: 'Total XP', value: history.reduce((acc, s) => acc + s.xpEarned, 0).toLocaleString(), icon: Zap, color: 'text-indigo-400' },
          { label: 'Total Gold', value: history.reduce((acc, s) => acc + s.coinsEarned, 0).toLocaleString(), icon: Coins, color: 'text-amber-400' }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Daily Activity */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Daily Activity</h3>
            <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1">
              <button onClick={() => setDailyDate(subDays(dailyDate, 1))} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><ChevronLeft size={16} /></button>
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
              <button onClick={() => setDailyDate(addDays(dailyDate, 1))} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><ChevronRight size={16} /></button>
            </div>
          </div>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
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
          <div className="mt-auto p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-center">
            <p className="text-sm font-bold text-indigo-400">{highestEnergyPrompt}</p>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Weekly Activity</h3>
            <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1">
              <button onClick={() => setWeeklyDate(subWeeks(weeklyDate, 1))} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><ChevronLeft size={16} /></button>
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
              <button onClick={() => setWeeklyDate(addWeeks(weeklyDate, 1))} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><ChevronRight size={16} /></button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  cursor={{ fill: '#1e293b' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Morning" stackId="a" fill="#fde047" />
                <Bar dataKey="Afternoon" stackId="a" fill="#f97316" />
                <Bar dataKey="Night" stackId="a" fill="#6366f1" />
                <Bar dataKey="Other" stackId="a" fill="#64748b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Study Heatmap */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-white">Study Heatmap</h3>
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
                  className="p-2 sm:p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
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
                  className="p-2 sm:p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "gap-[2vw] sm:gap-1.5",
            (heatmapMode === '30days' || heatmapMode === 'month') ? "grid grid-cols-10 w-full" : "flex flex-wrap justify-center gap-1"
          )}>
            {heatmapDays.map((date, i) => (
              <div
                key={i}
                title={`${format(date, 'MMM d, yyyy')}: ${history.filter(s => isSameDay(new Date(s.timestamp), date)).length} sessions`}
                className={cn(
                  "rounded-sm transition-colors aspect-square", 
                  getIntensity(date),
                  heatmapMode === 'year' 
                    ? "w-[12px] sm:w-[14px]" 
                    : "w-full"
                )}
              />
            ))}
          </div>
          <div className="mt-6 flex items-center justify-end space-x-2 text-[10px] text-slate-500 uppercase font-bold">
            <span>Less</span>
            <div className="w-3 h-3 bg-slate-800/50 rounded-sm" />
            <div className="w-3 h-3 bg-indigo-900 rounded-sm" />
            <div className="w-3 h-3 bg-indigo-700 rounded-sm" />
            <div className="w-3 h-3 bg-indigo-500 rounded-sm" />
            <div className="w-3 h-3 bg-indigo-300 rounded-sm" />
            <span>More</span>
          </div>
        </div>

      </div>
    </div>
  );
};
