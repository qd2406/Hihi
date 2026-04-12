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
-Cài đặt phiên bản phù hợp với điện thoại (Check ở phần setting -> supported SDK : hiện số bao nhiêu thì là phiên bản của expo có thể thay vào 54 ở dòng lệnh dưới)
```bash
npm install expo@54.0.0
```
### 2. Cài công cụ tunnel (với máy mới)
```bash
npm install -g @expo/ngrok
```

### 3. Chạy Expo (offline mode)
(Máy tính và điện thoại phải cùng 1 mạng wifi)
```bash
npx expo start -c 
```

Quét QR bằng app **Expo Go** trên điện thoại.

