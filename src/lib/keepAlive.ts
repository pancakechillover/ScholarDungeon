import { useEffect, useRef } from 'react';

// A tiny 1-second silent WAV base64
const SILENT_WAV_B64 = "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==";

export function useBackgroundKeepAlive(isActive: boolean, isResting: boolean, duration: number, timeLeft: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initialize audio element once
    if (!audioRef.current) {
      const audio = new Audio(SILENT_WAV_B64);
      audio.loop = true;
      audio.volume = 0.01; // Low volume just in case
      // For iOS, playsInline and other attributes might be needed
      audio.setAttribute('playsinline', 'true');
      audioRef.current = audio;
    }
    
    const audio = audioRef.current;
    
    if (isActive) {
      // Attempt to play to acquire background execution privileges
      audio.play().catch(err => {
        console.warn("Background Keep-Alive Audio Blocked (requires interaction):", err);
      });
      
      // Update Lock Screen Metadata
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: isResting ? 'Resting...' : 'Focusing...',
          artist: "Scholar's Dungeon",
          album: 'Timer Active',
        });
      }
    } else {
      audio.pause();
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null;
      }
    }
    
  }, [isActive, isResting]);
  
  // Throttle media session progress updates to avoid performance hits
  useEffect(() => {
    if (isActive && 'mediaSession' in navigator && navigator.mediaSession.setPositionState) {
      try {
        const totalDuration = (duration || 25) * 60;
        const position = Math.max(0, totalDuration - timeLeft);
        navigator.mediaSession.setPositionState({
          duration: totalDuration > 0 ? totalDuration : 1,
          playbackRate: 1,
          position: position <= totalDuration ? position : 0
        });
      } catch (e) {
        // Some browsers don't support partial position state
      }
    }
  }, [isActive, timeLeft, duration]);
}

