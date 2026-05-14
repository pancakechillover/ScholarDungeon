import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { 
  Sword, 
  ChevronRight, 
  Calendar,
  BookOpen, 
  HelpCircle,
  Coins,
  Zap,
  Compass,
  Package,
  Clock,
  Target,
  Bot,
  Sparkles,
  RefreshCw,
  Send,
  X,
  Copy,
  Quote,
  Library,
  Check
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AppState, Dungeon } from '../types';
import { playSound } from '../lib/sound';
import { getSageAdvice } from '../services/sageService';
import { cn } from '../lib/utils';

interface DashboardViewProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  currentDungeon: Dungeon | null;
  setActiveTab: (tab: any) => void;
  setShowDailySummary: (show: boolean) => void;
  openGuideBook: (chapter: number) => void;
  saveDailyLog: (date: string, rating: number, reflection: string, mood?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  setState,
  currentDungeon,
  setActiveTab,
  setShowDailySummary,
  openGuideBook,
  saveDailyLog
}) => {
  const isDarkTheme = ['night', 'forest', 'ocean'].includes(state.theme || '');
  const [showSageConsult, setShowSageConsult] = React.useState(false);
  const settlementPeriod = useMemo(() => {
    const ts = state.timeSettings || {
      morning: { start: 8, end: 12 },
      afternoon: { start: 14, end: 18 },
      night: { start: 20, end: 24 }
    };

    const timezone = state.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    let now = new Date();
    if (state.timezone) {
      try {
        const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        now = tzDate;
      } catch (e) {}
    }

    const hour = now.getHours();
    let baseDate = new Date(now);

    // If night peak spans midnight and we are currently in that post-midnight block, 
    // or if we are simply before the morning peak starts, the current settlement "day" started yesterday
    if (ts.night.start > ts.night.end && hour < ts.night.end) {
      baseDate.setDate(baseDate.getDate() - 1);
    } else if (hour < ts.morning.start) {
      baseDate.setDate(baseDate.getDate() - 1);
    }
    
    // Start Date: morning.start of baseDate
    const startDate = new Date(baseDate);
    startDate.setHours(ts.morning.start, 0, 0, 0);
    
    // End Date: night.end of baseDate (might be tomorrow)
    const endDate = new Date(baseDate);
    if (ts.night.end <= ts.night.start) {
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(ts.night.end === 24 ? 0 : ts.night.end, 0, 0, 0);
    } else {
        if (ts.night.end === 24) {
             endDate.setDate(endDate.getDate() + 1);
             endDate.setHours(0, 0, 0, 0);
        } else {
             endDate.setHours(ts.night.end, 0, 0, 0);
        }
    }

    const formatDate = (d: Date, is24: boolean = false) => {
      if (is24) {
        const prev = new Date(d);
        prev.setDate(prev.getDate() - 1);
        const mo = (prev.getMonth() + 1).toString().padStart(2, '0');
        const da = prev.getDate().toString().padStart(2, '0');
        const m = d.getMinutes().toString().padStart(2, '0');
        return `${mo}/${da} 24:${m}`;
      }
      const mo = (d.getMonth() + 1).toString().padStart(2, '0');
      const da = d.getDate().toString().padStart(2, '0');
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      return `${mo}/${da} ${h}:${m}`;
    };

    return `${formatDate(startDate)} - ${formatDate(endDate, ts.night.end === 24)}`;
  }, [state.timeSettings, state.timezone]);

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full p-6 lg:p-8 space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sword size={120} />
          </div>
          <h2 className="text-3xl font-bold text-slate-50 mb-2">
            {state.history.length === 0 ? "Welcome, Brave Seeker." : "Welcome back, Seeker."}
          </h2>
          <p className="text-slate-400 mb-8 max-w-md">
            {state.history.length === 0 
              ? "A new legend is about to be written. Are you ready to begin your first exploration?" 
              : "Your journey through the Scholar's Dungeon continues. Ready for the next session?"}
          </p>
          
          {currentDungeon ? (
            <div className="bg-slate-950/50 p-4 sm:p-6 rounded-2xl border border-indigo-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                <span className="text-[10px] sm:text-xs font-bold text-indigo-400 uppercase tracking-widest">Current Quest</span>
                <span className="text-[9px] sm:text-xs text-slate-500">{currentDungeon.completedSessions}/{currentDungeon.totalSessions} Sessions Cleared</span>
              </div>
              <h3 className="font-bold text-slate-50 mb-4 truncate pr-2" style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)' }}>{currentDungeon.name}</h3>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentDungeon.completedSessions / currentDungeon.totalSessions) * 100}%` }}
                  className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                />
              </div>
              <button 
                onClick={() => setActiveTab('explore')}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-slate-50 rounded-xl font-bold transition-all"
              >
                <span>Enter Dungeon</span>
                <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-3xl">
              <p className="text-slate-500 mb-4">No active dungeon exploration.</p>
              <button 
                onClick={() => setActiveTab('dungeons')}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-50 rounded-xl font-bold transition-colors"
              >
                {state.history.length === 0 ? "Start Your First Dungeon" : "Delve into Goal"}
              </button>
            </div>
          )}
        </div>

        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 relative overflow-hidden group">
          <Bot className="absolute -bottom-6 right-8 text-emerald-500/20 w-32 h-32 group-hover:scale-110 transition-transform" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                    <Sparkles size={24} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic pr-1">Oracle's Insight</h3>
              </div>
              <p className="text-sm text-slate-400 font-medium">Seek guidance from the Emerald Sage based on your journey.</p>
            </div>
            <button 
               onClick={() => setShowSageConsult(true)}
               className="py-4 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-all border border-emerald-500/30 flex items-center justify-center gap-3 whitespace-nowrap"
            >
              Assemble Council
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">Daily Progress</h3>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 bg-slate-800/50 rounded-lg border border-slate-700/50 inline-flex">
                <Clock size={10} className="text-indigo-400" />
                <span className="text-slate-500/80">SETTLEMENT:</span>
                <span className="text-slate-400 font-semibold">{settlementPeriod}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-slate-50">{state.dailySessions}</span>
              {(() => {
                const timezone = state.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
                let now = new Date();
                if (timezone) {
                  try {
                    const str = now.toLocaleString('en-US', { timeZone: timezone });
                    now = new Date(str);
                  } catch (e) {}
                }
                const ts = state.timeSettings || { morning: { start: 8, end: 12 }, afternoon: { start: 14, end: 18 }, night: { start: 20, end: 24 } };
                if (now.getHours() < ts.morning.start) {
                  now.setDate(now.getDate() - 1);
                }
                const day = now.getDay();
                
                const dailyGoal = state.useSameDailyProgressGoalEveryDay ?? true 
                  ? (state.dailyProgressGoal ?? 8) 
                  : (state.dailyProgressGoalConfig?.[day] ?? 8);
                return <span className="text-slate-500 text-xs">/ {dailyGoal} Sessions</span>;
              })()}
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
              {(() => {
                const timezone = state.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
                let now = new Date();
                if (timezone) {
                  try {
                    const str = now.toLocaleString('en-US', { timeZone: timezone });
                    now = new Date(str);
                  } catch (e) {}
                }
                const ts = state.timeSettings || { morning: { start: 8, end: 12 }, afternoon: { start: 14, end: 18 }, night: { start: 20, end: 24 } };
                if (now.getHours() < ts.morning.start) {
                  now.setDate(now.getDate() - 1);
                }
                const day = now.getDay();
                
                const dailyGoal = state.useSameDailyProgressGoalEveryDay ?? true 
                  ? (state.dailyProgressGoal ?? 8) 
                  : (state.dailyProgressGoalConfig?.[day] ?? 8);
                return (
                  <div 
                    className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-all" 
                    style={{ width: `${Math.min((state.dailySessions / dailyGoal) * 100, 100)}%` }}
                  />
                );
              })()}
            </div>
            <button
              onClick={() => {
                setShowDailySummary(true);
                playSound('success', state.soundVolume, state.soundEnabled);
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-slate-700 flex items-center justify-center gap-2"
            >
              <Calendar size={14} className="text-indigo-400" />
              End the Day
            </button>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <BookOpen size={16} /> Guides
            </h3>
            <div className="space-y-2">
              <button onClick={() => openGuideBook(1)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 transition-colors border border-slate-800/50 text-xs text-slate-300">
                  <Compass size={16} className="text-sky-400" /> Sanctum Map Guide
              </button>
              <button onClick={() => openGuideBook(2)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 transition-colors border border-slate-800/50 text-xs text-slate-300">
                  <Package size={16} className="text-rose-400" /> Sanctum Items Guide
              </button>
              <button onClick={() => openGuideBook(3)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 transition-colors border border-slate-800/50 text-xs text-slate-300">
                  <Coins size={16} className="text-amber-400" /> Gold Coins Guide
              </button>
              <button onClick={() => openGuideBook(4)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 transition-colors border border-slate-800/50 text-xs text-slate-300">
                  <BookOpen size={16} className="text-emerald-400" /> XP & Leveling Guide
              </button>
              <button onClick={() => openGuideBook(5)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 transition-colors border border-slate-800/50 text-xs text-slate-300">
                  <Zap size={16} className="text-indigo-400" /> Talent System Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSageConsult && createPortal(
         <SageConsultModal 
           state={state} 
           setState={setState}
           onClose={() => setShowSageConsult(false)} 
         />,
         document.body
      )}
    </motion.div>
  );
};

interface SageConsultModalProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onClose: () => void;
}

const SageConsultModal: React.FC<SageConsultModalProps> = ({ state, setState, onClose }) => {
  const isDarkTheme = ['night', 'forest', 'ocean'].includes(state.theme || '');
  const [loading, setLoading] = React.useState(false);
  const [userInput, setUserInput] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [showPromptSelector, setShowPromptSelector] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const history = state.sageChatHistory || [];

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, loading]);

  const handleSend = async (customPrompt?: string) => {
    const prompt = customPrompt || userInput;
    if (!prompt.trim() && !customPrompt) return;

    setLoading(true);
    setError(null);
    setUserInput('');

    // Add user message to state
    const userMsg = { role: 'user' as const, content: prompt, timestamp: Date.now() };
    setState(prev => ({
      ...prev,
      sageChatHistory: [...(prev.sageChatHistory || []), userMsg]
    }));

    try {
      const res = await getSageAdvice({ 
        state, 
        prompt, 
        history: history.map(h => ({ role: h.role, content: h.content })) 
      });
      
      const assistantMsg = { role: 'assistant' as const, content: res, timestamp: Date.now() };
      setState(prev => ({
        ...prev,
        sageChatHistory: [...(prev.sageChatHistory || []), assistantMsg]
      }));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setState(prev => ({ ...prev, sageChatHistory: [] }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuote = (text: string) => {
    const lines = text.split('\n').map(l => `> ${l}`).join('\n');
    setUserInput(lines + '\n\n' + userInput);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 w-full max-w-2xl rounded-[2.5rem] border border-emerald-500/30 overflow-hidden shadow-2xl shadow-emerald-500/10 flex flex-col h-[85vh]"
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-emerald-500/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
               <Bot className="text-emerald-400" size={20} />
            </div>
            <div>
               <h3 className="text-lg font-black text-white uppercase tracking-widest leading-none mb-1">Sage's Council</h3>
               <span className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-tighter">Illuminating the Path</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={clearHistory}
              title="Clear scrolls"
              className="p-2 text-slate-500 hover:text-red-400 transition-colors"
            >
              <RefreshCw size={18} />
            </button>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-6">
          {history.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-10">
               <div className="relative">
                 <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 animate-pulse" />
                 <Bot className="absolute inset-0 m-auto text-emerald-500/40" size={40} />
               </div>
               <div>
                 <h4 className="text-white font-black uppercase tracking-widest mb-3">Begin the Consultation</h4>
                 <p className="text-sm text-slate-400 max-w-xs leading-relaxed">The Oracle is ready to evaluate your scrolls. Speak, and the path shall be revealed.</p>
               </div>
               <div className="flex flex-wrap gap-2 justify-center max-w-lg px-4">
                 {state.sagePrompts?.map(p => (
                   <button key={p.id} onClick={() => handleSend(p.prompt)} className="py-2 px-3.5 bg-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 hover:bg-indigo-500/10 text-indigo-300 hover:text-white rounded-xl text-xs font-bold transition-all whitespace-nowrap">{p.title}</button>
                 ))}
               </div>
            </div>
          )}

          {history.map((msg, idx) => (
            <div key={idx} className={cn("flex flex-col group", msg.role === 'user' ? "items-end" : "items-start")}>
              <div className={cn(
                "max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-lg relative",
                msg.role === 'user' 
                  ? "bg-indigo-600 border border-indigo-500 text-white rounded-tr-none" 
                  : cn(
                      "rounded-tl-none font-serif italic shadow-emerald-500/10 pr-1",
                      isDarkTheme 
                        ? "bg-slate-900/80 border border-emerald-500/20 text-emerald-50" 
                        : "bg-emerald-50 border border-emerald-200 text-emerald-950"
                    )
              )}>
                {msg.role === 'assistant' ? (
                  <div className={cn("prose prose-sm max-w-none", isDarkTheme ? "prose-invert prose-emerald" : "prose-emerald")}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
              
              <div className={cn(
                "flex items-center gap-3 mt-1.5 px-2",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}>
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest shrink-0">
                  {msg.role === 'user' ? 'Scholar' : 'Emerald Sage'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => handleCopy(msg.content, `${idx}`)}
                    className="p-1 hover:text-emerald-400 text-slate-500 transition-colors flex items-center justify-center"
                    title="Copy"
                  >
                    {copiedId === `${idx}` ? <Check size={10} /> : <Copy size={10} />}
                  </button>
                  <button 
                    onClick={() => handleQuote(msg.content)}
                    className="p-1 hover:text-emerald-400 text-slate-500 transition-colors flex items-center justify-center"
                    title="Quote"
                  >
                    <Quote size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex flex-col items-start pr-1">
              <div className={cn("p-4 rounded-2xl rounded-tl-none flex items-center gap-3 border",
                isDarkTheme ? "bg-slate-900/80 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"
              )}>
                 <RefreshCw className={cn("animate-spin", isDarkTheme ? "text-emerald-400" : "text-emerald-600")} size={16} />
                 <span className={cn("text-xs font-serif italic pr-1", isDarkTheme ? "text-emerald-400/70" : "text-emerald-700")}>The Sage is consulting the scrolls...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold font-mono">
              {error}
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-900 border-t border-slate-800 relative">
           <AnimatePresence>
            {showPromptSelector && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-6 mb-4 w-72 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-2 z-50 overflow-hidden"
              >
                <div className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest px-4 py-3 border-b border-slate-800/50 mb-1 flex justify-between items-center">
                  <span>Prompt Library</span>
                  {(!state.sagePrompts || state.sagePrompts.length === 0) && (
                    <button 
                      onClick={() => {
                        import('../constants').then(({ DEFAULT_SAGE_PROMPTS }) => {
                          setState(prev => ({ ...prev, sagePrompts: DEFAULT_SAGE_PROMPTS }));
                        });
                      }}
                      className="text-[9px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Load Defaults
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {state.sagePrompts && state.sagePrompts.length > 0 ? (
                    state.sagePrompts.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setUserInput(p.prompt + (userInput ? '\n\n' + userInput : ''));
                          setShowPromptSelector(false);
                          inputRef.current?.focus();
                        }}
                        className="w-full text-left p-4 hover:bg-emerald-500/10 rounded-[1.25rem] transition-colors group"
                      >
                        <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">{p.title}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-2 mt-1">{p.prompt}</div>
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Library is empty</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
           </AnimatePresence>

           <div className="flex gap-3">
              <button 
                onClick={() => setShowPromptSelector(!showPromptSelector)}
                className={cn(
                  "flex-shrink-0 w-14 h-14 rounded-2xl border-2 transition-all flex items-center justify-center",
                  showPromptSelector ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-950 border-slate-800 text-slate-500 hover:border-emerald-500/50 hover:text-emerald-400"
                )}
                title="Select Prompt"
              >
                <Library size={22} />
              </button>
              <div className="relative flex-1 group">
                <input 
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask the Sage..."
                  className="w-full h-14 bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 pr-16 text-slate-200 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600 font-medium"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={loading || !userInput.trim()}
                  className="absolute right-2 top-2 bottom-2 w-12 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white rounded-xl transition-all flex items-center justify-center p-0"
                >
                  <Send size={18} />
                </button>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
