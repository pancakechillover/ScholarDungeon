import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scroll, 
  CheckCircle2, 
  Clock, 
  Package, 
  Trophy, 
  Filter, 
  Calendar, 
  Search,
  ChevronDown,
  Coins,
  Zap,
  Circle,
  History,
  Tag
} from 'lucide-react';
import { RewardHistoryItem } from '../types';
import { cn } from '../lib/utils';
import { PageHeader } from './PageHeader';
import { format, isWithinInterval, subDays, startOfDay, endOfDay } from 'date-fns';

interface RewardHistoryProps {
  history: RewardHistoryItem[];
  onToggleRedeemed: (id: string) => void;
}

type FilterTab = 'all' | 'treasures' | 'custom';
type TimeRange = 'all' | 'today' | '7d' | '30d';
type SourceFilter = 'all' | 'Explore' | 'Gacha' | 'Shop' | 'LevelUp';
type StatusFilter = 'all' | 'redeemed' | 'pending';

export const RewardHistory: React.FC<RewardHistoryProps> = ({ history, onToggleRedeemed }) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      // Tab Filtering
      if (activeTab === 'treasures' && item.type === 'text') return false;
      if (activeTab === 'custom' && item.type !== 'text') return false;

      // Search Filtering
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      // Time Filtering
      if (timeRange !== 'all') {
        const itemDate = new Date(item.timestamp);
        const now = new Date();
        let start;
        if (timeRange === 'today') start = startOfDay(now);
        else if (timeRange === '7d') start = startOfDay(subDays(now, 7));
        else start = startOfDay(subDays(now, 30));
        
        if (!isWithinInterval(itemDate, { start, end: endOfDay(now) })) return false;
      }

      // Source Filtering
      if (sourceFilter !== 'all' && item.source !== sourceFilter) return false;

      // Status Filtering
      if (statusFilter !== 'all') {
        const isRedeemed = item.redeemed;
        if (statusFilter === 'redeemed' && !isRedeemed) return false;
        if (statusFilter === 'pending' && isRedeemed) return false;
      }

      return true;
    });
  }, [history, activeTab, timeRange, sourceFilter, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const treasures = history.filter(i => i.type !== 'text').length;
    const custom = history.filter(i => i.type === 'text').length;
    const pending = history.filter(i => i.type === 'text' && !i.redeemed).length;
    return { treasures, custom, pending };
  }, [history]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Reward Vault"
        description="Manage your treasures and custom rewards."
        icon={History}
        stats={[
          { label: 'Treasures', value: stats.treasures, icon: Trophy, color: 'text-amber-400' },
          { label: 'Custom', value: stats.custom, icon: Scroll, color: 'text-indigo-400' }
        ]}
      />

      {/* Tabs & Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800 w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === 'all' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
            )}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('treasures')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === 'treasures' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
            )}
          >
            Treasures
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === 'custom' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
            )}
          >
            Custom
          </button>
        </div>

        <div className="flex-grow flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search rewards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "px-4 rounded-2xl border transition-all flex items-center gap-2",
              showFilters ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            )}
          >
            <Filter size={18} />
            <span className="hidden sm:inline text-xs font-bold uppercase">Filters</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-slate-900/30 rounded-3xl border border-slate-800/50">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={12} /> Time Range
                </label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Tag size={12} /> Source
                </label>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value as SourceFilter)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="all">All Sources</option>
                  <option value="Explore">Explore</option>
                  <option value="Gacha">Gacha</option>
                  <option value="Shop">Shop</option>
                  <option value="LevelUp">Level Up</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={12} /> Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="redeemed">Redeemed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
            <Scroll size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 font-medium">No rewards match your filters.</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "group relative bg-slate-900 border border-slate-800 rounded-2xl p-4 transition-all",
                item.type === 'text' ? "hover:border-indigo-500/50" : "hover:border-slate-700"
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center border shrink-0",
                    (() => {
                      const r = item.rarity.toUpperCase();
                      if (r.includes('LASTONE')) return "bg-rose-900/30 border-rose-500/30 text-rose-400";
                      if (r.includes('EPIC') || r.includes('SR') || r.includes('B')) return "bg-purple-900/30 border-purple-500/30 text-purple-400";
                      if (r.includes('COMMON') || r.includes('D')) return "bg-slate-800 border-slate-700 text-slate-400";
                      if (r.includes('RARE') || r.includes('C') || r === 'R') return "bg-blue-900/30 border-blue-500/30 text-blue-400";
                      return "bg-amber-900/30 border-amber-500/30 text-amber-400";
                    })()
                  )}>
                    {item.type === 'coins' ? <Coins size={20} className="text-amber-400" /> :
                     item.type === 'xp' ? <Zap size={20} className="text-indigo-400" /> :
                     item.type === 'item' ? (
                       item.itemType === 'talent_shard' ? <Trophy size={20} className="text-purple-400" /> :
                       item.itemType === 'death_defying_medal' ? <Trophy size={20} className="text-amber-400" /> :
                       <Package size={20} className="text-indigo-400" />
                     ) :
                     <Scroll size={20} className="text-slate-400" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {item.name}
                      </h4>
                      {item.amount && item.amount > 1 && item.type !== 'coins' && item.type !== 'xp' && item.itemType !== 'xp_bonus_percent' && item.itemType !== 'coin_bonus_percent' && (
                        <span className="text-xs font-black text-indigo-400">x{item.amount}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.type === 'coins' ? `Found ${item.amount} gold coins` :
                       item.type === 'xp' ? `Gained ${item.amount} experience points` :
                       item.type === 'item' ? (
                         item.itemType === 'double_xp' ? "Double XP for next session" :
                         item.itemType === 'double_coin' ? "Double Coins for next session" :
                         item.itemType === 'talent_shard' ? "Used to unlock powerful talents" :
                         item.itemType === 'death_defying_medal' ? "Prevents streak loss once" :
                         item.itemType === 'xp_bonus_percent' ? `+${item.amount}% XP for next session` :
                         item.itemType === 'coin_bonus_percent' ? `+${item.amount}% Coins for next session` :
                         "Special dungeon item"
                       ) : "Custom reward message"}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                      <span className={cn(
                        "text-xs font-bold uppercase px-1.5 py-0.5 rounded",
                        (() => {
                          const r = item.rarity.toUpperCase();
                          if (r.includes('LASTONE')) return "bg-rose-600 text-white";
                          if (r.includes('EPIC') || r.includes('SR') || r.includes('B')) return "bg-purple-600 text-white";
                          if (r.includes('COMMON') || r.includes('D')) return "bg-slate-800 text-slate-400";
                          if (r.includes('RARE') || r.includes('C') || r === 'R') return "bg-blue-600 text-white";
                          return "bg-amber-500 text-slate-900";
                        })()
                      )}>
                        {item.rarity}
                      </span>
                      <span className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
                        <Clock size={10} />
                        {format(new Date(item.timestamp), 'MMM d, yyyy')}
                      </span>
                      <span className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
                        <Tag size={10} />
                        {item.source}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-3">
                  {item.type === 'text' ? (
                    <button
                      onClick={() => onToggleRedeemed(item.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all",
                        item.redeemed 
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" 
                          : "bg-slate-800 border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-indigo-400"
                      )}
                    >
                      {item.redeemed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      <span className="text-xs font-black uppercase tracking-wider">
                        {item.redeemed ? 'Completed' : 'Mark Done'}
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 text-slate-500 rounded-full border border-slate-700/50">
                      <CheckCircle2 size={14} />
                      <span className="text-xs font-black uppercase tracking-wider italic">Auto-Redeemed</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
