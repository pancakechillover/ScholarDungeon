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
  const [syncCheckResult, setSyncCheckResult] = useState<{
    status: 'no_save' | 'cloud_newer' | 'local_newer';
    cloudData?: any;
    code: string;
  } | null>(null);

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
        setSyncCheckResult({
          status: 'cloud_newer',
          cloudData: data.cloudData,
          code: currentState.secretCode
        });
      } else if (!response.ok) {
        throw new Error(data.error || 'Failed to sync');
      } else {
        // Update local lastUpdated
        setState(prev => ({ ...prev, lastUpdated: data.cloudData.lastUpdated }));
        setSyncCheckResult(null);
      }
    } catch (err: any) {
      setSyncError(err.message);
    } finally {
      setIsSyncing(false);
    }
  }, [state, setState]);

  const resolveConflict = useCallback(async (useCloud: boolean) => {
    if (!syncCheckResult) return;

    if (useCloud && syncCheckResult.cloudData) {
      // Apply cloud data
      setState(syncCheckResult.cloudData.state);
      setDungeons(syncCheckResult.cloudData.dungeons);
      setMajorDungeons(syncCheckResult.cloudData.majorDungeons);
      
      // Save to local storage
      localStorage.setItem('scholars_dungeon_state', JSON.stringify(syncCheckResult.cloudData.state));
      localStorage.setItem('scholars_dungeon_dungeons', JSON.stringify(syncCheckResult.cloudData.dungeons));
      localStorage.setItem('scholars_dungeon_major_dungeons', JSON.stringify(syncCheckResult.cloudData.majorDungeons));
    } else if (!useCloud) {
      // Force overwrite cloud with local
      setState(prev => ({ ...prev, secretCode: syncCheckResult.code }));
      await syncToCloud(true, { ...state, secretCode: syncCheckResult.code });
    }
    setSyncCheckResult(null);
  }, [syncCheckResult, setState, setDungeons, setMajorDungeons, syncToCloud, state]);

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
        const cloudTime = new Date(data.cloudData.lastUpdated || 0).getTime();
        const localTime = new Date(state.lastUpdated || 0).getTime();

        if (cloudTime > localTime) {
          setSyncCheckResult({ status: 'cloud_newer', cloudData: data.cloudData, code });
        } else {
          setSyncCheckResult({ status: 'local_newer', cloudData: data.cloudData, code });
        }
      } else {
        setSyncCheckResult({ status: 'no_save', code });
      }
    } catch (err: any) {
      setSyncError(err.message);
    } finally {
      setIsSyncing(false);
    }
  }, [state.lastUpdated]);

  const unbindFromCloud = useCallback(() => {
    setState(prev => ({ ...prev, secretCode: undefined }));
  }, [setState]);

  return {
    isSyncing,
    syncError,
    syncCheckResult,
    syncToCloud,
    resolveConflict,
    fetchFromCloud,
    unbindFromCloud
  };
}
