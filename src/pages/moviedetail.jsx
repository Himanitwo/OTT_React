import { useParams, useNavigate } from 'react-router-dom';
import { newReleases, recommendations, popularMovies } from '../data';
import { motion } from 'framer-motion';
import {
  CalendarDays, Clock, Star, Film, User, Plus, Share2, ThumbsUp, ThumbsDown
} from 'lucide-react';

const allMovies = [...newReleases, ...recommendations, ...popularMovies];

function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = allMovies.find(m => m.id.toString() === id);

  if (!movie) {
    return <div className="text-white p-10">Movie not found</div>;
  }

  const dummyCast = ['Martin Freeman', 'Ian McKellen', 'Richard Armitage', 'Cate Blanchett'];
  const director = 'Peter Jackson';

  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      <motion.div
        className="max-w-6xl w-full mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Oscar nomination badge */}
        <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold inline-flex items-center mb-4">
          OSCAR<span className="text-white">S</span> 3X nominee
        </div>

        {/* Movie title */}
        <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>

        {/* Action buttons row */}
        <div className="flex items-center gap-6 mb-8">
          <div className="text-gray-400 text-sm">HOW do I watch this?</div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-sm hover:text-white transition">
              <Film size={16} /> Trailer
            </button>
            <button className="flex items-center gap-1 text-sm hover:text-white transition">
              <Plus size={16} /> Watchlist
            </button>
            <button className="flex items-center gap-1 text-sm hover:text-white transition">
              <ThumbsUp size={16} /> Like
            </button>
            <button className="flex items-center gap-1 text-sm hover:text-white transition">
              <ThumbsDown size={16} /> Not for me
            </button>
            <button className="flex items-center gap-1 text-sm hover:text-white transition">
              <Share2 size={16} /> Share
            </button>
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

          {/* Info */}
          <div>
            {/* Description */}
            <p className="text-gray-300 mb-6 leading-relaxed">{movie.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Ambitious', 'Exciting', 'Thoughtful', 'Fantasy', 'Adventure'].map((tag) => (
                <span key={tag} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-6">
              <div className="flex items-center gap-1"><CalendarDays size={16} /> {movie.year}</div>
              <div className="flex items-center gap-1"><Clock size={16} /> {movie.duration}</div>
              <div className="flex items-center gap-1"><Star size={16} className="text-yellow-400" /> PG-13</div>
              <div className="flex items-center gap-1"><Film size={16} /> {movie.genre}</div>
            </div>

            {/* Cast */}
            <div className="mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-1"><User size={16} /> Cast</h3>
              <p className="text-gray-400">{dummyCast.join(', ')}</p>
            </div>

            {/* Director */}
            <div className="mb-8">
              <h3 className="text-white font-semibold">Director</h3>
              <p className="text-gray-400">{director}</p>
            </div>

            {/* Primary action button */}
            <motion.button
              onClick={() => navigate(`/watch/${movie.id}`)}
              whileHover={{ scale: 1.05 }}
              className="bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-lg font-semibold text-lg w-full"
            >
              ▶️ Watch Now
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default MovieDetailPage;