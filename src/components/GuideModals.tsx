import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Coins, Star, HelpCircle } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const XPGuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-emerald-500/30 p-6 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-xl relative"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-xl">
                  <Zap className="text-emerald-400" size={24} />
                </div>
                XP & Leveling Guide
              </h3>
              <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-6">
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <p className="text-xs text-emerald-300 font-bold uppercase tracking-widest mb-2">How to earn XP</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Complete study sessions in <strong>Explore</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Clear rooms in <strong>Dungeons</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Win XP rewards from the <strong>Gacha</strong></span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-2">Pro Tip: Customization</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You can customize how much XP you earn! Go to <strong>Settings &gt; Developer</strong> to adjust base XP rates, or <strong>Settings &gt; Level Rewards</strong> to change what you get when you level up.
                </p>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 mt-2"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const CoinGuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-amber-500/30 p-6 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-xl relative"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-xl">
                  <Coins className="text-amber-400" size={24} />
                </div>
                Gold Coins Guide
              </h3>
              <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-6">
              <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                <p className="text-xs text-amber-300 font-bold uppercase tracking-widest mb-2">How to earn Gold</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Complete study sessions in <strong>Explore</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Clear rooms in <strong>Dungeons</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Win Gold rewards from the <strong>Gacha</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Level up rewards (if configured)</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-2">Pro Tip: Customization</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You can customize how much Gold you earn! Go to <strong>Settings &gt; Developer</strong> to adjust base Gold rates, or <strong>Settings &gt; Level Rewards</strong> to change what you get when you level up.
                </p>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 mt-2"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const TalentGuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
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
              <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors">
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
                  Want more Talent Points? You can set them as rewards for clearing Dungeons or reaching specific levels in <strong>Settings</strong>!
                </p>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 mt-2"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
