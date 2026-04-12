import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView,
} from 'react-native';
import { BlurredBackground } from '../components/BlurredBackground';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, Radius } from '../theme/spacing';

const STEPS = [
  {
    icon: '🎯',
    title: 'Mục tiêu',
    body: 'Thu thập nhiều quân hơn đối thủ. Mỗi người có một hàng 5 ô "dân" và một ô "quan" lớn ở đầu hàng.',
  },
  {
    icon: '🖐️',
    title: 'Lượt đi',
    body: 'Chọn một ô có quân của bạn và hướng rải (theo hướng trái ← hoặc phải →). Quân sẽ được rải lần lượt sang các ô liền kề.',
  },
  {
    icon: '🍽️',
    title: 'Ăn quân',
    body: 'Nếu sau khi rải hết quân, ô tiếp theo trống và ô tiếp nữa có quân → bạn ăn hết quân trong ô đó! Tiếp tục kiểm tra xa hơn nếu vẫn đủ điều kiện.',
  },
  {
    icon: '♟️',
    title: 'Rải tiếp',
    body: 'Nếu ô tiếp theo có quân nhưng không phải ô quan → nhặt hết quân đó rải tiếp. Nếu là ô quan → dừng lượt.',
  },
  {
    icon: '🏁',
    title: 'Kết thúc',
    body: 'Trò chơi kết thúc khi cả hai ô quan đều hết quân. Quân còn lại trên hàng của bạn sẽ tính vào điểm của bạn. Ai nhiều điểm hơn thắng!',
  },
  {
    icon: '💡',
    title: 'Mẹo chơi',
    body: 'Hãy chú ý rải quân sao cho rơi vào trước ô trống → bạn sẽ ăn được nhiều ô liên tiếp. Kiểm soát ô quan là chìa khóa chiến thắng!',
  },
];

export const TutorialScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <BlurredBackground>
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={s.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
              <Text style={s.backText}>← Quay lại</Text>
            </TouchableOpacity>
            <Text style={s.title}>📖 Hướng dẫn</Text>
            <View style={{ width: 80 }} />
          </View>

          <Text style={s.intro}>
            Ô Ăn Quan là trò chơi dân gian Việt Nam dành cho 2 người, đơn giản và đầy chiến thuật.
          </Text>

          {STEPS.map((step, i) => (
            <View key={i} style={s.stepCard}>
              <View style={s.stepHeader}>
                <Text style={s.stepIcon}>{step.icon}</Text>
                <View style={s.stepNum}>
                  <Text style={s.stepNumText}>{i + 1}</Text>
                </View>
                <Text style={s.stepTitle}>{step.title}</Text>
              </View>
              <Text style={s.stepBody}>{step.body}</Text>
            </View>
          ))}

          <TouchableOpacity style={s.startBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
            <Text style={s.startBtnText}>Bắt đầu chơi ngay →</Text>
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
  intro: { fontSize: Typography.md, color: Colors.textSecondary, lineHeight: 22, textAlign: 'center' },
  stepCard: { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.sm, borderWidth: 1, borderColor: Colors.bgCardBorder },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  stepIcon: { fontSize: 24 },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primaryDim, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { color: Colors.primary, fontSize: Typography.xs, fontWeight: Typography.bold },
  stepTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.textPrimary, flex: 1 },
  stepBody: { fontSize: Typography.md, color: Colors.textSecondary, lineHeight: 22 },
  startBtn: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: Spacing.md, alignItems: 'center' },
  startBtnText: { fontSize: Typography.lg, fontWeight: Typography.bold, color: '#000' },
});
