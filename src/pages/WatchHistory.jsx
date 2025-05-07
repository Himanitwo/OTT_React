import React, { useState } from 'react';
import { Trash, PlayCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const initialHistory = [
  {
    title: 'Kahaani',
    episode: 'Movie',
    thumbnail: '/img/kahanni.jpeg',
  },
  {
    title: 'Jungle Book',
    episode: 'Movie',
    thumbnail: '/img/jungle book.jpg',
  },
  {
    title: 'Dr Strange',
    episode: 'Movie',
    thumbnail: '/img/drstrange.jpg',
  },
];

const WatchHistory = () => {
  const [historyItems, setHistoryItems] = useState(initialHistory);

  const handleDelete = (indexToRemove) => {
    setHistoryItems((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-black text-white px-4 lg:px-20 py-16 font-sans">
      <h2 className="text-4xl font-bold tracking-tight mb-7">Watch History</h2>

      <div className="grid gap-8">
        {historyItems.map((item, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            key={index}
            className="flex flex-col sm:flex-row sm:items-center gap-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 ring-1 ring-white/10 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full sm:w-32 h-32 object-cover rounded-xl border border-white/10 shadow-md"
            />
            <div className="flex-1">
              <p className="text-2xl font-semibold tracking-wide">{item.title}</p>
              <p className="text-sm text-gray-300 mt-1">{item.episode}</p>
            </div>

            <div className="flex gap-3 items-center self-end sm:self-auto">
              <button
                className="flex items-center gap-1 text-sm bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg transition"
                title="Play"
              >
                <PlayCircle size={18} />
                Play
              </button>

              <button
                className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition"
                title="Download"
              >
                <Download size={18} />
                Download
              </button>

              <button
                onClick={() => handleDelete(index)}
                className="p-1.5 bg-red-600 hover:bg-red-700 rounded-lg transition"
                title="Delete"
              >
                <Trash size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WatchHistory;
