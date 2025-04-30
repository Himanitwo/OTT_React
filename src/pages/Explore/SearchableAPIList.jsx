import React, { useEffect, useState } from 'react';
import './SearchableList.css';
import { FaSearch } from 'react-icons/fa';

export default function SearchableAPIList() {
    const [query, setQuery] = useState('');  // Default search term
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMovies = (searchTerm) => {
        setLoading(true);
        const apiKey = import.meta.env.VITE_OMDB_API_KEY;
        fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.Search) {
                    setItems(data.Search); // keep full movie objects
                } else {
                    setItems([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching movies:', err);
                setLoading(false);
            });
    };

    // Fetch movies on initial load
    useEffect(() => {
        fetchMovies(query);
    }, []);

    // Re-fetch movies when user types a new search
    useEffect(() => {
        if (query.length > 0) {
            const delayDebounce = setTimeout(() => {
                fetchMovies(query);
            }, 500); // debounce

            return () => clearTimeout(delayDebounce);
        }
    }, [query]);

    return (
        <div className="container">
            <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input"
                />
            </form>

            {loading ? (
                <p className="no-results">Loading...</p>
            ) : (
                <ul className="item-list">
                    {items.length > 0 ? (
                        items.map((movie, index) => (
                            <li key={index} className="item">
                                <img src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/160x240?text=No+Image'} alt={movie.Title} />
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
