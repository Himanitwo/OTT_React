import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const LiveStream = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [streamStats, setStreamStats] = useState({
    viewers: 0,
    bitrate: 0,
    latency: 0,
    isLive: true
  });
  const [voiceControl, setVoiceControl] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Initialize camera and stream
  useEffect(() => {
    let stream;
    const initCamera = async () => {
      try {
        if (state?.isBroadcaster) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (error) {
        console.error('Camera access failed:', error);
        setCameraError('Could not access camera. Please check permissions.');
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [state?.isBroadcaster]);

  // Fetch stream stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/streams/${id}/stats`);
        const data = await response.json();
        setStreamStats(prev => ({
          ...prev,
          viewers: data.viewers,
          bitrate: data.bitrate,
          latency: data.latency
        }));
      } catch (error) {
        console.error('Failed to fetch stream stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [id]);

  // Voice control setup
  useEffect(() => {
    if (!voiceControl) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice control not supported in your browser');
      setVoiceControl(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
      if (command.includes('end stream') && state?.isBroadcaster) {
        endStream();
      }
      // Add more commands as needed
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [voiceControl, state?.isBroadcaster]);

  const endStream = async () => {
    try {
      await fetch(`/api/streams/${id}/end`, { method: 'POST' });
      navigate('/');
    } catch (error) {
      console.error('Failed to end stream:', error);
    }
  };

  const toggleVoiceControl = () => {
    setVoiceControl(prev => !prev);
  };

  if (state?.isBroadcaster) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <div className="flex flex-1 overflow-hidden">
          {/* Video Preview */}
          <div className="flex-1 bg-black relative">
            {cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Camera Error</h3>
                <p className="text-gray-400 mb-4">{cameraError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-contain"
              />
            )}
            
            {/* Stream Controls */}
            <div className="absolute bottom-4 left-4 z-10 flex gap-2">
              <button
                onClick={endStream}
                className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                End Stream
              </button>
              <button
                onClick={toggleVoiceControl}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${voiceControl ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                {voiceControl ? 'Listening...' : 'Voice'}
              </button>
            </div>
          </div>

          {/* Stream Info Panel */}
          <div className="w-80 bg-gray-800 p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Stream Dashboard</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Stream Health</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>Status</span>
                      <span className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-1 ${streamStats.isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                        {streamStats.isLive ? 'LIVE' : 'OFFLINE'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>Viewers</span>
                      <span>{streamStats.viewers.toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>Bitrate</span>
                      <span>{streamStats.bitrate} kbps</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (streamStats.bitrate / 5000) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>Latency</span>
                      <span>{streamStats.latency} ms</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Stream Info</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Title</p>
                    <p className="font-medium">{state?.streamInfo?.title || 'My Stream'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Stream Key</p>
                    <div className="bg-gray-800 p-2 rounded text-sm font-mono break-all">
                      {state?.streamKey || 'xxxx-xxxx-xxxx'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Broadcast Software</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">Server URL:</p>
                  <code className="bg-gray-800 p-2 rounded block">rtmp://localhost/live</code>
                  <p className="text-gray-300 mt-2">Stream Key:</p>
                  <code className="bg-gray-800 p-2 rounded block">{state?.streamKey || 'your-stream-key'}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Viewer UI
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Video Player */}
        <div className="flex-1 bg-black relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <video
              ref={videoRef}
              controls
              autoPlay
              className="w-full h-full object-contain"
              src={`http://localhost:8000/live/${id}.flv`}
              onError={() => console.error('Video playback failed')}
            />
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="lg:w-80 bg-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">{state?.streamInfo?.title || 'Live Stream'}</h2>
            <div className="flex items-center mt-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                {state?.userId?.charAt(0).toUpperCase() || 'S'}
              </div>
              <span className="text-gray-300">@{state?.userId || 'streamer'}</span>
              <div className="ml-auto flex items-center text-sm bg-gray-700 px-2 py-1 rounded">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                {streamStats.viewers.toLocaleString()} viewers
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-center text-gray-500 mt-10">
              <p>Live chat coming soon!</p>
            </div>
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex">
              <input
                type="text"
                placeholder="Send a message"
                className="flex-1 bg-gray-700 rounded-l-lg px-4 py-2 focus:outline-none"
                disabled
              />
              <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-r-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;