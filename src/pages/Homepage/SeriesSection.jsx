import { Link } from 'react-router-dom';
import './SeriesSection.css';

function SeriesSection({ title, series }) {
  return (
    <div className="series-section">
      <h2 className="section-title">{title}</h2>
      <div className="series-grid">
        {series.map(item => (
          <div className="series-card" key={item.id}>
            <Link to={`/series/${item.id}`}>
              <img src={`/assets/${item.image}`} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.genre} • {item.year}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SeriesSection;
