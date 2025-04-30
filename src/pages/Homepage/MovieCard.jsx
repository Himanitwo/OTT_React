import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './MovieCard.css';

function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`}>
        <img src={`/assets/${movie.image}`} alt={movie.title} />
        <h3>{movie.title}</h3>
        <p>⭐ {movie.rating}</p>
      </Link>
    </div>
  );
}

export default MovieCard;
