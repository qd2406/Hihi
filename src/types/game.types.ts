export type Player = 'PLAYER_1' | 'PLAYER_2';
export type PitType = 'DAN' | 'QUAN';
export type GameMode = 'PvP' | 'PvE' | 'Online';
export type Direction = 'CW' | 'CCW'; 
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface PitData {
  id: number;
  type: PitType;
  stones: number;
  owner: Player; 
}

export interface GameState {
  board: PitData[];
  currentPlayer: Player;
  scores: Record<Player, number>;
  winner: Player | 'DRAW' | null;
  gameMode: GameMode | null;
  difficulty: Difficulty;
  isAnimating: boolean;
  selectedPit: number | null;
  message: string;
  animatingPit: number | null;
}
