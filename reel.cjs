// // server.js
// require('dotenv').config();
// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const cors = require('cors');
// const { v4: uuidv4 } = require('uuid');
// const ffmpeg = require('fluent-ffmpeg');
// const ffmpegPath = require('ffmpeg-static');
// const ffprobePath = require('ffprobe-static').path;
// const { MongoClient, ObjectId } = require('mongodb');

// ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfprobePath(ffprobePath);

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Enhanced upload directory configuration
// const UPLOAD_BASE_DIR = path.join(__dirname, 'uploads');
// const THUMBNAIL_SUBDIR = 'thumbnails';
// const VIDEO_SUBDIR = 'videos';

// // Ensure upload directory structure exists
// const ensureUploadDirs = () => {
//   const dirs = [
//     UPLOAD_BASE_DIR,
//     path.join(UPLOAD_BASE_DIR, THUMBNAIL_SUBDIR),
//     path.join(UPLOAD_BASE_DIR, VIDEO_SUBDIR)
//   ];

//   dirs.forEach(dir => {
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//       console.log(`Created directory: ${dir}`);
//     }
//   });
// };

// // Initialize directories
// ensureUploadDirs();

// // MongoDB connection
// const mongoUri = 'mongodb+srv://altpsychward:rCKi9B19te5MlxNA@ott-messaging.912dwbk.mongodb.net/?retryWrites=true&w=majority&appName=ott-messaging';
// let db, client;

// async function connectToMongo() {
//   try {
//     client = new MongoClient(mongoUri);
//     await client.connect();
//     db = client.db();
//     console.log('Connected to MongoDB');
    
//     // Create indexes
//     await db.collection('reels').createIndex({ userId: 1 });
//     await db.collection('reels').createIndex({ timestamp: -1 });
//     await db.collection('users').createIndex({ username: 1 }, { unique: true });
//   } catch (err) {
//     console.error('MongoDB connection error:', err);
//     process.exit(1);
//   }
// }

// // Enhanced CORS configuration
// app.use(cors({
//   origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
//   methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static(UPLOAD_BASE_DIR));
// app.use(express.static(path.join(__dirname, 'public')));

// // File upload configuration with improved storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(UPLOAD_BASE_DIR, VIDEO_SUBDIR));
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
//     const ext = path.extname(file.originalname);
//     const filename = `reel-${uniqueSuffix}${ext}`;
//     cb(null, filename);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only video files are allowed!'), false);
//   }
// };

// const upload = multer({ 
//   storage,
//   limits: { 
//     fileSize: 100 * 1024 * 1024, // 100MB limit
//     files: 1
//   },
//   fileFilter
// });

// // Video processing utilities
// const generateThumbnail = async (videoPath, thumbnailPath) => {
//   return new Promise((resolve, reject) => {
//     ffmpeg(videoPath)
//       .on('end', () => resolve())
//       .on('error', (err) => reject(err))
//       .screenshots({
//         count: 1,
//         timestamps: ['10%'],
//         filename: path.basename(thumbnailPath),
//         folder: path.dirname(thumbnailPath),
//         size: '320x180'
//       });
//   });
// };

// const getVideoMetadata = (videoPath) => {
//   return new Promise((resolve, reject) => {
//     ffmpeg.ffprobe(videoPath, (err, metadata) => {
//       if (err) return reject(err);
      
//       const duration = metadata.format.duration;
//       const { width, height } = metadata.streams.find(s => s.width) || {};
      
//       resolve({
//         duration,
//         resolution: width && height ? `${width}x${height}` : null,
//         format: metadata.format.format_name
//       });
//     });
//   });
// };

// const formatDuration = (seconds) => {
//   const date = new Date(0);
//   date.setSeconds(seconds);
//   return date.toISOString().substr(11, 8).replace(/^00:/, '');
// };

// // Authentication middleware
// const authenticate = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).json({ error: 'Authorization header missing' });
//   }

//   try {
//     const token = authHeader.split(' ')[1];
//     const user = await db.collection('users').findOne({ _id: new ObjectId(token) });
    
//     if (!user) {
//       return res.status(403).json({ error: 'Invalid authentication token' });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error('Authentication error:', err);
//     res.status(500).json({ error: 'Authentication failed' });
//   }
// };

// // Validation middleware
// const validateReelInput = (req, res, next) => {
//   const { caption } = req.body;
  
//   if (!caption || caption.trim().length === 0) {
//     return res.status(400).json({ error: 'Caption is required' });
//   }
  
//   if (caption.length > 2200) {
//     return res.status(400).json({ error: 'Caption must be less than 2200 characters' });
//   }
  
//   next();
// };

// // Routes
// // GUI Routes
// app.get('/gui', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.get('/gui/upload', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'upload.html'));
// });

// app.get('/gui/reels/:id', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'view.html'));
// });

// // API Routes
// app.get('/api/reels', async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const [reels, total] = await Promise.all([
//       db.collection('reels')
//         .find()
//         .sort({ timestamp: -1 })
//         .skip(skip)
//         .limit(limit)
//         .toArray(),
//       db.collection('reels').countDocuments()
//     ]);

//     // Check if user is authenticated and add liked status
//     const authHeader = req.headers.authorization;
//     let userId = null;
//     if (authHeader) {
//       const token = authHeader.split(' ')[1];
//       try {
//         const user = await db.collection('users').findOne({ _id: new ObjectId(token) });
//         if (user) userId = user._id.toString();
//       } catch (err) {
//         console.error('Error checking user:', err);
//       }
//     }

