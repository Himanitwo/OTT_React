import { useState } from 'react';
import { MeetingProvider, useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import { authToken, createLiveStream } from './api';

export default function StartLive() {
  const [streamId, setStreamId] = useState(null);

  const startStream = async () => {
    const streamId = await createLiveStream({ token: authToken });
    setStreamId(streamId);
  };

  const endStream = () => {
    setStreamId(null);
  };

  return (
    <div className="streamer-container">
      {streamId ? (
        <MeetingProvider
          config={{
            meetingId: streamId,
            micEnabled: true,
            webcamEnabled: true,
            name: 'Streamer',
            mode: 'CONFERENCE',
            multiStream: true // Important for live streaming
          }}
          token={authToken}
        >
          <StreamControls streamId={streamId} onEndStream={endStream} />
        </MeetingProvider>
      ) : (
        <div className="stream-start-panel">
          <h2>Start Your Live Stream</h2>
          <button onClick={startStream} className="go-live-btn">
            Go Live
          </button>
        </div>
      )}
    </div>
  );
}

function StreamControls({ streamId, onEndStream }) {
  const {
    toggleWebcam,
    toggleMic,
    startHls,
    stopHls,
    hlsState,
    enableScreenShare,
    disableScreenShare,
    isScreenShareEnabled
  } = useMeeting();

  const { webcamStream } = useParticipant(useMeeting().localParticipant.id);

  return (
    <div className="stream-controls-panel">
      <div className="stream-preview">
        {webcamStream && (
          <video
            autoPlay
            muted
            playsInline
            ref={(el) => {
              if (el) el.srcObject = new MediaStream([webcamStream.track]);
            }}
          />
        )}
      </div>

      <div className="control-buttons">
        <button onClick={toggleWebcam}>Toggle Camera</button>
        <button onClick={toggleMic}>Toggle Mic</button>
        <button onClick={isScreenShareEnabled ? disableScreenShare : enableScreenShare}>
          {isScreenShareEnabled ? 'Stop Screen Share' : 'Share Screen'}
        </button>

        {hlsState === 'HLS_PLAYABLE' ? (
          <button onClick={stopHls}>Stop Stream</button>
        ) : (
          <button onClick={() => startHls({ layout: { type: 'SPOTLIGHT', priority: 'PIN' } })}>
            Start Broadcasting
          </button>
        )}

        <button onClick={onEndStream} className="end-stream-btn">
          End Stream
        </button>
      </div>

      <div className="stream-info">
        <p>Stream ID: {streamId}</p>
        <p>Status: {hlsState || 'Not broadcasting'}</p>
        <p>Share this link with viewers: {window.location.origin}/view/{streamId}</p>
      </div>
    </div>
  );
}