import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Target, Zap, Clock, Coins, Ticket, Sparkles, BookOpen, AlertTriangle, Key, Settings as SettingsIcon, Bot, Send, RefreshCw, Cpu, Plus, Edit2, Trash2 } from 'lucide-react';
import { AppState, SageModelConfig, SagePromptConfig } from '../../types';
import { cn, getXPForLevel } from '../../lib/utils';
import { TALENTS } from '../../constants';
import { getSageAdvice } from '../../services/sageService';

interface AdviceSettingsProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const AdviceSettingsSection: React.FC<AdviceSettingsProps> = ({ state, setState }) => {
  const [activeTab, setActiveTab] = useState<'basically' | 'sage'>('basically');

  // Basic Calculator State
  const [focusInput, setFocusInput] = useState(25);
  const [restInput, setRestInput] = useState(5);
  const [sessionsPerDay, setSessionsPerDay] = useState(8);

  const calculateSessionYield = () => {
    // Session Reward Settings logic
    let baseXP = 100;
    let baseCoins = 10; // average of random 5-15

    if (state.devModeEnabled) {
      if (state.devXpMode === 'random') {
        const minXP = state.devMinXP ?? 50;
        const maxXP = state.devMaxXP ?? 150;
        baseXP = Math.floor((minXP + maxXP) / 2);
      } else {
        baseXP = state.devBaseXP ?? 100;
      }
      if (state.devCoinMode === 'fixed') {
        baseCoins = state.devBaseCoins ?? 10;
      } else {
        const min = state.devMinCoins ?? 5;
        const max = state.devMaxCoins ?? 15;
        baseCoins = Math.floor((min + max) / 2);
      }
    }

    // Evaluate active talents for average baseline session
    if (state.activeTalents.includes('a1')) baseXP = Math.floor(baseXP * 1.1);
    if (state.activeTalents.includes('b1')) baseCoins += 2;

    const critChance = state.devModeEnabled ? (state.devCritChance ?? 0.05) : 0.05;
    const critMult = state.devModeEnabled ? (state.devCritMultiplier ?? 5) : 5;
    
    // Calculate expected coins including crit probability
    let avgCoins = baseCoins;
    if (state.activeTalents.includes('c3')) {
      avgCoins = baseCoins * (1 - critChance) + (baseCoins * critMult) * critChance;
    }

    // Calculate daily yields based on sessionsPerDay
    let dailyXP = baseXP * sessionsPerDay;
    let dailyCoins = avgCoins * sessionsPerDay;

    // Apply strict daily occurrences (streak/16th)
    if (sessionsPerDay >= 8) {
      // Assuming a moderate streak for simulation (e.g., streak = 2)
      if (state.activeTalents.includes('a3')) dailyXP += (20 * 2); 
      if (state.activeTalents.includes('b3')) dailyCoins += (10 * 2);
    }
    if (sessionsPerDay >= 16) {
      if (state.activeTalents.includes('a2')) dailyXP += 200;
      if (state.activeTalents.includes('b2')) dailyCoins += 50;
    }

    // Convert total daily expected session coin to single session average
    const expectedSessionCoins = sessionsPerDay > 0 ? dailyCoins / sessionsPerDay : 0;
    const expectedSessionXP = sessionsPerDay > 0 ? dailyXP / sessionsPerDay : 0;

    // Evaluate Talent point output roughly (talent shards not typically farmed from flat sessions without specific quests or rewards pool limits, but from reward pool drop rates)
    const validPool = state.rewardPool || [];
    const totalWeight = validPool.reduce((acc, r) => acc + r.weight, 0);
    const shardWeight = validPool.filter(r => r.itemType === 'talent_shard').reduce((acc, r) => acc + r.weight, 0);
    const chancePerChoice = totalWeight > 0 ? shardWeight / totalWeight : 0;
    
    // Typically 3 choices are presented. 
    // Probability of seeing at least 1 talent shard in 3 choices = 1 - (1 - chance)^3
    // Then they need 10 shards to make 1 talent point.
    const chanceToSeeShard = 1 - Math.pow(1 - chancePerChoice, 3);
    const expectedShardsPerSession = chanceToSeeShard; 
    
    let expectedDailyShards = expectedShardsPerSession * sessionsPerDay;

    return { 
      sessionXP: Math.floor(expectedSessionXP), 
      sessionCoins: Math.floor(expectedSessionCoins), 
      chanceToSeeShard,
      dailyXP: Math.floor(dailyXP), 
      dailyCoins: Math.floor(dailyCoins),
      dailyShards: expectedDailyShards
    };
  };

