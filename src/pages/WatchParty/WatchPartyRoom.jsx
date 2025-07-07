import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase.js";

import WatchPage from "../watchnow";
import ParticipantList from "./participantsList";
import WatchPartyChat from "./watchpartychat";

const socket = io("http://localhost:4001", { autoConnect: false });
const auth = getAuth(app);

const WatchPartyRoom = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const videoURL = searchParams.get("url");
  const [currentUser, setCurrentUser] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          uid: user.uid
        };
        setCurrentUser(userData);
        joinWatchParty(userData);
      } else {
        // Optional: Handle unauthenticated users if needed
        const guestName = prompt("Enter your name to join the watch party:") || "Guest";
        const guestData = {
          email: null,
          name: guestName,
          uid: `guest-${Math.random().toString(36).substr(2, 9)}`
        };
        setCurrentUser(guestData);
        joinWatchParty(guestData);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  const joinWatchParty = (user) => {
    socket.connect();
    setIsConnected(true);

    socket.on("connect", () => {
      socket.emit("joinWatchParty", { 
        roomId, 
        email: user.email,
        name: user.name,
        uid: user.uid
      }, (response) => {
        if (response.status === "error") {
          console.error(response.error);
        }
      });
    });

    socket.on("participantList", (updatedParticipants) => {
      setParticipants(updatedParticipants);
    });

    socket.on("newWatchMessage", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    socket.on("watchChatHistory", (history) => {
      setChatMessages(history);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("participantList");
      socket.off("newWatchMessage");
      socket.off("watchChatHistory");
      socket.off("disconnect");
      socket.disconnect();
    };
  };

  const sendMessage = (text) => {
    if (!isConnected || !text.trim()) return;
    
    socket.emit("sendWatchMessage", { 
      roomId, 
      text,
      sender: currentUser.name
    }, (response) => {
      if (response.status === "error") {
        console.error(response.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">🎬 Watch Party: {roomId}</h1>
        {currentUser && (
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">
              Joined as: <span className="font-semibold">{currentUser.name}</span>
            </span>
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <WatchPage url={videoURL} />
          <WatchPartyChat 
            messages={chatMessages} 
            onSendMessage={sendMessage}
            currentUser={currentUser?.name}
            isConnected={isConnected}
          />
        </div>
        <ParticipantList 
          participants={participants} 
          currentUserId={currentUser?.uid} 
        />
      </div>
    </div>
  );
};

export default WatchPartyRoom;