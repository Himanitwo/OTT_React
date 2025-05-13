import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const VideoCall = ({ roomId }) => {
  const [socket, setSocket] = useState(null);
  const [peers, setPeers] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const localStreamRef = useRef(null);

  // Dummy Discord-style users for UI
  const dummyUsers = [
    { id: 'User#1234', mic: true },
    { id: 'GamerGirl#5678', mic: false },
    { id: 'CoderDude#8888', mic: true },
  ];

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      localStreamRef.current = stream;
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join-room', roomId);

    socket.on('user-joined', async (userId) => {
      const peerConnection = createPeerConnection(userId);
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit('offer', { offer, to: userId });
    });

    socket.on('offer', async ({ offer, from }) => {
      const peerConnection = createPeerConnection(from);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('answer', { answer, to: from });
    });

    socket.on('answer', async ({ answer, from }) => {
      const peerConnection = peers[from];
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('ice-candidate', async ({ candidate, from }) => {
      const peerConnection = peers[from];
      if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on('user-disconnected', (userId) => {
      const peerConnection = peers[userId];
      if (peerConnection) {
        peerConnection.close();
        delete peers[userId];
        setPeers({ ...peers });
      }
    });

    socket.on('chat-message', ({ sender, message }) => {
      setMessages((prev) => [...prev, { sender, message }]);
    });
  }, [socket, peers]);

  const createPeerConnection = (userId) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    localStreamRef.current.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStreamRef.current);
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { candidate: event.candidate, to: userId });
      }
    };

    peerConnection.ontrack = (event) => {
      const remoteAudio = new Audio();
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.play();
    };

    setPeers((prevPeers) => ({ ...prevPeers, [userId]: peerConnection }));
    return peerConnection;
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit('chat-message', { sender: socket.id, message: input });
      setMessages((prev) => [...prev, { sender: 'Me', message: input }]);
      setInput('');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side: Discord-style Voice Channel */}
      <div className="flex-1 bg-[#2f3136] text-white p-4">
        <h2 className="text-lg font-bold mb-4">🎧 Voice Channel: {roomId}</h2>

        <div className="bg-[#36393f] rounded-lg p-3 space-y-3">
          {dummyUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-3 bg-[#2f3136] p-2 rounded hover:bg-[#40444b] transition"
            >
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                {user.id.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user.id}</p>
              </div>
              <div className="text-gray-400">
                {user.mic ? (
                  <span title="Mic On">🎤</span>
                ) : (
                  <span title="Mic Muted">🔇</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-1">🔊 Live Users</p>
          <ul className="space-y-1">
            {Object.keys(peers).map((id) => (
              <li key={id} className="text-green-400 text-sm">• {id}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right side: Chat Room */}
      <div className="w-80 border-l border-gray-600 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold">Chat Room 💬</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {messages.map((msg, index) => (
            <div key={index}>
              <span className="font-bold">{msg.sender}: </span>
              <span>{msg.message}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleChatSubmit} className="p-2 border-t border-gray-700 flex">
          <input
            type="text"
            className="flex-1 p-2 bg-gray-700 rounded mr-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit" className="bg-blue-500 px-3 py-1 rounded text-white">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoCall;
