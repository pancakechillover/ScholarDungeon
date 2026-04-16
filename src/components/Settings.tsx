import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { RewardCard, ShopItem, GachaPool, Rarity } from '../types';
import { INITIAL_GACHA } from '../constants';
import { Plus, Trash2, Save, Edit2, X, ChevronRight, Coins, Zap, Sparkles, Trophy, Timer as TimerIcon, Package, Flame, AlertTriangle, Scroll, Volume2, VolumeX, Sun, Moon, Settings as SettingsIcon, ShoppingBag, Trees, Waves, Database, Download, Upload, Target, Gift, User, Sword, Eye, Palette, Check, Bell, BellOff, RefreshCw } from 'lucide-react';
import { cn, getXPForLevel, getDefaultRewardForLevel } from '../lib/utils';
import { playSound } from '../lib/sound';

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

interface SettingsProps {
  state: any;
  setState: (fn: (prev: any) => any) => void;
  rewardPool: RewardCard[];
  shopItems: ShopItem[];
  gachaPools: GachaPool[];
  onUpdateRewards: (pool: RewardCard[]) => void;
  onUpdateShop: (items: ShopItem[]) => void;
  onUpdateGacha: (pools: GachaPool[]) => void;
  addXP: (amount: number) => void;
}

const LevelRewardsSettings = ({ state, setState }: { state: any, setState: (fn: (prev: any) => any) => void }) => {
  const [showPassedLevels, setShowPassedLevels] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLevel, setNewLevel] = useState(51);

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-400">
          <Trophy size={14} className="sm:text-lg" />
          <h4 className="font-bold uppercase text-[10px] sm:text-sm tracking-widest">Level Rewards & XP Table</h4>
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
                    <input
                      type="number"
                      value={newLevel}
                      onChange={e => setNewLevel(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white"
                      min="2"
                    />
                    <p className="text-xs text-slate-500 italic">Reward given when reaching this level.</p>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setIsAddingNew(false)} className="px-4 py-2 text-slate-400 font-bold">Cancel</button>
                  <button 
                    onClick={() => {
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
                      <input
                        type="number"
                        value={editing.amount}
                        onChange={e => setEditing({ ...editing, amount: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white"
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
    </div>
  );
};

const GeneralSettings = ({ state, setState, setShowClearConfirm }: { state: any, setState: (fn: (prev: any) => any) => void, setShowClearConfirm: (show: boolean) => void }) => {
  const themes = [
    { id: 'night', name: 'Night', color: '#020617', icon: Moon, iconColor: '#ffffff' },
    { id: 'daylight', name: 'Daylight', color: '#f8fafc', icon: Sun, iconColor: '#0f172a' },
    { id: 'warm', name: 'Warm Sun', color: '#ea580c', icon: Sun, iconColor: '#ffffff' },
    { id: 'candy', name: 'Candy', color: '#ec4899', icon: Sparkles, iconColor: '#ffffff' },
    { id: 'forest', name: 'Forest', color: '#34d399', icon: Trees, iconColor: '#064e3b' },
    { id: 'ocean', name: 'Ocean', color: '#38bdf8', icon: Waves, iconColor: '#0c4a6e' },
  ];

  const soundEnabled = state.soundEnabled ?? true;
  const soundVolume = state.soundVolume ?? 0.5;
  const defaultMarkdownEnabled = state.defaultMarkdownEnabled ?? true;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setState(prev => ({ ...prev, soundVolume: newVolume }));
    if (soundEnabled) {
      playSound('click', newVolume, true);
    }
  };

  const toggleSound = () => {
    const newEnabled = !soundEnabled;
    setState(prev => ({ ...prev, soundEnabled: newEnabled }));
    if (newEnabled) {
      playSound('click', soundVolume, true);
    }
  };

  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNotificationToggle = async () => {
    if (state.pushEnabled) {
      // Unsubscribe
      try {
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      }
      registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
        setState(prev => ({ ...prev, pushEnabled: false, pushSubscription: null }));
      } catch (error) {
        console.error('Failed to unsubscribe:', error);
      }
      return;
    }

    // Subscribe
    setIsSubscribing(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Notification permission denied. Please enable it in your browser settings.');
        return;
      }

      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        console.log('No service worker found, registering...');
        registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      }
      registration = await navigator.serviceWorker.ready;
      
      const vapidResponse = await fetch('/api/push/vapid-public-key');
      const { publicKey } = await vapidResponse.json();
      const convertedVapidKey = urlBase64ToUint8Array(publicKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

      // Save to server if secretCode exists
      if (state.secretCode) {
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secretCode: state.secretCode,
            subscription
          })
        });
      }

      setState(prev => ({ ...prev, pushEnabled: true, pushSubscription: subscription }));
      
      // Explicitly log success
      console.log('Successfully enabled notifications and synced to server');
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Failed to enable notifications. Make sure you are using a supported browser and have added the app to your home screen if on iOS.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const forceSyncNotifications = async () => {
    if (!state.secretCode) {
      alert('Please link your account with a Secret Code first to sync notifications.');
      return;
    }
    
    setIsSubscribing(true);
    try {
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      }
      registration = await navigator.serviceWorker.ready;
      
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Try to re-subscribe if missing
        const vapidResponse = await fetch('/api/push/vapid-public-key');
        const { publicKey } = await vapidResponse.json();
        const convertedVapidKey = urlBase64ToUint8Array(publicKey);
        
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
      }

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secretCode: state.secretCode,
          subscription
        })
      });

      if (res.ok) {
        alert('Notifications synced successfully!');
        setState(prev => ({ ...prev, pushEnabled: true, pushSubscription: subscription }));
      } else {
        throw new Error(`Server error: ${res.status}`);
      }
    } catch (error) {
      console.error('Force sync failed:', error);
      alert('Failed to sync notifications. Please try toggling the switch off and on again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleExport = () => {
    const fullLocalStorage: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        fullLocalStorage[key] = localStorage.getItem(key) || '';
      }
    }

    const dataToExport = {
      ...state,
      dungeons: JSON.parse(localStorage.getItem('scholars_dungeon_state_dungeons') || '[]'),
      majorDungeons: JSON.parse(localStorage.getItem('scholars_dungeon_state_major_dungeons') || '[]'),
      fullLocalStorage
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "scholars_dungeon_save.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (importedData && typeof importedData === 'object') {
          // Extract state and dungeon data
          const { dungeons, majorDungeons, fullLocalStorage, ...importedState } = importedData;
          
          if (fullLocalStorage) {
            Object.keys(fullLocalStorage).forEach(key => {
              localStorage.setItem(key, fullLocalStorage[key]);
            });
          } else {
            localStorage.setItem('scholars_dungeon_state', JSON.stringify(importedState));
            if (dungeons) localStorage.setItem('scholars_dungeon_dungeons', JSON.stringify(dungeons));
            if (majorDungeons) localStorage.setItem('scholars_dungeon_major_dungeons', JSON.stringify(majorDungeons));
          }
          
          window.location.reload();
        } else {
          alert('Invalid save file format.');
        }
      } catch (error) {
        alert('Error parsing save file.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-indigo-400 mb-6">
          <Sparkles size={18} />
          <h4 className="font-bold uppercase text-sm tracking-widest">Appearance</h4>
        </div>
        
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Theme</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {themes.map(theme => {
              const isActive = (state.theme || 'night') === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setState(prev => ({ ...prev, theme: theme.id }))}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                    isActive 
                      ? "bg-indigo-500/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                      : "bg-slate-900 border-slate-800 hover:border-slate-700"
                  )}
                >
                  <div 
                    className="w-12 h-12 rounded-full border-2 border-slate-700/50 shadow-inner flex items-center justify-center"
                    style={{ backgroundColor: theme.color }}
                  >
                    <theme.icon size={20} style={{ color: theme.iconColor }} />
                  </div>
                  <span className={cn("text-xs font-bold", isActive ? "text-indigo-400" : "text-slate-400")}>
                    {theme.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400 mb-6">
          <Volume2 size={18} />
          <h4 className="font-bold uppercase text-sm tracking-widest">Audio</h4>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-xl", soundEnabled ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500")}>
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </div>
              <div>
                <div className="font-bold text-white">Sound Effects</div>
                <div className="text-xs text-slate-500">Play sounds for actions like gacha and rewards</div>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                soundEnabled ? "bg-emerald-500" : "bg-slate-700"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  soundEnabled ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>

          {soundEnabled && (
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Volume</label>
                <span className="text-xs font-bold text-emerald-400">{Math.round(soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundVolume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex items-center gap-2 text-indigo-400 mb-6">
          <Eye size={18} />
          <h4 className="font-bold uppercase text-sm tracking-widest">Features</h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-xl", defaultMarkdownEnabled ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-800 text-slate-500")}>
                <Eye size={20} />
              </div>
              <div>
                <div className="font-bold text-white">Default Markdown</div>
                <div className="text-xs text-slate-500">Enable Markdown in Daily Reflection by default</div>
              </div>
            </div>
            <button
              onClick={() => setState(prev => ({ ...prev, defaultMarkdownEnabled: !defaultMarkdownEnabled }))}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                defaultMarkdownEnabled ? "bg-indigo-500" : "bg-slate-700"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  defaultMarkdownEnabled ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex items-center gap-2 text-indigo-400 mb-6">
          <Bell size={18} />
          <h4 className="font-bold uppercase text-sm tracking-widest">System Notifications</h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-xl", state.pushEnabled ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-800 text-slate-500")}>
                {state.pushEnabled ? <Bell size={20} /> : <BellOff size={20} />}
              </div>
              <div>
                <div className="font-bold text-white">Push Notifications</div>
                <div className="text-xs text-slate-500">Alerts for timer ends and rest periods</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {state.pushEnabled && (
                <button
                  onClick={forceSyncNotifications}
                  disabled={isSubscribing}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors"
                  title="Force Sync Notifications"
                >
                  <RefreshCw size={16} className={cn(isSubscribing && "animate-spin")} />
                </button>
              )}
              <button
                onClick={handleNotificationToggle}
                disabled={isSubscribing}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  state.pushEnabled ? "bg-indigo-500" : "bg-slate-700",
                  isSubscribing && "opacity-50 cursor-not-allowed"
                )}
              >
              {isSubscribing ? (
                <RefreshCw size={12} className="animate-spin text-white mx-auto" />
              ) : (
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    state.pushEnabled ? "translate-x-6" : "translate-x-1"
                  )}
                />
              )}
            </button>
          </div>
        </div>
          {!state.pushEnabled && (
            <p className="text-[10px] text-slate-500 px-4 italic">
              Requires PWA installation on iOS. Make sure to allow permissions when prompted.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex items-center gap-2 text-amber-400 mb-6">
          <Target size={18} />
          <h4 className="font-bold uppercase text-sm tracking-widest">Quest UI Notifications</h4>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Completion Notification</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setState(prev => ({ ...prev, questNotificationStyle: 'red_dot' }))}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                state.questNotificationStyle === 'red_dot' 
                  ? "bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              )}
            >
              <div className="relative p-2 bg-slate-800 rounded-xl text-slate-400">
                <Target size={20} />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-indigo-500 rounded-full border-2 border-slate-950" />
              </div>
              <div>
                <div className={cn("font-bold", state.questNotificationStyle === 'red_dot' ? "text-amber-400" : "text-white")}>Red Dot</div>
                <div className="text-[10px] text-slate-500">Show indicator on tab icon</div>
              </div>
            </button>

            <button
              onClick={() => setState(prev => ({ ...prev, questNotificationStyle: 'popup' }))}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                state.questNotificationStyle === 'popup' 
                  ? "bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              )}
            >
              <div className="p-2 bg-slate-800 rounded-xl text-slate-400">
                <Gift size={20} />
              </div>
              <div>
                <div className={cn("font-bold", state.questNotificationStyle === 'popup' ? "text-amber-400" : "text-white")}>Instant Popup</div>
                <div className="text-[10px] text-slate-500">Show reward window immediately</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex items-center gap-2 text-blue-400 mb-6">
          <Database size={18} />
          <h4 className="font-bold uppercase text-sm tracking-widest">Data Management</h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-white font-bold">
              <Download size={20} className="text-blue-400" />
              Export Data
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Save your current progress, inventory, and settings to a file.
            </p>
            <button
              onClick={handleExport}
              className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all text-sm"
            >
              Export JSON
            </button>
          </div>

          <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-white font-bold">
              <Upload size={20} className="text-blue-400" />
              Import Data
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Restore your progress from a previously exported file.
            </p>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImport}
              className="hidden"
              id="import-data"
            />
            <label
              htmlFor="import-data"
              className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all text-sm cursor-pointer flex items-center justify-center"
            >
              Import JSON
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex items-center gap-2 text-red-400 mb-6">
          <AlertTriangle size={18} />
          <h4 className="font-bold uppercase text-sm tracking-widest">Danger Zone</h4>
        </div>
        <div className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Clearing all data will reset your progress, inventory, and settings. This action is irreversible.
          </p>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export const Settings = React.memo<SettingsProps>(({
  state,
  setState,
  rewardPool,
  shopItems,
  gachaPools,
  onUpdateRewards,
  onUpdateShop,
  onUpdateGacha,
  addXP
}) => {
  const [activeSection, setActiveSection] = useState<'general' | 'rewards' | 'shop' | 'gacha' | 'dev' | 'levelRewards' | 'about'>('general');
  const [devPassword, setDevPassword] = useState('');
  const [isDevUnlocked, setIsDevUnlocked] = useState(state.devModeEnabled || false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const [testNotificationTitle, setTestNotificationTitle] = useState('Dungeon Alert!');
  const [testNotificationBody, setTestNotificationBody] = useState('Your focus session has ended.');
  const [isTestingNotification, setIsTestingNotification] = useState(false);

  const handleTestNotification = async () => {
    if (!state.secretCode) {
      alert('Please link your account with a Secret Code first.');
      return;
    }
    
    setIsTestingNotification(true);
    try {
      // 1. Schedule immediate notification (use -1 minute to ensure it's expired immediately)
      console.log('Testing: Scheduling notification (expired)...');
      const scheduleRes = await fetch('/api/push/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secretCode: state.secretCode,
          delayMinutes: -1, // Force expiration
          title: testNotificationTitle,
          body: testNotificationBody,
          type: 'focus'
        })
      });
      
      if (!scheduleRes.ok) throw new Error('Failed to schedule test notification');
      
      // 2. Wait a moment for Redis to settle
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 3. Trigger check and log results
      console.log('Testing: Triggering check...');
      const checkRes = await fetch('/api/push/check');
      const checkData = await checkRes.json();
      console.log('Push Check Results (Detailed):', checkData);
      
      if (checkData.success) {
        const myResult = checkData.results?.find((r: any) => r.secretCode === state.secretCode);
        const debug = checkData.debug || {};
        
        console.log(`[Debug Info] Queue Count: ${debug.totalPendingInQueue}, Server Time: ${debug.serverTime}`);
        
        if (myResult) {
          if (myResult.status === 'sent') {
            alert(`Success! Notification sent.\nQueue: ${debug.totalPendingInQueue} tasks remaining.`);
          } else if (myResult.status === 'no_subscription') {
            alert('Error: No subscription found on server. Try "Force Sync" first.');
          } else {
            alert(`Notification failed: ${myResult.status} ${myResult.error || ''}`);
          }
        } else {
          if (checkData.processed > 0) {
            alert(`Processed ${checkData.processed} tasks, but none matched your code. Check console.`);
          } else {
            alert(`No tasks processed. Queue count: ${debug.totalPendingInQueue}. If > 0, the task might not be due yet (Server Time: ${debug.serverTime}).`);
          }
        }
      } else {
        alert('Check failed: ' + (checkData.error || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Test notification failed:', error);
      alert('Test failed: ' + error.message);
    } finally {
      setIsTestingNotification(false);
    }
  };

  const handleUnlockDev = () => {
    if (devPassword === '8424') {
      setIsDevUnlocked(true);
      setState(prev => ({ ...prev, devModeEnabled: true }));
    } else {
      alert('Incorrect Password');
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-700">
        <div>
          <h2 className="text-2xl font-bold text-white">Dungeon Settings</h2>
          <p className="text-slate-400">Customize your rewards and merchant stock</p>
        </div>
      </div>

      <div className="flex flex-nowrap gap-2 p-2 bg-slate-900/80 backdrop-blur rounded-3xl w-full border border-slate-800 overflow-x-auto">
        {(['general', 'rewards', 'levelRewards', 'shop', 'gacha', 'dev', 'about'] as const).map(tab => {
          return (
            <button
              key={tab}
              onClick={() => setActiveSection(tab)}
              className={cn(
                "px-5 py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap",
                activeSection === tab 
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 scale-105 z-10" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              )}
            >
              {tab === 'dev' ? 'Developer' : tab === 'levelRewards' ? 'Level Rewards' : tab === 'about' ? 'About' : tab}
            </button>
          );
        })}
      </div>

      <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8 backdrop-blur-sm">
        {activeSection === 'general' && (
          <GeneralSettings state={state} setState={setState} setShowClearConfirm={setShowClearConfirm} />
        )}
        {activeSection === 'rewards' && (
          <RewardSettings pool={rewardPool} onUpdate={onUpdateRewards} />
        )}
        {activeSection === 'levelRewards' && (
          <LevelRewardsSettings state={state} setState={setState} />
        )}
        {activeSection === 'shop' && (
          <ShopSettings items={shopItems} onUpdate={onUpdateShop} />
        )}
        {activeSection === 'gacha' && (
          <GachaSettings pools={gachaPools} onUpdate={onUpdateGacha} />
        )}
        {activeSection === 'dev' && (
          <div className="space-y-8">
            {!isDevUnlocked ? (
              <div className="max-w-md mx-auto space-y-4 text-center py-12">
                <h3 className="text-xl font-bold text-white">Developer Mode Locked</h3>
                <p className="text-slate-400 text-sm">Enter the secret password to access advanced tools.</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input 
                    type="password" 
                    value={devPassword} 
                    onChange={e => setDevPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-center tracking-widest"
                  />
                  <button 
                    onClick={handleUnlockDev}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors"
                  >
                    Unlock
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-indigo-400" /> Developer Tools
                  </h3>
                  <button 
                    onClick={() => {
                      setIsDevUnlocked(false);
                      setState(prev => ({ ...prev, devModeEnabled: false }));
                    }}
                    className="text-xs font-bold text-red-400 uppercase tracking-widest hover:text-red-300"
                  >
                    Lock & Disable
                  </button>
                </div>

                {/* Section 1: Session Rewards */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <TimerIcon size={18} />
                    <h4 className="font-bold uppercase text-sm tracking-widest">Session Reward Settings</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Base XP</label>
                      <input 
                        type="number" 
                        value={state.devBaseXP} 
                        onChange={e => setState(prev => ({ ...prev, devBaseXP: parseInt(e.target.value) }))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Gold Drop Mode</label>
                      <div className="flex p-1 bg-slate-800 rounded-xl">
                        <button 
                          onClick={() => setState(prev => ({ ...prev, devCoinMode: 'fixed' }))}
                          className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all", state.devCoinMode === 'fixed' ? "bg-indigo-600 text-white" : "text-slate-500")}
                        >
                          Fixed
                        </button>
                        <button 
                          onClick={() => setState(prev => ({ ...prev, devCoinMode: 'random' }))}
                          className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all", state.devCoinMode === 'random' ? "bg-indigo-600 text-white" : "text-slate-500")}
                        >
                          Random
                        </button>
                      </div>
                    </div>
                    {state.devCoinMode === 'fixed' ? (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Base Gold</label>
                        <input 
                          type="number" 
                          value={state.devBaseCoins} 
                          onChange={e => setState(prev => ({ ...prev, devBaseCoins: parseInt(e.target.value) }))}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Gold Range (Min - Max)</label>
                        <div className="flex gap-2">
                          <input 
                            type="number" 
                            value={state.devMinCoins} 
                            onChange={e => setState(prev => ({ ...prev, devMinCoins: parseInt(e.target.value) }))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-center"
                            placeholder="Min"
                          />
                          <span className="text-slate-500 flex items-center">-</span>
                          <input 
                            type="number" 
                            value={state.devMaxCoins} 
                            onChange={e => setState(prev => ({ ...prev, devMaxCoins: parseInt(e.target.value) }))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-center"
                            placeholder="Max"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Crit Chance (0.0 to 1.0)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={state.devCritChance} 
                        onChange={e => setState(prev => ({ ...prev, devCritChance: parseFloat(e.target.value) }))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white"
                      />
                      <p className="text-xs text-slate-500">1.0 = 100% chance</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Crit Multiplier</label>
                      <input 
                        type="number" 
                        value={state.devCritMultiplier} 
                        onChange={e => setState(prev => ({ ...prev, devCritMultiplier: parseInt(e.target.value) }))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Resource Modification */}
                <div className="space-y-6 pt-6 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Package size={18} />
                    <h4 className="font-bold uppercase text-sm tracking-widest">Resource Modification</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DevResourceControl 
                      label="Gold" 
                      value={state.coins} 
                      defaultAmount={100}
                      onAdd={(amount) => setState(prev => ({ ...prev, coins: prev.coins + amount }))}
                      onSub={(amount) => setState(prev => ({ ...prev, coins: Math.max(0, prev.coins - amount) }))}
                      icon={<Coins size={24} className="text-amber-400" />}
                    />
                    <DevResourceControl 
                      label="XP" 
                      value={state.xp} 
                      defaultAmount={500}
                      onAdd={(amount) => addXP(amount)}
                      onSub={(amount) => setState(prev => ({ ...prev, xp: Math.max(0, prev.xp - amount) }))}
                      icon={<Zap size={24} className="text-indigo-400" />}
                    />
                    <DevResourceControl 
                      label="Medals" 
                      value={state.deathDefyingMedals} 
                      onAdd={(amount) => setState(prev => ({ ...prev, deathDefyingMedals: prev.deathDefyingMedals + amount }))}
                      onSub={(amount) => setState(prev => ({ ...prev, deathDefyingMedals: Math.max(0, prev.deathDefyingMedals - amount) }))}
                      icon={<Trophy size={24} className="text-amber-500" />}
                    />
                    <DevResourceControl 
                      label="Streak" 
                      value={state.streak} 
                      onAdd={(amount) => setState(prev => ({ ...prev, streak: prev.streak + amount }))}
                      onSub={(amount) => setState(prev => ({ ...prev, streak: Math.max(0, prev.streak - amount) }))}
                      icon={<Flame size={24} className="text-orange-500" />}
                    />
                    <DevResourceControl 
                      label="Talent Pt" 
                      value={state.talentPoints} 
                      onAdd={(amount) => setState(prev => ({ ...prev, talentPoints: prev.talentPoints + amount }))}
                      onSub={(amount) => setState(prev => ({ ...prev, talentPoints: Math.max(0, prev.talentPoints - amount) }))}
                      icon={<Zap size={24} className="text-indigo-400" />}
                    />
                    <DevResourceControl 
                      label="Shards" 
                      value={state.talentShards} 
                      onAdd={(amount) => setState(prev => ({ ...prev, talentShards: prev.talentShards + amount }))}
                      onSub={(amount) => setState(prev => ({ ...prev, talentShards: Math.max(0, prev.talentShards - amount) }))}
                      icon={<Sparkles size={24} className="text-indigo-300" />}
                    />
                  </div>
                </div>

                {/* Section 3: Notification Testing */}
                <div className="space-y-6 pt-6 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <Bell size={18} />
                    <h4 className="font-bold uppercase text-sm tracking-widest">Notification Testing</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Test Title</label>
                      <input 
                        type="text" 
                        value={testNotificationTitle} 
                        onChange={e => setTestNotificationTitle(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm"
                        placeholder="Notification Title"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Test Body</label>
                      <input 
                        type="text" 
                        value={testNotificationBody} 
                        onChange={e => setTestNotificationBody(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm"
                        placeholder="Notification Message"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleTestNotification}
                      disabled={isTestingNotification}
                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all"
                    >
                      {isTestingNotification ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
                      Send Test Notification Now
                    </button>
                    <button
                      onClick={async () => {
                        setIsTestingNotification(true);
                        try {
                          const res = await fetch('/api/push/check');
                          const data = await res.json();
                          console.log('Manual Push Check Results:', data);
                          alert(`Processed ${data.processed} tasks. Check console for details.`);
                        } catch (e) {
                          alert('Check failed');
                        } finally {
                          setIsTestingNotification(false);
                        }
                      }}
                      disabled={isTestingNotification}
                      className="px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
                      title="Trigger Manual Check"
                    >
                      <RefreshCw className={cn("w-4 h-4", isTestingNotification && "animate-spin")} />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    This will schedule a task with 0 delay and immediately trigger the /api/push/check endpoint.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'about' && (
          <div className="space-y-8 py-4">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-600/20">
                <SettingsIcon size={40} className="text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white tracking-tight">Scholar's Dungeon</h3>
                <div className="flex flex-col items-center gap-1 mt-2">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full font-bold tracking-widest uppercase text-xs border border-indigo-500/30">
                    Version 1.6.0
                  </span>
                  <span className="text-slate-500 text-xs font-medium">
                    Updated: 2026-04-16
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700/50 space-y-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Scroll className="text-indigo-400" size={20} />
                  Project Info
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Scholar's Dungeon is a gamified learning system designed to turn study sessions into an immersive Roguelike adventure. 
                  By combining the Pomodoro technique with RPG progression, it helps students and lifelong learners maintain focus and motivation.
                </p>
              </div>

              <div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700/50 space-y-6">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <User size={20} className="text-indigo-400" />
                  Author & Links
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Author</span>
                    <span className="text-white font-bold">Karakn</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Email</span>
                    <a href="mailto:pankechill@outlool.com" className="text-indigo-400 hover:text-indigo-300 transition-colors font-mono text-sm">pankechill@outlool.com</a>
                  </div>
                  <div className="pt-4 space-y-3">
                    <a 
                      href="https://github.com/pancakechillover/ScholarDungeon" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700 hover:border-indigo-500 transition-all group"
                    >
                      <span className="text-slate-300 text-sm font-bold">GitHub Repository</span>
                      <ChevronRight size={16} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </a>
                    <a 
                      href="https://github.com/pancakechillover/ScholarDungeon/blob/main/README.md" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700 hover:border-indigo-500 transition-all group"
                    >
                      <span className="text-slate-300 text-sm font-bold">Documentation (README)</span>
                      <ChevronRight size={16} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-slate-600 text-[10px] uppercase tracking-[0.3em] font-bold">
                Built with Passion for Learning & Gaming
              </p>
            </div>
          </div>
        )}

      {createPortal(
        <AnimatePresence>
          {showClearConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 w-full max-w-md rounded-3xl border border-red-500/30 overflow-hidden"
              >
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="text-red-400" />
                    Warning: Irreversible Action
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    You are about to clear <strong>ALL</strong> stored data. This includes your progress, talents, inventory, and history. This action <strong>cannot be undone</strong>.
                  </p>
                  <p className="text-red-400 text-sm font-bold">
                    Are you absolutely sure you want to proceed?
                  </p>
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors"
                    >
                      Yes, Clear Data
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
      </div>
    </div>
  );
});

const DevResourceControl = ({ label, value, onAdd, onSub, icon, defaultAmount = 1 }: { label: string, value: number, onAdd: (amount: number) => void, onSub: (amount: number) => void, icon: React.ReactNode, defaultAmount?: number }) => {
  const [amount, setAmount] = useState(defaultAmount);

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-3xl space-y-4 transition-all hover:bg-slate-800/60">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">{label}</span>
        <div className="p-3 bg-slate-900/50 rounded-xl">
          {icon}
        </div>
      </div>
      <div className="text-4xl font-black text-white tracking-tighter">
        {value.toLocaleString()}
      </div>
      <div className="flex items-center gap-2 pt-2">
        <input 
          type="number" 
          value={amount}
          onChange={e => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-16 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white text-center font-bold focus:border-indigo-500 outline-none transition-colors"
        />
        <div className="flex flex-1 gap-1">
          <button onClick={() => onSub(amount)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-black transition-colors">-</button>
          <button onClick={() => onAdd(amount)} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-black shadow-lg shadow-indigo-600/20 transition-colors">+</button>
        </div>
      </div>
    </div>
  );
};

const RewardSettings = ({ pool, onUpdate }: { pool: RewardCard[], onUpdate: (p: RewardCard[]) => void }) => {
  const [editing, setEditing] = useState<RewardCard | null>(null);

  const handleSave = (card: RewardCard) => {
    const newPool = pool.some(c => c.id === card.id)
      ? pool.map(c => c.id === card.id ? card : c)
      : [...pool, card];
    onUpdate(newPool);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Loot Pool</h3>
        <button 
          onClick={() => setEditing({ id: Math.random().toString(36).substr(2, 9), name: '', description: '', rarity: 'common', type: 'text', weight: 10 })}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold"
        >
          <Plus size={16} /> Add Reward
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pool.map(card => (
          <div key={card.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between group">
            <div>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-bold uppercase px-1.5 py-0.5 rounded", 
                  card.rarity === 'common' ? "bg-slate-700 text-slate-300" :
                  card.rarity === 'rare' ? "bg-blue-600 text-white" :
                  card.rarity === 'epic' ? "bg-purple-600 text-white" : "bg-amber-500 text-slate-900"
                )}>
                  {card.rarity}
                </span>
                <h4 className="font-bold text-white">{card.name}</h4>
              </div>
              <p className="text-xs text-slate-500 mt-1">{card.description}</p>
              <div className="text-xs text-indigo-400 font-bold mt-2 uppercase">Weight: {card.weight}</div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditing(card)} className="p-2 text-slate-400 hover:text-white"><Edit2 size={16} /></button>
              <button onClick={() => onUpdate(pool.filter(c => c.id !== card.id))} className="p-2 text-slate-600 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {createPortal(
        <AnimatePresence>
          {editing && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 p-8 rounded-3xl border border-slate-700 w-full max-w-md space-y-4"
              >
                <h4 className="text-xl font-bold text-white">Edit Reward</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Reward Type</label>
                      <select value={editing.type} onChange={e => setEditing({...editing, type: e.target.value as any})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                        <option value="coins">Coins</option>
                        <option value="xp">XP</option>
                        <option value="item">Advanced Item</option>
                        <option value="text">Custom Text</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Rarity</label>
                      <select value={editing.rarity} onChange={e => setEditing({...editing, rarity: e.target.value as Rarity})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                        <option value="common">Common</option>
                        <option value="rare">Rare</option>
                        <option value="epic">Epic</option>
                        <option value="legendary">Legendary</option>
                      </select>
                    </div>
                  </div>

                  <input type="text" placeholder="Name" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                  <textarea placeholder="Description" value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white h-20" />
                  
                  {editing.type === 'coins' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Coin Amount</label>
                      <input type="number" placeholder="Amount" value={editing.amount || ''} onChange={e => setEditing({...editing, amount: parseInt(e.target.value) || 0})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                    </div>
                  )}
                  {editing.type === 'xp' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">XP Amount</label>
                      <input type="number" placeholder="Amount" value={editing.amount || ''} onChange={e => setEditing({...editing, amount: parseInt(e.target.value) || 0})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                    </div>
                  )}
                  {editing.type === 'item' && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Item Type</label>
                        <select value={editing.itemType || 'double_xp'} onChange={e => setEditing({...editing, itemType: e.target.value as any})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
                          <option value="double_xp">Double XP Card</option>
                          <option value="double_coin">Double Coins Card</option>
                          <option value="talent_shard">Talent Shard</option>
                          <option value="death_defying_medal">Death Defying Gold Medal</option>
                          <option value="xp_bonus_percent">Next XP Bonus %</option>
                          <option value="coin_bonus_percent">Next Coins Bonus %</option>
                        </select>
                      </div>
                      {(editing.itemType === 'xp_bonus_percent' || editing.itemType === 'coin_bonus_percent' || editing.itemType === 'talent_shard' || editing.itemType === 'death_defying_medal') && (
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">
                            {(editing.itemType === 'xp_bonus_percent' || editing.itemType === 'coin_bonus_percent') ? 'Bonus Percent (%)' : 'Amount'}
                          </label>
                          <input type="number" placeholder="Value" value={editing.amount || ''} onChange={e => setEditing({...editing, amount: parseInt(e.target.value) || 0})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Drop Weight (Higher = More Common)</label>
                    <input type="number" placeholder="Weight" value={editing.weight} onChange={e => setEditing({...editing, weight: parseInt(e.target.value) || 0})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button onClick={() => setEditing(null)} className="px-4 py-2 text-slate-400">Cancel</button>
                  <button onClick={() => handleSave(editing)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Save</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

const ShopSettings = ({ items, onUpdate }: { items: ShopItem[], onUpdate: (i: ShopItem[]) => void }) => {
  const [editing, setEditing] = useState<ShopItem | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Fixed Shop Items</h3>
        <button onClick={() => setEditing({ id: Math.random().toString(36).substr(2, 9), name: '', price: 100, description: '' })} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between group">
            <div>
              <h4 className="font-bold text-white">{item.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{item.description}</p>
              <div className="flex items-center gap-1 text-amber-500 font-bold mt-2 text-xs">
                <Coins size={12} /> {item.price.toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditing(item)} className="p-2 text-slate-400 hover:text-white"><Edit2 size={16} /></button>
              <button onClick={() => onUpdate(items.filter(i => i.id !== item.id))} className="p-2 text-slate-600 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {createPortal(
        <AnimatePresence>
          {editing && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 p-8 rounded-3xl border border-slate-700 w-full max-w-md space-y-4"
              >
                <h4 className="text-xl font-bold text-white">Edit Shop Item</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Item Name</label>
                      <input type="text" placeholder="Name" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Price (Gold)</label>
                      <input type="number" placeholder="Price" value={editing.price} onChange={e => setEditing({...editing, price: parseInt(e.target.value) || 0})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Stock (-1 for infinite)</label>
                      <input type="number" placeholder="Stock" value={editing.stock ?? -1} onChange={e => setEditing({...editing, stock: parseInt(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Icon</label>
                      <select 
                        value={editing.icon || 'ShoppingBag'} 
                        onChange={e => setEditing({...editing, icon: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                      >
                        {['ShoppingBag', 'Sparkles', 'Trophy', 'Coins', 'Zap', 'Flame', 'Gem', 'Target', 'Star', 'Heart', 'Shield', 'Sword', 'Coffee', 'Pizza', 'Gift', 'Package', 'Camera', 'Music', 'Book', 'Gamepad2', 'Ghost', 'Moon', 'Sun', 'Cloud', 'Anchor', 'Compass', 'Map', 'Key', 'Lock', 'Unlock', 'Bell', 'BellOff', 'Eye', 'EyeOff', 'Search', 'Settings'].map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                    <textarea placeholder="Description" value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white h-20" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button onClick={() => setEditing(null)} className="px-4 py-2 text-slate-400">Cancel</button>
                  <button onClick={() => { onUpdate(items.some(i => i.id === editing.id) ? items.map(i => i.id === editing.id ? editing : i) : [...items, editing]); setEditing(null); }} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Save</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};


const GachaSettings = ({ pools, onUpdate }: { pools: GachaPool[], onUpdate: (p: GachaPool[]) => void }) => {
  const [editing, setEditing] = useState<GachaPool | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Gacha & Ichiban Pools</h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pools.map(pool => (
          <div key={pool.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", pool.type === 'gacha' ? "bg-purple-500/10 text-purple-400" : "bg-emerald-500/10 text-emerald-400")}>
                  {pool.type === 'gacha' ? <Sparkles size={20} /> : <Trophy size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-white">{pool.name}</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">{pool.type} • {pool.cost.toLocaleString()} Gold</p>
                </div>
              </div>
              <button onClick={() => {
                const sortedPool = {
                  ...pool,
                  items: [...pool.items].sort((a, b) => {
                    if (a.rarity === 'LastOne') return -1;
                    if (b.rarity === 'LastOne') return 1;
                    return 0;
                  })
                };
                setEditing(sortedPool);
              }} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-700">Edit Items</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {pool.items.map((item, idx) => (
                <div key={idx} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-400">
                  <span className="font-bold text-slate-200">{item.rarity}:</span> {item.name} {item.count !== undefined && `(${item.count})`}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {createPortal(
        <AnimatePresence>
          {editing && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-700 w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-bold text-white">Edit Pool: {editing.name}</h4>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const defaultPool = INITIAL_GACHA.find(p => p.id === editing.id);
                        if (defaultPool) {
                          const sortedDefault = {
                            ...defaultPool,
                            items: [...defaultPool.items].sort((a, b) => {
                              if (a.rarity === 'LastOne') return -1;
                              if (b.rarity === 'LastOne') return 1;
                              return 0;
                            })
                          };
                          setEditing(JSON.parse(JSON.stringify(sortedDefault)));
                        }
                      }}
                      className="px-3 py-1 bg-slate-800 text-slate-400 rounded-lg text-[10px] font-bold hover:text-white transition-colors"
                    >
                      Reset to Default
                    </button>
                    <button onClick={() => setEditing(null)}><X size={24} className="text-slate-500" /></button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Cost per Draw (Gold)</label>
                    <input 
                      type="number"
                      value={editing.cost}
                      onChange={(e) => setEditing({ ...editing, cost: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {editing.type === 'gacha' && editing.weights && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">SSR Weight</label>
                        <input 
                          type="number"
                          value={editing.weights.SSR}
                          onChange={(e) => setEditing({ ...editing, weights: { ...editing.weights!, SSR: parseInt(e.target.value) || 0 } })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-purple-500 uppercase tracking-widest mb-2">SR Weight</label>
                        <input 
                          type="number"
                          value={editing.weights.SR}
                          onChange={(e) => setEditing({ ...editing, weights: { ...editing.weights!, SR: parseInt(e.target.value) || 0 } })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">R Weight</label>
                        <input 
                          type="number"
                          value={editing.weights.R}
                          onChange={(e) => setEditing({ ...editing, weights: { ...editing.weights!, R: parseInt(e.target.value) || 0 } })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-sm font-bold text-white">Items (Separate with /)</h5>
                      {editing.type === 'ichiban' && (
                        <button 
                          onClick={() => {
                            const newItems = [...editing.items];
                            const currentPrizes = newItems.filter(i => i.rarity.includes(' Prize')).map(i => i.rarity.split(' ')[0]);
                            const nextLetter = String.fromCharCode(65 + currentPrizes.length); // A, B, C...
                            newItems.push({ rarity: `${nextLetter} Prize`, name: 'New Item', count: 1, initialCount: 1 });
                            setEditing({ ...editing, items: newItems });
                          }}
                          className="flex items-center gap-1 px-2 py-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded text-[10px] font-bold hover:bg-indigo-600/40"
                        >
                          <Plus size={12} /> Add Tier
                        </button>
                      )}
                    </div>
                    {[...editing.items].sort((a, b) => {
                      if (a.rarity === 'LastOne') return -1;
                      if (b.rarity === 'LastOne') return 1;
                      return 0;
                    }).map((item, displayIdx) => {
                      // Find original index to maintain correct updates
                      const originalIdx = editing.items.findIndex(i => i === item);
                      
                      return (
                        <div key={displayIdx} className={cn(
                          "grid grid-cols-12 gap-3 items-center mb-3 p-2 rounded-xl transition-colors",
                          item.rarity === 'LastOne' ? "bg-rose-500/5 border border-rose-500/20" : ""
                        )}>
                          <div className="col-span-3">
                            {editing.type === 'ichiban' ? (
                              <input 
                                type="text" 
                                value={item.rarity} 
                                onChange={e => {
                                  const newItems = [...editing.items];
                                  newItems[originalIdx] = { ...item, rarity: e.target.value };
                                  setEditing({ ...editing, items: newItems });
                                }}
                                className={cn(
                                  "w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-[10px] font-bold text-white",
                                  item.rarity === 'LastOne' ? "border-rose-500/30" : ""
                                )}
                                placeholder="Rarity"
                              />
                            ) : (
                              <div className="text-xs font-bold text-slate-500">{item.rarity}</div>
                            )}
                          </div>
                          <input 
                            type="text" 
                            value={item.name} 
                            onChange={e => {
                              const newItems = [...editing.items];
                              newItems[originalIdx] = { ...item, name: e.target.value };
                              setEditing({ ...editing, items: newItems });
                            }}
                            className={cn(
                              "bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white",
                              editing.type === 'ichiban' ? "col-span-5" : "col-span-7"
                            )}
                          />
                          {editing.type === 'ichiban' && (
                            <div className="col-span-4 flex items-center gap-2">
                              {item.rarity !== 'LastOne' ? (
                                <input 
                                  type="number" 
                                  value={item.count} 
                                  onChange={e => {
                                    const newItems = [...editing.items];
                                    const val = parseInt(e.target.value) || 0;
                                    newItems[originalIdx] = { ...item, count: val, initialCount: val };
                                    setEditing({ ...editing, items: newItems });
                                  }}
                                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                                  placeholder="Qty"
                                />
                              ) : (
                                <div className="w-full text-[10px] text-rose-400 font-black uppercase tracking-widest text-center">
                                  Last One Prize
                                </div>
                              )}
                              <button 
                                onClick={() => {
                                  if (item.rarity === 'LastOne') return;
                                  const newItems = editing.items.filter((_, i) => i !== originalIdx);
                                  setEditing({ ...editing, items: newItems });
                                }}
                                disabled={item.rarity === 'LastOne'}
                                className={cn(
                                  "p-1.5 transition-colors",
                                  item.rarity === 'LastOne' ? "text-slate-800 cursor-not-allowed" : "text-slate-600 hover:text-red-400"
                                )}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
                  <button onClick={() => setEditing(null)} className="px-6 py-2 text-slate-400 font-bold">Cancel</button>
                  <button 
                    onClick={() => { 
                      let processedPool = { ...editing };
                      if (processedPool.type === 'ichiban') {
                        processedPool.items = processedPool.items.map(item => ({
                          ...item,
                          initialCount: item.count
                        }));
                      }
                      onUpdate(pools.map(p => p.id === editing.id ? processedPool : p)); 
                      setEditing(null); 
                    }} 
                    className="px-8 py-2 bg-indigo-600 text-white rounded-lg font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
