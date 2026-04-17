import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dungeon, MajorDungeon, DungeonReward } from '../types';
import { Plus, Target, Sword, CheckCircle2, ChevronRight, Trash2, FolderPlus, Folder, ChevronDown, ChevronUp, Gift, X, Edit2, Coins, Zap, Trophy, HelpCircle } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { cn } from '../lib/utils';

interface DungeonManagerProps {
  dungeons: Dungeon[];
  majorDungeons: MajorDungeon[];
  currentDungeonId: string | null;
  isAddingMajor: boolean;
  setIsAddingMajor: (val: boolean) => void;
  onSelect: (id: string) => void;
  onCreateMajor: (name: string, description: string, rewards?: DungeonReward[]) => void;
  onCreateSub: (dungeon: Omit<Dungeon, 'id' | 'completedSessions' | 'status'>) => void;
  onUpdateMajor: (id: string, updates: Partial<MajorDungeon>) => void;
  onUpdateSub: (id: string, updates: Partial<Dungeon>) => void;
  onDeleteMajor: (id: string) => void;
  onDeleteSub: (id: string) => void;
  onReorderMajor: (id: string, direction: 'up' | 'down') => void;
  onReorderSub: (id: string, direction: 'up' | 'down') => void;
  onFinalizeMajor: (id: string) => void;
}

