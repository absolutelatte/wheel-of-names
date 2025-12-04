'use client';

import { useCallback } from 'react';

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
      const newParticipants = event.target.value
        .split('\n')
        .filter((p) => p.trim().length > 0);
      onParticipantsChange(newParticipants);
    },
    [onParticipantsChange]
  );

  return (
    <textarea
      value={participants.join('\n')}
      onChange={handleChange}
      disabled={disabled}
      placeholder="One username per line"
      className="flex-1 min-h-0 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 scrollbar-thin"
      aria-label="Participants list"
    />
  );
}
