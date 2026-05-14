import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Zap, Clock, Coins, Ticket, Sparkles, Target, AlertTriangle } from 'lucide-react';
import { AppState } from '../../types';
import { cn, getXPForLevel } from '../../lib/utils';

interface CalcSettingsProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const CalcSettingsSection: React.FC<CalcSettingsProps> = ({ state, setState }) => {
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">Calculators</h3>
        <p className="text-sm text-slate-400">Balance checking and optimization guides to help you tune your personal journey.</p>
      </div>

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
  );
};
