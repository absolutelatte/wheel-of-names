'use client';

import { useRef, useCallback, useEffect, useMemo } from 'react';

interface UseAudioOptions {
  readonly volume: number; // 0-100
}

interface UseAudioReturn {
  readonly playTick: () => void;
  readonly playWin: () => void;
  readonly preloadSounds: () => void;
}

export function useAudio({ volume }: UseAudioOptions): UseAudioReturn {
  const tickRef = useRef<HTMLAudioElement | null>(null);
  const winRef = useRef<HTMLAudioElement | null>(null);

  const preloadSounds = useCallback((): void => {
    if (typeof window === 'undefined') return;

    // Create audio elements if they don't exist
    if (!tickRef.current) {
      tickRef.current = new Audio('/sounds/tick.mp3');
      tickRef.current.preload = 'auto';
    }

    if (!winRef.current) {
      winRef.current = new Audio('/sounds/win.mp3');
      winRef.current.preload = 'auto';
    }
  }, []);

  const playTick = useCallback((): void => {
    if (!tickRef.current || volume === 0) return;

    tickRef.current.volume = volume / 100;
    tickRef.current.currentTime = 0;
    tickRef.current.play().catch(() => {
      // Ignore play errors (e.g., user hasn't interacted with page yet)
    });
  }, [volume]);

  const playWin = useCallback((): void => {
    if (!winRef.current || volume === 0) return;

    winRef.current.volume = volume / 100;
    winRef.current.currentTime = 0;
    winRef.current.play().catch(() => {
      // Ignore play errors (e.g., user hasn't interacted with page yet)
    });
  }, [volume]);

  // Preload sounds on mount
  useEffect(() => {
    preloadSounds();
  }, [preloadSounds]);

  // Update volume on existing audio elements when it changes
  useEffect(() => {
    if (tickRef.current) {
      tickRef.current.volume = volume / 100;
    }
    if (winRef.current) {
      winRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return (): void => {
      if (tickRef.current) {
        tickRef.current.pause();
        tickRef.current = null;
      }
      if (winRef.current) {
        winRef.current.pause();
        winRef.current = null;
      }
    };
  }, []);

  return useMemo(
    () => ({
      playTick,
      playWin,
      preloadSounds,
    }),
    [playTick, playWin, preloadSounds]
  );
}
