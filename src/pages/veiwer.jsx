import { useMeeting, useConnection } from '@videosdk.live/react-sdk';
import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';

export default function Viewer() {
  const { streamId } = useParams();
  const { join, leave, hlsUrls } = useMeeting();

  useEffect(() => {
    join();
    return () => leave();
  }, [join, leave]);

  return (
    <div className="viewer-page">
      <div className="stream-player">
        {hlsUrls ? (
          <HLSPlayer hlsUrls={hlsUrls} />
        ) : (
          <div className="stream-offline">
            <p>The stream is not currently broadcasting</p>
          </div>
        )}
      </div>
      <div className="viewer-controls">
        <button onClick={leave}>Leave Stream</button>
      </div>
    </div>
  );
}

function HLSPlayer({ hlsUrls }) {
  const playerRef = useRef(null);

  useEffect(() => {
    if (playerRef.current && hlsUrls.playbackHlsUrl) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsUrls.playbackHlsUrl);
        hls.attachMedia(playerRef.current);
      } else if (playerRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari
        playerRef.current.src = hlsUrls.playbackHlsUrl;
      }
    }
  }, [hlsUrls]);

  return (
    <video
      ref={playerRef}
      autoPlay
      controls
      playsInline
      style={{ width: '100%', height: 'auto' }}
    />
  );
}