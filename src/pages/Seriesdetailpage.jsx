import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Star, Film, ChevronDown, ChevronUp } from "lucide-react";
import { seriesList } from "../data"; // this should contain seasons & episodes

function SeriesDetailPage() {
  const { id } = useParams();
  const series = seriesList.find(s => s.id === id); // `id` is a string

  const [selectedSeason, setSelectedSeason] = useState(0);
  const [expandedEpisodes, setExpandedEpisodes] = useState({});

  if (!series) {
    return <div className="text-white p-10">Series not found</div>;
  }

  const toggleEpisode = (index) => {
    setExpandedEpisodes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-10">
          <img src={series.image} alt={series.title} className="rounded-xl w-full max-h-[400px] object-cover" />
          <div>
            <h1 className="text-4xl font-bold mb-4">{series.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-4">
              <div className="flex items-center gap-1"><CalendarDays size={16} /> {series.year}</div>
              <div className="flex items-center gap-1"><Star size={16} className="text-yellow-400" /> {series.rating}</div>
              <div className="flex items-center gap-1"><Film size={16} /> {series.genre}</div>
            </div>
            <p className="text-gray-300 mb-4">{series.description}</p>
            <p className="text-gray-400 mb-2"><strong>Director:</strong> {series.director}</p>
            <p className="text-gray-400"><strong>Cast:</strong> {series.cast.join(', ')}</p>
          </div>
        </div>

        {/* Season Selector */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Seasons</h2>
          <div className="flex gap-2 flex-wrap">
            {series.seasons.map((season, index) => (
              <button
                key={index}
                onClick={() => setSelectedSeason(index)}
                className={`px-4 py-2 rounded-lg ${selectedSeason === index ? 'bg-green-600' : 'bg-gray-700'} transition`}
              >
                Season {season.number}
              </button>
            ))}
          </div>
        </div>

        {/* Episode List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Episodes</h2>
          {series.seasons[selectedSeason]?.episodes.map((ep, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-800 rounded-lg p-4 mb-3 cursor-pointer"
              onClick={() => toggleEpisode(i)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold">{ep.title}</h4>
                  <p className="text-sm text-gray-400">{ep.duration}</p>
                </div>
                {expandedEpisodes[i] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedEpisodes[i] && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-gray-300"
                >
                  <img src={ep.thumb} alt="thumb" className="w-full rounded mt-2 max-h-[200px] object-cover" />
                  <p className="mt-2">{ep.description}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default SeriesDetailPage;
