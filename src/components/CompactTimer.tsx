import React from 'react';
import { motion } from 'motion/react';
import { Sword, Coffee } from 'lucide-react';
import { cn } from '../lib/utils';
import { Dungeon } from '../types';

interface CompactTimerProps {
  timeLeft: number;
  isActive: boolean;
  isResting: boolean;
  currentDungeon: Dungeon | null;
  duration: number;
}

export const CompactTimer: React.FC<CompactTimerProps> = ({
  timeLeft,
  isActive,
  isResting,
  currentDungeon,
  duration
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-slate-950 p-6 text-white font-sans overflow-hidden select-none">
      {/* Dungeon Progress */}
      {currentDungeon && (
        <div className="w-full mb-6 space-y-2">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <Sword size={14} className="text-indigo-400 shrink-0" />
              <span className="text-xs font-black truncate tracking-tight">{currentDungeon.name}</span>
            </div>
            <span className="text-[10px] font-black text-slate-500 tabular-nums shrink-0">
              {currentDungeon.completedSessions}/{currentDungeon.totalSessions}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <motion.div 
              initial={false}
              animate={{ width: `${(currentDungeon.completedSessions / currentDungeon.totalSessions) * 100}%` }}
              className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            />
          </div>
        </div>
      )}

      {/* Countdown Module */}
      <div className="relative flex flex-col items-center">
        <div className="text-7xl font-black font-mono tracking-tighter tabular-nums text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          {formatTime(timeLeft)}
        </div>
        
        <div className={cn(
          "mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border shadow-lg",
          isResting 
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
            : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
          isActive ? "animate-pulse" : ""
        )}>
          {isResting ? <Coffee size={12} strokeWidth={3} /> : <Sword size={12} strokeWidth={3} />}
          {isResting ? "Resting" : "Exploring"}
        </div>
      </div>

      {!currentDungeon && (
        <div className="mt-8 text-slate-600 text-[10px] font-bold uppercase tracking-widest bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800/50">
          Free Session
        </div>
      )}
    </div>
  );
};
