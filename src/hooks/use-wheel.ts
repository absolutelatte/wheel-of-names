'use client';

import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './use-local-storage';
import { STORAGE_KEYS, MAX_PARTICIPANTS } from '@/config/constants';
import type { WheelStatus, UseWheelReturn } from '@/types/wheel';

export function useWheel(): UseWheelReturn {
  const [status, setStatus] = useState<WheelStatus>('closed');
  const isLoading = false;
  
  const {
    value: participants,
    setValue: setStoredParticipants,
    removeValue: clearParticipants,
  } = useLocalStorage<readonly string[]>(STORAGE_KEYS.PARTICIPANTS, []);

  const open = useCallback((): void => {
    setStatus('open');
  }, []);

  const close = useCallback((): void => {
    setStatus('closed');
  }, []);

  const reset = useCallback((): void => {
    setStatus('closed');
    clearParticipants();
  }, [clearParticipants]);

  const addParticipant = useCallback(
    (name: string): void => {
      const trimmedName = name.trim();
      if (!trimmedName) return;
      
      setStoredParticipants((prev) => {
        if (prev.includes(trimmedName)) return prev;
        if (prev.length >= MAX_PARTICIPANTS) return prev;
        return [...prev, trimmedName];
      });
    },
    [setStoredParticipants]
  );

  const removeParticipant = useCallback(
    (name: string): void => {
      setStoredParticipants((prev) => prev.filter((p) => p !== name));
    },
    [setStoredParticipants]
  );

  const setParticipants = useCallback(
    (newParticipants: readonly string[]): void => {
      // Allow freeform editing (duplicates and empty lines) for better UX
      // We limit the count but don't filter aggressively
      setStoredParticipants(newParticipants.slice(0, MAX_PARTICIPANTS));
    },
    [setStoredParticipants]
  );

  return useMemo(
    () => ({
      status,
      participants,
      isLoading,
      open,
      close,
      reset,
      addParticipant,
      removeParticipant,
      setParticipants,
    }),
    [
      status,
      participants,
      isLoading,
      open,
      close,
      reset,
      addParticipant,
      removeParticipant,
      setParticipants,
    ]
  );
}
