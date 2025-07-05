import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StartLive = () => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      navigate('/broadcast/123', { 
        state: { 
          isBroadcaster: true,
          streamKey: 'xyz-123-abc',
          streamInfo: {
            title: title || 'My Awesome Stream'
          }
        } 
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Go Live</h1>
          <p className="text-gray-400">Start your streaming session</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Stream Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="What are you streaming today?"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${loading ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-500'}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Starting...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Start Streaming
              </>
            )}
          </button>
        </form>

        <div className="mt-8 bg-gray-700 p-4 rounded-lg">
          <h3 className="font-bold mb-2">OBS Setup Guide</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="bg-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">1</span>
              <p>Server: <code className="bg-gray-800 px-1 rounded">rtmp://localhost/live</code></p>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">2</span>
              <p>Stream Key: <code className="bg-gray-800 px-1 rounded">Will appear after starting</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartLive;