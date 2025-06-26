import { useState } from "react";

const WatchPartyChat = ({ roomId, messages, socket }) => {
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim() || !socket?.connected) return;

    socket.emit("sendWatchChat", {
      roomId,
      text: newMessage,
      sender: "Guest", // Replace with actual user if needed
    });

    setNewMessage("");
  };

  return (
    <div className="bg-neutral-800 p-4 rounded-lg mt-4">
      <h2 className="text-lg font-semibold mb-2">💬 Watch Party Chat</h2>
      <div className="h-60 overflow-y-auto bg-neutral-700 p-2 rounded">
        {messages.map((msg, idx) => (
          <div key={idx} className="text-sm mb-1">
            <span className="text-cyan-400">{msg.sender || "Anon"}:</span> {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 rounded bg-neutral-600 text-white"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default WatchPartyChat;
