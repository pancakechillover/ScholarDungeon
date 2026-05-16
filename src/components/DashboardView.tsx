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
  Check,
  MessageSquare,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Download,
  Trash2,
  Edit2,
  Settings as SettingsIcon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AppState, Dungeon } from '../types';
import { playSound } from '../lib/sound';
import { getSageAdvice } from '../services/sageService';
import { cn } from '../lib/utils';
import { ExpeditionPlanPreview } from './ExpeditionPlanPreview';

interface DashboardViewProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  currentDungeon: Dungeon | null;
  setActiveTab: (tab: any) => void;
  setShowDailySummary: (show: boolean) => void;
  openGuideBook: (chapter: number) => void;
  saveDailyLog: (date: string, rating: number, reflection: string, mood?: string) => void;
  applyExpeditionPlan?: (plan: any) => void;
  navigateToSettings?: (section: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  setState,
  currentDungeon,
  setActiveTab,
  setShowDailySummary,
  openGuideBook,
  saveDailyLog,
  applyExpeditionPlan,
  navigateToSettings
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
        <div className="md:col-span-2 flex flex-col space-y-6 md:h-full">
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

        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 relative overflow-hidden group flex-1 flex flex-col justify-center min-h-[140px]">
          <Bot className="absolute -bottom-6 right-8 text-indigo-500/20 w-32 h-32 group-hover:scale-110 transition-transform" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic pr-1">Oracle's Insight</h3>
              </div>
              <p className="text-sm text-slate-400 font-medium">Seek guidance from the Emerald Sage based on your journey.</p>
            </div>
            <button 
               onClick={() => setShowSageConsult(true)}
               className="py-4 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-all border border-indigo-500/30 flex items-center justify-center gap-3 whitespace-nowrap"
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
                  <Compass size={16} className="text-sky-400" /> Sanctum Map
              </button>
              <button onClick={() => openGuideBook(2)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 transition-colors border border-slate-800/50 text-xs text-slate-300">
                  <Package size={16} className="text-rose-400" /> Sanctum Items
              </button>
              <button onClick={() => openGuideBook(3)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 transition-colors border border-slate-800/50 text-xs text-slate-300">
                  <Coins size={16} className="text-amber-400" /> Gold Coins
              </button>
              <button onClick={() => openGuideBook(4)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 transition-colors border border-slate-800/50 text-xs text-slate-300">
                  <BookOpen size={16} className="text-indigo-400" /> XP & Leveling
              </button>
              <button onClick={() => openGuideBook(6)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 transition-colors border border-slate-800/50 text-xs text-slate-300">
                  <Zap size={16} className="text-indigo-400" /> Talent System
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
           navigateToSettings={navigateToSettings}
           applyExpeditionPlan={applyExpeditionPlan}
         />,
         document.body
      )}
    </motion.div>
  );
};

const SageLoadingTimer = ({ startTime, isDarkTheme, onCancel }: { startTime: number, isDarkTheme: boolean, onCancel?: () => void }) => {
  const [elapsed, setElapsed] = React.useState(0);
  
  React.useEffect(() => {
    const updateElapsed = () => setElapsed(Math.floor((Date.now() - startTime) / 1000));
    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className={cn("p-4 rounded-2xl rounded-tl-none flex items-center gap-3 border",
      isDarkTheme ? "bg-slate-900/80 border-indigo-500/20" : "bg-indigo-50 border-indigo-200"
    )}>
       <RefreshCw className={cn("animate-spin", isDarkTheme ? "text-indigo-400" : "text-indigo-600")} size={16} />
       <span className={cn("text-xs font-serif italic pr-1 flex-1", isDarkTheme ? "text-indigo-400/70" : "text-indigo-700")}>
         The Sage is consulting the scrolls... ({elapsed}s)
       </span>
       {onCancel && (
         <button onClick={onCancel} className="p-1 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors shrink-0" title="Cancel Request">
           <X size={14} />
         </button>
       )}
    </div>
  );
};

interface SageConsultModalProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onClose: () => void;
  navigateToSettings?: (section: any) => void;
  applyExpeditionPlan?: (plan: any) => void;
}

const SageConsultModal: React.FC<SageConsultModalProps> = ({ state, setState, onClose, navigateToSettings, applyExpeditionPlan }) => {
  const isDarkTheme = ['night', 'forest', 'ocean'].includes(state.theme || '');
  const loading = !!state.sageIsLoading;
  const loadingStartTime = state.sageLoadingStartTime || Date.now();
  const [userInput, setUserInput] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [showPromptSelector, setShowPromptSelector] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [editingConvoId, setEditingConvoId] = React.useState<string | null>(null);
  const [editingTitle, setEditingTitle] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Initialize conversations if empty, using legacy history if it exists
  React.useEffect(() => {
    if (!state.sageConversations || state.sageConversations.length === 0) {
      const initialHistory = state.sageChatHistory || [];
      const defaultConvo = {
        id: Date.now().toString(),
        title: initialHistory.length > 0 ? 'Previous Counsel' : 'New Consultation',
        updatedAt: Date.now(),
        messages: initialHistory
      };
      setState(prev => ({
        ...prev,
        sageConversations: [defaultConvo],
        activeSageConversationId: defaultConvo.id
      }));
    } else if (!state.activeSageConversationId) {
       setState(prev => ({
        ...prev,
        activeSageConversationId: prev.sageConversations?.[0]?.id
      }));
    }
  }, []);

  const conversations = state.sageConversations || [];
  const activeConversationId = state.activeSageConversationId || conversations[0]?.id;
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const history = activeConversation?.messages || [];

  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleCancelConsult = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, loading]);

  const handleSend = async (customPrompt?: string) => {
    const prompt = customPrompt || userInput;
    if (!prompt.trim() && !customPrompt) return;

    setError(null);
    setUserInput('');

    // Add user message to state and start loading
    const userMsg = { role: 'user' as const, content: prompt, timestamp: Date.now() };
    
    // Auto-generate title if it's the first message
    let newTitle = activeConversation?.title;
    if (history.length === 0) {
      newTitle = prompt.slice(0, 30) + (prompt.length > 30 ? '...' : '');
    }

    setState(prev => {
      const convos = prev.sageConversations || [];
      return {
        ...prev,
        sageConversations: convos.map(c => 
          c.id === activeConversationId 
            ? { ...c, messages: [...c.messages, userMsg], updatedAt: Date.now(), title: newTitle || c.title } 
            : c
        ),
        sageIsLoading: true,
        sageLoadingStartTime: Date.now()
      };
    });

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const getAdvicePromise = getSageAdvice({ 
        state, 
        prompt, 
        history: history.map(h => ({ role: h.role, content: h.content })),
        signal: abortController.signal
      });

      const timeoutPromise = new Promise<any>((_, reject) => {
        setTimeout(() => reject(new Error('TIMEOUT_ERROR')), 180 * 1000);
      });

      const res = await Promise.race([getAdvicePromise, timeoutPromise]);
      
      const assistantMsg = { 
        role: 'assistant' as const, 
        content: res.content, 
        reasoningContent: res.reasoningContent,
        timestamp: Date.now() 
      };
      
      setState(prev => {
        const convos = prev.sageConversations || [];
        return {
          ...prev,
          sageConversations: convos.map(c => 
            c.id === activeConversationId 
              ? { ...c, messages: [...c.messages, assistantMsg], updatedAt: Date.now() } 
              : c
          ),
          sageIsLoading: false,
          sageLoadingStartTime: null
        };
      });
    } catch (e: any) {
      if (e.name === 'AbortError') {
        setState(prev => ({
          ...prev,
          sageIsLoading: false,
          sageLoadingStartTime: null
        }));
        return;
      }
      if (e.message === 'TIMEOUT_ERROR') {
        const assistantMsg = { role: 'assistant' as const, content: "*(The Sage pondered deeply for too long and lost the connection. Please try again.)*", timestamp: Date.now() };
        setState(prev => {
          const convos = prev.sageConversations || [];
          return {
            ...prev,
            sageConversations: convos.map(c => 
              c.id === activeConversationId 
                ? { ...c, messages: [...c.messages, assistantMsg], updatedAt: Date.now() } 
                : c
            ),
            sageIsLoading: false,
            sageLoadingStartTime: null
          };
        });
      } else {
        setError(e.message);
        setState(prev => ({
          ...prev,
          sageIsLoading: false,
          sageLoadingStartTime: null
        }));
      }
    }
  };

  const handleExport = () => {
    if (!activeConversation) return;
    const blob = new Blob([JSON.stringify(activeConversation, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sage_export_${activeConversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleNewConversation = () => {
    const newConvo = {
      id: Date.now().toString(),
      title: 'New Consultation',
      updatedAt: Date.now(),
      messages: []
    };
    setState(prev => ({
      ...prev,
      sageConversations: [newConvo, ...(prev.sageConversations || [])],
      activeSageConversationId: newConvo.id
    }));
    // On mobile, auto close sidebar if creating new
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleRenameConversation = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingConvoId(id);
    setEditingTitle(currentTitle);
  };

  const saveConversationTitle = (id: string) => {
    if (editingTitle.trim()) {
      setState(prev => {
        const convos = prev.sageConversations || [];
        return {
          ...prev,
          sageConversations: convos.map(c => 
            c.id === id ? { ...c, title: editingTitle.trim() } : c
          )
        };
      });
    }
    setEditingConvoId(null);
    setEditingTitle('');
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setState(prev => {
      const remaining = (prev.sageConversations || []).filter(c => c.id !== id);
      if (remaining.length === 0) {
        const defaultConvo = {
          id: Date.now().toString(),
          title: 'New Consultation',
          updatedAt: Date.now(),
          messages: []
        };
        return {
          ...prev,
          sageConversations: [defaultConvo],
          activeSageConversationId: defaultConvo.id
        };
      }
      return {
        ...prev,
        sageConversations: remaining,
        activeSageConversationId: id === prev.activeSageConversationId ? remaining[0].id : prev.activeSageConversationId
      };
    });
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear this entire conversation?")) {
      setState(prev => {
        const convos = prev.sageConversations || [];
        return {
          ...prev,
          sageConversations: convos.map(c => 
            c.id === activeConversationId ? { ...c, messages: [] } : c
          )
        };
      });
    }
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
        className={cn(
          "w-full max-w-4xl rounded-[2.5rem] border overflow-hidden shadow-2xl flex h-[85vh] relative",
          isDarkTheme ? "bg-slate-900 border-indigo-500/30 shadow-indigo-500/10" : "bg-indigo-50 border-indigo-200 shadow-indigo-900/10"
        )}
      >
        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={cn(
                "h-full border-r flex flex-col flex-shrink-0 z-10",
                isDarkTheme ? "border-slate-800 bg-slate-950/80" : "border-indigo-200 bg-indigo-50"
              )}
            >
              <div className={cn("p-4 border-b flex items-center justify-between", isDarkTheme ? "border-slate-800" : "border-indigo-200")}>
                <span className={cn("text-xs font-black uppercase tracking-widest pl-2", isDarkTheme ? "text-slate-400" : "text-indigo-700")}>Consultations</span>
                <button
                  onClick={handleNewConversation}
                  className={cn("p-1.5 rounded-lg transition-colors", isDarkTheme ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20" : "bg-indigo-200 text-indigo-700 hover:bg-indigo-300")}
                  title="New Consultation"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {conversations.map(convo => (
                  <div
                    key={convo.id}
                    onClick={() => {
                      if (editingConvoId !== convo.id) {
                        setState(prev => ({ ...prev, activeSageConversationId: convo.id }));
                      }
                    }}
                    className={cn(
                      "w-full text-left p-3 rounded-2xl transition-all group flex items-start gap-3",
                      editingConvoId !== convo.id ? "cursor-pointer" : "",
                      activeConversationId === convo.id
                        ? (isDarkTheme ? "bg-indigo-500/15 border border-indigo-500/30" : "bg-indigo-200 border border-indigo-400")
                        : (isDarkTheme ? "bg-slate-900 border border-transparent hover:border-slate-800" : "bg-indigo-100/50 border border-transparent hover:bg-indigo-100")
                    )}
                  >
                    <MessageSquare size={16} className={cn("mt-0.5 flex-shrink-0", activeConversationId === convo.id ? (isDarkTheme ? "text-indigo-400" : "text-indigo-700") : (isDarkTheme ? "text-slate-500 group-hover:text-slate-400" : "text-indigo-600/70 group-hover:text-indigo-700"))} />
                    <div className="flex-1 overflow-hidden">
                      {editingConvoId === convo.id ? (
                        <input
                          autoFocus
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={() => saveConversationTitle(convo.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveConversationTitle(convo.id);
                            if (e.key === 'Escape') setEditingConvoId(null);
                          }}
                          className={cn("text-xs font-bold w-full bg-transparent outline-none border-b border-dashed", isDarkTheme ? "text-indigo-100 border-indigo-500/50" : "text-indigo-900 border-indigo-700")}
                        />
                      ) : (
                        <div className={cn("text-xs font-bold line-clamp-1 break-all", activeConversationId === convo.id ? (isDarkTheme ? "text-indigo-100" : "text-indigo-900") : (isDarkTheme ? "text-slate-300 group-hover:text-slate-200" : "text-indigo-800 group-hover:text-indigo-950"))}>
                          {convo.title}
                        </div>
                      )}
                      <div className={cn("text-[10px] mt-1", isDarkTheme ? "text-slate-600" : "text-indigo-700/60")}>
                        {new Date(convo.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    {editingConvoId !== convo.id && (
                      <div className="flex flex-col gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity lg:opacity-100">
                        <button
                          onClick={(e) => handleRenameConversation(convo.id, convo.title, e)}
                          className={cn("p-1", isDarkTheme ? "text-slate-500 hover:text-indigo-400" : "text-indigo-600/60 hover:text-indigo-800")}
                          title="Rename"
                        >
                          <Edit2 size={12} />
                        </button>
                        {conversations.length > 1 && (
                          <button
                            onClick={(e) => handleDeleteConversation(convo.id, e)}
                            className={cn("p-1 hover:text-red-400", isDarkTheme ? "text-slate-500" : "text-indigo-600/60")}
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className={cn("flex-1 flex flex-col min-w-0 transition-colors", isDarkTheme ? "" : "bg-indigo-50")}>
          <div className={cn("p-6 border-b flex justify-between items-center", isDarkTheme ? "border-slate-800 bg-indigo-500/5" : "border-indigo-200 bg-indigo-50")}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={cn("p-2 mr-1 transition-colors rounded-xl", isDarkTheme ? "text-slate-400 hover:text-white bg-slate-800/50" : "text-indigo-700 hover:text-indigo-900 bg-indigo-200/50")}
                title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
              >
                {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
              </button>
              <div className={cn("p-2 rounded-xl hidden sm:block", isDarkTheme ? "bg-indigo-500/20" : "bg-indigo-200")}>
                 <Bot className={cn(isDarkTheme ? "text-indigo-400" : "text-indigo-700")} size={20} />
              </div>
              <div>
                 <h3 className={cn("text-lg font-black uppercase tracking-widest leading-none mb-1", isDarkTheme ? "text-white" : "text-indigo-950")}>Sage's Council</h3>
                 <span className={cn("text-[10px] font-bold uppercase tracking-tighter line-clamp-1", isDarkTheme ? "text-indigo-400/60" : "text-indigo-700/80")}>{activeConversation?.title || 'Illuminating the Path'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleExport}
                title="Export Conversation"
                className={cn("p-2 transition-colors", isDarkTheme ? "text-slate-400 hover:text-indigo-400" : "text-indigo-700 hover:text-indigo-600")}
                disabled={!activeConversation || activeConversation.messages.length === 0}
              >
                <Download size={18} />
              </button>
              <button 
                onClick={() => {
                  if (navigateToSettings) {
                    onClose();
                    navigateToSettings('sage');
                  }
                }}
                title="Settings"
                className={cn("p-2 transition-colors", isDarkTheme ? "text-slate-400 hover:text-indigo-400" : "text-indigo-700 hover:text-indigo-950")}
              >
                <SettingsIcon size={18} />
              </button>
              <button onClick={onClose} className={cn("p-2 transition-colors", isDarkTheme ? "text-slate-400 hover:text-white" : "text-indigo-700 hover:text-indigo-950")}>
                <X size={20} />
              </button>
            </div>
          </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-6">
          {history.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-10">
               <div className="relative">
                 <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20 animate-pulse" />
                 <Bot className="absolute inset-0 m-auto text-indigo-500/40" size={40} />
               </div>
               <div>
                 <h4 className={cn("font-black uppercase tracking-widest mb-3", isDarkTheme ? "text-white" : "text-indigo-950")}>Begin the Consultation</h4>
                 <p className={cn("text-sm max-w-xs leading-relaxed", isDarkTheme ? "text-slate-400" : "text-indigo-700/80")}>The Oracle is ready to evaluate your scrolls. Speak, and the path shall be revealed.</p>
               </div>
               <div className="flex flex-wrap gap-2 justify-center max-w-lg px-4">
                 {state.sagePrompts?.map(p => (
                   <button key={p.id} onClick={() => handleSend(p.prompt)} className={cn(
                     "py-2 px-3.5 border rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                     isDarkTheme ? "bg-slate-900 border-indigo-500/30 hover:border-indigo-500/60 hover:bg-indigo-500/10 text-indigo-300 hover:text-white" : "bg-indigo-50 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900"
                   )}>{p.title}</button>
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
                      "rounded-tl-none font-serif italic shadow-indigo-500/10 pr-1",
                      isDarkTheme 
                        ? "bg-slate-900/80 border border-indigo-500/20 text-indigo-50" 
                        : "bg-indigo-50 border border-indigo-200 text-indigo-950"
                    )
              )}>
                {msg.role === 'assistant' ? (
                  <div className={cn("prose prose-sm max-w-none", isDarkTheme ? "prose-invert prose-indigo" : "prose-indigo")}>
                    {msg.reasoningContent && (
                      <details className={cn("mb-4 rounded-xl border group overflow-hidden bg-transparent", isDarkTheme ? "border-indigo-500/20 hover:bg-indigo-500/5" : "border-indigo-200 hover:bg-black/5")}>
                        <summary className={cn("px-3 py-2 text-xs font-bold cursor-pointer select-none transition-colors outline-none", isDarkTheme ? "text-indigo-400" : "text-indigo-700")}>
                          Thought Process
                        </summary>
                        <div className={cn("px-3 pb-3 pt-1 text-[11px] opacity-80 border-t", isDarkTheme ? "border-indigo-500/20" : "border-indigo-200")}>
                          <ReactMarkdown>{msg.reasoningContent}</ReactMarkdown>
                        </div>
                      </details>
                    )}
                    {(() => {
                      let parsedPlan = null;
                      let parsedSettings = null;
                      let textToRender = msg.content;
                      let hasMarkdownBlock = false;
                      const canModify = !!state.sageAllowGameModifiers;

                      if (canModify) {
                        try {
                          // Try to find a JSON object in the text
                          const startObj = msg.content.indexOf('{');
                          const endObj = msg.content.lastIndexOf('}');
                          if (startObj !== -1 && endObj !== -1 && endObj > startObj) {
                            const possibleJson = msg.content.substring(startObj, endObj + 1);
                            const parsed = JSON.parse(possibleJson);
                            
                            if (parsed.tiers && parsed.title) {
                              parsedPlan = parsed;
                            } else if (parsed.devBaseXP !== undefined || parsed.devBaseCoins !== undefined) {
                              parsedSettings = parsed;
                            }

                            if (parsedPlan || parsedSettings) {
                              // Try to strip the json block, including any markdown formatting around it
                              const blockRegex = /```(?:json)?\s*\{[\s\S]*\}\s*```/;
                              if (blockRegex.test(textToRender)) {
                                textToRender = textToRender.replace(blockRegex, '');
                              } else {
                                textToRender = textToRender.replace(possibleJson, '');
                              }
                            }
                          }
                        } catch (e) {
                          // Ignore parse error
                        }
                      }

                      return (
                        <>
                          {(textToRender.trim().length > 0) && (
                            <ReactMarkdown
                              components={{
                                code({node, inline, className, children, ...props}: any) {
                                  const match = /language-(\w+)/.exec(className || '');
                                  const isJson = match && match[1] === 'json';
                                  const content = String(children).replace(/\n$/, '');
                                  
                                  // We already extracted top-level JSON above. 
                                  // If there are other code blocks, just render them as normal.
                                  return (
                                    <code className={cn("px-1 py-0.5 rounded text-xs select-auto font-mono", isDarkTheme ? "bg-slate-900/50 text-indigo-300" : "bg-white/50 text-indigo-700", className)} {...props}>
                                      {children}
                                    </code>
                                  );
                                }
                              }}
                            >
                              {textToRender}
                            </ReactMarkdown>
                          )}
                          
                          {parsedPlan && applyExpeditionPlan && (
                            <div className="my-4">
                              <ExpeditionPlanPreview 
                                plan={parsedPlan} 
                                onApply={applyExpeditionPlan} 
                                isDarkTheme={isDarkTheme} 
                              />
                            </div>
                          )}
                          
                          {parsedSettings && setState && (
                            <div className={cn("my-4 p-4 border rounded-2xl flex flex-col items-start gap-3", isDarkTheme ? "bg-slate-900 border-indigo-500/30" : "bg-white border-slate-200 shadow-sm")}>
                              <h4 className={cn("font-black tracking-wide flex items-center gap-2", isDarkTheme ? "text-indigo-400" : "text-indigo-600")}>
                                <SettingsIcon size={16} /> Balance Settings Update
                              </h4>
                              <div className="flex gap-4 items-center">
                                {parsedSettings.devBaseXP !== undefined && (
                                  <div className={cn("px-3 py-1.5 rounded-lg border", isDarkTheme ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200")}>
                                    <span className="text-xs font-bold text-indigo-500">XP: {parsedSettings.devBaseXP}</span>
                                  </div>
                                )}
                                {parsedSettings.devBaseCoins !== undefined && (
                                  <div className={cn("px-3 py-1.5 rounded-lg border", isDarkTheme ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200")}>
                                    <span className="text-xs font-bold text-amber-500">Gold: {parsedSettings.devBaseCoins}</span>
                                  </div>
                                )}
                              </div>
                              <button 
                                onClick={() => {
                                  setState(prev => ({
                                    ...prev,
                                    ...(parsedSettings.devBaseXP !== undefined && { devBaseXP: parsedSettings.devBaseXP }),
                                    ...(parsedSettings.devBaseCoins !== undefined && { devBaseCoins: parsedSettings.devBaseCoins })
                                  }));
                                  alert("Balance settings updated!");
                                }}
                                className="px-4 py-2 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                              >
                                Apply Settings
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()}
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
                    className="p-1 hover:text-indigo-400 text-slate-500 transition-colors flex items-center justify-center"
                    title="Copy"
                  >
                    {copiedId === `${idx}` ? <Check size={10} /> : <Copy size={10} />}
                  </button>
                  <button 
                    onClick={() => handleQuote(msg.content)}
                    className="p-1 hover:text-indigo-400 text-slate-500 transition-colors flex items-center justify-center"
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
              <SageLoadingTimer startTime={loadingStartTime} isDarkTheme={isDarkTheme} onCancel={handleCancelConsult} />
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
                className={cn("absolute bottom-full left-6 mb-4 w-72 rounded-3xl shadow-2xl p-2 z-50 overflow-hidden",
                  isDarkTheme ? "bg-slate-900 border border-slate-800" : "bg-indigo-50 border border-indigo-200"
                )}
              >
                <div className={cn("text-[10px] font-black uppercase tracking-widest px-4 py-3 border-b mb-1 flex justify-between items-center",
                  isDarkTheme ? "text-indigo-500/50 border-slate-800/50" : "text-indigo-700/60 border-indigo-200/50"
                )}>
                  <span>Prompt Library</span>
                  {(!state.sagePrompts || state.sagePrompts.length === 0) && (
                    <button 
                      onClick={() => {
                        import('../constants').then(({ DEFAULT_SAGE_PROMPTS }) => {
                          setState(prev => ({ ...prev, sagePrompts: DEFAULT_SAGE_PROMPTS }));
                        });
                      }}
                      className={cn("text-[9px] font-bold transition-colors",
                        isDarkTheme ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-800"
                      )}
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
                        className={cn("w-full text-left p-4 rounded-[1.25rem] transition-colors group",
                          isDarkTheme ? "hover:bg-indigo-500/10" : "hover:bg-indigo-100"
                        )}
                      >
                        <div className={cn("text-xs font-bold",
                          isDarkTheme ? "text-slate-200 group-hover:text-indigo-400" : "text-indigo-950 group-hover:text-indigo-700"
                        )}>{p.title}</div>
                        <div className={cn("text-[10px] line-clamp-2 mt-1",
                          isDarkTheme ? "text-slate-500" : "text-indigo-700/60"
                        )}>{p.prompt}</div>
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className={cn("text-[10px] font-bold uppercase tracking-widest",
                        isDarkTheme ? "text-slate-600" : "text-indigo-700/40"
                      )}>Library is empty</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
           </AnimatePresence>

           <div className="flex flex-wrap items-center gap-3 mb-3 pl-1">
              <div className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
                <span className={cn("text-[9px] font-black uppercase tracking-widest mr-1", isDarkTheme ? "text-slate-500" : "text-indigo-900/40")}>Persona:</span>
                {(['sage', 'friend', 'master'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setState(prev => ({ ...prev, sagePersonality: p }))}
                    className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg transition-colors border",
                      (state.sagePersonality || 'sage') === p 
                        ? (isDarkTheme ? "bg-indigo-600 border-indigo-500 text-white" : "bg-indigo-500 border-indigo-400 text-white")
                        : (isDarkTheme ? "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600" : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100")
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className={cn("w-px h-3 mx-1", isDarkTheme ? "bg-slate-800" : "bg-slate-200")}></div>
              <button
                onClick={() => setState(prev => ({ ...prev, sageAllowGameModifiers: !prev.sageAllowGameModifiers }))}
                className={cn("flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border transition-all",
                  state.sageAllowGameModifiers 
                    ? (isDarkTheme ? "bg-rose-500/10 border-rose-500/30 text-rose-400" : "bg-rose-500/10 border-rose-200 text-rose-600")
                    : (isDarkTheme ? "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600" : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300")
                )}
                title="Allow AI to propose game modifications (quests, settings)"
              >
                <Edit2 size={10} />
                Modify Mode
              </button>
           </div>

           <div className="flex gap-3">
              <button 
                onClick={() => setShowPromptSelector(!showPromptSelector)}
                className={cn(
                  "flex-shrink-0 w-14 h-14 rounded-2xl border-2 transition-all flex items-center justify-center",
                  showPromptSelector 
                    ? "bg-indigo-600 border-indigo-500 text-white" 
                    : (isDarkTheme ? "bg-slate-950 border-slate-800 text-slate-500 hover:border-indigo-500/50 hover:text-indigo-400" : "bg-indigo-50 border-indigo-200 text-indigo-700/60 hover:border-indigo-400 hover:text-indigo-700")
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
                  className={cn("w-full h-14 border-2 rounded-2xl px-6 pr-16 outline-none transition-all font-medium",
                    isDarkTheme ? "bg-slate-950 border-slate-800 text-slate-200 focus:border-indigo-500 placeholder:text-slate-600" : "bg-indigo-100 border-indigo-300 text-indigo-950 focus:border-indigo-500 placeholder:text-indigo-900/40"
                  )}
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={loading || !userInput.trim()}
                  className={cn("absolute right-2 top-2 bottom-2 w-12 text-white rounded-xl transition-all flex items-center justify-center p-0",
                    isDarkTheme ? "bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800" : "bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-100"
                  )}
                >
                  <Send size={18} />
                </button>
              </div>
           </div>
        </div>
        </div>
      </motion.div>
    </div>
  );
};
