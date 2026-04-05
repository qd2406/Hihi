import type { PitData, Direction, Player } from '../types';
import { TOTAL_PITS, QUAN_1, QUAN_2 } from '../utils/constants';

export const isQuan = (index: number): boolean =>
  index === QUAN_1 || index === QUAN_2;

export const getNextIndex = (currentIndex: number, direction: Direction): number => {
  if (direction === 'CW') return (currentIndex + 1) % TOTAL_PITS;
  return (currentIndex - 1 + TOTAL_PITS) % TOTAL_PITS;
};

export const checkGameOver = (board: PitData[]): boolean => {
  return board[QUAN_1].stones === 0 && board[QUAN_2].stones === 0;
};

export const canPlay = (board: PitData[], player: Player): boolean => {
  const start = player === 'PLAYER_1' ? 1 : 7;
  for (let i = start; i < start + 5; i++) {
    if (board[i].stones > 0) return true;
  }
  return false;
};

/** 
 * Borrow stones from score when a player has no stones on board.
 * Place 1 stone on each of their 5 pits, deducted from score.
 */
export const borrowStones = (
  board: PitData[],
  player: Player,
  scores: Record<Player, number>,
): { newBoard: PitData[]; newScores: Record<Player, number> } => {
  const newBoard = board.map((p) => ({ ...p }));
  const newScores = { ...scores };
  const start = player === 'PLAYER_1' ? 1 : 7;

  // Borrow up to 5 stones from score
  const canBorrow = Math.min(5, newScores[player]);
  newScores[player] -= canBorrow;
  for (let i = start; i < start + canBorrow; i++) {
    newBoard[i].stones = 1;
  }
  return { newBoard, newScores };
};
