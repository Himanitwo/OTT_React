import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LiveLobby = () => {
  const navigate = useNavigate();
  const [streams] = useState([
    {
      id: '1',
      title: 'Playing Valorant Ranked',
      userId: 'shroud',
      viewers: 2450,
      thumbnail: 'https://via.placeholder.com/320x180/1f2937/ffffff?text=Valorant'
    },
    {
      id: '2',
      title: 'Music Production Live',
      userId: 'deadmau5',
      viewers: 1890,
      thumbnail: 'https://via.placeholder.com/320x180/1f2937/ffffff?text=Music'
    },
    {
      id: '3',
      title: 'Coding React Apps',
      userId: 'coder123',
      viewers: 320,
      thumbnail: 'https://via.placeholder.com/320x180/1f2937/ffffff?text=Coding'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Live Streams</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {streams.map(stream => (
            <div 
              key={stream.id}
              onClick={() => navigate(`/watch/${stream.id}`)}
              className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-all"
            >
              <div className="relative">
                <img 
                  src={stream.thumbnail} 
                  alt={stream.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-red-600 px-2 py-1 rounded-md flex items-center text-sm">
                  <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                  LIVE
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded-md text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {stream.viewers.toLocaleString()}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold line-clamp-1">{stream.title}</h3>
                <div className="flex items-center mt-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                    {stream.userId.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-300">@{stream.userId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/go-live')}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-full font-medium flex items-center gap-2 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Start Your Own Stream
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveLobby;