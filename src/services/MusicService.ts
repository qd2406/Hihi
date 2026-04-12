/**
 * MusicService – Nhạc nền cho game
 * 
 * Sử dụng expo-av Audio API.
 * Nhạc sẽ tự động lặp lại khi kết thúc.
 */

import { Audio } from 'expo-av';

const BGM_SOURCE = require('../../assets/sounds/bgm.mp3');

let _bgmSound: Audio.Sound | null = null;
let _isPlaying = false;
let _musicEnabled = true;

export const MusicService = {
  /**
   * Khởi tạo và phát nhạc nền (loop vô hạn).
   * Gọi 1 lần khi app khởi động.
   */
  async startBGM() {
    if (_bgmSound) return; // Đã khởi tạo rồi
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      const { sound } = await Audio.Sound.createAsync(BGM_SOURCE, {
        isLooping: true,   
        volume: 0.2,
        shouldPlay: _musicEnabled,
      });
      _bgmSound = sound;
      _isPlaying = _musicEnabled;
    } catch (e) {
      console.warn('[MusicService] Không thể phát nhạc nền:', e);
    }
  },


  async setEnabled(enabled: boolean) {
    _musicEnabled = enabled;
    if (!_bgmSound) return;
    try {
      if (enabled && !_isPlaying) {
        await _bgmSound.playAsync();
        _isPlaying = true;
      } else if (!enabled && _isPlaying) {
        await _bgmSound.pauseAsync();
        _isPlaying = false;
      }
    } catch (e) {
      console.warn('[MusicService] Lỗi set enabled:', e);
    }
  },

  /** Điều chỉnh âm lượng (0.0 – 1.0) */
  async setVolume(volume: number) {
    if (!_bgmSound) return;
    try {
      await _bgmSound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    } catch (e) {
      console.warn('[MusicService] Lỗi set volume:', e);
    }
  },

  /** Giải phóng tài nguyên khi không cần nữa */
  async cleanup() {
    if (_bgmSound) {
      try {
        await _bgmSound.stopAsync();
        await _bgmSound.unloadAsync();
      } catch (e) {
        // ignore
      }
      _bgmSound = null;
      _isPlaying = false;
    }
  },

  isPlaying() {
    return _isPlaying;
  },

  isEnabled() {
    return _musicEnabled;
  },
};
