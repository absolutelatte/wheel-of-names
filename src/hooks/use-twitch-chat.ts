'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import type { ChatCommand, TwitchFlags } from '@/types/twitch';
import { TWITCH_COMMANDS } from '@/config/constants';

interface UseTwitchChatOptions {
  readonly channel: string;
  readonly onJoin?: (username: string) => void;
  readonly onOpenWheel?: () => void;
  readonly onCloseWheel?: () => void;
}

interface UseTwitchChatReturn {
  readonly isConnected: boolean;
  readonly error: string | null;
}

export function useTwitchChat({
  channel,
  onJoin,
  onOpenWheel,
  onCloseWheel,
}: UseTwitchChatOptions): UseTwitchChatReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const comfyRef = useRef<typeof window.ComfyJS | null>(null);

  const handleCommand = useCallback(
    (user: string, command: string, _message: string, flags: TwitchFlags): void => {
      const lowerCommand = command.toLowerCase();

      if (flags.broadcaster && lowerCommand === TWITCH_COMMANDS.OPEN_WHEEL) {
        onOpenWheel?.();
        return;
      }

      if (flags.broadcaster && lowerCommand === TWITCH_COMMANDS.CLOSE_WHEEL) {
        onCloseWheel?.();
        return;
      }

      if (lowerCommand === TWITCH_COMMANDS.JOIN) {
        onJoin?.(user);
      }
    },
    [onJoin, onOpenWheel, onCloseWheel]
  );

  useEffect(() => {
    const initComfy = async (): Promise<void> => {
      try {
        if (typeof window === 'undefined') return;

        const ComfyJS = (await import('comfy.js')).default;
        comfyRef.current = ComfyJS;

        ComfyJS.onCommand = (
          user: string,
          command: string,
          message: string,
          flags: TwitchFlags
        ): void => {
          handleCommand(user, command, message, flags);
        };

        ComfyJS.onConnected = (): void => {
          setIsConnected(true);
          setError(null);
        };

        ComfyJS.onError = (err: Error): void => {
          setError(err.message);
          setIsConnected(false);
        };

        ComfyJS.Init(channel);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Twitch chat';
        setError(errorMessage);
      }
    };

    void initComfy();

    return () => {
      if (comfyRef.current) {
        comfyRef.current.Disconnect();
      }
    };
  }, [channel, handleCommand]);

  return { isConnected, error };
}

declare global {
  interface Window {
    ComfyJS: {
      Init: (channel: string) => void;
      Disconnect: () => void;
      onCommand: (
        user: string,
        command: string,
        message: string,
        flags: TwitchFlags
      ) => void;
      onConnected: () => void;
      onError: (error: Error) => void;
    };
  }
}
