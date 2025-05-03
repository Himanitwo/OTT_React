import React, { useEffect, useState } from 'react';
import './SearchableList.css';
import { FaSearch } from 'react-icons/fa';

export default function SearchableAPIList() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('All');
  const [genre, setGenre] = useState('');

  const genreList = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];

  const mapCategoryToType = (cat) => {
    if (cat === 'Movies') return 'movie';
    if (cat === 'TV Shows') return 'series';
    return ''; // All or Genre
  };

  const fetchMovies = (searchTerm, categoryFilter, selectedGenre) => {
    setLoading(true);
    const apiKey = import.meta.env.VITE_OMDB_API_KEY;
    const typeParam = mapCategoryToType(categoryFilter);
    let url = `https://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`;
    if (typeParam) {
      url += `&type=${typeParam}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.Search) {
          let results = data.Search;

          if (selectedGenre) {
            const detailedFetches = results.map((movie) =>
              fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`).then((res) => res.json())
            );

            Promise.all(detailedFetches).then((detailedResults) => {
              const filtered = detailedResults.filter((movie) =>
                movie.Genre && movie.Genre.toLowerCase().includes(selectedGenre.toLowerCase())
              );
              setItems(filtered);
              setLoading(false);
            });
          } else {
            setItems(results);
            setLoading(false);
          }
        } else {
          setItems([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching movies:', err);
        setLoading(false);
      });
  };

  // Fetch movies when query, category, or genre changes
  useEffect(() => {
    if (query.length > 0) {
      const debounce = setTimeout(() => {
        fetchMovies(query, category, genre);
      }, 500);

      return () => clearTimeout(debounce);
    } else {
      setItems([]); // Clear results if query is empty
    }
  }, [query, category, genre]);

  const handleTabClick = (tab) => {
    setCategory(tab);
    setGenre(''); // Reset genre when switching tabs
  };

  const handleGenreSelect = (e) => {
    setGenre(e.target.value);
    setCategory('Genre');
  };

  return (
    <div className="container">
      <form className="search-form" onSubmit={(e) => e.preventDefault()}>
        <div className='search-wrapper'>
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search movies or shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        </div>
      </form>

      {/* Category Tabs */}
      <div className="category-tabs">
        {['All', 'TV Shows', 'Movies'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${category === tab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}

        {/* Genre Dropdown */}
        <select className="genre-dropdown" value={genre} onChange={handleGenreSelect}>
          <option value="">Genre</option>
          {genreList.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="no-results">Loading...</p>
      ) : (
        <ul className="item-list">
          {items.length > 0 ? (
            items.map((movie, index) => (
              <li key={index} className="item">
                <img
                  src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/160x240?text=No+Image'}
                  alt={movie.Title}
                />
                <div className="item-title">{movie.Title}</div>
              </li>
            ))
          ) : (
            <li className="no-results">No movies found.</li>
          )}
        </ul>
      )}
    </div>
  );
}
