import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Settings, HelpCircle, PlusCircle, User } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const watchlistItems = [
  {
    title: "Watchlist",
    description: "Continue watching your favorites",
    link: "/watchlist",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSubscribeClick = () => navigate("/subscription");
  const handleSettingsClick = () => navigate("/setting");

  return (
    <div className="bg-gradient-to-b from-black via-[#001510] to-black min-h-screen p-6 text-gray-100 font-['Poppins']">
      {/* Header */}
      <motion.header
        className="flex justify-between items-center border border-[#f5e0a9]/30 bg-[#00695c]/30 backdrop-blur-xl px-8 py-5 rounded-3xl shadow-2xl shadow-[#f5e0a9]/10"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <div>
          <p className="text-xs text-[#80cbc4] tracking-wide">📞 +91 8********1</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1 text-[#f5e0a9] drop-shadow tracking-tight">
            Subscribe to enjoy Marathi play 🎭
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSubscribeClick}
            className="bg-gradient-to-r from-red-500 via-red-400 to-red-500 hover:scale-105 hover:brightness-110 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md flex items-center gap-2 transition-all duration-200"
          >
            <PlusCircle size={16} /> Subscribe
          </button>
          <button
            onClick={handleSettingsClick}
            className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 hover:scale-105 hover:brightness-110 text-black px-5 py-2.5 rounded-xl text-sm font-medium shadow-md flex items-center gap-2 transition-all duration-200"
          >
            <Settings size={16} /> Settings
          </button>
        </div>
      </motion.header>
      {/* Referral Status */}
<motion.section
  className="mt-12 border-t border-[#f5e0a9]/20 pt-8"
  variants={fadeIn}
  initial="hidden"
  animate="show"
>
  <h2 className="text-2xl font-semibold mb-6 text-[#f5e0a9] tracking-wide">
    Referral Status
  </h2>
  <motion.div
    whileHover={{ scale: 1.04 }}
    className="bg-[#1c2c2e]/80 border border-[#f5e0a9]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl shadow-md hover:shadow-[#f5e0a9]/20 transition-all"
  >
    <div>
      <h3 className="font-semibold text-base text-[#f5e0a9]">Earn Rewards</h3>
      <p className="mt-1 text-[#80cbc4] text-sm">
        Invite your friends and get free access!
      </p>
    </div>
    <Link to="/referral">
      <button className="mt-2 sm:mt-0 bg-gradient-to-r from-green-400 via-teal-400 to-green-400 hover:scale-105 hover:brightness-110 text-black px-5 py-2.5 rounded-xl text-sm font-medium shadow-md flex items-center gap-2 transition-all duration-200">
        <PlusCircle size={16} /> Refer Now
      </button>
    </Link>
  </motion.div>
</motion.section>


      {/* Profiles */}
      <motion.section
        className="mt-12 border-t border-[#f5e0a9]/20 pt-8"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-2xl font-semibold mb-6 text-[#f5e0a9] tracking-wide">Profiles</h2>
        <div className="max-w-md mx-auto grid grid-cols-3 gap-6">
          {[
            { name: "himani ✅", img: "https://i.imgur.com/3GvwNBf.png" },
            { name: "Kids", emoji: "👶" },
            { name: "Add", icon: <PlusCircle size={32} /> },
          ].map((profile, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.12, rotate: 1 }}
              className="flex flex-col items-center cursor-pointer transition-all"
            >
              {profile.img ? (
                <img
                  src={profile.img}
                  className="w-20 h-20 rounded-full border-4 border-[#f5e0a9] shadow-lg hover:shadow-[#f5e0a9]/40 transition-all"
                  alt={profile.name}
                />
              ) : (
                <div className="bg-[#f5e0a9] text-black w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  {profile.emoji || profile.icon}
                </div>
              )}
              <p className="mt-2 text-sm font-medium text-[#f5e0a9]">{profile.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Rented Movies */}
      <motion.section
        className="mt-12 border-t border-[#f5e0a9]/20 pt-8"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-2xl font-semibold mb-6 text-[#f5e0a9] tracking-wide">Rented Movies</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[
            {
              title: "Harishchandrachi Factory",
              img: "https://upload.wikimedia.org/wikipedia/en/9/9c/Harishchandrachi_Factory%2C_2009_film_poster.jpg",
            },
            {
              title: "Natarang",
              img: "https://upload.wikimedia.org/wikipedia/en/7/75/Natarang_%28film%29.jpg",
            },
          ].map((movie, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.08 }}
              className="relative bg-[#ffffff0f] backdrop-blur-md border border-[#f5e0a9]/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-[#f5e0a9]/20 transition-all duration-300 group"
            >
              <img
                src={movie.img}
                className="w-full h-48 object-cover group-hover:brightness-75 transition-all"
                alt={movie.title}
              />
              <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-all bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                <p className="text-center text-sm font-semibold text-[#f5e0a9] pb-3 px-2">
                  {movie.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Watchlist */}
      <motion.section
        className="mt-12 border-t border-[#f5e0a9]/20 pt-8"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-2xl font-semibold mb-6 text-[#f5e0a9] tracking-wide">Watchlist</h2>
        <div className="space-y-4">
          {watchlistItems.map((item, index) => (
            <Link to={item.link} key={index}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="bg-[#1c2c2e]/80 border border-[#f5e0a9]/15 flex items-center gap-4 p-5 rounded-xl shadow-md hover:shadow-[#f5e0a9]/20 transition-all cursor-pointer"
              >
                <User size={24} className="text-[#80cbc4]" />
                <div>
                  <h3 className="font-semibold text-base text-[#f5e0a9]">{item.title}</h3>
                  <p className="mt-1 text-[#80cbc4] text-sm">{item.description}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Watch History */}
      <motion.section
        className="mt-12 border-t border-[#f5e0a9]/20 pt-8"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-2xl font-semibold mb-6 text-[#f5e0a9] tracking-wide">Watch History</h2>
        <Link to="/watchhistory">
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="bg-[#1c2c2e]/80 border border-[#f5e0a9]/15 flex items-center gap-4 p-5 rounded-xl shadow-md hover:shadow-[#f5e0a9]/20 transition-all cursor-pointer"
          >
            <HelpCircle size={24} className="text-[#80cbc4]" />
            <div>
              <h3 className="font-semibold text-base text-[#f5e0a9]">Watch History</h3>
              <p className="mt-1 text-[#80cbc4] text-sm">View what you watched earlier</p>
            </div>
          </motion.div>
        </Link>
      </motion.section>
    </div>
  );
};

export default Dashboard;
