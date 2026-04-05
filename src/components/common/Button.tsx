import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
}

const BG: Record<Variant, string> = {
  primary:   Colors.primary,
  secondary: Colors.bgCard,
  danger:    Colors.danger,
  ghost:     'transparent',
};
const FG: Record<Variant, string> = {
  primary:   '#000',
  secondary: Colors.textPrimary,
  danger:    '#fff',
  ghost:     Colors.textSecondary,
};

export const Button: React.FC<ButtonProps> = ({
  label, onPress, variant = 'primary', disabled = false, loading = false,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    disabled={disabled || loading}
    style={[s.btn, { backgroundColor: BG[variant] }, (disabled || loading) && s.disabled]}
  >
    {loading
      ? <ActivityIndicator color={FG[variant]} size="small" />
      : <Text style={[s.label, { color: FG[variant] }]}>{label}</Text>}
  </TouchableOpacity>
);

const s = StyleSheet.create({
  btn: { borderRadius: Radius.full, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, alignItems: 'center' },
  label: { fontSize: Typography.md, fontWeight: Typography.bold },
  disabled: { opacity: 0.5 },
});
