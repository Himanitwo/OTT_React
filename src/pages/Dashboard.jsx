import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // ✅ Make sure Link is imported

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const watchlistItems = [
  {
    title: "Watchlist",
    description:"Continue...",
    link: "/watchlist",
  },
  // Add more items as needed
];

const Dashboard = () => {
  return (
    <div className="bg-black min-h-screen p-6 text-gray-100 font-['Poppins']">
      {/* Header */}
      <motion.header
        className="flex justify-between items-center border-b border-[#f5e0a9] pb-4 bg-[#00695c] px-4 py-3 rounded-lg"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <div>
          <p className="text-sm text-[#80cbc4]">📞 +91 8********1</p>
          <h1 className="text-xl font-semibold mt-1 text-[#f5e0a9]">
            Subscribe to enjoy Marathi play 🎭
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#e53935] hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-medium shadow">
            Subscribe
          </button>
          <button className="bg-[#f5e0a9] hover:bg-yellow-300 text-black px-4 py-1.5 rounded-md text-sm font-medium shadow">
            Help & Settings
          </button>
        </div>
      </motion.header>

      {/* Profiles */}
      <motion.section
        className="mt-8"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-lg font-semibold mb-3 text-[#f5e0a9]">Profiles</h2>
        <div className="grid grid-cols-3 gap-6 max-w-sm">
          <div className="flex flex-col items-center">
            <img
              src="https://i.imgur.com/3GvwNBf.png"
              className="w-14 h-14 rounded-full border-4 border-[#f5e0a9]"
              alt="himani"
            />
            <p className="mt-2 text-sm font-medium">himani ✅</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-[#f5e0a9] text-black w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold">
              👶
            </div>
            <p className="mt-2 text-sm font-medium">Kids</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-[#004d40] text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold">
              +
            </div>
            <p className="mt-2 text-sm font-medium">Add</p>
          </div>
        </div>
      </motion.section>

      {/* Watchlist */}
      <motion.section
        className="mt-10"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-lg font-semibold mb-3 text-[#f5e0a9]">Watchlist</h2>
        <div className="space-y-4">
          {watchlistItems.map((item, index) => (
            <Link to={item.link} key={index}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-[#1c2c2e] flex items-center gap-4 p-4 rounded-lg shadow cursor-pointer"
              >
                <div className="text-sm text-gray-200">
                  <h3 className="font-semibold text-base text-[#f5e0a9]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[#80cbc4]">{item.description}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>
          {/*history*/}
      {/* Watch History */}
<motion.section
  className="mt-10"
  variants={fadeIn}
  initial="hidden"
  animate="show"
>
  <h2 className="text-lg font-semibold mb-3 text-[#f5e0a9]">Watch History</h2>
  <div className="space-y-4">
    <Link to="/watchhistory">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-[#1c2c2e] flex items-center gap-4 p-4 rounded-lg shadow cursor-pointer"
      >
        <div className="text-sm text-gray-200">
          <h3 className="font-semibold text-base text-[#f5e0a9]">
            Watch History
          </h3>
          <p className="mt-1 text-[#80cbc4]">View what you watched earlier</p>
        </div>
      </motion.div>
    </Link>
  </div>
</motion.section>



      {/* Rented Movies */}
      <motion.section
        className="mt-10"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-lg font-semibold mb-3 text-[#f5e0a9]">Rented Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          <div className="bg-[#1c2c2e] rounded-lg p-3 shadow-inner">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/9/9c/Harishchandrachi_Factory%2C_2009_film_poster.jpg"
              className="w-full h-40 object-cover rounded"
              alt="Harishchandrachi Factory"
            />
            <p className="text-center mt-2 text-sm font-medium text-gray-100">
              Harishchandrachi Factory
            </p>
          </div>
          <div className="bg-[#1c2c2e] rounded-lg p-3 shadow-inner">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/7/75/Natarang_%28film%29.jpg"
              className="w-full h-40 object-cover rounded"
              alt="Natarang"
            />
            <p className="text-center mt-2 text-sm font-medium text-gray-100">
              Natarang
            </p>
          </div>
        </div>
      </motion.section>

      {/* Continue Watching */}
      
       
    </div>
  );
};

export default Dashboard;
