import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  // State management
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
  const [authLoading, setAuthLoading] = useState(true);
  
  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  // Backend API functions using Firestore
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
        // Upload file to server
        const formData = new FormData();
        formData.append('video', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload video');
        }
        
        const { videoUrl, thumbnailUrl } = await response.json();
        
        // Save reel data to Firestore
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
    const maxSize = 50 * 1024 * 1024; // 50MB limit
    
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

  // Handle reel upload
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
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  // Handle like action
  const handleLike = async (reelId) => {
    try {
      await backendAPI.likeReel(reelId, user.uid);
      setReels(prev => prev.map(reel => 
        reel.id === reelId ? { 
          ...reel, 
          likes: reel.likes + 1, 
          isLiked: true,
          likesBy: [...(reel.likesBy || []), user.uid]
        } : reel
      ));
    } catch (err) {
      setError(err.message || 'Failed to like reel');
    }
  };

  // Handle comment submission
  const handleComment = async (reelId) => {
    if (!commentText.trim()) {
      setError('Please enter a comment');
      return;
    }

    try {
      const comment = await backendAPI.addComment(reelId, commentText, user);
      setReels(prev => prev.map(reel => 
        reel.id === reelId ? { 
          ...reel, 
          comments: [...(reel.comments || []), comment] 
        } : reel
      ));
      setCommentText('');
    } catch (err) {
      setError(err.message || 'Failed to add comment');
    }
  };

  // Handle reel deletion
  const handleDelete = async (reelId) => {
    if (!window.confirm('Are you sure you want to delete this reel?')) return;

    try {
      await backendAPI.deleteReel(reelId);
      setReels(prev => prev.filter(reel => reel.id !== reelId));
    } catch (err) {
      setError(err.message || 'Failed to delete reel');
    }
  };

  // Toggle comments visibility
  const toggleComments = (reelId) => {
    setShowComments(prev => ({
      ...prev,
      [reelId]: !prev[reelId]
    }));
  };

  // Handle video play/pause when scrolling
  const handleScroll = useCallback(() => {
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
  }, [activeReelIndex]);

  // Set up scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollHandler = () => {
      requestAnimationFrame(handleScroll);
    };

    container.addEventListener('scroll', scrollHandler);
    return () => container.removeEventListener('scroll', scrollHandler);
  }, [handleScroll]);

  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setAuthLoading(false);
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

  // Auth methods
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
    }
  };

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
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
          Sign in to discover, create, and share short videos with your friends
        </p>
        <button
          onClick={handleLogin}
          className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-colors"
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

  // Error state
  if (error && !authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-500">
        <div className="text-center p-4 max-w-md">
          <p className="text-xl mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-pink-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main app UI
  return (
    <div className="relative h-screen bg-gray-900 overflow-hidden">
      {/* Reels Feed */}
      <div 
        ref={containerRef}
        className="h-full pb-20 overflow-y-auto snap-y snap-mandatory scroll-smooth"
      >
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : reels.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white p-4 text-center">
            <p className="mb-4 text-lg">No reels found</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-colors"
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
              {/* Video Player */}
              <div className="relative h-full w-full max-w-[400px] flex items-center justify-center">
                <video
                  ref={el => videoRefs.current[index] = el}
                  src={reel.videoUrl}
                  poster={reel.thumbnailUrl}
                  loop
                  muted
                  playsInline
                  className="h-full max-h-[90vh] w-full object-contain"
                  onClick={(e) => {
                    if (e.target.paused) {
                      e.target.play().catch(err => console.log('Play failed:', err));
                    } else {
                      e.target.pause();
                    }
                  }}
                />
                
                {/* Play/Pause Overlay */}
                <button 
                  onClick={() => {
                    const video = videoRefs.current[index];
                    if (video.paused) {
                      video.play().catch(err => console.log('Play failed:', err));
                    } else {
                      video.pause();
                    }
                  }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity"
                >
                  {videoRefs.current[index]?.paused ? (
                    <div className="w-16 h-16 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                      <FiPlay size={32} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <FiPause size={32} className="text-white" />
                    </div>
                  )}
                </button>
                
                {/* Video Info */}
                <div className="absolute bottom-20 left-0 right-0 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white overflow-hidden">
                          {reel.user?.avatar ? (
                            <img 
                              src={reel.user.avatar} 
                              alt={reel.user.username} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            reel.user?.username?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <span className="text-white font-medium">
                          {reel.user?.username || `user_${reel.id.slice(0, 6)}`}
                        </span>
                      </div>
                      <p className="text-white text-sm">{reel.caption}</p>
                      {reel.createdAt && (
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(reel.createdAt.seconds * 1000).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Right side actions */}
                <div className="absolute right-4 bottom-20 flex flex-col items-center gap-5">
                  <button 
                    onClick={() => handleLike(reel.id)}
                    className="flex flex-col items-center group"
                    aria-label="Like"
                  >
                    <FiHeart 
                      size={28} 
                      className={`${reel.isLiked ? 'text-red-500 fill-red-500' : 'text-white'} group-hover:scale-110 transition-transform`} 
                    />
                    <span className="text-white text-sm">{reel.likes || 0}</span>
                  </button>
                  
                  <button 
                    onClick={() => toggleComments(reel.id)}
                    className="flex flex-col items-center group"
                    aria-label="Comments"
                  >
                    <FiMessageSquare 
                      size={28} 
                      className="text-white group-hover:scale-110 transition-transform" 
                    />
                    <span className="text-white text-sm">{reel.comments?.length || 0}</span>
                  </button>
                  
                  <button 
                    className="flex flex-col items-center group"
                    aria-label="Share"
                  >
                    <FiShare2 
                      size={28} 
                      className="text-white group-hover:scale-110 transition-transform" 
                    />
                  </button>

                  {user.uid === reel.user?.uid && (
                    <button 
                      onClick={() => handleDelete(reel.id)}
                      className="text-red-500 text-xs mt-2 hover:underline"
                      aria-label="Delete reel"
                    >
                      Delete
                    </button>
                  )}
                </div>
                
                {/* Comments Section */}
                {showComments[reel.id] && (
                  <div className="absolute inset-0 bg-black bg-opacity-80 p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white font-medium">
                        Comments ({reel.comments?.length || 0})
                      </h3>
                      <button 
                        onClick={() => toggleComments(reel.id)}
                        className="text-white p-1 hover:bg-gray-800 rounded-full"
                        aria-label="Close comments"
                      >
                        <FiX size={24} />
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-3">
                      {reel.comments?.length > 0 ? (
                        reel.comments.map((comment, i) => (
                          <div key={i} className="text-white">
                            <div className="flex gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white overflow-hidden">
                                {comment.user?.avatar ? (
                                  <img 
                                    src={comment.user.avatar} 
                                    alt={comment.user.username} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  comment.user?.username?.charAt(0).toUpperCase() || 'U'
                                )}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {comment.user?.username || 'Anonymous'}
                                </p>
                                <p>{comment.text}</p>
                                {comment.createdAt && (
                                  <p className="text-gray-400 text-xs mt-1">
                                    {new Date(comment.createdAt.seconds * 1000).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-center mt-8">No comments yet</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleComment(reel.id)}
                        aria-label="Comment input"
                      />
                      <button 
                        onClick={() => handleComment(reel.id)}
                        className="bg-pink-600 text-white rounded-full p-2 hover:bg-pink-700 transition-colors disabled:opacity-50"
                        disabled={!commentText.trim()}
                        aria-label="Post comment"
                      >
                        <FiSend />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-gray-900 bg-opacity-90 backdrop-blur-sm p-3 flex justify-around items-center border-t border-gray-800">
        <button 
          className="text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Home"
        >
          <FiHome size={24} />
        </button>
        
        <button 
          onClick={() => setShowUploadModal(true)}
          className="text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Upload new reel"
        >
          <FiPlus size={24} />
        </button>
        
        <div className="relative group">
          <button 
            className="flex items-center gap-2 text-white p-1"
            aria-label="User profile"
          >
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName} 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <FiUser size={16} />
              </div>
            )}
          </button>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 hidden group-hover:block z-20">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-20 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Upload New Reel</h2>
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
                aria-label="Close upload modal"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-4">
              <div className="mb-4">
                {previewUrl ? (
                  <div className="relative">
                    <video 
                      src={previewUrl} 
                      controls 
                      className="w-full rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl('');
                        if (previewUrl) URL.revokeObjectURL(previewUrl);
                      }}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                      aria-label="Remove video"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-8 cursor-pointer hover:border-pink-500 transition-colors">
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={handleFileChange}
                      required
                      className="hidden"
                    />
                    <FiPlus size={48} className="text-gray-500 mb-2" />
                    <p className="text-white font-medium">Select a video file</p>
                    <p className="text-gray-400 text-sm">MP4, MOV, AVI (max 50MB)</p>
                  </label>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-white mb-2">Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption..."
                  required
                  className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={3}
                  aria-label="Caption input"
                />
              </div>
              
              {uploading && (
                <div className="mb-4">
                  <p className="text-white text-sm mt-1 text-center">
                    Uploading your reel...
                  </p>
                </div>
              )}
              
              <button 
                type="submit" 
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={uploading || !selectedFile}
                aria-label="Upload reel"
              >
                {uploading ? 'Uploading...' : 'Upload Reel'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto bg-red-600 text-white p-3 rounded-lg shadow-lg flex justify-between items-center z-30 animate-fade-in">
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-white p-1 rounded-full hover:bg-red-700"
            aria-label="Dismiss error"
          >
            <FiX size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReelsApp;