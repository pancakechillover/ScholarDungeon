import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quest, QuestType, QuestReward } from '../types';
import { Target, Trophy, Plus, Trash2, Edit2, CheckCircle2, ChevronDown, ChevronUp, X, Gift, Coins, Zap, CheckSquare, Square } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { cn } from '../lib/utils';

interface QuestManagerProps {
  quests: Quest[];
  activeTalents: string[];
  isAdding: boolean;
  setIsAdding: (val: boolean) => void;
  onUpdateQuests: (quests: Quest[]) => void;
  onClaimReward: (id: string) => void;
  forceTab?: 'quests' | 'achievements';
  isEditMode?: boolean;
}

export const QuestManager = React.memo<QuestManagerProps>(({ quests, activeTalents, isAdding, setIsAdding, onUpdateQuests, onClaimReward, forceTab, isEditMode = false }) => {
  const [activeTab, setActiveTab] = useState<'quests' | 'achievements'>(forceTab || 'quests');

  React.useEffect(() => {
    if (forceTab) {
      setActiveTab(forceTab);
    }
  }, [forceTab]);
  const [isEditing, setIsEditing] = useState<Quest | null>(null);
  const [newQuest, setNewQuest] = useState<Partial<Quest>>({
    title: '',
    description: '',
    type: 'daily_sessions',
    target: 1,
    rewards: [{ type: 'coins', amount: 10 }],
    isAchievement: false
  });

  React.useEffect(() => {
    if (isAdding && !isEditing) {
      setNewQuest({
        title: '',
        description: '',
        type: activeTab === 'achievements' ? 'total_sessions' : 'daily_sessions',
        target: 1,
        rewards: [{ type: 'coins', amount: 10 }],
        isAchievement: activeTab === 'achievements'
      });
    }
  }, [isAdding, activeTab, isEditing]);

  const addReward = () => {
    setNewQuest(prev => ({
      ...prev,
      rewards: [...(prev.rewards || []), { type: 'coins', amount: 10 }]
    }));
  };

  const removeReward = (index: number) => {
    setNewQuest(prev => ({
      ...prev,
      rewards: prev.rewards?.filter((_, i) => i !== index)
    }));
  };

  const updateReward = (index: number, field: keyof QuestReward, value: any) => {
    setNewQuest(prev => {
      const updated = [...(prev.rewards || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, rewards: updated };
    });
  };

  const handleSave = () => {
    if (isEditing) {
      onUpdateQuests(quests.map(q => q.id === isEditing.id ? { ...isEditing, ...newQuest } as Quest : q));
      setIsEditing(null);
    } else {
      const quest: Quest = {
        id: 'q_' + Math.random().toString(36).substr(2, 9),
        title: newQuest.title || 'New Task',
        description: newQuest.description || '',
        type: newQuest.type as QuestType,
        target: newQuest.target || 1,
        progress: 0,
        reward: (newQuest.rewards && newQuest.rewards[0]) || { type: 'coins', amount: 10 },
        rewards: newQuest.rewards || [{ type: 'coins', amount: 10 }],
        completed: false,
        order: quests.length,
        isAchievement: activeTab === 'achievements',
        talentRequired: newQuest.talentRequired
      };
      onUpdateQuests([...quests, quest]);
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    onUpdateQuests(quests.filter(q => q.id !== id));
  };

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const newQuests = [...quests];
    if (direction === 'up' && index > 0) {
      [newQuests[index - 1], newQuests[index]] = [newQuests[index], newQuests[index - 1]];
    } else if (direction === 'down' && index < newQuests.length - 1) {
      [newQuests[index + 1], newQuests[index]] = [newQuests[index], newQuests[index + 1]];
    }
    // Update order property
    newQuests.forEach((q, i) => q.order = i);
    onUpdateQuests(newQuests);
  };

  const filteredQuests = quests
    .filter(q => q.isAchievement === (activeTab === 'achievements'))
    .filter(q => !q.talentRequired || activeTalents.includes(q.talentRequired))
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      {!forceTab && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('quests')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                activeTab === 'quests' ? "bg-indigo-500/20 text-indigo-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Quests
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                activeTab === 'achievements' ? "bg-amber-500/20 text-amber-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Achievements
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {(isAdding || isEditing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">{isEditing ? 'Edit' : 'Create'} {activeTab === 'quests' ? 'Quest' : 'Achievement'}</h3>
                <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Title</label>
                    <input
                      type="text"
                      placeholder="Title"
                      value={newQuest.title}
                      onChange={e => setNewQuest({ ...newQuest, title: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
                    <input
                      type="text"
                      placeholder="Description"
                      value={newQuest.description}
                      onChange={e => setNewQuest({ ...newQuest, description: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Type</label>
                    <select
                      value={newQuest.type}
                      onChange={e => setNewQuest({ ...newQuest, type: e.target.value as QuestType })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                    >
                      {activeTab === 'quests' ? (
                        <>
                          <option value="daily_sessions">Daily Sessions</option>
                          <option value="weekly_sessions">Weekly Sessions</option>
                          <option value="monthly_sessions">Monthly Sessions</option>
                        </>
                      ) : (
                        <>
                          <option value="total_sessions">Total Sessions</option>
                          <option value="consecutive_days">Consecutive Days</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Amount</label>
                    <input
                      type="number"
                      min="1"
                      value={newQuest.target}
                      onChange={e => setNewQuest({ ...newQuest, target: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Required Talent (Optional)</label>
                  <select
                    value={newQuest.talentRequired || ''}
                    onChange={e => setNewQuest({ ...newQuest, talentRequired: e.target.value || undefined })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">None</option>
                    <option value="a1">Mind Lubrication (A1)</option>
                    <option value="a2">Flow Experience α (A2)</option>
                    <option value="a3">Perfect Theory (A3)</option>
                    <option value="b1">Alchemy (B1)</option>
                    <option value="b2">Flow Experience β (B2)</option>
                    <option value="b3">Bounty Decree (B3)</option>
                    <option value="c1">Extra Chance (C1)</option>
                    <option value="c2">Shuffler (C2)</option>
                    <option value="c3">Critical Intuition (C3)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Rewards</h5>
                    <button 
                      onClick={addReward}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Reward
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {(newQuest.rewards || []).map((reward, idx) => (
                      <div key={idx} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 space-y-3">
                        <div className="flex items-center gap-2">
                          <select 
                            value={reward.type}
                            onChange={e => updateReward(idx, 'type', e.target.value as any)}
                            className="flex-grow bg-slate-900 text-sm text-white border-slate-700 rounded-lg px-2 py-1.5"
                          >
                            <option value="coins">Coins</option>
                            <option value="xp">XP</option>
                            <option value="talentPoint">Talent Points</option>
                            <option value="item">Item</option>
                            <option value="text">Custom Text</option>
                          </select>
                          <input 
                            type="number"
                            value={reward.amount}
                            onChange={e => updateReward(idx, 'amount', parseInt(e.target.value) || 0)}
                            className="w-24 bg-slate-900 text-sm text-white border-slate-700 rounded-lg px-2 py-1.5"
                            placeholder="Amt"
                          />
                          <button onClick={() => removeReward(idx)} className="p-1.5 text-slate-500 hover:text-red-400"><X size={16} /></button>
                        </div>
                        {reward.type === 'item' && (
                          <div className="grid grid-cols-2 gap-2">
                            <select 
                              value={reward.itemType}
                              onChange={e => updateReward(idx, 'itemType', e.target.value as any)}
                              className="bg-slate-900 text-xs text-white border-slate-700 rounded-lg px-2 py-1.5"
                            >
                              <option value="talent_shard">Talent Shard</option>
                              <option value="death_defying_medal">Medal</option>
                              <option value="double_xp">Double XP</option>
                              <option value="double_coin">Double Coin</option>
                            </select>
                            <input 
                              type="text"
                              placeholder="Item Name"
                              value={reward.itemName}
                              onChange={e => updateReward(idx, 'itemName', e.target.value)}
                              className="bg-slate-900 text-xs text-white border-slate-700 rounded-lg px-2 py-1.5"
                            />
                          </div>
                        )}
                        {reward.type === 'text' && (
                          <input 
                            type="text"
                            placeholder="Reward Message"
                            value={reward.rewardText}
                            onChange={e => updateReward(idx, 'rewardText', e.target.value)}
                            className="w-full bg-slate-900 text-xs text-white border-slate-700 rounded-lg px-2 py-1.5"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  onClick={() => { setIsAdding(false); setIsEditing(null); }} 
                  className="px-4 py-2 text-slate-400 font-bold hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                >
                  {isEditing ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {filteredQuests.map((quest, index) => (
          <div key={quest.id} className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-slate-700 transition-all">
            <div className="flex items-start sm:items-center gap-6">
              <div className={cn(
                "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105",
                quest.completed ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-800 border-slate-700 text-slate-500"
              )}>
                {quest.completed ? <CheckCircle2 size={24} /> : (quest.isAchievement ? <Trophy size={24} /> : <Target size={24} />)}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h4 className="font-black text-white text-base sm:text-lg uppercase italic tracking-tight pr-2">{quest.title}</h4>
                  {quest.talentRequired && <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] uppercase tracking-widest rounded-lg font-black border border-indigo-500/30 shrink-0">Talents</span>}
                </div>
                <p className="text-sm text-slate-400 font-medium line-clamp-2">{quest.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  {quest.reward && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/50 rounded-xl text-[10px] font-bold text-slate-300 border border-slate-800/50 uppercase tracking-widest">
                      {quest.reward.type === 'coins' ? <Coins size={12} className="text-amber-400" /> : 
                       quest.reward.type === 'xp' ? <Zap size={12} className="text-indigo-400" /> :
                       quest.reward.type === 'talentPoint' ? <Trophy size={12} className="text-purple-400" /> :
                       <Gift size={12} className="text-indigo-400" />}
                      <span>
                        {quest.reward.type === 'text' ? quest.reward.rewardText : 
                         quest.reward.type === 'talentPoint' ? `${quest.reward.amount} PT` :
                         `${quest.reward.amount} ${quest.reward.type === 'item' ? (quest.reward.itemName || 'Item') : quest.reward.type}`}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 sm:w-32 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className={cn("h-full transition-all shadow-[0_0_8px_rgba(99,102,241,0.4)]", quest.completed ? "bg-emerald-500" : "bg-indigo-500")}
                        style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{quest.progress} / {quest.target}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end sm:justify-start gap-3 shrink-0">
              {quest.completed && !quest.claimed ? (
                <button
                  onClick={() => onClaimReward(quest.id)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                >
                  <Gift size={16} />
                  Claim Reward
                </button>
              ) : (quest.completed && quest.claimed) ? (
                <span className="flex items-center">
                  <CheckSquare size={24} className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </span>
              ) : (
                <span className="flex items-center">
                  <Square size={24} className="text-slate-600" />
                </span>
              )}
              
              {isEditMode && (
                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all ml-2">
                  <div className="flex items-center gap-1 bg-slate-950/50 p-1 rounded-xl border border-slate-800">
                    <button onClick={() => handleReorder(index, 'up')} disabled={index === 0} className="p-1.5 text-slate-500 hover:text-indigo-400 disabled:opacity-30 transition-colors"><ChevronUp size={16} /></button>
                    <button onClick={() => handleReorder(index, 'down')} disabled={index === filteredQuests.length - 1} className="p-1.5 text-slate-500 hover:text-indigo-400 disabled:opacity-30 transition-colors"><ChevronDown size={16} /></button>
                  </div>
                  <button 
                    onClick={() => {
                      setIsEditing(quest);
                      setNewQuest(quest);
                    }}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-700"
                    title="Edit Task"
                  >
                    <Edit2 size={16} />
                  </button>
                  {!quest.talentRequired && (
                    <button 
                      onClick={() => handleDelete(quest.id)}
                      className="p-2.5 bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 rounded-xl transition-all border border-slate-700"
                      title="Delete Task"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredQuests.length === 0 && (
          <div className="text-center py-12 text-slate-500 font-medium">
            No {activeTab} found. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
});
