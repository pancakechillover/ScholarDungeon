import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Sparkles, Star, Gift, Crown } from 'lucide-react';
import { cn } from '../lib/utils';

interface GachaResult {
  item: string;
  rarity: string;
}

interface GachaResultModalProps {
  results: GachaResult[];
  onClose: () => void;
}

export const GachaResultModal: React.FC<GachaResultModalProps> = ({ results, onClose }) => {
  const isMulti = results.length > 1;

  const getRarityStyles = (rarity: string, isTenPull: boolean) => {
    const r = rarity.toUpperCase();
    const iconSize = isTenPull ? 20 : 32;
    const lastOneIconSize = isTenPull ? 24 : 40;

    if (r === 'LASTONE') {
      return {
        bg: 'bg-slate-950',
        border: 'border-rose-500',
        text: 'text-rose-400',
        accent: 'bg-rose-500',
        glow: 'shadow-[0_0_60px_rgba(244,63,94,0.6)]',
        icon: <Crown className="text-rose-400" size={lastOneIconSize} />,
        gradient: 'from-rose-500/30 via-transparent to-rose-950/30',
        label: 'LAST ONE PRIZE'
      };
    }
    
    if (r.includes('EPIC') || r.includes('SR') || r.includes('B')) {
      return {
        bg: 'bg-slate-950',
        border: 'border-purple-500',
        text: 'text-purple-400',
        accent: 'bg-purple-500',
        glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]',
        icon: <Sparkles className="text-purple-400" size={iconSize} />,
        gradient: 'from-purple-500/20 via-transparent to-purple-900/20'
      };
    }
    
    if (r.includes('RARE') || r.includes('C') || r === 'R') {
      return {
        bg: 'bg-slate-950',
        border: 'border-blue-500',
        text: 'text-blue-400',
        accent: 'bg-blue-500',
        glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]',
        icon: <Star className="text-blue-400" size={iconSize} />,
        gradient: 'from-blue-500/20 via-transparent to-blue-900/20'
      };
    }

    if (r.includes('COMMON') || r.includes('D')) {
      return {
        bg: 'bg-slate-950',
        border: 'border-slate-700',
        text: 'text-slate-400',
        accent: 'bg-slate-700',
        glow: '',
        icon: <Gift className="text-slate-500" size={iconSize} />,
        gradient: 'from-slate-700/10 via-transparent to-slate-900/10'
      };
    }

    // Default to A / SSR / LASTONE
    return {
      bg: 'bg-slate-950',
      border: 'border-amber-400',
      text: 'text-amber-400',
      accent: 'bg-amber-400',
      glow: 'shadow-[0_0_40px_rgba(251,191,36,0.4)]',
      icon: <Crown className="text-amber-400" size={iconSize} />,
      gradient: 'from-amber-400/20 via-transparent to-amber-900/20'
    };
  };

  const isTenPull = results.length === 10;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-start justify-center p-4 bg-black/95 backdrop-blur-2xl overflow-y-auto custom-scrollbar"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-7xl py-12 min-h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6 sm:mb-12 relative">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block"
          >
            <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tighter italic uppercase mb-2 drop-shadow-2xl">
              {isMulti ? 'Summoning Results' : 'New Treasure!'}
            </h2>
            <div className="h-1 w-12 sm:w-24 bg-indigo-500 mx-auto rounded-full mb-2 sm:mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">The vault has opened</p>
          </motion.div>
        </div>

        <div className={cn(
          "px-4 max-w-7xl mx-auto pb-12 w-full",
          isTenPull 
            ? "grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 md:gap-6" 
            : "flex flex-wrap gap-4 sm:gap-8 justify-center",
          results.length === 1 ? "items-center" : "content-start"
        )}>
          {results.map((res, idx) => {
            const styles = getRarityStyles(res.rarity, isTenPull);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5, y: 50, rotateY: -180 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
                transition={{ 
                  delay: 0.1 + idx * 0.05, 
                  type: 'spring', 
                  stiffness: 100, 
                  damping: 15 
                }}
                className={cn(
                  "relative group aspect-[2/3] transition-all duration-500",
                  isTenPull 
                    ? "w-full rounded-xl sm:rounded-[2rem] p-[1px] sm:p-[2px]" 
                    : "w-[160px] sm:w-[200px] md:w-[220px] rounded-[2rem] p-[2px]",
                  styles.accent,
                  styles.glow,
                  res.rarity === 'LastOne' && "z-20"
                )}
              >
                {res.rarity === 'LastOne' && (
                  <div className={cn(
                    "absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 z-30 bg-rose-600 text-white px-2 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs font-black tracking-widest shadow-xl border border-rose-400 animate-bounce whitespace-nowrap"
                  )}>
                    LAST ONE
                  </div>
                )}
                <div className={cn(
                  "h-full w-full flex flex-col items-center relative overflow-hidden",
                  isTenPull 
                    ? "rounded-[calc(0.75rem-1px)] sm:rounded-[1.9rem] p-2 sm:p-6" 
                    : "rounded-[1.9rem] p-6",
                  styles.bg
                )}>
                  {/* Card Background Pattern */}
                  <div className={cn("absolute inset-0 opacity-30 bg-gradient-to-br", styles.gradient)} />
                  <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                  {/* Top Rarity Badge */}
                  <div className={cn(
                    "px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-black tracking-widest uppercase border relative z-10 mb-1 sm:mb-2",
                    styles.text,
                    styles.border
                  )}>
                    {res.rarity}
                  </div>

                  {/* Content Area - Adjusted for higher text */}
                  <div className={cn(
                    "flex-1 flex flex-col items-center w-full relative z-10",
                    isTenPull ? "pt-1 sm:pt-4" : "pt-4"
                  )}>
                    {/* Icon - Slightly smaller to give room */}
                    <div className={cn("relative", isTenPull ? "mb-1 sm:mb-4" : "mb-4")}>
                      <motion.div
                        animate={{ 
                          y: [0, -4, 0],
                          filter: ["brightness(1)", "brightness(1.4)", "brightness(1)"]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {styles.icon}
                      </motion.div>
                      
                      {/* Glow behind icon */}
                      <div className={cn(
                        "absolute inset-0 blur-xl sm:blur-2xl opacity-20 rounded-full -z-10",
                        styles.accent
                      )} />
                    </div>

                    {/* Reward Text - Moved Higher */}
                    <div className="w-full text-center px-0.5 sm:px-1">
                      <h3 className={cn(
                        "font-black leading-tight uppercase italic mb-1 sm:mb-2 line-clamp-4",
                        isTenPull 
                          ? "text-xs sm:text-sm md:text-base" 
                          : "text-xs sm:text-sm md:text-base",
                        styles.text
                      )}>
                        {res.item}
                      </h3>
                      <div className={cn("h-0.5 w-4 sm:w-6 mx-auto rounded-full", styles.accent)} />
                    </div>
                  </div>

                  {/* Decorative Corners */}
                  <div className={cn("absolute top-4 left-4 w-2 h-2 border-t-2 border-l-2 opacity-30", styles.border)} />
                  <div className={cn("absolute top-4 right-4 w-2 h-2 border-t-2 border-r-2 opacity-30", styles.border)} />
                  <div className={cn("absolute bottom-4 left-4 w-2 h-2 border-b-2 border-l-2 opacity-30", styles.border)} />
                  <div className={cn("absolute bottom-4 right-4 w-2 h-2 border-b-2 border-r-2 opacity-30", styles.border)} />

                  {/* Hover Shine */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-8 sm:mt-16 flex flex-col items-center gap-4"
        >
          <button
            onClick={onClose}
            className="group relative px-8 sm:px-16 py-3 sm:py-5 bg-indigo-600 text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.2em] text-xs sm:text-base hover:bg-indigo-500 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-indigo-500/40 overflow-hidden"
          >
            <span className="relative z-10">Claim All Rewards</span>
          </button>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Click anywhere to dismiss</p>
        </motion.div>
      </motion.div>
    </div>
  );
};
