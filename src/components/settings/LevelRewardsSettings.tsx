import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { RewardCard, ShopItem, GachaPool, Rarity } from '../../types';
import { INITIAL_GACHA } from '../../constants';
import { Plus, Trash2, Save, Edit2, X, ChevronRight, Coins, Zap, Sparkles, Trophy, Timer as TimerIcon, Package, Flame, AlertTriangle, Scroll, Volume2, VolumeX, Sun, Moon, Settings as SettingsIcon, ShoppingBag, Trees, Waves, Database, Download, Upload, Target, Gift, User, Sword, Eye, Palette, Check, Bell, BellOff, RefreshCw, Key, Layers, Sunrise, Cloud, CloudSun, Lollipop, Wrench, History, Ticket } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { APP_VERSION, LAST_UPDATE_DATE, RELEASE_HISTORY } from '../../version';
import { cn, getXPForLevel, getDefaultRewardForLevel } from '../../lib/utils';
import { playSound } from '../../lib/sound';
import { SpinnerInput } from '../SpinnerInput';
import { ConfirmModal } from '../ConfirmModal';

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


export const LevelRewardsSettings = ({ state, setState }: { state: any, setState: (fn: (prev: any) => any) => void }) => {
  const [showPassedLevels, setShowPassedLevels] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLevel, setNewLevel] = useState(51);
  const [modalConfig, setModalConfig] = useState<{ 
    isOpen: boolean; 
    title: string; 
    message: string; 
    confirmText?: string;
    type?: 'danger' | 'warning' | 'info';
    isAlert?: boolean;
  }>({ isOpen: false, title: '', message: '' });

  const currentLevel = state.level;

  // Get all levels that have custom rewards
  const customRewardLevels = (state.levelRewards || []).map((r: any) => r.level);
  
  // Create a set of levels to display
  // We show up to 50 by default, plus any custom levels, plus current level + 5
  const displayLevels = React.useMemo(() => {
    const baseLevels = Array.from({ length: 50 }, (_, i) => i + 2); // 1->2 to 49->50
    const customLevels = customRewardLevels;
    const nearCurrent = Array.from({ length: 10 }, (_, i) => currentLevel + i - 2).filter(l => l > 1);
    
    const allLevels = Array.from(new Set([...baseLevels, ...customLevels, ...nearCurrent])).sort((a, b) => a - b);
    return allLevels;
  }, [customRewardLevels, currentLevel]);

  const visibleLevels = showPassedLevels 
    ? displayLevels 
    : displayLevels.filter(lvl => lvl > currentLevel);

  const formatReward = (reward: any) => {
    if (!reward) return <span className="text-slate-600 italic">None</span>;
    
    const { type, amount, rewardText } = reward;
    
    if (type === 'text') {
      return (
        <div className="flex items-center gap-2">
          <Scroll size={14} className="text-emerald-400" />
          <span className="font-bold text-white">{rewardText}</span>
        </div>
      );
    }

    let icon = null;
    let unit = "";
    if (type === 'talentPoint') {
      icon = <Zap size={14} className="text-indigo-400" />;
      unit = amount === 1 ? "TalentPoint" : "TalentPoints";
    } else if (type === 'coins') {
      icon = <Coins size={14} className="text-amber-400" />;
      unit = amount === 1 ? "Coin" : "Coins";
    }

    return (
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-bold text-white">{amount} {unit}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2.5 text-emerald-400 mb-6 pb-2">
        <div className="flex items-center gap-2.5">
          <Trophy size={20} />
          <h4 className="text-lg font-bold uppercase tracking-widest pr-1">Level Rewards & XP Table</h4>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowPassedLevels(!showPassedLevels)}
            className="text-[10px] sm:text-xs font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest flex items-center gap-1"
          >
            {showPassedLevels ? "Fold" : "Show All"}
          </button>
          <button 
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-1 px-2 py-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-[10px] sm:text-xs font-bold hover:bg-indigo-600/40 transition-all"
          >
            <Plus size={12} /> Add
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[600px] custom-scrollbar border border-slate-800 rounded-2xl bg-slate-900/50 p-2 sm:p-0">
        <table className="w-full text-left text-sm text-slate-400 border-collapse">
          <thead className="text-[10px] text-slate-500 uppercase bg-slate-800/80 backdrop-blur sticky top-0 z-[5]">
            <tr>
              <th className="px-4 py-4 font-black tracking-widest">Level</th>
              <th className="px-4 py-4 font-black tracking-widest hidden sm:table-cell">XP Req.</th>
              <th className="px-4 py-4 font-black tracking-widest">Reward</th>
              <th className="px-4 py-4 font-black tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleLevels.map(nextLvl => {
              const currentLvl = nextLvl - 1;
              const reward = state.levelRewards?.find((r: any) => r.level === nextLvl);
              const defaultReward = getDefaultRewardForLevel(nextLvl);
              const isCurrent = currentLevel === currentLvl;
              
              return (
                <tr 
                  key={nextLvl} 
                  className={cn(
                    "border-b border-slate-800/50 transition-colors",
                    isCurrent ? "bg-indigo-500/10" : "hover:bg-slate-800/30"
                  )}
                >
                  <td className="px-4 py-4 font-bold w-24">
                    <div className="flex items-center gap-2 w-fit">
                      <span className={cn("text-xs", isCurrent ? "text-indigo-400" : "text-slate-500")}>{currentLvl}</span>
                      <ChevronRight size={10} className="text-indigo-500" />
                      <span className="text-white text-base">{nextLvl}</span>
                      {isCurrent && (
                        <span className="ml-2 px-2 py-0.5 bg-indigo-500 text-[8px] text-white rounded-full uppercase tracking-tighter font-black">Current</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell font-mono text-xs text-slate-500">
                    {getXPForLevel(currentLvl).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="scale-90 sm:scale-100 origin-left">
                      {reward ? formatReward(reward) : formatReward(defaultReward)}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => {
                        setEditing(reward || { level: nextLvl, type: 'talentPoint', amount: 1 });
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-lg text-xs font-bold transition-all"
                    >
                      {reward ? 'Edit' : 'Add'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {createPortal(
        <AnimatePresence>
          {isAddingNew && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 p-8 rounded-3xl border border-slate-700 w-full max-w-md space-y-6 shadow-2xl"
              >
                <h4 className="text-xl font-bold text-white">Add Reward for Level</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Target Level</label>
                    <SpinnerInput
                      value={newLevel === undefined || newLevel === null ? '' : newLevel}
                      onChange={(val) => setNewLevel(typeof val === 'number' ? val : ('' as any))}
                      min={2}
                    />
                    <p className="text-xs text-slate-500 italic">Reward given when reaching this level.</p>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setIsAddingNew(false)} className="px-4 py-2 text-slate-400 font-bold">Cancel</button>
                  <button 
                    onClick={() => {
                      if (newLevel === '' as any || isNaN(newLevel) || newLevel < 2) {
                        setModalConfig({
                          isOpen: true,
                          title: "Invalid Level",
                          message: "Please enter a valid target level (must be 2 or higher).",
                          confirmText: "Got it",
                          type: "warning",
                          isAlert: true
                        });
                        return;
                      }
                      setEditing({ level: newLevel, type: 'talentPoint', amount: 1 });
                      setIsAddingNew(false);
                    }}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {createPortal(
        <AnimatePresence>
          {editing && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 p-8 rounded-3xl border border-slate-700 w-full max-w-md space-y-4 shadow-2xl"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-bold text-white">Edit Reward for Level {editing.level}</h4>
                  <button onClick={() => setEditing(null)} className="text-slate-500 hover:text-white"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Reward Type</label>
                    <select
                      value={editing.type}
                      onChange={e => setEditing({ ...editing, type: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white"
                    >
                      <option value="talentPoint">Talent Point</option>
                      <option value="coins">Gold</option>
                      <option value="text">Text Reward</option>
                    </select>
                  </div>
                  
                  {editing.type !== 'text' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Amount</label>
                      <SpinnerInput
                        value={editing.amount === undefined || editing.amount === null ? '' : editing.amount}
                        onChange={(val) => setEditing({ ...editing, amount: typeof val === 'number' ? val : ('' as any) })}
                      />
                    </div>
                  )}
                  
                  {editing.type === 'text' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Reward Text</label>
                      <input
                        type="text"
                        value={editing.rewardText || ''}
                        onChange={e => setEditing({ ...editing, rewardText: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white"
                        placeholder="e.g. Unlock Secret Dungeon"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    onClick={() => setEditing(null)} 
                    className="px-4 py-2 text-slate-400 font-bold hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (editing.type !== 'text' && (editing.amount === '' as any || isNaN(editing.amount as number) || (editing.amount as number) < 0)) {
                        setModalConfig({
                          isOpen: true,
                          title: "Invalid Amount",
                          message: "Please enter a valid non-negative amount.",
                          confirmText: "Got it",
                          type: "warning",
                          isAlert: true
                        });
                        return;
                      }
                      const newRewards = [...(state.levelRewards || [])].filter((r: any) => r.level !== editing.level);
                      setState(prev => ({ ...prev, levelRewards: [...newRewards, editing] }));
                      setEditing(null);
                    }}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    Save Reward
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={() => {}} // No confirm callback needed for alerts
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        type={modalConfig.type}
        isAlert={modalConfig.isAlert}
      />
    </div>
  );
};

