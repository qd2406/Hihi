# Ô Ăn Quan 

Game dân gian Việt Nam dành cho điện thoại. Chơi **offline** (PvP / PvE với AI)

---


## Chạy ứng dụng

### 1. Cài dependencies

```bash
cd DesignGame
```
- Cấp quyền cho máy mới 
```bash
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```
-Cài đặt thư viện 
```bash
npm install
```
### 2. Cài công cụ tunnel (với máy mới)
```bash
npm install -g @expo/ngrok
```

### 3. Chạy Expo (offline mode)

```bash
npx expo start -c 
```

Quét QR bằng app **Expo Go** trên điện thoại.

