import React, { useRef, useEffect, useContext } from "react";
import { CoinContext } from "../context/CoinContext";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const { addCoins } = useContext(CoinContext);

  useEffect(() => {
    const interval = setInterval(() => {
      const watchedSeconds = videoRef.current?.currentTime || 0;
      const earnedCoins = Math.floor(watchedSeconds / 10); // 1 coin per 10 seconds
      addCoins(earnedCoins);
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <video ref={videoRef} controls width="640">
        <source src="/sample-video.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
    </div>
  );
};

export default VideoPlayer;
