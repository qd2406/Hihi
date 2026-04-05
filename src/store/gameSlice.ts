import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { GameState, PitData, Player, GameMode, Difficulty } from '../types';
import {
  TOTAL_PITS,
  QUAN_1,
  QUAN_2,
  INITIAL_DAN_STONES,
  INITIAL_QUAN_STONES,
} from '../utils/constants';

// ── Helper ────────────────────────────────────────────────────────────────────

const generateInitialBoard = (): PitData[] => {
  const board: PitData[] = [];
  for (let i = 0; i < TOTAL_PITS; i++) {
    if (i === QUAN_1 || i === QUAN_2) {
      board.push({
        id: i,
        type: 'QUAN',
        stones: INITIAL_QUAN_STONES,
        owner: i === QUAN_1 ? 'PLAYER_1' : 'PLAYER_2',
      });
    } else {
      board.push({
        id: i,
        type: 'DAN',
        stones: INITIAL_DAN_STONES,
        // Pits 1‑5: Player 1 (bottom row)  |  Pits 7‑11: Player 2 (top row)
        owner: i > QUAN_1 && i < QUAN_2 ? 'PLAYER_1' : 'PLAYER_2',
      });
    }
  }
  return board;
};

// ── Initial state ─────────────────────────────────────────────────────────────

const initialState: GameState = {
  board: generateInitialBoard(),
  currentPlayer: 'PLAYER_1',
  scores: { PLAYER_1: 0, PLAYER_2: 0 },
  winner: null,
  gameMode: null,
  difficulty: 'MEDIUM',
  isAnimating: false,
  selectedPit: null,
  message: 'Bắt đầu trò chơi!',
  animatingPit: null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameMode: (state, action: PayloadAction<GameMode>) => {
      state.gameMode = action.payload;
      state.board = generateInitialBoard();
      state.scores = { PLAYER_1: 0, PLAYER_2: 0 };
      state.currentPlayer = 'PLAYER_1';
      state.winner = null;
      state.message = 'Người chơi 1 bắt đầu!';
      state.selectedPit = null;
      state.isAnimating = false;
      state.animatingPit = null;
    },
    setDifficulty: (state, action: PayloadAction<Difficulty>) => {
      state.difficulty = action.payload;
    },
    updateBoard: (state, action: PayloadAction<PitData[]>) => {
      state.board = action.payload;
    },
    updateScores: (state, action: PayloadAction<Record<Player, number>>) => {
      state.scores = action.payload;
    },
    switchPlayer: (state) => {
      state.currentPlayer =
        state.currentPlayer === 'PLAYER_1' ? 'PLAYER_2' : 'PLAYER_1';
      state.selectedPit = null;
    },
    setWinner: (state, action: PayloadAction<Player | 'DRAW'>) => {
      state.winner = action.payload;
    },
    resetGame: (state) => {
      state.board = generateInitialBoard();
      state.scores = { PLAYER_1: 0, PLAYER_2: 0 };
      state.currentPlayer = 'PLAYER_1';
      state.winner = null;
      state.message = 'Người chơi 1 bắt đầu!';
      state.selectedPit = null;
      state.isAnimating = false;
      state.animatingPit = null;
    },
    setIsAnimating: (state, action: PayloadAction<boolean>) => {
      state.isAnimating = action.payload;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    setSelectedPit: (state, action: PayloadAction<number | null>) => {
      state.selectedPit = action.payload;
    },
    setAnimatingPit: (state, action: PayloadAction<number | null>) => {
      state.animatingPit = action.payload;
    },
  },
});

export const {
  setGameMode,
  setDifficulty,
  updateBoard,
  updateScores,
  switchPlayer,
  setWinner,
  resetGame,
  setIsAnimating,
  setMessage,
  setSelectedPit,
  setAnimatingPit,
} = gameSlice.actions;

export default gameSlice.reducer;
