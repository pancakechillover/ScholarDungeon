import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { RewardCard, ShopItem, GachaPool, Rarity } from '../../types';
import { INITIAL_GACHA } from '../../constants';
import { Plus, Trash2, Save, Edit2, X, ChevronRight, Coins, Zap, Sparkles, Trophy, Timer as TimerIcon, Package, Flame, AlertTriangle, Scroll, Volume2, VolumeX, Sun, Moon, Settings as SettingsIcon, ShoppingBag, Trees, Waves, Database, Download, Upload, Target, Gift, User, Sword, Eye, Palette, Check, Bell, BellOff, RefreshCw, Key, Layers, Sunrise, Cloud, CloudSun, Lollipop, Wrench, History, Ticket } from 'lucide-react';
import { SlotMachine } from '../icons/SlotMachine';
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


export const GachaSettings = ({ pools, onUpdate }: { pools: GachaPool[], onUpdate: (p: GachaPool[]) => void }) => {
  const [editing, setEditing] = useState<GachaPool | null>(null);

  return (
    <div className="space-y-6">
      <div className="space-y-12">
        {/* Gacha Pools Section */}
        {pools.some(p => p.type === 'gacha') && (
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 text-purple-400 mb-6 pb-2">
              <SlotMachine size={20} />
              <h3 className="text-lg font-bold uppercase tracking-widest pr-1">Standard Gacha</h3>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {pools.filter(p => p.type === 'gacha').map(pool => (
                <div key={pool.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                        <SlotMachine size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{pool.name}</h4>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">Draw cost • {pool.cost.toLocaleString()} Gold</p>
                      </div>
                    </div>
                    <button onClick={() => setEditing(pool)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-700">Edit Settings</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pool.items.map((item, idx) => (
                      <div key={idx} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-400">
                        <span className="font-bold text-slate-200">{item.rarity}:</span> {item.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ichiban Pools Section */}
        {pools.some(p => p.type === 'ichiban') && (
          <div className="space-y-6 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-2.5 text-emerald-400 mb-6 pb-2">
              <Ticket size={20} />
              <h3 className="text-lg font-bold uppercase tracking-widest pr-1">Ichiban Kuji</h3>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {pools.filter(p => p.type === 'ichiban').map(pool => (
                <div key={pool.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Ticket size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{pool.name}</h4>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">Ticket cost • {pool.cost.toLocaleString()} Gold</p>
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
                    }} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-700">Manage Tiers</button>
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
          </div>
        )}
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
                      type="text"
                      inputMode="numeric"
                      value={editing.cost === undefined || editing.cost === null ? '' : editing.cost}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') setEditing({ ...editing, cost: '' as any });
                        else {
                          const parsed = parseInt(val);
                          if (!isNaN(parsed)) setEditing({ ...editing, cost: parsed });
                        }
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {editing.type === 'gacha' && editing.weights && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">SSR Weight</label>
                        <input 
                          type="text"
                          inputMode="numeric"
                          value={editing.weights.SSR === undefined || editing.weights.SSR === null ? '' : editing.weights.SSR}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') setEditing({ ...editing, weights: { ...editing.weights!, SSR: '' as any } });
                            else {
                              const parsed = parseInt(val);
                              if (!isNaN(parsed)) setEditing({ ...editing, weights: { ...editing.weights!, SSR: parsed } });
                            }
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-purple-500 uppercase tracking-widest mb-2">SR Weight</label>
                        <input 
                          type="text"
                          inputMode="numeric"
                          value={editing.weights.SR === undefined || editing.weights.SR === null ? '' : editing.weights.SR}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') setEditing({ ...editing, weights: { ...editing.weights!, SR: '' as any } });
                            else {
                              const parsed = parseInt(val);
                              if (!isNaN(parsed)) setEditing({ ...editing, weights: { ...editing.weights!, SR: parsed } });
                            }
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">R Weight</label>
                        <input 
                          type="text"
                          inputMode="numeric"
                          value={editing.weights.R === undefined || editing.weights.R === null ? '' : editing.weights.R}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') setEditing({ ...editing, weights: { ...editing.weights!, R: '' as any } });
                            else {
                              const parsed = parseInt(val);
                              if (!isNaN(parsed)) setEditing({ ...editing, weights: { ...editing.weights!, R: parsed } });
                            }
                          }}
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
                                  type="text" 
                                  inputMode="numeric"
                                  value={item.count === undefined || item.count === null ? '' : item.count} 
                                  onChange={e => {
                                    const newItems = [...editing.items];
                                    const val = e.target.value;
                                    if (val === '') {
                                      newItems[originalIdx] = { ...item, count: '' as any, initialCount: '' as any };
                                    } else {
                                      const parsed = parseInt(val);
                                      if (!isNaN(parsed)) newItems[originalIdx] = { ...item, count: parsed, initialCount: parsed };
                                    }
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
                      if (editing.cost === '' as any || isNaN(editing.cost as number) || (editing.cost as number) < 0) {
                        alert("Please enter a valid cost per draw.");
                        return;
                      }
                      if (editing.type === 'gacha' && editing.weights) {
                        if (
                          editing.weights.SSR === '' as any || isNaN(editing.weights.SSR as number) || (editing.weights.SSR as number) < 0 ||
                          editing.weights.SR === '' as any || isNaN(editing.weights.SR as number) || (editing.weights.SR as number) < 0 ||
                          editing.weights.R === '' as any || isNaN(editing.weights.R as number) || (editing.weights.R as number) < 0
                        ) {
                          alert("Please enter valid weights for all rarity tiers.");
                          return;
                        }
                      }
                      if (editing.type === 'ichiban') {
                        for (const item of editing.items) {
                          if (item.rarity !== 'LastOne' && (item.count === '' as any || isNaN(item.count as number) || (item.count as number) < 0)) {
                            alert("Please enter a valid quantity for all items.");
                            return;
                          }
                        }
                      }

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
