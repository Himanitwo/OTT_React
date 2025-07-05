const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const NodeMediaServer = require('node-media-server');
const mongoose = require('mongoose');
const crypto = require('crypto');

// Initialize Express and Socket.io
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost/livestream')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Stream Model
const Stream = mongoose.model('Stream', {
  title: String,
  userId: String,
  streamKey: { type: String, unique: true },
  status: { type: String, default: 'live' },
  viewers: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Generate random stream key
const generateStreamKey = () => crypto.randomBytes(16).toString('hex');

// RTMP Server Setup
const nms = new NodeMediaServer({
  rtmp: { port: 1935, chunk_size: 60000, gop_cache: true },
  http: { port: 8000, allow_origin: '*' }
});

nms.on('prePublish', async (id, streamPath, args) => {
  const streamKey = streamPath.split('/').pop();
  const stream = await Stream.findOne({ streamKey });

  if (!stream) {
    nms.getSession(id).reject();
    console.log('Rejected unauthorized stream:', streamKey);
  } else {
    console.log('Stream started:', stream.title);
    io.emit('stream-started', stream);
  }
});

nms.on('donePublish', async (id, streamPath) => {
  const streamKey = streamPath.split('/').pop();
  await Stream.findOneAndUpdate(
    { streamKey },
    { status: 'ended' }
  );
  io.emit('stream-ended', { streamKey });
});

nms.run();

// API Routes
app.post('/api/streams/start', async (req, res) => {
  try {
    const { title, userId } = req.body;
    const stream = new Stream({
      title,
      userId,
      streamKey: generateStreamKey()
    });
    await stream.save();
    res.status(201).json(stream);
  } catch (err) {
    res.status(500).json({ error: 'Failed to start stream' });
  }
});

app.post('/api/streams/:id/end', async (req, res) => {
  try {
    const stream = await Stream.findByIdAndUpdate(
      req.params.id,
      { status: 'ended' },
      { new: true }
    );
    res.json(stream);
  } catch (err) {
    res.status(500).json({ error: 'Failed to end stream' });
  }
});

app.get('/api/streams', async (req, res) => {
  try {
    const streams = await Stream.find({ status: 'live' });
    res.json(streams);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch streams' });
  }
});

app.get('/api/streams/:id/watch', async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) return res.status(404).json({ error: 'Stream not found' });
    res.json(stream);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stream' });
  }
});

// Socket.io Events
io.on('connection', (socket) => {
  socket.on('viewer-joined', async (streamId) => {
    const stream = await Stream.findByIdAndUpdate(
      streamId,
      { $inc: { viewers: 1 } },
      { new: true }
    );
    io.emit('viewer-update', stream);
  });

  socket.on('viewer-left', async (streamId) => {
    const stream = await Stream.findByIdAndUpdate(
      streamId,
      { $inc: { viewers: -1 } },
      { new: true }
    );
    io.emit('viewer-update', stream);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
  API Server: http://localhost:${PORT}
  RTMP Server: rtmp://localhost:1935/live
  HLS/WebPlayer: http://localhost:8000/live
  `);
});