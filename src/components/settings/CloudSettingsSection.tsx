import React, { useState } from 'react';
import { Cloud, Server, HardDrive, CheckCircle2, ChevronRight, Settings, Lock, X, History, ArrowDownUp, RefreshCw, LogIn, Trash2, ShieldBan, Eye } from 'lucide-react';
import { AppState } from '../../types';

interface CloudSettingsSectionProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  setActiveSection: (sec: any) => void;
  onOpenAstralArchives: () => void;
}

export const CloudSettingsSection: React.FC<CloudSettingsSectionProps> = ({
  state,
  setState,
  setActiveSection,
  onOpenAstralArchives
}) => {
  const syncMode = state.autoSyncMode || 'manual';
  const debounceSeconds = state.autoSyncDebounceSeconds || 10;
  const intervalMinutes = state.autoSyncIntervalMinutes || 1;

  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState('');
  const [unlockError, setUnlockError] = useState(false);

  const handleRedisClick = () => {
    if (state.isRedisUnlocked) {
      onOpenAstralArchives();
    } else {
      setShowUnlockModal(true);
    }
  };

  const handleUnlock = () => {
    if (btoa(unlockPassword) === 'OTAwMTk5NjE5NTIw') {
      setState(s => ({ ...s, isRedisUnlocked: true }));
      setShowUnlockModal(false);
      setUnlockError(false);
      onOpenAstralArchives();
    } else {
      setUnlockError(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5 text-indigo-400 mb-6 pb-2">
        <Cloud size={20} />
        <h4 className="text-lg font-bold uppercase tracking-widest pr-1">Cloud Sync</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Redis / The Astral Archives */}
        <button
          onClick={handleRedisClick}
          className="relative text-left p-5 bg-slate-900 border border-slate-700 hover:border-indigo-500/50 rounded-2xl transition-all group overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-colors group-hover:bg-indigo-500/20" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-slate-800 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                <Server size={24} />
              </div>
              {state.secretCode && (
                <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Connected
                </div>
              )}
            </div>
            <div>
              <h5 className="font-bold text-slate-200 mb-1">Redis Backend</h5>
              <p className="text-xs text-slate-400 leading-relaxed min-h-[3rem]">
                The Astral Archives. High-speed custom cloud server using short secret codes.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-indigo-400 opacity-80 group-hover:opacity-100 transition-opacity pt-2">
              <span>{state.secretCode ? 'Manage Connection' : 'Connect'}</span>
              {!state.isRedisUnlocked ? (
                <Lock size={16} className="text-amber-400/80" />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>
          </div>
        </button>

        {/* Google OAuth (Coming Soon) */}
        <button
          disabled
          className="relative text-left p-5 bg-slate-900/50 border border-slate-800/50 rounded-2xl cursor-not-allowed overflow-hidden opacity-60"
        >
          <div className="relative z-10 space-y-4">
            <div className="p-2.5 rounded-xl bg-slate-800/50 text-slate-500 w-fit">
              <Cloud size={24} />
            </div>
            <div>
              <h5 className="font-bold text-slate-300 mb-1">Google Drive</h5>
              <p className="text-xs text-slate-500 leading-relaxed min-h-[3rem]">
                OAuth 2.0 integration. Sync securely to your personal Google Drive app data folder.
              </p>
            </div>
            <div className="text-xs font-bold text-slate-600 uppercase tracking-widest pt-2">
              Coming Soon
            </div>
          </div>
        </button>

        {/* WebDAV (Coming Soon) */}
        <button
          disabled
          className="relative text-left p-5 bg-slate-900/50 border border-slate-800/50 rounded-2xl cursor-not-allowed overflow-hidden opacity-60"
        >
          <div className="relative z-10 space-y-4">
            <div className="p-2.5 rounded-xl bg-slate-800/50 text-slate-500 w-fit">
              <HardDrive size={24} />
            </div>
            <div>
              <h5 className="font-bold text-slate-300 mb-1">WebDAV</h5>
              <p className="text-xs text-slate-500 leading-relaxed min-h-[3rem]">
                Custom server sync (e.g., Jianguoyun). Full control over your save data location.
              </p>
            </div>
            <div className="text-xs font-bold text-slate-600 uppercase tracking-widest pt-2">
              Coming Soon
            </div>
          </div>
        </button>
      </div>

      <div className="pt-6 border-t border-slate-800">
        <div className="flex items-center gap-2 mb-6 text-slate-300">
          <Settings size={18} />
          <h4 className="font-bold uppercase tracking-widest text-sm">Auto-Sync Preferences</h4>
        </div>
        
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Sync Strategy</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(['manual', 'debounce', 'interval'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setState(s => ({ ...s, autoSyncMode: mode }))}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    syncMode === mode 
                      ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
                  }`}
                >
                  <div className="font-bold capitalize mb-1">
                    {mode === 'debounce' ? 'Immediate (Debounce)' : mode === 'interval' ? 'Interval Polling' : 'Manual Only'}
                  </div>
                  <div className="text-[10px] opacity-80 leading-relaxed">
                    {mode === 'manual' && 'Only sync when starting the app or opening Astral Archives.'}
                    {mode === 'debounce' && 'Sync shortly after any changes are made to your data.'}
                    {mode === 'interval' && 'Sync automatically on a fixed time interval.'}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-3 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
              <Eye size={16} className="text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-400 leading-relaxed">
                <span className="font-bold text-indigo-300">Visibility API Active: </span>
                When you leave the app, lock your screen, or close the tab, any unsynced changes will reliably be pushed to the cloud automatically, regardless of your sync strategy.
              </div>
            </div>
          </div>

          {syncMode === 'manual' && (
            <div className="pt-4 border-t border-slate-800/50">
              <button
                onClick={() => setActiveSection('general')}
                className="w-full p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg text-slate-400 group-hover:text-indigo-400 transition-colors">
                    <HardDrive size={18} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-200">Data Management</div>
                    <div className="text-[10px] text-slate-500">Import, export, or clear your local save data manually.</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </button>
            </div>
          )}

          {syncMode === 'debounce' && (
            <div className="pt-4 border-t border-slate-800/50">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Debounce Delay</label>
                  <p className="text-[10px] text-slate-500 mt-1">Wait this long after your last action before syncing.</p>
                </div>
                <div className="text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-lg">
                  {debounceSeconds} seconds
                </div>
              </div>
              <input
                type="range"
                min="3"
                max="60"
                step="1"
                value={debounceSeconds}
                onChange={(e) => setState(s => ({ ...s, autoSyncDebounceSeconds: parseInt(e.target.value) }))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          )}

          {syncMode === 'interval' && (
            <div className="pt-4 border-t border-slate-800/50">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sync Interval</label>
                  <p className="text-[10px] text-slate-500 mt-1">Wait exactly this long between automatic syncs.</p>
                </div>
                <div className="text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-lg">
                  {intervalMinutes} {intervalMinutes === 1 ? 'minute' : 'minutes'}
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                step="1"
                value={intervalMinutes}
                onChange={(e) => setState(s => ({ ...s, autoSyncIntervalMinutes: parseInt(e.target.value) }))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-800">
        <div className="flex items-center gap-2 mb-6 text-slate-300">
          <History size={18} />
          <h4 className="font-bold uppercase tracking-widest text-sm">Sync Status & History</h4>
        </div>
        
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/50">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last Synced</span>
            <span className="text-sm font-bold text-slate-200">
              {state.lastUpdated ? new Date(state.lastUpdated).toLocaleString() : 'Never'}
            </span>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Recent Operations</label>
            {state.syncHistory && state.syncHistory.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {[...state.syncHistory].reverse().map((log, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-950/50 border border-slate-800/50 rounded-xl gap-2">
                    <div className="flex items-center gap-2">
                       {log.type === 'login' && <LogIn size={14} className="text-emerald-400" />}
                       {log.type === 'force_sync' && <RefreshCw size={14} className="text-indigo-400" />}
                       {log.type === 'local_to_cloud' && <ArrowDownUp size={14} className="text-emerald-400" />}
                       {log.type === 'cloud_to_local' && <ArrowDownUp size={14} className="text-blue-400" />}
                       {log.type === 'unbind_local' && <ShieldBan size={14} className="text-amber-400" />}
                       {log.type === 'delete_cloud' && <Trash2 size={14} className="text-red-400" />}
                       {log.type === 'cancel_login' && <X size={14} className="text-slate-400" />}
                       <span className="text-xs font-bold text-slate-300 capitalize">
                         {log.type.replace(/_/g, ' ')}
                       </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500">
                       {log.syncMethod && (
                         <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                           {log.syncMethod}
                         </span>
                       )}
                       {log.syncProvider && (
                         <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                           {log.syncProvider}
                         </span>
                       )}
                       {log.deviceType && <span>Device: {log.deviceType}</span>}
                       <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500">
                No sync history recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {showUnlockModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => {
                setShowUnlockModal(false);
                setUnlockError(false);
                setUnlockPassword('');
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="mb-6 mt-2 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">Developer Access</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                由于目前Redis数据储存量小，所以只有开发者或受邀请的人才能使用这个同步方案。请输入开发者预设的密码后启用。
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter access code..."
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUnlock();
                  }}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-center text-xl tracking-[0.3em] font-bold text-white placeholder:text-slate-700 placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
                {unlockError && (
                  <p className="text-red-400 text-[10px] text-center mt-2 font-bold uppercase tracking-widest">
                    Invalid Credentials
                  </p>
                )}
              </div>
              <button
                onClick={handleUnlock}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-indigo-500/20"
              >
                Authenticate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
