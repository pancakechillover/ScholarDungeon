import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'motion/react';
import { Quest, QuestType, QuestReward, QuestHistoryItem } from '../types';
import { Target, Trophy, Plus, Trash2, Edit2, CheckCircle2, ChevronDown, ChevronUp, X, Gift, Coins, Zap, CheckSquare, Square, GripVertical, Pin, Clock, History } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { cn } from '../lib/utils';
import { SpinnerInput } from './SpinnerInput';

const DraggableQuestItem = ({ quest, isEditMode, children, className }: any) => {
  const controls = useDragControls();
  
  // Deterministic "random" rotation based on ID
  const rotation = React.useMemo(() => {
    const hash = quest.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    return (hash % 4) - 2; // -2 to 1 degrees
  }, [quest.id]);

  return (
    <Reorder.Item 
      value={quest} 
      dragListener={false} 
      dragControls={controls} 
      className={cn(className, "relative")}
      style={{ rotate: isEditMode ? 0 : `${rotation}deg` }}
      whileDrag={{ 
        scale: 1.05, 
        rotate: 0,
        zIndex: 50,
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.3)"
      }}
    >
      {/* Pin decoration */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 text-rose-600 drop-shadow-md">
        <Pin size={20} fill="currentColor" strokeWidth={1} className="-rotate-12" />
      </div>

      {isEditMode && (
        <div 
          className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing touch-none p-2 flex items-center justify-center shrink-0 text-slate-500 hover:text-slate-800 transition-colors z-20"
          onPointerDown={(e) => controls.start(e)}
        >
          <GripVertical size={20} />
        </div>
      )}
      {children}
    </Reorder.Item>
  );
};

interface QuestManagerProps {
  quests: Quest[];
  questHistory: QuestHistoryItem[];
  activeTalents: string[];
  isAdding: boolean;
  setIsAdding: (val: boolean) => void;
  onUpdateQuests: (quests: Quest[]) => void;
  onClaimReward: (id: string) => void;
  forceTab?: 'quests' | 'achievements' | 'history';
  isEditMode?: boolean;
}

