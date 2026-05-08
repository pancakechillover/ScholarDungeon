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


export const TimerSettingsSection = ({ state, setState }: { state: any, setState: (fn: (prev: any) => any) => void }) => {
  return (
    <div className="space-y-10">
      {/* Target Timer Settings */}
      <div className="space-y-6 border-slate-800">
        <div className="flex items-center gap-2 text-indigo-400 mb-6">
          <Eye size={18} />
          <h4 className="font-bold uppercase text-sm tracking-widest">UI Features</h4>
        </div>

        <div className="flex flex-col gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-xl", state.timerBannerCompactMode ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-800 text-slate-500")}>
                <TimerIcon size={20} />
              </div>
              <div>
                <div className="font-bold text-white">Compact Timer Banner</div>
                <div className="text-xs text-slate-500">Only show Fullscreen/PiP (hide quick navigation shortcuts)</div>
              </div>
            </div>
            <button
              onClick={() => setState(prev => ({ ...prev, timerBannerCompactMode: !prev.timerBannerCompactMode }))}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                state.timerBannerCompactMode ? "bg-indigo-500" : "bg-slate-700"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  state.timerBannerCompactMode ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
          
          {!state.timerBannerCompactMode && (
            <div className="pt-4 border-t border-slate-800/50">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2 mb-3 block">Visible Shortcuts</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'dungeons', name: 'Dungeons', icon: Sword },
                  { id: 'quests', name: 'Quests', icon: Target },
                  { id: 'achievements', name: 'Achievements', icon: Trophy },
                  { id: 'recent', name: 'Recent Sessions', icon: History },
                  { id: 'vault', name: 'Vault', icon: Package }
                ].map(shortcut => {
                  const isVisible = !(state.timerBannerShortcuts) || state.timerBannerShortcuts.includes(shortcut.id);
                  return (
                    <button
                      key={shortcut.id}
                      onClick={() => {
                        setState(prev => {
                          const current = prev.timerBannerShortcuts || ['dungeons', 'quests', 'achievements', 'recent', 'vault'];
                          if (current.includes(shortcut.id)) {
                            return { ...prev, timerBannerShortcuts: current.filter(id => id !== shortcut.id) };
                          } else {
                            return { ...prev, timerBannerShortcuts: [...current, shortcut.id] };
                          }
                        });
                      }}
                      className={cn(
                        "flex items-center gap-2 p-2 px-3 rounded-lg border transition-all text-sm font-medium",
                        isVisible
                          ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                          : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                      )}
                    >
                      <shortcut.icon size={14} className={isVisible ? "text-indigo-400" : "text-slate-600"} />
                      {shortcut.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-xl", state.timerSkipVictoryMode && state.timerSkipVictoryMode !== 'none' ? "bg-amber-500/10 text-amber-400" : "bg-slate-800 text-slate-500")}>
                <Sparkles size={20} />
              </div>
              <div>
                <div className="font-bold text-white">Skip Victory Screen</div>
                <div className="text-xs text-slate-500">Automatically handle rewards when a session finishes</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 border-t border-slate-800/50 pt-4">
            <button
              onClick={() => setState(prev => ({ ...prev, timerSkipVictoryMode: 'none' }))}
              className={cn("px-2 py-2 rounded-xl border text-sm font-medium transition-all text-center flex flex-col items-center justify-center gap-1", (!state.timerSkipVictoryMode || state.timerSkipVictoryMode === 'none') ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-400" : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800")}
            >
              <span>Show Screen</span>
              <span className="text-[10px] font-normal opacity-80">Default behavior</span>
            </button>
            <button
              onClick={() => setState(prev => ({ ...prev, timerSkipVictoryMode: 'defer_to_chest' }))}
              className={cn("px-2 py-2 rounded-xl border text-sm font-medium transition-all text-center flex flex-col items-center justify-center gap-1", state.timerSkipVictoryMode === 'defer_to_chest' ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800")}
            >
              <span>Defer to Chest</span>
              <span className="text-[10px] font-normal opacity-80">Store for later</span>
            </button>
            <button
              onClick={() => setState(prev => ({ ...prev, timerSkipVictoryMode: 'auto_pick_highest' }))}
              className={cn("px-2 py-2 rounded-xl border text-sm font-medium transition-all text-center flex flex-col items-center justify-center gap-1", state.timerSkipVictoryMode === 'auto_pick_highest' ? "bg-amber-500/20 border-amber-500/30 text-amber-400" : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800")}
            >
              <span>Auto-Pick</span>
              <span className="text-[10px] font-normal opacity-80">Takes highest rarity</span>
            </button>
            <button
              onClick={() => setState(prev => ({ ...prev, timerSkipVictoryMode: 'skip_rewards' }))}
              className={cn("px-2 py-2 rounded-xl border text-sm font-medium transition-all text-center flex flex-col items-center justify-center gap-1", state.timerSkipVictoryMode === 'skip_rewards' ? "bg-rose-500/20 border-rose-500/30 text-rose-400" : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800")}
            >
              <span>Skip Rewards</span>
              <span className="text-[10px] font-normal opacity-80">Discard drawn</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex items-center gap-2 text-amber-400">
          <Gift size={18} />
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
    </div>
  );
};

