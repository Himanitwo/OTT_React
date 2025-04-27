import './MovieCard.css';

function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <img src={`/assets/${movie.image}`} alt={movie.title} />
      <h3>{movie.title}</h3>
      <p>⭐ {movie.rating}</p>
    </div>
  );
}

export default MovieCard;
