import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { io } from "socket.io-client";
import { format } from "date-fns";


const socket = io("http://localhost:4000", { autoConnect: false });

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const auth = getAuth();

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [liveStreamList, setLiveStreamList] = useState([]);

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

      socket.on("typing", (email) => {
        setTypingUsers((prev) =>
          prev.includes(email) ? prev : [...prev, email]
        );
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((e) => e !== email));
        }, 1500);
      });

      socket.on("userList", (users) => {
        setOnlineUsers(users);
      });

      socket.on("systemMessage", (text) => {
        setMessages((prev) => [
          ...prev,
          {
            text,
            from: "System",
            time: new Date().toISOString(),
            isSystem: true,
          },
        ]);
      });

      socket.on("newLiveStarted", ({ roomId: streamRoomId, email }) => {
        setLiveStreamList((prev) => [
          ...prev,
          { roomId: streamRoomId, email },
        ]);
      });
    });

    return () => {
      unsubscribe();
      socket.disconnect();
      socket.off("chatHistory");
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("userList");
      socket.off("systemMessage");
      socket.off("newLiveStarted");
    };
  }, [roomId, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    socket.emit("sendMessage", {
      roomId,
      message: newMsg,
      from: user.email,
      time: new Date().toISOString(),
    });

    setNewMsg("");
  };

  const handleTyping = (e) => {
    setNewMsg(e.target.value);
    socket.emit("typing", { roomId, email: user.email });
  };

  const addEmoji = (emoji) => {
    setNewMsg((prevMsg) => prevMsg + emoji.native);
  };

  const goToStartLive = () => {
    navigate("/start-live");
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col p-6 gap-4">
      <h1 className="text-xl font-bold">💬 Room: {roomId}</h1>
      <p className="text-sm text-gray-300">Online: {onlineUsers.join(", ")}</p>

      {liveStreamList.length > 0 && (
        <div className="bg-red-700 text-white p-3 rounded mb-4">
          {liveStreamList.map((stream, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/live/view/${stream.roomId}`)}
              className="cursor-pointer hover:underline"
            >
              🔴 {stream.email} is live – Click to watch
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto bg-neutral-800 rounded p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.from === user.email ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex items-start gap-2 max-w-xs">
              <div
                className={`p-3 rounded-xl text-sm ${
                  msg.isSystem
                    ? "bg-yellow-600 text-white text-center w-full"
                    : msg.from === user.email
                    ? "bg-blue-700 text-white"
                    : "bg-neutral-700"
                }`}
              >
                <p>{msg.text}</p>
                {!msg.isSystem && (
                  <div className="text-xs text-gray-300 mt-1 flex justify-between">
                    <span>{msg.from}</span>
                    <span>
                      {msg.time ? format(new Date(msg.time), "hh:mm:ss a") : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {typingUsers.length > 0 && (
        <p className="text-sm text-gray-400 italic mt-1">
          {typingUsers.join(", ")} typing...
        </p>
      )}

      <div className="relative">
        {showEmojiPicker && (
          <div className="absolute bottom-14 z-10">
            <Picker theme="dark" onSelect={addEmoji} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-xl px-3 py-2 rounded hover:bg-neutral-700 transition"
        >
          😊
        </button>
        <input
          value={newMsg}
          onChange={handleTyping}
          className="flex-1 p-2 bg-neutral-900 text-white rounded border border-neutral-700"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Send
        </button>
      </div>

      {/* Updated small icon-only buttons below */}

      <div className="mt-2 flex justify-between gap-3 px-4">
        <button
          onClick={goToStartLive}
          title="Go Live"
          className="flex items-center justify-center bg-red-600 text-white p-2 rounded hover:bg-red-700 transition text-lg"
          style={{ width: 40, height: 40 }}
        >
          🔴
        </button>

        <Link
          to="/live-lobby"
          title="View Live Streams"
          className="flex items-center justify-center bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition text-lg"
          style={{ width: 40, height: 40 }}
        >
          📺
        </Link>

        <Link
          to={`/watch-party/${roomId}`}
          title="Watch Party"
          className="flex items-center justify-center bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition text-lg"
          style={{ width: 40, height: 40 }}
        >
          🎥
        </Link>
      </div>
    </div>
  );
};

export default ChatRoom;
