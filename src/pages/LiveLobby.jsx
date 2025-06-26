import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const LiveLobby = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io("http://localhost:4001", {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);

    // Fetch initial streams
    const fetchStreams = async () => {
      try {
        const res = await fetch("http://localhost:4001/live-streams");
        if (!res.ok) throw new Error("Failed to fetch streams");
        const { data } = await res.json();
        setStreams(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();

    // Socket event listeners
    newSocket.on("connect", () => {
      console.log("Connected to live stream server");
      setError(null);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setError("Failed to connect to live stream server");
    });

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

    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl">Loading live streams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-red-900/50 p-6 rounded-xl max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold flex items-center">
            <span className="text-red-500 mr-2">●</span> Live Streams
          </h1>
          <Link
            to="/live/create"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors"
          >
            <span className="mr-2">+</span> Go Live
          </Link>
        </div>

        {streams.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">📺</div>
            <p className="text-xl mb-2">No live streams currently</p>
            <p className="text-gray-400 mb-4">Start your own stream to begin!</p>
            <Link
              to="/live/create"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
            >
              Start Streaming
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {streams.map((stream) => (
              <div
                key={stream.roomId}
                className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-all hover:shadow-lg hover:shadow-red-500/20 group"
              >
                <Link to={`/live/view/${stream.roomId}`} className="block h-full">
                  <div className="relative aspect-video">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                      {stream.thumbnail ? (
                        <img
                          src={stream.thumbnail}
                          alt={stream.title}
                          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                        />
                      ) : (
                        <div className="text-4xl">📹</div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="font-bold text-lg line-clamp-1">
                        {stream.title || "Untitled Stream"}
                      </h3>
                      <p className="text-sm text-gray-300 line-clamp-1">
                        {stream.email}
                      </p>
                    </div>
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <span className="mr-1">●</span> LIVE
                    </div>
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <span className="mr-1">👤</span> {stream.viewers || 0}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-400">
                      Started {new Date(stream.startedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveLobby;