import { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-hotkeys"; // Optional for keyboard shortcuts

function WatchPage() {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  // Lazy load the video player only when the video is in view
  useEffect(() => {
    const handleScroll = () => {
      const rect = videoRef.current?.getBoundingClientRect();
      if (rect && rect.top <= window.innerHeight && rect.bottom >= 0) {
        setIsVideoVisible(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check immediately

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isVideoVisible && videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        muted: true, // Required for autoplay to work on most browsers
        preload: "auto",
        fluid: true,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        controlBar: {
          volumePanel: { inline: false },
          pictureInPictureToggle: true,
          fullscreenToggle: true,
          remainingTimeDisplay: true,
          currentTimeDisplay: true,
          durationDisplay: true,
          playToggle: true,
          playbackRateMenuButton: true,
          progressControl: true,
        },
      });

      // Optional keyboard shortcuts like Netflix
      playerRef.current.ready(() => {
        playerRef.current.hotkeys({
          volumeStep: 0.1,
          seekStep: 5,
          enableModifiersForNumbers: false,
        });
      });

      // Add custom skip buttons
      const controlBar = playerRef.current.getChild("controlBar");
      const skipBack = controlBar.addChild("button");
      skipBack.controlText("Rewind 10 seconds");
      skipBack.addClass("vjs-skip-back");
      skipBack.el().innerHTML = "⏪";
      skipBack.on("click", () => {
        const currentTime = playerRef.current.currentTime();
        playerRef.current.currentTime(Math.max(0, currentTime - 10));
      });

      const skipForward = controlBar.addChild("button");
      skipForward.controlText("Forward 10 seconds");
      skipForward.addClass("vjs-skip-forward");
      skipForward.el().innerHTML = "⏩";
      skipForward.on("click", () => {
        const currentTime = playerRef.current.currentTime();
        playerRef.current.currentTime(currentTime + 10);
      });

      // Hide default big play button (to mimic Netflix style)
      playerRef.current.bigPlayButton.hide();

      playerRef.current.on("play", () => console.log("Playing"));
      playerRef.current.on("pause", () => console.log("Paused"));
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [isVideoVisible]);

  return (
    <div className="bg-black min-h-screen flex justify-center items-center p-6 font-sans">
      <div className="w-full max-w-6xl">
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered rounded-lg shadow-2xl"
        >
          <source src="/assets/default.mp4" type="video/mp4" />
          {/* Add error handling in case subtitles are missing */}
          {["en", "hi", "mr", "ta", "te", "bn", "gu", "kn", "ml"].map((lang) => (
            <track
              key={lang}
              label={lang}
              kind="subtitles"
              srcLang={lang}
              src={`/assets/subtitles_${lang}.vtt`}
              default={lang === "en"} // Default to English
              onError={() => console.warn(`Subtitle track ${lang} failed to load`)}
            />
          ))}
        </video>
      </div>
    </div>
  );
}

export default WatchPage;
