import { SocketService } from '../services/SocketService';
import { store } from '../store/store';
import {
  setConnectionStatus,
  setRoom,
  setOpponentName,
  setOnlineError,
  leaveRoom,
} from '../store/onlineSlice';
import { setSocketId } from '../store/userSlice';
import { setMessage } from '../store/gameSlice';
import { playTurn } from './GameController';
import { ENV } from '../config/env';
import type { Direction } from '../types';

export const OnlineController = {
  async connect(): Promise<void> {
    store.dispatch(setConnectionStatus('connecting'));

    SocketService.callbacks = {
      onConnect: (socketId) => {
        store.dispatch(setConnectionStatus('connected'));
        store.dispatch(setSocketId(socketId));
      },
      onDisconnect: () => {
        store.dispatch(setConnectionStatus('disconnected'));
        store.dispatch(setSocketId(null));
      },
      onError: (msg) => {
        store.dispatch(setConnectionStatus('error'));
        store.dispatch(setOnlineError(msg));
      },
      onRoomCreated: (roomId) => {
        store.dispatch(setRoom({ roomId, isHost: true }));
        store.dispatch(setMessage(`Phòng ${roomId} đã tạo. Chờ đối thủ...`));
      },
      onRoomJoined: (roomId, opponentName) => {
        store.dispatch(setRoom({ roomId, isHost: false }));
        store.dispatch(setOpponentName(opponentName));
        store.dispatch(setMessage(`Đã vào phòng! Đối thủ: ${opponentName}`));
      },
      onOpponentMove: async (move) => {
        await playTurn(move.pitId, move.direction);
      },
      onOpponentLeft: () => {
        store.dispatch(leaveRoom());
        store.dispatch(setMessage('Đối thủ đã rời phòng!'));
      },
    };

    await SocketService.connect(ENV.SOCKET_URL);
  },

  createRoom(playerName: string) {
    SocketService.createRoom(playerName);
  },

  joinRoom(roomId: string, playerName: string) {
    SocketService.joinRoom(roomId, playerName);
  },

  getRooms() {
    SocketService.getRooms();
  },

  sendMove(pitId: number, direction: Direction) {
    const state = store.getState();
    const socketId = state.user.socketId ?? '';
    SocketService.sendMove({ pitId, direction, playerId: socketId });
  },

  disconnect() {
    SocketService.leaveRoom();
    SocketService.disconnect();
    store.dispatch(leaveRoom());
    store.dispatch(setConnectionStatus('disconnected'));
  },
};
