import { useState, useCallback } from 'react';
import { AppState } from '../types';
import { GoogleDriveAPI } from '../lib/googleDriveApi';

export function useCloudSync(
  state: AppState, 
  setState: React.Dispatch<React.SetStateAction<AppState>>,
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

  const stripVolatile = useCallback((dataObj: any) => {
    if (!dataObj || !dataObj.state) return dataObj;
    const { 
      lastUpdated, 
      syncHistory, 
      deviceType, 
      pushSubscription, 
      secretCode, 
      googleDriveTokens, 
      googleDriveFileId, 
      webdavSettings, 
      syncProvider,
      isGoogleDriveUnlocked,
      isRedisUnlocked,
      ...restState 
    } = dataObj.state;
    return {
      ...dataObj,
      state: restState
    };
  }, []);

  const logSyncEvent = useCallback((
    type: 'login' | 'force_sync' | 'local_to_cloud' | 'cloud_to_local' | 'cancel_login' | 'unbind_local' | 'delete_cloud', 
    code: string,
    syncMethod?: 'Manual' | 'Immediate' | 'Interval polling' | 'Visibility API Active',
    syncProvider?: 'Redis' | 'Google Drive' | 'WebDAV'
  ) => {
    setState(prev => {
      const newHistory = [...(prev.syncHistory || [])];
      newHistory.unshift({ 
        type, 
        code, 
        timestamp: new Date().toISOString(), 
        deviceType: prev.deviceType,
        syncMethod,
        syncProvider: syncProvider || (prev.syncProvider as any) || 'Redis'
      });
      if (newHistory.length > 50) newHistory.pop();
      return { ...prev, syncHistory: newHistory };
    });
  }, [setState]);

  const syncToCloud = useCallback(async (
    forceOverwrite = false, 
    specificState?: AppState,
    syncMethod: 'Manual' | 'Immediate' | 'Interval polling' | 'Visibility API Active' = 'Manual'
  ) => {
    const currentState = specificState || state;
    const isGoogleDrive = currentState.syncProvider === 'Google Drive';
    const isWebDav = currentState.syncProvider === 'WebDAV';
    if (!isGoogleDrive && !isWebDav && !currentState.secretCode) return;
    if (isGoogleDrive && !currentState.googleDriveTokens) return;
    if (isWebDav && (!currentState.webdavSettings || !currentState.webdavSettings.url)) return;

    setIsSyncing(true);
    setSyncError(null);

    try {
      const fullLocalStorage: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          fullLocalStorage[key] = localStorage.getItem(key) || '';
        }
      }

      const localData = {
        state: currentState,
        dungeons: JSON.parse(localStorage.getItem('scholars_dungeon_state_dungeons') || '[]'),
        majorDungeons: JSON.parse(localStorage.getItem('scholars_dungeon_state_major_dungeons') || '[]'),
        fullLocalStorage,
        lastUpdated: new Date().toISOString()
      };

      if (isWebDav && currentState.webdavSettings) {
        const { url, username, password } = currentState.webdavSettings;
        
        if (!forceOverwrite) {
          // Check if cloud is newer
          const getResponse = await fetch('/api/webdav/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, username, password, method: 'GET' })
          });
          
          if (getResponse.ok) {
            const result = await getResponse.json();
            if (result.data && result.data.lastUpdated) {
              const cloudTime = new Date(result.data.lastUpdated).getTime();
              const localTime = new Date(localData.lastUpdated).getTime();
              if (cloudTime > localTime) {
                setSyncCheckResult({
                  status: 'cloud_newer',
                  cloudData: result.data,
                  code: 'WebDAV'
                });
                setIsSyncing(false);
                return;
              }
            }
          }
        }
        
        // Write to WebDAV
        const putResponse = await fetch('/api/webdav/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, username, password, method: 'PUT', body: localData })
        });
        
        if (!putResponse.ok) {
           throw new Error(await putResponse.text() || 'Failed to sync to WebDAV');
        }
        
        setState(prev => ({ 
          ...prev, 
          lastUpdated: localData.lastUpdated 
        }));
        setSyncCheckResult(null);
        logSyncEvent(forceOverwrite ? 'force_sync' : 'local_to_cloud', 'WebDAV', syncMethod, 'WebDAV');

      } else if (isGoogleDrive && currentState.googleDriveTokens) {
        const drive = new GoogleDriveAPI(currentState.googleDriveTokens.access_token);
        
        let fileId = currentState.googleDriveFileId || await drive.findSaveFile();
        
        if (fileId && !forceOverwrite) {
          // Check if cloud is newer
          const cloudData = await drive.readSaveFile(fileId);
          if (cloudData && cloudData.lastUpdated) {
            const cloudTime = new Date(cloudData.lastUpdated).getTime();
            const localTime = new Date(localData.lastUpdated).getTime();
            if (cloudTime > localTime) {
               setSyncCheckResult({
                 status: 'cloud_newer',
                 cloudData,
                 code: 'Google Drive Auth'
               });
               setIsSyncing(false);
               return;
            }
          }
        }

        if (fileId) {
          await drive.updateSaveFile(fileId, localData);
        } else {
          fileId = await drive.createSaveFile(localData);
        }
        
        setState(prev => ({ 
          ...prev, 
          lastUpdated: localData.lastUpdated,
          googleDriveFileId: fileId 
        }));
        setSyncCheckResult(null);
        logSyncEvent(forceOverwrite ? 'force_sync' : 'local_to_cloud', 'Google Drive', syncMethod, 'Google Drive');

      } else {
        const payload = {
          secretCode: currentState.secretCode,
          localData,
          forceOverwrite
        };

        const response = await fetch('/api/sync/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Server returned non-JSON response (${response.status}).`);
        }

        const data = await response.json();

        if (response.status === 409) {
          setSyncCheckResult({
            status: 'cloud_newer',
            cloudData: data.cloudData,
            code: currentState.secretCode!
          });
        } else if (!response.ok) {
          throw new Error(data.error || 'Failed to sync');
        } else {
          setState(prev => ({ ...prev, lastUpdated: data.cloudData.lastUpdated }));
          setSyncCheckResult(null);
          logSyncEvent(forceOverwrite ? 'force_sync' : 'local_to_cloud', currentState.secretCode!, syncMethod, 'Redis');
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

    setIsSyncing(true);
    try {
      if (useCloud && syncCheckResult.cloudData) {
        if (syncCheckResult.cloudData.fullLocalStorage) {
          Object.keys(syncCheckResult.cloudData.fullLocalStorage).forEach(key => {
            // Avoid overwriting specific local settings in localStorage if they already exist
            if (key === 'scholars_dungeon_state') {
                const cloudStateRaw = syncCheckResult.cloudData.fullLocalStorage[key];
                const cloudState = JSON.parse(cloudStateRaw);
                const localStateRaw = localStorage.getItem('scholars_dungeon_state');
                const localState = localStateRaw ? JSON.parse(localStateRaw) : state;
                
                const mergedState = {
                    ...cloudState,
                    // Preserve local identity/sync settings
                    secretCode: localState.secretCode || cloudState.secretCode,
                    syncProvider: localState.syncProvider || cloudState.syncProvider,
                    googleDriveTokens: localState.googleDriveTokens || cloudState.googleDriveTokens,
                    googleDriveFileId: localState.googleDriveFileId || cloudState.googleDriveFileId,
                    webdavSettings: localState.webdavSettings || cloudState.webdavSettings,
                    isGoogleDriveUnlocked: localState.isGoogleDriveUnlocked || cloudState.isGoogleDriveUnlocked,
                    isRedisUnlocked: localState.isRedisUnlocked || cloudState.isRedisUnlocked
                };
                localStorage.setItem(key, JSON.stringify(mergedState));
            } else {
                localStorage.setItem(key, syncCheckResult.cloudData.fullLocalStorage[key]);
            }
          });
        } else {
          localStorage.setItem('scholars_dungeon_state', JSON.stringify({
              ...syncCheckResult.cloudData.state,
              secretCode: state.secretCode || syncCheckResult.cloudData.state.secretCode,
              syncProvider: state.syncProvider || syncCheckResult.cloudData.state.syncProvider,
              googleDriveTokens: state.googleDriveTokens || syncCheckResult.cloudData.state.googleDriveTokens,
              webdavSettings: state.webdavSettings || syncCheckResult.cloudData.state.webdavSettings
          }));
          localStorage.setItem('scholars_dungeon_dungeons', JSON.stringify(syncCheckResult.cloudData.dungeons));
          localStorage.setItem('scholars_dungeon_major_dungeons', JSON.stringify(syncCheckResult.cloudData.majorDungeons));
        }

        setState((prev: any) => ({
            ...syncCheckResult.cloudData.state,
            secretCode: prev.secretCode || syncCheckResult.cloudData.state.secretCode,
            syncProvider: prev.syncProvider || syncCheckResult.cloudData.state.syncProvider,
            googleDriveTokens: prev.googleDriveTokens || syncCheckResult.cloudData.state.googleDriveTokens,
            googleDriveFileId: prev.googleDriveFileId || syncCheckResult.cloudData.state.googleDriveFileId,
            webdavSettings: prev.webdavSettings || syncCheckResult.cloudData.state.webdavSettings,
            isGoogleDriveUnlocked: prev.isGoogleDriveUnlocked || syncCheckResult.cloudData.state.isGoogleDriveUnlocked,
            isRedisUnlocked: prev.isRedisUnlocked || syncCheckResult.cloudData.state.isRedisUnlocked
        }));
        setDungeons(syncCheckResult.cloudData.dungeons);
        setMajorDungeons(syncCheckResult.cloudData.majorDungeons);
        
        logSyncEvent('cloud_to_local', syncCheckResult.code);
      } else if (!useCloud) {
        setState(prev => ({ ...prev, secretCode: syncCheckResult.code }));
        await syncToCloud(true, { ...state, secretCode: syncCheckResult.code }, 'Manual');
      }
      setSyncCheckResult(null);
    } finally {
      setIsSyncing(false);
    }
  }, [syncCheckResult, setState, setDungeons, setMajorDungeons, syncToCloud, state, logSyncEvent]);

  const fetchFromCloud = useCallback(async (code: string) => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      let cloudDataToProcess: any = null;

      if (code === 'GoogleDrive' && state.googleDriveTokens) {
        const drive = new GoogleDriveAPI(state.googleDriveTokens.access_token);
        const fileId = state.googleDriveFileId || await drive.findSaveFile();
        if (fileId) {
           cloudDataToProcess = await drive.readSaveFile(fileId);
        }
      } else if (code === 'WebDAV' && state.webdavSettings) {
        const { url, username, password } = state.webdavSettings;
        const response = await fetch('/api/webdav/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, username, password, method: 'GET' })
        });
        if (response.ok) {
            const result = await response.json();
            if (!result.is404 && result.data) {
                cloudDataToProcess = result.data;
            }
        }
      } else {
        // Redis
        const response = await fetch('/api/sync/', {
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
        cloudDataToProcess = data.cloudData;
      }

      logSyncEvent('login', code, 'Manual');
      if (cloudDataToProcess) {
        const cloudTime = new Date(cloudDataToProcess.lastUpdated || 0).getTime();
        const localTime = new Date(state.lastUpdated || 0).getTime();

        const localDataToCompare = stripVolatile({
          state: state,
          dungeons: JSON.parse(localStorage.getItem('scholars_dungeon_state_dungeons') || '[]'),
          majorDungeons: JSON.parse(localStorage.getItem('scholars_dungeon_state_major_dungeons') || '[]')
        });
        
        const cloudDataToCompare = stripVolatile({
          state: cloudDataToProcess.state,
          dungeons: cloudDataToProcess.dungeons || [],
          majorDungeons: cloudDataToProcess.majorDungeons || []
        });

        if (JSON.stringify(localDataToCompare) === JSON.stringify(cloudDataToCompare)) {
          setState(prev => ({ 
            ...prev, 
            lastUpdated: cloudDataToProcess.lastUpdated, 
            secretCode: (code !== 'WebDAV' && code !== 'GoogleDrive') ? code : prev.secretCode,
            syncProvider: (code === 'WebDAV') ? 'WebDAV' : (code === 'GoogleDrive' ? 'Google Drive' : prev.syncProvider)
          }));
          setSyncCheckResult(null);
          return;
        }

        if (cloudTime > localTime) {
          setSyncCheckResult({ status: 'cloud_newer', cloudData: cloudDataToProcess, code });
        } else {
          setSyncCheckResult({ status: 'local_newer', cloudData: cloudDataToProcess, code });
        }
      } else {
        setSyncCheckResult({ status: 'no_save', code });
      }
    } catch (err: any) {
      setSyncError(err.message);
    } finally {
      setIsSyncing(false);
    }
  }, [state, logSyncEvent, stripVolatile, setState]);

  const checkCloudSync = useCallback(async () => {
    const isGoogleDrive = state.syncProvider === 'Google Drive';
    const isWebDav = state.syncProvider === 'WebDAV';

    if (!isGoogleDrive && !isWebDav && !state.secretCode) return;
    if (isGoogleDrive && !state.googleDriveTokens) return;
    if (isWebDav && (!state.webdavSettings || !state.webdavSettings.url)) return;

    setIsSyncing(true);
    setSyncError(null);

    const checkNewer = (data: any, code: string) => {
        if (!data) {
            setSyncCheckResult({ status: 'no_save', code });
            return;
        }
        
        const cloudTime = new Date(data.lastUpdated || 0).getTime();
        const localTime = new Date(state.lastUpdated || 0).getTime();

        const localDataToCompare = stripVolatile({
          state: state,
          dungeons: JSON.parse(localStorage.getItem('scholars_dungeon_state_dungeons') || '[]'),
          majorDungeons: JSON.parse(localStorage.getItem('scholars_dungeon_state_major_dungeons') || '[]')
        });
        
        const cloudDataToCompare = stripVolatile({
          state: data.state,
          dungeons: data.dungeons || [],
          majorDungeons: data.majorDungeons || []
        });

        if (JSON.stringify(localDataToCompare) === JSON.stringify(cloudDataToCompare)) {
          setState(prev => ({ 
            ...prev, 
            lastUpdated: data.lastUpdated, 
            secretCode: (code !== 'WebDAV' && code !== 'GoogleDrive') ? code : prev.secretCode 
          }));
          setSyncCheckResult(null);
          return;
        }

        if (cloudTime > localTime) {
          setSyncCheckResult({ status: 'cloud_newer', cloudData: data, code });
        } else {
          setSyncCheckResult({ status: 'local_newer', cloudData: data, code });
        }
    };

    try {
      if (isWebDav && state.webdavSettings) {
        const { url, username, password } = state.webdavSettings;
        const response = await fetch('/api/webdav/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, username, password, method: 'GET' })
        });
        if (response.ok) {
            const result = await response.json();
            if (result.is404 || !result.data) {
                setSyncCheckResult({ status: 'no_save', code: 'WebDAV' });
            } else {
                checkNewer(result.data, 'WebDAV');
            }
        } else {
            throw new Error(await response.text() || 'Failed to fetch from WebDAV');
        }
      } else if (isGoogleDrive && state.googleDriveTokens) {
        const drive = new GoogleDriveAPI(state.googleDriveTokens.access_token);
        const fileId = state.googleDriveFileId || await drive.findSaveFile();
        if (fileId) {
            const result = await drive.readSaveFile(fileId);
            checkNewer(result, 'GoogleDrive');
        } else {
            setSyncCheckResult({ status: 'no_save', code: 'GoogleDrive' });
        }
      } else if (state.secretCode) {
        // Redis
        const response = await fetch('/api/sync/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secretCode: state.secretCode })
        });
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Server returned non-JSON response (${response.status}).`);
        }
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch from cloud');
        }
        logSyncEvent('login', state.secretCode, 'Manual');
        if (data.cloudData) {
            checkNewer(data.cloudData, state.secretCode);
        } else {
            setSyncCheckResult({ status: 'no_save', code: state.secretCode });
        }
      }
    } catch (err: any) {
      setSyncError(err.message);
    } finally {
      setIsSyncing(false);
    }
  }, [state, logSyncEvent, setState, stripVolatile]);

  const unbindFromCloud = useCallback(() => {
    const provider = state.syncProvider || 'Redis';
    const code = state.secretCode || (provider === 'Google Drive' ? 'Google' : 'WebDAV');
    logSyncEvent('unbind_local', code, 'Manual', provider);
    
    setState(prev => ({ 
      ...prev, 
      secretCode: undefined,
      syncProvider: undefined,
      googleDriveTokens: undefined,
      googleDriveFileId: undefined,
      webdavSettings: undefined
    }));
  }, [setState, state.secretCode, state.syncProvider, logSyncEvent]);

  const deleteCloudData = useCallback(async () => {
    if (!state.secretCode) return;
    const code = state.secretCode;
    setIsSyncing(true);
    setSyncError(null);
    try {
      const response = await fetch('/api/sync/', {
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
      logSyncEvent('delete_cloud', code, 'Manual');
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
    logSyncEvent,
    checkCloudSync
  };
}
