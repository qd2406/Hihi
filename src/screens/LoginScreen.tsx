import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView,
  Platform, Animated, Alert, BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { setPlayer1Name, setPlayer2Name } from '../store/userSlice';
import type { RootStackParamList } from '../types';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, Radius } from '../theme/spacing';
import { StorageService } from '../services/StorageService';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<Nav>();
  const [p1, setP1] = useState('Người chơi 1');
  const [p2, setP2] = useState('Người chơi 2');
  const titleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Load saved names
    StorageService.loadPlayerNames().then((names) => {
      setP1(names.player1Name);
      setP2(names.player2Name);
    });
    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleStart = async () => {
    const name1 = p1.trim() || 'Người chơi 1';
    const name2 = p2.trim() || 'Người chơi 2';
    dispatch(setPlayer1Name(name1));
    dispatch(setPlayer2Name(name2));
    await StorageService.savePlayerNames({ player1Name: name1, player2Name: name2 });
    navigation.navigate('ModeSelect');
  };

  return (
    <LinearGradient colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]} style={s.gradient}>
      <SafeAreaView style={s.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.flex}>
          {/* Title */}
          <Animated.View style={[s.titleBox, { opacity: titleAnim, transform: [{ translateY: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }] }]}>
            <Text style={s.emoji}>🎎</Text>
            <Text style={s.title}>Ô Ăn Quan</Text>
            <Text style={s.subtitle}>Trò chơi dân gian Việt Nam</Text>
          </Animated.View>

          {/* Form */}
          <View style={s.card}>
            <Text style={s.label}>Người chơi 1</Text>
            <TextInput
              style={s.input}
              value={p1}
              onChangeText={setP1}
              placeholder="Nhập tên..."
              placeholderTextColor={Colors.textMuted}
              maxLength={20}
            />
            <Text style={s.label}>Người chơi 2</Text>
            <TextInput
              style={s.input}
              value={p2}
              onChangeText={setP2}
              placeholder="Nhập tên hoặc để trống khi PvE..."
              placeholderTextColor={Colors.textMuted}
              maxLength={20}
            />
          </View>

          {/* Buttons */}
          <TouchableOpacity style={s.primaryBtn} onPress={handleStart} activeOpacity={0.85}>
            <Text style={s.primaryBtnText}>Bắt đầu →</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.secondaryBtn} onPress={() => navigation.navigate('Tutorial')} activeOpacity={0.75}>
            <Text style={s.secondaryBtnText}>Hướng dẫn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.exitBtn}
            activeOpacity={0.75}
            onPress={() =>
              Alert.alert('Thoát game', 'Bạn muốn thoát khỏi ứng dụng?', [
                { text: 'Ở lại', style: 'cancel' },
                {
                  text: 'Thoát',
                  style: 'destructive',
                  onPress: () => {
                    if (Platform.OS === 'android') BackHandler.exitApp();
                  },
                },
              ])
            }
          >
            <Text style={s.exitBtnText}>✕ Thoát</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const s = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.lg, gap: Spacing.lg },
  titleBox: { alignItems: 'center', gap: Spacing.xs },
  emoji: { fontSize: 56 },
  title: { fontSize: Typography.title, fontWeight: Typography.black, color: Colors.primary, letterSpacing: 2 },
  subtitle: { fontSize: Typography.md, color: Colors.textSecondary, fontWeight: Typography.medium },
  card: { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.bgCardBorder, gap: Spacing.sm },
  label: { fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.textSecondary, marginTop: Spacing.xs },
  input: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2, color: Colors.textPrimary, fontSize: Typography.md, borderWidth: 1, borderColor: Colors.bgCardBorder },
  primaryBtn: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: Spacing.md + 2, alignItems: 'center' },
  primaryBtnText: { fontSize: Typography.lg, fontWeight: Typography.bold, color: '#000' },
  secondaryBtn: { alignItems: 'center', paddingVertical: Spacing.sm },
  secondaryBtnText: { fontSize: Typography.md, color: Colors.textSecondary },
  exitBtn: { alignItems: 'center', paddingVertical: Spacing.xs },
  exitBtnText: { fontSize: Typography.sm, color: Colors.textMuted },
});
