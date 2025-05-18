const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const rooms = {}; // { roomId: { socketId: email } }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, email }) => {
    socket.join(roomId);
    socket.email = email;
    socket.roomId = roomId;

    if (!rooms[roomId]) rooms[roomId] = {};
    rooms[roomId][socket.id] = email;

    // Notify others in the room
    socket.to(roomId).emit('user-joined', { userId: socket.id, email });

    // Send updated user list to all in room
    io.in(roomId).emit('user-list', Object.entries(rooms[roomId]).map(([id, email]) => ({
      userId: id,
      email,
    })));
  });

  socket.on('offer', ({ targetId, offer }) => {
    io.to(targetId).emit('offer', { from: socket.id, offer });
  });

  socket.on('answer', ({ targetId, answer }) => {
    io.to(targetId).emit('answer', { from: socket.id, answer });
  });

  socket.on('ice-candidate', ({ targetId, candidate }) => {
    io.to(targetId).emit('ice-candidate', { from: socket.id, candidate });
  });

  socket.on('chat-message', ({ sender, message }) => {
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id) {
        io.to(roomId).emit('chat-message', { sender, message });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    for (const roomId in rooms) {
      if (rooms[roomId][socket.id]) {
        delete rooms[roomId][socket.id];
        socket.to(roomId).emit('user-disconnected', { userId: socket.id });

        io.in(roomId).emit('user-list', Object.entries(rooms[roomId]).map(([id, email]) => ({
          userId: id,
          email,
        })));

        if (Object.keys(rooms[roomId]).length === 0) {
          delete rooms[roomId];
        }
      }
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
