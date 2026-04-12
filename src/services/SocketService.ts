import type { OnlineMove, Room } from '../types';

type SocketIO = {
  connected: boolean;
  id: string;
  on: (event: string, cb: (...args: unknown[]) => void) => void;
  off: (event: string, cb?: (...args: unknown[]) => void) => void;
  emit: (event: string, ...args: unknown[]) => void;
  disconnect: () => void;
};

type Callbacks = {
  onConnect?: (socketId: string) => void;
  onDisconnect?: () => void;
  onError?: (msg: string) => void;
  onRoomCreated?: (roomId: string) => void;
  onRoomJoined?: (roomId: string, opponentName: string) => void;
  onRoomList?: (rooms: Room[]) => void;
  onOpponentMove?: (move: OnlineMove) => void;
  onOpponentLeft?: () => void;
};

class SocketServiceClass {
  private socket: SocketIO | null = null;
  callbacks: Callbacks = {};

  async connect(url: string): Promise<void> {
    try {
      // Dynamic import – tree-shaken away in offline builds
      const { io } = await import('socket.io-client');
      this.socket = io(url, {
        transports: ['websocket'],
        reconnectionAttempts: 5,
        timeout: 10_000,
      }) as unknown as SocketIO;
      this._registerListeners();
    } catch (err) {
      console.warn('[SocketService] socket.io-client not available:', err);
      this.callbacks.onError?.('Không thể kết nối máy chủ.');
    }
  }

  private _registerListeners() {
    const s = this.socket;
    if (!s) return;

    s.on('connect', () => {
      this.callbacks.onConnect?.(s.id);
    });
    s.on('disconnect', () => {
      this.callbacks.onDisconnect?.();
    });
    s.on('connect_error', (err: unknown) => {
      this.callbacks.onError?.(`Lỗi kết nối: ${String(err)}`);
    });
    s.on('roomCreated', (roomId: unknown) => {
      this.callbacks.onRoomCreated?.(roomId as string);
    });
    s.on('roomJoined', (data: unknown) => {
      const { roomId, opponentName } = data as { roomId: string; opponentName: string };
      this.callbacks.onRoomJoined?.(roomId, opponentName);
    });
    s.on('roomList', (rooms: unknown) => {
      this.callbacks.onRoomList?.(rooms as Room[]);
    });
    s.on('opponentMove', (move: unknown) => {
      this.callbacks.onOpponentMove?.(move as OnlineMove);
    });
    s.on('opponentLeft', () => {
      this.callbacks.onOpponentLeft?.();
    });
    s.on('error', (msg: unknown) => {
      this.callbacks.onError?.(msg as string);
    });
  }

  createRoom(playerName: string) {
    this.socket?.emit('createRoom', { playerName });
  }

  joinRoom(roomId: string, playerName: string) {
    this.socket?.emit('joinRoom', { roomId, playerName });
  }

  leaveRoom() {
    this.socket?.emit('leaveRoom');
  }

  getRooms() {
    this.socket?.emit('getRooms');
  }

  sendMove(move: OnlineMove) {
    this.socket?.emit('sendMove', move);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const SocketService = new SocketServiceClass();
