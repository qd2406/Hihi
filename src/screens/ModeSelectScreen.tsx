import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Alert, BackHandler, Platform,
} from 'react-native';
import { BlurredBackground } from '../components/BlurredBackground';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootState } from '../store/store';
import type { RootStackParamList, Difficulty } from '../types';
import { setGameMode, setDifficulty } from '../store/gameSlice';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, Radius } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ModeSelect'>;

const MODES = [
  { key: 'PvP', icon: '👥', label: 'Hai người', desc: 'Cùng một thiết bị' },
  { key: 'PvE', icon: '🤖', label: 'Một mình', desc: 'Đấu với AI' },
  { key: 'Online', icon: '🌐', label: 'Online', desc: 'Chơi với bạn bè' },
] as const;

const DIFFS: { key: Difficulty; label: string; color: string }[] = [
  { key: 'EASY', label: 'Dễ', color: Colors.success },
  { key: 'MEDIUM', label: 'Vừa', color: Colors.warning },
  { key: 'HARD', label: 'Khó', color: Colors.danger },
];

export const ModeSelectScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<Nav>();
  const difficulty = useSelector((s: RootState) => s.game.difficulty);
  const [selectedMode, setSelectedMode] = useState<'PvP' | 'PvE' | 'Online'>('PvP');

  const handleStart = () => {
    dispatch(setGameMode(selectedMode));
    if (selectedMode === 'Online') {
      navigation.navigate('Lobby');
    } else {
      navigation.navigate('Game');
    }
  };

  return (
    <BlurredBackground>
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.scroll}>
          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
              <Text style={s.backText}>← Quay lại</Text>
            </TouchableOpacity>
            <Text style={s.title}>Chọn chế độ</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={s.backBtn}>
              <Text style={s.backText}>⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* Mode cards */}
          <View style={s.section}>
            {MODES.map((m) => (
              <TouchableOpacity
                key={m.key}
                style={[s.modeCard, selectedMode === m.key && s.modeCardActive]}
                onPress={() => setSelectedMode(m.key)}
                activeOpacity={0.8}
              >
                <Text style={s.modeIcon}>{m.icon}</Text>
                <View style={s.modeText}>
                  <Text style={[s.modeLabel, selectedMode === m.key && s.modeLabelActive]}>{m.label}</Text>
                  <Text style={s.modeDesc}>{m.desc}</Text>
                </View>
                {selectedMode === m.key && <Text style={s.checkMark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>

          {/* Difficulty (PvE only) */}
          {selectedMode === 'PvE' && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Độ khó AI</Text>
              <View style={s.diffRow}>
                {DIFFS.map((d) => (
                  <TouchableOpacity
                    key={d.key}
                    style={[s.diffBtn, { borderColor: d.color }, difficulty === d.key && { backgroundColor: d.color + '25' }]}
                    onPress={() => dispatch(setDifficulty(d.key))}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.diffLabel, { color: d.color }]}>{d.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Start */}
          <TouchableOpacity style={s.startBtn} onPress={handleStart} activeOpacity={0.85}>
            <Text style={s.startBtnText}>
              {selectedMode === 'Online' ? 'Vào sảnh →' : 'Bắt đầu →'}
            </Text>
          </TouchableOpacity>

          {/* Exit Game */}
          <TouchableOpacity
            style={s.exitBtn}
            onPress={() => {
              Alert.alert(
                'Thoát game',
                'Bạn có chắc muốn thoát khỏi game?',
                [
                  { text: 'Ở lại', style: 'cancel' },
                  {
                    text: 'Thoát',
                    style: 'destructive',
                    onPress: () => {
                      if (Platform.OS === 'android') {
                        BackHandler.exitApp();
                      }
                    },
                  },
                ],
              );
            }}
            activeOpacity={0.8}
          >
            <Text style={s.exitBtnText}>✕ Thoát Game</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </BlurredBackground>
  );
};

const s = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, padding: Spacing.lg, gap: Spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { padding: Spacing.sm, backgroundColor: Colors.bgCard, borderRadius: Radius.md },
  backText: { color: Colors.textSecondary, fontSize: Typography.md },
  title: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.primary },
  section: { gap: Spacing.sm },
  sectionTitle: { fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  modeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.md, gap: Spacing.md, borderWidth: 1, borderColor: Colors.bgCardBorder },
  modeCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryDim },
  modeIcon: { fontSize: 28 },
  modeText: { flex: 1, gap: 2 },
  modeLabel: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary },
  modeLabelActive: { color: Colors.primary },
  modeDesc: { fontSize: Typography.sm, color: Colors.textSecondary },
  checkMark: { fontSize: Typography.lg, color: Colors.primary, fontWeight: Typography.bold },
  diffRow: { flexDirection: 'row', gap: Spacing.sm },
  diffBtn: { flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.md, alignItems: 'center', borderWidth: 1.5 },
  diffLabel: { fontSize: Typography.md, fontWeight: Typography.bold },
  startBtn: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: Spacing.md + 2, alignItems: 'center', marginTop: Spacing.sm },
  startBtnText: { fontSize: Typography.lg, fontWeight: Typography.bold, color: '#000' },
  exitBtn: { alignItems: 'center', paddingVertical: Spacing.sm, marginTop: Spacing.xs },
  exitBtnText: { fontSize: Typography.sm, color: Colors.textMuted },
});
