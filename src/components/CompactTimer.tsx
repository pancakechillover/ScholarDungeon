import React from 'react';
import { motion } from 'motion/react';
import { Sword, Coffee, Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { cn } from '../lib/utils';
import { Dungeon } from '../types';

interface CompactTimerProps {
  timeLeft: number; // Used as fallback or initial
  endTime: number | null;
  isActive: boolean;
  isResting: boolean;
  currentDungeon: Dungeon | null;
  duration: number;
  toggleTimer: () => void;
  resetTimer: () => void;
  skipSession: () => void;
}

export const CompactTimer: React.FC<CompactTimerProps> = ({
  timeLeft,
  endTime,
  isActive,
  isResting,
  currentDungeon,
  duration,
  toggleTimer,
  resetTimer,
  skipSession
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [displayTime, setDisplayTime] = React.useState(timeLeft);

  React.useEffect(() => {
    setDisplayTime(timeLeft);
  }, [timeLeft]); // Sync when main thread ticks or prop changes

  React.useEffect(() => {
    if (!isActive || !endTime) return;
    
    // We want to tick locally inside the PIP window to avoid main-window background throttling
    const win = containerRef.current?.ownerDocument.defaultView || window;
    
    let reqId: number;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setDisplayTime(remaining);
      reqId = win.requestAnimationFrame(tick);
    };
    
    reqId = win.requestAnimationFrame(tick);
    
    return () => {
      win.cancelAnimationFrame(reqId);
    };
  }, [isActive, endTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center h-[100dvh] w-[100dvw] bg-slate-950 p-6 text-white font-sans overflow-hidden select-none">
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
        <div className="text-6xl font-black font-mono tracking-tighter tabular-nums text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          {formatTime(displayTime)}
        </div>
        
        <div className={cn(
            "font-bold uppercase tracking-widest text-xs mt-2 flex items-center gap-1",
            isResting ? "text-emerald-500" : "text-indigo-400"
          )}>
          {(() => {
            const statusText = (isResting ? (isActive ? 'Resting...' : 'Ready to Rest') : (isActive ? 'Exploring...' : 'Ready to Delve'));
            const charArray = statusText.split('');
            const totalItems = charArray.length + 1; // +1 for the icon
            const animationDuration = 0.6;
            const repeatDelay = (totalItems - 1) * animationDuration;

            return (
              <>
                <motion.span
                  animate={isActive ? { y: [0, -8, 0] } : { y: 0 }}
                  transition={{
                    duration: animationDuration,
                    repeat: isActive ? Infinity : 0,
                    ease: "easeInOut",
                    delay: 0,
                    repeatDelay: repeatDelay
                  }}
                  className="inline-block mr-1"
                >
                  {isResting ? <Coffee size={14} /> : <Sword size={14} />}
                </motion.span>
                {charArray.map((char, i) => (
                  <motion.span
                    key={i}
                    animate={isActive ? { y: [0, -8, 0] } : { y: 0 }}
                    transition={{
                      duration: animationDuration,
                      repeat: isActive ? Infinity : 0,
                      ease: "easeInOut",
                      delay: (i + 1) * animationDuration, // Delay based on its position in sequence
                      repeatDelay: repeatDelay
                    }}
                    className="inline-block flex-shrink-0 whitespace-pre"
                  >
                    {char}
                  </motion.span>
                ))}
              </>
            );
          })()}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-6 mt-8 [@media(max-height:250px)]:hidden">
        <button
          onClick={resetTimer}
          className="p-3 bg-slate-900 text-slate-400 hover:text-white rounded-full border border-slate-800 transition-all"
          title="Reset Timer"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={toggleTimer}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-2xl shrink-0 outline-none",
            isActive 
              ? (isResting ? "bg-slate-900 text-emerald-500 border-2 border-emerald-500" : "bg-slate-900 text-indigo-500 border-2 border-indigo-500") 
              : (isResting ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-indigo-600 text-white hover:bg-indigo-500")
          )}
        >
          {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        <button
          onClick={skipSession}
          className="p-3 bg-slate-900 text-slate-400 hover:text-white rounded-full border border-slate-800 transition-all"
          title="Skip Session"
        >
          <SkipForward size={20} />
        </button>
      </div>

    </div>
  );
};
