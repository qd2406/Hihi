import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal as RNModal } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';

interface ModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  dangerous?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  visible, title, message,
  confirmLabel = 'OK', cancelLabel,
  onConfirm, onCancel, dangerous = false,
}) => (
  <RNModal transparent visible={visible} animationType="fade">
    <View style={s.overlay}>
      <View style={s.box}>
        <Text style={s.title}>{title}</Text>
        <Text style={s.message}>{message}</Text>
        <View style={s.actions}>
          {onCancel && (
            <TouchableOpacity style={s.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
              <Text style={s.cancelText}>{cancelLabel ?? 'Hủy'}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[s.confirmBtn, dangerous && { backgroundColor: Colors.danger }]}
            onPress={onConfirm}
            activeOpacity={0.85}
          >
            <Text style={s.confirmText}>{confirmLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </RNModal>
);

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  box: { backgroundColor: '#0d1f35', borderRadius: Radius.xl, padding: Spacing.xl, width: '100%', gap: Spacing.md, borderWidth: 1, borderColor: Colors.bgCardBorder },
  title: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.textPrimary, textAlign: 'center' },
  message: { fontSize: Typography.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  cancelBtn: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', backgroundColor: Colors.bgCard, borderRadius: Radius.full },
  cancelText: { color: Colors.textSecondary, fontSize: Typography.md, fontWeight: Typography.medium },
  confirmBtn: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', backgroundColor: Colors.primary, borderRadius: Radius.full },
  confirmText: { color: '#000', fontSize: Typography.md, fontWeight: Typography.bold },
});
