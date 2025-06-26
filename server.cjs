const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoUri = `mongodb+srv://altpsychward:rCKi9B19te5MlxNA@ott-messaging.912dwbk.mongodb.net/?retryWrites=true&w=majority&appName=ott-messaging`;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Schemas
const messageSchema = new mongoose.Schema({
  roomId: String,
  from: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const watchPartyMessageSchema = new mongoose.Schema({
  roomId: String,
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const liveStreamSchema = new mongoose.Schema({
  roomId: String,
  email: String,
  title: String,
  startedAt: Date,
  hostSocketId: String,
  thumbnail: String,
  endedAt: Date,
  viewers: Number,
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
const WatchPartyMessage = mongoose.model("WatchPartyMessage", watchPartyMessageSchema);
const LiveStream = mongoose.model("LiveStream", liveStreamSchema);

// In-memory data
const watchPartyParticipants = {};
const liveStreams = new Map();
const streamViewers = new Map();

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Helper function to update all clients with current streams
const updateAllClients = async () => {
  const streams = Array.from(liveStreams.values()).map(stream => ({
    ...stream,
    viewers: streamViewers.get(stream.roomId)?.size || 0
  }));
  io.emit("streamsUpdated", streams);
};

io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  // ───────────── Chat Room ─────────────
  socket.on("joinRoom", async ({ roomId, email }) => {
    socket.join(roomId);
    console.log(`👤 ${email} joined room ${roomId}`);

    socket.to(roomId).emit("user-joined", { id: socket.id, email });

    try {
      const history = await Message.find({ roomId }).sort({ timestamp: 1 }).limit(100);
      socket.emit("chatHistory", history.map(msg => ({
        from: msg.from,
        message: msg.text,
        time: msg.timestamp,
      })));
    } catch (err) {
      console.error("❌ Chat history error:", err);
    }
  });

  socket.on("sendMessage", async ({ roomId, message, from }) => {
    try {
      const newMsg = new Message({ roomId, from, text: message });
      await newMsg.save();

      io.to(roomId).emit("receiveMessage", {
        from,
        message,
        time: newMsg.timestamp,
      });
    } catch (error) {
      console.error("❌ Error saving message:", error);
    }
  });

  // ───────────── Watch Party ─────────────
  socket.on("joinWatchParty", async ({ roomId, name = "Guest" }) => {
    socket.join(roomId);
    console.log(`🎥 ${name} joined Watch Party ${roomId}`);

    if (!watchPartyParticipants[roomId]) {
      watchPartyParticipants[roomId] = [];
    }

    watchPartyParticipants[roomId].push({ id: socket.id, name });
    io.to(roomId).emit("participantList", watchPartyParticipants[roomId]);

    try {
      const chatHistory = await WatchPartyMessage.find({ roomId }).sort({ timestamp: 1 }).limit(100);
      socket.emit("watchChatHistory", chatHistory);
    } catch (err) {
      console.error("❌ Watch Party chat error:", err);
    }
  });

  socket.on("sendWatchChat", async ({ roomId, text, sender = "Guest" }) => {
    try {
      const newMsg = new WatchPartyMessage({ roomId, sender, text });
      await newMsg.save();

      io.to(roomId).emit("watchChat", {
        sender,
        text,
        timestamp: newMsg.timestamp,
      });
    } catch (err) {
      console.error("❌ Error saving watch chat:", err);
    }
  });

  // ───────────── WebRTC Signaling ─────────────
  socket.on("offer", ({ roomId, offer, to }) => {
    socket.to(to).emit("offer", { offer, from: socket.id });
  });

  socket.on("answer", ({ answer, to }) => {
    socket.to(to).emit("answer", { answer, from: socket.id });
  });

  socket.on("ice-candidate", ({ candidate, to }) => {
    socket.to(to).emit("ice-candidate", { candidate, from: socket.id });
  });

  // ───────────── 🔴 Live Stream ─────────────
  socket.on("startLive", async ({ email, title = `${email}'s Stream` }) => {
    const roomId = uuidv4();
    socket.join(roomId);

    const streamData = {
      roomId,
      email,
      title,
      startedAt: new Date(),
      hostSocketId: socket.id,
      thumbnail: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random`
    };

    // Save to memory
    liveStreams.set(roomId, streamData);
    streamViewers.set(roomId, new Set([socket.id])); // Host counts as first viewer

    // Save to database
    try {
      await new LiveStream({
        ...streamData,
        viewers: 1
      }).save();
    } catch (err) {
      console.error("❌ Error saving stream to DB:", err);
    }

    console.log(`🔴 Live started: ${roomId} by ${email}`);
    socket.emit("liveStarted", { roomId });
    await updateAllClients();
  });

  socket.on("joinLiveStream", async ({ roomId, email }) => {
    if (!liveStreams.has(roomId)) {
      return socket.emit("streamNotFound");
    }

    socket.join(roomId);
    const viewers = streamViewers.get(roomId);
    viewers.add(socket.id);

    // Update viewer count
    try {
      await LiveStream.findOneAndUpdate(
        { roomId },
        { $inc: { viewers: 1 } }
      );
    } catch (err) {
      console.error("❌ Error updating viewer count:", err);
    }

    io.emit("viewerUpdate", {
      roomId,
      viewers: viewers.size
    });

    console.log(`👀 ${email} joined live stream ${roomId}`);
    await updateAllClients();
  });

  socket.on("leaveLiveStream", async ({ roomId }) => {
    const viewers = streamViewers.get(roomId);
    if (viewers) {
      viewers.delete(socket.id);
      
      try {
        await LiveStream.findOneAndUpdate(
          { roomId },
          { $inc: { viewers: -1 } }
        );
      } catch (err) {
        console.error("❌ Error updating viewer count:", err);
      }

      io.emit("viewerUpdate", {
        roomId,
        viewers: viewers.size
      });
      await updateAllClients();
    }
  });

  socket.on("endLive", async ({ roomId }) => {
    if (liveStreams.has(roomId)) {
      // Update database
      try {
        await LiveStream.findOneAndUpdate(
          { roomId },
          { endedAt: new Date() }
        );
      } catch (err) {
        console.error("❌ Error updating stream end time:", err);
      }

      // Clean up
      liveStreams.delete(roomId);
      streamViewers.delete(roomId);
      
      console.log(`🛑 Live ended: ${roomId}`);
      io.emit("liveEnded", { roomId });
      await updateAllClients();
    }
  });

  // ───────────── Disconnect ─────────────
  socket.on("disconnect", async () => {
    console.log("❌ Disconnected:", socket.id);

    // Remove from watch party
    for (const roomId in watchPartyParticipants) {
      const originalLength = watchPartyParticipants[roomId].length;
      watchPartyParticipants[roomId] = watchPartyParticipants[roomId].filter(p => p.id !== socket.id);

      if (watchPartyParticipants[roomId].length !== originalLength) {
        io.to(roomId).emit("participantList", watchPartyParticipants[roomId]);
      }
    }

    // Remove from viewer counts
    streamViewers.forEach(async (viewers, roomId) => {
      if (viewers.has(socket.id)) {
        viewers.delete(socket.id);
        
        try {
          await LiveStream.findOneAndUpdate(
            { roomId },
            { $inc: { viewers: -1 } }
          );
        } catch (err) {
          console.error("❌ Error updating viewer count:", err);
        }

        io.emit("viewerUpdate", {
          roomId,
          viewers: viewers.size
        });
        await updateAllClients();
      }
    });

    // End any hosted streams
    for (const [roomId, streamData] of liveStreams.entries()) {
      if (streamData.hostSocketId === socket.id) {
        try {
          await LiveStream.findOneAndUpdate(
            { roomId },
            { endedAt: new Date() }
          );
        } catch (err) {
          console.error("❌ Error updating stream end time:", err);
        }

        liveStreams.delete(roomId);
        streamViewers.delete(roomId);
        console.log(`🛑 Live ended (disconnect): ${roomId}`);
        io.emit("liveEnded", { roomId });
        await updateAllClients();
        break;
      }
    }
  });
});

// ───────────── API ─────────────
app.get("/live-streams", async (req, res) => {
  try {
    const streams = Array.from(liveStreams.values()).map(stream => ({
      ...stream,
      viewers: streamViewers.get(stream.roomId)?.size || 0
    }));
    res.json(streams);
  } catch (err) {
    console.error("❌ Error fetching live streams:", err);
    res.status(500).json({ error: "Failed to fetch streams" });
  }
});

app.get("/past-streams", async (req, res) => {
  try {
    const streams = await LiveStream.find({ endedAt: { $exists: true } })
      .sort({ startedAt: -1 })
      .limit(50);
    res.json(streams);
  } catch (err) {
    console.error("❌ Error fetching past streams:", err);
    res.status(500).json({ error: "Failed to fetch past streams" });
  }
});

// ───────────── Start Server ─────────────
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});