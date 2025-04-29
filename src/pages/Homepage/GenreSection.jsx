// src/components/GenreSection.jsx

function GenreSection() {
    const genres = [
      "Action", "Adventure", "Comedy", "Drama", "Fantasy",
      "Horror", "Romance", "Sci-Fi", "Thriller", "Animation"
    ];
  
    return (
      <div className="py-8 px-4">
        <h2 className="text-2xl font-bold mb-4">Browse by Genre</h2>
        <div className="flex flex-wrap gap-4">
          {genres.map((genre, index) => (
            <button
              key={index}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition"
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  export default GenreSection;
  