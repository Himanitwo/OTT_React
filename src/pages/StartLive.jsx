import React, { useState, useRef, useEffect } from 'react';
import { Device } from 'mediasoup-client';
import { io } from "socket.io-client";
import { Box, Button, TextField, Typography, Card, CardContent } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import StopIcon from '@mui/icons-material/Stop';

// Initialize socket connection (move this to a separate socket.js file later)
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

const StartLive = () => {
  const [streamTitle, setStreamTitle] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState(null);
  const [viewerCount, setViewerCount] = useState(0);
  const videoRef = useRef(null);
  const deviceRef = useRef(null);
  const producerTransportRef = useRef(null);
  const videoProducerRef = useRef(null);
  const audioProducerRef = useRef(null);

  useEffect(() => {
    // Connect socket when component mounts
    socket.connect();

    // Set up socket listeners
    socket.on('viewerCountUpdate', (count) => {
      setViewerCount(count);
    });

    socket.on('error', (error) => {
      setError(error.message);
    });

    return () => {
      // Clean up on unmount
      socket.off('viewerCountUpdate');
      socket.off('error');
      if (isLive) {
        stopStreaming().catch(console.error);
      }
    };
  }, []);

  const startStreaming = async () => {
    setError(null);
    try {
      if (!streamTitle.trim()) {
        throw new Error('Stream title is required');
      }

      // Get router capabilities from server
      const { routerRtpCapabilities } = await socket.request('getRouterCapabilities');
      
      // Load device
      deviceRef.current = new Device();
      await deviceRef.current.load({ routerRtpCapabilities });

      // Create transport
      const transportInfo = await socket.request('createTransport', {
        forceTcp: false,
        producing: true,
        consuming: false
      });

      producerTransportRef.current = deviceRef.current.createSendTransport(transportInfo);

      // Set up transport event handlers
      producerTransportRef.current.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          await socket.request('connectTransport', {
            transportId: producerTransportRef.current.id,
            dtlsParameters
          });
          callback();
        } catch (error) {
          errback(error);
          setError('Transport connection failed');
        }
      });

      producerTransportRef.current.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
        try {
          const { id } = await socket.request('produce', {
            transportId: producerTransportRef.current.id,
            kind,
            rtpParameters,
            appData: { streamTitle }
          });
          callback({ id });
        } catch (error) {
          errback(error);
          setError('Failed to produce media');
        }
      });

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }, 
        audio: true 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Produce video track
      const videoTrack = stream.getVideoTracks()[0];
      videoProducerRef.current = await producerTransportRef.current.produce({
        track: videoTrack,
        encodings: [
          { maxBitrate: 2500000 }, // 2.5 Mbps for HD
          { maxBitrate: 1000000 }, // 1 Mbps for medium quality
          { maxBitrate: 500000 }   // 500 Kbps for low bandwidth
        ],
        codecOptions: {
          videoGoogleStartBitrate: 1000
        }
      });

      // Produce audio track
      const audioTrack = stream.getAudioTracks()[0];
      audioProducerRef.current = await producerTransportRef.current.produce({
        track: audioTrack,
        codecOptions: {
          opusStereo: true,
          opusDtx: true
        }
      });

      setIsLive(true);
      await socket.request('startStream', { 
        title: streamTitle,
        description: 'Live stream started'
      });

    } catch (error) {
      console.error('Error starting stream:', error);
      setError(error.message || 'Failed to start streaming');
      // Clean up if something failed
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    }
  };

  const stopStreaming = async () => {
    try {
      if (videoProducerRef.current) videoProducerRef.current.close();
      if (audioProducerRef.current) audioProducerRef.current.close();
      if (producerTransportRef.current) producerTransportRef.current.close();
      
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      
      await socket.request('stopStream');
      setIsLive(false);
      setError(null);
    } catch (error) {
      console.error('Error stopping stream:', error);
      setError('Failed to stop streaming properly');
    }
  };

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Live Stream Dashboard
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            Error: {error}
          </Typography>
        )}

        {!isLive ? (
          <>
            <TextField
              fullWidth
              label="Stream Title"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              margin="normal"
              required
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<VideocamIcon />}
              onClick={startStreaming}
              size="large"
              sx={{ mt: 2 }}
            >
              Start Streaming
            </Button>
          </>
        ) : (
          <>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  backgroundColor: '#000'
                }}
              />
              <Box sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                backgroundColor: 'red',
                color: 'white',
                px: 1,
                borderRadius: 1
              }}>
                LIVE
              </Box>
              <Box sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                px: 1,
                borderRadius: 1
              }}>
                {viewerCount} viewers
              </Box>
            </Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {streamTitle}
            </Typography>
            <Button
              variant="contained"
              color="error"
              startIcon={<StopIcon />}
              onClick={stopStreaming}
              size="large"
            >
              Stop Streaming
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StartLive;