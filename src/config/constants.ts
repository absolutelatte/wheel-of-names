export const MAX_PARTICIPANTS = 500;

export const CHANNEL_REGEX = /^[A-Za-z0-9_]{3,25}$/;

export const STORAGE_KEYS = {
  PARTICIPANTS: 'participants',
  THEME: 'theme',
  APP_VERSION: 'app_version',
  WHEEL_SETTINGS: 'wheel_settings',
  WHEEL_METADATA: 'wheel_metadata',
} as const;

export const APP_VERSION = '2.0.0';

export const TWITCH_COMMANDS = {
  JOIN: 'join',
  OPEN_WHEEL: 'openwheel',
  CLOSE_WHEEL: 'closewheel',
} as const;

export const WHEEL_COLORS = {
  light: [
    '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  ],
  dark: [
    '#dc2626', '#ea580c', '#ca8a04', '#16a34a',
    '#0891b2', '#2563eb', '#7c3aed', '#db2777',
  ],
} as const;

export const DEFAULT_WHEEL_SETTINGS = {
  volume: 70,
  spinTime: 10,
  maxVisible: 100,
} as const;

export const DEFAULT_WHEEL_METADATA = {
  title: 'Twitch Wheel of Names',
  description: '',
} as const;
