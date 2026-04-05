/**
 * GameController – Điều khiển lượt đi và hoạt ảnh rải đá
 *
 * BUG FIX: Redux Toolkit (Immer) FREEZES mọi object được đưa vào store.
 * Nếu ta dispatch một array rồi tiếp tục mutate những object CÙNG reference
 * trong array đó, sẽ bị lỗi "Cannot assign to read only property" im lặng
 * → vòng lặp chết sau bước 1, isAnimating kẹt = true.
 *
 * FIX: Luôn dispatch một BẢN SAO SÂU (deep clone) để Redux nhận object
 * riêng và có thể freeze thoải mái, trong khi biến cục bộ vẫn mutable.
 */

import type { PitData, Direction, Player } from '../types';
import { getNextIndex, isQuan, checkGameOver, canPlay, borrowStones } from './Rules';
import { store } from '../store/store';
import {
  updateBoard,
  updateScores,
  switchPlayer,
  setWinner,
  setIsAnimating,
  setMessage,
  setAnimatingPit,
} from '../store/gameSlice';
import { ANIMATION_DELAY_MS } from '../utils/constants';

// ── Helpers ───────────────────────────────────────────────────────────────────

const delay = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));

/** Tạo bản sao sâu của mảng board để dispatch an toàn với Immer */
const cloneBoard = (board: PitData[]): PitData[] =>
  board.map((p) => ({ ...p }));

// ── playTurn ──────────────────────────────────────────────────────────────────

