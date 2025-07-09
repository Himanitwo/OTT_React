import MovieCard from './MovieCard';
import './MovieSection.css';
import { useTheme } from '../useTheme';

function MovieSection({ title, movies }) {
  const { theme } = useTheme();

  return (
    <div className={`movie-section `}>
      <p className={`text-2xl font-bold mb-4 ${theme.sectionTitle}`}>
        {title}
      </p>
      <div className="movie-row">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default MovieSection;
