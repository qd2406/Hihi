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
  playerCount: number; 
}

export interface OnlineMove {
  pitId: number;
  direction: 'CW' | 'CCW';
  playerId: string; 
}

export type ClientEvent =
  | 'createRoom'
  | 'joinRoom'
  | 'leaveRoom'
  | 'sendMove'
  | 'getRooms';

export type ServerEvent =
  | 'roomCreated'
  | 'roomJoined'
  | 'roomLeft'
  | 'roomUpdate'
  | 'opponentMove'
  | 'roomList'
  | 'error';
