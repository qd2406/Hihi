// ============================================================
// Constants – game board, stone counts, animation timings
// ============================================================

// Board layout
export const TOTAL_PITS = 12;
export const QUAN_1 = 0;   // Left Mandarin pit  (Player 1 side)
export const QUAN_2 = 6;   // Right Mandarin pit (Player 2 side)

// Player pit indices (excluding Quan pits)
export const PLAYER_1_PITS = [1, 2, 3, 4, 5];  // bottom row
export const PLAYER_2_PITS = [7, 8, 9, 10, 11]; // top row
export const ALL_DAN_PITS = [...PLAYER_1_PITS, ...PLAYER_2_PITS];

// Initial stone counts per standard rules
export const INITIAL_DAN_STONES = 5;
export const INITIAL_QUAN_STONES = 10;

// Animation & timing
export const ANIMATION_DELAY_MS = 280;
export const AI_TURN_DELAY_MS = 900;

// Online
export const SOCKET_RECONNECT_ATTEMPTS = 5;
export const ROOM_CODE_LENGTH = 6;
