import React from 'react';
import { motion } from 'motion/react';
import { 
  Sword, 
  Target, 
  Trophy, 
  Plus, 
  Edit2, 
  Archive 
} from 'lucide-react';
import { PageHeader } from '../PageHeader';
import { DungeonManager } from './DungeonManager';
import { QuestManager } from '../QuestManager';
import { AppState, Dungeon, MajorDungeon, DungeonReward } from '../../types';
import { cn } from '../../lib/utils';

interface DungeonsViewProps {
  state: AppState;
  dungeons: Dungeon[];
  majorDungeons: MajorDungeon[];
  dungeonSubTab: 'list' | 'quests' | 'achievements';
  setDungeonSubTab: (tab: 'list' | 'quests' | 'achievements') => void;
  isDungeonEditMode: boolean;
  setIsDungeonEditMode: (mode: boolean) => void;
  isAddingMajor: boolean;
  setIsAddingMajor: (adding: boolean) => void;
  isAddingQuest: boolean;
  setIsAddingQuest: (adding: boolean) => void;
  isArchiveView: boolean;
  setIsArchiveView: (view: boolean) => void;
  unclaimedQuestsCount: number;
  unclaimedAchievementsCount: number;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  handleCreateMajor: (name: string, description: string, rewards?: DungeonReward[]) => void;
  handleCreateSub: (dungeon: Omit<Dungeon, 'id' | 'completedSessions' | 'status'>) => void;
  handleUpdateMajor: (id: string, updates: Partial<MajorDungeon>) => void;
  handleUpdateSub: (id: string, updates: Partial<Dungeon>) => void;
  handleDeleteMajor: (id: string) => void;
  handleDeleteSub: (id: string) => void;
  reorderMajorDungeon: (id: string, direction: 'up' | 'down') => void;
  reorderSubDungeon: (id: string, direction: 'up' | 'down') => void;
  finalizeMajorDungeon: (id: string) => void;
  archiveMajorDungeon: (id: string) => void;
  forceCompleteSubDungeon: (id: string) => void;
  claimQuestReward: (id: string) => void;
}

