import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const Viewer = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  
  const [status, setStatus] = useState("connecting");
  const [error, setError] = useState(null);
  const [streamInfo, setStreamInfo] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = (err) => {
    console.error(err);
    setError(err.message || "An error occurred");
    setStatus("error");
  };

  const setupWebRTC = async (offer, from) => {
    try {
      setStatus("setting_up_stream");
      
      const peer = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478" }
        ]
      });
      peerRef.current = peer;

      peer.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
          setStatus("watching");
        }
      };

      peer.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", peer.iceConnectionState);
        if (peer.iceConnectionState === "disconnected") {
          setStatus("disconnected");
        }
      };

      peer.onconnectionstatechange = () => {
        console.log("Connection state:", peer.connectionState);
      };

      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socketRef.current.emit("answer", { answer, to: from });

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit("ice-candidate", { 
            candidate: event.candidate, 
            to: from 
          });
        }
      };
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    const initializeConnection = () => {
      socketRef.current = io(process.env.REACT_APP_SIGNALING_SERVER || "http://localhost:4001", {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to signaling server");
        setStatus("joining");
        socketRef.current.emit("joinLiveStream", { roomId, email: "viewer" });
        setRetryCount(0); // Reset retry count on successful connection
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("Connection error:", err);
        setError("Failed to connect to server");
        setStatus("error");
        setRetryCount(prev => prev + 1);
      });

      socketRef.current.on("offer", async ({ offer, from }) => {
        await setupWebRTC(offer, from);
      });

      socketRef.current.on("ice-candidate", async ({ candidate }) => {
        try {
          if (peerRef.current && candidate) {
            await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
        } catch (err) {
          console.error("ICE candidate error:", err);
        }
      });

      socketRef.current.on("streamNotFound", () => {
        setError("Stream not found or has ended");
        setStatus("error");
      });

      socketRef.current.on("liveEnded", () => {
        setError("The stream has ended");
        setStatus("ended");
      });

      socketRef.current.on("streamInfo", (info) => {
        setStreamInfo(info);
      });
    };

    initializeConnection();

    return () => {
      if (peerRef.current) {
        peerRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId, retryCount]);

  const statusMessages = {
    connecting: "Connecting to server...",
    joining: "Joining stream...",
    setting_up_stream: "Setting up video connection...",
    watching: "Stream is live",
    disconnected: "Connection lost - trying to reconnect",
    error: "Error occurred",
    ended: "Stream has ended"
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold flex items-center">
            {status === "watching" ? (
              <span className="text-red-500 mr-2">●</span>
            ) : (
              <span className="text-gray-500 mr-2">○</span>
            )}
            {streamInfo?.title || `Stream ${roomId}`}
          </h1>
          <button 
            onClick={() => navigate("/")}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
          >
            Leave
          </button>
        </div>

        {error ? (
          <div className="bg-red-900/50 p-6 rounded-lg text-center">
            <p className="text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full rounded-lg shadow-xl ${
                status !== "watching" ? "hidden" : ""
              }`}
              onError={(e) => {
                if (e.target.error && e.target.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
                  setError("Please allow autoplay for this site");
                }
              }}
            />
            
            {status !== "watching" && (
              <div className="aspect-video bg-gray-800 rounded-lg flex flex-col items-center justify-center">
                <div className="text-4xl mb-4">
                  {status === "ended" ? "⏹️" : "⏳"}
                </div>
                <p className="text-xl">{statusMessages[status]}</p>
                {status === "disconnected" && (
                  <div className="mt-2 h-1 w-32 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 animate-pulse"></div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-400">
              <p>Status: {statusMessages[status]}</p>
              {streamInfo && (
                <p>Host: {streamInfo.email} • Started: {
                  new Date(streamInfo.startedAt).toLocaleString()
                }</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Viewer;