export const playTurn = async (startIndex: number, direction: Direction): Promise<void> => {
  const state = store.getState().game;
  if (state.isAnimating || state.winner) return;

  // Lấy bản sao mutable riêng – KHÔNG bao giờ chia sẻ reference với Redux store
  let board: PitData[] = cloneBoard(state.board);
  let scores = { ...state.scores };
  const currentPlayer = state.currentPlayer;

  // Nhặt đá từ ô đã chọn
  let hand = board[startIndex].stones;
  if (hand === 0) return;

  board[startIndex].stones = 0;

  store.dispatch(setIsAnimating(true));
  store.dispatch(updateBoard(cloneBoard(board)));   // dispatch bản sao, giữ board local mutable

  const playerStr = currentPlayer === 'PLAYER_1' ? '1' : '2';
  store.dispatch(setMessage(`Người chơi ${playerStr} đang rải...`));

  let idx = startIndex;

  // ── Vòng lặp rải đá ──────────────────────────────────────────────────────
  while (hand > 0) {
    await delay(ANIMATION_DELAY_MS);

    idx = getNextIndex(idx, direction);
    board[idx].stones += 1;   // mutate local copy safely
    hand -= 1;

    store.dispatch(setAnimatingPit(idx));
    store.dispatch(updateBoard(cloneBoard(board))); // dispatch deep clone mỗi bước

    if (hand === 0) {
      // Hết đá trong tay – kiểm tra tiếp theo
      await delay(ANIMATION_DELAY_MS / 2);
      store.dispatch(setAnimatingPit(null));

      const nextIdx = getNextIndex(idx, direction);

      if (board[nextIdx].stones === 0) {
        // Ô tiếp theo trống → thử ăn
        let hop = nextIdx;
        let tgt = getNextIndex(hop, direction);

        while (
          board[hop].stones === 0 &&
          board[tgt].stones > 0
          // Không có điều kiện !isQuan: ô quan CÓ THỂ bị ăn
        ) {
          const isQuanCapture = isQuan(tgt);
          const label = isQuanCapture
            ? `Người chơi ${playerStr} ăn QUAN!`
            : `Người chơi ${playerStr} ăn được!`;
          store.dispatch(setMessage(label));

          const captured = board[tgt].stones;
          scores[currentPlayer] += captured;
          board[tgt].stones = 0;

          store.dispatch(updateScores({ ...scores }));
          store.dispatch(updateBoard(cloneBoard(board)));
          await delay(ANIMATION_DELAY_MS);

          // Nếu vừa ăn Quan, dừng chuỗi ăn (không ăn qua Quan)
          if (isQuanCapture) break;

          hop = getNextIndex(tgt, direction);
          tgt = getNextIndex(hop, direction);
        }
        break; // Kết thúc lượt

      } else if (isQuan(nextIdx)) {
        // Gặp Quan → dừng lượt
        break;

      } else {
        // Ô tiếp theo có đá (không phải Quan) → nhặt tiếp
        hand = board[nextIdx].stones;
        board[nextIdx].stones = 0;
        idx = nextIdx;
        store.dispatch(updateBoard(cloneBoard(board)));
      }
    }
  }

  store.dispatch(setAnimatingPit(null));

  // ── Kiểm tra kết thúc ván ─────────────────────────────────────────────────
  if (checkGameOver(board)) {
    // Gom tất cả đá dan còn lại vào điểm tương ứng
    for (let i = 1; i <= 5; i++) {
      scores['PLAYER_1'] += board[i].stones;
      board[i].stones = 0;
    }
    for (let i = 7; i <= 11; i++) {
      scores['PLAYER_2'] += board[i].stones;
      board[i].stones = 0;
    }
    // Gom Quan còn lại (phòng trường hợp chỉ 1 Quan = 0)
    scores['PLAYER_1'] += board[0].stones; board[0].stones = 0;
    scores['PLAYER_2'] += board[6].stones; board[6].stones = 0;

    store.dispatch(updateScores({ ...scores }));
    store.dispatch(updateBoard(cloneBoard(board)));

    const winner: Player | 'DRAW' =
      scores['PLAYER_1'] > scores['PLAYER_2'] ? 'PLAYER_1' :
      scores['PLAYER_2'] > scores['PLAYER_1'] ? 'PLAYER_2' :
      'DRAW';

    store.dispatch(setWinner(winner));
    store.dispatch(setMessage('Kết thúc trò chơi!'));
  } else {
    // Kiểm tra người chơi tiếp theo có thể đi không
    const nextPlayer: Player = currentPlayer === 'PLAYER_1' ? 'PLAYER_2' : 'PLAYER_1';

    if (!canPlay(board, nextPlayer)) {
      // Không có quân → thử vay
      const { newBoard, newScores } = borrowStones(board, nextPlayer, scores);
      if (newScores[nextPlayer] < scores[nextPlayer]) {
        // Vay thành công
        board = newBoard;
        scores = newScores;
        store.dispatch(updateScores({ ...scores }));
        store.dispatch(updateBoard(cloneBoard(board)));
        store.dispatch(setMessage(
          `Người chơi ${nextPlayer === 'PLAYER_1' ? '1' : '2'} vay quân để tiếp tục!`,
        ));
      } else {
        // Không còn đủ để vay → kết thúc sớm
        // Gom đá còn lại
        for (let i = 1; i <= 5; i++) { scores['PLAYER_1'] += board[i].stones; board[i].stones = 0; }
        for (let i = 7; i <= 11; i++) { scores['PLAYER_2'] += board[i].stones; board[i].stones = 0; }
        // Gom Quan còn lại
        scores['PLAYER_1'] += board[0].stones; board[0].stones = 0;
        scores['PLAYER_2'] += board[6].stones; board[6].stones = 0;

        store.dispatch(updateScores({ ...scores }));
        store.dispatch(updateBoard(cloneBoard(board)));

        const winner: Player | 'DRAW' =
          scores['PLAYER_1'] > scores['PLAYER_2'] ? 'PLAYER_1' :
          scores['PLAYER_2'] > scores['PLAYER_1'] ? 'PLAYER_2' :
          'DRAW';
        store.dispatch(setWinner(winner));
        store.dispatch(setMessage('Kết thúc trò chơi!'));
        store.dispatch(setIsAnimating(false));
        return;
      }
    }

    store.dispatch(switchPlayer());
    const nextStr = nextPlayer === 'PLAYER_1' ? '1' : '2';
    store.dispatch(setMessage(`Lượt của Người chơi ${nextStr}!`));
  }

  store.dispatch(setIsAnimating(false));
};
