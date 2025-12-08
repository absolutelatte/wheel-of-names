'use client';

import type { JSX } from 'react';
import { Trash2, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WheelManagementProps {
  readonly onReset: () => void;
  readonly onShuffle: () => void;
  readonly isSpinning?: boolean;
}

export function WheelManagement({
  onReset,
  onShuffle,
  isSpinning = false,
}: WheelManagementProps): JSX.Element {
  return (
    <div className="flex gap-2">
      <Button 
        onClick={onReset} 
        variant="outline" 
        className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
        size="sm"
        disabled={isSpinning}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Reset
      </Button>

      <Button 
        onClick={onShuffle} 
        variant="outline" 
        className="flex-1"
        size="sm"
        disabled={isSpinning}
      >
        <Shuffle className="mr-2 h-4 w-4" />
        Shuffle
      </Button>
    </div>
  );
}
