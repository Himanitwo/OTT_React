import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { io } from "socket.io-client";
import { format } from "date-fns";
import Picker from "emoji-picker-react";

const socket = io("http://localhost:4001", {
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/");
        return;
      }

      setUser(currentUser);
      socket.connect();

      socket.emit("joinRoom", { roomId, email: currentUser.email }, (response) => {
        if (response?.status === "error") {
          console.error("Join room error:", response.error);
          setError("Failed to join room");
        }
      });

      socket.on("connect", () => {
        console.log("✅ Connected to socket server");
        setError(null);
      });

      socket.on("connect_error", (err) => {
        console.error("❌ Connection error:", err);
        setError("Connection error - retrying...");
      });

      socket.on("disconnect", (reason) => {
        console.warn("🔌 Disconnected:", reason);
        if (reason === "io server disconnect") {
          socket.connect();
        }
      });

      socket.on("chatHistory", (history) => {
        const formatted = history.map((msg) => ({
          from: msg.from,
          text: msg.text,
          time: msg.timestamp,
          isSystem: false,
        }));
        setMessages(formatted);
        setLoading(false);
      });

      socket.on("receiveMessage", (msg) => {
        setMessages((prev) => [
          ...prev,
          {
            from: msg.from,
            text: msg.text,
            time: msg.timestamp,
            isSystem: false,
          },
        ]);
      });

      socket.on("userJoined", ({ email }) => {
        setMessages((prev) => [
          ...prev,
          {
            from: "System",
            text: `${email} joined the room`,
            time: new Date().toISOString(),
            isSystem: true,
          },
        ]);
      });

      socket.on("typing", ({ email }) => {
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

      socket.on("newLiveStarted", ({ roomId: streamRoomId, email }) => {
        setLiveStreamList((prev) => [...prev, { roomId: streamRoomId, email }]);
        setMessages((prev) => [
          ...prev,
          {
            from: "System",
            text: `${email} started a live stream!`,
            time: new Date().toISOString(),
            isSystem: true,
          },
        ]);
      });
    });

    return () => {
      unsubscribe();
      socket.disconnect();
      socket.off();
    };
  }, [roomId, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMsg.trim() || !user) return;

    socket.emit("sendMessage", {
      roomId,
      text: newMsg,
      from: user.email,
    }, (response) => {
      if (response?.status === "error") {
        console.error("Send message error:", response.error);
        setMessages((prev) => [
          ...prev,
          {
            from: "System",
            text: "Failed to send message",
            time: new Date().toISOString(),
            isSystem: true,
          },
        ]);
      }
    });

    setNewMsg("");
  };

  const handleTyping = (e) => {
    setNewMsg(e.target.value);
    if (user) {
      socket.emit("typing", { roomId, email: user.email });
    }
  };

  const addEmoji = (event, emojiObject) => {
    setNewMsg((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const goToStartLive = () => {
    navigate("/go-live");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-light">Loading chat room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="text-blue-400">#</span>
              {roomId}
            </h1>
            {/* <p className="text-xs text-gray-400 mt-1">
              {onlineUsers.length} {onlineUsers.length === 1 ? 'person' : 'people'} online
            </p> */}
          </div>
          <div className="flex gap-2">
            <button
              onClick={goToStartLive}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full text-sm transition"
            >
              <span>🔴</span>
              <span>Go Live</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live stream notification */}
      {liveStreamList.length > 0 && (
        <div className="bg-gradient-to-r from-red-900 to-red-800 text-white p-3">
          {liveStreamList.map((stream, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/live/view/${stream.roomId}`)}
              className="cursor-pointer hover:underline flex items-center gap-2 justify-center"
            >
              <span className="animate-pulse">🔴</span>
              <span>{stream.email} is streaming live - Click to watch</span>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-600 text-white p-3 text-center font-medium">
          {error}
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="text-5xl mb-4">👋</div>
            <p className="text-lg">Welcome to the chat!</p>
            <p className="text-sm">Send your first message to get started</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.from === user?.email ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-xs lg:max-w-md ${msg.from === user?.email ? "ml-auto" : "mr-auto"}`}>
                <div
                  className={`p-3 rounded-2xl ${
                    msg.isSystem
                      ? "bg-yellow-900 text-yellow-100 text-center"
                      : msg.from === user?.email
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-700 rounded-bl-none"
                  }`}
                >
                  {!msg.isSystem && msg.from !== user?.email && (
                    <p className="text-xs font-semibold text-gray-300 mb-1">
                      {msg.from}
                    </p>
                  )}
                  <p className="break-words">{msg.text}</p>
                  <p className={`text-xs mt-1 ${
                    msg.isSystem ? 'text-yellow-200' : 'text-gray-300'
                  }`}>
                    {msg.time ? format(new Date(msg.time), "h:mm a") : ""}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 pb-1">
          <p className="text-xs text-gray-400 italic">
            {typingUsers.join(", ")} {typingUsers.length > 1 ? 'are' : 'is'} typing...
          </p>
        </div>
      )}

      {/* Emoji picker */}
      <div className="relative">
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-4 z-10">
            <Picker theme="dark" onEmojiClick={addEmoji} />
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-xl px-3 py-2 rounded-full hover:bg-gray-700 transition"
          >
            😊
          </button>
          <div className="flex-1 relative">
            <input
              value={newMsg}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              className="w-full p-3 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pl-4 pr-12"
              placeholder="Type a message..."
            />
            {newMsg && (
              <button
                onClick={() => setNewMsg("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMsg.trim()}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-full transition disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick actions footer */}
      <div className="bg-gray-800 p-3 border-t border-gray-700 flex justify-center gap-6">
        <Link
          to="/live"
          title="View Live Streams"
          className="flex flex-col items-center text-gray-400 hover:text-white transition"
        >
          <span className="text-2xl">📺</span>
          <span className="text-xs mt-1">Streams</span>
        </Link>
        <Link
          to={`/watch-party/${roomId}`}
          title="Watch Party"
          className="flex flex-col items-center text-gray-400 hover:text-white transition"
        >
          <span className="text-2xl">🎥</span>
          <span className="text-xs mt-1">Watch Party</span>
        </Link>
      </div>
    </div>
  );
};

export default ChatRoom;