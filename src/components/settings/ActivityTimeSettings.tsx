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


export const ActivityTimeSettings = ({ state, setState }: { state: any, setState: (fn: (prev: any) => any) => void }) => {
  const timeSettings = state.timeSettings || {
    morning: { start: 8, end: 12 },
    afternoon: { start: 14, end: 18 },
    night: { start: 20, end: 24 }
  };

  const updateTime = (key: keyof typeof timeSettings, field: 'start' | 'end', val: number) => {
    setState(prev => ({
      ...prev,
      timeSettings: {
        ...timeSettings,
        [key]: { ...timeSettings[key], [field]: val }
      }
    }));
  };

  const TimeBlock = ({ label, icon: Icon, color, settings, periodKey }: { 
    label: string, 
    icon: any, 
    color: string, 
    settings: { start: number, end: number },
    periodKey: 'morning' | 'afternoon' | 'night'
  }) => (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("p-2 rounded-xl", color)}>
            <Icon size={16} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-200">{label}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
            {settings.start.toString().padStart(2, '0')}:00 - {settings.end.toString().padStart(2, '0')}:00
          </span>
          {settings.start > settings.end && (
            <span className="text-[8px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
              <RefreshCw size={8} /> Spans Across Midnight
            </span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Start Hour</label>
          <select 
            value={settings.start}
            onChange={(e) => updateTime(periodKey, 'start', parseInt(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            {Array.from({ length: 25 }).map((_, i) => (
              <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">End Hour</label>
          <select 
            value={settings.end}
            onChange={(e) => updateTime(periodKey, 'end', parseInt(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            {Array.from({ length: 25 }).map((_, i) => (
              <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 text-indigo-400 mb-6 pb-2">
        <TimerIcon size={20} />
        <h4 className="text-lg font-bold uppercase tracking-widest pr-1">Activity Time Peaks</h4>
      </div>
      <p className="text-[10px] text-slate-500 italic mb-4 leading-relaxed">
        Customize the segments for your Record tab's activity charts. 
        Note: Regions not covered by these ranges will be cataloged as "Other".
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TimeBlock 
          label="Morning" 
          icon={Sun} 
          color="bg-amber-500/10 text-amber-400" 
          settings={timeSettings.morning}
          periodKey="morning"
        />
        <TimeBlock 
          label="Afternoon" 
          icon={Sun} 
          color="bg-orange-500/10 text-orange-400" 
          settings={timeSettings.afternoon}
          periodKey="afternoon"
        />
        <TimeBlock 
          label="Night" 
          icon={Moon} 
          color="bg-indigo-500/10 text-indigo-400" 
          settings={timeSettings.night}
          periodKey="night"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-3xl mt-2">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl", state.showOtherInActivityLog !== false ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-800 text-slate-500")}>
            <Layers size={20} />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Show "Other" Periods</div>
            <div className="text-[10px] text-slate-500">Include sessions outside peak hours in charts</div>
          </div>
        </div>
        <button
          onClick={() => setState(prev => ({ ...prev, showOtherInActivityLog: prev.showOtherInActivityLog === false ? true : false }))}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            state.showOtherInActivityLog !== false ? "bg-indigo-400" : "bg-slate-700"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              state.showOtherInActivityLog !== false ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>
    </div>
  );
};

