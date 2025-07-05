import React, { useState, useEffect } from 'react';
import { Play, ArrowLeft, List, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SeriesPage = () => {
  const navigate = useNavigate();
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [videoKey, setVideoKey] = useState(0); // Used to force re-render video player

  const seriesData = {
    title: "Waris",
    description: "A gripping drama series that follows the lives of a family entangled in power struggles, love, and betrayal.",
    genre: "Drama, Family",
    year: "2024",
    episodes: [
      { id: 1, title: "Episode 1", driveId: "1pANXHPRXP59BoZeocNQanCxLI9CSzSYY" },
      { id: 2, title: "Episode 2", driveId: "1mkBqfJYDrf3xF54qqrSh424rRYJKimIF" },
      { id: 3, title: "Episode 3", driveId: "1p2e0I5apqlcM9WtRoPYJa2p-sogD9s8r" },
      { id: 4, title: "Episode 4", driveId: "1J53qypuzKCYqapd4wnxHxnALcb2MZnDw" },
      { id: 5, title: "Episode 5", driveId: "1-mVSv5gldtakMRvBjPwQ8Aq4VYy6DGWw" },
      { id: 6, title: "Episode 6", driveId: "1_i68epJrVIUU_z-a7HlterHG8nLEtCia" },
      { id: 7, title: "Episode 7", driveId: "1rB_ZebFoO6eZP-mSDiT9X8DD2yBzhiTc" },
      { id: 8, title: "Episode 8", driveId: "1OKQH27iMrp7zjrgozVimtFSK09To64Zi" },
      { id: 9, title: "Episode 9", driveId: "1jca-Cu5YmmUBY9EW66A68QdMk_K-PzVo" },
      { id: 10, title: "Episode 10", driveId: "18AGS-o-lm3xomiswOMh6l8-SjFT2BsOx" }
    ],
    trailerId: "185xtL50m6gkZiJSEChG6cXIut6vSk1bB",
    thumbnail: "/img/waris.png"
  };

  const playEpisode = (index) => {
    setCurrentEpisode(index);
    setIsPlaying(true);
    setVideoKey(prev => prev + 1); // Force re-render of iframe
    setShowEpisodes(false);
  };

  const playTrailer = () => {
    setCurrentEpisode(-1); // -1 represents trailer
    setIsPlaying(true);
    setVideoKey(prev => prev + 1);
  };

  const nextEpisode = () => {
    if (currentEpisode < seriesData.episodes.length - 1) {
      setCurrentEpisode(currentEpisode + 1);
      setVideoKey(prev => prev + 1);
    }
  };

  const prevEpisode = () => {
    if (currentEpisode > 0) {
      setCurrentEpisode(currentEpisode - 1);
      setVideoKey(prev => prev + 1);
    }
  };

  const getVideoSrc = () => {
    if (currentEpisode === -1) {
      return `https://drive.google.com/file/d/${seriesData.trailerId}/preview`;
    }
    return `https://drive.google.com/file/d/${seriesData.episodes[currentEpisode].driveId}/preview`;
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
          {/* Series Poster */}
          <div className="w-full lg:w-1/3 relative group">
            <img 
              src={seriesData.thumbnail} 
              alt={seriesData.title} 
              className="w-full h-auto rounded-xl shadow-2xl object-cover"
            />
            <button 
              onClick={playTrailer}
              className="absolute inset-0 m-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Play size={32} />
            </button>
          </div>

          {/* Series Info */}
          <div className="w-full lg:w-2/3">
            <h1 className="text-4xl font-bold mb-2">{seriesData.title}</h1>
            <div className="flex gap-4 text-gray-300 mb-4">
              <span>{seriesData.genre}</span>
              <span>•</span>
              <span>{seriesData.year}</span>
            </div>
            <p className="text-gray-300 mb-6">{seriesData.description}</p>
            
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => playEpisode(0)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
              >
                <Play size={20} />
                <span>Play Episode 1</span>
              </button>
              <button 
                onClick={playTrailer}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
              >
                <Play size={20} />
                <span>Play Trailer</span>
              </button>
            </div>

            {/* Episodes List */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Episodes</h2>
                <button 
                  onClick={() => setShowEpisodes(!showEpisodes)}
                  className="lg:hidden text-blue-400 flex items-center gap-1"
                >
                  {showEpisodes ? <X size={20} /> : <List size={20} />}
                  <span>{showEpisodes ? 'Hide' : 'Show'} Episodes</span>
                </button>
              </div>
              
              <div className={`${showEpisodes ? 'block' : 'hidden'} lg:block`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {seriesData.episodes.map((episode, index) => (
                    <motion.div
                      key={episode.id}
                      whileHover={{ scale: 1.03 }}
                      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => playEpisode(index)}
                    >
                      <div className="relative">
                        <img 
                          src={seriesData.thumbnail} 
                          alt={episode.title} 
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                          <Play size={32} className="text-white" />
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium">{episode.title}</h3>
                        <p className="text-sm text-gray-400">Episode {episode.id}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {currentEpisode === -1 ? 'Trailer' : `${seriesData.episodes[currentEpisode].title}`}
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
              src={getVideoSrc()}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          {/* Navigation for episodes */}
          {currentEpisode !== -1 && (
            <div className="flex justify-between">
              <button 
                onClick={prevEpisode}
                disabled={currentEpisode === 0}
                className={`flex items-center gap-1 px-4 py-2 rounded ${currentEpisode === 0 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-800'}`}
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              
              <div className="text-center">
                <p className="text-gray-300">Episode {currentEpisode + 1} of {seriesData.episodes.length}</p>
              </div>
              
              <button 
                onClick={nextEpisode}
                disabled={currentEpisode === seriesData.episodes.length - 1}
                className={`flex items-center gap-1 px-4 py-2 rounded ${currentEpisode === seriesData.episodes.length - 1 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-800'}`}
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          )}
          
          {/* Episode list at the bottom */}
          {currentEpisode !== -1 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">More Episodes</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {seriesData.episodes.map((episode, index) => (
                  <motion.div
                    key={episode.id}
                    whileHover={{ scale: 1.03 }}
                    className={`bg-gray-800 rounded-lg overflow-hidden cursor-pointer ${currentEpisode === index ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => playEpisode(index)}
                  >
                    <div className="relative">
                      <img 
                        src={seriesData.thumbnail} 
                        alt={episode.title} 
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                        <Play size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="p-2">
                      <h3 className="text-sm font-medium truncate">{episode.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SeriesPage;