import React, { useState, useEffect, useRef } from 'react';
import { 
  FiHeart, FiMessageSquare, FiShare2, FiPlus, 
  FiX, FiSend, FiPause, FiPlay, FiUser, FiHome 
} from 'react-icons/fi';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  arrayUnion, 
  deleteDoc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { auth, db } from '../../firebase';

const ReelsApp = () => {
  // State
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState({});
  const [user, setUser] = useState(null);
  
  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  // Generate thumbnail from video (simplified)
  const generateThumbnail = (videoUrl) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.addEventListener('loadeddata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        video.currentTime = 1;
        video.addEventListener('seeked', () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL());
        });
      });
    });
  };

  // Backend API using Firestore and Blob URLs
  const backendAPI = {
    getReels: async (userId) => {
      const q = query(collection(db, 'reels'), orderBy('createdAt', 'desc'));
      return new Promise((resolve) => {
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const reels = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            isLiked: doc.data().likesBy?.includes(userId) || false
          }));
          resolve(reels);
        });
        return () => unsubscribe();
      });
    },

    uploadReel: async (file, caption, user) => {
      try {
        const videoUrl = URL.createObjectURL(file);
        const thumbnailUrl = await generateThumbnail(videoUrl);
        
        const reelData = {
          videoUrl,
          thumbnailUrl,
          caption,
          userId: user.uid,
          user: {
            uid: user.uid,
            username: user.displayName || 'Anonymous',
            avatar: user.photoURL || ''
          },
          likes: 0,
          likesBy: [],
          comments: [],
          createdAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, 'reels'), reelData);
        return { id: docRef.id, ...reelData };
      } catch (error) {
        throw error;
      }
    },

    likeReel: async (reelId, userId) => {
      const reelRef = doc(db, 'reels', reelId);
      await updateDoc(reelRef, {
        likes: increment(1),
        likesBy: arrayUnion(userId)
      });
    },

    addComment: async (reelId, text, user) => {
      const comment = {
        text,
        user: {
          uid: user.uid,
          username: user.displayName || 'Anonymous',
          avatar: user.photoURL || ''
        },
        createdAt: serverTimestamp()
      };
      
      const reelRef = doc(db, 'reels', reelId);
      await updateDoc(reelRef, {
        comments: arrayUnion(comment)
      });
      
      return comment;
    },

    deleteReel: async (reelId) => {
      await deleteDoc(doc(db, 'reels', reelId));
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    const maxSize = 50 * 1024 * 1024;
    
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid video file (MP4, MOV, AVI)');
      return;
    }
    
    if (file.size > maxSize) {
      setError('File size exceeds 50MB limit');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  // Handle upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !caption) {
      setError('Please select a file and add a caption');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const newReel = await backendAPI.uploadReel(selectedFile, caption, user);
      setReels(prev => [newReel, ...prev]);
      setShowUploadModal(false);
      resetUploadForm();
    } catch (err) {
      setError(err.message || 'Failed to upload reel');
    } finally {
      setUploading(false);
    }
  };

  // Reset upload form
  const resetUploadForm = () => {
    setCaption('');
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
  };

  // Handle scroll to manage video playback
  const handleScroll = () => {
    if (!containerRef.current || videoRefs.current.length === 0) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;

    videoRefs.current.forEach((videoRef, index) => {
      if (!videoRef) return;

      const videoRect = videoRef.getBoundingClientRect();
      const videoCenter = videoRect.top + videoRect.height / 2;

      if (Math.abs(videoCenter - containerCenter) < 100) {
        if (index !== activeReelIndex) {
          setActiveReelIndex(index);
          videoRefs.current.forEach(v => v && v.pause());
          videoRef.play().catch(e => console.log('Autoplay prevented:', e));
        }
      }
    });
  };

  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const reels = await backendAPI.getReels(user.uid);
          setReels(reels);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Clean up
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // Unauthenticated state
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">ReelShare</h1>
        <p className="text-xl mb-8 max-w-md">
          Sign in to discover, create, and share short videos
        </p>
        <button
          onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
          className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full flex items-center gap-2"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google logo" 
            className="w-5 h-5"
          />
          Sign In with Google
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gray-900 overflow-hidden">
      {/* Reels Feed */}
      <div 
        ref={containerRef}
        className="h-full pb-20 overflow-y-auto snap-y snap-mandatory"
      >
        {reels.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white">
            <p className="mb-4 text-lg">No reels found</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full flex items-center gap-2"
            >
              <FiPlus /> Upload Your First Reel
            </button>
          </div>
        ) : (
          reels.map((reel, index) => (
            <div 
              key={reel.id} 
              className="h-full w-full snap-start relative flex justify-center items-center bg-black"
            >
              <div className="relative h-full w-full max-w-[400px] flex items-center justify-center">
                <video
                  ref={el => videoRefs.current[index] = el}
                  src={reel.videoUrl}
                  poster={reel.thumbnailUrl}
                  loop
                  muted
                  playsInline
                  className="h-full max-h-[90vh] w-full object-contain"
                />
                
                {/* Video Info */}
                <div className="absolute bottom-20 left-0 right-0 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                          {reel.user?.avatar ? (
                            <img src={reel.user.avatar} alt={reel.user.username} className="w-full h-full object-cover" />
                          ) : (
                            <FiUser className="text-white" />
                          )}
                        </div>
                        <span className="text-white font-medium">
                          {reel.user?.username || 'Anonymous'}
                        </span>
                      </div>
                      <p className="text-white text-sm">{reel.caption}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col items-center gap-4">
                      <button onClick={() => backendAPI.likeReel(reel.id, user.uid)} className="flex flex-col items-center">
                        <FiHeart className={`text-2xl ${reel.isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                        <span className="text-white text-sm">{reel.likes}</span>
                      </button>
                      <button onClick={() => toggleComments(reel.id)} className="flex flex-col items-center">
                        <FiMessageSquare className="text-2xl text-white" />
                        <span className="text-white text-sm">{reel.comments?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 p-3 flex justify-around items-center border-t border-gray-800">
        <button className="text-white p-2">
          <FiHome className="text-2xl" />
        </button>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="text-white p-2"
        >
          <FiPlus className="text-2xl" />
        </button>
        <button onClick={() => signOut(auth)} className="text-white p-1">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
          ) : (
            <FiUser className="text-2xl" />
          )}
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-10">
          <div className="bg-gray-800 rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Upload New Reel</h2>
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                className="text-gray-400 hover:text-white"
              >
                <FiX className="text-2xl" />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-4">
              <div className="mb-4">
                {previewUrl ? (
                  <div className="relative">
                    <video src={previewUrl} controls className="w-full rounded-lg" />
                    <button
                      type="button"
                      onClick={resetUploadForm}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-8 cursor-pointer">
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <FiPlus className="text-4xl text-gray-500 mb-2" />
                    <p className="text-white font-medium">Select a video file</p>
                    <p className="text-gray-400 text-sm">MP4, MOV, AVI (max 50MB)</p>
                  </label>
                )}
              </div>
              
              <div className="mb-4">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                  rows={3}
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Reel'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReelsApp;