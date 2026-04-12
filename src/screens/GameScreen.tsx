import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  Animated, TouchableOpacity, Alert, useWindowDimensions,
} from 'react-native';
import { BlurredBackground } from '../components/BlurredBackground';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootState } from '../store/store';
import type { RootStackParamList, Direction } from '../types';
import { Board } from '../components/game/Board';
import { Score } from '../components/game/Score';
import { playTurn } from '../logic/GameController';
import { executeAITurn } from '../logic/AIController';
import { OnlineController } from '../logic/OnlineController';
import { resetGame } from '../store/gameSlice';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, Radius } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Game'>;

export const GameScreen: React.FC = () => {
  const gameState = useSelector((s: RootState) => s.game);
  const userState = useSelector((s: RootState) => s.user);
  const onlineState = useSelector((s: RootState) => s.online);
  const dispatch = useDispatch();
  const navigation = useNavigation<Nav>();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const msgAnim = useRef(new Animated.Value(0)).current;
  const prevMsg = useRef(gameState.message);

  const [selectedPitId, setSelectedPitId] = useState<number | null>(null);

  useEffect(() => {
    setSelectedPitId(null);
  }, [gameState.currentPlayer, gameState.isAnimating]);

  useEffect(() => {
    if (gameState.winner) {
      const t = setTimeout(() => navigation.navigate('Result'), 1200);
      return () => clearTimeout(t);
    }
  }, [gameState.winner]);

  useEffect(() => {
    if (
      gameState.gameMode === 'PvE' &&
      gameState.currentPlayer === 'PLAYER_2' &&
      !gameState.winner &&
      !gameState.isAnimating
    ) {
      executeAITurn();
    }
  }, [gameState.currentPlayer, gameState.gameMode, gameState.winner, gameState.isAnimating]);

  useEffect(() => {
    if (gameState.message !== prevMsg.current) {
      prevMsg.current = gameState.message;
      msgAnim.setValue(0);
      Animated.spring(msgAnim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
    }
  }, [gameState.message]);

  const handlePitClick = (pitId: number, direction: Direction) => {
    setSelectedPitId(null); 
    if (gameState.isAnimating || gameState.winner) return;
    const pit = gameState.board[pitId];
    if (pit.owner !== gameState.currentPlayer) return;

    if (gameState.gameMode === 'Online') {
      const amHost = onlineState.isHost;
      const isMyTurn = amHost
        ? gameState.currentPlayer === 'PLAYER_1'
        : gameState.currentPlayer === 'PLAYER_2';
      if (!isMyTurn) return;
      playTurn(pitId, direction).then(() => {
        OnlineController.sendMove(pitId, direction);
      });
      return;
    }

    playTurn(pitId, direction);
  };

  const handleExitGame = () => {
    Alert.alert(
      'Thoát ván',
      'Bạn có muốn thoát về menu chính? Ván đấu hiện tại sẽ bị hủy.',
      [
        { text: 'Tiếp tục chơi', style: 'cancel' },
        {
          text: 'Thoát',
          style: 'destructive',
          onPress: () => {
            dispatch(resetGame());
            navigation.navigate('Login');
          },
        },
      ],
    );
  };

  const player2Name =
    gameState.gameMode === 'PvE'
      ? `AI (${gameState.difficulty})`
      : gameState.gameMode === 'Online'
      ? (onlineState.opponentName ?? 'Đối thủ')
      : userState.player2Name;

  const isPvP = gameState.gameMode === 'PvP';

  const msgScale = msgAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });

  if (isLandscape) {
    const isP1Turn = gameState.currentPlayer === 'PLAYER_1';
    return (
      <BlurredBackground>
        <SafeAreaView style={s.safe}>
          <View style={s.landscapeRoot}>

            <View style={s.lsHeader}>
              <TouchableOpacity onPress={handleExitGame} style={s.backBtn}>
                <Text style={s.backText}>✕ Thoát</Text>
              </TouchableOpacity>
              <Animated.View style={[s.msgContainer, s.msgLandscape, { transform: [{ scale: msgScale }] }]}>
                <Text style={s.msgText}>{gameState.message}</Text>
              </Animated.View>
              <View style={[s.turnBadge, s.turnBadgeSm]}>
                <View style={[s.turnDot, !isP1Turn ? s.dotP2 : s.dotP1]} />
                <Text style={s.turnTextSm}>
                  {isP1Turn ? userState.player1Name : player2Name}
                </Text>
              </View>
            </View>

            <View style={[
              s.lsScoreBar,
              !isP1Turn && s.lsScoreBarActive,
              isPvP && { transform: [{ rotate: '180deg' }] },
            ]}>
              <Text style={[s.lsScoreNum, { color: Colors.player2 }]}>{gameState.scores.PLAYER_2}</Text>
              <Text style={s.lsScoreLabel}>điểm</Text>
              <Text style={s.lsScoreName} numberOfLines={1}>{player2Name}</Text>
            </View>

            <View style={[s.boardContainer, s.boardLandscape, gameState.isAnimating && s.boardAnimating]}>
              <Board
                board={gameState.board}
                onPitClick={handlePitClick}
                currentPlayer={gameState.currentPlayer}
                isAnimating={gameState.isAnimating}
                animatingPit={gameState.animatingPit}
                gameMode={gameState.gameMode}
                selectedPitId={selectedPitId}
                onSelectPit={setSelectedPitId}
              />
            </View>

            <View style={[s.lsScoreBar, isP1Turn && s.lsScoreBarActive]}>
              <Text style={s.lsScoreName} numberOfLines={1}>{userState.player1Name}</Text>
              <Text style={s.lsScoreLabel}>điểm</Text>
              <Text style={[s.lsScoreNum, { color: Colors.player1 }]}>{gameState.scores.PLAYER_1}</Text>
            </View>

          </View>
        </SafeAreaView>
      </BlurredBackground>
    );
  }

  return (
    <BlurredBackground>
      <SafeAreaView style={s.safe}>
        <View style={s.portraitRoot}>
          <View style={s.header}>
            <TouchableOpacity onPress={handleExitGame} style={s.backBtn}>
              <Text style={s.backText}>✕ Thoát ván</Text>
            </TouchableOpacity>
            <Text style={s.gameTitle}>Ô Ăn Quan</Text>
            <View style={{ width: 80 }} />
          </View>

          <Score
            player1Name={userState.player1Name}
            player2Name={player2Name}
            player1Score={gameState.scores.PLAYER_1}
            player2Score={gameState.scores.PLAYER_2}
            currentPlayer={gameState.currentPlayer}
          />

          <Animated.View style={[s.msgContainer, { transform: [{ scale: msgScale }] }]}>
            <Text style={s.msgText}>{gameState.message}</Text>
          </Animated.View>

          <View style={[s.boardContainer, gameState.isAnimating && s.boardAnimating]}>
            <Board
              board={gameState.board}
              onPitClick={handlePitClick}
              currentPlayer={gameState.currentPlayer}
              isAnimating={gameState.isAnimating}
              animatingPit={gameState.animatingPit}
              gameMode={gameState.gameMode}
              selectedPitId={selectedPitId}
              onSelectPit={setSelectedPitId}
            />
          </View>

          <View style={s.footer}>
            <View style={s.turnBadge}>
              <View style={[s.turnDot, gameState.currentPlayer === 'PLAYER_1' ? s.dotP1 : s.dotP2]} />
              <Text style={s.turnText}>
                Lượt: {gameState.currentPlayer === 'PLAYER_1' ? userState.player1Name : player2Name}
              </Text>
            </View>
            {gameState.isAnimating && <Text style={s.animHint}>Đang rải quân...</Text>}
          </View>
        </View>
      </SafeAreaView>
    </BlurredBackground>
  );
};