export const DungeonsView: React.FC<DungeonsViewProps> = ({
  state,
  dungeons,
  majorDungeons,
  dungeonSubTab,
  setDungeonSubTab,
  isDungeonEditMode,
  setIsDungeonEditMode,
  isAddingMajor,
  setIsAddingMajor,
  isAddingQuest,
  setIsAddingQuest,
  isArchiveView,
  setIsArchiveView,
  unclaimedQuestsCount,
  unclaimedAchievementsCount,
  setState,
  handleCreateMajor,
  handleCreateSub,
  handleUpdateMajor,
  handleUpdateSub,
  handleDeleteMajor,
  handleDeleteSub,
  reorderMajorDungeon,
  reorderSubDungeon,
  finalizeMajorDungeon,
  archiveMajorDungeon,
  forceCompleteSubDungeon,
  claimQuestReward
}) => {
  return (
    <motion.div
      key="dungeons"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full p-6 lg:p-8 space-y-8"
    >
      <PageHeader 
        title={dungeonSubTab === 'list' ? "Dungeon Explorer" : dungeonSubTab === 'quests' ? "Quest Board" : "Achievements"} 
        description={dungeonSubTab === 'list' ? "Manage your study goals" : dungeonSubTab === 'quests' ? "Complete tasks for extra rewards" : "Your legendary milestones"} 
        icon={dungeonSubTab === 'list' ? Sword : dungeonSubTab === 'quests' ? Target : Trophy} 
      >
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setDungeonSubTab('list')}
              className={cn(
                "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2",
                dungeonSubTab === 'list' ? "bg-indigo-500/20 text-indigo-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Sword size={14} className="sm:w-4 sm:h-4" />
              Dungeons
            </button>
            <button
              onClick={() => setDungeonSubTab('quests')}
              className={cn(
                "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 relative",
                dungeonSubTab === 'quests' ? "bg-indigo-500/20 text-indigo-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Target size={14} className="sm:w-4 sm:h-4" />
              Quests
              {unclaimedQuestsCount > 0 && state.questNotificationStyle === 'red_dot' && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-950" />
              )}
            </button>
            <button
              onClick={() => setDungeonSubTab('achievements')}
              className={cn(
                "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 relative",
                dungeonSubTab === 'achievements' ? "bg-amber-500/20 text-amber-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Trophy size={14} className="sm:w-4 sm:h-4" />
              Achievements
              {unclaimedAchievementsCount > 0 && state.questNotificationStyle === 'red_dot' && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-950" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDungeonEditMode(!isDungeonEditMode)}
              className={cn(
                "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl transition-all shadow-lg shrink-0",
                isDungeonEditMode 
                  ? "bg-indigo-600 text-white shadow-indigo-500/20" 
                  : "bg-slate-800 text-slate-400 hover:text-white"
              )}
              title={isDungeonEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
            >
              <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>

            {dungeonSubTab === 'list' && (
              <button
                onClick={() => setIsAddingMajor(true)}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 shrink-0"
                title="CREATE EXPEDITION GOAL"
              >
                <Plus size={18} />
              </button>
            )}
            
            {dungeonSubTab === 'list' && (
              <button
                onClick={() => setIsArchiveView(!isArchiveView)}
                className={cn(
                  "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl transition-all shadow-lg border shrink-0",
                  isArchiveView 
                    ? "bg-amber-600 border-amber-500 text-white" 
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                )}
                title="Toggle Archive"
              >
                <Archive size={18} />
              </button>
            )}

            {dungeonSubTab === 'quests' && (
              <button
                onClick={() => setIsAddingQuest(true)}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 shrink-0"
                title="Add Quest"
              >
                <Plus size={18} />
              </button>
            )}

            {dungeonSubTab === 'achievements' && (
              <button
                onClick={() => setIsAddingQuest(true)}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all shadow-lg shadow-amber-500/20 shrink-0"
                title="Add Achievement"
              >
                <Plus size={18} />
              </button>
            )}
          </div>
        </div>
      </PageHeader>

      {dungeonSubTab === 'list' ? (
        <DungeonManager 
          dungeons={dungeons}
          majorDungeons={majorDungeons}
          currentDungeonId={state.currentDungeonId}
          isAddingMajor={isAddingMajor}
          setIsAddingMajor={setIsAddingMajor}
          isEditMode={isDungeonEditMode}
          activeTab={isArchiveView ? 'archive' : 'active'}
          onSelect={(id) => setState(prev => ({ ...prev, currentDungeonId: prev.currentDungeonId === id ? null : id }))}
          onCreateMajor={handleCreateMajor}
          onCreateSub={handleCreateSub}
          onUpdateMajor={handleUpdateMajor}
          onUpdateSub={handleUpdateSub}
          onDeleteMajor={handleDeleteMajor}
          onDeleteSub={handleDeleteSub}
          onReorderMajor={reorderMajorDungeon}
          onReorderSub={reorderSubDungeon}
          onFinalizeMajor={finalizeMajorDungeon}
          onArchiveMajor={archiveMajorDungeon}
          onForceCompleteSub={forceCompleteSubDungeon}
        />
      ) : dungeonSubTab === 'quests' ? (
        <QuestManager 
          quests={state.quests}
          activeTalents={state.activeTalents}
          isAdding={isAddingQuest}
          setIsAdding={setIsAddingQuest}
          isEditMode={isDungeonEditMode}
          onUpdateQuests={(quests) => setState(prev => ({ ...prev, quests }))}
          onClaimReward={claimQuestReward}
          forceTab="quests"
        />
      ) : (
        <QuestManager 
          quests={state.quests}
          activeTalents={state.activeTalents}
          isAdding={isAddingQuest}
          setIsAdding={setIsAddingQuest}
          isEditMode={isDungeonEditMode}
          onUpdateQuests={(quests) => setState(prev => ({ ...prev, quests }))}
          onClaimReward={claimQuestReward}
          forceTab="achievements"
        />
      )}
    </motion.div>
  );
};
