import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

interface ScoreProps {
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  currentPlayer: 'PLAYER_1' | 'PLAYER_2';
}

const PULSE_SIZE = 8;

export const Score: React.FC<ScoreProps> = ({
  player1Name,
  player2Name,
  player1Score,
  player2Score,
  currentPlayer,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, [currentPlayer]);

  return (
    <View style={styles.container}>
      {/* Player 1 */}
      <View style={[styles.playerCard, currentPlayer === 'PLAYER_1' && styles.activeCard]}>
        {currentPlayer === 'PLAYER_1' && (
          <Animated.View style={[styles.turnDot, styles.dotBlue, { transform: [{ scale: pulseAnim }] }]} />
        )}
        <Text style={styles.playerName} numberOfLines={1}>{player1Name}</Text>
        <Text style={[styles.playerScore, styles.scoreBlue]}>{player1Score}</Text>
        <Text style={styles.label}>điểm</Text>
      </View>

      {/* VS Center */}
      <View style={styles.vsContainer}>
        <Text style={styles.vsText}>VS</Text>
        <Text style={styles.vanBan}>Ô Ăn Quan</Text>
      </View>

      {/* Player 2 */}
      <View style={[styles.playerCard, currentPlayer === 'PLAYER_2' && styles.activeCard]}>
        {currentPlayer === 'PLAYER_2' && (
          <Animated.View style={[styles.turnDot, styles.dotRed, { transform: [{ scale: pulseAnim }] }]} />
        )}
        <Text style={styles.playerName} numberOfLines={1}>{player2Name}</Text>
        <Text style={[styles.playerScore, styles.scoreRed]}>{player2Score}</Text>
        <Text style={styles.label}>điểm</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginHorizontal: 8,
  },
  playerCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 12,
    position: 'relative',
  },
  activeCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  turnDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: PULSE_SIZE,
    height: PULSE_SIZE,
    borderRadius: PULSE_SIZE / 2,
  },
  dotBlue: { backgroundColor: '#4fc3f7' },
  dotRed: { backgroundColor: '#ef9a9a' },
  playerName: {
    color: '#e8eaf6',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
    maxWidth: 100,
  },
  playerScore: {
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 40,
  },
  scoreBlue: { color: '#4fc3f7' },
  scoreRed: { color: '#ef9a9a' },
  label: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '500',
  },
  vsContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  vsText: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  vanBan: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 2,
  },
});