//     const results = {
//       total,
//       page,
//       limit,
//       data: reels.map(reel => ({
//         ...reel,
//         id: reel._id.toString(),
//         videoUrl: `/uploads/${VIDEO_SUBDIR}/${path.basename(reel.videoUrl)}`,
//         thumbnail: `/uploads/${THUMBNAIL_SUBDIR}/${path.basename(reel.thumbnail)}`,
//         liked: userId ? reel.likesBy?.includes(userId) : false
//       }))
//     };

//     res.json(results);
//   } catch (err) {
//     console.error('Error fetching reels:', err);
//     res.status(500).json({ error: 'Failed to fetch reels' });
//   }
// });

// app.get('/api/reels/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const reel = await db.collection('reels').findOne({ _id: new ObjectId(id) });

//     if (!reel) {
//       return res.status(404).json({ error: 'Reel not found' });
//     }

//     // Increment views
//     await db.collection('reels').updateOne(
//       { _id: new ObjectId(id) },
//       { $inc: { views: 1 } }
//     );

//     // Check if user liked this reel
//     const authHeader = req.headers.authorization;
//     let liked = false;
//     if (authHeader) {
//       const token = authHeader.split(' ')[1];
//       try {
//         const user = await db.collection('users').findOne({ _id: new ObjectId(token) });
//         if (user) liked = reel.likesBy?.includes(user._id.toString());
//       } catch (err) {
//         console.error('Error checking user:', err);
//       }
//     }

//     res.json({
//       ...reel,
//       id: reel._id.toString(),
//       videoUrl: `/uploads/${VIDEO_SUBDIR}/${path.basename(reel.videoUrl)}`,
//       thumbnail: `/uploads/${THUMBNAIL_SUBDIR}/${path.basename(reel.thumbnail)}`,
//       liked
//     });
//   } catch (err) {
//     console.error('Error fetching reel:', err);
//     res.status(500).json({ error: 'Failed to fetch reel' });
//   }
// });

// app.post('/api/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await db.collection('users').findOne({ username, password });

//     if (!user) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     res.json({
//       token: user._id.toString(),
//       user: {
//         id: user._id.toString(),
//         username: user.username,
//         name: user.name,
//         avatar: user.avatar
//       }
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ error: 'Login failed' });
//   }
// });

// app.post('/api/reels', 
//   authenticate,
//   upload.single('video'), 
//   validateReelInput, 
//   async (req, res) => {
//     try {
//       const { caption } = req.body;
//       const videoFilename = req.file.filename;
//       const videoPath = req.file.path;
//       const videoUrl = path.join(VIDEO_SUBDIR, videoFilename);
      
//       const thumbnailFilename = `thumbnail-${path.parse(videoFilename).name}.jpg`;
//       const thumbnailPath = path.join(UPLOAD_BASE_DIR, THUMBNAIL_SUBDIR, thumbnailFilename);
//       const thumbnailUrl = path.join(THUMBNAIL_SUBDIR, thumbnailFilename);

//       // Process video in parallel
//       const [metadata] = await Promise.all([
//         getVideoMetadata(videoPath),
//         generateThumbnail(videoPath, thumbnailPath)
//       ]);

//       const newReel = {
//         userId: req.user._id.toString(),
//         userAvatar: req.user.avatar,
//         username: req.user.username,
//         caption: caption.trim(),
//         videoUrl,
//         thumbnail: thumbnailUrl,
//         duration: formatDuration(metadata.duration),
//         resolution: metadata.resolution,
//         format: metadata.format,
//         likes: 0,
//         likesBy: [],
//         comments: [],
//         views: 0,
//         timestamp: new Date()
//       };

//       const result = await db.collection('reels').insertOne(newReel);
//       newReel._id = result.insertedId;
      
//       res.status(201).json({
//         ...newReel,
//         id: newReel._id.toString(),
//         videoUrl: `/uploads/${newReel.videoUrl}`,
//         thumbnail: `/uploads/${newReel.thumbnail}`
//       });
//     } catch (error) {
//       console.error('Error uploading reel:', error);
      
//       // Clean up uploaded files if something went wrong
//       if (req.file?.path && fs.existsSync(req.file.path)) {
//         fs.unlinkSync(req.file.path);
//       }
//       if (thumbnailPath && fs.existsSync(thumbnailPath)) {
//         fs.unlinkSync(thumbnailPath);
//       }
      
//       res.status(500).json({ 
//         error: 'Failed to upload reel',
//         details: process.env.NODE_ENV === 'development' ? error.message : undefined
//       });
//     }
//   }
// );

// // ... (keep the remaining routes the same as in previous version)

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
  
//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({ 
//       error: err.code === 'LIMIT_FILE_SIZE' 
//         ? 'File too large (max 100MB)' 
//         : err.message 
//     });
//   }
  
//   res.status(500).json({ 
//     error: 'Internal server error',
//     ...(process.env.NODE_ENV === 'development' && { details: err.message })
//   });
// });

// // Start server
// connectToMongo().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
    
//     console.log(`Upload directory: ${UPLOAD_BASE_DIR}`);
//     console.log(`GUI available at http://localhost:${PORT}/gui`);
//     console.log(`MongoDB connected to: ${mongoUri}`);
//   });
// });

// // Graceful shutdown
// process.on('SIGINT', async () => {
//   console.log('Shutting down server...');
//   if (client) {
//     await client.close();
//     console.log('MongoDB connection closed');
//   }
//   process.exit(0);
// });