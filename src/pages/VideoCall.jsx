import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000", { autoConnect: false });

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/");
        return;
      }

      setUser(currentUser);
      socket.connect();

      socket.emit("joinRoom", {
        roomId,
        email: currentUser.email,
      });

      socket.on("chatHistory", (history) => {
        setMessages(history);
      });

      socket.on("receiveMessage", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    });

    return () => {
      unsubscribe();
      socket.disconnect();
      socket.off("chatHistory");
      socket.off("receiveMessage");
    };
  }, [roomId, navigate]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    socket.emit("sendMessage", {
      roomId,
      message: newMsg,
      from: user.email,
    });

    setNewMsg(""); // No need to add locally now; server will emit back
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col p-6 gap-4">
      <h1 className="text-xl font-bold">💬 Room: {roomId}</h1>

      <div className="flex-1 overflow-y-auto bg-neutral-800 rounded p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded ${
              msg.from === user.email
                ? "bg-blue-700 text-right"
                : "bg-neutral-700 text-left"
            }`}
          >
            <p className="text-sm">{msg.text}</p>
            <p className="text-xs text-neutral-300 mt-1">{msg.from}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
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
  );
};

export default ChatRoom;
