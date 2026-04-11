import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Switch,
} from 'react-native';
import { BlurredBackground } from '../components/BlurredBackground';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { RootState } from '../store/store';
import {
  toggleSound, setAnimationSpeed, toggleHints, resetSettings,
} from '../store/settingsSlice';
import { MusicService } from '../services/MusicService';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, Radius } from '../theme/spacing';

export const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const settings = useSelector((s: RootState) => s.settings);

  const SPEEDS = ['slow', 'normal', 'fast'] as const;
  const SPEED_LABELS = { slow: 'Chậm', normal: 'Bình thường', fast: 'Nhanh' };

  const handleToggleSound = () => {
    const newValue = !settings.soundEnabled;
    dispatch(toggleSound());
    MusicService.setEnabled(newValue);
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
            <Text style={s.title}>⚙️ Cài đặt</Text>
            <View style={{ width: 80 }} />
          </View>

          {/* Sound */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Âm thanh</Text>
            <View style={s.row}>
              <Text style={s.rowLabel}>🔊 Âm thanh</Text>
              <Switch
                value={settings.soundEnabled}
                onValueChange={handleToggleSound}
                trackColor={{ false: Colors.bgCard, true: Colors.primary + '80' }}
                thumbColor={settings.soundEnabled ? Colors.primary : Colors.textMuted}
              />
            </View>
          </View>

          {/* Animation speed */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Tốc độ hoạt ảnh</Text>
            <View style={s.speedRow}>
              {SPEEDS.map((sp) => (
                <TouchableOpacity
                  key={sp}
                  style={[s.speedBtn, settings.animationSpeed === sp && s.speedBtnActive]}
                  onPress={() => dispatch(setAnimationSpeed(sp))}
                  activeOpacity={0.8}
                >
                  <Text style={[s.speedLabel, settings.animationSpeed === sp && s.speedLabelActive]}>
                    {SPEED_LABELS[sp]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Gameplay */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Lối chơi</Text>
            <View style={s.row}>
              <View>
                <Text style={s.rowLabel}> Gợi ý lượt đi</Text>
                <Text style={s.rowSub}>Tô sáng các ô hợp lệ</Text>
              </View>
              <Switch
                value={settings.showHints}
                onValueChange={() => { dispatch(toggleHints()); }}
                trackColor={{ false: Colors.bgCard, true: Colors.primary + '80' }}
                thumbColor={settings.showHints ? Colors.primary : Colors.textMuted}
              />
            </View>
          </View>

          {/* Reset */}
          <TouchableOpacity style={s.resetBtn} onPress={() => { dispatch(resetSettings()); MusicService.setEnabled(true); }} activeOpacity={0.8}>
            <Text style={s.resetBtnText}> Khôi phục mặc định</Text>
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
  card: { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.md, borderWidth: 1, borderColor: Colors.bgCardBorder },
  cardTitle: { fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontSize: Typography.md, color: Colors.textPrimary, fontWeight: Typography.medium },
  rowSub: { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 2 },
  separator: { height: 1, backgroundColor: Colors.bgCardBorder },
  speedRow: { flexDirection: 'row', gap: Spacing.sm },
  speedBtn: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.bgCardBorder },
  speedBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryDim },
  speedLabel: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: Typography.medium },
  speedLabelActive: { color: Colors.primary, fontWeight: Typography.bold },
  resetBtn: { alignItems: 'center', paddingVertical: Spacing.sm, backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.danger + '40' },
  resetBtnText: { fontSize: Typography.md, color: Colors.danger },
});
