import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = "b3a2232d3ca04acd809cf11c7940c4a4"; // Replace with your Agora App ID
const TOKEN = null;

const VoiceChatWithText = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const client = useRef(null);
  const localTrack = useRef(null);

  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [user, setUser] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/");
        return;
      }

      setUser(currentUser);

      client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

      const joinChannel = async () => {
        await client.current.join(APP_ID, roomId, TOKEN, currentUser.email);

        localTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
        await client.current.publish([localTrack.current]);

        // Listen for remote users joining
        client.current.on("user-published", async (remoteUser, mediaType) => {
          await client.current.subscribe(remoteUser, mediaType);
          if (mediaType === "audio") remoteUser.audioTrack.play();
          setRemoteUsers([...client.current.remoteUsers]);
        });

        client.current.on("user-unpublished", (remoteUser) => {
          setRemoteUsers([...client.current.remoteUsers]);
        });

        client.current.on("user-left", (remoteUser) => {
          setRemoteUsers([...client.current.remoteUsers]);
        });

        // Initialize remote users list just in case some were already there
        setRemoteUsers([...client.current.remoteUsers]);
      };

      joinChannel();
    });

    return () => {
      if (localTrack.current) {
        localTrack.current.stop();
        localTrack.current.close();
      }
      if (client.current) client.current.leave();
      unsubscribe();
    };
  }, [roomId, navigate, auth]);

  const toggleMute = () => {
    if (!localTrack.current) return;
    localTrack.current.setEnabled(isMuted);
    setIsMuted((prev) => !prev);
  };

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    setMessages((prev) => [...prev, { from: "me", text: newMsg }]);
    setNewMsg("");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex p-6 gap-4">
      <div className="w-2/3 space-y-4">
        <h1 className="text-xl font-bold">🎧 Room: {roomId}</h1>

        <div className="bg-neutral-800 rounded p-4 flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div>
              <p>{user.email}</p>
              <p className="text-xs text-neutral-400">You</p>
            </div>
          </div>
          <button
            onClick={toggleMute}
            className="bg-blue-600 px-4 py-1 rounded"
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2">Others in Call</h2>
          <div className="space-y-2">
            {remoteUsers.length === 0 ? (
              <p className="text-sm text-neutral-400">
                No other users connected yet.
              </p>
            ) : (
              remoteUsers.map((u) => (
                <div
                  key={u.uid}
                  className="bg-neutral-800 rounded p-3 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center">
                    {String(u.uid)[0].toUpperCase()}
                  </div>
                  <p>{u.uid}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="w-1/3 flex flex-col bg-neutral-800 rounded p-4">
        <h2 className="font-semibold text-lg mb-2">💬 Chat</h2>
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded ${
                msg.from === "me"
                  ? "bg-blue-700 text-right"
                  : "bg-neutral-700"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="flex-1 p-2 bg-neutral-900 text-white rounded"
            placeholder="Type a message"
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 px-3 py-1 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceChatWithText;
