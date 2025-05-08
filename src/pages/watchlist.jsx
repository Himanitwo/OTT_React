import React from 'react';
import { PlayCircle, Tv } from 'lucide-react';

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

const series = [
  { title: 'Stranger Things', thumbnail: '/img/stranger.jpg' },
  { title: 'Breaking Bad', thumbnail: '/img/breakingbad.jpg' },
  { title: 'The Witcher', thumbnail: '/img/witcher.jpg' },
  { title: 'Loki', thumbnail: '/img/loki.jpg' },
];

const Watchlist = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-10 py-14 font-sans space-y-16">
      
      {/* Continue Watching */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <PlayCircle className="text-green-500" size={28} />
          <h2 className="text-2xl font-bold">Continue Watching</h2>
        </div>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
          {continueWatch.map((item, index) => (
            <div
              key={index}
              className="relative min-w-[260px] h-40 rounded-xl overflow-hidden bg-gray-800 shadow-lg hover:scale-105 transition-transform"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-end">
                <p className="text-md font-semibold">{item.title}</p>
                <p className="text-xs text-gray-300">{item.duration}</p>
              </div>
              <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1">
                <span className="text-sm">▶</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Your Watchlist */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <PlayCircle className="text-yellow-500" size={28} />
          <h2 className="text-2xl font-bold">Your Watchlist</h2>
        </div>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
          {trending.map((item, index) => (
            <div
              key={index}
              className="min-w-[140px] h-56 rounded-xl overflow-hidden shadow-md bg-gray-900 hover:scale-105 transition-transform"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Popular Series */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Tv className="text-blue-500" size={28} />
          <h2 className="text-2xl font-bold">Popular Series</h2>
        </div>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
          {series.map((item, index) => (
            <div
              key={index}
              className="min-w-[140px] h-56 rounded-xl overflow-hidden shadow-md bg-gray-900 hover:scale-105 transition-transform"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Watchlist;
