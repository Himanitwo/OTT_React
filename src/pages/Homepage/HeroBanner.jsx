import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHeart,
  FaRegHeart,
  FaPlus,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { useTheme } from '../useTheme';

const banners = [
  {
    id: 1,
    title: 'Avengers: Endgame',
    description: 'The epic conclusion to the Infinity Saga...',
    image: 'assets/avengers-banner.jpg',
  },
  {
    id: 2,
    title: 'Interstellar',
    description: 'A journey beyond the stars to save humanity...',
    image: 'assets/interstellar-banner.jpg',
  },
  {
    id: 3,
    title: 'Inception',
    description: 'Your mind is the scene of the crime...',
    image: 'assets/inception-banner.jpg',
  },
];

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

function HeroBanner() {
  const { theme } = useTheme();
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const paginate = (newDirection) => {
    setCurrentIndex(([prevIndex]) => {
      const newIndex = (prevIndex + newDirection + banners.length) % banners.length;
      return [newIndex, newDirection];
    });
    resetStates();
  };

  const resetStates = () => {
    setLiked(false);
    setAdded(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-xl mb-8">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentBanner.id}
          src={currentBanner.image}
          alt={currentBanner.title}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) paginate(1);
            else if (swipe > swipeConfidenceThreshold) paginate(-1);
          }}
          className="absolute w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />

      {/* Content */}
      <div className="absolute bottom-8 left-8 z-20 max-w-xl">
        <h1 className={`text-3xl md:text-4xl font-bold ${theme.bannerContent}`}>
          {currentBanner.title}
        </h1>
        <p className={`mt-2 ${theme.bannerContent}`}>
          {currentBanner.description}
        </p>

        <div className="flex gap-4 mt-4 flex-wrap">
          <button className={`px-6 py-2 rounded-lg font-medium backdrop-blur-md ${theme.button}`}>
            Play Now
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.button} backdrop-blur-md`}
            onClick={() => setLiked(!liked)}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
            <span>{liked ? 'Liked' : 'Like'}</span>
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md ${theme.button}`}
            onClick={() => setAdded(!added)}
          >
            {added ? <FaCheck /> : <FaPlus />}
            <span>{added ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => paginate(-1)}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition z-20"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition z-20"
      >
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex([idx, idx > currentIndex ? 1 : -1])}
            className={`w-3 h-3 rounded-full transition ${
              idx === currentIndex ? 'bg-yellow-400' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroBanner;
