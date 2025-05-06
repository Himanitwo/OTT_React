import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; // ✅ Added useNavigate

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const watchlistItems = [
  {
    title: "Watchlist",
    description: "Continue...",
    link: "/watchlist",
  },
  // Add more items as needed
];

const Dashboard = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  // Handler for the Subscribe button click
  const handleSubscribeClick = () => {
    navigate("/subscription");
  };

  return (
    <div className="bg-black min-h-screen p-6 text-gray-100 font-['Poppins']">
      {/* Header */}
      <motion.header
        className="flex justify-between items-center border border-[#f5e0a9]/30 bg-[#00695c]/40 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg shadow-[#f5e0a9]/10"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <div>
          <p className="text-sm text-[#80cbc4]">📞 +91 8********1</p>
          <h1 className="text-xl font-semibold mt-1 text-[#f5e0a9] drop-shadow-sm">
            Subscribe to enjoy Marathi play 🎭
          </h1>
        </div>
        <div className="flex gap-3">
          {/* Subscribe Button with Navigation */}
          <button
            onClick={handleSubscribeClick}
            className="bg-[#e53935]/90 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-md backdrop-blur-sm transition"
          >
            Subscribe
          </button>
          <button className="bg-[#f5e0a9]/90 hover:bg-yellow-300 text-black px-4 py-1.5 rounded-md text-sm font-medium shadow-md backdrop-blur-sm transition">
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

        <div className="max-w-sm bg-[#ffffff1a] backdrop-blur-md rounded-xl p-6 shadow-lg border border-[#f5e0a9]/30">
          <div className="grid grid-cols-3 gap-6">
            {/* Himani Profile */}
            <div className="flex flex-col items-center">
              <img
                src="https://i.imgur.com/3GvwNBf.png"
                className="w-14 h-14 rounded-full border-4 border-[#f5e0a9] shadow-md"
                alt="himani"
              />
              <p className="mt-2 text-sm font-medium text-[#f5e0a9]">himani ✅</p>
            </div>

            {/* Kids Profile */}
            <div className="flex flex-col items-center">
              <div className="bg-[#f5e0a9]/90 text-black w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shadow-md">
                👶
              </div>
              <p className="mt-2 text-sm font-medium text-[#f5e0a9]">Kids</p>
            </div>

            {/* Add Profile */}
            <div className="flex flex-col items-center">
              <div className="bg-[#004d40]/90 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                +
              </div>
              <p className="mt-2 text-sm font-medium text-[#f5e0a9]">Add</p>
            </div>
          </div>
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
          {/* Movie Card 1 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-[#ffffff0f] backdrop-blur-md border border-[#f5e0a9]/30 rounded-xl p-3 shadow-md transition-all duration-300"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/en/9/9c/Harishchandrachi_Factory%2C_2009_film_poster.jpg"
              className="w-full h-40 object-cover rounded-lg shadow-sm"
              alt="Harishchandrachi Factory"
            />
            <p className="text-center mt-2 text-sm font-semibold text-[#f5e0a9]">
              Harishchandrachi Factory
            </p>
          </motion.div>

          {/* Movie Card 2 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-[#ffffff0f] backdrop-blur-md border border-[#f5e0a9]/30 rounded-xl p-3 shadow-md transition-all duration-300"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/en/7/75/Natarang_%28film%29.jpg"
              className="w-full h-40 object-cover rounded-lg shadow-sm"
              alt="Natarang"
            />
            <p className="text-center mt-2 text-sm font-semibold text-[#f5e0a9]">
              Natarang
            </p>
          </motion.div>
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
    </div>
  );
};

export default Dashboard;
