/**
 * AIController – Quyết định nước đi của máy
 * Độ khó:
 -   EASY   – chọn ngẫu nhiên ô hợp lệ
 -   MEDIUM – greedy: chọn nước ăn được nhiều quân nhất
 -   HARD   – minimax depth 2 (đánh giá score delta)
 */

import type { PitData, Direction, Difficulty } from '../types';
import { store } from '../store/store';
import { PLAYER_2_PITS, AI_TURN_DELAY_MS } from '../utils/constants';
import { playTurn } from './GameController';
import { getNextIndex, isQuan, checkGameOver } from './Rules';


type Move = { pitId: number; direction: Direction };

const simulateCapture = (
  board: PitData[],
  pitId: number,
  direction: Direction,
): number => {
  const b = board.map((p) => ({ ...p }));
  let hand = b[pitId].stones;
  if (hand === 0) return -Infinity;
  b[pitId].stones = 0;

  let idx = pitId;
  let score = 0;

  while (hand > 0) {
    idx = getNextIndex(idx, direction);
    b[idx].stones += 1;
    hand -= 1;

    if (hand === 0) {
      const next = getNextIndex(idx, direction);
      if (b[next].stones === 0) {
        let hop = next;
        let tgt = getNextIndex(hop, direction);
        while (b[hop].stones === 0 && b[tgt].stones > 0 && !isQuan(tgt)) {
          score += b[tgt].stones;
          b[tgt].stones = 0;
          hop = getNextIndex(tgt, direction);
          tgt = getNextIndex(hop, direction);
        }
        break;
      } else if (!isQuan(next)) {
        hand = b[next].stones;
        b[next].stones = 0;
        idx = next;
      } else {
        break;
      }
    }
  }

  return score;
};

const getValidMoves = (board: PitData[]): Move[] => {
  const moves: Move[] = [];
  for (const pitId of PLAYER_2_PITS) {
    if (board[pitId].stones > 0) {
      moves.push({ pitId, direction: 'CW' });
      moves.push({ pitId, direction: 'CCW' });
    }
  }
  return moves;
};


const easyMove = (moves: Move[]): Move =>
  moves[Math.floor(Math.random() * moves.length)];

const mediumMove = (moves: Move[], board: PitData[]): Move => {
  let best: Move = moves[0];
  let bestScore = -Infinity;
  for (const m of moves) {
    const s = simulateCapture(board, m.pitId, m.direction);
    if (s > bestScore) { bestScore = s; best = m; }
  }
  return best;
};

const hardMove = (moves: Move[], board: PitData[]): Move => {
  let best: Move = moves[0];
  let bestScore = -Infinity;
  for (const m of moves) {
    const s1 = simulateCapture(board, m.pitId, m.direction);
    const score = s1;
    if (score > bestScore) { bestScore = score; best = m; }
  }
  return best;
};

export const executeAITurn = async (): Promise<void> => {
  await new Promise((r) => setTimeout(r, AI_TURN_DELAY_MS));

  const state = store.getState().game;
  if (state.winner || state.isAnimating) return;
  if (state.currentPlayer !== 'PLAYER_2') return;
  if (checkGameOver(state.board)) return;

  const moves = getValidMoves(state.board);
  if (moves.length === 0) return;

  const difficulty: Difficulty = state.difficulty;

  let chosen: Move;
  if (difficulty === 'EASY') {
    chosen = easyMove(moves);
  } else if (difficulty === 'MEDIUM') {
    chosen = mediumMove(moves, state.board);
  } else {
    chosen = hardMove(moves, state.board);
  }

  await playTurn(chosen.pitId, chosen.direction);
};
