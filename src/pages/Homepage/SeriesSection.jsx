import { Link } from 'react-router-dom';

function SeriesSection({ title, series }) {
  return (
    <div className="px-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {series.map(item => (
          <Link to={`/series/${item.id}`} key={item.id}>
            <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
              <img src={item.image} alt={item.title} className="w-full h-60 object-cover" />
              <div className="p-2">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.genre} • {item.year}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SeriesSection;
