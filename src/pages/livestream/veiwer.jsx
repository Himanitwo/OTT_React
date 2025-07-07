import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const Viewer = () => {
  const { id } = useParams();
  const [stream, setStream] = useState(null);
  const socket = io('http://localhost:5000');

  useEffect(() => {
    const fetchStream = async () => {
      const response = await fetch(`http://localhost:5000/api/streams/${id}/watch`);
      const data = await response.json();
      setStream(data);
    };

    fetchStream();
    socket.emit('viewer-joined', id);

    return () => {
      socket.emit('viewer-left', id);
      socket.disconnect();
    };
  }, [id]);

  if (!stream) return <div>Loading...</div>;

  return (
    <div className="viewer-page">
      <h1>{stream.title}</h1>
      <div className="video-container">
        <video
          controls
          autoPlay
          src={`http://localhost:8000/live/${stream.streamKey}.flv`}
        />
      </div>
      <div className="stream-info">
        <p>Viewers: {stream.viewers}</p>
      </div>
    </div>
  );
};

export default Viewer;