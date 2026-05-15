import React, { useState, useMemo } from 'react';
import { StudySession, Dungeon, MajorDungeon } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfYear, eachMonthOfInterval, endOfYear, subDays } from 'date-fns';
import { cn } from '../lib/utils';
import { Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { AppState } from '../types';

interface RoutineTrackerProps {
  history: StudySession[];
  dungeons?: Dungeon[];
  majorDungeons?: MajorDungeon[];
  timeSettings?: AppState['timeSettings'];
  timezone?: string;
}

export const RoutineTracker: React.FC<RoutineTrackerProps> = ({ history, dungeons = [], majorDungeons = [], timeSettings, timezone }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());

  const routines = useMemo(() => {
    const majors = (majorDungeons || []).filter(m => m.isRoutine && m.routineType === activeTab).map(m => ({
      id: m.id,
      name: m.name,
      isMajor: true,
      tier: 'major'
    }));
    const subs = (dungeons || []).filter(d => d.isRoutine && d.routineType === activeTab).map(d => ({
      id: d.id,
      name: d.name,
      isMajor: false,
      tier: 'sub'
    }));
    return [...majors, ...subs];
  }, [majorDungeons, dungeons, activeTab]);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (activeTab === 'monthly') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (activeTab === 'monthly') {
      newDate.setFullYear(newDate.getFullYear() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const columns = useMemo(() => {
    if (activeTab === 'monthly') {
      return eachMonthOfInterval({ start: startOfYear(currentDate), end: endOfYear(currentDate) });
    } else {
      return eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) });
    }
  }, [currentDate, activeTab]);

  const checkIns = useMemo(() => {
    const records: Record<string, Set<string>> = {}; 
    
    routines.forEach(r => {
      records[r.id] = new Set();
    });

    history.forEach(session => {
      let sessionDate = new Date(session.timestamp);
      
      if (timezone) {
        try {
          const str = sessionDate.toLocaleString('en-US', { timeZone: timezone });
          sessionDate = new Date(str);
        } catch (e) {}
      }

      const resetHour = timeSettings?.night?.end || 0;
      if (resetHour > 0 && sessionDate.getHours() < resetHour) {
        sessionDate = subDays(sessionDate, 1);
      }
      
      if (activeTab === 'monthly') {
        if (sessionDate.getFullYear() !== currentDate.getFullYear()) return;
      } else {
        if (sessionDate.getFullYear() !== currentDate.getFullYear() || sessionDate.getMonth() !== currentDate.getMonth()) return;
      }

      const key = activeTab === 'monthly' ? format(sessionDate, 'yyyy-MM') : format(sessionDate, 'yyyy-MM-dd');

      const subDungeon = dungeons.find(d => d.id === session.dungeonId);
      if (!subDungeon) return;

      if (records[subDungeon.id]) {
        records[subDungeon.id].add(key);
      }
      if (subDungeon.parentId && records[subDungeon.parentId]) {
        records[subDungeon.parentId].add(key);
      }
    });

    return records;
  }, [history, routines, currentDate, activeTab, dungeons]);

  const dateLabel = activeTab === 'monthly' ? format(currentDate, 'yyyy') : format(currentDate, 'MMM yyyy');

  return (
    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 lg:col-span-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Calendar size={20} className="text-indigo-400" />
            Routine Tracker
          </h3>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Tabs */}
          <div className="flex bg-slate-800/50 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
            {(['daily', 'weekly', 'monthly'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setActiveTab(mode)}
                className={cn(
                  "flex-1 sm:flex-none px-3 py-1.5 sm:py-1 text-xs font-bold rounded-md transition-all capitalize whitespace-nowrap",
                  activeTab === mode ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Date Navigator */}
          <div className="flex items-center justify-between sm:justify-start gap-2 bg-slate-800/50 rounded-lg p-1 w-full sm:w-auto">
            <button 
              onClick={handlePrev} 
              className="p-2 sm:p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 select-none"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="px-2 min-w-[100px] text-center font-bold text-sm text-slate-200">
              {dateLabel}
            </div>
            <button 
              onClick={handleNext} 
              className="p-2 sm:p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 select-none"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {routines.length === 0 ? (
        <div className="py-8 text-center border-t border-slate-800/50">
          <p className="text-sm font-medium text-slate-500 italic pr-1">No tracked {activeTab} routines active.</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-r border-slate-800 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.5)]">
                  Task
                </th>
                {columns.map(col => {
                  const label = activeTab === 'monthly' ? format(col, 'MMM') : format(col, 'd');
                  
                  let isCurrent = false;
                  const today = new Date();
                  if (activeTab === 'monthly') {
                    isCurrent = col.getFullYear() === today.getFullYear() && col.getMonth() === today.getMonth();
                  } else {
                    isCurrent = col.getFullYear() === today.getFullYear() && col.getMonth() === today.getMonth() && col.getDate() === today.getDate();
                  }

                  return (
                    <th key={col.toISOString()} className={cn(
                      "px-1 py-2 text-[10px] font-bold text-center border-b min-w-[28px]",
                      isCurrent ? "text-indigo-400 border-indigo-500/50 bg-indigo-500/5" : "text-slate-500 border-transparent"
                    )}>
                      {label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {routines.map((routine, idx) => (
                <tr key={routine.id} className={cn("group hover:bg-slate-800/20", idx !== routines.length - 1 ? "border-b border-slate-800/30" : "")}>
                  <td className="sticky left-0 z-10 bg-slate-900 group-hover:bg-slate-800/80 px-3 py-2 text-sm font-bold text-slate-200 border-r border-slate-800 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.5)] whitespace-nowrap max-w-[200px] truncate" title={routine.name}>
                    {routine.name}
                  </td>
                  {columns.map(col => {
                    const colKey = activeTab === 'monthly' ? format(col, 'yyyy-MM') : format(col, 'yyyy-MM-dd');
                    const isChecked = checkIns[routine.id]?.has(colKey);
                    
                    return (
                      <td key={col.toISOString()} className="p-1 text-center">
                        <div className={cn(
                          "mx-auto w-5 h-5 rounded-md flex items-center justify-center transition-all",
                          isChecked ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-800/30 text-transparent"
                        )}>
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
