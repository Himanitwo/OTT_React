import MovieCard from './MovieCard';
import './MovieSection.css';

function MovieSection({ title, movies }) {
  return (
    <div className="movie-section">
      <h2>{title}</h2>
      <div className="movie-row">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default MovieSection;
