import { Link } from 'react-router-dom';
import './SeriesSection.css';
import { useTheme } from '../useTheme';

function SeriesSection({ title, series }) {
  const { theme } = useTheme();

  return (
    <div className={`series-section ${theme.text}`}>
      <p className={`section-title  text-2xl font-bold ${theme.sectionTitle}`}>{title}</p>
      <div className="series-grid">
        {series.map(item => (
          <div className={`series-card ${theme.card}`} key={item.id}>
            <Link to={`/series/${item.id}`}>
              <img src={`/assets/${item.image}`} alt={item.title} />
              <p className={`${theme.text}`}>{item.title}</p>
              <p className={`${theme.text}`}>{item.genre} • {item.year}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SeriesSection;
