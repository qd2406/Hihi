import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

const BG_IMAGE = require('../../assets/bg_home.png');

interface BlurredBackgroundProps {
  children: React.ReactNode;
  /** Cường độ blur (0–100), mặc định 60 */
  intensity?: number;
  /** Tint: 'dark' | 'light' | 'default' */
  tint?: 'dark' | 'light' | 'default';
}

/**
 * Nền ảnh Cờ Ô Quan bị blur – dùng cho mọi màn hình ngoài trang chủ.
 */
export const BlurredBackground: React.FC<BlurredBackgroundProps> = ({
  children,
  intensity = 55,
  tint = 'dark',
}) => (
  <ImageBackground source={BG_IMAGE} style={styles.bg} resizeMode="cover">
    <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
    {/* Lớp overlay tối thêm để text dễ đọc */}
    <View style={styles.overlay} />
    {children}
  </ImageBackground>
);

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 13, 24, 0.45)',
  },
});
