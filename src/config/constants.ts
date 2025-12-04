export const WHEEL_URL = 'https://pickerwheel.com/emb';

export const MAX_PARTICIPANTS = 100;

export const CHANNEL_REGEX = /^[A-Za-z0-9_]{3,25}$/;

export const STORAGE_KEYS = {
  PARTICIPANTS: 'participants',
  THEME: 'theme',
  APP_VERSION: 'app_version',
} as const;

export const APP_VERSION = '2.0.0';

export const TWITCH_COMMANDS = {
  JOIN: 'join',
  OPEN_WHEEL: 'openwheel',
  CLOSE_WHEEL: 'closewheel',
} as const;
