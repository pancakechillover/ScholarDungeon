import React from 'react';
import { motion } from 'motion/react';
import { Settings } from './settings/Settings';
import { AppState } from '../types';

interface SettingsViewProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  resetLootPool: () => void;
  addXP: (amount: number) => void;
  activeSection: 'general' | 'timer' | 'rewards' | 'shop' | 'gacha' | 'dev' | 'levelRewards' | 'about' | 'level' | 'merchant' | 'cloud';
  setActiveSection: (section: 'general' | 'timer' | 'rewards' | 'shop' | 'gacha' | 'dev' | 'levelRewards' | 'about' | 'level' | 'merchant' | 'cloud') => void;
  onTabChange?: (tab: any) => void;
  onOpenAstralArchives?: () => void;
  triggerSyncCheck?: (forceModal?: boolean) => void;
  isSyncing?: boolean;
  hasUnsyncedChanges?: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  state,
  setState,
  resetLootPool,
  addXP,
  activeSection,
  setActiveSection,
  onTabChange,
  onOpenAstralArchives,
  triggerSyncCheck,
  isSyncing,
  hasUnsyncedChanges
}) => {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <Settings 
        state={state}
        setState={setState}
        rewardPool={state.rewardPool || []}
        shopItems={state.shopItems || []}
        gachaPools={state.gachaPools || []}
        onUpdateRewards={(pool: any) => setState(prev => ({ ...prev, rewardPool: pool }))}
        onUpdateShop={(items: any) => setState(prev => ({ ...prev, shopItems: items }))}
        onUpdateGacha={(pools: any) => setState(prev => ({ ...prev, gachaPools: pools }))}
        onResetRewards={resetLootPool}
        addXP={addXP}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onTabChange={onTabChange}
        onOpenAstralArchives={onOpenAstralArchives}
        triggerSyncCheck={triggerSyncCheck}
        isSyncing={isSyncing}
        hasUnsyncedChanges={hasUnsyncedChanges}
      />
    </motion.div>
  );
};
