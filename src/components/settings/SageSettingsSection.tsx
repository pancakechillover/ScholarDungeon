import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, RefreshCw, Settings as SettingsIcon, Plus, Edit2, Trash2, Library, Check, Copy, Quote } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AppState, SageModelConfig, SagePromptConfig } from '../../types';
import { cn } from '../../lib/utils';
import { DEFAULT_SAGE_PROMPTS } from '../../constants';
import { getSageAdvice } from '../../services/sageService';

interface SageSettingsProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const SageSettingsSection: React.FC<SageSettingsProps> = ({ state, setState }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">Emerald Sage</h3>
        <p className="text-sm text-slate-400">An AI mentor fueled by your reflections and journey data.</p>
      </div>

      <SageInterface state={state} setState={setState} />
    </div>
  );
};

const SageConfigManager: React.FC<{ state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>> }> = ({ state, setState }) => {
  const [activeTab, setActiveTab] = useState<'models' | 'prompts' | 'personality'>('models');
  
  const models = state.sageModels || [];
  const prompts = state.sagePrompts || [];
  const personalityType = state.sagePersonality || 'sage';
  const personalityPrompts = state.sagePersonalityPrompts || {};

  const [editingModel, setEditingModel] = useState<SageModelConfig | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<SagePromptConfig | null>(null);

  const defaultSagePrompt = `You are "The Sage", an ancient and wise mentor who lives within "The Scholar's Sanctum". \nAnalyze the user's progress and provide deeply personal, mystical, yet strictly structured advice. \nUse metaphors related to "Sanctums", "Dungeons", and "Ancient Artifacts".`;

  const defaultFriendPrompt = `You are a supportive, down-to-earth study buddy and friend. \nAnalyze the user's progress and provide practical, encouraging advice without complex game-like metaphors or mystical language. \nSpeak naturally and focus on their real-life well-being and study habits.`;

  const saveModel = () => {
    if (!editingModel) return;
    let newModels = [...models];
    if (editingModel.id === 'new') {
      newModels.push({ ...editingModel, id: Date.now().toString() });
    } else {
      newModels = newModels.map(m => m.id === editingModel.id ? editingModel : m);
    }
    setState(prev => ({ ...prev, sageModels: newModels, activeSageModelId: prev.activeSageModelId || newModels[0]?.id }));
    setEditingModel(null);
  };

  const savePrompt = () => {
    if (!editingPrompt) return;
    let newPrompts = [...prompts];
    if (editingPrompt.id === 'new') {
      newPrompts.push({ ...editingPrompt, id: Date.now().toString() });
    } else {
      newPrompts = newPrompts.map(p => p.id === editingPrompt.id ? editingPrompt : p);
    }
    setState(prev => ({ ...prev, sagePrompts: newPrompts }));
    setEditingPrompt(null);
  };

  const updatePersonalityPrompt = (type: string, value: string) => {
    setState(prev => ({
      ...prev,
      sagePersonalityPrompts: {
        ...(prev.sagePersonalityPrompts || {}),
        [type]: value
      }
    }));
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
      <div className="flex border-b border-slate-800">
        <button onClick={() => setActiveTab('models')} className={cn("flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors", activeTab === 'models' ? "bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500" : "text-slate-500 hover:text-slate-300")}>Models</button>
        <button onClick={() => setActiveTab('personality')} className={cn("flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors", activeTab === 'personality' ? "bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500" : "text-slate-500 hover:text-slate-300")}>Identity</button>
        <button onClick={() => setActiveTab('prompts')} className={cn("flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors", activeTab === 'prompts' ? "bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500" : "text-slate-500 hover:text-slate-300")}>Prompts</button>
      </div>

      <div className="p-6">
        {activeTab === 'personality' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">AI Personality</label>
              <div className="grid grid-cols-3 gap-2">
                {(['sage', 'friend', 'custom'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setState(prev => ({ ...prev, sagePersonality: type }))}
                    className={cn(
                      "py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                      personalityType === type 
                        ? "bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                        : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    {personalityType === 'custom' ? 'Custom Character Prompt' : `${personalityType.toUpperCase()} Prompt (Customizable)`}
                  </label>
                  {personalityPrompts[personalityType] && (
                    <button 
                      onClick={() => updatePersonalityPrompt(personalityType, '')}
                      className="text-[9px] font-bold text-rose-400 uppercase hover:text-rose-300 transition-colors"
                    >
                      Reset to Default
                    </button>
                  )}
                </div>
                <textarea
                  value={personalityPrompts[personalityType] || (personalityType === 'friend' ? defaultFriendPrompt : (personalityType === 'sage' ? defaultSagePrompt : ''))}
                  onChange={(e) => updatePersonalityPrompt(personalityType, e.target.value)}
                  placeholder={personalityType === 'custom' ? "Enter your custom AI personality instructions..." : ""}
                  className="w-full h-40 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-slate-300 text-xs font-medium focus:border-emerald-500 outline-none transition-all resize-none custom-scrollbar leading-relaxed"
                />
                <p className="text-[9px] text-slate-500 italic px-1">
                  This prompt defines how the AI behaves. You can modify the defaults or create a completely new one under "Custom".
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'models' && (
          <div className="space-y-4">
            {editingModel ? (
              <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <input type="text" placeholder="Profile Name (e.g. GPT-4o)" value={editingModel.name} onChange={(e) => setEditingModel({...editingModel, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white text-sm" />
                <select value={editingModel.provider} onChange={(e) => setEditingModel({...editingModel, provider: e.target.value as any})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white text-sm">
                  <option value="google">Google Gemini</option>
                  <option value="openai">OpenAI / Compatible</option>
                </select>
                <input type="text" placeholder="Model Name (e.g. gemini-1.5-flash)" value={editingModel.modelName} onChange={(e) => setEditingModel({...editingModel, modelName: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white text-sm" />
                <input type="password" placeholder="API Key" value={editingModel.apiKey || ''} onChange={(e) => setEditingModel({...editingModel, apiKey: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white text-sm" />
                {editingModel.provider === 'openai' && (
                  <input type="text" placeholder="Custom Base URL (optional)" value={editingModel.apiUrl || ''} onChange={(e) => setEditingModel({...editingModel, apiUrl: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white text-sm" />
                )}
                <div className="flex gap-2">
                  <button onClick={saveModel} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all">Save Profile</button>
                  <button onClick={() => setEditingModel(null)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Active Model</label>
                  <select 
                    value={state.activeSageModelId || ''} 
                    onChange={(e) => setState(prev => ({ ...prev, activeSageModelId: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-all text-sm font-bold"
                  >
                    {!models.length && <option value="">Default Legacy Config</option>}
                    {models.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.modelName})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  {models.map(m => (
                     <div key={m.id} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-800 rounded-xl">
                       <span className="text-sm font-medium text-slate-300">{m.name}</span>
                       <div className="flex gap-2">
                         <button onClick={() => setEditingModel(m)} className="p-1.5 text-slate-400 hover:text-white transition-colors"><Edit2 size={14} /></button>
                         <button onClick={() => setState(prev => ({ ...prev, sageModels: prev.sageModels?.filter(x => x.id !== m.id) }))} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                       </div>
                     </div>
                  ))}
                </div>
                <button onClick={() => setEditingModel({ id: 'new', name: '', provider: 'google', modelName: '' })} className="w-full py-3 bg-slate-800 border border-slate-700 border-dashed hover:border-emerald-500 hover:text-emerald-400 text-slate-400 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <Plus size={14} /> Add Model Profile
                </button>
              </>
            )}
          </div>
        )}

        {activeTab === 'prompts' && (
          <div className="space-y-4">
            {editingPrompt ? (
              <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <input type="text" placeholder="Prompt Title (e.g. Scold Me)" value={editingPrompt.title} onChange={(e) => setEditingPrompt({...editingPrompt, title: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white text-sm" />
                <textarea placeholder="Enter custom prompt content..." value={editingPrompt.prompt} onChange={(e) => setEditingPrompt({...editingPrompt, prompt: e.target.value})} className="w-full h-32 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white text-sm resize-none custom-scrollbar" />
                <div className="flex gap-2">
                  <button onClick={savePrompt} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all">Save Prompt</button>
                  <button onClick={() => setEditingPrompt(null)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Library</label>
                  <button 
                    onClick={() => {
                      if (window.confirm("Restore all default prompts? This will not delete your custom ones but will re-add defaults if they are missing.")) {
                        setState(prev => {
                          const existingIds = (prev.sagePrompts || []).map(p => p.id);
                          const toAdd = DEFAULT_SAGE_PROMPTS.filter((p) => !existingIds.includes(p.id));
                          return { ...prev, sagePrompts: [...(prev.sagePrompts || []), ...toAdd] };
                        });
                      }
                    }}
                    className="text-[9px] font-bold text-emerald-400 uppercase hover:text-emerald-300 transition-colors"
                  >
                    Restore Defaults
                  </button>
                </div>
                <div className="space-y-2">
                  {prompts.map(p => (
                     <div key={p.id} className="group p-3 bg-slate-800/30 border border-slate-800 rounded-xl hover:border-emerald-500/30 transition-colors">
                       <div className="flex items-center justify-between mb-1">
                         <span className="text-sm font-bold text-slate-200">{p.title}</span>
                         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => setEditingPrompt(p)} className="p-1 px-2 text-[10px] font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1"><Edit2 size={10} /> Edit</button>
                           <button 
                             onClick={() => {
                               if (window.confirm("Delete this prompt?")) {
                                 setState(prev => ({ ...prev, sagePrompts: prev.sagePrompts?.filter(x => x.id !== p.id) }));
                               }
                             }} 
                             className="p-1 px-2 text-[10px] font-bold text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
                           >
                             <Trash2 size={10} /> Delete
                           </button>
                         </div>
                       </div>
                       <p className="text-[10px] text-slate-500 line-clamp-1 italic">{p.prompt}</p>
                     </div>
                  ))}
                  {prompts.length === 0 && <p className="text-center text-xs text-slate-500 py-4 italic">No prompts in your library yet.</p>}
                </div>
                <button onClick={() => setEditingPrompt({ id: 'new', title: '', prompt: '' })} className="w-full py-3 bg-slate-800 border border-slate-700 border-dashed hover:border-emerald-500 hover:text-emerald-400 text-slate-400 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <Plus size={14} /> Create New Prompt
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface SageInterfaceProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const SageInterface: React.FC<SageInterfaceProps> = ({ state, setState }) => {
  const isDarkTheme = ['night', 'forest', 'ocean'].includes(state.theme || '');
  const [showConfig, setShowConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPromptSelector, setShowPromptSelector] = useState(false);
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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuote = (text: string) => {
    // Basic quoting: prepend as markdown quote
    const lines = text.split('\n').map(l => `> ${l}`).join('\n');
    setUserInput(lines + '\n\n' + userInput);
    if (inputRef.current) inputRef.current.focus();
  };

  const clearHistory = () => {
    setState(prev => ({ ...prev, sageChatHistory: [] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
             <Bot className="text-emerald-400" size={24} />
          </div>
          <div>
            <h4 className="text-lg font-black text-white uppercase tracking-widest leading-none mb-2">The Emerald Sage</h4>
            <p className="text-xs text-emerald-400/70 font-medium">An AI mentor fueled by your reflections.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearHistory}
            className="p-2 bg-slate-800 text-slate-400 border border-slate-700 rounded-xl hover:text-red-400 transition-colors"
            title="Clear History"
          >
            <RefreshCw size={18} />
          </button>
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className={cn(
              "p-2 rounded-xl border transition-all",
              showConfig ? "bg-white text-black border-white" : "bg-slate-800 text-slate-400 border-slate-700 hover:border-emerald-500/50"
            )}
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <SageConfigManager state={state} setState={setState} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col bg-slate-950/50 rounded-3xl border border-slate-800 overflow-hidden min-h-[500px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar max-h-[600px]">
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
                      "rounded-tl-none font-serif italic shadow-emerald-500/10",
                      isDarkTheme 
                        ? "bg-slate-900 border border-emerald-500/20 text-emerald-50" 
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
            <div className="flex flex-col items-start">
              <div className="bg-slate-800/40 border border-emerald-500/20 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                 <RefreshCw className="animate-spin text-emerald-400" size={16} />
                 <span className="text-xs font-serif italic text-emerald-400/70">The Sage is consulting the scrolls...</span>
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
                className="absolute bottom-full left-4 mb-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-20 overflow-hidden"
              >
                <div className="text-[10px] font-black text-indigo-500/50 uppercase tracking-widest px-3 py-2 border-b border-slate-800/50 mb-1 flex justify-between items-center">
                  <span>Prompt Library</span>
                  {(!state.sagePrompts || state.sagePrompts.length === 0) && (
                    <button 
                      onClick={() => {
                        import('../../constants').then(({ DEFAULT_SAGE_PROMPTS }) => {
                          setState(prev => ({ ...prev, sagePrompts: DEFAULT_SAGE_PROMPTS }));
                        });
                      }}
                      className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Load Defaults
                    </button>
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {state.sagePrompts && state.sagePrompts.length > 0 ? (
                    state.sagePrompts.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setUserInput(p.prompt + (userInput ? '\n\n' + userInput : ''));
                          setShowPromptSelector(false);
                          inputRef.current?.focus();
                        }}
                        className="w-full text-left p-3 hover:bg-indigo-500/10 rounded-xl transition-colors group"
                      >
                        <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-400">{p.title}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{p.prompt}</div>
                      </button>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                       <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Library is empty</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
           </AnimatePresence>

           <div className="flex gap-2">
              <button 
                onClick={() => setShowPromptSelector(!showPromptSelector)}
                className={cn(
                  "flex-shrink-0 w-12 h-14 rounded-2xl border transition-all flex items-center justify-center",
                  showPromptSelector ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-950 border-slate-800 text-slate-500 hover:border-emerald-500/50 hover:text-emerald-400"
                )}
                title="Select Prompt"
              >
                <Library size={20} />
              </button>
              <div className="relative flex-1 group">
                <input 
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Message the Sage..."
                  className="w-full h-14 bg-slate-950 border border-slate-800 rounded-2xl px-5 text-slate-200 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={loading || !userInput.trim()}
                  className="absolute right-2 top-2 bottom-2 w-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
