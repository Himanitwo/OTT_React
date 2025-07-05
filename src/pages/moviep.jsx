import React, { useState } from 'react';
import { Play, ArrowLeft, List, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const MoviePage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { movieData } = state || {};
  const [currentPart, setCurrentPart] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoKey, setVideoKey] = useState(0);

  if (!movieData) {
    navigate('/');
    return null;
  }

  const playPart = (index) => {
    setCurrentPart(index);
    setIsPlaying(true);
    setVideoKey(prev => prev + 1);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-4 lg:px-20 py-16 font-sans overflow-hidden">
      {/* Blurred Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute w-96 h-96 bg-teal-900 opacity-10 rounded-full blur-3xl -top-32 -left-32" />
        <div className="absolute w-72 h-72 bg-indigo-700 opacity-10 rounded-full blur-3xl bottom-10 right-10" />
      </div>

      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-300 hover:text-white transition"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {!isPlaying ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Movie Poster */}
          <div className="w-full lg:w-1/3 relative group">
            <img 
              src={movieData.thumbnail} 
              alt={movieData.title} 
              className="w-full h-auto rounded-xl shadow-2xl object-cover"
            />
            <button 
              onClick={() => playPart(0)}
              className="absolute inset-0 m-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Play size={32} />
            </button>
          </div>

          {/* Movie Info */}
          <div className="w-full lg:w-2/3">
            <h1 className="text-4xl font-bold mb-2">{movieData.title}</h1>
            <div className="flex gap-4 text-gray-300 mb-4">
              <span>{movieData.genre}</span>
              <span>•</span>
              <span>{movieData.year}</span>
            </div>
            <p className="text-gray-300 mb-6">{movieData.description}</p>
            
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => playPart(0)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
              >
                <Play size={20} />
                <span>Play {movieData.driveLinks.length > 1 ? 'Part 1' : 'Movie'}</span>
              </button>
            </div>

            {/* Parts List */}
            {movieData.driveLinks.length > 1 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Parts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {movieData.driveLinks.map((link, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.03 }}
                      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => playPart(index)}
                    >
                      <div className="relative">
                        <img 
                          src={movieData.thumbnail} 
                          alt={`Part ${index + 1}`} 
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                          <Play size={32} className="text-white" />
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium">Part {index + 1}</h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {movieData.title} {movieData.driveLinks.length > 1 ? `- Part ${currentPart + 1}` : ''}
            </h2>
            <button 
              onClick={() => setIsPlaying(false)}
              className="text-gray-300 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Video Player */}
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-4">
            <iframe
              key={videoKey}
              src={`https://drive.google.com/file/d/${movieData.driveLinks[currentPart].split('/')[5]}/preview`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          {/* Navigation for parts */}
          {movieData.driveLinks.length > 1 && (
            <div className="flex justify-between">
              <button 
                onClick={() => {
                  if (currentPart > 0) {
                    setCurrentPart(currentPart - 1);
                    setVideoKey(prev => prev + 1);
                  }
                }}
                disabled={currentPart === 0}
                className={`flex items-center gap-1 px-4 py-2 rounded ${currentPart === 0 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-800'}`}
              >
                Previous Part
              </button>
              
              <div className="text-center">
                <p className="text-gray-300">Part {currentPart + 1} of {movieData.driveLinks.length}</p>
              </div>
              
              <button 
                onClick={() => {
                  if (currentPart < movieData.driveLinks.length - 1) {
                    setCurrentPart(currentPart + 1);
                    setVideoKey(prev => prev + 1);
                  }
                }}
                disabled={currentPart === movieData.driveLinks.length - 1}
                className={`flex items-center gap-1 px-4 py-2 rounded ${currentPart === movieData.driveLinks.length - 1 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-800'}`}
              >
                Next Part
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MoviePage;