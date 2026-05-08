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


export const ShopSettings = ({ items, onUpdate }: { items: ShopItem[], onUpdate: (i: ShopItem[]) => void }) => {
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
        {items.map(item => {
          const IconComp = (item.icon && (LucideIcons as any)[item.icon]) ? (LucideIcons as any)[item.icon] : LucideIcons.ShoppingBag;
          return (
          <div key={item.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <IconComp size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white tracking-tight">{item.name}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.description}</p>
                <div className="flex items-center gap-1.5 text-amber-500 font-bold mt-2 text-xs bg-amber-500/10 w-fit px-2 py-0.5 rounded border border-amber-500/20">
                  <Coins size={12} /> {item.price.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 shrink-0 ml-4">
              <button onClick={() => setEditing(item)} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"><Edit2 size={16} /></button>
              <button onClick={() => onUpdate(items.filter(i => i.id !== item.id))} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-800 rounded transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        )})}
      </div>

      {createPortal(
        <AnimatePresence>
          {editing && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 p-8 rounded-[2rem] border border-slate-700 w-full max-w-2xl flex flex-col max-h-[90vh] shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 text-amber-500 rounded-xl">
                      <ShoppingBag size={20} />
                    </div>
                    <h4 className="text-xl font-bold text-white tracking-tight">Edit Shop Item</h4>
                  </div>
                  <div className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-700">Market</div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Item Name</label>
                          <input type="text" placeholder="e.g. Ancient Relic" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-amber-500 transition-colors" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Price (Gold)</label>
                            <div className="relative">
                              <input type="number" placeholder="Price" value={editing.price} onChange={e => setEditing({...editing, price: parseInt(e.target.value) || 0})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-white text-sm focus:border-amber-500 transition-colors" />
                              <Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center justify-between">
                              Stock Availability
                              <span className="text-[8px] text-slate-500 font-bold uppercase opacity-50 tracking-tighter">(-1 = Infinite)</span>
                            </label>
                            <input type="number" placeholder="Stock" value={editing.stock ?? -1} onChange={e => setEditing({...editing, stock: parseInt(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-amber-500 transition-colors" />
                          </div>
                        </div>
                        <div className="space-y-1.5 flex-1 flex flex-col">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
                          <textarea placeholder="What does this item do?..." value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm flex-1 min-h-[160px] resize-none focus:border-amber-500 transition-colors" />
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center justify-between">
                          <span>Visual Identifier (Icon)</span>
                          <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">{editing.icon || 'ShoppingBag'}</span>
                        </label>
                        <div className="grid grid-cols-6 gap-3 p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 scrollbar-thin scrollbar-thumb-slate-800">
                          {['ShoppingBag', 'Sparkles', 'Trophy', 'Coins', 'Zap', 'Flame', 'Gem', 'Target', 'Star', 'Heart', 'Shield', 'Sword', 'Coffee', 'Pizza', 'Gift', 'Package', 'Camera', 'Music', 'Book', 'Gamepad2', 'Ghost', 'Moon', 'Sun', 'Cloud', 'Anchor', 'Compass', 'Map', 'Key', 'Lock', 'Unlock', 'Bell', 'BellOff', 'Eye', 'EyeOff', 'Search', 'Settings', 'Ticket'].map(iconName => {
                            const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.ShoppingBag;
                            const isSelected = (editing.icon || 'ShoppingBag') === iconName;
                            return (
                              <button
                                key={iconName}
                                type="button"
                                onClick={() => setEditing({...editing, icon: iconName})}
                                className={cn(
                                  "aspect-square flex items-center justify-center rounded-xl transition-all border",
                                  isSelected 
                                    ? "bg-amber-500 border-amber-400 text-slate-900 shadow-lg shadow-amber-500/20 scale-110 z-10" 
                                    : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                                )}
                                title={iconName}
                              >
                                <IconComponent size={20} />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-800 shrink-0">
                  <button onClick={() => setEditing(null)} className="px-5 py-2.5 text-slate-400 font-bold hover:text-white transition-colors">Cancel</button>
                  <button onClick={() => { onUpdate(items.some(i => i.id === editing.id) ? items.map(i => i.id === editing.id ? editing : i) : [...items, editing]); setEditing(null); }} className="px-8 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl font-black transition-all shadow-lg shadow-amber-500/20 active:scale-95">Save Item</button>
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


