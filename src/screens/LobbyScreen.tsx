import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, FlatList, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { BlurredBackground } from '../components/BlurredBackground';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootState } from '../store/store';
import type { RootStackParamList, Room } from '../types';
import { OnlineController } from '../logic/OnlineController';
import { ENV } from '../config/env';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, Radius } from '../theme/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Lobby'>;

export const LobbyScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const onlineState = useSelector((s: RootState) => s.online);
  const userName = useSelector((s: RootState) => s.user.player1Name);
  const [joinCode, setJoinCode] = useState('');
  const [tab, setTab] = useState<'create' | 'join'>('create');

  // Connect when screen mounts, disconnect when leaving
  useEffect(() => {
    OnlineController.connect();
    return () => { OnlineController.disconnect(); };
  }, []);

  // Navigate to game when room is full
  useEffect(() => {
    if (onlineState.roomId && onlineState.opponentName) {
      navigation.navigate('Game');
    }
  }, [onlineState.roomId, onlineState.opponentName]);

  const handleCreate = () => {
    OnlineController.createRoom(userName);
  };

  const handleJoin = () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) {
      Alert.alert('Mã phòng không hợp lệ', 'Vui lòng nhập mã phòng đúng.');
      return;
    }
    OnlineController.joinRoom(code, userName);
  };

  const isConnecting = onlineState.connectionStatus === 'connecting';
  const isConnected  = onlineState.connectionStatus === 'connected';
  // True if using default localhost URL (no real server configured)
  const isLocalDev = ENV.SOCKET_URL.includes('localhost') || ENV.SOCKET_URL.includes('127.0.0');

  const renderRoom = ({ item }: { item: Room }) => (
    <TouchableOpacity
      style={s.roomCard}
      onPress={() => OnlineController.joinRoom(item.id, userName)}
      activeOpacity={0.8}
    >
      <Text style={s.roomHost}>👤 {item.hostName}</Text>
      <View style={[s.roomBadge, { backgroundColor: item.status === 'waiting' ? Colors.waiting + '30' : Colors.offline + '30' }]}>
        <Text style={[s.roomBadgeText, { color: item.status === 'waiting' ? Colors.waiting : Colors.textMuted }]}>
          {item.status === 'waiting' ? 'Chờ' : 'Đang chơi'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <BlurredBackground>
      <SafeAreaView style={s.safe}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Text style={s.backText}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={s.title}>🌐 Sảnh Online</Text>
          <View style={[s.statusDot, { backgroundColor: isConnected ? Colors.online : isConnecting ? Colors.waiting : Colors.offline }]} />
        </View>

        {/* Server not configured warning */}
        {isLocalDev && (
          <View style={s.serverWarning}>
            <Text style={s.serverWarningTitle}>⚠️ Chưa có server WebSocket</Text>
            <Text style={s.serverWarningBody}>
              Chế độ Online cần một server riêng.{`\n`}
              Cài biến môi trường <Text style={s.serverWarningCode}>EXPO_PUBLIC_SOCKET_URL</Text> trỏ tới server của bạn để sử dụng.
            </Text>
          </View>
        )}

        {/* Error */}
        {onlineState.error && (
          <View style={s.errorBanner}>
            <Text style={s.errorText}>⚠️ {onlineState.error}</Text>
          </View>
        )}

        {/* Connecting */}
        {isConnecting && (
          <View style={s.centerBox}>
            <ActivityIndicator color={Colors.primary} size="large" />
            <Text style={s.centeredText}>Đang kết nối máy chủ...</Text>
          </View>
        )}

        {isConnected && (
          <>
            {/* Tabs */}
            <View style={s.tabs}>
              {(['create', 'join'] as const).map((t) => (
                <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
                  <Text style={[s.tabText, tab === t && s.tabTextActive]}>
                    {t === 'create' ? 'Tạo phòng' : 'Vào phòng'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {tab === 'create' ? (
              <View style={s.panel}>
                {onlineState.roomId ? (
                  <>
                    <Text style={s.roomCodeLabel}>Mã phòng của bạn:</Text>
                    <Text style={s.roomCode}>{onlineState.roomId}</Text>
                    <Text style={s.waitingText}>⏳ Đang chờ đối thủ...</Text>
                  </>
                ) : (
                  <TouchableOpacity style={s.primaryBtn} onPress={handleCreate} activeOpacity={0.85}>
                    <Text style={s.primaryBtnText}>+ Tạo phòng mới</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={s.panel}>
                <TextInput
                  style={s.input}
                  placeholder="Nhập mã phòng (VD: AB1234)"
                  placeholderTextColor={Colors.textMuted}
                  value={joinCode}
                  onChangeText={setJoinCode}
                  autoCapitalize="characters"
                  maxLength={8}
                />
                <TouchableOpacity style={s.primaryBtn} onPress={handleJoin} activeOpacity={0.85}>
                  <Text style={s.primaryBtnText}>Vào phòng →</Text>
                </TouchableOpacity>

                {/* Room list */}
                <Text style={s.sectionLabel}>Phòng đang chờ</Text>
                <FlatList
                  data={onlineState.rooms}
                  keyExtractor={(r) => r.id}
                  renderItem={renderRoom}
                  ListEmptyComponent={<Text style={s.emptyText}>Không có phòng nào. Hãy tạo phòng!</Text>}
                  scrollEnabled={false}
                />
              </View>
            )}
          </>
        )}
      </SafeAreaView>
    </BlurredBackground>
  );
};

const s = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
  backBtn: { padding: Spacing.sm, backgroundColor: Colors.bgCard, borderRadius: Radius.md },
  backText: { color: Colors.textSecondary, fontSize: Typography.md },
  title: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.primary },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  errorBanner: { marginHorizontal: Spacing.lg, backgroundColor: Colors.danger + '20', borderRadius: Radius.md, padding: Spacing.sm, borderWidth: 1, borderColor: Colors.danger + '40' },
  errorText: { color: Colors.danger, fontSize: Typography.sm },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md },
  centeredText: { color: Colors.textSecondary, fontSize: Typography.md },
  tabs: { flexDirection: 'row', marginHorizontal: Spacing.lg, backgroundColor: Colors.bgCard, borderRadius: Radius.md, padding: 4 },
  tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: Radius.sm },
  tabActive: { backgroundColor: Colors.primaryDim },
  tabText: { fontSize: Typography.md, color: Colors.textSecondary, fontWeight: Typography.medium },
  tabTextActive: { color: Colors.primary, fontWeight: Typography.bold },
  panel: { margin: Spacing.lg, backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.md, borderWidth: 1, borderColor: Colors.bgCardBorder },
  primaryBtn: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: Spacing.sm + 4, alignItems: 'center' },
  primaryBtnText: { fontSize: Typography.md, fontWeight: Typography.bold, color: '#000' },
  input: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2, color: Colors.textPrimary, fontSize: Typography.md, borderWidth: 1, borderColor: Colors.bgCardBorder },
  roomCodeLabel: { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center' },
  roomCode: { fontSize: Typography.title, fontWeight: Typography.black, color: Colors.primary, textAlign: 'center', letterSpacing: 4 },
  waitingText: { fontSize: Typography.md, color: Colors.textSecondary, textAlign: 'center' },
  sectionLabel: { fontSize: Typography.sm, color: Colors.textMuted, fontWeight: Typography.semiBold, marginTop: Spacing.xs },
  roomCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.bgCardBorder },
  roomHost: { fontSize: Typography.md, color: Colors.textPrimary },
  roomBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full },
  roomBadgeText: { fontSize: Typography.xs, fontWeight: Typography.bold },
  serverWarning: { margin: Spacing.lg, backgroundColor: Colors.warning + '20', borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.warning + '60', gap: Spacing.xs },
  serverWarningTitle: { color: Colors.warning, fontSize: Typography.md, fontWeight: Typography.bold },
  serverWarningBody: { color: Colors.textSecondary, fontSize: Typography.sm, lineHeight: 20 },
  serverWarningCode: { color: Colors.primary, fontFamily: 'monospace' },
  emptyText: { fontSize: Typography.sm, color: Colors.textMuted, textAlign: 'center', paddingVertical: Spacing.sm },
});
