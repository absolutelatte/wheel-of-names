'use client';

import type { JSX } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WheelStatus } from '@/types/wheel';

interface WheelControlsProps {
  readonly status: WheelStatus;
  readonly onOpen: () => void;
  readonly onClose: () => void;
  readonly isSpinning?: boolean;
}

export function WheelControls({
  status,
  onOpen,
  onClose,
  isSpinning = false,
}: WheelControlsProps): JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      {status === 'closed' ? (
        <Button onClick={onOpen} className="w-full shadow-sm" size="lg" disabled={isSpinning}>
          <Unlock className="mr-2 h-4 w-4" />
          Open Entries
        </Button>
      ) : (
        <Button onClick={onClose} variant="secondary" className="w-full shadow-sm" size="lg" disabled={isSpinning}>
          <Lock className="mr-2 h-4 w-4" />
          Close Entries
        </Button>
      )}
    </div>
  );
}
