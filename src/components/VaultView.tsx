import React from 'react';
import { motion } from 'motion/react';
import { RewardHistory } from './RewardHistory';
import { AppState } from '../types';
import { playSound } from '../lib/sound';

interface VaultViewProps {
  state: AppState;
  toggleRewardRedeemed: (id: string) => void;
}

export const VaultView: React.FC<VaultViewProps> = ({ state, toggleRewardRedeemed }) => {
  return (
    <motion.div
      key="vault"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full p-6 lg:p-8"
    >
      <RewardHistory 
        history={state.rewardHistory} 
        onToggleRedeemed={(id) => {
          toggleRewardRedeemed(id);
          playSound('redeem', state.soundVolume, state.soundEnabled);
        }}
      />
    </motion.div>
  );
};
