import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ReactMediaRecorder } from "react-media-recorder";

const LiveStream = () => {
  const { roomId } = useParams();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenStream, setScreenStream] = useState(null);
  const [mirrored, setMirrored] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 }, 
          audio: true 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to access camera:", err);
        setError("Camera access denied or unavailable.");
        setLoading(false);
      }
    };

    startStream();

    return () => {
      stopAllStreams();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopAllStreams = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    screenStream?.getTracks().forEach((track) => track.stop());
  };

  const toggleVideo = () => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoEnabled(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    const audioTrack = streamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setAudioEnabled(audioTrack.enabled);
    }
  };

  const toggleMirror = () => {
    setMirrored(!mirrored);
  };

  const startScreenShare = async () => {
    try {
      const screen = await navigator.mediaDevices.getDisplayMedia({ 
        video: { cursor: "always" },
        audio: true 
      });
      setScreenStream(screen);
      if (videoRef.current) {
        videoRef.current.srcObject = screen;
      }

      screen.getVideoTracks()[0].onended = () => {
        if (streamRef.current && videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
        }
      };
    } catch (err) {
      console.error("Screen share failed:", err);
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      if (streamRef.current && videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
    }
  };

  const stopStream = () => {
    stopAllStreams();
    setLoading(true);
    setError("Live stream has ended.");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecordingTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecordingTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      {loading && !error && (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-xl font-bold">Starting your live stream...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-900/50 p-4 rounded-lg max-w-md text-center">
          <p className="text-red-300 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            🔄 Try Again
          </button>
        </div>
      )}
      
      {!loading && !error && (
        <>
          <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
            {/* Video Area */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-red-500 animate-pulse">●</span> Live Stream - Room: {roomId}
              </h1>
              
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full rounded-lg shadow-xl ${mirrored ? 'transform -scale-x-100' : ''}`}
                />
                
                {recordingStatus === 'recording' && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-md flex items-center gap-2">
                    <span className="animate-pulse">●</span> Recording {formatTime(recordingTime)}
                  </div>
                )}
              </div>
              
              {/* Primary Controls */}
              <div className="mt-4 flex flex-wrap gap-3 justify-center bg-gray-800/50 p-4 rounded-lg">
                <button 
                  onClick={toggleVideo} 
                  className={`flex items-center gap-2 px-4 py-2 rounded ${videoEnabled ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-500'}`}
                >
                  {videoEnabled ? '📹 Video On' : '📵 Video Off'}
                </button>
                
                <button 
                  onClick={toggleAudio} 
                  className={`flex items-center gap-2 px-4 py-2 rounded ${audioEnabled ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-500'}`}
                >
                  {audioEnabled ? '🎙️ Mic On' : '🔇 Mic Off'}
                </button>
                
                <button 
                  onClick={toggleMirror} 
                  className={`flex items-center gap-2 px-4 py-2 rounded ${mirrored ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'}`}
                >
                  {mirrored ? '🪞 Mirror On' : '🪞 Mirror Off'}
                </button>
                
                {!screenStream ? (
                  <button 
                    onClick={startScreenShare} 
                    className="flex items-center gap-2 px-4 py-2 rounded bg-purple-600 hover:bg-purple-500"
                  >
                    🖥️ Share Screen
                  </button>
                ) : (
                  <button 
                    onClick={stopScreenShare} 
                    className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 hover:bg-red-500"
                  >
                    🖥️ Stop Sharing
                  </button>
                )}
                
                <button 
                  onClick={stopStream} 
                  className="flex items-center gap-2 px-4 py-2 rounded bg-red-700 hover:bg-red-600"
                >
                  ⏹️ End Stream
                </button>
              </div>
            </div>
            
            {/* Sidebar with Recording Controls */}
            <div className="w-full md:w-80 bg-gray-800/50 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                📹 Recording Controls
              </h2>
              
              <ReactMediaRecorder
                video
                audio
                onStart={() => {
                  setRecordingStatus('recording');
                  startRecordingTimer();
                }}
                onStop={() => {
                  setRecordingStatus('idle');
                  stopRecordingTimer();
                }}
                render={({
                  status,
                  startRecording,
                  stopRecording,
                  mediaBlobUrl,
                }) => (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={startRecording} 
                        disabled={status === 'recording'}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded ${status === 'recording' ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'}`}
                      >
                        🎬 {status === 'recording' ? 'Recording...' : 'Start Recording'}
                      </button>
                      
                      <button 
                        onClick={stopRecording} 
                        disabled={status !== 'recording'}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded ${status !== 'recording' ? 'bg-gray-600 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-500'}`}
                      >
                        ⏹️ Stop Recording
                      </button>
                    </div>
                    
                    {status === 'recording' && (
                      <div className="text-center py-2 bg-gray-700 rounded">
                        ⏱️ Recording: {formatTime(recordingTime)}
                      </div>
                    )}
                    
                    {mediaBlobUrl && (
                      <div className="mt-4 space-y-3">
                        <h3 className="font-medium flex items-center gap-2">
                          📼 Recording Preview
                        </h3>
                        <video 
                          src={mediaBlobUrl} 
                          controls 
                          className="w-full rounded border border-gray-600"
                        />
                        <a
                          href={mediaBlobUrl}
                          download={`stream-recording-${roomId}-${new Date().toISOString().slice(0,10)}.mp4`}
                          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          💾 Download Recording
                        </a>
                      </div>
                    )}
                  </div>
                )}
              />
              
              {/* Additional Features */}
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  ⚙️ Stream Settings
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2">
                    🌡️ Adjust Video Quality
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2">
                    🎚️ Audio Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2">
                    🎛️ Advanced Controls
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="mt-6 w-full max-w-6xl bg-gray-800/50 p-3 rounded-lg flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${!error ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Stream Status: {!error ? 'Live' : 'Error'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📹 {videoEnabled ? 'Video: On' : 'Video: Off'}</span>
              <span>🎙️ {audioEnabled ? 'Audio: On' : 'Audio: Off'}</span>
              <span>🖥️ {screenStream ? 'Screen Sharing: Active' : 'Screen Sharing: Inactive'}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveStream;