import './HeroBanner.css';

function HeroBanner() {
  return (
    <div className="hero-banner relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
      <img src="assets/avengers-banner.jpg" alt="Avengers Endgame" />
      <div className="overlay" />
        <div className="banner-content">
        <h1>Avengers: Endgame</h1>
        <p>The epic conclusion to the Infinity Saga...</p>
        <button>Play Now</button>

      </div>
    </div>
  );
}

export default HeroBanner;
