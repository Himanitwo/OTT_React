import { useState, useEffect } from 'react';
import { fetchActiveStreams } from './api';

export default function LiveLobby() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateStreams = async () => {
      try {
        const activeStreams = await fetchActiveStreams();
        setStreams(activeStreams.filter(stream => stream.status === 'HLS_PLAYABLE'));
      } catch (error) {
        console.error('Error fetching streams:', error);
      } finally {
        setLoading(false);
      }
    };

    updateStreams();
    const interval = setInterval(updateStreams, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="stream-lobby">
      <h1>Live Streams</h1>
      {loading ? (
        <p>Loading streams...</p>
      ) : streams.length === 0 ? (
        <p>No live streams currently available</p>
      ) : (
        <div className="stream-grid">
          {streams.map((stream) => (
            <div key={stream.id} className="stream-card">
              <div className="stream-thumbnail">
                <img src={stream.thumbnail || '/default-thumbnail.jpg'} alt={stream.title} />
                <span className="live-badge">LIVE</span>
                <span className="viewer-count">{stream.viewers} viewers</span>
              </div>
              <div className="stream-info">
                <h3>{stream.title || 'Untitled Stream'}</h3>
                <p className="streamer-name">{stream.creator}</p>
                <a href={`/view/${stream.id}`} className="watch-btn">
                  Watch Now
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}