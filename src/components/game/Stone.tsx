import React, { useRef, useEffect, useMemo } from 'react';
import { StyleSheet, Animated } from 'react-native';

const STONE_COLOR = '#e8d5a3'; // Màu mặc định

const STONE_COLORS = [
  '#e8d5a3',
  '#c4956a',
  '#8b9d77',
  '#b0c4de',
  '#deb887',
  '#cd853f',
  '#a0785a',
];

interface StoneProps {
  index: number;
  isAnimating?: boolean;
  totalStones?: number;
}

export const Stone: React.FC<StoneProps> = ({ index, isAnimating = false, totalStones = 0 }) => {
  const scaleAnim = useRef(new Animated.Value(isAnimating ? 0 : 1)).current;

  // Vị trí random thực sự, chỉ tính 1 lần khi mount
  const { offsetX, offsetY } = useMemo(() => {
    // Random trong khoảng [-35%, +35%] so với tâm
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 0.35;
    return {
      offsetX: Math.cos(angle) * radius * 100,
      offsetY: Math.sin(angle) * radius * 100,
    };
  }, []);

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
          backgroundColor: totalStones > 8
            ? STONE_COLORS[index % STONE_COLORS.length]
            : STONE_COLOR,
          transform: [{ scale: scaleAnim }],
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
