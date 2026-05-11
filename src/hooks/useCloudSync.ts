import { useState, useCallback } from 'react';
import { AppState } from '../types';
import { GoogleDriveAPI } from '../lib/googleDriveApi';

export const getDeviceCode = () => {
    let code = localStorage.getItem('scholars_dungeon_device_code');
    if (!code) {
        code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('scholars_dungeon_device_code', code);
    }
    return code;
};

export function useCloudSync(
  state: AppState, 
  setState: React.Dispatch<React.SetStateAction<AppState>>,
  setDungeons: React.Dispatch<React.SetStateAction<any[]>>,
  setMajorDungeons: React.Dispatch<React.SetStateAction<any[]>>
) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncCheckResult, setSyncCheckResult] = useState<{
    status: 'no_save' | 'cloud_newer' | 'local_newer';
    cloudData?: any;
    code: string;
  } | null>(null);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const stripVolatile = useCallback((dataObj: any) => {
    if (!dataObj || !dataObj.state) return dataObj;
    const { 
      lastUpdated, 
      syncHistory, 
      deviceType, 
      deviceNickname,
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
        deviceNickname: prev.deviceNickname,
        deviceCode: getDeviceCode(),
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

    if (!isOnline()) {
      setSyncError("Network unavailable. Please connect to the void to access archives.");
      setIsSyncing(false);
      return;
    }

    try {
      const fullLocalStorage: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          fullLocalStorage[key] = localStorage.getItem(key) || '';
        }
      }

      const localIdentity = currentState.deviceNickname || currentState.deviceType;

      let localData: any = {
        state: currentState,
        savedBy: localIdentity, // Metadata to identify the saving device
        savedByDeviceCode: getDeviceCode(), // Unique device identifier
        dungeons: JSON.parse(localStorage.getItem('scholars_dungeon_state_dungeons') || '[]'),
        majorDungeons: JSON.parse(localStorage.getItem('scholars_dungeon_state_major_dungeons') || '[]'),
        fullLocalStorage,
        lastUpdated: new Date().toISOString()
      };

      // Ensure volatile fields are stripped before sync
      localData = stripVolatile(localData);
      
      // Also ensure the state inside fullLocalStorage is stripped
      if (localData.fullLocalStorage && localData.fullLocalStorage['scholars_dungeon_state']) {
        try {
          const stateToStrip = JSON.parse(localData.fullLocalStorage['scholars_dungeon_state']);
          const stripped = stripVolatile({ state: stateToStrip });
          localData.fullLocalStorage['scholars_dungeon_state'] = JSON.stringify(stripped.state);
        } catch (e) {
          console.warn("Failed to strip volatile from fullLocalStorage state:", e);
        }
      }

      if (isWebDav && currentState.webdavSettings) {
        const { url, username, password } = currentState.webdavSettings;
        
        // Ensure parent directory exists for WebDAV (prevent root pollution)
        try {
          const lastSlashIndex = url.lastIndexOf('/');
          if (lastSlashIndex !== -1) {
            const folderUrl = url.substring(0, lastSlashIndex + 1);
            await fetch('/api/webdav/proxy', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: folderUrl, username, password, method: 'MKCOL' })
            });
          }
        } catch (e) {
          // Ignore errors, could be folder already exists
          console.warn("WebDAV folder creation check handled:", e);
        }
        
        if (!forceOverwrite) {
          // Check if cloud is newer
          const getResponse = await fetch('/api/webdav/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, username, password, method: 'GET' })
          });
          
          if (getResponse.ok) {
            const result = await getResponse.json();
            if (result.data) {
              const cloudDeviceCode = result.data.savedByDeviceCode;
              const identitiesMatch = cloudDeviceCode ? cloudDeviceCode === getDeviceCode() : (!result.data.savedBy || result.data.savedBy === localIdentity);

              // IF identities mismatch: 
              // 1. If visibility trigger -> abort (can't show modal)
              // 2. Otherwise -> show modal
              if (!identitiesMatch) {
                if (syncMethod === 'Visibility API Active') {
                  console.warn("Cloud sync aborted: Device identity mismatch during visibility change.");
                  setIsSyncing(false);
                  return;
                }
                setSyncCheckResult({
                    status: 'cloud_newer', // Treat as conflict to show modal
                    cloudData: result.data,
                    code: 'WebDAV'
                });
                setIsSyncing(false);
                return;
              }

              // Normal timestamp check for silent sync
              if (result.data.lastUpdated) {
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
          // Check if cloud is newer or identity mismatch
          const cloudData = await drive.readSaveFile(fileId);
          if (cloudData) {
            const cloudDeviceCode = cloudData.savedByDeviceCode;
            const identitiesMatch = cloudDeviceCode ? cloudDeviceCode === getDeviceCode() : (!cloudData.savedBy || cloudData.savedBy === localIdentity);

            if (!identitiesMatch) {
              if (syncMethod === 'Visibility API Active') {
                console.warn("Cloud sync aborted: Device identity mismatch during visibility change.");
                setIsSyncing(false);
                return;
              }
              setSyncCheckResult({
                  status: 'cloud_newer', 
                  cloudData,
                  code: 'Google Drive Auth'
              });
              setIsSyncing(false);
              return;
            }

            if (cloudData.lastUpdated) {
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
        // Redis
        if (!forceOverwrite) {
          // Fetch first to check identity
          const getResponse = await fetch('/api/sync/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secretCode: currentState.secretCode })
          });
          
          if (getResponse.ok) {
            const data = await getResponse.json();
            if (data.cloudData) {
              const cloudDeviceCode = data.cloudData.savedByDeviceCode;
              const identitiesMatch = cloudDeviceCode ? cloudDeviceCode === getDeviceCode() : (!data.cloudData.savedBy || data.cloudData.savedBy === localIdentity);

              if (!identitiesMatch) {
                if (syncMethod === 'Visibility API Active') {
                   console.warn("Cloud sync aborted: Device identity mismatch during visibility change.");
                   setIsSyncing(false);
                   return;
                }
                setSyncCheckResult({
                  status: 'cloud_newer', // Conflict
                  cloudData: data.cloudData,
                  code: currentState.secretCode!
                });
                setIsSyncing(false);
                return;
              }
            }
          }
        }

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
                    deviceNickname: localState.deviceNickname || cloudState.deviceNickname,
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
              deviceNickname: state.deviceNickname || syncCheckResult.cloudData.state.deviceNickname,
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
            deviceNickname: prev.deviceNickname || syncCheckResult.cloudData.state.deviceNickname,
            secretCode: (syncCheckResult.code !== 'WebDAV' && syncCheckResult.code !== 'GoogleDrive' && syncCheckResult.code !== 'GoogleDriveAuth') 
                ? syncCheckResult.code 
                : (prev.secretCode || syncCheckResult.cloudData.state.secretCode),
            syncProvider: syncCheckResult.code === 'WebDAV' 
                ? 'WebDAV' 
                : (syncCheckResult.code === 'GoogleDrive' || syncCheckResult.code === 'GoogleDriveAuth') 
                    ? 'Google Drive' 
                    : 'Redis',
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
        const isProviderCode = syncCheckResult.code === 'WebDAV' || syncCheckResult.code === 'GoogleDrive' || syncCheckResult.code === 'GoogleDriveAuth';
        const newSecretCode = isProviderCode ? state.secretCode : syncCheckResult.code;
        const newSyncProvider = syncCheckResult.code === 'WebDAV' ? 'WebDAV' : (syncCheckResult.code === 'GoogleDrive' || syncCheckResult.code === 'GoogleDriveAuth' ? 'Google Drive' : 'Redis');
        
        setState(prev => ({ 
          ...prev, 
          secretCode: newSecretCode,
          syncProvider: newSyncProvider
        }));
        await syncToCloud(true, { ...state, secretCode: newSecretCode, syncProvider: newSyncProvider }, 'Manual');
      }
      setSyncCheckResult(null);
    } finally {
      setIsSyncing(false);
    }
  }, [syncCheckResult, setState, setDungeons, setMajorDungeons, syncToCloud, state, logSyncEvent]);

  const fetchFromCloud = useCallback(async (code: string) => {
    setIsSyncing(true);
    setSyncError(null);
    setIsVerifying(false);

    if (!isOnline()) {
      setSyncError("Network unavailable. Please connect to the void to access archives.");
      setIsSyncing(false);
      return;
    }

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

      // ENTER VERIFICATION PHASE
      setIsVerifying(true);
      await delay(1500); // Artificial delay to simulate thorough checking

      logSyncEvent('login', code, 'Manual');
      if (cloudDataToProcess) {
        const cloudTime = new Date(cloudDataToProcess.lastUpdated || (cloudDataToProcess.state && cloudDataToProcess.state.lastUpdated) || 0).getTime();
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

        const localIdentity = state.deviceNickname || state.deviceType;
        const cloudDeviceCode = cloudDataToProcess.savedByDeviceCode;
        const identitiesMatch = cloudDeviceCode ? cloudDeviceCode === getDeviceCode() : (!cloudDataToProcess.savedBy || cloudDataToProcess.savedBy === localIdentity);

        if (JSON.stringify(localDataToCompare) === JSON.stringify(cloudDataToCompare) && identitiesMatch) {
          const isProviderCode = code === 'WebDAV' || code === 'GoogleDrive' || code === 'GoogleDriveAuth';
          setState(prev => ({ 
            ...prev, 
            lastUpdated: cloudDataToProcess.lastUpdated, 
            secretCode: !isProviderCode ? code : prev.secretCode,
            syncProvider: (code === 'WebDAV') ? 'WebDAV' : ((code === 'GoogleDrive' || code === 'GoogleDriveAuth') ? 'Google Drive' : 'Redis')
          }));
          setSyncCheckResult(null);
          return;
        }

        if (cloudTime > localTime || !identitiesMatch) {
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

  const checkCloudSync = useCallback(async (forceModal = false) => {
    const isGoogleDrive = state.syncProvider === 'Google Drive';
    const isWebDav = state.syncProvider === 'WebDAV';

    if (!isGoogleDrive && !isWebDav && !state.secretCode) return;
    if (isGoogleDrive && !state.googleDriveTokens) return;
    if (isWebDav && (!state.webdavSettings || !state.webdavSettings.url)) return;

    setIsSyncing(true);
    setIsVerifying(false);
    setSyncError(null);

    if (!isOnline()) {
      // For silent checks, we might want to be less intrusive, but the user requested a reminder.
      setSyncError("Network unavailable. Please connect to the void to access archives.");
      setIsSyncing(false);
      return;
    }

    const checkNewer = async (data: any, code: string) => {
        if (!data) {
            setSyncCheckResult({ status: 'no_save', code });
            return;
        }
        
        const cloudTime = new Date(data.lastUpdated || (data.state && data.state.lastUpdated) || 0).getTime();
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

        const localIdentity = state.deviceNickname || state.deviceType;
        const cloudDeviceCode = data.savedByDeviceCode;
        const identitiesMatch = cloudDeviceCode ? cloudDeviceCode === getDeviceCode() : (!data.savedBy || data.savedBy === localIdentity);

        // Check for exact data match first
        if (JSON.stringify(localDataToCompare) === JSON.stringify(cloudDataToCompare) && !forceModal && identitiesMatch) {
          const isProviderCode = code === 'WebDAV' || code === 'GoogleDrive' || code === 'GoogleDriveAuth';
          setState(prev => ({ 
            ...prev, 
            lastUpdated: data.lastUpdated || (data.state && data.state.lastUpdated), 
            secretCode: !isProviderCode ? code : prev.secretCode,
            syncProvider: (code === 'WebDAV') ? 'WebDAV' : ((code === 'GoogleDrive' || code === 'GoogleDriveAuth') ? 'Google Drive' : 'Redis')
          }));
          setSyncCheckResult(null);
          setIsVerifying(false);
          setIsSyncing(false);
          return;
        }

        // SILENT SYNC: If local is newer or equal and identity matches, just upload silently
        if (identitiesMatch && localTime >= cloudTime && !forceModal) {
          console.log("[Cloud Sync] Silent integrity check passed: Local is newer or equal on same device. Overwriting cloud archive...");
          await syncToCloud(true, undefined, 'Immediate');
          setIsVerifying(false);
          setIsSyncing(false);
          return;
        }

        // ENTER VERIFICATION PHASE ONLY FOR CONFLICTS
        setIsVerifying(true);
        await delay(1200); // Artificial delay to simulate thorough checking

        if (cloudTime > localTime || !identitiesMatch) {
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
                await checkNewer(result.data, 'WebDAV');
            }
        } else {
            throw new Error(await response.text() || 'Failed to fetch from WebDAV');
        }
      } else if (isGoogleDrive && state.googleDriveTokens) {
        const drive = new GoogleDriveAPI(state.googleDriveTokens.access_token);
        const fileId = state.googleDriveFileId || await drive.findSaveFile();
        if (fileId) {
            const result = await drive.readSaveFile(fileId);
            await checkNewer(result, 'GoogleDrive');
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
            await checkNewer(data.cloudData, state.secretCode);
        } else {
            setSyncCheckResult({ status: 'no_save', code: state.secretCode });
        }
      }
    } catch (err: any) {
      setSyncError(err.message);
    } finally {
      setIsSyncing(false);
      setIsVerifying(false);
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
    isVerifying,
    syncError,
    setSyncError,
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

const isOnline = () => {
  return typeof navigator !== 'undefined' && navigator.onLine;
};
