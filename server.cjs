const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const multer = require('multer');

const fs = require('fs');
const app = express();
const server = http.createServer(app);


const path = require('path');


const uploadDir = path.join(__dirname, 'uploads');

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
  // Start a new live stream
  socket.on("startStream", async ({ email, title }, callback) => {
    try {
      // Check for existing active stream by this user
      const existingStream = await LiveStream.findOne({ 
        email, 
        endedAt: { $exists: false } 
      });
      
      // End previous stream if exists
      if (existingStream) {
        await LiveStream.findByIdAndUpdate(existingStream._id, { 
          endedAt: new Date() 
        });
        io.emit("liveEnded", { roomId: existingStream.roomId });
        streamViewers.delete(existingStream.roomId);
      }

      // Create new stream
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
      streamViewers.set(roomId, new Set()); // Initialize viewer tracking

      io.emit("newLiveStarted", newStream);
      if (callback) callback({ status: "success", stream: newStream });
    } catch (err) {
      console.error("❌ Error starting stream:", err);
      if (callback) callback({ status: "error", error: err.message });
    }
  });

  // End a live stream
  socket.on("endStream", async ({ roomId }, callback) => {
    try {
      const stream = await LiveStream.findOneAndUpdate(
        { roomId },
        { $set: { endedAt: new Date() } },
        { new: true }
      );

      if (!stream) {
        throw new Error("Stream not found");
      }

      // Clean up
      streamViewers.delete(roomId);
      io.emit("liveEnded", { roomId });

      if (callback) callback({ status: "success" });
    } catch (err) {
      console.error("❌ Error ending stream:", err);
      if (callback) callback({ status: "error", error: err.message });
    }
  });

  // Viewer joins a stream
  socket.on("joinStream", ({ roomId, email }, callback) => {
    try {
      socket.join(roomId);
      
      // Initialize viewer tracking if needed
      if (!streamViewers.has(roomId)) {
        streamViewers.set(roomId, new Set());
      }
      
      // Add viewer
      streamViewers.get(roomId).add(socket.id);
      const viewers = streamViewers.get(roomId).size;
      
      // Update all clients
      io.emit("viewerUpdate", { roomId, viewers });

      if (callback) callback({ status: "success", viewers });
    } catch (err) {
      console.error("❌ Error joining stream:", err);
      if (callback) callback({ status: "error", error: err.message });
    }
  });

  // Viewer leaves a stream
  socket.on("leaveStream", ({ roomId }) => {
    if (streamViewers.has(roomId)) {
      streamViewers.get(roomId).delete(socket.id);
      const viewers = streamViewers.get(roomId).size;
      io.emit("viewerUpdate", { roomId, viewers });
    }
    socket.leave(roomId);
  });

  // Handle disconnections (clean up abandoned streams)
  socket.on("disconnect", () => {
    // Check if this socket was hosting any streams
    LiveStream.findOne({ 
      hostSocketId: socket.id, 
      endedAt: { $exists: false } 
    }).then(stream => {
      if (stream) {
        // Mark stream as ended
        LiveStream.findByIdAndUpdate(stream._id, { 
          endedAt: new Date() 
        }).then(() => {
          io.emit("liveEnded", { roomId: stream.roomId });
          streamViewers.delete(stream.roomId);
        });
      }
    });

    // Clean up viewer counts for all streams
    streamViewers.forEach((viewers, roomId) => {
      if (viewers.has(socket.id)) {
        viewers.delete(socket.id);
        io.emit("viewerUpdate", { roomId, viewers: viewers.size });
      }
    });
  });
};

const cleanupOldStreams = async () => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 days threshold
    
    const result = await LiveStream.deleteMany({
      endedAt: { $exists: true, $lt: cutoffDate }
    });
    
    console.log(`🧹 Cleaned up ${result.deletedCount} old streams`);
  } catch (err) {
    console.error("❌ Stream cleanup error:", err);
  }
};


