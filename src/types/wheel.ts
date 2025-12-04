export type WheelStatus = 'open' | 'closed';

export interface Participant {
  readonly name: string;
  readonly addedAt: Date;
}

export interface WheelState {
  readonly status: WheelStatus;
  readonly participants: readonly string[];
  readonly isLoading: boolean;
}

export interface WheelActions {
  readonly open: () => void;
  readonly close: () => void;
  readonly reset: () => void;
  readonly addParticipant: (name: string) => void;
  readonly removeParticipant: (name: string) => void;
  readonly setParticipants: (participants: readonly string[]) => void;
}

export type UseWheelReturn = WheelState & WheelActions;
