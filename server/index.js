/**
 * Server backend for Ô Ăn Quan – Online Multiplayer
 * 
 * Stack: Node.js + Express + Socket.IO
 * 
 * Chạy server:
 *   cd server
 *   npm install
 *   node index.js
 *
 * Default port: 3001
 */

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// ── In-memory room store ──────────────────────────────────────────────────────
/** @type {Map<string, { hostId: string, hostName: string, guestId?: string, guestName?: string, status: 'waiting'|'playing'|'finished' }>} */
const rooms = new Map();

const generateRoomId = () =>
  Math.random().toString(36).slice(2, 8).toUpperCase();

// ── Helpers ───────────────────────────────────────────────────────────────────
const broadcastRoomList = () => {
  const list = Array.from(rooms.entries())
    .filter(([, r]) => r.status === 'waiting')
    .map(([id, r]) => ({
      id,
      hostName: r.hostName,
      status: r.status,
      playerCount: r.guestId ? 2 : 1,
    }));
  io.emit('roomList', list);
};

// ── Socket events ─────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[+] Connected: ${socket.id}`);

  // Create room
  socket.on('createRoom', ({ playerName }) => {
    const roomId = generateRoomId();
    rooms.set(roomId, {
      hostId: socket.id,
      hostName: playerName ?? 'Ẩn danh',
      status: 'waiting',
    });
    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.emit('roomCreated', roomId);
    console.log(`[Room] Created ${roomId} by ${playerName}`);
    broadcastRoomList();
  });

  // Join room
  socket.on('joinRoom', ({ roomId, playerName }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', 'Phòng không tồn tại!');
      return;
    }
    if (room.guestId) {
      socket.emit('error', 'Phòng đã đầy!');
      return;
    }
    room.guestId = socket.id;
    room.guestName = playerName ?? 'Ẩn danh';
    room.status = 'playing';
    socket.join(roomId);
    socket.data.roomId = roomId;

    // Notify both players
    io.to(roomId).emit('roomJoined', {
      roomId,
      opponentName: playerName,
    });
    // Override: host gets guest's name; guest gets host's name
    socket.emit('roomJoined', { roomId, opponentName: room.hostName });
    io.to(room.hostId).emit('roomJoined', { roomId, opponentName: room.guestName });

    console.log(`[Room] ${playerName} joined ${roomId}`);
    broadcastRoomList();
  });

  // Send move – relay to the other player in the room
  socket.on('sendMove', (move) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    socket.to(roomId).emit('opponentMove', move);
  });

  // Get open rooms list
  socket.on('getRooms', () => {
    broadcastRoomList();
  });

  // Leave room
  socket.on('leaveRoom', () => {
    const roomId = socket.data.roomId;
    if (roomId) {
      socket.to(roomId).emit('opponentLeft');
      rooms.delete(roomId);
      socket.leave(roomId);
      socket.data.roomId = undefined;
      broadcastRoomList();
    }
  });

  socket.on('disconnect', () => {
    console.log(`[-] Disconnected: ${socket.id}`);
    const roomId = socket.data.roomId;
    if (roomId) {
      socket.to(roomId).emit('opponentLeft');
      rooms.delete(roomId);
      broadcastRoomList();
    }
  });
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', rooms: rooms.size }));

const PORT = process.env.PORT ?? 3001;
httpServer.listen(PORT, () => {
  console.log(`🎮 Ô Ăn Quan server running on http://localhost:${PORT}`);
});