const s = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  portraitRoot: { flex: 1, paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: Spacing.lg, gap: Spacing.md, justifyContent: 'space-between', overflow: 'visible' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xs },
  landscapeRoot: { flex: 1, flexDirection: 'column', paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, gap: Spacing.xs },
  lsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm },
  msgLandscape: { flex: 1, paddingVertical: 4 },
  boardLandscape: { flex: 1 },
  lsScoreBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.bgCard, borderRadius: Radius.md, paddingVertical: 5, paddingHorizontal: Spacing.md, borderWidth: 1, borderColor: Colors.bgCardBorder },
  lsScoreBarActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryDim },
  lsScoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: Colors.bgCard, borderRadius: Radius.lg, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, gap: Spacing.md, borderWidth: 1, borderColor: Colors.bgCardBorder },
  lsScoreCard: { flex: 1, alignItems: 'center', borderRadius: Radius.md, paddingVertical: 4 },
  lsScoreActive: { backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  lsScoreName: { color: Colors.textSecondary, fontSize: Typography.xs, fontWeight: Typography.semiBold },
  lsScoreNum: { fontSize: 20, fontWeight: Typography.black, lineHeight: 24 },
  lsScoreLabel: { color: Colors.textMuted, fontSize: 9 },
  lsVs: { color: Colors.primary, fontSize: Typography.md, fontWeight: Typography.black },
  turnBadgeSm: { paddingHorizontal: Spacing.sm, paddingVertical: 4 },
  turnTextSm: { color: Colors.textPrimary, fontSize: Typography.sm, fontWeight: Typography.bold },
  backBtn: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.danger + '25', borderWidth: 1, borderColor: Colors.danger + '50' },
  backText: { color: Colors.danger, fontSize: Typography.sm, fontWeight: Typography.semiBold },
  gameTitle: { color: Colors.primary, fontSize: Typography.lg, fontWeight: Typography.black, letterSpacing: 1, textAlign: 'center' },
  msgContainer: { backgroundColor: Colors.primaryDim, borderRadius: Radius.md, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderWidth: 1, borderColor: Colors.primaryBorder, alignItems: 'center' },
  msgText: { color: Colors.primary, fontSize: Typography.sm, fontWeight: Typography.semiBold, textAlign: 'center' },
  boardContainer: { borderRadius: Radius.xl, overflow: 'visible' },
  boardAnimating: { opacity: 0.95 },
  footer: { alignItems: 'center', gap: Spacing.xs },
  turnBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.bgCard, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: Radius.full },
  turnDot: { width: 10, height: 10, borderRadius: 5 },
  dotP1: { backgroundColor: Colors.player1 },
  dotP2: { backgroundColor: Colors.player2 },
  turnText: { color: Colors.textPrimary, fontSize: Typography.md, fontWeight: Typography.bold },
  animHint: { color: Colors.textMuted, fontSize: Typography.xs, fontStyle: 'italic' },
});
