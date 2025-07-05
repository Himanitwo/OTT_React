import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Device } from 'mediasoup-client';
import { io } from "socket.io-client";
const socket = io("http://localhost:4001", {
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const Viewer = () => {
  const { streamId } = useParams();
  const videoRef = useRef(null);
  const deviceRef = useRef(null);
  const consumerTransportRef = useRef(null);
  const videoConsumerRef = useRef(null);
  const audioConsumerRef = useRef(null);
  const [streamInfo, setStreamInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const joinStream = async () => {
      try {
        // Get stream info and router capabilities
        const [streamData, { routerRtpCapabilities }] = await Promise.all([
          socket.request('getStreamInfo', { streamId }),
          socket.request('getRouterCapabilities')
        ]);

        setStreamInfo(streamData);

        // Load device
        deviceRef.current = new Device();
        await deviceRef.current.load({ routerRtpCapabilities });

        // Create consumer transport
        const transportInfo = await socket.request('createTransport', {
          forceTcp: false,
          producing: false,
          consuming: true
        });

        consumerTransportRef.current = deviceRef.current.createRecvTransport(transportInfo);

        // Set up transport event handlers
        consumerTransportRef.current.on('connect', async ({ dtlsParameters }, callback, errback) => {
          try {
            await socket.request('connectTransport', {
              transportId: consumerTransportRef.current.id,
              dtlsParameters
            });
            callback();
          } catch (error) {
            errback(error);
          }
        });

        // Get available producers and consume them
        const { producers } = await socket.request('getProducers', { streamId });

        for (const producer of producers) {
          const { rtpParameters } = await socket.request('consume', {
            transportId: consumerTransportRef.current.id,
            producerId: producer.id,
            rtpCapabilities: deviceRef.current.rtpCapabilities
          });

          const consumer = await consumerTransportRef.current.consume({
            id: rtpParameters.id,
            producerId: producer.id,
            kind: producer.kind,
            rtpParameters
          });

          if (producer.kind === 'video') {
            videoConsumerRef.current = consumer;
          } else {
            audioConsumerRef.current = consumer;
          }

          const stream = new MediaStream();
          stream.addTrack(consumer.track);
          if (videoRef.current) videoRef.current.srcObject = stream;
        }

        setLoading(false);
      } catch (err) {
        console.error('Error joining stream:', err);
        setError('Failed to join stream');
        setLoading(false);
      }
    };

    joinStream();

    return () => {
      // Clean up on unmount
      if (videoConsumerRef.current) videoConsumerRef.current.close();
      if (audioConsumerRef.current) audioConsumerRef.current.close();
      if (consumerTransportRef.current) consumerTransportRef.current.close();
      
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [streamId]);

  if (loading) return <div>Loading stream...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="viewer-container">
      {streamInfo && <h2>{streamInfo.title}</h2>}
      <video ref={videoRef} autoPlay playsInline controls />
    </div>
  );
};

export default Viewer;