import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Clock, Trophy, Edit2, Trash2, Filter, Search, X, Check, SearchX, Calendar, Sword, ArrowUp, ArrowDown, ChevronUp, ChevronDown, Zap } from 'lucide-react';
import { StudySession, Dungeon, MajorDungeon, RewardCard } from '../types';
import { cn } from '../lib/utils';
import { format, parseISO, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';

interface RecentSessionsProps {
  history: StudySession[];
  dungeons: Dungeon[];
  majorDungeons: MajorDungeon[];
  updateSession: (id: string, updates: Partial<StudySession>) => void;
  deleteSession: (id: string) => void;
  rewardPool: RewardCard[];
}

export const RecentSessions: React.FC<RecentSessionsProps> = ({
  history,
  dungeons,
  majorDungeons,
  updateSession,
  deleteSession,
  rewardPool
}) => {
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [viewingRewardName, setViewingRewardName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDungeon, setFilterDungeon] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [durationRange, setDurationRange] = useState({ min: '', max: '' });
  const [sortConfig, setSortConfig] = useState<{ 
    key: keyof StudySession | 'dungeon' | 'date'; 
    direction: 'asc' | 'desc' | null 
  }>({ key: 'date', direction: 'desc' });

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('scholars_dungeon_column_widths');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse column widths', e);
      }
    }
    return {
      date: 160,
      dungeon: 220,
      duration: 140,
      reward: 140,
      gains: 110,
      actions: 90
    };
  });

  const handleResize = (column: string, width: number) => {
    setColumnWidths(prev => {
      const updated = { ...prev, [column]: Math.max(width, 60) };
      localStorage.setItem('scholars_dungeon_column_widths', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSort = (key: typeof sortConfig.key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key ? (prev.direction === 'desc' ? 'asc' : 'desc') : 'desc'
    }));
  };

  // Sorting Logic
  const sortedSessions = useMemo(() => {
    const sessions = [...history];
    if (!sortConfig.direction) return sessions;

    return sessions.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortConfig.key === 'date') {
        valA = new Date(a.timestamp).getTime();
        valB = new Date(b.timestamp).getTime();
      } else if (sortConfig.key === 'dungeon') {
        const dA = dungeons.find(d => d.id === a.dungeonId)?.name || 'Free Study';
        const dB = dungeons.find(d => d.id === b.dungeonId)?.name || 'Free Study';
        valA = dA.toLowerCase();
        valB = dB.toLowerCase();
      } else {
        valA = a[sortConfig.key as keyof StudySession] || 0;
        valB = b[sortConfig.key as keyof StudySession] || 0;
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [history, sortConfig, dungeons]);

  const filteredSessions = useMemo(() => {
    return sortedSessions.filter(session => {
      const dungeon = dungeons.find(d => d.id === session.dungeonId);
      const majorDungeon = dungeon?.parentId ? majorDungeons.find(m => m.id === dungeon.parentId) : null;
      const dungeonName = dungeon?.name || 'Free Study';
      const majorName = majorDungeon?.name || '';
      
      const matchesSearch = 
        dungeonName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        majorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (session.rewardName?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDungeon = filterDungeon === 'all' || session.dungeonId === filterDungeon;
      
      // Date Range Filter
      let matchesDate = true;
      const sessionDate = parseISO(session.timestamp);
      if (dateRange.start) {
        matchesDate = matchesDate && isAfter(sessionDate, startOfDay(parseISO(dateRange.start)));
      }
      if (dateRange.end) {
        matchesDate = matchesDate && isBefore(sessionDate, endOfDay(parseISO(dateRange.end)));
      }

      // Duration Filter
      let matchesDuration = true;
      if (durationRange.min) {
        matchesDuration = matchesDuration && session.duration >= parseInt(durationRange.min);
      }
      if (durationRange.max) {
        matchesDuration = matchesDuration && session.duration <= parseInt(durationRange.max);
      }

      return matchesSearch && matchesDungeon && matchesDate && matchesDuration;
    });
  }, [sortedSessions, dungeons, majorDungeons, searchTerm, filterDungeon, dateRange, durationRange]);

  const stats = useMemo(() => {
    return {
      totalTime: history.reduce((acc, s) => acc + s.duration, 0),
      totalGold: history.reduce((acc, s) => acc + s.coinsEarned, 0),
      totalXP: history.reduce((acc, s) => acc + s.xpEarned, 0),
    };
  }, [history]);

  return (
    <div className="w-full space-y-6 mt-12 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <History className="text-indigo-400" />
          Recent Sessions
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-bold",
              showFilters || filterDungeon !== 'all' || searchTerm 
                ? "bg-indigo-600 border-indigo-500 text-white" 
                : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
            )}
          >
            <Filter size={16} />
            Filter
            {(filterDungeon !== 'all' || searchTerm) && (
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="text"
                    placeholder="Search goal or reward..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  />
                </div>
                <select
                  value={filterDungeon}
                  onChange={(e) => setFilterDungeon(e.target.value)}
                  className="bg-slate-800 border-none rounded-xl py-2 px-4 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none flex-1"
                >
                  <option value="all">All Dungeons</option>
                  <option value="free_study">Free Study</option>
                  {dungeons.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Start Date</label>
                  <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full bg-slate-800 border-none rounded-xl py-2 px-4 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">End Date</label>
                  <input 
                    type="date" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full bg-slate-800 border-none rounded-xl py-2 px-4 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Min Duration (m)</label>
                  <input 
                    type="number" 
                    placeholder="Min"
                    value={durationRange.min}
                    onChange={(e) => setDurationRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full bg-slate-800 border-none rounded-xl py-2 px-4 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Max Duration (m)</label>
                  <input 
                    type="number" 
                    placeholder="Max"
                    value={durationRange.max}
                    onChange={(e) => setDurationRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full bg-slate-800 border-none rounded-xl py-2 px-4 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {(searchTerm || filterDungeon !== 'all' || dateRange.start || dateRange.end || durationRange.min || durationRange.max) && (
                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setFilterDungeon('all');
                      setDateRange({ start: '', end: '' });
                      setDurationRange({ min: '', max: '' });
                    }}
                    className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors flex items-center gap-1"
                  >
                    <X size={10} />
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-hidden border border-slate-800 rounded-3xl bg-slate-900/40 backdrop-blur-sm">
        <div className="overflow-x-auto">
          {filteredSessions.length === 0 ? (
            <div className="p-12 flex flex-col items-center text-center">
              <SearchX size={48} className="text-slate-700 mb-4" />
              <h4 className="text-slate-500 font-bold">No sessions found</h4>
              <p className="text-slate-600 text-sm mt-1">Try adjusting your filters or record a new session!</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50">
                  <th className="relative px-6 py-5 text-center" style={{ width: columnWidths.date }}>
                    <button 
                      onClick={() => handleSort('date')}
                      className="flex items-center justify-center gap-2.5 text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-400 transition-colors w-full"
                    >
                      <Calendar size={16} className="shrink-0" />
                      <span className="whitespace-nowrap">Date</span>
                      {sortConfig.key === 'date' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      )}
                    </button>
                    <div 
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-indigo-500/50"
                      onMouseDown={(e) => {
                        const startX = e.pageX;
                        const startWidth = columnWidths.date;
                        const moveHandler = (moveEvent: MouseEvent) => {
                          handleResize('date', startWidth + (moveEvent.pageX - startX));
                        };
                        const upHandler = () => {
                          window.removeEventListener('mousemove', moveHandler);
                          window.removeEventListener('mouseup', upHandler);
                        };
                        window.addEventListener('mousemove', moveHandler);
                        window.addEventListener('mouseup', upHandler);
                      }}
                    />
                  </th>
                  <th className="relative px-6 py-5 text-center" style={{ width: columnWidths.dungeon }}>
                    <button 
                      onClick={() => handleSort('dungeon')}
                      className="flex items-center justify-center gap-2.5 text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-400 transition-colors w-full"
                    >
                      <Sword size={16} className="shrink-0" />
                      <span className="whitespace-nowrap">Dungeon Goal</span>
                      {sortConfig.key === 'dungeon' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      )}
                    </button>
                    <div 
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-indigo-500/50"
                      onMouseDown={(e) => {
                        const startX = e.pageX;
                        const startWidth = columnWidths.dungeon;
                        const moveHandler = (moveEvent: MouseEvent) => {
                          handleResize('dungeon', startWidth + (moveEvent.pageX - startX));
                        };
                        const upHandler = () => {
                          window.removeEventListener('mousemove', moveHandler);
                          window.removeEventListener('mouseup', upHandler);
                        };
                        window.addEventListener('mousemove', moveHandler);
                        window.addEventListener('mouseup', upHandler);
                      }}
                    />
                  </th>
                  <th className="relative px-6 py-5 text-center" style={{ width: columnWidths.duration }}>
                    <button 
                      onClick={() => handleSort('duration')}
                      className="flex items-center justify-center gap-2.5 text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-400 transition-colors w-full"
                    >
                      <Clock size={16} className="shrink-0" />
                      <span className="whitespace-nowrap">Duration</span>
                      {sortConfig.key === 'duration' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      )}
                    </button>
                    <div 
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-indigo-500/50"
                      onMouseDown={(e) => {
                        const startX = e.pageX;
                        const startWidth = columnWidths.duration;
                        const moveHandler = (moveEvent: MouseEvent) => {
                          handleResize('duration', startWidth + (moveEvent.pageX - startX));
                        };
                        const upHandler = () => {
                          window.removeEventListener('mousemove', moveHandler);
                          window.removeEventListener('mouseup', upHandler);
                        };
                        window.addEventListener('mousemove', moveHandler);
                        window.addEventListener('mouseup', upHandler);
                      }}
                    />
                  </th>
                  <th className="relative px-6 py-5 text-center" style={{ width: columnWidths.reward }}>
                    <div className="flex items-center justify-center gap-2.5 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                      <Trophy size={16} className="shrink-0" />
                      <span className="whitespace-nowrap">Reward</span>
                    </div>
                    <div 
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-indigo-500/50"
                      onMouseDown={(e) => {
                        const startX = e.pageX;
                        const startWidth = columnWidths.reward;
                        const moveHandler = (moveEvent: MouseEvent) => {
                          handleResize('reward', startWidth + (moveEvent.pageX - startX));
                        };
                        const upHandler = () => {
                          window.removeEventListener('mousemove', moveHandler);
                          window.removeEventListener('mouseup', upHandler);
                        };
                        window.addEventListener('mousemove', moveHandler);
                        window.addEventListener('mouseup', upHandler);
                      }}
                    />
                  </th>
                  <th className="relative px-6 py-5 text-center" style={{ width: columnWidths.gains }}>
                    <div className="flex items-center justify-center gap-2.5 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                      <Zap size={16} className="shrink-0" />
                      <span className="whitespace-nowrap">Gains</span>
                    </div>
                    <div 
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-indigo-500/50"
                      onMouseDown={(e) => {
                        const startX = e.pageX;
                        const startWidth = columnWidths.gains;
                        const moveHandler = (moveEvent: MouseEvent) => {
                          handleResize('gains', startWidth + (moveEvent.pageX - startX));
                        };
                        const upHandler = () => {
                          window.removeEventListener('mousemove', moveHandler);
                          window.removeEventListener('mouseup', upHandler);
                        };
                        window.addEventListener('mousemove', moveHandler);
                        window.addEventListener('mouseup', upHandler);
                      }}
                    />
                  </th>
                  <th className="px-6 py-5 text-center" style={{ width: columnWidths.actions }}>
                    <div className="flex items-center justify-center text-[11px] font-black text-slate-500 uppercase tracking-widest">
                      <span className="whitespace-nowrap">Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <AnimatePresence mode="popLayout">
                  {filteredSessions.slice(0, 50).map((session) => {
                    const dungeon = dungeons.find(d => d.id === session.dungeonId);
                    const majorDungeon = dungeon?.parentId ? majorDungeons.find(m => m.id === dungeon.parentId) : null;
                    
                    return (
                      <motion.tr
                        layout
                        key={session.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-indigo-500/5 transition-colors"
                      >
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-[10px] sm:text-xs font-bold text-slate-400">
                            {format(parseISO(session.timestamp), 'MM/dd HH:mm')}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                             <div className="flex flex-col min-w-0">
                               {majorDungeon && (
                                 <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 truncate">
                                   {majorDungeon.name}
                                 </span>
                               )}
                               <span className="text-xs sm:text-sm font-bold text-white truncate">
                                 {dungeon?.name || 'Free Study'}
                               </span>
                             </div>
                           </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-col items-center">
                             <div className="text-[10px] sm:text-xs font-bold text-slate-300">
                               <span className="text-indigo-400">{session.focusDuration || 0} min</span>
                               <span className="text-slate-500"> + </span>
                               <span className="text-emerald-400">{session.restDuration || 0} min</span>
                             </div>
                           </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-center">
                          {session.rewardName ? (
                            <div className="flex items-center justify-center gap-2 overflow-hidden">
                              <button 
                                onClick={() => setViewingRewardName(session.rewardName || null)}
                                className="text-[10px] sm:text-xs font-bold text-amber-500/90 hover:text-amber-400 truncate underline decoration-amber-500/30 underline-offset-2 transition-colors cursor-pointer"
                                title="Click to view details"
                              >
                                {session.rewardName}
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] sm:text-xs text-slate-600 italic pr-1">None</span>
                          )}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-center text-[9px] sm:text-[10px]">
                          <div className="flex flex-col items-center">
                            <span className="font-black text-emerald-400">+{session.xpEarned}X</span>
                            <span className="font-black text-amber-400">+{session.coinsEarned}G</span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                            <button
                              onClick={() => setEditingSession(session)}
                              className="p-1.5 sm:p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                              title="Edit Session"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this session? This will revert dungeon progress.')) {
                                  deleteSession(session.id);
                                }
                              }}
                              className="p-1.5 sm:p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                              title="Delete Session"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingSession && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 w-full max-w-md rounded-3xl border border-slate-700 overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Edit2 className="text-indigo-400" />
                  Edit Session
                </h3>
                <button onClick={() => setEditingSession(null)} className="text-slate-500 hover:text-white">
                  <X />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Dungeon</label>
                  <select
                    value={editingSession.dungeonId}
                    onChange={(e) => setEditingSession({ ...editingSession, dungeonId: e.target.value })}
                    className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="free_study">Free Study</option>
                    {dungeons.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Dungeon Start Time</label>
                  <input
                    type="datetime-local"
                    value={format(parseISO(editingSession.timestamp), "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) => setEditingSession({ ...editingSession, timestamp: new Date(e.target.value).toISOString() })}
                    className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-2 italic pr-1">Adjusting this helps the "Daily Activity" calculation in Record charts.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block text-indigo-400">Focus (m)</label>
                    <input
                      type="number"
                      value={editingSession.focusDuration || 0}
                      onChange={(e) => setEditingSession({ ...editingSession, focusDuration: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block text-emerald-400">Rest (m)</label>
                    <input
                      type="number"
                      value={editingSession.restDuration || 0}
                      onChange={(e) => setEditingSession({ ...editingSession, restDuration: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Total Duration (m)</label>
                  <input
                    type="number"
                    value={editingSession.duration}
                    onChange={(e) => setEditingSession({ ...editingSession, duration: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-2 italic pr-1">Note: Changing duration does NOT automatically adjust XP/Gold already earned.</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingSession(null)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      updateSession(editingSession.id, {
                        dungeonId: editingSession.dungeonId,
                        duration: editingSession.duration,
                        focusDuration: editingSession.focusDuration,
                        restDuration: editingSession.restDuration,
                        timestamp: editingSession.timestamp
                      });
                      setEditingSession(null);
                    }}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Reward Details Modal */}
      <AnimatePresence>
        {viewingRewardName && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
               onClick={() => setViewingRewardName(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 w-full max-w-sm rounded-3xl border border-amber-500/20 overflow-hidden shadow-2xl relative"
            >
              {(() => {
                const reward = rewardPool.find(r => r.name === viewingRewardName);
                
                return (
                  <>
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
                      <h3 className="text-xl font-bold text-amber-500 flex items-center gap-2">
                        <Trophy size={20} />
                        Reward Details
                      </h3>
                      <button onClick={() => setViewingRewardName(null)} className="text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="text-center">
                        <h4 className="text-lg font-black text-white mb-2">{viewingRewardName}</h4>
                        {reward ? (
                          <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            {reward.description}
                          </p>
                        ) : (
                          <div className="text-slate-400 text-sm italic py-4">
                            This reward is no longer in your active Loot Pool, or it is a custom item.
                          </div>
                        )}
                      </div>
                      
                      {reward && (
                        <div className="flex gap-2 justify-center pt-2">
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded",
                            reward.rarity === 'legendary' ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            reward.rarity === 'epic' ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                            reward.rarity === 'rare' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                            "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                          )}>
                            {reward.rarity}
                          </span>
                          <span className="bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-slate-700">
                            {reward.type === 'coins' ? 'Gold Coins' : 
                             reward.type === 'xp' ? 'Experience' : 
                             reward.type === 'item' ? 'Functional Item' : 'Text Entry'}
                          </span>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => setViewingRewardName(null)}
                        className="w-full mt-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
