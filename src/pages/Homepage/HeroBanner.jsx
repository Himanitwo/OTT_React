import { useState } from 'react';
import './HeroBanner.css';

import { FaHeart, FaRegHeart, FaPlus, FaCheck } from 'react-icons/fa';

function HeroBanner() {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  return (
    <div className="hero-banner relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
      <img src="assets/avengers-banner.jpg" alt="Avengers Endgame" />
      <div className="overlay" />
      <div className="banner-content">
        <h1>Avengers: Endgame</h1>
        <p>The epic conclusion to the Infinity Saga...</p>

        <div className="flex gap-4">
          <button className="primary-button">Play Now</button>

          <button
            className={`secondary-button ${liked ? 'active' : ''}`}
            onClick={() => setLiked(!liked)}
          >
            {liked ? <FaHeart className="icon" /> : <FaRegHeart className="icon" />} 
            <span>{liked ? 'Liked' : 'Like'}</span>
          </button>

          <button
            className={`secondary-button ${added ? 'active' : ''}`}
            onClick={() => setAdded(!added)}
          >
            {added ? <FaCheck className="icon" /> : <FaPlus className="icon" />}
            <span>{added ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
