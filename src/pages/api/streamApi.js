
const API_BASE_URL = "http://localhost:5000";

export const getActiveStreams = async () => {
  const response = await fetch(`${API_BASE_URL}/streams`);
  if (!response.ok) throw new Error('Failed to fetch streams');
  return await response.json();
};

export const startNewStream = async (title) => {
  const response = await fetch(`${API_BASE_URL}/streams/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ title })
  });
  if (!response.ok) throw new Error('Failed to start stream');
  return await response.json();
};

export const endStream = async (streamId) => {
  const response = await fetch(`${API_BASE_URL}/streams/${streamId}/end`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to end stream');
};

export const setupStream = async (streamId, videoElement) => {
  // This would be replaced with actual stream setup logic
  // For GStreamer/FFmpeg/MediaSoup integration
  return new Promise((resolve) => {
    console.log('Setting up stream for broadcaster');
    resolve();
  });
};

export const watchStream = async (streamId, videoElement) => {
  // This would be replaced with actual viewer connection logic
  // For RTSP/WebRTC playback
  return new Promise((resolve) => {
    console.log('Setting up viewer connection');
    resolve();
  });
};