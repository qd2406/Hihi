import { Audio } from 'expo-av';

const BGM_SOURCE = require('../../assets/sounds/bgm.mp3');

let _bgmSound: Audio.Sound | null = null;
let _isPlaying = false;
let _musicEnabled = true;

export const MusicService = {
  async startBGM() {
    if (_bgmSound) return; 
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

  async setVolume(volume: number) {
    if (!_bgmSound) return;
    try {
      await _bgmSound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    } catch (e) {
      console.warn('[MusicService] Lỗi set volume:', e);
    }
  },

  async cleanup() {
    if (_bgmSound) {
      try {
        await _bgmSound.stopAsync();
        await _bgmSound.unloadAsync();
      } catch (e) {
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
