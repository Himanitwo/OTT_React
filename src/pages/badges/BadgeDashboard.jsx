import React from "react";
import VideoPlayer from "../components/VideoPlayer";
import CoinTracker from "../components/CoinTracker";
import BadgeDisplay from "../components/BadgeDisplay";

const BadgeDashboard = () => {
  return (
    <div className="bg-black min-h-screen p-6 text-center">
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">🎬 Watch & Earn</h1>
      <CoinTracker />
      <BadgeDisplay />
      <VideoPlayer />
    </div>
  );
};

export default BadgeDashboard;
