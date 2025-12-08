'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './use-local-storage';
import { STORAGE_KEYS, DEFAULT_WHEEL_SETTINGS } from '@/config/constants';
import { wheelSettingsSchema } from '@/lib/validators';
import type { WheelSettings } from '@/types/wheel';

interface UseWheelSettingsReturn {
  readonly settings: WheelSettings;
  readonly updateSettings: (partial: Partial<WheelSettings>) => void;
  readonly resetSettings: () => void;
}

export function useWheelSettings(): UseWheelSettingsReturn {
  const {
    value: rawSettings,
    setValue: setSettings,
    removeValue: clearSettings,
  } = useLocalStorage<WheelSettings>(
    STORAGE_KEYS.WHEEL_SETTINGS,
    DEFAULT_WHEEL_SETTINGS as WheelSettings
  );

  // Validate settings on read, falling back to defaults for invalid values
  const settings = useMemo((): WheelSettings => {
    const result = wheelSettingsSchema.safeParse(rawSettings);
    if (result.success) {
      return result.data;
    }
    return DEFAULT_WHEEL_SETTINGS as WheelSettings;
  }, [rawSettings]);

  const updateSettings = useCallback(
    (partial: Partial<WheelSettings>): void => {
      setSettings((prev) => {
        const merged = { ...prev, ...partial };
        // Validate the merged settings
        const result = wheelSettingsSchema.safeParse(merged);
        return result.success ? result.data : prev;
      });
    },
    [setSettings]
  );

  const resetSettings = useCallback((): void => {
    clearSettings();
  }, [clearSettings]);

  return useMemo(
    () => ({ settings, updateSettings, resetSettings }),
    [settings, updateSettings, resetSettings]
  );
}
