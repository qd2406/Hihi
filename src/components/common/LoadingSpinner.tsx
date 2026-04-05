import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => (
  <View style={s.container}>
    <ActivityIndicator color={Colors.primary} size="large" />
    {message && <Text style={s.message}>{message}</Text>}
  </View>
);

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  message: { fontSize: Typography.md, color: Colors.textSecondary },
});
