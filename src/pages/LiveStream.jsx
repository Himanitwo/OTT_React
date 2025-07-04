import React, { useState, useRef, useEffect } from 'react';
import { Device } from 'mediasoup-client';
import { Button, Card, Grid, Typography, Box, IconButton } from '@mui/material';
import { FiberManualRecord, Stop, Videocam, VideocamOff, Mic, MicOff } from '@mui/icons-material';

const LiveStream = ({ streamId }) => {
  // State management
  const [device, setDevice] = useState(null);
  const [transport, setTransport] = useState(null);
  const [producers, setProducers] = useState([]);
  const [consumers, setConsumers] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [error, setError] = useState(null);
  
  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize connection
  useEffect(() => {
    const initConnection = async () => {
      try {
        // Initialize WebSocket connection
        socketRef.current = new WebSocket('wss://your-mediasoup-server.com');
        
        socketRef.current.onopen = () => {
          console.log('WebSocket connected');
          initializeMediasoup();
        };

        socketRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          handleServerMessage(data);
        };

        socketRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setError('Connection error');
        };

        socketRef.current.onclose = () => {
          console.log('WebSocket disconnected');
        };

      } catch (error) {
        console.error('Initialization error:', error);
        setError('Failed to initialize');
      }
    };

    const initializeMediasoup = async () => {
      try {
        const newDevice = new Device();
        setDevice(newDevice);
        
        // Get router capabilities
        const capabilities = await sendRequest('getRouterCapabilities');
        await newDevice.load({ routerRtpCapabilities: capabilities });
        
        // Create transport
        const transportInfo = await sendRequest('createTransport', {
          producing: true,
          consuming: true
        });
        
        const newTransport = newDevice.createSendTransport(transportInfo);
        configureTransport(newTransport);
        setTransport(newTransport);

      } catch (error) {
        console.error('Mediasoup initialization failed:', error);
        setError('Media setup failed');
      }
    };

    initConnection();

    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
      cleanupMedia();
    };
  }, []);

  const configureTransport = (transport) => {
    transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        await sendRequest('connectTransport', {
          transportId: transport.id,
          dtlsParameters
        });
        callback();
      } catch (error) {
        errback(error);
        setError('Transport connection failed');
      }
    });

    transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
      try {
        const { id } = await sendRequest('produce', {
          transportId: transport.id,
          kind,
          rtpParameters
        });
        callback({ id });
      } catch (error) {
        errback(error);
        setError('Failed to produce media');
      }
    });

    transport.on('connectionstatechange', (state) => {
      if (state === 'failed') {
        setError('Connection failed');
        stopStreaming();
      }
    });
  };

  const startStreaming = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: true
      });

      localVideoRef.current.srcObject = stream;

      // Produce video track
      const videoTrack = stream.getVideoTracks()[0];
      const videoProducer = await transport.produce({
        track: videoTrack,
        encodings: [
          { maxBitrate: 2500000 }, // HD
          { maxBitrate: 1000000 }, // Medium
          { maxBitrate: 500000 }   // Low
        ],
        codecOptions: {
          videoGoogleStartBitrate: 1000
        }
      });

      // Produce audio track
      const audioTrack = stream.getAudioTracks()[0];
      const audioProducer = await transport.produce({
        track: audioTrack,
        codecOptions: {
          opusStereo: true,
          opusDtx: true
        }
      });

      setProducers([videoProducer, audioProducer]);
      setIsLive(true);
      await sendRequest('startStream', { streamId });

    } catch (error) {
      console.error('Stream start failed:', error);
      setError('Failed to start streaming');
      cleanupMedia();
    }
  };

  const stopStreaming = async () => {
    try {
      await sendRequest('stopStream', { streamId });
      cleanupMedia();
      setIsLive(false);
      setError(null);
    } catch (error) {
      console.error('Stream stop failed:', error);
      setError('Failed to stop streaming');
    }
  };

  const cleanupMedia = () => {
    producers.forEach(producer => producer?.close());
    consumers.forEach(consumer => consumer?.close());
    setProducers([]);
    setConsumers([]);
    
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
  };

  const toggleVideo = () => {
    if (producers[0]) {
      producers[0].track.enabled = !producers[0].track.enabled;
      setIsVideoMuted(!producers[0].track.enabled);
    }
  };

  const toggleAudio = () => {
    if (producers[1]) {
      producers[1].track.enabled = !producers[1].track.enabled;
      setIsAudioMuted(!producers[1].track.enabled);
    }
  };

  const sendRequest = (action, data = {}) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        return reject(new Error('WebSocket not connected'));
      }

      const requestId = Date.now().toString();
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 10000);

      const handleResponse = (event) => {
        const response = JSON.parse(event.data);
        if (response.requestId === requestId) {
          clearTimeout(timeout);
          socketRef.current.removeEventListener('message', handleResponse);
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response.data);
          }
        }
      };

      socketRef.current.addEventListener('message', handleResponse);
      socketRef.current.send(JSON.stringify({
        requestId,
        action,
        data
      }));
    });
  };

  const handleServerMessage = (data) => {
    switch (data.type) {
      case 'consumerCreated':
        handleNewConsumer(data.consumer);
        break;
      case 'viewerCount':
        setViewers(data.count);
        break;
      case 'error':
        setError(data.message);
        break;
      default:
        console.log('Unhandled message:', data);
    }
  };

  const handleNewConsumer = async (consumerInfo) => {
    try {
      const consumer = await transport.consume({
        id: consumerInfo.id,
        producerId: consumerInfo.producerId,
        kind: consumerInfo.kind,
        rtpParameters: consumerInfo.rtpParameters
      });

      setConsumers(prev => [...prev, consumer]);
      
      if (consumer.kind === 'video' && remoteVideoRef.current) {
        const stream = new MediaStream();
        stream.addTrack(consumer.track);
        remoteVideoRef.current.srcObject = stream;
      }

    } catch (error) {
      console.error('Failed to create consumer:', error);
    }
  };

  return (
    <Card sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Live Stream
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {/* Controls */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {!isLive ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<FiberManualRecord />}
                onClick={startStreaming}
                size="large"
              >
                Go Live
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Stop />}
                  onClick={stopStreaming}
                  size="large"
                >
                  Stop Stream
                </Button>
                <IconButton onClick={toggleVideo} color={isVideoMuted ? "error" : "default"}>
                  {isVideoMuted ? <VideocamOff /> : <Videocam />}
                </IconButton>
                <IconButton onClick={toggleAudio} color={isAudioMuted ? "error" : "default"}>
                  {isAudioMuted ? <MicOff /> : <Mic />}
                </IconButton>
              </>
            )}
            <Typography variant="body1">
              {viewers} {viewers === 1 ? 'viewer' : 'viewers'}
            </Typography>
          </Box>
        </Grid>

        {/* Video Feeds */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Stream
            </Typography>
            <Box sx={{ position: 'relative', bgcolor: 'black', borderRadius: 1 }}>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  display: isVideoMuted ? 'none' : 'block'
                }}
              />
              {isVideoMuted && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  bgcolor: 'black'
                }}>
                  <VideocamOff fontSize="large" />
                </Box>
              )}
              {isLive && (
                <Box sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  bgcolor: 'red',
                  color: 'white',
                  px: 1,
                  borderRadius: 1,
                  fontSize: 14
                }}>
                  LIVE
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Viewers
            </Typography>
            <Box sx={{ bgcolor: 'black', borderRadius: 1, aspectRatio: '16/9' }}>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  display: consumers.length > 0 ? 'block' : 'none'
                }}
              />
              {consumers.length === 0 && (
                <Box sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary'
                }}>
                  <Typography>Waiting for viewers...</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
};

export default LiveStream;