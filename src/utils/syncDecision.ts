export type SyncDecision = 
  | 'silent_upload'
  | 'silent_noop'
  | 'block_cloud_newer'
  | 'block_read_failed'
  | 'force_upload'
  | 'ask_local_newer';

interface SyncDecisionParams {
  localFingerprint: string;
  cloudFingerprint: string;
  localTime: number;
  cloudTime: number;
  cloudExists: boolean;
  cloudReadError?: boolean;
  forceOverwrite: boolean;
}

export function decideCloudSyncAction({
  localFingerprint,
  cloudFingerprint,
  localTime,
  cloudTime,
  cloudExists,
  cloudReadError,
  forceOverwrite
}: SyncDecisionParams): SyncDecision {
  if (cloudReadError) {
    return 'block_read_failed';
  }

  // If manual force overwrite, always upload
  if (forceOverwrite) {
    return 'force_upload';
  }

  // If cloud doesn't exist, silently initialize
  if (!cloudExists) {
    return 'silent_upload';
  }

  // Cloud exists, check fingerprints
  if (localFingerprint === cloudFingerprint) {
    // Content is exactly the same. 
    return 'silent_upload'; // To refresh metadata
  }

  // Fingerprints differ. Check timestamps.
  if (cloudTime > localTime) { // cloud is newer
    return 'block_cloud_newer';
  }

  // Local is newer. In auto sync, we want to push it silently.
  // In manual explicit check, we MIGHT want to show 'local_newer', but wait...
  // User said: "local_newer 不弹窗，静默上传。"
  // "如果用户只是点击 Manual Check / Verify，可以显示本地和云端比较弹窗，但这应该在调用方根据情况区分" -> wait, if we are in checkCloudSync(forceModal=true), we return 'ask_local_newer'.
  // Actually, let's just return 'silent_upload' here and the caller can override if it's forceModal.
  // We'll let `decideCloudSyncAction` dictate the automatic logic.
  
  return 'silent_upload';
}
