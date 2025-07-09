import { useTheme } from '../useTheme';

function GenreSection() {
  const { theme } = useTheme();
  const genres = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy",
    "Horror", "Romance", "Sci-Fi", "Thriller", "Animation"
  ];

  return (
    <div className="py-8 px-4">
      <p className={`text-2xl font-bold mb-4 ${theme.sectionTitle}`}>
        Browse by Genre
      </p>
      <div className="flex flex-wrap gap-4">
        {genres.map((genre, index) => (
          <button
            key={index}
            className={`px-6 py-2 rounded-full transition ${theme.button} ${theme.text}`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GenreSection;
// Force Git to see a change
