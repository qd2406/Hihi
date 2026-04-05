import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootState } from '../store/store';
import type { RootStackParamList } from '../types';
import { resetGame } from '../store/gameSlice';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, Radius } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Result'>;

export const ResultScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch();
  const gameState = useSelector((s: RootState) => s.game);
  const userState = useSelector((s: RootState) => s.user);

  const getName = (p: 'PLAYER_1' | 'PLAYER_2') =>
    p === 'PLAYER_1' ? userState.player1Name : userState.player2Name;

  const winnerLabel =
    gameState.winner === 'DRAW'
      ? 'Hòa nhau! 🤝'
      : `🏆 ${getName(gameState.winner ?? 'PLAYER_1')} thắng!`;

  const winnerColor =
    gameState.winner === 'DRAW'
      ? Colors.warning
      : gameState.winner === 'PLAYER_1'
      ? Colors.player1
      : Colors.player2;

  const handlePlayAgain = () => {
    dispatch(resetGame());
    navigation.navigate('Game');
  };

  return (
    <LinearGradient colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]} style={s.gradient}>
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.scroll}>
          <Text style={s.titleEmoji}>🎎</Text>
          <Text style={s.title}>Kết thúc trận!</Text>

          <View style={[s.resultBadge, { borderColor: winnerColor }]}>
            <Text style={[s.resultText, { color: winnerColor }]}>{winnerLabel}</Text>
          </View>

          {/* Score cards */}
          <View style={s.scoreRow}>
            {(['PLAYER_1', 'PLAYER_2'] as const).map((p) => (
              <View key={p} style={[s.scoreCard, { borderColor: p === 'PLAYER_1' ? Colors.player1 : Colors.player2 }]}>
                <Text style={s.scoreName}>{getName(p)}</Text>
                <Text style={[s.scoreNum, { color: p === 'PLAYER_1' ? Colors.player1 : Colors.player2 }]}>
                  {gameState.scores[p]}
                </Text>
                <Text style={s.scoreLabel}>quân</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={s.actions}>
            <TouchableOpacity style={s.primaryBtn} onPress={handlePlayAgain} activeOpacity={0.85}>
              <Text style={s.primaryBtnText}>🔄 Chơi lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.secondaryBtn} onPress={() => navigation.navigate('ModeSelect')} activeOpacity={0.75}>
              <Text style={s.secondaryBtnText}>Đổi chế độ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.secondaryBtn} onPress={() => navigation.navigate('Login')} activeOpacity={0.75}>
              <Text style={s.secondaryBtnText}>Màn hình chính</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const s = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl, gap: Spacing.lg },
  titleEmoji: { fontSize: 72 },
  title: { fontSize: Typography.xxl, fontWeight: Typography.black, color: Colors.textPrimary },
  resultBadge: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: Radius.xl, borderWidth: 2, backgroundColor: Colors.bgCard },
  resultText: { fontSize: Typography.xl, fontWeight: Typography.black, textAlign: 'center' },
  scoreRow: { flexDirection: 'row', gap: Spacing.lg },
  scoreCard: { flex: 1, backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: 'center', borderWidth: 1.5 },
  scoreName: { fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textSecondary, marginBottom: Spacing.xs },
  scoreNum: { fontSize: Typography.title, fontWeight: Typography.black },
  scoreLabel: { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 2 },
  actions: { width: '100%', gap: Spacing.sm },
  primaryBtn: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: Spacing.md, alignItems: 'center' },
  primaryBtnText: { fontSize: Typography.lg, fontWeight: Typography.bold, color: '#000' },
  secondaryBtn: { alignItems: 'center', paddingVertical: Spacing.sm, backgroundColor: Colors.bgCard, borderRadius: Radius.full },
  secondaryBtnText: { fontSize: Typography.md, color: Colors.textSecondary },
});
