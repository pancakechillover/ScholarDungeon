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

export const GeneralSettings = ({ state, setState, setShowClearConfirm }: { state: any, setState: (fn: (prev: any) => any) => void, setShowClearConfirm: (show: boolean) => void }) => {
  const themes = [
    { id: 'night', name: 'Night', color: '#4F39F6', icon: Moon, iconColor: '#f1efff' },
    { id: 'daylight', name: 'Daylight', color: '#f8fafc', icon: CloudSun, iconColor: '#4F39F6' },
    { id: 'warm', name: 'Warm Sun', color: '#F97C1E', icon: Sun, iconColor: '#FDE68A' },
    { id: 'candy', name: 'Candy', color: '#e656b1', icon: Lollipop, iconColor: '#fff2ff' },
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
      console.log('Requesting notification permission...');
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied:', permission);
        alert(`Notification permission ${permission}. Please enable it in your browser settings to receive alerts.`);
        return;
      }

      console.log('Checking for service worker registration...');
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        console.log('No service worker found, registering /sw.js...');
        registration = await navigator.serviceWorker.register('/sw.js', { 
          scope: '/',
          updateViaCache: 'none'
        });
      }
      
      console.log('Waiting for service worker to be ready...');
      // Add a timeout to prevent hanging on Android
      const readyPromise = navigator.serviceWorker.ready;
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Service Worker ready timeout (10s). If using Android, ensure the app is in foreground and not in an iframe.')), 10000)
      );
      
      registration = await Promise.race([readyPromise, timeoutPromise]) as ServiceWorkerRegistration;
      console.log('Service worker ready:', registration.active?.state);
      
      console.log('Fetching VAPID public key...');
      let publicKey: string;
      try {
        const vapidResponse = await fetch('/api/push/vapid-public-key');
        if (!vapidResponse.ok) throw new Error(`Status: ${vapidResponse.status}`);
        const data = await vapidResponse.json();
        publicKey = data.publicKey;
      } catch (err) {
        console.warn('Failed to fetch VAPID key from server, checking for existing env...', err);
        throw new Error('Could not retrieve VAPID key from server. Check your internet connection.');
      }
      
      console.log('VAPID key received, converting...');
      const convertedVapidKey = urlBase64ToUint8Array(publicKey);

      console.log('Subscribing to push manager...');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
      console.log('Push subscription successful:', subscription.endpoint);

      // Save to server if secretCode exists
      if (state.secretCode) {
        console.log('Push sync: Syncing subscription for', state.secretCode);
        const syncRes = await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secretCode: state.secretCode,
            subscription,
            deviceInfo: {
              userAgent: navigator.userAgent,
              browser: /Chrome/i.test(navigator.userAgent) ? 'Chrome' : /Firefox/i.test(navigator.userAgent) ? 'Firefox' : /Edge/i.test(navigator.userAgent) ? 'Edge' : 'Unknown'
            }
          })
        });
        if (!syncRes.ok) throw new Error(`Server sync failed: ${syncRes.status}`);
        console.log('Push sync: Success');
      }

      setState(prev => ({ ...prev, pushEnabled: true, pushSubscription: subscription }));
      console.log('Successfully enabled notifications and synced to server');
    } catch (error: any) {
      console.error('Failed to subscribe:', error);
      const msg = error.message || 'Unknown error';
      if (msg.includes('push service error')) {
        alert(`Push Service Error on Android detected.\n\nThis is a known Android limitation issue. We have applied a patch (gcm_sender_id) in version 1.7.2.\n\nTo fix:\n1. Delete/Uninstall this PWA from your phone.\n2. In your browser settings, clear cookies/cache for this site.\n3. Reload the site and install the PWA again.`);
      } else {
        alert(`Failed to enable notifications: ${msg}.\n\nCommon fixes:\n1. Open as New Tab\n2. Re-install PWA\n3. Reset SW in Dev Tools`);
      }
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
      console.log('Force Sync: Checking service worker...');
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        console.log('Force Sync: Registering new service worker...');
        registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      }
      
      console.log('Force Sync: Waiting for ready...');
      const readyPromise = navigator.serviceWorker.ready;
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Service Worker ready timeout (10s)')), 10000)
      );
      registration = await Promise.race([readyPromise, timeoutPromise]) as ServiceWorkerRegistration;
      
      console.log('Force Sync: Checking subscription...');
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        console.log('Force Sync: No subscription found, attempting to re-subscribe...');
        const vapidResponse = await fetch('/api/push/vapid-public-key');
        const { publicKey } = await vapidResponse.json();
        const convertedVapidKey = urlBase64ToUint8Array(publicKey);
        
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
        console.log('Force Sync: Re-subscribed successfully');
      }

      console.log('Force Sync: Sending to server...');
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
          <Palette size={18} />
          <h4 className="font-bold uppercase text-sm tracking-widest">Global Effects & Theme</h4>
        </div>

        <div className="space-y-4 pt-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">App Themes</label>
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
          <Sparkles size={18} />
          <h4 className="font-bold uppercase text-sm tracking-widest">Draw Animation</h4>
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
                    onClick={() => setState(prev => ({ ...prev, gachaAnimation: effect.id as 'card' | 'scratch' }))}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all relative overflow-hidden group",
                      isActive 
                        ? "bg-indigo-500/10 border-indigo-500" 
                        : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                    )}
                  >
                    <effect.icon size={20} className={cn("transition-transform group-hover:scale-110", isActive ? "text-indigo-400" : "text-slate-600")} />
                    <div className="text-center">
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
                    onClick={() => setState(prev => ({ ...prev, ichibanAnimation: effect.id as 'card' | 'scratch' }))}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all relative overflow-hidden group",
                      isActive 
                        ? "bg-indigo-500/10 border-indigo-500" 
                        : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                    )}
                  >
                    <effect.icon size={20} className={cn("transition-transform group-hover:scale-110", isActive ? "text-indigo-400" : "text-slate-600")} />
                    <div className="text-center">
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
            onClick={() => setState(prev => ({ ...prev, gachaAllowOverlap: !prev.gachaAllowOverlap }))}
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
        <ActivityTimeSettings state={state} setState={setState} />
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