  const getShopStats = (dailyCoins: number, sessionCoins: number) => {
    // Exclude infinite stock for total calculation, just base it on bounded fixed items
    const totalShopCost = state.shopItems.filter(i => i.stock !== -1).reduce((acc, item) => acc + (item.price * (item.stock || 1)), 0);
    const shopSessions = sessionCoins > 0 ? Math.ceil(totalShopCost / sessionCoins) : 0;
    const shopDays = dailyCoins > 0 ? totalShopCost / dailyCoins : 0;

    const gachaCost = state.gachaPools.find(p => p.type === 'gacha')?.cost || 0;
    const gachaSessions = sessionCoins > 0 && gachaCost > 0 ? Math.ceil(gachaCost / sessionCoins) : 0;
    const gachaPerDay = dailyCoins > 0 && gachaCost > 0 ? Math.floor(dailyCoins / gachaCost) : 0;
    
    const kujiCost = state.gachaPools.find(p => p.type === 'ichiban')?.cost || 0;
    const kujiSessions = sessionCoins > 0 && kujiCost > 0 ? Math.ceil(kujiCost / sessionCoins) : 0;
    const kujiPerDay = dailyCoins > 0 && kujiCost > 0 ? Math.floor(dailyCoins / kujiCost) : 0;

    return {
      totalShopCost, shopSessions, shopDays,
      gachaCost, gachaSessions, gachaPerDay,
      kujiCost, kujiSessions, kujiPerDay
    };
  };

  const getLevelStats = (sessionXP: number, dailyXP: number) => {
    const nextLevels = [];
    let currentLvl = state.level;
    let carryOverXP = state.xp || 0;
    
    for(let i = 0; i < 3; i++) {
        let xpRequired = getXPForLevel(currentLvl);
        let neededForThisLevel = xpRequired - carryOverXP;
        if (neededForThisLevel < 0) neededForThisLevel = 0;
        carryOverXP = 0; // consumed
        
        const sessions = sessionXP > 0 ? Math.ceil(neededForThisLevel / sessionXP) : 0;
        
        nextLevels.push({
           level: currentLvl + 1,
           xp: neededForThisLevel,
           sessions,
           days: dailyXP > 0 ? neededForThisLevel / dailyXP : 0
        });
        currentLvl++;
    }
    return nextLevels;
  };

