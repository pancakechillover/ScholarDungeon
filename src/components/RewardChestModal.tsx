import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RewardCard, StudySession, Rarity } from '../types';
import { cn } from '../lib/utils';
import { triggerSimpleConfetti } from '../lib/effects';
import { X, Sparkles, Trophy, Zap, Coins, Clock, Target } from 'lucide-react';
import { TreasureChestIcon } from './icons/TreasureChestIcon';
import { createPortal } from 'react-dom';
import { useScrollLock } from '../hooks/useScrollLock';

interface RewardChestModalProps {
  chest: { session: StudySession; choices: RewardCard[] }[];
  onSelect: (reward: RewardCard | null, sessionId: string) => void;
  onClose: () => void;
}

export const RewardChestModal: React.FC<RewardChestModalProps> = ({ chest, onSelect, onClose }) => {
  useScrollLock(true);
  
  const getRarityValue = (r: Rarity) => {
    switch(r) {
      case 'mythic': return 6;
      case 'legendary': return 5;
      case 'epic': return 4;
      case 'rare': return 3;
      case 'uncommon': return 2;
      default: return 1;
    }
  };

  const handleAutoPickBest = () => {
    chest.forEach(item => {
      if (item.choices.length > 0) {
        const sorted = [...item.choices].sort((a, b) => getRarityValue(b.rarity) - getRarityValue(a.rarity));
        onSelect(sorted[0], item.session.id);
      } else {
        onSelect(null, item.session.id);
      }
    });
    triggerSimpleConfetti();
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4 overflow-y-auto overflow-x-hidden border-0 m-0 p-0">
        <motion.div
           initial={{ scale: 0.95, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           exit={{ scale: 0.95, opacity: 0 }}
           className="bg-slate-900 border border-slate-700/50 rounded-3xl w-full max-w-4xl shadow-2xl relative my-8"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-800 tracking-tight">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                <TreasureChestIcon size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Reward Chest</h3>
                <p className="text-sm text-slate-400">{chest.length} pending session{chest.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleAutoPickBest}
                disabled={chest.length === 0}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles size={16} />
                <span>Auto-Pick Best for All</span>
              </button>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto overflow-x-hidden custom-scrollbar space-y-6">
            {chest.length === 0 ? (
              <div className="text-center text-slate-500 py-12">
                <TreasureChestIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p>The chest is empty.</p>
              </div>
            ) : (
              chest.map((item, idx) => (
                <div key={item.session.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 md:p-6 pb-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn("p-2 rounded-full border", item.session.isCrit ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400")}>
                       <Trophy size={20} />
                    </div>
                    <div>
                      <h4 className={cn("font-bold", item.session.isCrit ? "text-amber-400" : "text-white")}>
                        {item.session.isCrit ? 'Critical Victory' : 'Victory Sequence'}
                      </h4>
                      <div className="flex gap-4 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><Zap size={12} className="text-emerald-400" /> +{item.session.xpEarned} XP</span>
                        <span className="flex items-center gap-1"><Coins size={12} className="text-amber-400" /> +{item.session.coinsEarned} Gold</span>
                        <span className="flex items-center gap-1"><Clock size={12} className="text-indigo-400" /> {item.session.duration}m</span>
                        <span className="flex items-center gap-1"><Target size={12} className="text-rose-400" /> {item.session.focusDuration || '??'}m Goal</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                    {item.choices.map((card, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => { triggerSimpleConfetti(); onSelect(card, item.session.id); }}
                        className={cn(
                          "relative p-4 rounded-2xl border bg-slate-900/50 text-left transition-all hover:-translate-y-1 hover:shadow-lg overflow-hidden group cursor-pointer h-full flex flex-col justify-between min-h-[160px]",
                          card.rarity === 'mythic' && "border-rose-500/50 hover:border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]",
                          card.rarity === 'legendary' && "border-amber-400/50 hover:border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.15)]",
                          card.rarity === 'epic' && "border-purple-500/50 hover:border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]",
                          card.rarity === 'rare' && "border-blue-400/40 hover:border-blue-400/70",
                          card.rarity === 'uncommon' && "border-emerald-500/40 hover:border-emerald-400/70",
                          card.rarity === 'common' && "border-slate-700 hover:border-slate-500"
                        )}
                      >
                         <div>
                          <div className={cn("text-[10px] font-black uppercase tracking-widest mb-2 inline-block px-2 py-0.5 rounded-sm",
                               card.rarity === 'mythic' ? "bg-rose-500/20 text-rose-400" :
                               card.rarity === 'legendary' ? "bg-amber-400/20 text-amber-400" :
                               card.rarity === 'epic' ? "bg-purple-500/20 text-purple-400" :
                               card.rarity === 'rare' ? "bg-blue-400/20 text-blue-400" :
                               card.rarity === 'uncommon' ? "bg-emerald-500/20 text-emerald-400" :
                               "bg-slate-800 text-slate-400"
                          )}>
                            {card.rarity}
                          </div>
                          <h4 className="text-white font-bold mb-2 leading-tight">{card.name}</h4>
                          <p className="text-xs text-slate-400 line-clamp-3">{card.description}</p>
                         </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
