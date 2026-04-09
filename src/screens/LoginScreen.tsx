import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView,
  Platform, Animated, Alert, BackHandler,
  ImageBackground,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { setPlayer1Name, setPlayer2Name } from '../store/userSlice';
import type { RootStackParamList } from '../types';

const BG_IMAGE = require('../../assets/bg_home.png');

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<Nav>();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    dispatch(setPlayer1Name('Người chơi 1'));
    dispatch(setPlayer2Name('Người chơi 2'));

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleStart = () => {
    navigation.navigate('ModeSelect');
  };

  return (
    <ImageBackground source={BG_IMAGE} style={s.bg} resizeMode="cover">
      <SafeAreaView style={s.safe}>

        {/* ── Nút Thoát – góc trên trái ── */}
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
          <Text style={s.exitText}>✕ Thoát</Text>
        </TouchableOpacity>

        {/* ── Buttons khu vực giữa-trái ── */}
        <Animated.View
          style={[
            s.buttonsArea,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Bắt đầu */}
          <TouchableOpacity style={s.startBtn} onPress={handleStart} activeOpacity={0.85}>
            <Text style={s.startBtnText}>Bắt đầu  →</Text>
          </TouchableOpacity>

          {/* Hướng dẫn */}
          <TouchableOpacity
            style={s.guideBtn}
            onPress={() => navigation.navigate('Tutorial')}
            activeOpacity={0.75}
          >
            <Text style={s.guideBtnText}>Hướng dẫn</Text>
          </TouchableOpacity>
        </Animated.View>

      </SafeAreaView>
    </ImageBackground>
  );
};

const s = StyleSheet.create({
  bg: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },

  /* ── Thoát ─────────────────────────── */
  exitBtn: {
    position: 'absolute',
    top: 38,
    left: 16,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  exitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },

  /* ── Khu vực nút giữa-trái ─────────── */
  buttonsArea: {
    position: 'absolute',
    left: 28,
    top: '38%',
    gap: 10,
  },

  /* Nút Bắt đầu – oval trắng */
  startBtn: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.15)',

    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  startBtnText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  /* Nút Hướng dẫn – text italic */
  guideBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  guideBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});
