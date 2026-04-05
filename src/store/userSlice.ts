import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  player1Name: string;
  player2Name: string;
  socketId: string | null;
}

const initialState: UserState = {
  player1Name: 'Người chơi 1',
  player2Name: 'Người chơi 2',
  socketId: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setPlayer1Name: (state, action: PayloadAction<string>) => {
      state.player1Name = action.payload;
    },
    setPlayer2Name: (state, action: PayloadAction<string>) => {
      state.player2Name = action.payload;
    },
    setSocketId: (state, action: PayloadAction<string | null>) => {
      state.socketId = action.payload;
    },
  },
});

export const { setPlayer1Name, setPlayer2Name, setSocketId } = userSlice.actions;
export default userSlice.reducer;
