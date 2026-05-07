import React from 'react';
import { motion } from 'motion/react';
import { TalentTree } from './TalentTree';
import { AppState } from '../types';

interface TalentsViewProps {
  state: AppState;
  unlockTalent: (id: string, cost: number) => void;
  toggleTalent: (id: string) => void;
}

export const TalentsView: React.FC<TalentsViewProps> = ({ state, unlockTalent, toggleTalent }) => {
  return (
    <motion.div
      key="talents"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <TalentTree 
        points={state.talentPoints}
        shards={state.talentShards}
        unlockedIds={state.unlockedTalents}
        activeIds={state.activeTalents}
        onUnlock={unlockTalent}
        onToggle={toggleTalent}
      />
    </motion.div>
  );
};
