import './HeroBanner.css';

function HeroBanner() {
  return (
    <div className="hero-banner">
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
