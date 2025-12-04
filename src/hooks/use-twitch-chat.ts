'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { TWITCH_COMMANDS } from '@/config/constants';

interface TwitchFlags {
  broadcaster: boolean;
  mod: boolean;
  subscriber: boolean;
  vip: boolean;
}

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const comfyRef = useRef<any>(null);

  const handleCommand = useCallback(
    (user: string, command: string, flags: TwitchFlags): void => {
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
          _message: string,
          flags: TwitchFlags
        ): void => {
          handleCommand(user, command, flags);
        };

        ComfyJS.onConnected = (): void => {
          setIsConnected(true);
          setError(null);
        };

        ComfyJS.onError = (err: string): void => {
          setError(err);
          setIsConnected(false);
        };

        ComfyJS.Init(channel);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Twitch chat';
        setError(errorMessage);
      }
    };

    void initComfy();

    return (): void => {
      if (comfyRef.current) {
        comfyRef.current.Disconnect();
      }
    };
  }, [channel, handleCommand]);

  return { isConnected, error };
}
