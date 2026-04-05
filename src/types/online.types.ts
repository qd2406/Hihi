// ============================================================
// Online / Multiplayer types
// ============================================================

export type RoomStatus = 'waiting' | 'playing' | 'finished';

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

export interface Room {
  id: string;
  hostName: string;
  status: RoomStatus;
  playerCount: number; // 1 or 2
}

export interface OnlineMove {
  pitId: number;
  direction: 'CW' | 'CCW';
  playerId: string; // socket id
}

// Socket events emitted by client
export type ClientEvent =
  | 'createRoom'
  | 'joinRoom'
  | 'leaveRoom'
  | 'sendMove'
  | 'getRooms';

// Socket events received from server
export type ServerEvent =
  | 'roomCreated'
  | 'roomJoined'
  | 'roomLeft'
  | 'roomUpdate'
  | 'opponentMove'
  | 'roomList'
  | 'error';
