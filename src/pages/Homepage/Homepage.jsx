import HeroBanner from './HeroBanner';
import MovieSection from './MovieSection';
import GenreSection from './GenreSection';
import SeriesSection from './SeriesSection';
import { newReleases, recommendations, popularMovies, seriesList } from '../../data';
import { useNavigate } from 'react-router-dom';
import './Homepage.css'; // import the local styles

// import '../../App.css'; // import the global styles

function Homepage() {

  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/badges');
  };

  return(
    <>
      <div className="homepage-container">
        <button className="top-right-button" onClick={handleNavigate}>
          Your Badges
        </button>

        <HeroBanner />
        <GenreSection />
        <MovieSection title="New Releases" movies={newReleases} />
        <MovieSection title="Recommendation" movies={recommendations} />
        <MovieSection title="Popular In Your Region" movies={popularMovies} />
        <SeriesSection title="Featured Series" series={seriesList} />
      </div>
    </>
  );
}

export default Homepage
