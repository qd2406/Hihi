import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SETTINGS: '@oanquan/settings',
  STATS: '@oanquan/stats',
  PLAYER_NAMES: '@oanquan/playerNames',
} as const;

export interface StoredSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  language: 'vi' | 'en';
  showHints: boolean;
}

export interface StoredStats {
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
}

export interface StoredPlayerNames {
  player1Name: string;
  player2Name: string;
}


const save = async <T>(key: string, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('[StorageService] save error:', err);
  }
};

const load = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn('[StorageService] load error:', err);
    return fallback;
  }
};

export const StorageService = {
  saveSettings: (settings: StoredSettings) =>
    save(KEYS.SETTINGS, settings),

  loadSettings: (defaults: StoredSettings) =>
    load<StoredSettings>(KEYS.SETTINGS, defaults),

  saveStats: (stats: StoredStats) =>
    save(KEYS.STATS, stats),

  loadStats: () =>
    load<StoredStats>(KEYS.STATS, {
      wins: 0,
      losses: 0,
      draws: 0,
      gamesPlayed: 0,
    }),

  savePlayerNames: (names: StoredPlayerNames) =>
    save(KEYS.PLAYER_NAMES, names),

  loadPlayerNames: () =>
    load<StoredPlayerNames>(KEYS.PLAYER_NAMES, {
      player1Name: 'Người chơi 1',
      player2Name: 'Người chơi 2',
    }),

  clearAll: () => AsyncStorage.clear(),
};
