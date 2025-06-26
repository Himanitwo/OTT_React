import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";

const StartLive = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("initializing");
  const [error, setError] = useState(null);
  const [streamId] = useState(uuidv4());
  const socketRef = React.useRef(null);

  useEffect(() => {
    const initializeStream = async () => {
      try {
        setStatus("checking_permissions");
        
        // 1. Check media permissions first
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: true 
        }).catch(err => {
          throw new Error(`Media access denied: ${err.message}`);
        });

        // Close the test stream immediately
        stream.getTracks().forEach(track => track.stop());
        
        // 2. Connect to WebSocket
        setStatus("connecting_server");
        socketRef.current = io("http://localhost:4001");
        
        socketRef.current.on("connect", () => {
          setStatus("creating_room");
          
          // 3. Notify server about new stream
          socketRef.current.emit("startLive", {
            email: "user@example.com", // Replace with actual user
            title: "My Live Stream",   // Default title
            roomId: streamId
          });
          
          // 4. Navigate after brief delay for better UX
          setTimeout(() => {
            navigate(`/live/host/${streamId}`);
          }, 1000);
        });
        
        socketRef.current.on("connect_error", () => {
          throw new Error("Could not connect to server");
        });

      } catch (err) {
        console.error("Stream initialization failed:", err);
        setError(err.message);
        setStatus("failed");
      }
    };

    initializeStream();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [navigate, streamId]);

  const statusMessages = {
    initializing: "Initializing...",
    checking_permissions: "Checking camera/microphone access...",
    connecting_server: "Connecting to server...",
    creating_room: "Creating your stream room...",
    failed: "Setup failed"
  };

  const getStatusIndicator = () => {
    if (status === "failed") return "❌";
    if (status === "creating_room") return "✅";
    return "⏳";
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="bg-red-900/50 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">❌ Stream Setup Failed</h2>
          <p className="mb-4">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg w-full"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg w-full"
            >
              ← Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="bg-gray-800/50 p-8 rounded-xl max-w-md w-full text-center">
        <div className="text-5xl mb-6 animate-pulse">🔴</div>
        <h2 className="text-2xl font-bold mb-2">Setting Up Your Live Stream</h2>
        
        <div className="space-y-4 mt-6">
          <div className="flex items-center gap-3">
            <span className="text-xl">{getStatusIndicator()}</span>
            <span>{statusMessages[status]}</span>
          </div>
          
          {status !== "failed" && (
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{
                  width: `${Object.keys(statusMessages).indexOf(status) * 25}%`,
                  transition: "width 0.3s ease"
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      {status !== "failed" && (
        <p className="mt-6 text-gray-400 text-sm">
          Room ID: <span className="font-mono bg-gray-800 px-2 py-1 rounded">{streamId}</span>
        </p>
      )}
    </div>
  );
};

export default StartLive;