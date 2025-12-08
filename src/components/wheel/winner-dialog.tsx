'use client';

import type { JSX } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WinnerDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly winnerName: string;
  readonly onClose: () => void;
  readonly onRemove: () => void;
  readonly onRemoveAll: () => void;
}

export function WinnerDialog({
  open,
  onOpenChange,
  winnerName,
  onClose,
  onRemove,
  onRemoveAll,
}: WinnerDialogProps): JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            🎉 We Have a Winner!
          </DialogTitle>
        </DialogHeader>

        <div className="py-8 text-center">
          <span className="text-6xl mb-4 block">🏆</span>
          <p className="text-2xl font-bold break-words">{winnerName}</p>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="secondary" onClick={onRemove}>
            Remove
          </Button>
          <Button variant="destructive" onClick={onRemoveAll}>
            Remove All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
