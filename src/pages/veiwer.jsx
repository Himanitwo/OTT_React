import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const Viewer = () => {
  const { roomId } = useParams();
  const videoRef = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom", { roomId, email: "viewer" });

    socket.on("offer", async ({ offer, from }) => {
      const peer = new RTCPeerConnection();
      peerRef.current = peer;

      peer.ontrack = (event) => {
        videoRef.current.srcObject = event.streams[0];
      };

      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit("answer", { answer, to: from });

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", { candidate: event.candidate, to: from });
        }
      };
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("ICE error:", err);
      }
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [roomId]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-bold mb-4">🔴 Watching Stream</h1>
      <video ref={videoRef} autoPlay playsInline className="w-full max-w-2xl rounded shadow" />
    </div>
  );
};

export default Viewer;
