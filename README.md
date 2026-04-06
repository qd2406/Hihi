# Ô Ăn Quan 

Game dân gian Việt Nam dành cho điện thoại. Chơi **offline** (PvP / PvE với AI)

---


## Chạy ứng dụng

### 1. Cài dependencies

```bash
cd DesignGame
npm install
```
### 2. Cài công cụ tunnel (với máy mới)
```bash
npm install -g @expo/ngrok
```

### 3. Chạy Expo (offline mode)
- Chạy với trường hợp máy tính và điện thoại cùng mạng
```bash
npx expo start -c 
```
- Chạy với trường hợp máy tính và điện thoại khác mạng
```bash
npx expo start -c --tunnel
```

Quét QR bằng app **Expo Go** trên điện thoại.

