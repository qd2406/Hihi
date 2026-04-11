import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { MusicService } from './src/services/MusicService';

export default function App() {
  const [fontsLoaded] = useFonts({
    DancingScript_700Bold,
  });

  // Khởi động nhạc nền khi app sẵn sàng
  useEffect(() => {
    if (fontsLoaded) {
      MusicService.startBGM();
    }
    return () => {
      MusicService.cleanup();
    };
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#040d18' }}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <AppNavigator />
    </Provider>
  );
}
