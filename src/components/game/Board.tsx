import React from 'react';
import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';
import type { PitData, Direction, GameMode } from '../../types';
import { Pit } from './Pit';

interface BoardProps {
  board: PitData[];
  onPitClick: (pitId: number, direction: Direction) => void;
  currentPlayer: 'PLAYER_1' | 'PLAYER_2';
  isAnimating: boolean;
  animatingPit: number | null;
  /** Chế độ chơi — dùng để quyết định có xoay ô P2 không */
  gameMode?: GameMode | null;
  /** ID ô đang được chọn (hiện mũi tên) — chỉ 1 ô cùng lúc */
  selectedPitId?: number | null;
  /** Callback khi người chơi chọn/bỏ chọn 1 ô */
  onSelectPit?: (pitId: number | null) => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  onPitClick,
  currentPlayer,
  isAnimating,
  animatingPit,
  gameMode = null,
  selectedPitId = null,
  onSelectPit,
}) => {
  const { width } = useWindowDimensions();
  // Recalculate pit size responsively on orientation change
  const BOARD_PADDING = 24;
  const PIT_GAP = 4;
  const danPitSize = Math.min(Math.floor((width - BOARD_PADDING * 2 - PIT_GAP * 6) / 7), 72);
  const quanPitWidth = danPitSize;
  const quanPitHeight = danPitSize * 2 + PIT_GAP;
  // Board layout:
  // ┌─────────────────────────────────────┐
  // │  [Q1]  [11][10][9][8][7]  [Q2]     │  ← Player 2 row (top, reversed)
  // │                                     │
  // │  [Q1]  [1][2][3][4][5]   [Q2]      │  ← Player 1 row (bottom)
  // └─────────────────────────────────────┘
  // Q1 = pit 0 (left, spans both rows), Q2 = pit 6 (right, spans both rows)

  const quan1 = board[0];
  const quan2 = board[6];

  // Player 2 pits (top row) displayed from left→right as 11,10,9,8,7 for CW feel
  const topRow = [board[11], board[10], board[9], board[8], board[7]];
  // Player 1 pits (bottom row) displayed left→right as 1,2,3,4,5
  const bottomRow = [board[1], board[2], board[3], board[4], board[5]];

  // Chỉ xoay ô P2 cho chế độ PvP (2 người ngồi đối diện)
  const isPvP = gameMode === 'PvP';

  const isPitDisabled = (pit: PitData): boolean => {
    if (isAnimating) return true;
    if (pit.type === 'QUAN') return true;
    if (pit.owner !== currentPlayer) return true;
    if (pit.stones === 0) return true;
    return false;
  };

  return (
    <View style={styles.boardWrapper}>
      {/* Wooden board background */}
      <View style={styles.boardSurface}>
        {/* Row labels */}
        <Text style={[styles.rowLabel, { top: 6, left: 8 }]}>P2</Text>
        <Text style={[styles.rowLabel, { bottom: 6, left: 8 }]}>P1</Text>

        <View style={styles.boardInner}>
          {/* Left Quan — spans both rows */}
          <View style={styles.quanColumn}>
            <Pit
              pit={quan1}
              onClick={() => {}}
              disabled={true}
              isAnimating={animatingPit === 0}
              danPitSize={danPitSize}
              quanPitWidth={quanPitWidth}
              quanPitHeight={quanPitHeight}
            />
          </View>

          {/* 5 columns of dan pits */}
          <View style={styles.danColumns}>
            {/* Top row: Player 2, indices 11→7 */}
            <View style={styles.row}>
              {topRow.map((pit) => (
                <Pit
                  key={pit.id}
                  pit={pit}
                  onClick={(dir) => onPitClick(pit.id, dir)}
                  disabled={isPitDisabled(pit)}
                  isAnimating={animatingPit === pit.id}
                  danPitSize={danPitSize}
                  quanPitWidth={quanPitWidth}
                  quanPitHeight={quanPitHeight}
                  flipped={true}
                  rotateForOpponent={isPvP}
                  isSelected={selectedPitId === pit.id}
                  onSelect={onSelectPit}
                />
              ))}
            </View>

            {/* Separator line */}
            <View style={styles.divider} />

            {/* Bottom row: Player 1, indices 1→5 */}
            <View style={styles.row}>
              {bottomRow.map((pit) => (
                <Pit
                  key={pit.id}
                  pit={pit}
                  onClick={(dir) => onPitClick(pit.id, dir)}
                  disabled={isPitDisabled(pit)}
                  isAnimating={animatingPit === pit.id}
                  danPitSize={danPitSize}
                  quanPitWidth={quanPitWidth}
                  quanPitHeight={quanPitHeight}
                  isSelected={selectedPitId === pit.id}
                  onSelect={onSelectPit}
                />
              ))}
            </View>
          </View>

          {/* Right Quan — spans both rows */}
          <View style={styles.quanColumn}>
            <Pit
              pit={quan2}
              onClick={() => {}}
              disabled={true}
              isAnimating={animatingPit === 6}
              danPitSize={danPitSize}
              quanPitWidth={quanPitWidth}
              quanPitHeight={quanPitHeight}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boardWrapper: {
    marginHorizontal: 8,
    borderRadius: 20,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 14,
  },
  boardSurface: {
    backgroundColor: '#2d1a06',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#7a4d1e',
    paddingHorizontal: 8,
    paddingVertical: 12,
    position: 'relative',
  },
  boardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quanColumn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  danColumns: {
    flex: 1,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(200, 150, 80, 0.25)',
    marginHorizontal: 4,
  },
  rowLabel: {
    position: 'absolute',
    color: 'rgba(255,255,255,0.2)',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    zIndex: 0,
  },
});
