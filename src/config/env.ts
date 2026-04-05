// Cấu hình môi trường – đọc từ biến EXPO_PUBLIC_* (Expo tự inject)
export const ENV = {
  SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL ?? 'http://localhost:3001',
};
