import React from 'react';
import { motion } from 'motion/react';
import { Stats } from './Stats';
import { AppState } from '../types';

interface StatsViewProps {
  state: AppState;
  saveDailyLog: (date: string, rating: number, reflection: string, mood?: string) => void;
  onUpdateState?: (updates: Partial<AppState>) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ state, saveDailyLog, onUpdateState }) => {
  return (
    <motion.div
      key="stats"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <Stats state={state} saveDailyLog={saveDailyLog} onUpdateState={onUpdateState} />
    </motion.div>
  );
};
