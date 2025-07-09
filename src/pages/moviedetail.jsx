import { useParams, useNavigate } from 'react-router-dom';
import { newReleases, recommendations, popularMovies } from '../data';
import { motion } from 'framer-motion';
import {
  CalendarDays, Clock, Star, Film, User, Plus, Share2, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { useTheme } from './useTheme';
import { usePlaylist } from './PlaylistContext';

const allMovies = [...newReleases, ...recommendations, ...popularMovies];

function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { playlists, addToPlaylist } = usePlaylist();

  const movie = allMovies.find(m => m.id.toString() === id);

  if (!movie) {
    return <p className={`p-10 ${theme.text}`}>Movie not found</p>;
  }

  const dummyCast = ['Martin Freeman', 'Ian McKellen', 'Richard Armitage', 'Cate Blanchett'];
  const director = 'Peter Jackson';

  return (
    <div className={`min-h-screen px-6 py-12 ${theme.background}`}>
      <motion.div
        className="max-w-6xl w-full mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold inline-flex items-center mb-4">
          OSCAR<span className={`${theme.text}`}></span> 3X nominee
        </p>

        <p className={`text-4xl font-bold mb-2 ${theme.text}`}>{movie.title}</p>

        {/* Action Buttons */}
        <div className="flex items-center gap-6 mb-8">
          <p className="text-gray-400 text-sm">HOW do I watch this?</p>
          <div className="flex items-center gap-4">
            {[
              { icon: <Film size={16} />, label: 'Trailer' },
              { icon: <Plus size={16} />, label: 'Watchlist' },
              { icon: <ThumbsUp size={16} />, label: 'Like' },
              { icon: <ThumbsDown size={16} />, label: 'Not for me' },
              { icon: <Share2 size={16} />, label: 'Share' },
            ].map((btn, idx) => (
              <button key={idx} className={`flex items-center gap-1 text-sm hover:text-white transition ${theme.text}`}>
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Poster */}
          <motion.img
            src={movie.image.startsWith('/') ? movie.image : '/assets/' + movie.image}
            alt={movie.title}
            className="rounded-xl w-full object-cover shadow-lg max-h-[500px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Info Section */}
          <div>
            <p className={`${theme.text} mb-6 leading-relaxed`}>{movie.description}</p>

            <div className={`flex flex-wrap gap-2 mb-6 ${theme.text} `}>
              {['Ambitious', 'Exciting', 'Thoughtful', 'Fantasy', 'Adventure'].map(tag => (
                <span key={tag} className={`px-3 py-1 rounded-full text-sm ${theme.button}`}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-6">
              <p className={`flex items-center gap-1 ${theme.text}`}><CalendarDays size={16} /> {movie.year}</p>
              <p className={`flex items-center gap-1 ${theme.text}`}><Clock size={16} /> {movie.duration}</p>
              <p className={`flex items-center gap-1 ${theme.text}`}><Star size={16} className="text-yellow-400" /> PG-13</p>
              <p className={`flex items-center gap-1 ${theme.text}`}><Film size={16} /> {movie.genre}</p>
            </div>

            {/* Cast */}
            <div className="mb-4">
              <p className={`font-semibold flex items-center gap-2 mb-1 ${theme.text}`}>
                <User size={16} /> Cast
              </p>
              <p className={`${theme.text}`}>{dummyCast.join(', ')}</p>
            </div>

            {/* Director */}
            <div className="mb-8">
              <p className={`font-semibold ${theme.text}`}>Director</p>
              <p className={`font-semibold ${theme.sectionTitle}`}>{director}</p>
            </div>

            {/* Watch Now */}
            <motion.button
              onClick={() => navigate(`/watch/${movie.id}`)}
              whileHover={{ scale: 1.05 }}
              className={`${theme.button} ${theme.text} transition px-6 py-3 rounded-lg font-semibold text-lg w-full`}
            > ▶️ Watch Now
            </motion.button>

            {/* Playlist Dropdown */}
            {playlists.length > 0 && (
              <div className="mt-4 space-y-2">
                <label className="block text-sm text-gray-400">Add to Playlist:</label>
                <select
                  className={`px-4 py-2 rounded w-full ${theme.card} ${theme.text}`}
                  onChange={(e) => {
                    if (e.target.value) {
                      addToPlaylist(e.target.value, movie);
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">Select Playlist</option>
                  {playlists.map((p) => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default MovieDetailPage;
