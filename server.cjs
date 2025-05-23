const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
// require("dotenv").config(); // Load env variables

// Setup Express and HTTP server
const app = express();
const server = http.createServer(app);
app.use(cors());

// Setup Socket.io
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB securely
const mongoUri = `mongodb+srv://altpsychward:rCKi9B19te5MlxNA@ott-messaging.912dwbk.mongodb.net/?retryWrites=true&w=majority&appName=ott-messaging`;

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define Mongoose schema
const messageSchema = new mongoose.Schema({
  roomId: String,
  from: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

// Temporary test route to manually insert a test message
app.get("/test-message", async (req, res) => {
  try {
    const testMsg = new Message({
      roomId: "testRoom",
      from: "tester@example.com",
      text: "This is a test message",
    });
    await testMsg.save();
    console.log("✅ Test message saved");
    res.send("✅ Test message saved to MongoDB");
  } catch (error) {
    console.error("❌ Error saving test message:", error);
    res.status(500).send("Error saving message");
  }
});

// Socket.io logic
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("joinRoom", async ({ roomId, email }) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", { id: socket.id, email });
    console.log(`👤 ${email} joined room: ${roomId}`);

    const history = await Message.find({ roomId }).sort({ timestamp: 1 }).limit(100);
    socket.emit("chatHistory", history);
  });

  socket.on("sendMessage", async ({ roomId, message, from }) => {
    try {
      const newMsg = new Message({ roomId, from, text: message });
      await newMsg.save();
      console.log("💾 Message saved:", newMsg);

      io.to(roomId).emit("receiveMessage", {
        text: message,
        from,
        timestamp: newMsg.timestamp,
      });
    } catch (error) {
      console.error("❌ Error saving message:", error);
    }
  });

  // WebRTC signaling
  socket.on("offer", ({ roomId, offer, to }) => {
    socket.to(to).emit("offer", { offer, from: socket.id });
  });

  socket.on("answer", ({ answer, to }) => {
    socket.to(to).emit("answer", { answer, from: socket.id });
  });

  socket.on("ice-candidate", ({ candidate, to }) => {
    socket.to(to).emit("ice-candidate", { candidate, from: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start server
server.listen(4000, () => {
  console.log("🚀 Server running on http://localhost:4000");
});
