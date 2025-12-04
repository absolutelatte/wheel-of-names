'use client';

import type { JSX } from 'react';
import { useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ParticipantsListProps {
  readonly participants: readonly string[];
  readonly onParticipantsChange: (participants: readonly string[]) => void;
  readonly disabled?: boolean;
}

export function ParticipantsList({
  participants,
  onParticipantsChange,
  disabled = false,
}: ParticipantsListProps): JSX.Element {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
      const lines = event.target.value.split('\n');
      onParticipantsChange(lines);
    },
    [onParticipantsChange]
  );

  return (
    <div className="flex-1 relative h-full w-full">
      <textarea
        value={participants.join('\n')}
        onChange={handleChange}
        disabled={disabled}
        placeholder="Enter participants (one per line)"
        className={cn(
          "w-full h-full resize-none bg-background p-3 text-sm leading-relaxed",
          "border rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          "placeholder:text-muted-foreground/70",
          "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40",
          disabled && "opacity-50 cursor-not-allowed bg-muted/50 text-muted-foreground"
        )}
        spellCheck={false}
      />
      <div className="absolute bottom-2 right-2 pointer-events-none">
        {/* Optional overlay info or character count could go here */}
      </div>
    </div>
  );
}
