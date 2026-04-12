import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  language: 'vi' | 'en';
  showHints: boolean;       
}

const initialState: SettingsState = {
  soundEnabled: true,
  vibrationEnabled: true,
  animationSpeed: 'normal',
  language: 'vi',
  showHints: true,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    toggleVibration: (state) => {
      state.vibrationEnabled = !state.vibrationEnabled;
    },
    setAnimationSpeed: (
      state,
      action: PayloadAction<'slow' | 'normal' | 'fast'>
    ) => {
      state.animationSpeed = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'vi' | 'en'>) => {
      state.language = action.payload;
    },
    toggleHints: (state) => {
      state.showHints = !state.showHints;
    },
    resetSettings: () => initialState,
  },
});

export const {
  toggleSound,
  toggleVibration,
  setAnimationSpeed,
  setLanguage,
  toggleHints,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
