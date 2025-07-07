import React from 'react';

const StreamCard = ({ stream, onClick }) => {
  return (
    <div className="stream-card" onClick={onClick}>
      <div className="stream-thumbnail">
        <img src={stream.thumbnailUrl || '/default-thumbnail.jpg'} alt={stream.title} />
        <span className="viewer-count">{stream.viewerCount} viewers</span>
      </div>
      <div className="stream-info">
        <h3>{stream.title}</h3>
        <p>{stream.broadcasterName}</p>
      </div>
    </div>
  );
};

export default StreamCard;
