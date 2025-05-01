import { useRef, useState } from "react";

function WatchPage() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    const videoContainer = videoRef.current.parentElement;
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time) =>
    new Date(time * 1000).toISOString().substr(14, 5);

  return (
    <div className="bg-gradient-to-br from-black via-zinc-900 to-black min-h-screen flex justify-center items-center p-6 font-sans">
      <div className="relative w-full max-w-5xl transition-all duration-500 hover:scale-[1.01]">
        {/* Video */}
        <video
          ref={videoRef}
          className="w-full rounded-xl shadow-2xl"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(videoRef.current.duration)}
        >
          <source src="/assets/default.mp4" type="video/mp4" />
          <track
            label="English"
            kind="subtitles"
            srcLang="en"
            src="/assets/subtitles_en.vtt"
            default
          />
          <track
            label="Hindi"
            kind="subtitles"
            srcLang="hi"
            src="/assets/subtitles_hi.vtt"
          />
          Your browser does not support the video tag.
        </video>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-md rounded-b-xl">
          {/* Progress bar */}
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-lime-400 mb-2 transition-all duration-300"
          />

          <div className="flex justify-between items-center text-lime-300 text-sm">
            <div className="flex space-x-3 items-center">
              <button
                onClick={togglePlay}
                className={`transition-all duration-300 transform bg-gradient-to-br from-lime-500 to-yellow-400 hover:scale-105 px-4 py-2 rounded-full text-black font-semibold shadow-md ${
                  isPlaying ? "animate-pulse" : ""
                }`}
              >
                {isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="accent-yellow-300 w-24"
              />
              <span className="text-yellow-300">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex space-x-3 items-center">
              <button
                onClick={toggleFullscreen}
                className="px-3 py-2 rounded-full bg-yellow-300 text-black font-bold hover:bg-yellow-400 shadow-lg transition-all duration-300"
              >
                {isFullscreen ? "⛶ Exit" : "⛶ Full"}
              </button>
            </div>
          </div>
        </div>

        {/* ⚙️ Settings Button - Positioned Top Left */}
        <div className="absolute top-3 left-3 z-50">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full shadow"
          >
            ⚙️
          </button>

          {showSettings && (
            <div className="mt-2 w-40 bg-zinc-900/90 border border-lime-400 text-white text-sm rounded shadow-lg p-3 space-y-2">
              <div>
                <label className="block mb-1 text-lime-300">Captions</label>
                <select
                  className="w-full bg-black border border-lime-500 text-white rounded px-2 py-1"
                  onChange={(e) => {
                    const tracks = videoRef.current.textTracks;
                    for (let i = 0; i < tracks.length; i++) {
                      const isMatch = e.target.value === tracks[i].language;
                      tracks[i].mode =
                        e.target.value === "off"
                          ? "hidden"
                          : isMatch
                          ? "showing"
                          : "hidden";
                    }
                  }}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="off">Off</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WatchPage;
 