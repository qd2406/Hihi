import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

// Predefined stone colors for variety
const STONE_COLORS = [
  '#e8d5a3', // warm sand
  '#c4956a', // terracotta
  '#8b9d77', // sage green
  '#b0c4de', // light steel blue
  '#deb887', // burlywood
  '#cd853f', // peru
  '#a0785a', // brown
];

interface StoneProps {
  index: number;
  isAnimating?: boolean;
}

export const Stone: React.FC<StoneProps> = ({ index, isAnimating = false }) => {
  const scaleAnim = useRef(new Animated.Value(isAnimating ? 0 : 1)).current;
  const colorIndex = index % STONE_COLORS.length;
  const color = STONE_COLORS[colorIndex];

  // Random but deterministic offset based on index
  const seed = index * 137.508; // golden angle
  const offsetX = (Math.sin(seed) * 0.35) * 100; // percentage
  const offsetY = (Math.cos(seed) * 0.35) * 100;

  useEffect(() => {
    if (isAnimating) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 14,
        bounciness: 8,
      }).start();
    }
  }, [isAnimating]);

  return (
    <Animated.View
      style={[
        styles.stone,
        {
          backgroundColor: color,
          transform: [{ scale: scaleAnim }],
          // Distribute stones within pit using percentage positions
          position: 'absolute',
          left: `${50 + offsetX}%` as any,
          top: `${50 + offsetY}%` as any,
          marginLeft: -6,
          marginTop: -6,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  stone: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2,
  },
});
