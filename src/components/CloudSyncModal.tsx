import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, Key, X, AlertTriangle, Check, Loader2, Database } from 'lucide-react';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  secretCode?: string;
  isSyncing: boolean;
  syncError: string | null;
  conflictData: any | null;
  onConnect: (code: string) => void;
  onResolveConflict: (useCloud: boolean) => void;
  onManualSync: () => void;
}

export function CloudSyncModal({
  isOpen,
  onClose,
  secretCode,
  isSyncing,
  syncError,
  conflictData,
  onConnect,
  onResolveConflict,
  onManualSync
}: CloudSyncModalProps) {
  const [inputCode, setInputCode] = useState(secretCode || '');

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
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-xl">
                <Cloud className="text-indigo-400" size={24} />
              </div>
              The Astral Archives
            </h3>
            <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {conflictData ? (
              <div className="space-y-4">
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="text-amber-400" size={20} />
                    <h4 className="font-bold text-amber-400">Diverging Timelines</h4>
                  </div>
                  <p className="text-sm text-slate-300">
                    The cloud remembers a different path. Shall you inherit the ancient memory or inscribe your current legend?
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => onResolveConflict(false)}
                    className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="text-slate-400 group-hover:text-white transition-colors" size={16} />
                      <span className="font-bold text-white text-sm">Keep Local</span>
                    </div>
                    <p className="text-xs text-slate-400">Overwrite the archives with your current state.</p>
                  </button>
                  <button 
                    onClick={() => onResolveConflict(true)}
                    className="p-4 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-2xl text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud className="text-indigo-400 group-hover:text-indigo-300 transition-colors" size={16} />
                      <span className="font-bold text-indigo-300 text-sm">Download Cloud</span>
                    </div>
                    <p className="text-xs text-indigo-200/70">Restore your progress from the astral plane.</p>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">The Brave's Secret Code</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Key className="text-slate-500" size={18} />
                    </div>
                    <input 
                      type="password"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="Enter your secret code..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-500 ml-1">A unique phrase to bind your soul to the archives.</p>
                </div>

                {syncError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <p>{syncError}</p>
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-3">
                  {!secretCode || secretCode !== inputCode ? (
                    <button 
                      onClick={() => onConnect(inputCode)}
                      disabled={!inputCode || isSyncing}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      {isSyncing ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Communing with Archives...
                        </>
                      ) : (
                        'Bind to Archives'
                      )}
                    </button>
                  ) : (
                    <>
                      <div className="flex items-center justify-center gap-2 text-emerald-400 bg-emerald-500/10 py-2 rounded-lg border border-emerald-500/20">
                        <Check size={16} />
                        <span className="text-sm font-bold">Bound to Archives</span>
                      </div>
                      <button 
                        onClick={onManualSync}
                        disabled={isSyncing}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        {isSyncing ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            Syncing...
                          </>
                        ) : (
                          <>
                            <Cloud size={18} />
                            Force Sync Now
                          </>
                        )}
                      </button>
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
