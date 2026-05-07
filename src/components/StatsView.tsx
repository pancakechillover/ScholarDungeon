import React from 'react';
import { motion } from 'motion/react';
import { Stats } from './Stats';
import { AppState } from '../types';

interface StatsViewProps {
  state: AppState;
  saveDailyLog: (date: string, rating: number, reflection: string) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ state, saveDailyLog }) => {
  return (
    <motion.div
      key="stats"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <Stats state={state} saveDailyLog={saveDailyLog} />
    </motion.div>
  );
};
