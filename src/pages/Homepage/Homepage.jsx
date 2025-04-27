import HeroBanner from './HeroBanner';
import MovieSection from './MovieSection';

import { newReleases, recommendations, popularMovies } from '../../data'; // TWO dots here 
// import the data

// import '../../App.css'; // import the global styles

function Homepage() {
  return(
    <>
    
    <div className='bg-black text-white min-h-screen'>
      <HeroBanner />
      <MovieSection title="New Releases" movies={newReleases} />
      <MovieSection title="Recommendation" movies={recommendations} />
      <MovieSection title="Popular In Your Region" movies={popularMovies} />
    </div>


    </>
  );
}

export default Homepage
