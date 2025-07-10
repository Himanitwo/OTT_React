import HeroBanner from './HeroBanner';
import MovieSection from './MovieSection';
import GenreSection from './GenreSection';
import SeriesSection from './SeriesSection';
import { newReleases, recommendations, popularMovies, seriesList } from '../../data';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../useTheme';

function Homepage() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // const handleNavigate = () => {
  //   navigate('/badges');
  // };

  return (
    <div className={`min-h-screen pt-16 ${theme.background}`}>
      {/* <button 
        onClick={handleNavigate}
        className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md font-bold transition ${theme.button} ${theme.buttonText}`}
      >
        Your Badges
      </button> */}

      <HeroBanner />
      <GenreSection />
      <MovieSection title="New Releases" movies={newReleases} />
      <MovieSection title="Recommendation" movies={recommendations} />
      <MovieSection title="Popular In Your Region" movies={popularMovies} />
      <SeriesSection title="Featured Series" series={seriesList} />
    </div>
  );
}

export default Homepage;
