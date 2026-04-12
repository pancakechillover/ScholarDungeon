import { useState, useCallback } from 'react';
import { UserState } from '../types';

export function useCloudSync(
  state: UserState, 
  setState: React.Dispatch<React.SetStateAction<UserState>>,
  setDungeons: React.Dispatch<React.SetStateAction<any[]>>,
  setMajorDungeons: React.Dispatch<React.SetStateAction<any[]>>
) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [conflictData, setConflictData] = useState<any | null>(null);

  const syncToCloud = useCallback(async (forceOverwrite = false, specificState?: UserState) => {
    const currentState = specificState || state;
    if (!currentState.secretCode) return;

    setIsSyncing(true);
    setSyncError(null);

    try {
      // Get all local storage data to sync
      const dungeons = JSON.parse(localStorage.getItem('scholars_dungeon_dungeons') || '[]');
      const majorDungeons = JSON.parse(localStorage.getItem('scholars_dungeon_major_dungeons') || '[]');

      const payload = {
        secretCode: currentState.secretCode,
        localData: {
          state: currentState,
          dungeons,
          majorDungeons,
          lastUpdated: new Date().toISOString()
        },
        forceOverwrite
      };

      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.status === 409) {
        setConflictData(data.cloudData);
      } else if (!response.ok) {
        throw new Error(data.error || 'Failed to sync');
      } else {
        // Update local lastUpdated
        setState(prev => ({ ...prev, lastUpdated: data.cloudData.lastUpdated }));
        setConflictData(null);
      }
    } catch (err: any) {
      setSyncError(err.message);
    } finally {
      setIsSyncing(false);
    }
  }, [state, setState]);

  const resolveConflict = useCallback((useCloud: boolean) => {
    if (useCloud && conflictData) {
      // Apply cloud data
      setState(conflictData.state);
      setDungeons(conflictData.dungeons);
      setMajorDungeons(conflictData.majorDungeons);
      
      // Save to local storage
      localStorage.setItem('scholars_dungeon_state', JSON.stringify(conflictData.state));
      localStorage.setItem('scholars_dungeon_dungeons', JSON.stringify(conflictData.dungeons));
      localStorage.setItem('scholars_dungeon_major_dungeons', JSON.stringify(conflictData.majorDungeons));
    } else if (!useCloud) {
      // Force overwrite cloud with local
      syncToCloud(true);
    }
    setConflictData(null);
  }, [conflictData, setState, setDungeons, setMajorDungeons, syncToCloud]);

  const fetchFromCloud = useCallback(async (code: string) => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secretCode: code })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch from cloud');
      }

      if (data.cloudData) {
        // We have cloud data, check if we should apply it
        const cloudTime = new Date(data.cloudData.lastUpdated || 0).getTime();
        const localTime = new Date(state.lastUpdated || 0).getTime();

        if (cloudTime > localTime) {
          setConflictData(data.cloudData);
        } else {
          // Local is newer or same, just update secret code
          setState(prev => ({ ...prev, secretCode: code }));
          syncToCloud(true, { ...state, secretCode: code });
        }
      } else {
        // No cloud data exists yet for this code, set it and sync
        setState(prev => ({ ...prev, secretCode: code }));
        syncToCloud(true, { ...state, secretCode: code });
      }
    } catch (err: any) {
      setSyncError(err.message);
    } finally {
      setIsSyncing(false);
    }
  }, [state, setState, syncToCloud]);

  return {
    isSyncing,
    syncError,
    conflictData,
    syncToCloud,
    resolveConflict,
    fetchFromCloud
  };
}
