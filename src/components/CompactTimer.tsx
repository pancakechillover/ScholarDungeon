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
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const isCondensed = dimensions.height < 240 || dimensions.width < 180;

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
    <div ref={containerRef} className={cn(
      "flex flex-col items-center justify-start h-[100dvh] w-[100dvw] bg-slate-950 text-white font-sans overflow-hidden select-none",
      isCondensed ? "p-3" : "p-6"
    )}>
      {/* Session Progress */}
      <div className={cn("w-full space-y-1", isCondensed ? "mb-2" : "mb-6")}>
        <div className="flex justify-between items-end px-1">
          <div className="flex flex-col">
            {!isCondensed && (
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">Current Session</span>
            )}
            <span className={cn("font-black truncate tracking-tight", isCondensed ? "text-[10px]" : "text-xs")}>
              {isResting ? 'Recovery' : 'Exploration'} Target: {duration}m
            </span>
          </div>
          <span className={cn("font-black text-indigo-400 tabular-nums shrink-0", isCondensed ? "text-[8px]" : "text-[10px]")}>
            {Math.floor(Math.min(100, ((duration * 60 - displayTime) / (duration * 60)) * 100))}%
          </span>
        </div>
        <div className={cn("w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800", isCondensed ? "h-1" : "h-2")}>
          <motion.div 
            initial={false}
            animate={{ width: `${Math.min(100, ((duration * 60 - displayTime) / (duration * 60)) * 100)}%` }}
            className={cn(
              "h-full transition-colors duration-500",
              isResting ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            )}
          />
        </div>
      </div>

      {/* Dungeon Progress */}
      {currentDungeon && (
        <div className={cn("w-full space-y-1", isCondensed ? "mb-3" : "mb-6")}>
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Sword size={isCondensed ? 10 : 14} className="text-indigo-400 shrink-0" />
              <span className={cn("font-black truncate tracking-tight", isCondensed ? "text-[10px]" : "text-xs")}>{currentDungeon.name}</span>
            </div>
            <span className={cn("font-black text-slate-500 tabular-nums shrink-0", isCondensed ? "text-[8px]" : "text-[10px]")}>
              {currentDungeon.completedSessions}/{currentDungeon.totalSessions}
            </span>
          </div>
          <div className={cn("w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800", isCondensed ? "h-1" : "h-1.5")}>
            <motion.div 
              initial={false}
              animate={{ width: `${(currentDungeon.completedSessions / currentDungeon.totalSessions) * 100}%` }}
              className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            />
          </div>
        </div>
      )}

      {/* Countdown Module */}
      <div className={cn("relative flex items-center w-full", isCondensed ? "flex-row justify-between px-2" : "flex-col")}>
        <div className="flex flex-col items-center">
          <div className={cn(
            "font-black font-mono tracking-tighter tabular-nums text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]",
            isCondensed ? "text-4xl" : "text-6xl"
          )}>
            {formatTime(displayTime)}
          </div>
          
          <div className={cn(
              "font-bold uppercase tracking-widest flex items-center gap-1",
              isCondensed ? "text-[8px] mt-0.5" : "text-xs mt-2",
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
                    {isResting ? <Coffee size={isCondensed ? 10 : 14} /> : <Sword size={isCondensed ? 10 : 14} />}
                  </motion.span>
                  {!isCondensed && charArray.map((char, i) => (
                    <motion.span
                      key={i}
                      animate={isActive ? { y: [0, -8, 0] } : { y: 0 }}
                      transition={{
                        duration: animationDuration,
                        repeat: isActive ? Infinity : 0,
                        ease: "easeInOut",
                        delay: (i + 1) * animationDuration,
                        repeatDelay: repeatDelay
                      }}
                      className="inline-block flex-shrink-0 whitespace-pre"
                    >
                      {char}
                    </motion.span>
                  ))}
                  {isCondensed && <span>{statusText.replace('...', '')}</span>}
                </>
              );
            })()}
          </div>
        </div>

        {/* Controls (Condensed Mode - Right Side) */}
        {isCondensed && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={resetTimer}
                className="p-1.5 bg-slate-900 text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-all"
                title="Reset"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={skipSession}
                className="p-1.5 bg-slate-900 text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-all"
                title="Skip"
              >
                <SkipForward size={14} />
              </button>
            </div>
            <button
              onClick={toggleTimer}
              className={cn(
                "h-8 w-full rounded-lg flex items-center justify-center transition-all bg-indigo-600 text-white",
                isActive 
                  ? (isResting ? "bg-emerald-600/20 border border-emerald-500/50 text-emerald-400" : "bg-indigo-600/20 border border-indigo-500/50 text-indigo-400") 
                  : (isResting ? "bg-emerald-600" : "bg-indigo-600")
              )}
            >
              {isActive ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            </button>
          </div>
        )}
      </div>

      {/* Controls (Standard Mode - Bottom) */}
      {!isCondensed && (
        <div className="flex items-center space-x-6 mt-8">
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
      )}

    </div>
  );
};
