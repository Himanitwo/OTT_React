import React from 'react';
import './EventsPage.css';

function EventsPage() {
  return (
    <div className="events-page">
      <h1 className="events-title">Upcoming Events</h1>
      <p className="events-description">
        Discover exclusive screenings, live streams, and community events happening soon!
      </p>
      {/* Example static event */}
      <div className="event-card">
        <h2>🎬 Indie Film Night</h2>
        <p>Date: July 5, 2025</p>
        <p>Time: 7:00 PM IST</p>
        <p>Platform: OTT Live Room</p>
      </div>
    </div>
  );
}

export default EventsPage;
