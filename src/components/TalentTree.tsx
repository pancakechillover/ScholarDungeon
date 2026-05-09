import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Talent } from '../types';
import { TALENTS } from '../constants';
import { cn } from '../lib/utils';
import { TalentIcon } from './TalentIcon';
import { PageHeader } from './PageHeader';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  HelpCircle,
  Zap,
  Star,
  X
} from 'lucide-react';

interface TalentTreeProps {
  points: number;
  shards: number;
  unlockedIds: string[];
  activeIds: string[];
  onUnlock: (id: string, cost: number) => void;
  onToggle: (id: string) => void;
  talents?: Talent[];
}

export const TalentTree = React.memo<TalentTreeProps>(({
  points,
  shards,
  unlockedIds,
  activeIds,
  onUnlock,
  onToggle,
  talents = TALENTS
}) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('scholar_dungeon_talents_collapsed') === 'true';
  });
  const [showInfo, setShowInfo] = useState(false);

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextValue = !isCollapsed;
    setIsCollapsed(nextValue);
    localStorage.setItem('scholar_dungeon_talents_collapsed', String(nextValue));
  };

  const branches = [
    { id: 'A', name: 'Truth Crown', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', accent: 'bg-indigo-500' },
    { id: 'B', name: 'Golden Law', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', accent: 'bg-amber-500' },
    { id: 'C', name: 'Fate Dice', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', accent: 'bg-emerald-500' },
  ];

  const canUnlock = (talent: Talent) => {
    if (unlockedIds.includes(talent.id)) return false;
    if (points < talent.cost) return false;
    
    // Check previous tier in same branch
    if (talent.tier > 1) {
      const prevTier = talents.find(t => t.branch === talent.branch && t.tier === talent.tier - 1);
      if (prevTier && !unlockedIds.includes(prevTier.id)) return false;
    }
    
    return true;
  };

  return (
    <div className="p-6 space-y-8 relative">
      <PageHeader 
        title="Talent Tree"
        description="Customize your learning build"
        icon={Star}
        stats={[
          { label: 'Talent Points', value: points, icon: Zap, color: 'text-emerald-400' },
          { label: 'Talent Shards', value: `${shards}/3`, icon: Star, color: 'text-amber-400' }
        ]}
      >
        <div className="flex items-center gap-4 mt-4">
          <button 
            onClick={toggleCollapse}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors bg-slate-900/50 border border-slate-800"
            title={isCollapsed ? "Expand Tree" : "Collapse Tree"}
          >
            {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo(!showInfo);
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-bold uppercase tracking-widest border",
              showInfo 
                ? "bg-indigo-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]" 
                : "bg-slate-900/50 border-slate-800 text-slate-400 hover:text-indigo-400"
            )}
          >
            <HelpCircle size={18} />
            How to get points
          </button>
        </div>
      </PageHeader>

      <AnimatePresence>
        {showInfo && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-indigo-500/30 p-6 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-xl relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 rounded-xl">
                    <Star className="text-indigo-400" size={24} />
                  </div>
                  Talent System Guide
                </h3>
                <button onClick={() => setShowInfo(false)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-6">
                <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                  <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-2">The Rule of Three</p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Collect <span className="text-amber-400 font-bold">3 Talent Shards</span> to automatically forge <span className="text-indigo-400 font-bold">1 Talent Point</span>.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Zap className="text-emerald-400" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-white">Leveling Up</p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Points are granted at specific level milestones.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                      <Star className="text-amber-400" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-white">Finding Shards</p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Shards are rare drops in <span className="text-indigo-400">Dungeons</span> or won from the <span className="text-amber-400">Gacha</span>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                  <p className="text-xs text-amber-300 font-bold uppercase tracking-widest mb-2">Pro Tip: Customization</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Want more Talent Points? You can set them as rewards for clearing Dungeon Goals or reaching specific levels in <strong>Settings</strong>!
                  </p>
                </div>

                <button 
                  onClick={() => setShowInfo(false)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 mt-2"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className={cn(
        "grid gap-8 transition-all duration-500",
        isCollapsed ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
      )}>
        {branches.map(branch => (
          <div key={branch.id} className={cn(
            "flex flex-col rounded-3xl border transition-all duration-500", 
            branch.bg, 
            branch.border,
            isCollapsed ? "p-4" : "p-6 space-y-6"
          )}>
            {!isCollapsed && (
              <div className="text-center">
                <h3 className={cn("text-xl font-bold uppercase tracking-widest", branch.color)}>
                  {branch.name}
                </h3>
              </div>
            )}

            <div className={cn(
              "flex relative",
              isCollapsed ? "flex-row items-center gap-4" : "flex-col space-y-8"
            )}>
              {/* Connection Lines - Hidden when collapsed */}
              {!isCollapsed && (
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-700 -translate-x-1/2 z-0" />
              )}
              
              {isCollapsed && (
                <div className={cn("text-xs font-bold uppercase tracking-widest shrink-0", branch.color)}>
                  {branch.name.split(' ')[0]}
                </div>
              )}

              <div className={cn(
                "flex",
                isCollapsed ? "flex-row gap-3" : "flex-col space-y-8 w-full"
              )}>
                {talents.filter(t => t.branch === branch.id).sort((a, b) => a.tier - b.tier).map(talent => {
                  const isUnlocked = unlockedIds.includes(talent.id);
                  const isActive = activeIds.includes(talent.id);
                  const unlockable = canUnlock(talent);

                  return (
                    <div key={talent.id} className="group relative">
                      <motion.div
                        whileHover={unlockable || isUnlocked ? { scale: 1.05 } : {}}
                        className={cn(
                          "relative z-10 transition-all cursor-pointer",
                          isCollapsed 
                            ? "w-12 h-12 rounded-xl flex items-center justify-center border-2" 
                            : "p-4 rounded-2xl border-2",
                          isUnlocked 
                            ? isActive ? cn("bg-slate-800", branch.border.replace('border-', 'border-').replace('/30', '')) : "bg-slate-900 border-slate-600"
                            : unlockable ? "bg-slate-900 border-slate-700 hover:border-slate-400" : "bg-slate-950 border-slate-800 opacity-60"
                        )}
                        onClick={() => {
                          if (isUnlocked) onToggle(talent.id);
                          else if (unlockable) onUnlock(talent.id, talent.cost);
                        }}
                      >
                        {isCollapsed ? (
                          <div className={cn(
                            "transition-colors",
                            isUnlocked ? branch.color : "text-slate-600"
                          )}>
                            <TalentIcon iconName={talent.icon} size={24} />
                            {isActive && (
                              <div className={cn("absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900", branch.accent)} />
                            )}
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between mb-2">
                              <div className={cn("p-2 rounded-lg", isUnlocked ? branch.bg.replace('/10', '/20') + " " + branch.color : "bg-slate-800 text-slate-500")}>
                                <TalentIcon iconName={talent.icon} size={18} />
                              </div>
                              <div className="flex items-center gap-2">
                                {isActive && <CheckCircle2 size={18} className={branch.color} />}
                                {!isUnlocked && <div className="text-xs font-bold text-slate-500">{talent.cost} PT</div>}
                              </div>
                            </div>
                            
                            <h4 className={cn("font-bold mb-1", isUnlocked ? "text-white" : "text-slate-500")}>
                              {talent.name}
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {talent.description}
                            </p>

                            {isUnlocked && (
                              <div className="mt-3 flex items-center justify-between">
                                <span className={cn("text-xs font-bold uppercase px-2 py-0.5 rounded", isActive ? branch.accent + " text-white" : "bg-slate-700 text-slate-400")}>
                                  {isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>

                      {/* Tooltip for collapsed mode or hover info */}
                      <div className={cn(
                        "absolute z-[110] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none",
                        isCollapsed 
                          ? "bottom-full left-1/2 -translate-x-1/2 mb-3 w-48" 
                          : "bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 lg:bottom-auto lg:mb-0 lg:translate-x-0 lg:w-56",
                        !isCollapsed && branch.id === 'C' 
                          ? "lg:top-0 lg:right-full lg:mr-4" 
                          : !isCollapsed && "lg:top-0 lg:left-full lg:ml-4"
                      )}>
                        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl ring-1 ring-white/10">
                          <div className={cn("text-xs font-bold mb-1", branch.color)}>{talent.name}</div>
                          <p className="text-xs text-slate-300 leading-relaxed">{talent.description}</p>
                          {!isUnlocked && (
                            <div className="mt-2 text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                              <Lock size={10} />
                              Requires {talent.cost} PT
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
