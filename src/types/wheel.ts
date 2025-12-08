export type WheelStatus = 'open' | 'closed' | 'spinning';

export interface WheelSettings {
  readonly volume: number;
  readonly spinTime: number;
  readonly maxVisible: number;
  readonly allowDuplicates: boolean;
}

export interface WheelMetadata {
  readonly title: string;
  readonly description: string;
}

export interface WheelColors {
  readonly light: readonly string[];
  readonly dark: readonly string[];
}

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
  readonly removeAllInstances: (name: string) => void;
  readonly setParticipants: (participants: readonly string[]) => void;
}

export type UseWheelReturn = WheelState & WheelActions;
