import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  CircularProgress,
  Button,
  Avatar
} from '@mui/material';
import { FiberManualRecord, People } from '@mui/icons-material';

// Initialize socket connection
const socket = io("http://localhost:4001", {
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Add request-response pattern to socket
socket.request = (event, data = {}) => {
  return new Promise((resolve, reject) => {
    socket.emit(event, data, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response);
      }
    });
  });
};

const LiveLobby = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Connect socket when component mounts
    socket.connect();

    const fetchStreams = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await socket.request('getLiveStreams');
        setStreams(response);
      } catch (err) {
        console.error('Error fetching streams:', err);
        setError('Failed to load streams. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();

    // Set up socket listeners
    const onStreamStarted = (stream) => {
      setStreams(prev => [...prev, stream]);
    };

    const onStreamEnded = (streamId) => {
      setStreams(prev => prev.filter(s => s.id !== streamId));
    };

    socket.on('streamStarted', onStreamStarted);
    socket.on('streamEnded', onStreamEnded);

    return () => {
      // Clean up listeners
      socket.off('streamStarted', onStreamStarted);
      socket.off('streamEnded', onStreamEnded);
      socket.disconnect();
    };
  }, []);

  const joinStream = (streamId) => {
    navigate(`/view/${streamId}`);
  };

  const startNewStream = () => {
    navigate('/stream/new');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h4" component="h1">
          Live Streams
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<FiberManualRecord />}
          onClick={startNewStream}
        >
          Start Streaming
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : streams.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No live streams available
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={startNewStream}
          >
            Be the first to stream
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {streams.map(stream => (
            <Grid item xs={12} sm={6} md={4} key={stream.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 6
                  }
                }}
                onClick={() => joinStream(stream.id)}
              >
                <CardMedia
                  component="div"
                  sx={{
                    position: 'relative',
                    height: 0,
                    paddingTop: '56.25%', // 16:9 aspect ratio
                    backgroundColor: '#000'
                  }}
                >
                  {stream.thumbnail ? (
                    <img 
                      src={stream.thumbnail} 
                      alt={stream.title}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <Avatar 
                      sx={{ 
                        width: '100%', 
                        height: '100%',
                        fontSize: '3rem',
                        bgcolor: 'primary.main'
                      }}
                    >
                      {stream.hostName?.charAt(0) || 'S'}
                    </Avatar>
                  )}
                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    bgcolor: 'red',
                    color: 'white',
                    px: 1,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <FiberManualRecord sx={{ fontSize: 14, mr: 0.5 }} />
                    <Typography variant="caption">LIVE</Typography>
                  </Box>
                  <Box sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    px: 1,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <People sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">
                      {stream.viewerCount || 0}
                    </Typography>
                  </Box>
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h6" noWrap>
                    {stream.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hosted by: {stream.hostName || 'Anonymous'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default LiveLobby;