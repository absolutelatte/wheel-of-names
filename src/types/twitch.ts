export interface TwitchUser {
  readonly username: string;
  readonly displayName: string;
  readonly id: string;
}

export interface TwitchFlags {
  readonly broadcaster: boolean;
  readonly mod: boolean;
  readonly subscriber: boolean;
  readonly vip: boolean;
}

export interface ChatCommand {
  readonly user: string;
  readonly command: string;
  readonly message: string;
  readonly flags: TwitchFlags;
}

export interface TwitchChatConfig {
  readonly channel: string;
  readonly onCommand?: (command: ChatCommand) => void;
  readonly onConnect?: () => void;
  readonly onError?: (error: Error) => void;
}
