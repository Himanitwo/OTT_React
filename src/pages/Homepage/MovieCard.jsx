import { Link } from 'react-router-dom';
import { useTheme } from '../useTheme';
import './MovieCard.css';

function MovieCard({ movie }) {
  const { theme } = useTheme();

  return (
    <div className={`movie-card ${theme.card}`}>
      <Link to={`/moviedetail/${movie.id}`}>
        <img 
          src={`/assets/${movie.image}`} 
          alt={movie.title} 
          className="w-full h-64 object-cover"
        />
        <div className="p-3">
          <p className={`font-medium ${theme.text}`}>{movie.title}</p>
          <p className={`mt-1 font-bold ${theme.rating}`}>⭐ {movie.rating}</p>
        </div>
      </Link>
    </div>
  );
}

export default MovieCard;
