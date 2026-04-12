// import { Audio } from 'expo-av';

// const SOUNDS = {
//   move:    require('../../assets/sounds/move.mp3'),
//   capture: require('../../assets/sounds/capture.mp3'),
//   win:     require('../../assets/sounds/win.mp3'),
//   lose:    require('../../assets/sounds/lose.mp3'),
//   tap:     require('../../assets/sounds/tap.mp3'),
// };

let _soundEnabled = true;

export const SoundService = {
  setEnabled(enabled: boolean) {
    _soundEnabled = enabled;
  },

  async playMove() {
    if (!_soundEnabled) return;
    // const { sound } = await Audio.Sound.createAsync(SOUNDS.move);
    // await sound.playAsync();
    console.log('[Sound] move');
  },

  async playCapture() {
    if (!_soundEnabled) return;
    // const { sound } = await Audio.Sound.createAsync(SOUNDS.capture);
    // await sound.playAsync();
    console.log('[Sound] capture');
  },

  async playWin() {
    if (!_soundEnabled) return;
    // const { sound } = await Audio.Sound.createAsync(SOUNDS.win);
    // await sound.playAsync();
    console.log('[Sound] win');
  },

  async playTap() {
    if (!_soundEnabled) return;
    console.log('[Sound] tap');
  },
};
