import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Platform, Animated, Alert, BackHandler,
  ImageBackground, Dimensions,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { setPlayer1Name, setPlayer2Name } from '../store/userSlice';
import type { RootStackParamList } from '../types';

const BG_IMAGE = require('../../assets/bg_home.png');
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

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
    <View style={s.root}>
      <ImageBackground
        source={BG_IMAGE}
        style={s.bg}
        resizeMode="cover"
      >
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
          <Text style={s.topBtnText}>✕  Thoát</Text>
        </TouchableOpacity>

        {/* ── Nút Cài đặt – góc trên phải ── */}
        <TouchableOpacity
          style={s.settingsBtn}
          activeOpacity={0.75}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={s.topBtnText}>⚙️</Text>
        </TouchableOpacity>

        {/* ── Buttons khu vực giữa-trái ── */}
        <Animated.View
          style={[
            s.buttonsArea,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Bắt đầu – phong chữ thư pháp */}
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

      </ImageBackground>
    </View>
  );
};

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  /* ── Top buttons chung ────────────── */
  topBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },

  /* ── Thoát – góc trên trái ───────── */
  exitBtn: {
    position: 'absolute',
    top: 14,
    left: 14,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },

  /* ── Cài đặt – góc trên phải ─────── */
  settingsBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },

  /* ── Khu vực nút giữa-trái ─────────── */
  buttonsArea: {
    position: 'absolute',
    left: 28,
    top: '35%',
    gap: 10,
  },

  /* Nút Bắt đầu – oval trắng, phông thư pháp */
  startBtn: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 34,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  startBtnText: {
    color: '#1a1a1a',
    fontSize: 22,
    fontFamily: 'DancingScript_700Bold',
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
