import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import userReducer from './userSlice';
import onlineReducer from './onlineSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    user: userReducer,
    online: onlineReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
