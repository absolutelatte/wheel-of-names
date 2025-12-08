'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './use-local-storage';
import { STORAGE_KEYS, DEFAULT_WHEEL_METADATA } from '@/config/constants';
import { wheelMetadataSchema } from '@/lib/validators';
import type { WheelMetadata } from '@/types/wheel';

interface UseWheelMetadataReturn {
  readonly metadata: WheelMetadata;
  readonly updateMetadata: (partial: Partial<WheelMetadata>) => void;
  readonly resetMetadata: () => void;
}

export function useWheelMetadata(): UseWheelMetadataReturn {
  const {
    value: rawMetadata,
    setValue: setMetadata,
    removeValue: clearMetadata,
  } = useLocalStorage<WheelMetadata>(
    STORAGE_KEYS.WHEEL_METADATA,
    DEFAULT_WHEEL_METADATA as WheelMetadata
  );

  // Validate metadata on read, falling back to defaults for invalid values
  const metadata = useMemo((): WheelMetadata => {
    const result = wheelMetadataSchema.safeParse(rawMetadata);
    if (result.success) {
      return result.data;
    }
    return DEFAULT_WHEEL_METADATA as WheelMetadata;
  }, [rawMetadata]);

  const updateMetadata = useCallback(
    (partial: Partial<WheelMetadata>): void => {
      setMetadata((prev) => {
        const merged = { ...prev, ...partial };
        // Validate the merged metadata
        const result = wheelMetadataSchema.safeParse(merged);
        return result.success ? result.data : prev;
      });
    },
    [setMetadata]
  );

  const resetMetadata = useCallback((): void => {
    clearMetadata();
  }, [clearMetadata]);

  return useMemo(
    () => ({ metadata, updateMetadata, resetMetadata }),
    [metadata, updateMetadata, resetMetadata]
  );
}
