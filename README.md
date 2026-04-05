# 🎎 Ô Ăn Quan – Game Mobile

Game dân gian Việt Nam dành cho điện thoại. Chơi **offline** (PvP / PvE với AI) và **online** (phòng riêng qua WebSocket).

---

## Cấu trúc dự án

```
DesignGame/
├── App.tsx                      # Entry với Redux Provider
├── index.ts                     # Expo entry
├── .env.example                 # Template biến môi trường
├── tsconfig.json
├── package.json
│
├── server/                      # Backend Node.js (Online mode)
│   ├── index.js                 # Socket.IO server
│   └── package.json
│
└── src/
    ├── config/env.ts            # URL server từ biến môi trường
    ├── theme/                   # Design tokens
    │   ├── colors.ts
    │   ├── typography.ts
    │   └── spacing.ts
    ├── types/                   # TypeScript types
    │   ├── game.types.ts
    │   ├── navigation.types.ts
    │   ├── online.types.ts
    │   └── index.ts
    ├── utils/constants.ts       # Hằng số board/animation
    ├── store/                   # Redux Toolkit
    │   ├── store.ts
    │   ├── gameSlice.ts         # Board, scores, winner
    │   ├── userSlice.ts         # Tên người chơi
    │   ├── onlineSlice.ts       # Phòng, kết nối
    │   └── settingsSlice.ts     # Âm thanh, rung, tốc độ
    ├── services/                # Dịch vụ độc lập
    │   ├── SocketService.ts     # WebSocket client
    │   ├── StorageService.ts    # AsyncStorage
    │   └── SoundService.ts      # Âm thanh (placeholder)
    ├── logic/                   # Game logic thuần
    │   ├── Rules.ts
    │   ├── GameController.ts
    │   ├── AIController.ts      # EASY / MEDIUM / HARD
    │   └── OnlineController.ts  # Đồng bộ nước đi online
    ├── navigation/
    │   └── AppNavigator.tsx
    ├── screens/
    │   ├── LoginScreen.tsx
    │   ├── ModeSelectScreen.tsx
    │   ├── LobbyScreen.tsx      # Sảnh online
    │   ├── GameScreen.tsx
    │   ├── ResultScreen.tsx
    │   ├── SettingsScreen.tsx
    │   └── TutorialScreen.tsx
    └── components/
        ├── game/                # Board, Pit, Score, Stone
        └── common/              # Button, Modal, LoadingSpinner
```

---

## Chạy ứng dụng

### 1. Cài dependencies

```bash
cd DesignGame
npm install
```

### 2. Chạy Expo (offline mode)

```bash
npx expo start
```

Quét QR bằng app **Expo Go** trên điện thoại.

---

## Chạy Online Mode

### 1. Cài server

```bash
cd DesignGame/server
npm install
```

### 2. Khởi động server

```bash
node index.js
# Server chạy tại http://localhost:3001
```

### 3. Cấu hình URL

Tạo file `.env` từ `.env.example`:

```
EXPO_PUBLIC_SOCKET_URL=http://<IP_máy_tính>:3001
```

> **Lưu ý:** Điện thoại và máy tính phải cùng mạng Wi-Fi. Dùng IP thực (VD `192.168.1.x`), không dùng `localhost`.

---