export const QuestManager = React.memo<QuestManagerProps>(({ quests, questHistory, activeTalents, isAdding, setIsAdding, onUpdateQuests, onClaimReward, forceTab, isEditMode = false }) => {
  const [activeTab, setActiveTab] = useState<'quests' | 'achievements' | 'history'>(forceTab || 'quests');
  const [historyFilter, setHistoryFilter] = useState<'today' | 'week' | 'all'>('all');

  React.useEffect(() => {
    if (forceTab) {
      setActiveTab(forceTab);
    }
  }, [forceTab]);

  const filteredHistory = React.useMemo(() => {
    if (activeTab !== 'history') return [];
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const lastWeek = today - 7 * 24 * 60 * 60 * 1000;

    return questHistory.filter(item => {
      const itemTime = new Date(item.timestamp).getTime();
      if (historyFilter === 'today') return itemTime >= today;
      if (historyFilter === 'week') return itemTime >= lastWeek;
      return true;
    });
  }, [questHistory, historyFilter, activeTab]);
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

  const filteredQuests = quests
    .filter(q => q.isAchievement === (activeTab === 'achievements'))
    .filter(q => !q.talentRequired || activeTalents.includes(q.talentRequired))
    .sort((a, b) => a.order - b.order);

  const getCycleLabel = (type: QuestType) => {
    switch (type) {
      case 'daily_sessions': return 'Daily';
      case 'weekly_sessions': return 'Weekly';
      case 'monthly_sessions': return 'Monthly';
      case 'consecutive_days': return 'Daily';
      case 'total_sessions': return 'Achievement';
      default: return 'Special';
    }
  };

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
        {(isAdding || isEditing) && activeTab !== 'history' && (
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
                    <SpinnerInput
                      min={1}
                      value={newQuest.target}
                      onChange={(val) => setNewQuest({ ...newQuest, target: typeof val === 'number' ? Math.max(1, val) : 1 })}
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
                          <SpinnerInput 
                            value={reward.amount}
                            onChange={(val) => updateReward(idx, 'amount', typeof val === 'number' ? val : 0)}
                            className="w-24 text-sm"
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

      <div className="relative p-6 sm:p-10 rounded-2xl qb-board border border-indigo-100 dark:border-slate-800">
        {activeTab === 'history' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Filter By:</span>
              {(['today', 'week', 'all'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setHistoryFilter(f)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all",
                    historyFilter === f 
                      ? "bg-indigo-600 text-white shadow-md" 
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  )}
                >
                  {f === 'today' ? 'Today' : f === 'week' ? 'Last 7 Days' : 'All Time'}
                </button>
              ))}
            </div>

            {filteredHistory.map((item) => (
              <div 
                key={item.id}
                className="paper-texture border border-slate-200 rounded-sm p-4 flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 qb-dark-box",
                    item.isAchievement ? "border-amber-500" : "border-slate-700"
                  )}>
                    {item.isAchievement ? <Trophy size={20} className="text-amber-400" /> : <History size={20} className="text-emerald-400" />}
                  </div>
                  <div>
                    <h4 className="font-serif font-black text-slate-900 text-base leading-tight">{item.title}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold mt-1">
                      <Clock size={10} />
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.rewards.map((r, i) => (
                    <div key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-700">
                      {r.type === 'coins' ? <Coins size={10} className="text-amber-600" /> : <Zap size={10} className="text-indigo-600" />}
                      <span>{r.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {filteredHistory.length === 0 && (
              <div className="text-center py-20 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl border border-slate-300 dark:border-slate-700 border-dashed">
                <p className="font-serif italic text-slate-500 text-lg">
                  {historyFilter === 'all' 
                    ? "No chronicles of past tasks yet..." 
                    : historyFilter === 'today' 
                      ? "No deeds recorded today." 
                      : "No records found for the past week."}
                </p>
              </div>
            )}
          </div>
        ) : (
          <Reorder.Group 
            axis="y" 
            values={filteredQuests} 
            onReorder={(newFiltered) => {
              const otherQuests = quests.filter(q => q.isAchievement !== (activeTab === 'achievements') || (q.talentRequired && !activeTalents.includes(q.talentRequired)));
              const merged = [...newFiltered, ...otherQuests];
              merged.forEach((q, i) => q.order = i);
              onUpdateQuests(merged);
            }}
            className="space-y-6 relative z-10"
          >
            {filteredQuests.map((quest, index) => (
              <DraggableQuestItem 
                key={quest.id} 
                quest={quest} 
                isEditMode={isEditMode}
                className={cn(
                  "qb-card border rounded-lg p-5 flex items-center justify-between gap-4 group transition-all shadow-md relative",
                  quest.completed ? "opacity-80 grayscale-[0.4]" : "hover:shadow-xl hover:-translate-y-1"
                )}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center border shrink-0 shadow-sm transition-colors",
                    quest.completed ? "qb-success" : "qb-dark-box"
                  )}>
                    {quest.completed ? <CheckCircle2 size={24} /> : (quest.isAchievement ? <Trophy size={24} /> : <Target size={24} />)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-bold text-base leading-tight truncate">{quest.title}</h4>
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded qb-tag text-[9px] font-bold uppercase tracking-tighter shrink-0 border">
                        <Clock size={10} />
                        {getCycleLabel(quest.type)}
                      </div>
                    </div>
                    <p className="qb-card-desc font-handwriting text-sm font-bold leading-tight line-clamp-2">{quest.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {(quest.rewards || [quest.reward]).map((reward, ridx) => (
                        <div key={ridx} className="flex items-center gap-1 px-2 py-0.5 rounded qb-tag border text-[10px] font-black shadow-sm">
                          {reward.type === 'coins' ? <Coins size={10} className="text-amber-600" /> : <Zap size={10} className="text-indigo-600" />}
                          <span>{reward.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-3 shrink-0">
                  <div className="hidden sm:flex flex-col items-end gap-1 px-3 py-2 bg-white border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-500", quest.completed ? "bg-emerald-500" : "bg-indigo-600")}
                          style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-900 tabular-nums">{quest.progress}/{quest.target}</span>
                    </div>
                    <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest leading-none">Task Progress</span>
                  </div>
                  
                  {isEditMode && (
                    <div className="flex items-center gap-1.5 transition-colors pointer-events-auto">
                      <button 
                        onClick={() => {
                          setIsEditing(quest);
                          setNewQuest(quest);
                        }}
                        className="p-2 bg-white/60 hover:bg-white text-slate-700 rounded-lg transition-all shadow-sm border border-black/5"
                        title="Edit Task"
                      >
                        <Edit2 size={14} />
                      </button>
                      {!quest.talentRequired && (
                        <button 
                          onClick={() => handleDelete(quest.id)}
                          className="p-2 bg-white/60 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shadow-sm border border-black/5"
                          title="Delete Task"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex items-center pointer-events-auto ml-1">
                    {quest.completed && !quest.claimed ? (
                      <button
                        onClick={() => onClaimReward(quest.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-black text-[10px] uppercase tracking-widest transition-all shadow-lg hover:-rotate-1 active:scale-95 flex items-center gap-2"
                      >
                        <Gift size={14} />
                        Claim
                      </button>
                    ) : (quest.completed && quest.claimed) ? (
                      <span className="flex items-center w-6 justify-end">
                        <CheckSquare size={24} className="text-emerald-600 opacity-80" />
                      </span>
                    ) : (
                      <span className="flex items-center w-6 justify-end opacity-20">
                        <Square size={24} className="text-[#3e2723]" />
                      </span>
                    )}
                  </div>
                </div>
              </DraggableQuestItem>
            ))}
            {filteredQuests.length === 0 && (
              <div className="text-center py-20 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl border border-slate-300 dark:border-slate-700 border-dashed">
                <p className="font-serif italic text-slate-500 text-lg">The board is currently barren...</p>
                <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-bold">Post a new task to begin</p>
              </div>
            )}
          </Reorder.Group>
        )}
      </div>
    </div>
  );
});
