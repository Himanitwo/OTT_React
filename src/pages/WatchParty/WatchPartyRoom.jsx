import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

import WatchPage from "../watchnow";
import ParticipantList from "./participantsList";
import WatchPartyChat from "./watchpartychat";

// NEW SOCKET INIT
const socket = io("http://localhost:4000", { autoConnect: false });

const WatchPartyRoom = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const videoURL = searchParams.get("url");

  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    socket.connect();
    socket.emit("joinWatchParty", { roomId, name: "Guest" });

    socket.on("participantList", setParticipants);
    socket.on("watchChat", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    socket.on("watchChatHistory", (history) => {
      setChatMessages(history); // load old messages
    });

    return () => {
      socket.disconnect();
      socket.off("participantList");
      socket.off("watchChat");
      socket.off("watchChatHistory");
    };
  }, [roomId]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">🎬 Watch Party Room: {roomId}</h1>
      <div className="flex gap-4">
        <div className="flex-1">
          <WatchPage url={videoURL} />
          <WatchPartyChat roomId={roomId} messages={chatMessages} socket={socket} />
        </div>
        <ParticipantList participants={participants} />
      </div>
    </div>
  );
};

export default WatchPartyRoom;
