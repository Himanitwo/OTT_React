import HeroBanner from './HeroBanner';
import MovieSection from './MovieSection';
import GenreSection from './GenreSection';
import SeriesSection from './SeriesSection';
import { newReleases, recommendations, popularMovies, seriesList } from '../../data';
 // TWO dots here 
// import the data

// import '../../App.css'; // import the global styles

function Homepage() {
  return(
    <>
    
    <div className='bg-black text-white min-h-screen'>  
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