  const yields = calculateSessionYield();
  const shopStats = getShopStats(yields.dailyCoins, yields.sessionCoins);
  const lvlStats = getLevelStats(yields.sessionXP, yields.dailyXP);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">Advice & Calculators</h3>
        <p className="text-sm text-slate-400">Balance checking and optimization guides to help you tune your personal journey.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900/50 p-1.5 rounded-2xl w-fit border border-slate-800">
        <button
          onClick={() => setActiveTab('basically')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all",
            activeTab === 'basically' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
          )}
        >
          <Calculator size={16} />
          Basically
        </button>
        <button
          onClick={() => setActiveTab('sage')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all relative overflow-hidden",
            activeTab === 'sage' ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
          )}
        >
          <BookOpen size={16} />
          From Sage's
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'basically' && (
          <motion.div
            key="basically"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors border border-indigo-500/20 p-6 rounded-3xl text-sm text-indigo-300">
              <div className="flex items-center gap-2 mb-3">
                 <AlertTriangle className="text-indigo-400 w-5 h-5" />
                 <strong className="text-indigo-400 font-black uppercase tracking-widest text-sm">General Advice</strong>
              </div>
              <ul className="list-disc pl-5 space-y-2 opacity-90 font-medium leading-relaxed">
                <li>Your session time (e.g. <span className="text-white font-mono bg-slate-950 px-1.5 py-0.5 rounded">25+5</span>) does <span className="text-indigo-400 font-bold">not</span> scale your base XP or Gold naturally. A flat base is given per session.</li>
                <li>Longer focus sessions require deliberate tuning of Developer Settings to remain balanced. If you prefer 50-minute sessions over 25-minute ones, you should double your Base XP and Base Coins.</li>
                <li>Streak bonuses from Talents (A3/B3) trigger extremely powerful rewards on exactly your <span className="text-indigo-400 font-bold">8th session</span> of the day once you reach a streak of 2 days or more.</li>
                <li>Talent points are obtained by collecting <span className="text-indigo-400 font-bold">10 Talent Shards</span>. Adjust your Reward Pool weights if they feel too rare.</li>
              </ul>
            </div>

            {/* Input Config */}
            <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
              <h4 className="flex items-center gap-2 font-black text-white mb-6 uppercase tracking-widest text-sm">
                <Clock className="text-indigo-400" size={18} />
                Your Routine Profile
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative group">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Focus Time (Min)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={focusInput}
                      onChange={(e) => setFocusInput(Number(e.target.value))}
                      className="w-full bg-slate-950/80 border-2 border-slate-800 text-indigo-400 px-4 py-4 rounded-2xl focus:border-indigo-500 transition-all font-mono text-2xl font-black text-center shadow-inner"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity rounded-b-2xl" />
                  </div>
                </div>
                <div className="relative group">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Rest Time (Min)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={restInput}
                      onChange={(e) => setRestInput(Number(e.target.value))}
                      className="w-full bg-slate-950/80 border-2 border-slate-800 text-emerald-400 px-4 py-4 rounded-2xl focus:border-emerald-500 transition-all font-mono text-2xl font-black text-center shadow-inner"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity rounded-b-2xl" />
                  </div>
                </div>
                <div className="relative group">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Sessions / Day</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={sessionsPerDay}
                      onChange={(e) => setSessionsPerDay(Number(e.target.value))}
                      className="w-full bg-slate-950/80 border-2 border-slate-800 text-amber-400 px-4 py-4 rounded-2xl focus:border-amber-500 transition-all font-mono text-2xl font-black text-center shadow-inner"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity rounded-b-2xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Calc 1: Yields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <h4 className="flex items-center gap-2 font-black text-white mb-6 uppercase tracking-widest text-sm">
                  <Zap className="text-emerald-400" size={18} />
                  Calculated Income
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors group">
                    <span className="text-sm font-bold text-slate-300 group-hover:text-emerald-400 transition-colors">XP Gain</span>
                    <div className="text-right">
                      <div className="text-emerald-400 font-black font-mono text-lg">+{yields.sessionXP} <span className="text-xs text-slate-500 font-sans opacity-60">/ session</span></div>
                      <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">~{yields.dailyXP} / DAY</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors group">
                    <span className="text-sm font-bold text-slate-300 group-hover:text-amber-400 transition-colors">Gold Gain</span>
                    <div className="text-right">
                      <div className="text-amber-400 font-black font-mono text-lg">+{yields.sessionCoins} <span className="text-xs text-slate-500 font-sans opacity-60">/ session</span></div>
                      <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">~{yields.dailyCoins} / DAY</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-fuchsia-500/5 rounded-2xl border border-fuchsia-500/10 relative overflow-hidden group hover:border-fuchsia-500/20 transition-colors">
                    <span className="text-sm font-bold text-fuchsia-300 relative z-10 group-hover:text-fuchsia-200 transition-colors">Talent Shards</span>
                    <div className="text-right relative z-10">
                      <div className="text-fuchsia-400 font-black font-mono text-lg">{(yields.chanceToSeeShard * 100).toFixed(1)}% <span className="text-[10px] text-fuchsia-300/50 font-sans uppercase">chance/chest</span></div>
                      <div className="text-[10px] text-fuchsia-400/80 font-bold tracking-widest uppercase mt-0.5">~{yields.dailyShards.toFixed(1)} / DAY</div>
                    </div>
                    <Sparkles className="absolute -left-2 -bottom-2 text-fuchsia-500/10 w-16 h-16 pointer-events-none group-hover:text-fuchsia-500/20 transition-colors duration-500" />
                  </div>
                </div>
              </div>

              {/* Calc 2: Level Progression */}
              <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <h4 className="flex items-center gap-2 font-black text-rose-400 mb-6 uppercase tracking-widest text-sm">
                  <Target size={18} />
                  Level Progression
                </h4>
                <div className="space-y-3">
                  {lvlStats.map((lvl, index) => (
                    <div key={index} className="flex flex-col p-4 bg-slate-800/30 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all hover:-translate-y-0.5">
                      <div className="flex justify-between items-center mb-2 border-b border-slate-800/50 pb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Next Level {lvl.level}</span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold">{lvl.xp} XP</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                           <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Takes roughly</span>
                           <span className="text-slate-300 font-mono text-lg"><strong className="text-white font-black">{lvl.sessions}</strong> <span className="text-xs font-sans text-slate-500">sessions</span></span>
                        </div>
                        <div className="bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
                          <span className="text-indigo-300 font-mono font-bold"><strong className="text-indigo-400 font-black">{lvl.days.toFixed(1)}</strong> <span className="text-[10px] font-sans uppercase">days</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Calc 3: Economy & Spending */}
            <div className="bg-slate-900/40 p-0 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 bg-slate-900/40">
                <h4 className="flex items-center gap-2 font-black text-white uppercase tracking-widest text-sm">
                  <Coins className="text-amber-400" size={18} />
                  Economy & Purchasing Power
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                 {/* Fixed Shop */}
                 <div className="p-6 bg-slate-800/10 hover:bg-slate-800/20 transition-colors">
                   <div className="flex items-center gap-2 text-slate-300 font-black uppercase tracking-widest text-xs mb-6">
                     <Coins className="text-amber-500" size={16} /> Fixed Shop
                   </div>
                   
                   <div className="mb-6">
                     <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase mb-1">Total Shop Cost</p>
                     <div className="text-2xl font-mono font-black text-amber-400">{shopStats.totalShopCost}</div>
                   </div>

                   <div>
                     <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase mb-2">To Buy Everything (No restocks)</p>
                     <div className="flex justify-between items-center bg-slate-950/50 rounded-xl p-3 border border-slate-800">
                       <div className="text-white font-mono text-sm">{shopStats.shopSessions} <span className="text-[10px] font-sans text-slate-500 uppercase">sessions</span></div>
                       <div className="text-emerald-400 font-mono font-bold text-sm bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">{shopStats.shopDays < 1 ? '< 1' : shopStats.shopDays.toFixed(1)} <span className="text-[10px] font-sans uppercase">days</span></div>
                     </div>
                   </div>
                 </div>

                 {/* Gacha */}
                 <div className="p-6 bg-slate-800/10 hover:bg-slate-800/20 transition-colors relative overflow-hidden">
                   <div className="flex items-center gap-2 text-slate-300 font-black uppercase tracking-widest text-xs mb-6 relative z-10">
                     <Ticket className="text-indigo-400 bg-indigo-500/20 p-1 rounded border border-indigo-500/30" size={24} /> Gacha Pool
                   </div>
                   
                   <div className="mb-6 relative z-10">
                     <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase mb-1">Cost per pull</p>
                     <div className="text-2xl font-mono font-black text-indigo-400">{shopStats.gachaCost}</div>
                   </div>

                   <div className="relative z-10">
                     <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase mb-2">Pull Frequency</p>
                     <div className="flex justify-between items-center bg-slate-950/50 rounded-xl p-3 border border-slate-800 mb-2">
                       <span className="text-[10px] text-slate-400 font-bold uppercase">Reqs</span>
                       <div className="text-white font-mono text-sm">{shopStats.gachaSessions} <span className="text-[10px] font-sans text-slate-500 uppercase">sessions</span></div>
                     </div>
                     <div className="flex justify-between items-center bg-indigo-500/10 rounded-xl p-3 border border-indigo-500/20">
                       <span className="text-[10px] text-indigo-300 font-bold uppercase">Rate</span>
                       <div className="text-indigo-400 font-mono font-black text-lg">{shopStats.gachaPerDay}x <span className="text-[10px] font-sans text-indigo-300/50 uppercase">/ day</span></div>
                     </div>
                   </div>
                 </div>

                 {/* Ichiban Kuji */}
                 <div className="p-6 bg-slate-800/10 hover:bg-slate-800/20 transition-colors relative overflow-hidden">
                   <div className="flex items-center gap-2 text-slate-300 font-black uppercase tracking-widest text-xs mb-6 relative z-10">
                     <Sparkles className="text-emerald-400 bg-emerald-500/20 p-1 rounded border border-emerald-500/30" size={24} /> Ichiban Kuji
                   </div>
                   
                   {shopStats.kujiCost > 0 ? (
                     <>
                       <div className="mb-6 relative z-10">
                         <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase mb-1">Cost per pull</p>
                         <div className="text-2xl font-mono font-black text-emerald-400">{shopStats.kujiCost}</div>
                       </div>

                       <div className="relative z-10">
                         <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase mb-2">Pull Frequency</p>
                         <div className="flex justify-between items-center bg-slate-950/50 rounded-xl p-3 border border-slate-800 mb-2">
                           <span className="text-[10px] text-slate-400 font-bold uppercase">Reqs</span>
                           <div className="text-white font-mono text-sm">{shopStats.kujiSessions} <span className="text-[10px] font-sans text-slate-500 uppercase">sessions</span></div>
                         </div>
                         <div className="flex justify-between items-center bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
                           <span className="text-[10px] text-emerald-300 font-bold uppercase">Rate</span>
                           <div className="text-emerald-400 font-mono font-black text-lg">{shopStats.kujiPerDay}x <span className="text-[10px] font-sans text-emerald-300/50 uppercase">/ day</span></div>
                         </div>
                       </div>
                     </>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center opacity-50 pb-8">
                       <Sparkles strokeWidth={1} className="w-12 h-12 text-slate-600 mb-3" />
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">No Pool Configured</p>
                     </div>
                   )}
                 </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'sage' && (
          <SageInterface state={state} setState={setState} />
        )}
      </AnimatePresence>
    </div>
  );
};

