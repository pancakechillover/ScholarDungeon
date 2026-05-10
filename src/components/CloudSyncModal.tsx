import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, Key, X, AlertTriangle, Check, Loader2, Database, Sparkles, HelpCircle, Unlink, Info, Eye, EyeOff, Copy, RefreshCw, Trash2, History } from 'lucide-react';
import { getDeviceType } from '../lib/utils';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  secretCode?: string;
  isSyncing: boolean;
  syncError: string | null;
  syncCheckResult: {
    status: 'no_save' | 'cloud_newer' | 'local_newer';
    cloudData?: any;
    code: string;
  } | null;
  onConnect: (code: string) => void;
  onResolveConflict: (useCloud: boolean) => void;
  onCancelConnect: (code: string) => void;
  onManualSync: () => void;
  onUnbind: () => void;
  onDeleteCloudData: () => void;
  syncHistory?: {
    type: 'login' | 'force_sync' | 'local_to_cloud' | 'cloud_to_local' | 'cancel_login' | 'unbind_local' | 'delete_cloud';
    code: string;
    timestamp: string;
    deviceType?: string;
    syncMethod?: 'Manual' | 'Immediate' | 'Interval polling' | 'Visibility API Active';
    syncProvider?: 'Redis' | 'Google Drive' | 'WebDAV';
  }[];
  localState?: any;
}

