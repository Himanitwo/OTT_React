import { useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import { useMemo } from 'react';

export default function LiveStream({ streamId }) {
  const { join, leave, hlsState, startHls, stopHls } = useMeeting();

  const joinStream = () => {
    join();
  };

  return (
    <div className="stream-container">
      <div className="stream-actions">
        <button onClick={joinStream}>Connect</button>
        <button onClick={leave}>Disconnect</button>
        {hlsState === 'HLS_PLAYABLE' ? (
          <button onClick={stopHls}>Stop Broadcast</button>
        ) : (
          <button onClick={() => startHls()}>Start Broadcast</button>
        )}
      </div>

      <StreamView />
    </div>
  );
}

function StreamView() {
  const { participants } = useMeeting();
  const participantIds = [...participants.keys()];

  return (
    <div className="stream-view">
      {participantIds.map((participantId) => (
        <ParticipantView key={participantId} participantId={participantId} />
      ))}
    </div>
  );
}

function ParticipantView({ participantId }) {
  const { webcamStream, displayName, isLocal } = useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream]);

  if (isLocal) return null; // Don't show local preview here

  return (
    <div className="participant-view">
      <h3>{displayName}</h3>
      {videoStream ? (
        <video
          autoPlay
          playsInline
          ref={(el) => {
            if (el) el.srcObject = videoStream;
          }}
        />
      ) : (
        <div className="no-video">Camera is off</div>
      )}
    </div>
  );
}