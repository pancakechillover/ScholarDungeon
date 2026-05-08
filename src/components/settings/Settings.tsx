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


import { ActivityTimeSettings } from './ActivityTimeSettings';
import { TimerSettingsSection } from './TimerSettingsSection';
import { LevelRewardsSettings } from './LevelRewardsSettings';
import { GeneralSettings } from './GeneralSettings';
import { DevResourceControl } from './DevResourceControl';
import { RewardSettings } from './RewardSettings';
import { ShopSettings } from './ShopSettings';
import { GachaSettings } from './GachaSettings';

interface VersionGroupProps {
  group: string;
  logs: typeof RELEASE_HISTORY;
  isInitialExpanded: boolean;
}

const VersionGroup: React.FC<VersionGroupProps> = ({ group, logs, isInitialExpanded }) => {
  const [isExpanded, setIsExpanded] = useState(isInitialExpanded);
  
  return (
    <div className="bg-slate-900/40 rounded-2xl border border-slate-800 overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <Layers size={16} className={cn("transition-colors", isExpanded ? "text-indigo-400" : "text-slate-500")} />
          <span className="text-sm font-black uppercase tracking-widest text-slate-200">Version {group}.x Series</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{logs.length} Updates</span>
          <ChevronRight size={16} className={cn("text-slate-600 transition-transform duration-300", isExpanded && "rotate-90")} />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 pt-2 space-y-8 border-t border-slate-800/50">
              {logs.map((log) => (
                <div key={log.version} className={cn(
                  "space-y-2 relative pl-6 border-l-2",
                  log.version === APP_VERSION ? "border-indigo-500/30" : "border-slate-700/50"
                )}>
                  <div className={cn(
                    "absolute top-1.5 -left-[5px] w-2 h-2 rounded-full",
                    log.version === APP_VERSION ? "bg-indigo-400" : "bg-slate-600"
                  )} />
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className={cn(
                      "text-lg",
                      log.version === APP_VERSION ? "font-black text-white" : "font-bold text-slate-300"
                    )}>{log.version}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs font-bold font-mono">{log.date}</span>
                      {log.time && (
                        <span className="text-indigo-500/60 text-[10px] font-bold font-mono px-1.5 py-0.5 bg-indigo-500/5 rounded border border-indigo-500/10">
                          {log.time}
                        </span>
                      )}
                    </div>
                  </div>
                  <h5 className={cn(
                    log.version === APP_VERSION ? "font-bold text-indigo-300" : "font-medium text-slate-400"
                  )}>{log.title}</h5>
                  <ul className="text-slate-400 text-sm space-y-2 list-disc ml-4">
                    {log.items.map((item, i) => (
                      <li key={i}>
                        <span className="text-indigo-400 font-bold">{item.category}:</span> {item.description}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export interface SettingsProps {
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
  rewardPool: RewardCard[];
  shopItems: ShopItem[];
  gachaPools: GachaPool[];
  onUpdateRewards: (rewards: RewardCard[]) => void;
  onUpdateShop: (shop: ShopItem[]) => void;
  onUpdateGacha: (gacha: GachaPool[]) => void;
  onResetRewards?: () => void;
  addXP: (amount: number) => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  onTabChange?: (tab: any) => void;
}

export const Settings = React.memo<SettingsProps>(({
  state,
  setState,
  rewardPool,
  shopItems,
  gachaPools,
  onUpdateRewards,
  onUpdateShop,
  onUpdateGacha,
  onResetRewards,
  addXP,
  activeSection,
  setActiveSection,
  onTabChange
}) => {
  const [devPassword, setDevPassword] = useState('');
  const [isDevUnlocked, setIsDevUnlocked] = useState(state.devModeEnabled || false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleExportData = () => {
    const data = {
      state: state,
      dungeons: JSON.parse(localStorage.getItem('scholars_dungeon_state_dungeons') || '[]'),
      majorDungeons: JSON.parse(localStorage.getItem('scholars_dungeon_state_major_dungeons') || '[]'),
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scholars_dungeon_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          } else if (myResult.status === 'failed') {
            const err = myResult.error || {};
            alert(`Push Service Rejected: ${err.message} (Status: ${err.statusCode})\n\nThis usually means the VAPID keys or subscription are invalid.`);
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
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-900/80 backdrop-blur rounded-3xl w-full border border-slate-800">
        {(['general', 'timer', 'level', 'merchant', 'dev', 'about'] as const).map(tab => {
          return (
            <button
              key={tab}
              onClick={() => setActiveSection(tab)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeSection === tab 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-105 z-10" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
              )}
            >
              {tab === 'dev' ? 'Developer' : tab === 'level' ? 'Level' : tab === 'merchant' ? 'Merchant' : tab === 'about' ? 'About' : tab}
            </button>
          );
        })}
      </div>

      <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8 backdrop-blur-sm">
        {activeSection === 'general' && (
          <GeneralSettings state={state} setState={setState} setShowClearConfirm={setShowClearConfirm} />
        )}
        {activeSection === 'timer' && (
          <TimerSettingsSection 
            state={state} 
            setState={setState} 
            rewardPool={rewardPool}
            onUpdateRewards={onUpdateRewards}
            onResetRewards={onResetRewards}
            onTabChange={onTabChange}
          />
        )}
        {(activeSection === 'level' as any || activeSection === 'levelRewards' as any) && (
          <LevelRewardsSettings state={state} setState={setState} />
        )}
        {activeSection === 'merchant' && (
          <div className="space-y-12">
            <ShopSettings items={shopItems} onUpdate={onUpdateShop} />
            
            <div className="pt-12 border-t border-slate-800">
              <GachaSettings pools={gachaPools} onUpdate={onUpdateGacha} />
            </div>

            {/* Draw Animation Section at the very end */}
            <div className="pt-12 border-t border-slate-800 space-y-6">
              <div className="flex items-center gap-2.5 text-indigo-400 mb-6 pb-2">
                <Sparkles size={20} />
                <h4 className="text-lg font-bold uppercase tracking-widest pr-1">Draw Animation</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-5 bg-slate-900/50 rounded-3xl border border-indigo-500/10 shadow-inner">
                  <div className="flex items-center gap-2 mb-1">
                    <Package size={16} className="text-indigo-400" />
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gacha Draw</label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'card', name: 'Classic Flip', icon: Layers, desc: 'Vertical flip' },
                      { id: 'scratch', name: 'Scratch-off', icon: Scroll, desc: 'Reveal' }
                    ].map(effect => {
                      const isActive = (state.gachaAnimation || 'card') === effect.id;
                      return (
                        <button
                          key={effect.id}
                          onClick={() => setState((prev: any) => ({ ...prev, gachaAnimation: effect.id as 'card' | 'scratch' }))}
                          className={cn(
                            "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all relative overflow-hidden group text-left",
                            isActive 
                              ? "bg-indigo-500/10 border-indigo-500" 
                              : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                          )}
                        >
                          <effect.icon size={20} className={cn("transition-transform group-hover:scale-110", isActive ? "text-indigo-400" : "text-slate-600")} />
                          <div>
                            <div className={cn("text-[9px] font-black uppercase tracking-widest leading-none mb-0.5", isActive ? "text-white" : "text-slate-500")}>
                              {effect.name}
                            </div>
                            <div className="text-[8px] opacity-60 font-medium whitespace-nowrap">{effect.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4 p-5 bg-slate-900/50 rounded-3xl border border-indigo-500/10 shadow-inner">
                  <div className="flex items-center gap-2 mb-1">
                    <Ticket size={16} className="text-indigo-400" />
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ichiban Draw</label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'card', name: 'Classic Flip', icon: Layers, desc: 'Vertical flip' },
                      { id: 'scratch', name: 'Scratch-off', icon: Scroll, desc: 'Reveal' }
                    ].map(effect => {
                      const isActive = (state.ichibanAnimation || 'scratch') === effect.id;
                      return (
                        <button
                          key={effect.id}
                          onClick={() => setState((prev: any) => ({ ...prev, ichibanAnimation: effect.id as 'card' | 'scratch' }))}
                          className={cn(
                            "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all relative overflow-hidden group text-left",
                            isActive 
                              ? "bg-indigo-500/10 border-indigo-500" 
                              : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                          )}
                        >
                          <effect.icon size={20} className={cn("transition-transform group-hover:scale-110", isActive ? "text-indigo-400" : "text-slate-600")} />
                          <div>
                            <div className={cn("text-[9px] font-black uppercase tracking-widest leading-none mb-0.5", isActive ? "text-white" : "text-slate-500")}>
                              {effect.name}
                            </div>
                            <div className="text-[8px] opacity-60 font-medium whitespace-nowrap">{effect.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Allow Overlap Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800 mt-6">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-xl", state.gachaAllowOverlap ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-800 text-slate-500")}>
                    <Layers size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-white uppercase text-xs tracking-widest">Overlap Mode</div>
                    <div className="text-[10px] text-slate-500">Show cards one by one with navigation</div>
                  </div>
                </div>
                <button
                  onClick={() => setState((prev: any) => ({ ...prev, gachaAllowOverlap: !prev.gachaAllowOverlap }))}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    state.gachaAllowOverlap ? "bg-indigo-500" : "bg-slate-700"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      state.gachaAllowOverlap ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
        {(activeSection === 'shop' as any) && (
          <ShopSettings items={shopItems} onUpdate={onUpdateShop} />
        )}
        {(activeSection === 'gacha' as any) && (
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
                <div className="flex items-center justify-between gap-2.5 pb-4 mb-6">
                  <div className="flex items-center gap-2.5 text-indigo-400">
                    <Wrench size={20} />
                    <h3 className="text-lg font-bold uppercase tracking-widest pr-1">Developer Tools</h3>
                  </div>
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

                {/* Section 2: Resource Modification */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2.5 text-amber-400 mb-6 pb-2">
                    <Package size={20} />
                    <h4 className="text-lg font-bold uppercase tracking-widest pr-1">Resource Modification</h4>
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
                  <div className="flex items-center gap-2.5 text-indigo-400 mb-6 pb-2">
                    <Bell size={20} />
                    <h4 className="text-lg font-bold uppercase tracking-widest pr-1">Notification Testing</h4>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={async () => {
                        if (!confirm('This will unregister all service workers and clear local push state. Continue?')) return;
                        try {
                          const regs = await navigator.serviceWorker.getRegistrations();
                          for (const reg of regs) {
                            await reg.unregister();
                          }
                          setState(prev => ({ ...prev, pushEnabled: false, pushSubscription: null }));
                          alert('Service Workers unregistered. Please refresh the page and re-enable notifications.');
                          window.location.reload();
                        } catch (e) {
                          alert('Reset failed: ' + e);
                        }
                      }}
                      className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold py-2 rounded-xl text-xs transition-all"
                    >
                      <Trash2 size={14} />
                      Reset Service Worker
                    </button>
                    <button
                      onClick={async () => {
                        if (!state.secretCode) return alert('Secret Code required');
                        if (!confirm('This will delete your push subscription from the server. You will need to re-enable notifications. Continue?')) return;
                        try {
                          // We don't have a direct delete endpoint, but we can send a null subscription or similar
                          // Actually, let's add a proper delete logic if possible, or just overwrite with invalid
                          const res = await fetch('/api/push/subscribe', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              secretCode: state.secretCode,
                              subscription: null // Backend should handle this or we add a delete endpoint
                            })
                          });
                          if (res.ok) {
                            setState(prev => ({ ...prev, pushEnabled: false, pushSubscription: null }));
                            alert('Server subscription cleared.');
                          } else {
                            alert('Failed to clear server subscription.');
                          }
                        } catch (e) {
                          alert('Error: ' + e);
                        }
                      }}
                      className="flex items-center justify-center gap-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold py-2 rounded-xl text-xs transition-all"
                    >
                      <Trash2 size={14} />
                      Clear Server Sub
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/push/vapid-public-key');
                          const data = await res.json();
                          alert(`VAPID Public Key:\n${data.publicKey}\n\nCheck console for full string.`);
                          console.log('Current VAPID Public Key:', data.publicKey);
                        } catch (e) {
                          alert('Failed to fetch VAPID key');
                        }
                      }}
                      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold py-2 rounded-xl text-xs transition-all"
                    >
                      <Key size={14} />
                      View VAPID Key
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const reg = await navigator.serviceWorker.getRegistration();
                          if (reg) {
                            await reg.update();
                            alert('Service Worker update triggered. Check console for logs.');
                          } else {
                            alert('No Service Worker registration found.');
                          }
                        } catch (e) {
                          alert('Update failed: ' + e);
                        }
                      }}
                      className="flex items-center justify-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold py-2 rounded-xl text-xs transition-all"
                    >
                      <RefreshCw size={14} />
                      Update SW
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const reg = await navigator.serviceWorker.getRegistration();
                          if (reg && reg.active) {
                            reg.active.postMessage({ type: 'TEST_NOTIFICATION_SW' });
                            alert('Message sent to Service Worker thread. Check SW console.');
                          } else {
                            alert('No active Service Worker found to message.');
                          }
                        } catch (e) {
                          alert('Direct SW Test failed: ' + e);
                        }
                      }}
                      className="flex items-center justify-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold py-2 rounded-xl text-xs transition-all"
                    >
                      <Zap size={14} />
                      Test SW Thread
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const permission = await Notification.requestPermission();
                          if (permission === 'granted') {
                            const reg = await navigator.serviceWorker.ready;
                            await reg.showNotification("Scholar's Dungeon", {
                              body: 'Direct thread notification test successful!',
                              icon: '/pwa-icon.svg'
                            });
                          } else {
                            alert('Permission not granted: ' + permission);
                          }
                        } catch (e) {
                          alert('Direct Notification Test failed: ' + e);
                        }
                      }}
                      className="flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 font-bold py-2 rounded-xl text-xs transition-all"
                    >
                      <Eye size={14} />
                      Test Direct UI
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm('ULTRA RESET: This will wipe all push-related data (SW + Server + Local) and try to register from scratch. Use this if "Test Direct UI" works but remote push is silent. Continue?')) return;
                        setIsTestingNotification(true);
                        try {
                          // 1. Clear server
                          if (state.secretCode) {
                            await fetch('/api/push/subscribe', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ secretCode: state.secretCode, subscription: null })
                            });
                          }
                          // 2. Unregister ALL service workers
                          const regs = await navigator.serviceWorker.getRegistrations();
                          for (const reg of regs) { await reg.unregister(); }
                          // 3. Clear state
                          setState(prev => ({ ...prev, pushEnabled: false, pushSubscription: null }));
                          
                          alert('Deep Clean Step 1 Complete: Data wiped. Now refreshing page to re-install. After refresh, manually turn on Push Notifications.');
                          window.location.reload();
                        } catch (e) {
                          alert('Deep Clean failed: ' + e);
                        } finally {
                          setIsTestingNotification(false);
                        }
                      }}
                      disabled={isTestingNotification}
                      className="flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 font-bold py-2 rounded-xl text-xs transition-all col-span-1 sm:col-span-2"
                    >
                      <RefreshCw className={cn("w-3 h-3", isTestingNotification && "animate-spin")} />
                      Full Push Deep Reset (Wipe & Re-Sync)
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
                    Version {APP_VERSION}
                  </span>
                  <span className="text-slate-500 text-xs font-medium">
                    Updated: {LAST_UPDATE_DATE}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700/50 space-y-4">
                <div className="flex items-center gap-2.5 text-indigo-400 mb-6 pb-2">
                  <Scroll size={20} />
                  <h4 className="text-lg font-bold uppercase tracking-widest pr-1">Project Info</h4>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Scholar's Dungeon is a gamified learning system designed to turn study sessions into an immersive Roguelike adventure. 
                  By combining the Pomodoro technique with RPG progression, it helps students and lifelong learners maintain focus and motivation.
                </p>
              </div>

              <div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700/50 space-y-6">
                <div className="flex items-center gap-2.5 text-indigo-400 mb-6 pb-2">
                  <User size={20} />
                  <h4 className="text-lg font-bold uppercase tracking-widest pr-1">Author & Links</h4>
                </div>
                
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

            <div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700/50 space-y-6">
              <div className="flex items-center gap-2.5 text-indigo-400 mb-6 pb-2">
                <History size={20} />
                <h4 className="text-lg font-bold uppercase tracking-widest pr-1">Release History</h4>
              </div>
              
              <div className="space-y-4">
                {(() => {
                  // Group history by Minor Version (e.g., v4.5, v4.4)
                  const grouped = RELEASE_HISTORY.reduce((acc, log) => {
                    const parts = log.version.replace('v', '').split('.');
                    const groupKey = `v${parts[0]}.${parts[1]}`;
                    if (!acc[groupKey]) acc[groupKey] = [];
                    acc[groupKey].push(log);
                    return acc;
                  }, {} as Record<string, typeof RELEASE_HISTORY>);

                  return Object.entries(grouped).map(([group, logs]) => (
                    <VersionGroup 
                      key={group} 
                      group={group} 
                      logs={logs} 
                      isInitialExpanded={logs.some(l => l.version === APP_VERSION)} 
                    />
                  ));
                })()}
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
                  
                  <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 space-y-3">
                    <p className="text-xs text-indigo-300 font-bold leading-relaxed">
                      Before proceeding, we strongly recommend exporting your data for safekeeping.
                    </p>
                    <button
                      onClick={handleExportData}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      <Database size={14} />
                      Export Data as JSON
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Type "Delete" to confirm</label>
                    <input 
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type Delete here"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-red-500 outline-none transition-all font-bold"
                    />
                  </div>

                  <p className="text-red-400 text-sm font-bold">
                    Are you absolutely sure you want to proceed?
                  </p>
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => {
                        setShowClearConfirm(false);
                        setDeleteConfirmText('');
                      }}
                      className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                      disabled={deleteConfirmText.toLowerCase() !== 'delete'}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors"
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
