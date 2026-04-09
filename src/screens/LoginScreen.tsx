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
        resizeMode="stretch"
      >
        {/* ── Menu chính – giữa trái ── */}
        <Animated.View
          style={[
            s.menuArea,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Bắt đầu */}
          <TouchableOpacity style={s.menuItem} onPress={handleStart} activeOpacity={0.7}>
            <Text style={s.menuText}>Bắt đầu</Text>
          </TouchableOpacity>

          {/* Hướng dẫn */}
          <TouchableOpacity
            style={s.menuItem}
            onPress={() => navigation.navigate('Tutorial')}
            activeOpacity={0.7}
          >
            <Text style={s.menuText}>Hướng dẫn</Text>
          </TouchableOpacity>

          {/* Cài đặt */}
          <TouchableOpacity
            style={s.menuItem}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <Text style={s.menuText}>Cài đặt</Text>
          </TouchableOpacity>

          {/* Thoát */}
          <TouchableOpacity
            style={s.menuItem}
            activeOpacity={0.7}
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
            <Text style={s.menuText}>Thoát</Text>
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

  /* ── Menu dọc giữa-trái ─────────── */
  menuArea: {
    position: 'absolute',
    left: 28,
    top: '32%',
    gap: 6,
  },

  menuItem: {
    paddingVertical: 5,
    paddingHorizontal: 6,
  },

  menuText: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'DancingScript_700Bold',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 6,
  },
});

