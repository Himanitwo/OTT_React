// api.js
const API_BASE_URL = 'https://api.videosdk.live/v2';
const AUTH_TOKEN = "95b739aa1cc5e38e866968c4badd6bc0e4bb7ee5975ae4ba7962fcd8f375a96b"; // Store in .env

// Helper function for API requests
async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: AUTH_TOKEN,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

// Live Stream API
export const createLiveStream = async ({ title, description } = {}) => {
  const response = await fetchAPI('/rooms', {
    method: 'POST',
    body: JSON.stringify({
      region: 'us-east-1', // Choose your region
      privacy: 'public',
      autoCloseConfig: {
        type: 'session-end', // Room closes when stream ends
        duration: 60, // 60 minutes after last participant leaves
      },
      metadata: {
        title: title || 'My Live Stream',
        description: description || '',
        isLivestream: true,
      },
    }),
  });

  return response.roomId;
};

export const fetchActiveStreams = async () => {
  const response = await fetchAPI('/rooms', {
    method: 'GET',
  });

  return response.data
    .filter(room => room.metadata?.isLivestream)
    .map(room => ({
      id: room.roomId,
      title: room.metadata?.title || 'Untitled Stream',
      creator: room.metadata?.creator || 'Anonymous',
      thumbnail: room.metadata?.thumbnail,
      status: room.status,
      viewers: room.participantsCount || 0,
      createdAt: room.createdAt,
    }));
};

export const getStreamDetails = async (roomId) => {
  const response = await fetchAPI(`/rooms/${roomId}`);
  return {
    id: response.roomId,
    status: response.status,
    hlsUrl: response.hlsUrl,
    participants: response.participants,
    metadata: response.metadata,
  };
};

export const endStream = async (roomId) => {
  return fetchAPI(`/rooms/${roomId}/end`, {
    method: 'POST',
  });
};

export const getHlsStreamUrl = async (roomId) => {
  const response = await fetchAPI(`/rooms/${roomId}/hls`);
  return response.url;
};

// Authentication
export const authToken = AUTH_TOKEN;

// WebRTC Token Generation (if needed)
export const generateWebRTCToken = async ({ roomId, participantId }) => {
  const response = await fetchAPI('/tokens/webrtc', {
    method: 'POST',
    body: JSON.stringify({
      roomId,
      participantId,
      permissions: ['allow_join', 'allow_mod'],
    }),
  });
  return response.token;
};

// Webhook Helpers (for server-side integration)
export const setupWebhooks = async (webhookUrl) => {
  return fetchAPI('/webhooks', {
    method: 'POST',
    body: JSON.stringify({
      url: webhookUrl,
      events: [
        'room.created',
        'room.ended',
        'participant.joined',
        'participant.left',
        'hls.started',
        'hls.ended',
      ],
    }),
  });
};