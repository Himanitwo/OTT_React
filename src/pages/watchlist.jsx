import React from 'react';
import { Play } from 'lucide-react'; // Optional: Use a proper play icon

const continueWatch = [
  {
    title: 'Oppenheimer',
    duration: '1h 22m',
    thumbnail: '/img/opp.jpg',
  },
  {
    title: 'Jungle Book',
    duration: '1h 22m',
    thumbnail: '/img/jungle book.jpg',
  },
];

const trending = [
  { title: 'Oppenheimer', thumbnail: '/img/opp.jpg' },
  { title: 'Queen', thumbnail: '/img/queen.jpg' },
  { title: 'Jungle Book', thumbnail: '/img/jungle book.jpg' },
  { title: 'Dr. Strange', thumbnail: '/img/drstrange.jpg' },
];

const Watchlist = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-black text-white px-8 py-12 font-sans">
      {/* Continue Watching */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-wide">Continue Watching</h2>
        </div>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
          {continueWatch.map((item, index) => (
            <div
              key={index}
              className="relative min-w-[260px] h-44 rounded-2xl overflow-hidden bg-gray-800 shadow-xl hover:scale-105 transition-transform duration-300"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-4 flex flex-col justify-end">
                <p className="text-lg font-semibold">{item.title}</p>
                <p className="text-sm text-gray-300">{item.duration}</p>
              </div>
              <div className="absolute top-3 right-3 bg-black/70 rounded-full p-2">
                <Play className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Watchlist Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-wide">Your Watchlist</h2>
        </div>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
          {trending.map((item, index) => (
            <div
              key={index}
              className="group relative min-w-[160px] h-60 rounded-xl overflow-hidden shadow-lg bg-gray-900 hover:scale-105 transition-transform duration-300"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-sm font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Watchlist;
