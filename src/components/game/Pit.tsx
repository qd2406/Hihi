import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { PitData, Direction } from '../../types';
import { Stone } from './Stone';

const { width: SCREEN_W } = Dimensions.get('window');
const BOARD_PADDING = 24;
const PIT_GAP = 4;
const DEFAULT_DAN = Math.min(Math.floor((SCREEN_W - BOARD_PADDING * 2 - PIT_GAP * 6) / 7), 72);
const DEFAULT_QUAN_W = DEFAULT_DAN;
const DEFAULT_QUAN_H = DEFAULT_DAN * 2 + PIT_GAP;

interface PitProps {
  pit: PitData;
  onClick: (direction: Direction) => void;
  disabled: boolean;
  isAnimating?: boolean;
  danPitSize?: number;
  quanPitWidth?: number;
  quanPitHeight?: number;
  /** Người chơi ngồi phía đối diện – đảo mũi tên VÀ xoay số đá */
  flipped?: boolean;
}

export const Pit: React.FC<PitProps> = ({
  pit, onClick, disabled, isAnimating = false,
  danPitSize = DEFAULT_DAN,
  quanPitWidth = DEFAULT_QUAN_W,
  quanPitHeight = DEFAULT_QUAN_H,
  flipped = false,
}) => {
  const [showArrows, setShowArrows] = useState(false);
  const scaleAnim  = useRef(new Animated.Value(1)).current;
  const glowAnim   = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const isQuan     = pit.type === 'QUAN';
  const isPlayable = !disabled && pit.stones > 0 && !isQuan;

  useEffect(() => { if (disabled) setShowArrows(false); }, [disabled]);

  useEffect(() => {
    if (isAnimating) {
      Animated.loop(Animated.sequence([
        Animated.timing(glowAnim,   { toValue: 1, duration: 300, useNativeDriver: false }),
        Animated.timing(glowAnim,   { toValue: 0, duration: 300, useNativeDriver: false }),
      ])).start();
      Animated.loop(Animated.sequence([
        Animated.spring(bounceAnim, { toValue: 1.08, useNativeDriver: true, speed: 30 }),
        Animated.spring(bounceAnim, { toValue: 1,    useNativeDriver: true, speed: 30 }),
      ])).start();
    } else {
      glowAnim.stopAnimation();   glowAnim.setValue(0);
      bounceAnim.stopAnimation(); bounceAnim.setValue(1);
    }
  }, [isAnimating]);

  const handlePress = () => {
    if (!isPlayable) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.9, useNativeDriver: true, speed: 50 }),
      Animated.spring(scaleAnim, { toValue: 1,   useNativeDriver: true, speed: 20 }),
    ]).start();
    setShowArrows((prev) => !prev);
  };

  const handleDirection = (dir: Direction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowArrows(false);
    onClick(dir);
  };

  const stonesArr = Array.from({ length: Math.min(pit.stones, 20) });

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,215,0,0)', 'rgba(255,215,0,0.5)'],
  });

  const pitW   = isQuan ? quanPitWidth  : danPitSize;
  const pitH   = isQuan ? quanPitHeight : danPitSize;
  const borderR = isQuan ? pitW / 2.5   : pitW / 2;

  return (
    <View style={styles.wrapper}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }, { scale: bounceAnim }], width: pitW, height: pitH }}>
        <TouchableOpacity
          onPress={handlePress}
          disabled={!isPlayable}
          activeOpacity={isPlayable ? 0.8 : 1}
          style={[
            styles.pit,
            {
              width: pitW, height: pitH, borderRadius: borderR,
              backgroundColor: isQuan ? '#1a3d20' : '#3b2008',
              borderColor:     isQuan ? '#2d7a3f' : (isPlayable ? '#c8961a' : '#5a3010'),
              borderWidth: isPlayable ? 2 : 1,
              opacity: disabled && !isQuan ? 0.65 : 1,
            },
          ]}
        >
          {/* Glow overlay */}
          <Animated.View
            style={[StyleSheet.absoluteFillObject, { backgroundColor: glowColor, borderRadius: borderR }]}
            pointerEvents="none"
          />

          {/* ── QUAN: 1 viên đá lớn đặc biệt ── */}
          {isQuan ? (
            <View style={[StyleSheet.absoluteFillObject, { alignItems: 'center', justifyContent: 'center' }]} pointerEvents="none">
              {/* Viên đá Quan lớn */}
              <View style={styles.quanStone}>
                <View style={styles.quanStoneInner} />
              </View>
            </View>
          ) : (
            /* DAN: đá nhỏ rải ngẫu nhiên */
            <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
              {stonesArr.map((_, i) => (
                <Stone key={i} index={i} isAnimating={isAnimating} />
              ))}
            </View>
          )}

          {/* Badge số đá — xoay 180° nếu flipped (Player 2) */}
          <View
            style={[styles.badge, flipped && styles.badgeFlipped]}
            pointerEvents="none"
          >
            <Text
              style={[
                styles.badgeText,
                isQuan && styles.quanBadgeText,
                flipped && { transform: [{ rotate: '180deg' }] },
              ]}
            >
              {pit.stones}
            </Text>
          </View>

          {/* Nhãn QUAN */}
          {isQuan && (
            <Text style={[styles.quanLabel, flipped && { transform: [{ rotate: '180deg' }], top: undefined, bottom: 6 }]}>
              Quan
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Mũi tên chọn hướng */}
      {showArrows && !disabled && !isQuan && (
        <View style={styles.arrowsContainer}>
          <TouchableOpacity
            style={[styles.arrowBtn, flipped ? styles.arrowCW : styles.arrowCCW]}
            onPress={() => handleDirection(flipped ? 'CW' : 'CCW')}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
          >
            <Text style={styles.arrowText}>◄</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.arrowBtn, flipped ? styles.arrowCCW : styles.arrowCW]}
            onPress={() => handleDirection(flipped ? 'CCW' : 'CW')}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
          >
            <Text style={styles.arrowText}>►</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  pit: {
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 6, elevation: 6, overflow: 'hidden',
  },

  // ── Viên đá Quan lớn ──────────────────────────────────────
  quanStone: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#2e7d32',
    borderWidth: 3, borderColor: '#66bb6a',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#1b5e20', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8, shadowRadius: 4, elevation: 8,
  },
  quanStoneInner: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  // ── Badge số đá ────────────────────────────────────────────
  badge: {
    position: 'absolute', bottom: 4, right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10, minWidth: 20, height: 20,
    paddingHorizontal: 3, alignItems: 'center', justifyContent: 'center',
    zIndex: 10,
  },
  /** Khi flipped: góc trên-trái thay vì dưới-phải */
  badgeFlipped: {
    bottom: undefined, right: undefined,
    top: 4, left: 4,
  },
  badgeText:     { color: '#FFD700', fontSize: 10, fontWeight: '800' },
  quanBadgeText: { fontSize: 12, color: '#a8e6b4' },

  // ── Nhãn QUAN ──────────────────────────────────────────────
  quanLabel: {
    position: 'absolute', top: 6,
    color: 'rgba(168,230,180,0.85)',
    fontSize: 10, fontWeight: '700', letterSpacing: 1,
  },

  // ── Mũi tên ────────────────────────────────────────────────
  arrowsContainer: { flexDirection: 'row', marginTop: 6, gap: 6 },
  arrowBtn: { width: 38, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', elevation: 8 },
  arrowCCW: { backgroundColor: '#1565c0', borderWidth: 1, borderColor: '#0d47a1' },
  arrowCW:  { backgroundColor: '#b71c1c', borderWidth: 1, borderColor: '#7f0000' },
  arrowText: { color: '#fff', fontSize: 14, fontWeight: '900' },
});
