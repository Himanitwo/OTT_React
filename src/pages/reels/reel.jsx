import React, { useState, useEffect, useRef } from 'react';
import { FiUpload, FiHeart, FiMessageSquare, FiTrash2, FiClock, FiPlus } from 'react-icons/fi';

const ReelsSidebar = () => {
  const [reels, setReels] = useState([]);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('yourReels');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Load reels from localStorage
  useEffect(() => {
    const savedReels = JSON.parse(localStorage.getItem('reels')) || [];
    setReels(savedReels);
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.includes('video')) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  // Handle reel upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !caption) return;

    setIsUploading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newReel = {
      id: Date.now(),
      caption,
      thumbnail: previewUrl,
      videoUrl: previewUrl,
      duration: '0:45',
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      views: Math.floor(Math.random() * 5000),
      timestamp: new Date().toISOString()
    };

    const updatedReels = [newReel, ...reels];
    setReels(updatedReels);
    localStorage.setItem('reels', JSON.stringify(updatedReels));
    
    setCaption('');
    setFile(null);
    setPreviewUrl('');
    setIsUploading(false);
  };

  // Delete a reel
  const handleDeleteReel = (id) => {
    const updatedReels = reels.filter(reel => reel.id !== id);
    setReels(updatedReels);
    localStorage.setItem('reels', JSON.stringify(updatedReels));
  };

  // Like a reel
  const handleLikeReel = (id) => {
    const updatedReels = reels.map(reel => 
      reel.id === id ? { ...reel, likes: reel.likes + 1 } : reel
    );
    setReels(updatedReels);
    localStorage.setItem('reels', JSON.stringify(updatedReels));
  };

  // Format numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'm';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-900 text-gray-100 p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Reels</h2>
        <div className="flex border-b border-gray-700">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'yourReels' ? 'text-white border-b-2 border-red-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('yourReels')}
          >
            Your Reels
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'trending' ? 'text-white border-b-2 border-red-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('trending')}
          >
            Trending
          </button>
        </div>
      </div>
      
      {/* Upload Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Create New Reel</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 placeholder-gray-500"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a captivating caption..."
            required
          />
          
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-red-500 bg-gray-800' : 'border-gray-700 hover:border-gray-600'
            }`}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
              required
            />
            
            {previewUrl ? (
              <div className="relative">
                <video src={previewUrl} className="w-full h-40 object-cover rounded-lg" muted />
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs flex items-center">
                  <FiUpload className="mr-1" size={12} />
                  Change Video
                </div>
              </div>
            ) : (
              <>
                <div className="mx-auto relative w-12 h-12 mb-3">
                  <FiUpload className="w-full h-full text-gray-500" />
                  <FiPlus className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full p-1" />
                </div>
                <p className="font-medium">Drag & drop a video file here</p>
                <p className="text-sm text-gray-400 mt-1">or click to browse</p>
                <p className="text-xs text-gray-500 mt-2">MP4, MOV, AVI (max 60MB)</p>
              </>
            )}
          </div>
          
          <button 
            type="submit" 
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center ${
              isUploading 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin mr-2"></div>
                Uploading...
              </>
            ) : (
              'Upload Reel'
            )}
          </button>
        </form>
      </div>
      
      {/* Reels List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Your Reels</h3>
          <select className="bg-gray-800 text-sm rounded px-3 py-1 focus:outline-none">
            <option>Newest First</option>
            <option>Most Popular</option>
            <option>Oldest First</option>
          </select>
        </div>
        
        {reels.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <FiUpload className="w-8 h-8 text-red-500" />
            </div>
            <h4 className="font-medium mb-1">No reels yet</h4>
            <p className="text-gray-400 text-sm">Upload your first reel to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reels.map((reel) => (
              <div key={reel.id} className="bg-gray-800 rounded-xl overflow-hidden">
                <div className="relative">
                  <video src={reel.thumbnail} className="w-full h-40 object-cover" muted loop />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex justify-between text-white text-xs">
                    <span className="flex items-center">
                      <FiClock className="mr-1" size={12} />
                      {reel.duration}
                    </span>
                    <span>{formatNumber(reel.views)} views</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-medium line-clamp-2 mb-2">{reel.caption}</h4>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>{formatDate(reel.timestamp)}</span>
                    <div className="flex space-x-4">
                      <button 
                        className="flex items-center hover:text-red-500"
                        onClick={() => handleLikeReel(reel.id)}
                      >
                        <FiHeart className="mr-1" size={14} />
                        {formatNumber(reel.likes)}
                      </button>
                      <span className="flex items-center">
                        <FiMessageSquare className="mr-1" size={14} />
                        {formatNumber(reel.comments)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="absolute top-3 right-3 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center hover:bg-red-600"
                  onClick={() => handleDeleteReel(reel.id)}
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReelsSidebar;