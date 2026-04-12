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

  const logSyncEvent = useCallback((type: 'login' | 'force_sync' | 'local_to_cloud' | 'cloud_to_local' | 'cancel_login' | 'unbind_local' | 'delete_cloud', code: string) => {
    setState(prev => {
      const newHistory = [...(prev.syncHistory || [])];
      newHistory.unshift({ type, code, timestamp: new Date().toISOString() });
      if (newHistory.length > 50) newHistory.pop();
      return { ...prev, syncHistory: newHistory };
    });
  }, [setState]);

  const syncToCloud = useCallback(async (forceOverwrite = false, specificState?: UserState) => {
    const currentState = specificState || state;
    if (!currentState.secretCode) return;

    setIsSyncing(true);
    setSyncError(null);

    try {
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

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error(`Server returned non-JSON response (${response.status}). This usually means the API route was not found.`);
      }

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
        setState(prev => ({ ...prev, lastUpdated: data.cloudData.lastUpdated }));
        setSyncCheckResult(null);
        if (forceOverwrite) {
          logSyncEvent('force_sync', currentState.secretCode);
        } else {
          logSyncEvent('local_to_cloud', currentState.secretCode);
        }
      }
    } catch (err: any) {
      setSyncError(err.message);
    } finally {
      setIsSyncing(false);
    }
  }, [state, setState, logSyncEvent]);

  const resolveConflict = useCallback(async (useCloud: boolean) => {
    if (!syncCheckResult) return;

    if (useCloud && syncCheckResult.cloudData) {
      setState(syncCheckResult.cloudData.state);
      setDungeons(syncCheckResult.cloudData.dungeons);
      setMajorDungeons(syncCheckResult.cloudData.majorDungeons);
      
      localStorage.setItem('scholars_dungeon_state', JSON.stringify(syncCheckResult.cloudData.state));
      localStorage.setItem('scholars_dungeon_dungeons', JSON.stringify(syncCheckResult.cloudData.dungeons));
      localStorage.setItem('scholars_dungeon_major_dungeons', JSON.stringify(syncCheckResult.cloudData.majorDungeons));
      
      logSyncEvent('cloud_to_local', syncCheckResult.code);
    } else if (!useCloud) {
      setState(prev => ({ ...prev, secretCode: syncCheckResult.code }));
      await syncToCloud(true, { ...state, secretCode: syncCheckResult.code });
      logSyncEvent('local_to_cloud', syncCheckResult.code);
    }
    setSyncCheckResult(null);
  }, [syncCheckResult, setState, setDungeons, setMajorDungeons, syncToCloud, state, logSyncEvent]);

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

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error(`Server returned non-JSON response (${response.status}).`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch from cloud');
      }

      logSyncEvent('login', code);

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
  }, [state.lastUpdated, logSyncEvent]);

  const unbindFromCloud = useCallback(() => {
    if (state.secretCode) {
      logSyncEvent('unbind_local', state.secretCode);
    }
    setState(prev => ({ ...prev, secretCode: undefined }));
  }, [setState, state.secretCode, logSyncEvent]);

  const deleteCloudData = useCallback(async () => {
    if (!state.secretCode) return;
    const code = state.secretCode;
    setIsSyncing(true);
    setSyncError(null);
    try {
      const response = await fetch('/api/sync', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secretCode: code })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error(`Server returned non-JSON response (${response.status}).`);
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete cloud data');
      }
      logSyncEvent('delete_cloud', code);
      unbindFromCloud();
    } catch (err: any) {
      setSyncError(err.message);
    } finally {
      setIsSyncing(false);
    }
  }, [state.secretCode, unbindFromCloud, logSyncEvent]);

  return {
    isSyncing,
    syncError,
    syncCheckResult,
    setSyncCheckResult,
    syncToCloud,
    resolveConflict,
    fetchFromCloud,
    unbindFromCloud,
    deleteCloudData,
    logSyncEvent
  };
}
