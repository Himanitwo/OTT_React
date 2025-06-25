import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const LiveLobby = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to Socket.IO
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    // Initial fetch
    fetchStreams();

    // Socket event listeners
    newSocket.on("newLiveStarted", (stream) => {
      setStreams(prev => [...prev, stream]);
    });

    newSocket.on("liveEnded", ({ roomId }) => {
      setStreams(prev => prev.filter(s => s.roomId !== roomId));
    });

    newSocket.on("viewerUpdate", ({ roomId, viewers }) => {
      setStreams(prev => prev.map(stream => 
        stream.roomId === roomId ? { ...stream, viewers } : stream
      ));
    });

    return () => newSocket.disconnect();
  }, []);

  const fetchStreams = async () => {
    try {
      const res = await fetch("http://localhost:4000/live-streams");
      if (!res.ok) throw new Error("Failed to fetch streams");
      const data = await res.json();
      setStreams(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading streams...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <span className="text-red-500 mr-2">●</span> Live Streams
        </h1>
        <Link
          to="/live/create"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center"
        >
          <span className="mr-2">+</span> Go Live
        </Link>
      </div>

      {streams.length === 0 ? (
        <div className="bg-gray-800/50 rounded-xl p-8 text-center">
          <p className="text-xl mb-2">No live streams currently</p>
          <p className="text-gray-400">Start your own stream to begin!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {streams.map((stream) => (
            <Link
              key={stream.roomId}
              to={`/live/view/${stream.roomId}`}
              className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-all transform hover:scale-105"
            >
              <div className="relative">
                <img
                  src={stream.thumbnail || "https://via.placeholder.com/300"}
                  alt={stream.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="font-bold text-lg truncate">{stream.title}</h3>
                  <p className="text-sm text-gray-300 truncate">{stream.email}</p>
                </div>
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <span className="mr-1">●</span> LIVE
                </div>
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <span className="mr-1">👤</span> {stream.viewers || 0}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Started: {new Date(stream.startedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveLobby;