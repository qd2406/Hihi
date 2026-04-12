import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

const BG_IMAGE = require('../../assets/bg_home.png');

interface BlurredBackgroundProps {
  children: React.ReactNode;
  intensity?: number;
  tint?: 'dark' | 'light' | 'default';
}

export const BlurredBackground: React.FC<BlurredBackgroundProps> = ({
  children,
  intensity = 55,
  tint = 'dark',
}) => (
  <ImageBackground source={BG_IMAGE} style={styles.bg} resizeMode="cover">
    <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
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