export function CloudSyncModal({
  isOpen,
  onClose,
  secretCode,
  isSyncing,
  syncError,
  syncCheckResult,
  onConnect,
  onResolveConflict,
  onCancelConnect,
  onManualSync,
  onUnbind,
  onDeleteCloudData,
  syncHistory,
  localState
}: CloudSyncModalProps) {
  const [inputCode, setInputCode] = useState(secretCode || '');
  const [showHelp, setShowHelp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    action: () => void;
    isDestructive?: boolean;
    requiresTextConfirm?: boolean;
    showComparison?: boolean;
  } | null>(null);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@*￥$%^&';
    let pass = '';
    const length = Math.floor(Math.random() * 7) + 6; // 6 to 12
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setInputCode(pass);
    navigator.clipboard.writeText(pass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Only allow English, numbers, and @*￥$%^&, max 12 chars
    const filtered = val.replace(/[^a-zA-Z0-9@*￥$%^&]/g, '').slice(0, 12);
    setInputCode(filtered);
  };

  const isInputValid = inputCode.length >= 6 && inputCode.length <= 12;

  const handleExportDataLocal = () => {
    if (!localState) return;
    const data = {
      state: localState,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-indigo-500/30 p-6 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-xl relative overflow-hidden"
      >
        {/* Mystical Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[60px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[60px] rounded-full mix-blend-screen" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-200 flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-xl">
                <Cloud className="text-indigo-400" size={24} />
              </div>
              The Astral Archives
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => {
                    setShowHistory(!showHistory);
                    setShowHelp(false);
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-full transition-colors"
                  title="Sync History"
                >
                  <History size={18} />
                </button>
                <button 
                  onClick={() => {
                    setShowHelp(!showHelp);
                    setShowHistory(false);
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-full transition-colors"
                  title="What is this?"
                >
                  <HelpCircle size={18} />
                </button>
              </div>
            </h3>
            <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {confirmDialog ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className={`p-4 border rounded-2xl space-y-4 ${confirmDialog.isDestructive ? 'bg-rose-500/10 border-rose-500/30' : 'bg-indigo-500/10 border-indigo-500/30'}`}>
                  <div className="space-y-1">
                    <h4 className={`font-bold flex items-center gap-2 ${confirmDialog.isDestructive ? 'text-rose-500' : 'text-indigo-500'}`}>
                      <AlertTriangle size={18} />
                      {confirmDialog.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-400">
                      {confirmDialog.message}
                    </p>
                  </div>
                  
                  {confirmDialog.showComparison && (
                    <div className="space-y-2">
                       <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Comparison Preview</p>
                       <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-[10px]">
                        <div className="grid grid-cols-[auto_1fr_1fr] gap-x-2 gap-y-1 items-center">
                          <div className="text-slate-500"></div>
                          <div className="text-center font-bold text-slate-300 bg-slate-800/50 py-1 rounded-md">Local</div>
                          <div className="text-center font-bold text-indigo-400 bg-indigo-500/10 py-1 rounded-md">Cloud</div>
                          
                          <div className="text-slate-500">Level</div>
                          <div className={`text-center font-mono ${localState?.level > (syncCheckResult?.cloudData?.state?.level ?? syncCheckResult?.cloudData?.level ?? 0) ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                            {localState?.level || 1}
                          </div>
                          <div className={`text-center font-mono ${(syncCheckResult?.cloudData?.state?.level ?? syncCheckResult?.cloudData?.level ?? 0) > (localState?.level ?? 0) ? 'text-emerald-400 font-bold' : 'text-indigo-300'}`}>
                            {syncCheckResult?.cloudData?.state?.level ?? syncCheckResult?.cloudData?.level ?? '?'}
                          </div>

                          <div className="text-slate-500">Coins</div>
                          <div className={`text-center font-mono ${localState?.coins > (syncCheckResult?.cloudData?.state?.coins ?? syncCheckResult?.cloudData?.coins ?? 0) ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                            {localState?.coins || 0}
                          </div>
                          <div className={`text-center font-mono ${(syncCheckResult?.cloudData?.state?.coins ?? syncCheckResult?.cloudData?.coins ?? 0) > (localState?.coins ?? 0) ? 'text-emerald-400 font-bold' : 'text-indigo-300'}`}>
                            {syncCheckResult?.cloudData?.state?.coins ?? syncCheckResult?.cloudData?.coins ?? '?'}
                          </div>
                          
                          <div className="text-slate-500">Update</div>
                          <div className="text-center text-[8px] text-slate-500 font-mono truncate">{localState?.lastUpdated ? new Date(localState.lastUpdated).toLocaleDateString() : '-'}</div>
                          <div className="text-center text-[8px] text-indigo-500/70 font-mono truncate">
                            {syncCheckResult?.cloudData?.state?.lastUpdated ?? syncCheckResult?.cloudData?.lastUpdated ? new Date(syncCheckResult.cloudData.state?.lastUpdated ?? syncCheckResult.cloudData.lastUpdated).toLocaleDateString() : '-'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {confirmDialog.isDestructive && (
                    <div className="pt-2 space-y-4">
                      <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Safety Suggestion</p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          We recommend exporting your current local progress before performing this irreversible action.
                        </p>
                        <button
                          onClick={handleExportDataLocal}
                          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-slate-700"
                        >
                          <Database size={14} />
                          Export Local Data
                        </button>
                      </div>

                      {confirmDialog.requiresTextConfirm && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-rose-500/70 uppercase tracking-widest">Type "Delete" to confirm</label>
                          <input 
                            type="text"
                            value={deleteInput}
                            onChange={(e) => setDeleteInput(e.target.value)}
                            placeholder="Type Delete here"
                            className="w-full bg-slate-950 border border-rose-500/20 rounded-xl py-2.5 px-4 text-white focus:border-rose-500 outline-none transition-all font-bold text-sm"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={() => {
                      setConfirmDialog(null);
                      setDeleteInput('');
                    }}
                    className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      confirmDialog.action();
                      setConfirmDialog(null);
                      setDeleteInput('');
                    }}
                    disabled={confirmDialog.requiresTextConfirm && deleteInput.toLowerCase() !== 'delete'}
                    className={`py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${confirmDialog.isDestructive ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white'}`}
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            ) : showHelp ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2"
              >
                <div className="prose prose-invert prose-sm max-w-none">
                  <h4 className="flex items-center gap-2 text-indigo-500 m-0 mb-2"><Info size={18} /> About the Archives</h4>
                  <p className="text-slate-400 mt-0">Synchronize your progress across devices. Your journey is automatically inscribed to the cloud after every completed session.</p>
                  
                  <h4 className="flex items-center gap-2 text-indigo-500 m-0 mb-2 mt-4"><Key size={18} /> Code Requirements</h4>
                  <ul className="text-slate-400 mt-0">
                    <li>Length: 6 to 12 characters</li>
                    <li>Allowed: Letters, numbers, and <code>@*￥$%^&</code></li>
                  </ul>

                  <h4 className="flex items-center gap-2 text-indigo-500 m-0 mb-2 mt-4"><AlertTriangle size={18} /> Crucial Warning</h4>
                  <p className="text-slate-400 mt-0">Your Brave's Code acts as both your username and password. <strong>Please use a complex and unique code.</strong> Anyone who knows your code can access or overwrite your save data!</p>

                  <h4 className="flex items-center gap-2 text-indigo-500 m-0 mb-2 mt-4"><Database size={18} /> Data Guarantee</h4>
                  <p className="text-slate-400 mt-0">This platform does not guarantee the permanent preservation of user data. If you are particularly worried about data loss, please regularly export your JSON data via <strong>Settings - General - Data Management</strong>.</p>
                </div>

                <button 
                  onClick={() => setShowHelp(false)}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-colors mt-4 sticky bottom-0"
                >
                  I Understand
                </button>
              </motion.div>
            ) : showHistory ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h4 className="font-bold text-indigo-400 flex items-center gap-2 mb-4">
                  <History size={18} />
                  Sync History
                </h4>
                <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pr-2 space-y-2">
                  {syncHistory && syncHistory.length > 0 ? (
                    syncHistory.map((record, idx) => (
                      <div key={idx} className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-indigo-300">
                            {record.type === 'login' ? 'Login' :
                             record.type === 'force_sync' ? 'Force Sync' :
                             record.type === 'local_to_cloud' ? 'Local ➔ Cloud' : 
                             record.type === 'cancel_login' ? 'Canceled Login' : 
                             record.type === 'unbind_local' ? 'Unbind Local' :
                             record.type === 'delete_cloud' ? 'Delete Cloud' : 'Cloud ➔ Local'}
                          </span>
                          <span className="text-[10px] text-slate-500">{new Date(record.timestamp).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 font-mono">Code: {record.code}</span>
                          {record.syncMethod && <span className="text-[9px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/50">{record.syncMethod}</span>}
                          {record.syncProvider && <span className="text-[9px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/50">{record.syncProvider}</span>}
                          {record.deviceType && <span className="text-[9px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-full">{record.deviceType}</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-8">No history recorded yet.</p>
                  )}
                </div>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-colors mt-2"
                >
                  Back
                </button>
              </motion.div>
            ) : syncCheckResult ? (
              <div className="space-y-4">
                {syncCheckResult.status === 'no_save' ? (
                  <>
                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-center">
                      <Sparkles className="text-indigo-400 mx-auto mb-3" size={32} />
                      <p className="text-sm text-slate-300 font-medium">
                        This is an unheard-of code. Shall you begin your legend?
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => onCancelConnect(inputCode)}
                        className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-center transition-colors group"
                      >
                        <span className="font-bold text-slate-300 text-sm block mb-1">No, not mine</span>
                        <span className="text-[10px] text-slate-500">Cancel Login</span>
                      </button>
                      <button 
                        onClick={() => onResolveConflict(false)}
                        className="p-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-xl text-center transition-colors group"
                      >
                        <span className="font-bold text-indigo-300 text-sm block mb-1">Begin Legend</span>
                        <span className="text-[10px] text-indigo-400/70">Create Save</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="text-indigo-500" size={20} />
                        <h4 className="font-bold text-indigo-500">Echoes of the Past Found</h4>
                      </div>
                      <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 mb-3">
                        <div className="grid grid-cols-[auto_1fr_1fr] gap-y-3 gap-x-2 text-xs items-center">
                          <div className="text-slate-500 font-medium"></div>
                          <div className="text-center font-bold text-slate-300 bg-slate-800/50 py-1 rounded-md">Local</div>
                          <div className="text-center font-bold text-indigo-400 bg-indigo-500/10 py-1 rounded-md">Cloud</div>

                          <div className="text-slate-500">Level</div>
                          <div className={`text-center font-mono ${localState?.level > (syncCheckResult.cloudData?.state?.level || 1) ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>{localState?.level || 1}</div>
                          <div className={`text-center font-mono ${(syncCheckResult.cloudData?.state?.level || 1) > (localState?.level || 1) ? 'text-emerald-400 font-bold' : 'text-indigo-300'}`}>{syncCheckResult.cloudData?.state?.level || 1}</div>

                          <div className="text-slate-500">Coins</div>
                          <div className={`text-center font-mono ${localState?.coins > (syncCheckResult.cloudData?.state?.coins || 0) ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>{localState?.coins || 0}</div>
                          <div className={`text-center font-mono ${(syncCheckResult.cloudData?.state?.coins || 0) > (localState?.coins || 0) ? 'text-emerald-400 font-bold' : 'text-indigo-300'}`}>{syncCheckResult.cloudData?.state?.coins || 0}</div>

                          <div className="text-slate-500">Sessions</div>
                          <div className={`text-center font-mono ${(localState?.history?.length || 0) > (syncCheckResult.cloudData?.state?.history?.length || 0) ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>{localState?.history?.length || 0}</div>
                          <div className={`text-center font-mono ${(syncCheckResult.cloudData?.state?.history?.length || 0) > (localState?.history?.length || 0) ? 'text-emerald-400 font-bold' : 'text-indigo-300'}`}>{syncCheckResult.cloudData?.state?.history?.length || 0}</div>

                          <div className="text-slate-500">Device</div>
                          <div className="text-center text-[10px] text-slate-400 truncate px-1">{getDeviceType()}</div>
                          <div className="text-center text-[10px] text-indigo-400/70 truncate px-1">{syncCheckResult.cloudData?.state?.deviceType || 'Unknown'}</div>

                          <div className="text-slate-500">Time</div>
                          <div className="text-center text-[10px] text-slate-400 px-1 leading-tight">
                            {localState?.lastUpdated ? new Date(localState.lastUpdated).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown'}
                          </div>
                          <div className="text-center text-[10px] text-indigo-400/70 px-1 leading-tight">
                            {syncCheckResult.cloudData?.state?.lastUpdated ? new Date(syncCheckResult.cloudData.state.lastUpdated).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown'}
                          </div>
                        </div>
                      </div>
                      
                      {syncCheckResult.status === 'cloud_newer' ? (
                        <p className="text-sm text-slate-300 text-center font-medium">
                          Inherit the cloud's memory? (Overwrites Local)
                        </p>
                      ) : (
                        <p className="text-sm text-slate-300 text-center font-medium">
                          Inscribe current progress to the cloud? (Overwrites Cloud)
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setConfirmDialog({
                          title: 'Overwrite Cloud Data?',
                          message: 'This will permanently replace your cloud save with your current local progress. This action cannot be undone.',
                          action: () => onResolveConflict(false),
                          isDestructive: false,
                          showComparison: true
                        })}
                        className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-center transition-colors group"
                      >
                        <span className="font-bold text-slate-200 text-sm block mb-1">Keep Local</span>
                        <span className="text-[10px] text-slate-400">Overwrite Cloud</span>
                      </button>
                      <button 
                        onClick={() => setConfirmDialog({
                          title: 'Overwrite Local Data?',
                          message: 'This will permanently replace your current local progress with the cloud save. This action cannot be undone.',
                          action: () => onResolveConflict(true),
                          isDestructive: true,
                          requiresTextConfirm: false, // User requested no "Delete" typing for this
                          showComparison: true
                        })}
                        className="p-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-xl text-center transition-colors group"
                      >
                        <span className="font-bold text-indigo-300 text-sm block mb-1">Download Cloud</span>
                        <span className="text-[10px] text-indigo-400/70">Overwrite Local</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={inputCode}
                      onChange={handleInputChange}
                      placeholder="Enter 6-12 char code"
                      className="w-full bg-slate-950/50 border-b-2 border-slate-800 py-4 px-4 pr-12 text-center text-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-medium tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {!secretCode && (
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <RefreshCw size={14} />
                        Generate
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (inputCode) {
                            navigator.clipboard.writeText(inputCode);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }
                        }}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>

                {syncError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <p>{syncError}</p>
                  </div>
                )}

                <div className="pt-4 flex flex-col gap-3">
                  {!secretCode || secretCode !== inputCode ? (
                    <button 
                      onClick={() => onConnect(inputCode)}
                      disabled={!isInputValid || isSyncing}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-3"
                    >
                      {isSyncing ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Communing with Archives...
                        </>
                      ) : (
                        'Commune'
                      )}
                    </button>
                  ) : (
                    <>
                      <div className="flex items-center justify-center gap-2 text-emerald-400 bg-emerald-500/10 py-3 rounded-xl border border-emerald-500/20">
                        <Check size={18} />
                        <span className="text-sm font-bold">Bound to Astral Archives</span>
                      </div>
                      <button 
                        onClick={() => setConfirmDialog({
                          title: 'Force Sync',
                          message: 'This will overwrite the cloud save with your current local data. Are you sure you want to proceed?',
                          action: onManualSync,
                          showComparison: true
                        })}
                        disabled={isSyncing}
                        className="w-full py-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-2xl font-bold transition-colors flex items-center justify-center gap-3"
                      >
                        {isSyncing ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Inscribing...
                          </>
                        ) : (
                          <>
                            <Cloud size={20} />
                            Force Sync (Upload)
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => setConfirmDialog({
                          title: 'Download from Cloud',
                          message: 'This will overwrite your current local data with the data from the cloud. Are you sure you want to proceed?',
                          action: () => onConnect(secretCode || ''),
                          isDestructive: true,
                          requiresTextConfirm: false, // User requested no "Delete" typing for this
                          showComparison: true
                        })}
                        disabled={isSyncing}
                        className="w-full py-4 bg-indigo-600/20 hover:bg-indigo-600/30 disabled:opacity-50 text-indigo-400 rounded-2xl font-bold border border-indigo-500/30 transition-colors flex items-center justify-center gap-3"
                      >
                        {isSyncing ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Communing...
                          </>
                        ) : (
                          <>
                            <RefreshCw size={20} />
                            Download from Cloud
                          </>
                        )}
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => setConfirmDialog({
                            title: 'Unbind Local',
                            message: 'This will disconnect your local app from the cloud. Your local data will remain, but it will no longer sync until you log in again.',
                            action: () => {
                              setInputCode('');
                              onUnbind();
                            }
                          })}
                          disabled={isSyncing}
                          className="w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <Unlink size={16} />
                          Unbind Local
                        </button>
                        <button 
                          onClick={() => setConfirmDialog({
                            title: 'Delete Cloud Data',
                            message: 'This will permanently delete your save data from the cloud and unbind your local app. Your local data will NOT be affected. This action CANNOT be undone. Are you absolutely sure?',
                            isDestructive: true,
                            requiresTextConfirm: true,
                            action: () => {
                              setInputCode('');
                              onDeleteCloudData();
                            }
                          })}
                          disabled={isSyncing}
                          className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 text-red-400 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <Trash2 size={16} />
                          Delete Cloud
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