// Socket connection
io.on("connection", (socket) => {
  console.log("🔌 New connection:", socket.id);
  
  handleChatMessages(socket);
  handleLiveStreams(socket);

  // Watch Party handler - Updated version
  socket.on("joinWatchParty", async ({ roomId, email, name }, callback) => {
    if (!roomId) {
      if (callback) callback({ status: "error", error: "Room ID is required" });
      return;
    }

    // Use email if available, otherwise generate a unique identifier
    const userIdentifier = email || `guest-${socket.id.substring(0, 8)}`;
    const displayName = name || userIdentifier.split('@')[0];

    socket.join(roomId);
    console.log(`🎥 ${displayName} joined Watch Party ${roomId}`);

    // Initialize room if it doesn't exist
    if (!watchPartyParticipants[roomId]) {
      watchPartyParticipants[roomId] = new Map(); // Using Map for better performance
    }

    // Update or add participant
    watchPartyParticipants[roomId].set(socket.id, {
      id: socket.id,
      email: userIdentifier,
      name: displayName,
      joinedAt: new Date()
    });

    // Convert Map to array for emitting
    const participantsArray = Array.from(watchPartyParticipants[roomId].values());
    io.to(roomId).emit("participantList", participantsArray);

    try {
      const chatHistory = await WatchPartyMessage.find({ roomId })
        .sort({ timestamp: 1 })
        .limit(100);
      
      if (callback) {
        callback({ 
          status: "success", 
          history: chatHistory,
          yourInfo: { id: socket.id, name: displayName }
        });
      } else {
        socket.emit("watchChatHistory", chatHistory);
      }
    } catch (err) {
      console.error("❌ Watch Party chat error:", err);
      if (callback) callback({ status: "error", error: err.message });
    }
  });

  // Handle watch party messages
  socket.on("sendWatchMessage", async ({ roomId, text }, callback) => {
    try {
      if (!watchPartyParticipants[roomId]?.has(socket.id)) {
        throw new Error("You're not in this watch party");
      }

      const participant = watchPartyParticipants[roomId].get(socket.id);
      const newMessage = new WatchPartyMessage({
        roomId,
        sender: participant.name,
        text,
        timestamp: new Date()
      });

      await newMessage.save();
      io.to(roomId).emit("newWatchMessage", {
        sender: participant.name,
        text,
        timestamp: new Date()
      });

      if (callback) callback({ status: "success" });
    } catch (err) {
      console.error("❌ Error sending watch party message:", err);
      if (callback) callback({ status: "error", error: err.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
    
    // Clean up watch party participants
    for (const roomId in watchPartyParticipants) {
      if (watchPartyParticipants[roomId].has(socket.id)) {
        watchPartyParticipants[roomId].delete(socket.id);
        const participantsArray = Array.from(watchPartyParticipants[roomId].values());
        io.to(roomId).emit("participantList", participantsArray);
      }
    }

    // Clean up viewer counts
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

// app.get("/past-streams", async (req, res) => {
//   try {
//     const streams = await LiveStream.find({ endedAt: { $exists: true } })
//       .sort({ startedAt: -1 })
//       .limit(50);
//     res.json({ status: "success", data: streams });
//   } catch (err) {
//     console.error("❌ Error fetching past streams:", err);
//     res.status(500).json({ status: "error", error: "Failed to fetch past streams" });
//   }
// });
// //upload file endpoint
// app.use(cors());
// app.use(express.json());

// // Configure Multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadsDir = path.join(__dirname, 'uploads');
//     if (!fs.existsSync(uploadsDir)) {
//       fs.mkdirSync(uploadsDir, { recursive: true });
//     }
//     cb(null, uploadsDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ 
//   storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
//   fileFilter: (req, file, cb) => {
//     const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
//     if (validTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type. Only MP4, MOV, AVI are allowed.'));
//     }
//   }
// });

// // Upload endpoint
// app.post('/api/upload', upload.single('video'), (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const videoUrl = `/uploads/${req.file.filename}`;
//     res.status(200).json({ 
//       videoUrl,
//       thumbnailUrl: 'https://via.placeholder.com/300x500?text=Video+Thumbnail'
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Serve uploaded files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Start server
const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});