import React from 'react';
import { Trash } from 'lucide-react';

const historyItems = [
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
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-black text-white px-8 py-12 font-sans">
      <h2 className="text-3xl font-bold tracking-wide mb-6">Watch History</h2>
      <div className="space-y-6">
        {historyItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-gray-800 rounded-2xl p-4 shadow-lg hover:scale-[1.01] transition-transform duration-300"
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-20 h-20 object-cover rounded-xl"
            />
            <div className="flex flex-1 flex-col">
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="text-sm text-gray-300">{item.episode}</p>
            </div>
            {/* Static delete icon */}
            <Trash className="w-6 h-6 text-red-400 hover:text-red-600 cursor-pointer" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchHistory;
