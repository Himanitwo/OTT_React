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
  roomId: { type: String, required: true },
  from: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { versionKey: false });

const watchPartyMessageSchema = new mongoose.Schema({
  roomId: String,
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
}, { versionKey: false });

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

// In-memory maps
const watchPartyParticipants = {};
const streamViewers = new Map(); // Tracks active viewers per stream

// Socket.IO setup
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Chat handlers
const handleChatMessages = (socket) => {
  socket.on("joinRoom", async ({ roomId, email }, callback) => {
    try {
      socket.join(roomId);
      console.log(`👤 ${email} joined room ${roomId}`);

      socket.to(roomId).emit("userJoined", { id: socket.id, email });

      const history = await Message.find({ roomId }).sort({ timestamp: 1 }).limit(100);
      socket.emit("chatHistory", history);

      if (callback) callback({ status: "success" });
    } catch (err) {
      console.error("❌ Error fetching chat history:", err);
      if (callback) callback({ status: "error", error: err.message });
    }
  });

  socket.on("sendMessage", async (data, callback) => {
    const { roomId, from, text } = data;

    if (!roomId || !from || !text || text.trim() === "") {
      console.error("❌ Invalid message payload:", data);
      if (callback) callback({ status: "error", error: "Missing fields" });
      return;
    }

    try {
      const newMsg = new Message({ roomId, from, text });
      const saved = await newMsg.save();

      const messageData = {
        from: saved.from,
        text: saved.text,
        timestamp: saved.timestamp,
        roomId: saved.roomId,
      };

      io.to(roomId).emit("receiveMessage", messageData);
      if (callback) callback({ status: "success", message: messageData });
    } catch (error) {
      console.error("❌ Error saving message:", error);
      if (callback) callback({ status: "error", error: error.message });
    }
  });
};

// Live Stream handlers
const handleLiveStreams = (socket) => {
  socket.on("startStream", async ({ email, title }, callback) => {
    try {
      const roomId = uuidv4();
      const thumbnail = `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random`;

      const newStream = new LiveStream({
        roomId,
        email,
        title,
        startedAt: new Date(),
        hostSocketId: socket.id,
        thumbnail,
        viewers: 0
      });

      await newStream.save();
      streamViewers.set(roomId, new Set());

      io.emit("newLiveStarted", newStream);
      if (callback) callback({ status: "success", stream: newStream });
    } catch (err) {
      console.error("❌ Error starting stream:", err);
      if (callback) callback({ status: "error", error: err.message });
    }
  });

  socket.on("endStream", async ({ roomId }, callback) => {
    try {
      await LiveStream.findOneAndUpdate(
        { roomId },
        { $set: { endedAt: new Date() } }
      );

      streamViewers.delete(roomId);
      io.emit("liveEnded", { roomId });

      if (callback) callback({ status: "success" });
    } catch (err) {
      console.error("❌ Error ending stream:", err);
      if (callback) callback({ status: "error", error: err.message });
    }
  });

  socket.on("joinStream", ({ roomId, email }, callback) => {
    try {
      socket.join(roomId);
      
      if (!streamViewers.has(roomId)) {
        streamViewers.set(roomId, new Set());
      }
      streamViewers.get(roomId).add(socket.id);

      const viewers = streamViewers.get(roomId).size;
      io.emit("viewerUpdate", { roomId, viewers });

      if (callback) callback({ status: "success", viewers });
    } catch (err) {
      console.error("❌ Error joining stream:", err);
      if (callback) callback({ status: "error", error: err.message });
    }
  });

  socket.on("leaveStream", ({ roomId }) => {
    if (streamViewers.has(roomId)) {
      streamViewers.get(roomId).delete(socket.id);
      const viewers = streamViewers.get(roomId).size;
      io.emit("viewerUpdate", { roomId, viewers });
    }
    socket.leave(roomId);
  });
};

// Socket connection
io.on("connection", (socket) => {
  console.log("🔌 New connection:", socket.id);
  
  handleChatMessages(socket);
  handleLiveStreams(socket);

  // Watch Party handler
  socket.on("joinWatchParty", async ({ roomId, name = "Guest" }, callback) => {
    socket.join(roomId);
    console.log(`🎥 ${name} joined Watch Party ${roomId}`);

    if (!watchPartyParticipants[roomId]) {
      watchPartyParticipants[roomId] = [];
    }

    watchPartyParticipants[roomId].push({ id: socket.id, name });
    io.to(roomId).emit("participantList", watchPartyParticipants[roomId]);

    try {
      const chatHistory = await WatchPartyMessage.find({ roomId }).sort({ timestamp: 1 }).limit(100);
      if (callback) {
        callback({ status: "success", history: chatHistory });
      } else {
        socket.emit("watchChatHistory", chatHistory);
      }
    } catch (err) {
      console.error("❌ Watch Party chat error:", err);
      if (callback) callback({ status: "error", error: err.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
    
    // Clean up viewer counts when users disconnect
    streamViewers.forEach((viewers, roomId) => {
      if (viewers.has(socket.id)) {
        viewers.delete(socket.id);
        io.emit("viewerUpdate", { roomId, viewers: viewers.size });
      }
    });
  });
});

// API Endpoints
app.get("/live-streams", async (req, res) => {
  try {
    const streams = await LiveStream.find({ endedAt: { $exists: false } });
    
    const streamsWithViewers = streams.map(stream => ({
      ...stream.toObject(),
      viewers: streamViewers.get(stream.roomId)?.size || 0
    }));
    
    res.json({ status: "success", data: streamsWithViewers });
  } catch (err) {
    console.error("❌ Error fetching live streams:", err);
    res.status(500).json({ status: "error", error: "Failed to fetch streams" });
  }
});

app.get("/past-streams", async (req, res) => {
  try {
    const streams = await LiveStream.find({ endedAt: { $exists: true } })
      .sort({ startedAt: -1 })
      .limit(50);
    res.json({ status: "success", data: streams });
  } catch (err) {
    console.error("❌ Error fetching past streams:", err);
    res.status(500).json({ status: "error", error: "Failed to fetch past streams" });
  }
});

// Start server
const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});