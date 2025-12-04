'use client';

import type { JSX } from 'react';
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
    <div className="flex flex-col gap-3">
      {status === 'closed' ? (
        <Button onClick={onOpen} className="w-full shadow-sm" size="lg">
          <Unlock className="mr-2 h-4 w-4" />
          Open Entries
        </Button>
      ) : (
        <Button onClick={onClose} variant="secondary" className="w-full shadow-sm" size="lg">
          <Lock className="mr-2 h-4 w-4" />
          Close Entries
        </Button>
      )}
      
      <Button 
        onClick={onReset} 
        variant="ghost" 
        className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        size="sm"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Reset All
      </Button>
    </div>
  );
}