const SageConfigManager: React.FC<{ state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>> }> = ({ state, setState }) => {
  const [activeTab, setActiveTab] = useState<'models' | 'prompts'>('models');
  
  const models = state.sageModels || [];
  const prompts = state.sagePrompts || [];

  const [editingModel, setEditingModel] = useState<SageModelConfig | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<SagePromptConfig | null>(null);

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

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
      <div className="flex border-b border-slate-800">
        <button onClick={() => setActiveTab('models')} className={cn("flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors", activeTab === 'models' ? "bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500" : "text-slate-500 hover:text-slate-300")}>AI Models</button>
        <button onClick={() => setActiveTab('prompts')} className={cn("flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors", activeTab === 'prompts' ? "bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500" : "text-slate-500 hover:text-slate-300")}>Saved Prompts</button>
      </div>

      <div className="p-6">
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
                <div className="space-y-2">
                  {prompts.map(p => (
                     <div key={p.id} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-800 rounded-xl">
                       <span className="text-sm font-medium text-slate-300">{p.title}</span>
                       <div className="flex gap-2">
                         <button onClick={() => setEditingPrompt(p)} className="p-1.5 text-slate-400 hover:text-white transition-colors"><Edit2 size={14} /></button>
                         <button onClick={() => setState(prev => ({ ...prev, sagePrompts: prev.sagePrompts?.filter(x => x.id !== p.id) }))} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                       </div>
                     </div>
                  ))}
                  {prompts.length === 0 && <p className="text-center text-xs text-slate-500 py-4">No custom prompts saved.</p>}
                </div>
                <button onClick={() => setEditingPrompt({ id: 'new', title: '', prompt: '' })} className="w-full py-3 bg-slate-800 border border-slate-700 border-dashed hover:border-emerald-500 hover:text-emerald-400 text-slate-400 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <Plus size={14} /> Add Custom Prompt
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
  const [showConfig, setShowConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

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

  const updateSageConfig = (key: keyof AppState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const clearHistory = () => {
    setState(prev => ({ ...prev, sageChatHistory: [] }));
  };

  return (
    <motion.div
      key="sage"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
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
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
               <Bot size={48} className="text-emerald-500/20" />
               <p className="text-slate-500 text-sm max-w-xs font-medium">The Sage awaits your question. Consult the scrolls to begin your path to enlightenment.</p>
               <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                 <button onClick={() => handleSend("Analyze my trends.")} className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl text-xs hover:border-emerald-500/50 hover:text-white transition-all font-bold">"Analyze my trends"</button>
                 <button onClick={() => handleSend("Identify my weaknesses.")} className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl text-xs hover:border-emerald-500/50 hover:text-white transition-all font-bold">"Identify weaknesses"</button>
                 {state.sagePrompts?.map(p => (
                   <button key={p.id} onClick={() => handleSend(p.prompt)} className="px-4 py-2 bg-emerald-900/20 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs hover:border-emerald-500/50 hover:text-white transition-all font-bold">{p.title}</button>
                 ))}
               </div>
            </div>
          )}

          {history.map((msg, idx) => (
            <div key={idx} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
              <div className={cn(
                "max-w-[90%] p-4 rounded-2xl text-sm font-medium leading-relaxed",
                msg.role === 'user' 
                  ? "bg-indigo-600/10 border border-indigo-500/20 text-indigo-200 rounded-tr-none" 
                  : "bg-slate-900/80 border border-emerald-500/10 text-slate-300 rounded-tl-none font-serif italic"
              )}>
                <div className="prose prose-invert prose-emerald prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-emerald-400/60 font-serif italic text-xs ml-2">
              <RefreshCw className="animate-spin" size={14} /> The Sage is pondering...
            </div>
          )}
          
          {error && <div className="text-red-400 text-xs font-bold p-4 bg-red-500/10 rounded-xl border border-red-500/20">{error}</div>}
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800">
           <div className="relative group">
              <input 
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message the Sage..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 pr-16 text-slate-200 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
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
    </motion.div>
  );
};
