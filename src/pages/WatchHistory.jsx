import React, { useState } from 'react';
import { Trash, PlayCircle, Download, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const initialHistory = [
  {
    title: 'Coat',
    episode: 'Movie',
    thumbnail: '/img/Coat.jpg',
    dateWatched: '2024-05-01',
    type: 'movie',
    driveLinks: [
      'https://drive.google.com/file/d/1zwYSVUyQF-Yd5NmEFsS7v1zxia7iTUu5/view'
    ]
  },
  {
    title: 'Waris',
    episode: 'Series',
    thumbnail: '/img/waris.png',
    dateWatched: '2024-04-25',
    type: 'series',
    driveLinks: [
      '1pANXHPRXP59BoZeocNQanCxLI9CSzSYY',
      '1mkBqfJYDrf3xF54qqrSh424rRYJKimIF',
      '1p2e0I5apqlcM9WtRoPYJa2p-sogD9s8r',
      '1J53qypuzKCYqapd4wnxHxnALcb2MZnDw',
      '1-mVSv5gldtakMRvBjPwQ8Aq4VYy6DGWw',
      '1_i68epJrVIUU_z-a7HlterHG8nLEtCia',
      '1rB_ZebFoO6eZP-mSDiT9X8DD2yBzhiTc',
      '1OKQH27iMrp7zjrgozVimtFSK09To64Zi',
      '1jca-Cu5YmmUBY9EW66A68QdMk_K-PzVo',
      '18AGS-o-lm3xomiswOMh6l8-SjFT2BsOx'
    ],
    trailerId: '185xtL50m6gkZiJSEChG6cXIut6vSk1bB'
  },
  {
    title: 'Take It Easy Urvashi',
    episode: 'Movie',
    thumbnail: '/img/urvashi.png',
    dateWatched: '2024-04-20',
    type: 'movie',
    driveLinks: [
      'https://drive.google.com/file/d/1zwYSVUyQF-Yd5NmEFsS7v1zxia7iTUu5/view',
      'https://drive.google.com/file/d/1nf_CdmxO1BSmFvTgtOgw5ZuqOn2-AKkx/view?usp=drivesdk'
    ]
  },
];

const WatchHistory = () => {
  const [historyItems, setHistoryItems] = useState(initialHistory);
  const navigate = useNavigate();

  const handleDelete = (indexToRemove) => {
    setHistoryItems((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const clearAll = () => {
    setHistoryItems([]);
  };

  const handlePlay = (item) => {
    if (item.type === 'series') {
      navigate('/series/waris', { 
        state: { 
          seriesData: {
            title: item.title,
            description: "A gripping drama series that follows the lives of a family entangled in power struggles, love, and betrayal.",
            genre: "Drama, Family",
            year: "2024",
            episodes: item.driveLinks.map((id, index) => ({
              id: index + 1,
              title: `Episode ${index + 1}`,
              driveId: id
            })),
            trailerId: item.trailerId,
            thumbnail: item.thumbnail
          }
        } 
      });
    } else {
      navigate(`/movie/${item.title.toLowerCase().replace(/\s+/g, '-')}`, {
        state: {
          movieData: {
            title: item.title,
            description: item.title === 'Take It Easy Urvashi' 
              ? "A romantic comedy about unexpected relationships and life's surprises."
              : "An intriguing story about life's challenges and triumphs.",
            genre: item.title === 'Take It Easy Urvashi' ? "Romance, Comedy" : "Drama",
            year: "2024",
            driveLinks: item.driveLinks,
            thumbnail: item.thumbnail
          }
        }
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-4 lg:px-20 py-16 font-sans overflow-hidden">
      {/* Blurred Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute w-96 h-96 bg-teal-900 opacity-10 rounded-full blur-3xl -top-32 -left-32" />
        <div className="absolute w-72 h-72 bg-indigo-700 opacity-10 rounded-full blur-3xl bottom-10 right-10" />
      </div>

      <div className="flex items-center gap-3 mb-7">
        <History className="text-blue-400" size={32} />
        <h2 className="text-4xl font-bold tracking-tight">Watch History</h2>
      </div>

      {historyItems.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={clearAll}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Clear All
          </button>
        </div>
      )}

      {historyItems.length === 0 ? (
        <p className="text-gray-400 text-center text-lg mt-20">
          No watch history available. Start watching something!
        </p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {historyItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-56 h-72 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-lg hover:scale-105 transition-transform hover:shadow-xl group"
            >
              {/* Background Image */}
              <img
                src={item.thumbnail}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-black/30 text-white flex flex-col justify-end p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.episode}</p>
                <p className="text-xs text-gray-300">Watched on: {item.dateWatched}</p>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => handlePlay(item)}
                    className="flex items-center gap-1 text-sm bg-teal-600/70 hover:bg-teal-700 text-white px-2 py-1 rounded"
                  >
                    <PlayCircle className="text-white-500" size={16} /> Play
                  </button>
                  <button className="flex items-center gap-1 text-sm bg-green-600 hover:bg-blue-700 text-white px-2 py-1 rounded">
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-1.5 bg-red-600 hover:bg-red-700 rounded"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;