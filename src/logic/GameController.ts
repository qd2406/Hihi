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

const delay = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));

const cloneBoard = (board: PitData[]): PitData[] =>
  board.map((p) => ({ ...p }));


export const playTurn = async (startIndex: number, direction: Direction): Promise<void> => {
  const state = store.getState().game;
  if (state.isAnimating || state.winner) return;

  let board: PitData[] = cloneBoard(state.board);
  let scores = { ...state.scores };
  const currentPlayer = state.currentPlayer;

  let hand = board[startIndex].stones;
  if (hand === 0) return;

  board[startIndex].stones = 0;

  store.dispatch(setIsAnimating(true));
  store.dispatch(updateBoard(cloneBoard(board)));   

  const playerStr = currentPlayer === 'PLAYER_1' ? '1' : '2';
  store.dispatch(setMessage(`Người chơi ${playerStr} đang rải...`));

  let idx = startIndex;

  while (hand > 0) {
    await delay(ANIMATION_DELAY_MS);

    idx = getNextIndex(idx, direction);
    board[idx].stones += 1;   
    hand -= 1;

    store.dispatch(setAnimatingPit(idx));
    store.dispatch(updateBoard(cloneBoard(board))); 

    if (hand === 0) {
      await delay(ANIMATION_DELAY_MS / 2);
      store.dispatch(setAnimatingPit(null));

      const nextIdx = getNextIndex(idx, direction);

      if (board[nextIdx].stones === 0) {
        let hop = nextIdx;
        let tgt = getNextIndex(hop, direction);

        while (
          board[hop].stones === 0 &&
          board[tgt].stones > 0
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

          if (isQuanCapture) break;

          hop = getNextIndex(tgt, direction);
          tgt = getNextIndex(hop, direction);
        }
        break; 

      } else if (isQuan(nextIdx)) {
        break;

      } else {
        hand = board[nextIdx].stones;
        board[nextIdx].stones = 0;
        idx = nextIdx;
        store.dispatch(updateBoard(cloneBoard(board)));
      }
    }
  }

  store.dispatch(setAnimatingPit(null));
  if (checkGameOver(board)) {
    for (let i = 1; i <= 5; i++) {
      scores['PLAYER_1'] += board[i].stones;
      board[i].stones = 0;
    }
    for (let i = 7; i <= 11; i++) {
      scores['PLAYER_2'] += board[i].stones;
      board[i].stones = 0;
    }
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
    const nextPlayer: Player = currentPlayer === 'PLAYER_1' ? 'PLAYER_2' : 'PLAYER_1';

    if (!canPlay(board, nextPlayer)) {
      const { newBoard, newScores } = borrowStones(board, nextPlayer, scores);
      if (newScores[nextPlayer] < scores[nextPlayer]) {
        board = newBoard;
        scores = newScores;
        store.dispatch(updateScores({ ...scores }));
        store.dispatch(updateBoard(cloneBoard(board)));
        store.dispatch(setMessage(
          `Người chơi ${nextPlayer === 'PLAYER_1' ? '1' : '2'} vay quân để tiếp tục!`,
        ));
      } else {
        for (let i = 1; i <= 5; i++) { scores['PLAYER_1'] += board[i].stones; board[i].stones = 0; }
        for (let i = 7; i <= 11; i++) { scores['PLAYER_2'] += board[i].stones; board[i].stones = 0; }
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