export const DungeonManager = React.memo<DungeonManagerProps>(({
  dungeons,
  majorDungeons,
  currentDungeonId,
  isAddingMajor,
  setIsAddingMajor,
  onSelect,
  onCreateMajor,
  onCreateSub,
  onUpdateMajor,
  onUpdateSub,
  onDeleteMajor,
  onDeleteSub,
  onReorderMajor,
  onReorderSub,
  onFinalizeMajor
}) => {
  const [isAddingSub, setIsAddingSub] = useState<{ parentId: string } | null>(null);
  const [editingMajor, setEditingMajor] = useState<MajorDungeon | null>(null);
  const [editingSub, setEditingSub] = useState<Dungeon | null>(null);
  const [expandedMajors, setExpandedMajors] = useState<string[]>([]);
  const [deletingDungeon, setDeletingDungeon] = useState<{ id: string, name: string, isMajor: boolean } | null>(null);

  const [newMajor, setNewMajor] = useState({ name: '', description: '', rewards: [] as DungeonReward[] });
  const [newSub, setNewSub] = useState({
    name: '',
    description: '',
    totalSessions: 10,
    rewardCoins: 0,
    rewardXP: 0,
    rewardText: '',
    rewards: [] as DungeonReward[],
    isLongTerm: false
  });

  React.useEffect(() => {
    if (isAddingMajor && !editingMajor) {
      setNewMajor({ name: '', description: '', rewards: [] });
    }
  }, [isAddingMajor, editingMajor]);

  const addReward = (isMajor: boolean = false) => {
    if (isMajor) {
      if (editingMajor) {
        setEditingMajor({ ...editingMajor, rewards: [...(editingMajor.rewards || []), { type: 'coins', amount: 1 }] });
      } else {
        setNewMajor({ ...newMajor, rewards: [...newMajor.rewards, { type: 'coins', amount: 1 }] });
      }
    } else {
      if (editingSub) {
        setEditingSub({ ...editingSub, rewards: [...(editingSub.rewards || []), { type: 'coins', amount: 1 }] });
      } else {
        setNewSub({ ...newSub, rewards: [...newSub.rewards, { type: 'coins', amount: 1 }] });
      }
    }
  };

  const removeReward = (index: number, isMajor: boolean = false) => {
    if (isMajor) {
      if (editingMajor) {
        setEditingMajor({ ...editingMajor, rewards: editingMajor.rewards?.filter((_, i) => i !== index) });
      } else {
        setNewMajor({ ...newMajor, rewards: newMajor.rewards.filter((_, i) => i !== index) });
      }
    } else {
      if (editingSub) {
        setEditingSub({ ...editingSub, rewards: editingSub.rewards?.filter((_, i) => i !== index) });
      } else {
        setNewSub({ ...newSub, rewards: newSub.rewards.filter((_, i) => i !== index) });
      }
    }
  };

  const updateReward = (index: number, field: keyof DungeonReward, value: any, isMajor: boolean = false) => {
    if (isMajor) {
      if (editingMajor) {
        const updated = [...(editingMajor.rewards || [])];
        updated[index] = { ...updated[index], [field]: value };
        setEditingMajor({ ...editingMajor, rewards: updated });
      } else {
        const updated = [...newMajor.rewards];
        updated[index] = { ...updated[index], [field]: value };
        setNewMajor({ ...newMajor, rewards: updated });
      }
    } else {
      if (editingSub) {
        const updated = [...(editingSub.rewards || [])];
        updated[index] = { ...updated[index], [field]: value };
        setEditingSub({ ...editingSub, rewards: updated });
      } else {
        const updated = [...newSub.rewards];
        updated[index] = { ...updated[index], [field]: value };
        setNewSub({ ...newSub, rewards: updated });
      }
    }
  };

  const toggleMajor = (id: string) => {
    setExpandedMajors(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const activeDungeon = dungeons.find(d => d.id === currentDungeonId);

  return (
    <div className="space-y-8">
      {/* Active Dungeon Progress */}
      {activeDungeon && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Sword size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/20">
                  <Sword size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Active Dungeon</p>
                  <h3 className="text-2xl font-black text-white tracking-tight italic uppercase pr-2">{activeDungeon.name}</h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Progress</p>
                <p className="text-3xl font-black text-white leading-none">{Math.round((activeDungeon.completedSessions / activeDungeon.totalSessions) * 100)}%</p>
              </div>
            </div>
            
            <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800/50">
              <div className="relative h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(activeDungeon.completedSessions / activeDungeon.totalSessions) * 100}%` }}
                  className="absolute top-0 left-0 h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{activeDungeon.completedSessions} Rooms Cleared</span>
                  <div className="w-1 h-1 rounded-full bg-slate-700" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{activeDungeon.totalSessions} Total Rooms</span>
                </div>
                <button 
                  onClick={() => onSelect(activeDungeon.id)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-slate-700"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {(editingMajor || editingSub || isAddingMajor) && (
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
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {isAddingMajor ? 'Create Major Dungeon' : `Edit ${editingMajor ? 'Major' : 'Sub'} Dungeon`}
                </h3>
                <button onClick={() => { setEditingMajor(null); setEditingSub(null); setIsAddingMajor(false); }} className="text-slate-500 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Name</label>
                    <input
                      type="text"
                      value={isAddingMajor ? newMajor.name : (editingMajor ? editingMajor.name : editingSub?.name || '')}
                      onChange={e => {
                        if (isAddingMajor) setNewMajor({ ...newMajor, name: e.target.value });
                        else if (editingMajor) setEditingMajor({ ...editingMajor, name: e.target.value });
                        else if (editingSub) setEditingSub({ ...editingSub, name: e.target.value });
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                      placeholder={isAddingMajor ? "Major Dungeon Name (e.g., IELTS Mastery)" : ""}
                    />
                  </div>
                  {editingSub && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Rooms</label>
                      <input
                        type="number"
                        value={editingSub.totalSessions}
                        onChange={e => setEditingSub({ ...editingSub, totalSessions: parseInt(e.target.value) || 1 })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}
                  {(editingMajor || isAddingMajor || editingSub) && (
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
                      <input
                        type="text"
                        value={isAddingMajor ? newMajor.description : (editingMajor ? editingMajor.description : editingSub?.description || '') || ''}
                        onChange={e => {
                          if (isAddingMajor) setNewMajor({ ...newMajor, description: e.target.value });
                          else if (editingMajor) setEditingMajor({ ...editingMajor, description: e.target.value });
                          else if (editingSub) setEditingSub({ ...editingSub, description: e.target.value });
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                        placeholder={isAddingMajor ? "Description" : "Optional description"}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {editingMajor && dungeons.some(d => d.parentId === editingMajor.id) && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-amber-400">
                        <Target size={18} />
                        <span className="text-sm font-bold uppercase tracking-wider">Finalization Check</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Once finalized, you cannot add more sub-dungeons or edit rewards. 
                        Major rewards are only granted if the dungeon is finalized before completion.
                      </p>
                      <button
                        onClick={() => {
                          onFinalizeMajor(editingMajor.id);
                          setEditingMajor(null);
                        }}
                        className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg text-xs font-bold uppercase transition-all border border-amber-500/30"
                      >
                        Finalize Now
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Completion Rewards</h5>
                    <button 
                      onClick={() => addReward(isAddingMajor || !!editingMajor)}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Reward
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {(isAddingMajor ? newMajor.rewards : (editingMajor?.rewards || editingSub?.rewards || [])).map((reward, idx) => (
                      <div key={idx} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 space-y-3">
                        <div className="flex items-center gap-2">
                          <select 
                            value={reward.type}
                            onChange={e => updateReward(idx, 'type', e.target.value, isAddingMajor || !!editingMajor)}
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
                            onChange={e => updateReward(idx, 'amount', parseInt(e.target.value) || 0, isAddingMajor || !!editingMajor)}
                            className="w-24 bg-slate-900 text-sm text-white border-slate-700 rounded-lg px-2 py-1.5"
                            placeholder="Amt"
                          />
                          <button onClick={() => removeReward(idx, isAddingMajor || !!editingMajor)} className="p-1.5 text-slate-500 hover:text-red-400"><X size={16} /></button>
                        </div>
                        {reward.type === 'item' && (
                          <div className="grid grid-cols-2 gap-2">
                            <select 
                              value={reward.itemType}
                              onChange={e => updateReward(idx, 'itemType', e.target.value, isAddingMajor || !!editingMajor)}
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
                              onChange={e => updateReward(idx, 'itemName', e.target.value, isAddingMajor || !!editingMajor)}
                              className="bg-slate-900 text-xs text-white border-slate-700 rounded-lg px-2 py-1.5"
                            />
                          </div>
                        )}
                        {reward.type === 'text' && (
                          <input 
                            type="text"
                            placeholder="Reward Message"
                            value={reward.rewardText}
                            onChange={e => updateReward(idx, 'rewardText', e.target.value, isAddingMajor || !!editingMajor)}
                            className="w-full bg-slate-900 text-xs text-white border-slate-700 rounded-lg px-2 py-1.5"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button onClick={() => { setEditingMajor(null); setEditingSub(null); setIsAddingMajor(false); }} className="px-4 py-2 text-slate-400 font-bold hover:text-white transition-colors">Cancel</button>
                <button 
                  onClick={() => {
                    if (isAddingMajor) {
                      onCreateMajor(newMajor.name, newMajor.description, newMajor.rewards);
                      setIsAddingMajor(false);
                    } else if (editingMajor) {
                      onUpdateMajor(editingMajor.id, { name: editingMajor.name, description: editingMajor.description, rewards: editingMajor.rewards });
                      setEditingMajor(null);
                    } else if (editingSub) {
                      onUpdateSub(editingSub.id, { name: editingSub.name, description: editingSub.description, totalSessions: editingSub.totalSessions, rewards: editingSub.rewards });
                      setEditingSub(null);
                    }
                  }}
                  className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                >
                  {isAddingMajor ? 'Create Dungeon' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}


      </AnimatePresence>

      <div className="space-y-4">
        {majorDungeons.length === 0 && dungeons.filter(d => !d.parentId).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 bg-slate-900/30 rounded-[3rem] border border-slate-800 border-dashed">
            <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6 text-slate-700 border border-slate-800">
              <Sword size={48} />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tight">No Dungeons Found</h3>
            <p className="text-slate-500 text-center max-w-xs text-sm font-medium">Your journey is just beginning. Create your first major dungeon to start tracking your progress!</p>
          </div>
        ) : (
          majorDungeons.map(major => (
            <div key={major.id} className="bg-slate-900/40 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all group">
              <div 
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
                onClick={() => toggleMajor(major.id)}
              >
                <div className="flex items-start sm:items-center space-x-4">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/10 group-hover:scale-110 transition-transform shrink-0">
                    <Folder size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-white tracking-tight truncate pr-2">{major.name}</h3>
                      {major.isFinalized && (
                        <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-lg border border-indigo-500/30 uppercase tracking-widest shrink-0">
                          Finalized
                        </span>
                      )}
                      {major.status === 'completed' && (
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 shrink-0">
                          Cleared
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 font-medium line-clamp-2">{major.description}</p>
                    
                    {major.rewards && major.rewards.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {major.rewards.map((r, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-1 bg-slate-950/50 rounded-xl text-[10px] font-bold text-slate-300 border border-slate-800/50 uppercase tracking-widest">
                            {r.type === 'coins' ? <Coins size={12} className="text-amber-400" /> : 
                             r.type === 'xp' ? <Zap size={12} className="text-indigo-400" /> :
                             r.type === 'talentPoint' ? <Trophy size={12} className="text-purple-400" /> :
                             <Gift size={12} className="text-indigo-400" />}
                            <span>
                              {r.type === 'text' ? r.rewardText : 
                               r.type === 'talentPoint' ? `${r.amount} PT` :
                               `${r.amount} ${r.type === 'item' ? (r.itemName || 'Item') : r.type}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-end sm:justify-start gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-slate-950/50 p-1 rounded-lg border border-slate-800">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onReorderMajor(major.id, 'up'); }} 
                      className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-slate-800 rounded-md transition-all"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onReorderMajor(major.id, 'down'); }} 
                      className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-slate-800 rounded-md transition-all"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {!major.status || major.status !== 'completed' ? (
                      major.isFinalized ? (
                        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20 cursor-not-allowed" title="Finalized dungeons cannot be edited">
                          <CheckCircle2 size={16} />
                        </div>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingMajor(major); }}
                          className="p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all border border-slate-700"
                          title="Edit Major Dungeon"
                        >
                          <Edit2 size={16} />
                        </button>
                      )
                    ) : (
                      <div className="p-2 bg-slate-800/30 text-slate-600 rounded-lg border border-slate-800/50 cursor-not-allowed" title="Completed tasks cannot be edited">
                        <Edit2 size={16} />
                      </div>
                    )}
                    
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (major.isFinalized) return;
                        setDeletingDungeon({ id: major.id, name: major.name, isMajor: true });
                      }}
                      className={cn(
                        "p-2 rounded-lg transition-all border",
                        major.isFinalized 
                          ? "bg-slate-800/30 text-slate-600 border-slate-800/50 cursor-not-allowed" 
                          : "bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 border-slate-700"
                      )}
                      title="Delete Major Dungeon"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="p-1 text-slate-600 group-hover:text-indigo-400 transition-colors ml-2">
                    <ChevronDown size={20} className={cn("transition-transform duration-300", expandedMajors.includes(major.id) ? "rotate-180" : "")} />
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedMajors.includes(major.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4"
                  >
                    {isAddingSub?.parentId === major.id && (
                      <div className="bg-slate-800/50 p-4 sm:p-6 rounded-2xl border border-indigo-500/20 space-y-4 mb-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-bold text-indigo-400 uppercase tracking-widest">New Sub Dungeon</h4>
                          <button onClick={() => setIsAddingSub(null)} className="text-slate-500 hover:text-white sm:hidden"><X size={16} /></button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Dungeon Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Morning Routine"
                              value={newSub.name}
                              onChange={e => setNewSub({ ...newSub, name: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:border-indigo-500 outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Target Rooms</label>
                            <input
                              type="number"
                              placeholder="Total Sessions"
                              value={newSub.totalSessions}
                              onChange={e => setNewSub({ ...newSub, totalSessions: parseInt(e.target.value) || 1 })}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:border-indigo-500 outline-none"
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
                            <input
                              type="text"
                              placeholder="Optional description"
                              value={newSub.description}
                              onChange={e => setNewSub({ ...newSub, description: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:border-indigo-500 outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="text-[10px] sm:text-sm font-bold text-slate-500 uppercase tracking-widest">Completion Rewards</h5>
                            <button 
                              onClick={() => addReward(false)}
                              className="text-[10px] sm:text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                            >
                              <Plus size={12} /> Add Reward
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {newSub.rewards.map((reward, idx) => (
                              <div key={idx} className="bg-slate-900/50 p-3 rounded-xl border border-slate-700 space-y-3 relative">
                                <button onClick={() => removeReward(idx)} className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-1">
                                  <X size={14} />
                                </button>
                                <div className="space-y-2">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase">Reward Type</label>
                                    <select 
                                      value={reward.type}
                                      onChange={e => updateReward(idx, 'type', e.target.value)}
                                      className="w-full bg-slate-800 text-xs text-white border-slate-700 rounded-lg px-2 py-1.5 outline-none"
                                    >
                                      <option value="coins">Coins</option>
                                      <option value="xp">XP</option>
                                      <option value="talentPoint">Talent Point</option>
                                      <option value="item">Advanced Item</option>
                                      <option value="text">Custom Text</option>
                                    </select>
                                  </div>

                                  <div className="grid grid-cols-1 gap-2">
                                    {(reward.type === 'coins' || reward.type === 'xp' || reward.type === 'talentPoint' || (reward.type === 'item' && ['talent_shard', 'death_defying_medal', 'xp_bonus_percent', 'coin_bonus_percent'].includes(reward.itemType || ''))) && (
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-slate-500 uppercase">Amount</label>
                                        <input 
                                          type="number"
                                          value={reward.amount}
                                          onChange={e => updateReward(idx, 'amount', parseInt(e.target.value) || 0)}
                                          className="w-full bg-slate-800 text-xs text-white border-slate-700 rounded-lg px-2 py-1.5 outline-none"
                                          placeholder="Amt"
                                        />
                                      </div>
                                    )}

                                    {reward.type === 'item' && (
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-slate-500 uppercase">Item Type</label>
                                        <select 
                                          value={reward.itemType || 'double_xp'}
                                          onChange={e => updateReward(idx, 'itemType', e.target.value)}
                                          className="w-full bg-slate-800 text-xs text-white border-slate-700 rounded-lg px-2 py-1.5 outline-none"
                                        >
                                          <option value="double_xp">Double XP Card</option>
                                          <option value="double_coin">Double Coins Card</option>
                                          <option value="talent_shard">Talent Shard</option>
                                          <option value="death_defying_medal">Death Defying Gold Medal</option>
                                          <option value="xp_bonus_percent">Next XP Bonus %</option>
                                          <option value="coin_bonus_percent">Next Coins Bonus %</option>
                                        </select>
                                      </div>
                                    )}

                                    {reward.type === 'item' && (
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-slate-500 uppercase">Display Name</label>
                                        <input 
                                          type="text"
                                          value={reward.itemName || ''}
                                          onChange={e => updateReward(idx, 'itemName', e.target.value)}
                                          className="w-full bg-slate-800 text-xs text-white border-slate-700 rounded-lg px-2 py-1.5 outline-none"
                                          placeholder="e.g. Rare Scroll"
                                        />
                                      </div>
                                    )}

                                    {reward.type === 'text' && (
                                      <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-slate-500 uppercase">Custom Reward Text</label>
                                        <input 
                                          type="text"
                                          value={reward.rewardText || ''}
                                          onChange={e => updateReward(idx, 'rewardText', e.target.value)}
                                          className="w-full bg-slate-800 text-xs text-white border-slate-700 rounded-lg px-2 py-1.5 outline-none"
                                          placeholder="e.g. Watch a movie"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-2">
                          <button onClick={() => setIsAddingSub(null)} className="hidden sm:block px-4 py-2 text-slate-400 text-sm">Cancel</button>
                          <button 
                            onClick={() => { 
                              onCreateSub({ ...newSub, parentId: major.id }); 
                              setIsAddingSub(null);
                              setNewSub({
                                name: '',
                                description: '',
                                totalSessions: 10,
                                rewardCoins: 0,
                                rewardXP: 0,
                                rewardText: '',
                                rewards: [],
                                isLongTerm: false
                              });
                            }}
                            className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-indigo-500/20"
                          >
                            Add Sub Dungeon
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 sm:space-y-4">
                      {(() => {
                        const subs = dungeons.filter(d => d.parentId === major.id);
                        const allDone = subs.length > 0 && subs.every(s => s.status === 'completed');
                        if (allDone && !major.isFinalized && major.status !== 'completed') {
                          return (
                            <div className="p-3 sm:p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3">
                              <Target size={16} className="text-amber-400 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-bold text-amber-400">All rooms cleared, but rewards are pending!</p>
                                <p className="text-[10px] sm:text-xs text-slate-400">Please finalize this Major Dungeon in the settings (edit icon) to claim your rewards and lock the dungeon.</p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                      {dungeons.filter(d => d.parentId === major.id).map(sub => (
                        <motion.div
                          key={sub.id}
                          whileHover={{ scale: 1.005 }}
                          className={cn(
                            "p-4 sm:p-6 rounded-3xl border transition-all cursor-pointer group",
                            currentDungeonId === sub.id 
                              ? "bg-indigo-500/10 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.1)]" 
                              : "bg-slate-950/30 border-slate-800 hover:border-slate-700"
                          )}
                          onClick={() => onSelect(sub.id)}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className={cn(
                                "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border transition-all shrink-0",
                                sub.status === 'completed' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                                currentDungeonId === sub.id ? "bg-indigo-500 text-white border-indigo-400" : "bg-slate-800 border-slate-700 text-slate-500"
                              )}>
                                {sub.status === 'completed' ? <CheckCircle2 size={20} /> : <Target size={20} />}
                              </div>
                              <div>
                                <span className={cn(
                                  "font-black text-sm sm:text-base uppercase italic tracking-tight transition-colors block truncate max-w-[150px] sm:max-w-none pr-2",
                                  sub.status === 'completed' ? "text-slate-600 line-through" : "text-white"
                                )}>{sub.name}</span>
                                {sub.description && (
                                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium line-clamp-2 mt-0.5 pr-2">
                                    {sub.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sub.completedSessions}/{sub.totalSessions} Rooms</span>
                                  {sub.status === 'completed' && (
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                                      Cleared
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {currentDungeonId === sub.id && (
                                <span className="px-2 py-1 bg-indigo-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg animate-pulse shadow-lg shadow-indigo-500/20">Active</span>
                              )}
                              
                              <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                                <div className="flex items-center gap-1 bg-slate-950/50 p-1 rounded-xl border border-slate-800">
                                  <button onClick={(e) => { e.stopPropagation(); onReorderSub(sub.id, 'up'); }} className="text-slate-500 hover:text-indigo-400 p-1.5 transition-colors"><ChevronUp size={14} /></button>
                                  <button onClick={(e) => { e.stopPropagation(); onReorderSub(sub.id, 'down'); }} className="text-slate-500 hover:text-indigo-400 p-1.5 transition-colors"><ChevronDown size={14} /></button>
                                </div>
                                
                                {sub.status !== 'completed' ? (
                                  major.isFinalized ? (
                                    <div className="p-2 text-slate-700 cursor-not-allowed" title="Parent dungeon is finalized">
                                      <Edit2 size={16} />
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setEditingSub(sub); }}
                                      className="p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all border border-slate-700"
                                      title="Edit Sub Dungeon"
                                    >
                                      <Edit2 size={16} />
                                    </button>
                                  )
                                ) : (
                                  <div className="p-2 bg-slate-800/30 text-slate-700 rounded-xl border border-slate-800/50 cursor-not-allowed" title="Completed tasks cannot be edited">
                                    <Edit2 size={16} />
                                  </div>
                                )}
                                
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setDeletingDungeon({ id: sub.id, name: sub.name, isMajor: false }); }}
                                  className="p-2 bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 rounded-xl transition-all border border-slate-700"
                                  title="Delete Sub Dungeon"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden mb-4 border border-slate-800">
                            <div 
                              className={cn("h-full transition-all shadow-[0_0_8px_rgba(99,102,241,0.4)]", sub.status === 'completed' ? "bg-emerald-500" : "bg-indigo-500")}
                              style={{ width: `${(sub.completedSessions/sub.totalSessions)*100}%` }}
                            />
                          </div>
                          
                          {sub.rewards && sub.rewards.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800/50">
                              {sub.rewards.map((r, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1 bg-slate-950/50 rounded-xl text-[10px] font-bold text-slate-300 border border-slate-800/50 uppercase tracking-widest">
                                  {r.type === 'coins' ? <Coins size={12} className="text-amber-400" /> : 
                                   r.type === 'xp' ? <Zap size={12} className="text-indigo-400" /> :
                                   r.type === 'talentPoint' ? <Trophy size={12} className="text-purple-400" /> :
                                   <Gift size={12} className="text-indigo-400" />}
                                  <span className="truncate max-w-[100px] sm:max-w-none">
                                    {r.type === 'text' ? r.rewardText : 
                                     r.type === 'talentPoint' ? `${r.amount} PT` :
                                     `${r.amount} ${r.type === 'item' ? (r.itemName || 'Item') : r.type}`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                      {!major.isFinalized && major.status !== 'completed' && isAddingSub?.parentId !== major.id && (
                        <button
                          onClick={() => setIsAddingSub({ parentId: major.id })}
                          className="w-full py-4 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-[2rem] text-slate-500 hover:text-indigo-400 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs"
                        >
                          <Plus size={16} />
                          Add Sub Dungeon
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}

        {/* Uncategorized Dungeons */}
        {dungeons.filter(d => !d.parentId).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
              <Sword size={16} />
              <span>Independent Dungeons</span>
            </h3>
            <div className="space-y-4">
              {dungeons.filter(d => !d.parentId).map(d => (
                <div 
                  key={d.id}
                  onClick={() => onSelect(d.id)}
                  className={cn(
                    "p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group",
                    currentDungeonId === d.id ? "bg-indigo-500/10 border-indigo-500" : "bg-slate-900 border-slate-800"
                  )}
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        currentDungeonId === d.id ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-500"
                      )}>
                        <Sword size={16} />
                      </div>
                      <h4 className="font-bold text-white text-sm sm:text-base">{d.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteSub(d.id); }} 
                        className="text-slate-600 hover:text-red-400 p-1 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3 sm:mb-4">
                    <div className="h-full bg-indigo-500" style={{ width: `${(d.completedSessions/d.totalSessions)*100}%` }} />
                  </div>

                  {d.rewards && d.rewards.length > 0 && (
                    <div className="space-y-1 border-t border-slate-800 pt-3">
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Rewards</p>
                      <div className="flex flex-wrap gap-1">
                        {d.rewards.map((r, i) => (
                          <div key={i} className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-800 rounded text-[9px] text-slate-300 border border-slate-700/50">
                            {r.type === 'coins' ? <Coins size={10} className="text-amber-400" /> : 
                             r.type === 'xp' ? <Zap size={10} className="text-indigo-400" /> :
                             r.type === 'talentPoint' ? <Trophy size={10} className="text-purple-400" /> :
                             <Gift size={10} className="text-indigo-400" />}
                            <span>
                              {r.type === 'text' ? r.rewardText : 
                               r.type === 'talentPoint' ? `${r.amount} PT` :
                               `${r.amount} ${r.type === 'item' ? (r.itemName || 'Item') : r.type}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {deletingDungeon && (
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
              className="bg-slate-900 border border-red-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-3 text-red-400">
                <Trash2 size={24} />
                <h3 className="text-xl font-bold">Delete Dungeon</h3>
              </div>
              <p className="text-slate-300">
                Are you sure you want to delete <span className="font-bold text-white">{deletingDungeon.name}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setDeletingDungeon(null)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button 
                  onClick={() => {
                    if (deletingDungeon.isMajor) {
                      onDeleteMajor(deletingDungeon.id);
                    } else {
                      onDeleteSub(deletingDungeon.id);
                    }
                    setDeletingDungeon(null);
                  }}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
