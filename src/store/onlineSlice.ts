import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ConnectionStatus, Room } from '../types';

interface OnlineState {
  connectionStatus: ConnectionStatus;
  roomId: string | null;
  isHost: boolean;
  opponentName: string | null;
  rooms: Room[];        
  error: string | null;
}

const initialState: OnlineState = {
  connectionStatus: 'disconnected',
  roomId: null,
  isHost: false,
  opponentName: null,
  rooms: [],
  error: null,
};

export const onlineSlice = createSlice({
  name: 'online',
  initialState,
  reducers: {
    setConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
      state.connectionStatus = action.payload;
    },
    setRoom: (state, action: PayloadAction<{ roomId: string; isHost: boolean }>) => {
      state.roomId = action.payload.roomId;
      state.isHost = action.payload.isHost;
    },
    setOpponentName: (state, action: PayloadAction<string | null>) => {
      state.opponentName = action.payload;
    },
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
    },
    setOnlineError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    leaveRoom: (state) => {
      state.roomId = null;
      state.isHost = false;
      state.opponentName = null;
    },
    resetOnline: () => initialState,
  },
});

export const {
  setConnectionStatus,
  setRoom,
  setOpponentName,
  setRooms,
  setOnlineError,
  leaveRoom,
  resetOnline,
} = onlineSlice.actions;

export default onlineSlice.reducer;
