import { useParams, useNavigate } from 'react-router-dom'; // ✅ useNavigate added
import { newReleases, recommendations, popularMovies } from '../data';
import { motion } from 'framer-motion';
import {
  CalendarDays, Clock, Star, Film, User, Plus
} from 'lucide-react';

const allMovies = [...newReleases, ...recommendations, ...popularMovies];

function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ defined here
  const movie = allMovies.find(m => m.id.toString() === id);

  if (!movie) {
    return <div className="text-white p-10">Movie not found</div>;
  }

  const dummyCast = ['Emma Stone', 'Ryan Gosling', 'Idris Elba', 'Zoe Saldana'];
  const director = 'Christopher Nolan';

  return (
    <div className="bg-black text-white min-h-screen flex justify-center items-center px-6 py-12">
      <motion.div
        className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
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
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-4">
            <div className="flex items-center gap-1"><CalendarDays size={16} /> {movie.year}</div>
            <div className="flex items-center gap-1"><Clock size={16} /> {movie.duration}</div>
            <div className="flex items-center gap-1"><Star size={16} className="text-yellow-400" /> PG-13</div>
            <div className="flex items-center gap-1"><Film size={16} /> {movie.genre}</div>
          </div>

          {/* Description */}
          <p className="text-gray-300 mb-6 leading-relaxed">{movie.description}</p>

          {/* Cast */}
          <div className="mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-1"><User size={16} /> Cast</h3>
            <p className="text-gray-400">{dummyCast.join(', ')}</p>
          </div>

          {/* Director */}
          <div className="mb-6">
            <h3 className="text-white font-semibold">Director</h3>
            <p className="text-gray-400">{director}</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <motion.button
              onClick={() => navigate(`/watch/${movie.id}`)} // ✅ now works
              whileHover={{ scale: 1.05 }}
              className="bg-pink-600 hover:bg-pink-700 transition px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              ▶️ Watch Now
            </motion.button>
            <button className="bg-gray-800 hover:bg-gray-700 transition px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
              <Plus size={16} /> Add to Watchlist
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default MovieDetailPage;
