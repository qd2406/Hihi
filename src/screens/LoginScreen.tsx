import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView,
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

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<Nav>();
  const titleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set default player names
    dispatch(setPlayer1Name('Người chơi 1'));
    dispatch(setPlayer2Name('Người chơi 2'));

    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleStart = () => {
    navigation.navigate('ModeSelect');
  };

  return (
    <LinearGradient colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]} style={s.gradient}>
      <SafeAreaView style={s.safe}>
        <View style={s.container}>
          {/* Title */}
          <Animated.View style={[s.titleBox, { opacity: titleAnim, transform: [{ translateY: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }] }]}>
            <Text style={s.emoji}>🎎</Text>
            <Text style={s.title}>Ô Ăn Quan</Text>
            <Text style={s.subtitle}>Trò chơi dân gian Việt Nam</Text>
          </Animated.View>

          {/* Buttons */}
          <View style={s.btnGroup}>
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
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const s = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.lg, gap: Spacing.xl },
  titleBox: { alignItems: 'center', gap: Spacing.xs },
  emoji: { fontSize: 56 },
  title: { fontSize: Typography.title, fontWeight: Typography.black, color: Colors.primary, letterSpacing: 2 },
  subtitle: { fontSize: Typography.md, color: Colors.textSecondary, fontWeight: Typography.medium },
  btnGroup: { width: '100%', gap: Spacing.lg },
  primaryBtn: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: Spacing.md + 2, alignItems: 'center' },
  primaryBtnText: { fontSize: Typography.lg, fontWeight: Typography.bold, color: '#000' },
  secondaryBtn: { alignItems: 'center', paddingVertical: Spacing.sm },
  secondaryBtnText: { fontSize: Typography.md, color: Colors.textSecondary },
  exitBtn: { alignItems: 'center', paddingVertical: Spacing.xs },
  exitBtnText: { fontSize: Typography.sm, color: Colors.textMuted },
});
