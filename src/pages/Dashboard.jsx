import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Settings, HelpCircle, PlusCircle, User, LogOut, Search } from "lucide-react"; // Added Search
import AvatarModal from "./AvatarPage"; // Added AvatarModal import
import { useTheme } from "../pages/useTheme"; // Added useTheme import

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
  const { theme, setTheme, currentTheme } = useTheme(); // Initialize useTheme
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Initialize profiles state (from the second code, but adapted for initial userEmail)
  const [profiles, setProfiles] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const initialProfiles = [];
    if (user?.email) {
      initialProfiles.push({
        name: user.email,
        img: "https://i.imgur.com/3GvwNBf.png",
        bio: "Your personal profile!",
      });
    } else {
      // Fallback if no user in localStorage, or you can decide on a default
      initialProfiles.push({
        name: "User",
        img: "https://i.imgur.com/3GvwNBf.png",
        bio: "Your personal profile!",
      });
    }
    initialProfiles.push({ name: "Kids", emoji: "👶", bio: "For young ones!" });
    return initialProfiles;
  });

  // Rented movies data (from the second code)
  const rentedMovies = [
    { title: "Harishchandrachi Factory", img: "https://upload.wikimedia.org/wikipedia/en/9/9c/Harishchandrachi_Factory%2C_2009_film_poster.jpg" },
    { title: "Natarang", img: "https://upload.wikimedia.org/wikipedia/en/7/75/Natarang_%28film%29.jpg" }
  ];

  // Function to add a new profile (from the second code)
  const addProfile = (newProfile) => {
    setProfiles((prev) => [...prev, newProfile]);
  };

  const handleSubscribeClick = () => navigate("/subscription");
  const handleSettingsClick = () => navigate("/setting");

  // Corrected and simplified handleLogout (from the second code)
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/loginpage"); // Use loginpage as in the first code's handleLogout
  };

  // Filtered profiles and movies based on search term
  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMovies = rentedMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`bg-gradient-to-b ${theme.background} min-h-screen p-6 ${theme.text} font-['Poppins']`}
      style={theme.backgroundImage ? { backgroundImage: theme.backgroundImage, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' } : {}}
    >
      {/* Header */}
      <motion.header
        className={`flex justify-between items-center border border-${theme.text}/30 bg-${theme.accent}/30 backdrop-blur-xl px-8 py-5 rounded-3xl shadow-2xl ${theme.shadowin}`}
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <div>
          <p className={`text-xs text-[#80cbc4] tracking-wide ${theme.text}`}>📞 +91 8********1</p>
          <h1 className={`text-2xl md:text-3xl font-bold mt-1 ${theme.text} drop-shadow tracking-tight`}>
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
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 hover:scale-105 hover:brightness-110 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md flex items-center gap-2 transition-all duration-200"
          >
            <LogOut size={16} /> Logout
          </button>

          {/* Theme selection dropdown */}
          <select
            value={currentTheme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-white text-black px-2 py-1 rounded"
          >
            <option value="dark">Dark</option>
            <option value="cherryBlossom">Cherry Blossom</option>
            <option value="techno">Techno</option>
          </select>
        </div>
      </motion.header>

      {/* Search Bar */}
      <motion.div
        className="mt-8 relative max-w-lg mx-auto"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <input
          type="text"
          placeholder="Search profiles or movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full p-3 pl-10 rounded-xl bg-gray-800 bg-opacity-70 border border-${theme.text}/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${theme.accent}`}
        />
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </motion.div>

      {/* Referral Status */}
      <motion.section
        className={`mt-12 border-t border-${theme.text}/20 pt-8`}
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className={`text-2xl font-semibold mb-6 ${theme.text} tracking-wide`}>Referral Status</h2>
        <motion.div
          whileHover={{ scale: 1.04 }}
          className={`bg-${theme.accent}/80 border border-${theme.text}/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl shadow-md hover:shadow-${theme.text}/20 transition-all`}
        >
          <div>
            <h3 className={`font-semibold text-base ${theme.text}`}>Earn Rewards</h3>
            <p className={`mt-1 text-[#80cbc4] text-sm ${theme.text}`}>
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
        className={`mt-12 border-t border-${theme.text}/20 pt-8`}
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className={`text-2xl font-semibold mb-6 ${theme.text} tracking-wide`}>Profiles</h2>
        <div className="max-w-md mx-auto grid grid-cols-3 gap-6">
          {filteredProfiles.map((profile, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.12, rotate: 1 }}
              className="flex flex-col items-center cursor-pointer transition-all"
            >
              {profile.img ? (
                <img
                  src={profile.img}
                  className={`w-20 h-20 rounded-full border-4 border-${theme.text} shadow-lg hover:shadow-${theme.text}/40 transition-all`}
                  alt={profile.name}
                />
              ) : (
                <div className={`bg-${theme.text} text-black w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg`}>
                  {profile.emoji}
                </div>
              )}
              <p className={`mt-2 text-sm font-medium ${theme.text}`}>{profile.name}</p>
              <p className={`mt-1 text-xs ${theme.text}/70`}>{profile.bio}</p> {/* Added bio */}
            </motion.div>
          ))}
          {/* Add Profile button/modal trigger */}
          {profiles.length < 4 && ( // Limit to 4 profiles
            <div className="flex flex-col items-center justify-center">
              <AvatarModal onSave={addProfile} />
            </div>
          )}
        </div>
      </motion.section>

      {/* Rented Movies */}
      <motion.section
        className={`mt-12 border-t border-${theme.text}/20 pt-8`}
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className={`text-2xl font-semibold mb-6 ${theme.text} tracking-wide`}>Rented Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredMovies.map((movie, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.08 }}
              className={`relative bg-[#ffffff0f] backdrop-blur-md border border-${theme.text}/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-lg ${theme.shadow} transition-all duration-300 group`}
            >
              <img
                src={movie.img}
                className="w-full h-48 object-cover group-hover:brightness-75 transition-all"
                alt={movie.title}
              />
              <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-all bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                <p className={`text-center text-sm font-semibold ${theme.text} pb-3 px-2`}>
                  {movie.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Watchlist */}
      <motion.section
        className={`mt-12 border-t border-${theme.text}/20 pt-8`}
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className={`text-2xl font-semibold mb-6 ${theme.text} tracking-wide`}>Watchlist</h2>
        <div className="space-y-4">
          {watchlistItems.map((item, index) => (
            <Link to={item.link} key={index}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                className={`${theme.accent} border border-${theme.text}/15 flex items-center gap-4 p-5 rounded-xl shadow-md ${theme.shadow} transition-all cursor-pointer`}
              >
                <User size={24} className={`text-[#80cbc4] ${theme.text}`} />
                <div>
                  <h3 className={`font-semibold text-base ${theme.text}`}>{item.title}</h3>
                  <p className={`mt-1 ${theme.text} text-sm`}>{item.description}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Watch History */}
      <motion.section
        className={`mt-12 border-t border-${theme.text}/20 pt-8`}
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className={`text-2xl font-semibold mb-6 ${theme.text} tracking-wide`}>Watch History</h2>
        <Link to="/watchhistory">
          <motion.div
            whileHover={{ scale: 1.04 }}
            className={`${theme.accent} border border-${theme.text}/15 flex items-center gap-4 p-5 rounded-xl shadow-md ${theme.shadow} transition-all cursor-pointer`}
          >
            <HelpCircle size={24} className={`text-[#80cbc4] ${theme.text}`} />
            <div>
              <h3 className={`font-semibold text-base ${theme.text}`}>Watch History</h3>
              <p className={`mt-1 text-[#80cbc4] text-sm ${theme.text}`}>View what you watched earlier</p>
            </div>
          </motion.div>
        </Link>
      </motion.section>
    </div>
  );
};

export default Dashboard;