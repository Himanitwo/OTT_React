import React, { forwardRef } from 'react';

const VideoPlayer = forwardRef(({ isBroadcaster }, ref) => {
  return (
    <div className="video-player">
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={isBroadcaster}
        controls={!isBroadcaster}
      />
    </div>
  );
});

export default VideoPlayer;
