import React, { useState } from 'react';
import { PlayCircle, Tv, Trash2 } from 'lucide-react';
import { useTheme } from './useTheme';
import { usePlaylist } from './PlaylistContext'; // Adjust path

const initialContinueWatch = [
  { title: 'Oppenheimer', duration: '1h 22m', thumbnail: '/img/opp.jpg' },
  { title: 'Jungle Book', duration: '1h 22m', thumbnail: '/img/jungle book.jpg' },
];

const initialTrending = [
  { title: 'Oppenheimer', thumbnail: '/img/opp.jpg' },
  { title: 'Queen', thumbnail: '/img/queen.jpg' },
  { title: 'Jungle Book', thumbnail: '/img/jungle book.jpg' },
  { title: 'Dr. Strange', thumbnail: '/img/drstrange.jpg' },
];

const series = [
  { title: 'Stranger Things', thumbnail: '/img/opp.jpg' },
  { title: 'Breaking Bad', thumbnail: '/img/kahanni.jpeg' },
  { title: 'The Witcher', thumbnail: '/img/grinch.jpg' },
  { title: 'Loki', thumbnail: '/img/drstrange.jpg' },
];

const Watchlist = () => {
  const [continueWatchList, setContinueWatchList] = useState(initialContinueWatch);
  const [watchlist, setWatchlist] = useState(initialTrending);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const { playlists, createPlaylist } = usePlaylist();
  const { theme } = useTheme();

  const handleDeleteContinue = (index) =>
    setContinueWatchList((prev) => prev.filter((_, i) => i !== index));

  const handleDeleteWatchlist = (index) =>
    setWatchlist((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className={`min-h-screen px-10 py-14 font-sans space-y-16 ${theme.background} ${theme.text}`}>
      
      {/* Create Playlist */}
      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="New Playlist Name"
            className={`px-4 py-2 rounded text-black w-full sm:w-auto ${theme.text}`}
          />
          <button
           className={`${theme.accent} ${theme.text} px-4 py-2 rounded`}
            onClick={() => {
              if (newPlaylistName.trim()) {
                createPlaylist(newPlaylistName.trim());
                setNewPlaylistName('');
              }
            }}
           
          >
            Create Playlist
          </button>
        </div>

        {/* Playlist Display */}
        {playlists.map((playlist) => (
          <div key={playlist.name} className="mb-6">
            <h3 className="text-xl font-bold mb-2">{playlist.name}</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {playlist.movies.length > 0 ? playlist.movies.map((movie, i) => (
                <div
                  key={i}
                  className={`min-w-[140px] h-56 rounded-xl overflow-hidden shadow-md ${theme.card}`}
                >
                  <img
                    src={movie.image.startsWith('/') ? movie.image : '/assets/' + movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )) : <p className="text-gray-400">No movies yet.</p>}
            </div>
          </div>
        ))}
      </section>

      {/* Continue Watching */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <PlayCircle className="text-green-500" size={28} />
          <p className="text-2xl font-bold">Continue Watching</p>
        </div>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
          {continueWatchList.map((item, index) => (
            <div
              key={index}
              className={`relative min-w-[260px] h-40 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform ${theme.card}`}
            >
              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 p-3 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent">
                <p className="text-md font-semibold">{item.title}</p>
                <p className="text-xs text-gray-300">{item.duration}</p>
              </div>
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleDeleteContinue(index)}
                  className="bg-black/60 rounded-full p-1 hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Your Watchlist */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <PlayCircle className="text-yellow-500" size={28} />
          <p className="text-2xl font-bold">Your Watchlist</p>
        </div>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
          {watchlist.map((item, index) => (
            <div
              key={index}
              className={`relative min-w-[140px] h-56 rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform ${theme.card}`}
            >
              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
              <button
                onClick={() => handleDeleteWatchlist(index)}
                className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Series */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Tv className="text-blue-500" size={28} />
          <p className="text-2xl font-bold">Popular Series</p>
        </div>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
          {series.map((item, index) => (
            <div
              key={index}
              className={`min-w-[140px] h-56 rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform ${theme.card}`}
            >
              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Watchlist;
