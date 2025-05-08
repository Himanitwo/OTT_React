import React, { useState } from 'react';
import { Trash, PlayCircle, Download, History } from 'lucide-react';
import { motion } from 'framer-motion';

const initialHistory = [
  {
    title: 'Coat',
    episode: 'Movie',
    thumbnail: '/img/Coat.jpg',
    dateWatched: '2024-05-01',
  },
  {
    title: 'Waris',
    episode: 'Series',
    thumbnail: '/img/waris.png',
    dateWatched: '2024-04-25',
  },
  {
    title: 'Take It Easy Urvashi',
    episode: 'Movie',
    thumbnail: '/img/urvashi.png',
    dateWatched: '2024-04-20',
  },
];

const WatchHistory = () => {
  const [historyItems, setHistoryItems] = useState(initialHistory);

  const handleDelete = (indexToRemove) => {
    setHistoryItems((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const clearAll = () => {
    setHistoryItems([]);
  };

  return (
    <div className="relative min-h-screen  bg-gradient-to-b from-black via-gray-900 to-black  text-white px-4 lg:px-20 py-16 font-sans overflow-hidden">
      {/* Blurred Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute w-96 h-96 bg-teal-900 opacity-10 rounded-full blur-3xl -top-32 -left-32" />
        <div className="absolute w-72 h-72 bg-indigo-700 opacity-10 rounded-full blur-3xl bottom-10 right-10" />
      </div>

      <div className="flex items-center gap-3 mb-7">
        <History className="text-blue-400" size={32} />
        <h2 className="text-4xl font-bold tracking-tight">Watch History</h2>
      </div>

      {historyItems.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={clearAll}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Clear All
          </button>
        </div>
      )}

      {historyItems.length === 0 ? (
        <p className="text-gray-400 text-center text-lg mt-20">
          No watch history available. Start watching something!
        </p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {historyItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-56 h-72 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-lg hover:scale-105 transition-transform hover:shadow-xl group"
            >
              {/* Background Image */}
              <img
                src={item.thumbnail}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-black/30 text-white flex flex-col justify-end p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.episode}</p>
                <p className="text-xs text-gray-300">Watched on: {item.dateWatched}</p>
                <div className="flex gap-2 mt-2">
                  <button className="flex items-center gap-1 text-sm bg-teal-600/70 hover:bg-teal-700 text-white px-2 py-1 rounded">
                    <PlayCircle className="text-white-500" size={16} /> Play
                  </button>
                  <button className="flex items-center gap-1 text-sm bg-green-600 hover:bg-blue-700 text-white px-2 py-1 rounded">
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-1.5 bg-red-600 hover:bg-red-700 rounded"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
