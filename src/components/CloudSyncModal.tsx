import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, Key, X, AlertTriangle, Check, Loader2, Database, Sparkles, HelpCircle, Unlink, Info } from 'lucide-react';

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
  onManualSync: () => void;
  onUnbind: () => void;
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
  onManualSync,
  onUnbind
}: CloudSyncModalProps) {
  const [inputCode, setInputCode] = useState(secretCode || '');
  const [showHelp, setShowHelp] = useState(false);

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
              <button 
                onClick={() => setShowHelp(!showHelp)}
                className="p-1.5 bg-slate-800 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-full transition-colors"
                title="What is this?"
              >
                <HelpCircle size={18} />
              </button>
            </h3>
            <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {showHelp ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl space-y-3">
                  <h4 className="font-bold text-indigo-400 flex items-center gap-2">
                    <Info size={18} />
                    About the Archives
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    The Astral Archives allow you to synchronize your progress across different devices. Once bound, your journey is automatically inscribed to the cloud after every completed session.
                  </p>
                </div>
                
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
                  <h4 className="font-bold text-amber-400 flex items-center gap-2">
                    <AlertTriangle size={18} />
                    Crucial Warning
                  </h4>
                  <p className="text-sm text-amber-200/80 leading-relaxed">
                    Your Brave's Code acts as both your username and password. <strong className="text-amber-400">Please use a complex and unique code.</strong> Anyone who knows your code can access or overwrite your save data!
                  </p>
                </div>

                <button 
                  onClick={() => setShowHelp(false)}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                >
                  I Understand
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
                    <button 
                      onClick={() => onResolveConflict(false)}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-500/20"
                    >
                      Begin Legend (Create Save)
                    </button>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="text-amber-400" size={20} />
                        <h4 className="font-bold text-amber-400">Echoes of the Past Found</h4>
                      </div>
                      <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-slate-500">Cloud Level</span>
                          <span className="text-sm font-bold text-indigo-400">Lv. {syncCheckResult.cloudData?.state?.level || 1}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">Cloud Time</span>
                          <span className="text-xs text-slate-300">
                            {syncCheckResult.cloudData?.state?.lastUpdated 
                              ? new Date(syncCheckResult.cloudData.state.lastUpdated).toLocaleString() 
                              : 'Unknown'}
                          </span>
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
                        onClick={() => onResolveConflict(false)}
                        className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-center transition-colors group"
                      >
                        <span className="font-bold text-white text-sm block mb-1">Keep Local</span>
                        <span className="text-[10px] text-slate-400">Overwrite Cloud</span>
                      </button>
                      <button 
                        onClick={() => onResolveConflict(true)}
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
                      type="password"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="Enter your Brave's Code"
                      className="w-full bg-slate-950/50 border-b-2 border-slate-800 py-4 px-4 text-center text-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-medium tracking-widest"
                    />
                  </div>
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
                      disabled={!inputCode || isSyncing}
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
                        onClick={onManualSync}
                        disabled={isSyncing}
                        className="w-full py-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-2xl font-bold transition-colors flex items-center justify-center gap-3"
                      >
                        {isSyncing ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Inscribing...
                          </>
                        ) : (
                          <>
                            <Cloud size={20} />
                            Force Sync
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          setInputCode('');
                          onUnbind();
                        }}
                        disabled={isSyncing}
                        className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 text-red-400 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <Unlink size={20} />
                        Sever Connection (Unbind)
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
