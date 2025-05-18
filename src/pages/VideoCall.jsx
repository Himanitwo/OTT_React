import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const VedioCall = () => {
  const location = useLocation();
  const user = location.state?.user; // user.email is required
  const roomId = location.state?.roomId;
  const socket = useRef(null);
  const localStream = useRef(null);
  const [peers, setPeers] = useState({});
  const audioRef = useRef();
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    socket.current = io("http://localhost:8000");

    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
      localStream.current = stream;
      audioRef.current.srcObject = stream;
    });

    socket.current.emit("join-room", { roomId, email: user.email });

    socket.current.on("user-joined", ({ userId, email }) => {
      setPeers(prev => ({
        ...prev,
        [userId]: { email }
      }));
    });

    socket.current.on("user-left", ({ userId }) => {
      setPeers(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    });

    return () => {
      socket.current.disconnect();
    };
  }, [roomId, user]);

  const toggleMute = () => {
    if (!localStream.current) return;

    localStream.current.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });

    setIsMuted(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <h1 className="text-xl font-semibold mb-4 flex items-center gap-2">
        🎧 Voice Channel: {roomId}
      </h1>

      {/* Current User */}
      <div className="flex items-center gap-3 p-4 bg-neutral-800 rounded-lg mb-6">
        <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-white text-sm uppercase">
          {user.email?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="flex flex-col">
          <span className="text-white font-medium">{user.email}</span>
          <span className="text-xs text-neutral-400">You</span>
        </div>
        <button
          onClick={toggleMute}
          className="ml-auto bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm"
        >
          {isMuted ? "Unmute Mic" : "Mute Mic"}
        </button>
      </div>

      {/* Other Users */}
      <div className="space-y-4">
        {Object.entries(peers).map(([peerId, peerUser]) => (
          <div key={peerId} className="flex items-center gap-3 p-4 bg-neutral-800 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-white text-sm uppercase">
              {peerUser.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-white font-medium">{peerUser.email}</span>
              <span className="text-xs text-neutral-400">Connected</span>
            </div>
          </div>
        ))}
      </div>

      <audio ref={audioRef} autoPlay muted />
    </div>
  );
};

export default VedioCall;
