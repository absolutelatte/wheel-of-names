'use client';

import { Lock, Unlock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WheelStatus } from '@/types/wheel';

interface WheelControlsProps {
  readonly status: WheelStatus;
  readonly onOpen: () => void;
  readonly onClose: () => void;
  readonly onReset: () => void;
}

export function WheelControls({
  status,
  onOpen,
  onClose,
  onReset,
}: WheelControlsProps): JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-2">
      {status === 'closed' ? (
        <Button onClick={onOpen} className="col-span-1">
          <Unlock className="h-4 w-4" />
          Open
        </Button>
      ) : (
        <Button onClick={onClose} variant="secondary" className="col-span-1">
          <Lock className="h-4 w-4" />
          Close
        </Button>
      )}
      <Button onClick={onReset} variant="destructive" className="col-span-1">
        <Trash2 className="h-4 w-4" />
        Reset
      </Button>
    </div>
  );
}
