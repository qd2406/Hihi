import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

import { LoginScreen } from '../screens/LoginScreen';
import { ModeSelectScreen } from '../screens/ModeSelectScreen';
import { LobbyScreen } from '../screens/LobbyScreen';
import { GameScreen } from '../screens/GameScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TutorialScreen } from '../screens/TutorialScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login"      component={LoginScreen} />
      <Stack.Screen name="ModeSelect" component={ModeSelectScreen} />
      <Stack.Screen name="Lobby"      component={LobbyScreen} />
      <Stack.Screen name="Game"       component={GameScreen} />
      <Stack.Screen name="Result"     component={ResultScreen} />
      <Stack.Screen name="Settings"   component={SettingsScreen} />
      <Stack.Screen name="Tutorial"   component={TutorialScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
