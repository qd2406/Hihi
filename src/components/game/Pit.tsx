import React, { useRef, useEffect } from 'react';
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
  flipped?: boolean;
  rotateForOpponent?: boolean;
  isSelected?: boolean;
  onSelect?: (pitId: number | null) => void;
}

export const Pit: React.FC<PitProps> = ({
  pit, onClick, disabled, isAnimating = false,
  danPitSize = DEFAULT_DAN,
  quanPitWidth = DEFAULT_QUAN_W,
  quanPitHeight = DEFAULT_QUAN_H,
  flipped = false,
  rotateForOpponent = false,
  isSelected = false,
  onSelect,
}) => {
  const scaleAnim  = useRef(new Animated.Value(1)).current;
  const glowAnim   = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const isQuan     = pit.type === 'QUAN';
  const isPlayable = !disabled && pit.stones > 0 && !isQuan;

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
    onSelect?.(isSelected ? null : pit.id);
  };

  const handleDirection = (dir: Direction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect?.(null); 
    onClick(dir);
  };

  const stonesArr = Array.from({ length: Math.min(pit.stones, 20) });
  const quanHasBrick = isQuan && pit.stones >= 10;
  const quanSmallStones = isQuan
    ? (quanHasBrick ? pit.stones - 10 : pit.stones)  
    : 0;
  const quanStonesArr = Array.from({ length: Math.min(quanSmallStones, 30) });

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,215,0,0)', 'rgba(255,215,0,0.5)'],
  });

  const pitW   = isQuan ? quanPitWidth  : danPitSize;
  const pitH   = isQuan ? quanPitHeight : danPitSize;
  const borderR = isQuan ? pitW / 2.5   : pitW / 2;

  const pitContent = (
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
          <Animated.View
            style={[StyleSheet.absoluteFillObject, { backgroundColor: glowColor, borderRadius: borderR }]}
            pointerEvents="none"
          />

          {isQuan ? (
            <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
              {quanHasBrick && (
                <View style={styles.quanBrickContainer}>
                  <View style={styles.quanBrick}>
                    <View style={styles.quanBrickLine} />
                    <View style={styles.quanBrickLine} />
                  </View>
                </View>
              )}
              {quanStonesArr.map((_, i) => (
                <Stone key={`q-${i}`} index={i} isAnimating={isAnimating} totalStones={quanSmallStones} />
              ))}
            </View>
          ) : (
            <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
              {stonesArr.map((_, i) => (
                <Stone key={i} index={i} isAnimating={isAnimating} totalStones={pit.stones} />
              ))}
            </View>
          )}

          <View
            style={[styles.badge, flipped && styles.badgeFlipped]}
            pointerEvents="none"
          >
            <Text
              style={[
                styles.badgeText,
                isQuan && styles.quanBadgeText,
              ]}
            >
              {pit.stones}
            </Text>
          </View>

          {/* Nhãn QUAN */}
          {isQuan && (
            <Text style={[styles.quanLabel, flipped && { top: undefined, bottom: 6 }]}>
              Quan
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>


      {isSelected && !disabled && !isQuan && (() => {
        const flipDir = flipped && !rotateForOpponent;
        return (
          <View style={styles.arrowsContainer}>
            <TouchableOpacity
              style={[styles.arrowBtn, flipDir ? styles.arrowCW : styles.arrowCCW]}
              onPress={() => handleDirection(flipDir ? 'CW' : 'CCW')}
              hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            >
              <Text style={styles.arrowText}>◄</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.arrowBtn, flipDir ? styles.arrowCCW : styles.arrowCW]}
              onPress={() => handleDirection(flipDir ? 'CCW' : 'CW')}
              hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            >
              <Text style={styles.arrowText}>►</Text>
            </TouchableOpacity>
          </View>
        );
      })()}
    </View>
  );

  if (rotateForOpponent) {
    return (
      <View style={{ transform: [{ rotate: '180deg' }] }}>
        {pitContent}
      </View>
    );
  }

  return pitContent;
};

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  pit: {
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 6, elevation: 6, overflow: 'hidden',
  },


  quanBrickContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  quanBrick: {
    width: 36, height: 20, borderRadius: 4,
    backgroundColor: '#c0392b',
    borderWidth: 1.5, borderColor: '#e74c3c',
    alignItems: 'center', justifyContent: 'space-evenly',
    flexDirection: 'row',
    shadowColor: '#7b241c', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7, shadowRadius: 3, elevation: 6,
  },
  quanBrickLine: {
    width: 1, height: 14,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

  badge: {
    position: 'absolute', bottom: 4, right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10, minWidth: 20, height: 20,
    paddingHorizontal: 3, alignItems: 'center', justifyContent: 'center',
    zIndex: 10,
  },

  badgeFlipped: {
    bottom: undefined, right: undefined,
    top: 4, left: 4,
  },
  badgeText:     { color: '#FFD700', fontSize: 10, fontWeight: '800' },
  quanBadgeText: { fontSize: 12, color: '#a8e6b4' },

  quanLabel: {
    position: 'absolute', top: 6,
    color: 'rgba(168,230,180,0.85)',
    fontSize: 10, fontWeight: '700', letterSpacing: 1,
  },

  arrowsContainer: { flexDirection: 'row', marginTop: 6, gap: 6 },
  arrowBtn: { width: 38, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', elevation: 8 },
  arrowCCW: { backgroundColor: '#1565c0', borderWidth: 1, borderColor: '#0d47a1' },
  arrowCW:  { backgroundColor: '#b71c1c', borderWidth: 1, borderColor: '#7f0000' },
  arrowText: { color: '#fff', fontSize: 14, fontWeight: '900' },
});
