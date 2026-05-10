import React, { useState } from 'react';
import { AppState } from '../../types';
import { Wrench, Package, Coins, Zap, Trophy, Flame, Sparkles, Bell, RefreshCw, Trash2, Key, Eye } from 'lucide-react';
import { DevResourceControl } from './DevResourceControl';
import { cn } from '../../lib/utils';
import { ConfirmModal } from '../ConfirmModal';

interface DeveloperSettingsProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  addXP: (amount: number) => void;
}

export const DeveloperSettings: React.FC<DeveloperSettingsProps> = ({
  state,
  setState,
  addXP
}) => {
  const [devPassword, setDevPassword] = useState('');
  const [isDevUnlocked, setIsDevUnlocked] = useState(state.devModeEnabled || false);
  const [testNotificationTitle, setTestNotificationTitle] = useState('Dungeon Alert!');
  const [testNotificationBody, setTestNotificationBody] = useState('Your focus session has ended.');
  const [isTestingNotification, setIsTestingNotification] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ 
    isOpen: boolean; 
    title: string; 
    message: string; 
    onConfirm?: () => void; 
    confirmText?: string;
    type?: 'danger' | 'warning' | 'info';
    isAlert?: boolean;
  }>({ isOpen: false, title: '', message: '' });

  const handleTestNotification = async () => {
    if (!state.secretCode) {
      setModalConfig({
        isOpen: true,
        title: "Sync Required",
        message: "Please link your account with a Secret Code first.",
        confirmText: "Got it",
        type: "warning",
        isAlert: true
      });
      return;
    }
    
    setIsTestingNotification(true);
    try {
      console.log('Testing: Scheduling notification (expired)...');
      const scheduleRes = await fetch('/api/push/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secretCode: state.secretCode,
          delayMinutes: -1,
          title: testNotificationTitle,
          body: testNotificationBody,
          type: 'focus'
        })
      });
      
      if (!scheduleRes.ok) throw new Error('Failed to schedule test notification');
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
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
            setModalConfig({
              isOpen: true,
              title: "Test Successful",
              message: `Success! Notification sent.\nQueue: ${debug.totalPendingInQueue} tasks remaining.`,
              confirmText: "Great",
              type: "info",
              isAlert: true
            });
          } else if (myResult.status === 'no_subscription') {
            setModalConfig({
              isOpen: true,
              title: "No Subscription",
              message: 'Error: No subscription found on server. Try "Force Sync" first.',
              confirmText: "Close",
              type: "warning",
              isAlert: true
            });
          } else if (myResult.status === 'failed') {
            const err = myResult.error || {};
            setModalConfig({
              isOpen: true,
              title: "Push Rejected",
              message: `Push Service Rejected: ${err.message} (Status: ${err.statusCode})\n\nThis usually means the VAPID keys or subscription are invalid.`,
              confirmText: "Close",
              type: "danger",
              isAlert: true
            });
          } else {
            setModalConfig({
              isOpen: true,
              title: "Notification Status",
              message: `Notification status: ${myResult.status} ${myResult.error || ''}`,
              confirmText: "Close",
              type: "warning",
              isAlert: true
            });
          }
        } else {
          if (checkData.processed > 0) {
            setModalConfig({
              isOpen: true,
              title: "Process Result",
              message: `Processed ${checkData.processed} tasks, but none matched your code. Check console.`,
              confirmText: "Close",
              type: "warning",
              isAlert: true
            });
          } else {
            setModalConfig({
              isOpen: true,
              title: "Queue Status",
              message: `No tasks processed. Queue count: ${debug.totalPendingInQueue}. If > 0, the task might not be due yet (Server Time: ${debug.serverTime}).`,
              confirmText: "Close",
              type: "info",
              isAlert: true
            });
          }
        }
      } else {
        setModalConfig({
          isOpen: true,
          title: "Check Failed",
          message: 'Check failed: ' + (checkData.error || 'Unknown error'),
          confirmText: "Close",
          type: "danger",
          isAlert: true
        });
      }
    } catch (error: any) {
      console.error('Test notification failed:', error);
      setModalConfig({
        isOpen: true,
        title: "Test Error",
        message: 'Test failed: ' + error.message,
        confirmText: "Close",
        type: "danger",
        isAlert: true
      });
    } finally {
      setIsTestingNotification(false);
    }
  };

  const handleUnlockDev = () => {
    if (devPassword === '8424') {
      setIsDevUnlocked(true);
      setState(prev => ({ ...prev, devModeEnabled: true }));
    } else {
      setModalConfig({
        isOpen: true,
        title: "Access Denied",
        message: "Incorrect password for Developer Mode.",
        confirmText: "Try Again",
        type: "danger",
        isAlert: true
      });
    }
  };

  return (
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
          {/* Section 2: Resource Modification */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 mb-6 pb-2 border-b border-slate-800/50">
              <div className="flex items-center gap-2.5 text-amber-400">
                <Package size={20} />
                <h4 className="text-lg font-bold uppercase tracking-widest pr-1">Resource Modification</h4>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            
            <div className="mt-6 pt-6 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Talent Management</h4>
              <button
                onClick={() => {
                  setModalConfig({
                    isOpen: true,
                    title: "Reset Talent Tree?",
                    message: "This will lock all talents and clear your active build. Your spent Talent Points will NOT be refunded automatically. Continue?",
                    confirmText: "Reset Talents",
                    type: "danger",
                    onConfirm: () => {
                      setState(prev => ({ ...prev, unlockedTalents: [], activeTalents: [] }));
                    }
                  });
                }}
                className="w-full flex items-center justify-center gap-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold py-3 rounded-xl text-sm transition-all"
              >
                <RefreshCw size={16} />
                Reset Talent Tree
              </button>
            </div>
          </div>

          {/* Section 3: Notification Testing */}
          <div className="space-y-6 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-2.5 text-indigo-400 mb-6 pb-2">
              <Bell size={20} />
              <h4 className="text-lg font-bold uppercase tracking-widest pr-1">Notification Testing</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    setModalConfig({
                      isOpen: true,
                      title: "Manual Check",
                      message: `Processed ${data.processed} tasks. Check console for details.`,
                      confirmText: "Got it",
                      type: "info",
                      isAlert: true
                    });
                  } catch (e) {
                    setModalConfig({
                      isOpen: true,
                      title: "Check Failed",
                      message: "Manual check failed.",
                      confirmText: "Close",
                      type: "danger",
                      isAlert: true
                    });
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={async () => {
                  setModalConfig({
                    isOpen: true,
                    title: "Reset Service Worker?",
                    message: "This will unregister all service workers and clear local push state. Continue?",
                    confirmText: "Reset & Reload",
                    type: "danger",
                    onConfirm: async () => {
                      try {
                        const regs = await navigator.serviceWorker.getRegistrations();
                        for (const reg of regs) {
                          await reg.unregister();
                        }
                        setState(prev => ({ ...prev, pushEnabled: false, pushSubscription: null }));
                        window.location.reload();
                      } catch (e) {
                        setModalConfig({
                          isOpen: true,
                          title: "Reset Failed",
                          message: "Reset failed: " + e,
                          confirmText: "Close",
                          type: "danger",
                          isAlert: true
                        });
                      }
                    }
                  });
                }}
                className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold py-2 rounded-xl text-xs transition-all"
              >
                <Trash2 size={14} />
                Reset Service Worker
              </button>
              <button
                onClick={async () => {
                  if (!state.secretCode) {
                    setModalConfig({
                      isOpen: true,
                      title: "Secret Code Required",
                      message: "Please link your account with a Secret Code first.",
                      confirmText: "Got it",
                      type: "warning",
                      isAlert: true
                    });
                    return;
                  }
                  setModalConfig({
                    isOpen: true,
                    title: "Clear Server Subscription?",
                    message: "This will delete your push subscription from the server. You will need to re-enable notifications. Continue?",
                    confirmText: "Clear Server Sub",
                    type: "warning",
                    onConfirm: async () => {
                      try {
                        const res = await fetch('/api/push/subscribe', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            secretCode: state.secretCode,
                            subscription: null
                          })
                        });
                        if (res.ok) {
                          setState(prev => ({ ...prev, pushEnabled: false, pushSubscription: null }));
                          setModalConfig({
                            isOpen: true,
                            title: "Success",
                            message: "Server subscription cleared.",
                            confirmText: "Done",
                            type: "info",
                            isAlert: true
                          });
                        } else {
                          setModalConfig({
                            isOpen: true,
                            title: "Error",
                            message: "Failed to clear server subscription.",
                            confirmText: "Close",
                            type: "danger",
                            isAlert: true
                          });
                        }
                      } catch (e) {
                        setModalConfig({
                          isOpen: true,
                          title: "Error",
                          message: 'Error: ' + e,
                          confirmText: "Close",
                          type: "danger",
                          isAlert: true
                        });
                      }
                    }
                  });
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
                    setModalConfig({
                      isOpen: true,
                      title: "VAPID Public Key",
                      message: `Current Public Key:\n${data.publicKey}\n\nCheck console for full string.`,
                      confirmText: "Copy to Console",
                      type: "info",
                      onConfirm: () => console.log('VAPID Public Key:', data.publicKey)
                    });
                  } catch (e) {
                    setModalConfig({
                      isOpen: true,
                      title: "Error",
                      message: "Failed to fetch VAPID key",
                      confirmText: "Close",
                      type: "danger",
                      isAlert: true
                    });
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
                      setModalConfig({
                        isOpen: true,
                        title: "Update Triggered",
                        message: "Service Worker update triggered. Check console for logs.",
                        confirmText: "Got it",
                        type: "info",
                        isAlert: true
                      });
                    } else {
                      setModalConfig({
                        isOpen: true,
                        title: "No SW Found",
                        message: "No Service Worker registration found.",
                        confirmText: "Close",
                        type: "warning",
                        isAlert: true
                      });
                    }
                  } catch (e) {
                    setModalConfig({
                      isOpen: true,
                      title: "Update Failed",
                      message: "Update failed: " + e,
                      confirmText: "Close",
                      type: "danger",
                      isAlert: true
                    });
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
                      setModalConfig({
                        isOpen: true,
                        title: "Message Sent",
                        message: "Message sent to Service Worker thread. Check SW console.",
                        confirmText: "Got it",
                        type: "info",
                        isAlert: true
                      });
                    } else {
                      setModalConfig({
                        isOpen: true,
                        title: "No Active SW",
                        message: "No active Service Worker found to message.",
                        confirmText: "Close",
                        type: "warning",
                        isAlert: true
                      });
                    }
                  } catch (e) {
                    setModalConfig({
                      isOpen: true,
                      title: "Test Failed",
                      message: "Direct SW Test failed: " + e,
                      confirmText: "Close",
                      type: "danger",
                      isAlert: true
                    });
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
                    if (typeof Notification === 'undefined') {
                      throw new Error('Notification API not supported');
                    }
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                      const reg = await navigator.serviceWorker.ready;
                      await reg.showNotification("Scholar's Dungeon", {
                        body: 'Direct thread notification test successful!',
                        icon: '/pwa-icon.svg'
                      });
                    } else {
                      setModalConfig({
                        isOpen: true,
                        title: "Permission Required",
                        message: 'Permission not granted: ' + permission,
                        confirmText: "Close",
                        type: "warning",
                        isAlert: true
                      });
                    }
                  } catch (e) {
                    setModalConfig({
                      isOpen: true,
                      title: "Test Failed",
                      message: 'Direct Notification Test failed: ' + e,
                      confirmText: "Close",
                      type: "danger",
                      isAlert: true
                    });
                  }
                }}
                className="flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 font-bold py-2 rounded-xl text-xs transition-all"
              >
                <Eye size={14} />
                Test Direct UI
              </button>
              <button
                onClick={async () => {
                  setModalConfig({
                    isOpen: true,
                    title: "ULTRA RESET?",
                    message: 'ULTRA RESET: This will wipe all push-related data (SW + Server + Local) and try to register from scratch. Use this if "Test Direct UI" works but remote push is silent. Continue?',
                    confirmText: "Deep Clean & Sync",
                    type: "danger",
                    onConfirm: async () => {
                      setIsTestingNotification(true);
                      try {
                        if (state.secretCode) {
                          await fetch('/api/push/subscribe', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ secretCode: state.secretCode, subscription: null })
                          });
                        }
                        const regs = await navigator.serviceWorker.getRegistrations();
                        for (const reg of regs) { await reg.unregister(); }
                        setState(prev => ({ ...prev, pushEnabled: false, pushSubscription: null }));
                        
                        window.location.reload();
                      } catch (e) {
                        setModalConfig({
                          isOpen: true,
                          title: "Clean Failed",
                          message: 'Deep Clean failed: ' + e,
                          confirmText: "Close",
                          type: "danger",
                          isAlert: true
                        });
                      } finally {
                        setIsTestingNotification(false);
                      }
                    }
                  });
                }}
                disabled={isTestingNotification}
                className="flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 font-bold py-2 rounded-xl text-xs transition-all col-span-1 md:col-span-2"
              >
                <RefreshCw className={cn("w-3 h-3", isTestingNotification && "animate-spin")} />
                Full Push Deep Reset (Wipe & Re-Sync)
              </button>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              This will schedule a task with 0 delay and immediately trigger the /api/push/check endpoint.
            </p>
          </div>

          {/* Bottom Lock Button */}
          <div className="pt-10 flex justify-center">
            <button 
              onClick={() => {
                setIsDevUnlocked(false);
                setState(prev => ({ ...prev, devModeEnabled: false }));
              }}
              className="group flex flex-col items-center gap-2 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:bg-red-500/20 group-hover:border-red-500/40 transition-all">
                <Wrench size={16} className="text-red-400" />
              </div>
              <span className="text-[10px] font-bold text-red-500/40 group-hover:text-red-500/80 uppercase tracking-[0.2em] transition-colors">
                Lock & Disable Developer Mode
              </span>
            </button>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        type={modalConfig.type}
        isAlert={modalConfig.isAlert}
      />
    </div>
  );
};
