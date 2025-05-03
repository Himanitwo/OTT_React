// CategoryNav.jsx
import React, { useState } from 'react';
import './CategoryNav.css';

export default function CategoryNav({ onCategoryChange }) {
  const [activeTab, setActiveTab] = useState('All');
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  const categories = ['All', 'TV Shows', 'Movies', 'Genre'];
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];

  const handleTabClick = (category) => {
    setActiveTab(category);
    setShowGenreDropdown(category === 'Genre');
    if (category !== 'Genre') {
      onCategoryChange(category);
    }
  };

  const handleGenreSelect = (genre) => {
    setShowGenreDropdown(false);
    setActiveTab(genre);
    onCategoryChange(genre);
  };

  return (
    <nav className="category-nav">
      <ul className="category-tabs">
        {categories.map((category, index) => (
          <li
            key={index}
            className={`category-tab ${activeTab === category ? 'active' : ''}`}
            onClick={() => handleTabClick(category)}
          >
            {category}
            {category === 'Genre' && <span className="dropdown-arrow">v</span>}
          </li>
        ))}
      </ul>

      {showGenreDropdown && (
        <ul className="genre-dropdown">
          {genres.map((genre, index) => (
            <li key={index} className="genre-item" onClick={() => handleGenreSelect(genre)}>
              {genre}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
