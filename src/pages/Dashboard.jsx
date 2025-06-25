import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Settings, HelpCircle, PlusCircle, User, LogOut, Search, Edit } from "lucide-react";
import AvatarModal from "./AvatarPage";
import { useTheme } from "../pages/useTheme";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme, setTheme, currentTheme } = useTheme();

  const [searchTerm, setSearchTerm] = useState("");
  const [profile, setProfile] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [hasAvatar, setHasAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchProfile(user);
      } else {
        setIsLoading(false);
        navigate("/loginpage");
      }
    });

    return () => unsubscribe();
  }, []);

  // src/Dashboard.jsx
const fetchProfile = async (user) => {
  setIsLoading(true);
  try {
    const token = await user.getIdToken();
    const response = await fetch(`http://localhost:4000/api/profile/${user.uid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const profile = await response.json(); // Now gets a single profile object
      
      setProfile(profile);
      setHasAvatar(profile.avatarCustomized); // Direct boolean check
      
      if (profile.theme) setTheme(profile.theme);
      
      // Show modal only if avatar not customized
      if (!profile.avatarCustomized) {
        setShowAvatarModal(true);
      }
    } else if (response.status === 404) {
      setProfile({ uid: user.uid });
      setHasAvatar(false);
      setShowAvatarModal(true);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
  } finally {
    setIsLoading(false);
  }
};
  // Update theme in DB
  const updateThemeInDB = async (newTheme) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const token = await user.getIdToken();
      await fetch(`http://localhost:4000/api/profile/${user.uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ theme: newTheme }),
      });
      setTheme(newTheme);
    } catch (err) {
      console.error("Failed to update theme:", err);
    }
  };

  // ... rest of the code remains the same ...

  // Handle avatar save
 const handleAvatarSave = (savedProfile) => {
  console.log("👤 Avatar saved:", savedProfile);
    const fullProfile = {
    ...profile,
    ...savedProfile,
    avatarCustomized: true
  };
  
  setProfile(fullProfile);
  setHasAvatar(true);
  setShowAvatarModal(false);
};
  //URL generator
  const getAvatarUrl = (profile) => {
  if (!profile) return "";
  
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${profile.seed}&skinColor=${profile.skinColor}&hair=${profile.hair || 'long01'}&eyes=${profile.eyes || 'variant01'}&mouth=${profile.mouth || 'variant01'}&size=150`;
};

  // Static data
  const rentedMovies = [
    { title: "Harishchandrachi Factory", img: "https://upload.wikimedia.org/wikipedia/en/9/9c/Harishchandrachi_Factory%2C_2009_film_poster.jpg" },
    { title: "Natarang", img: "https://upload.wikimedia.org/wikipedia/en/7/75/Natarang_%28film%29.jpg" }
  ];

  const watchlistItems = [
    {
      title: "Watchlist",
      description: "Continue watching your favorites",
      link: "/watchlist",
    },
  ];

  // Event handlers
  const handleSubscribeClick = () => navigate("/subscription");
  const handleSettingsClick = () => navigate("/setting");
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/loginpage");
  };

  const filteredMovies = rentedMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`bg-gradient-to-b ${theme.background} min-h-screen p-6 ${theme.text} font-['Poppins']`}
      style={theme.backgroundImage ? {
        backgroundImage: theme.backgroundImage,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      } : {}}
    >
      {/* Header */}
      <motion.header
        className={`flex justify-between items-center border border-${theme.text}/30 bg-${theme.accent}/30 backdrop-blur-xl px-8 py-5 rounded-3xl shadow-2xl ${theme.shadowin}`}
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <div>
          <p className="text-xs text-[#80cbc4] tracking-wide">📞 +91 8********1</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1 drop-shadow tracking-tight">
            Subscribe to enjoy Marathi play 🎭
          </h1>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSubscribeClick} className="bg-gradient-to-r from-red-500 via-red-400 to-red-500 hover:scale-105 hover:brightness-110 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md flex items-center gap-2 transition-all duration-200">
            <PlusCircle size={16} /> Subscribe
          </button>
          <button onClick={handleSettingsClick} className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 hover:scale-105 hover:brightness-110 text-black px-5 py-2.5 rounded-xl text-sm font-medium shadow-md flex items-center gap-2 transition-all duration-200">
            <Settings size={16} /> Settings
          </button>
          <button onClick={handleLogout} className="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 hover:scale-105 hover:brightness-110 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md flex items-center gap-2 transition-all duration-200">
            <LogOut size={16} /> Logout
          </button>
          <select
            value={currentTheme}
            onChange={(e) => updateThemeInDB(e.target.value)}
            className="bg-white text-black px-2 py-1 rounded"
          >
            <option value="dark">Dark</option>
            <option value="cherryBlossom">Cherry Blossom</option>
            <option value="techno">Techno</option>
          </select>
        </div>
      </motion.header>

      {/* Search */}
      <motion.div className="mt-8 relative max-w-lg mx-auto" variants={fadeIn} initial="hidden" animate="show">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full p-3 pl-10 rounded-xl bg-gray-800 bg-opacity-70 border border-${theme.text}/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${theme.accent}`}
        />
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </motion.div>

      {/* Profile */}
      <motion.section className={`mt-12 border-t border-${theme.text}/20 pt-8`} variants={fadeIn} initial="hidden" animate="show">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold tracking-wide">Your Profile</h2>
          
        </div>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : hasAvatar ? (
              <div className="flex justify-center">
                <motion.div whileHover={{ scale: 1.12, rotate: 1 }} className="flex flex-col items-center cursor-pointer transition-all" onClick={() => setShowAvatarModal(true)}>
                  <img
                    src={getAvatarUrl(profile)}
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                  <p className="mt-3 text-lg font-medium">{profile.displayName || "Your Profile"}</p>
                </motion.div>
              </div>
            )  : (
          <div className="text-center">
            <p className="text-gray-400 mb-4">You haven't created an avatar yet</p>
            <button onClick={() => setShowAvatarModal(true)} className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md flex items-center gap-2 mx-auto transition-all">
              <PlusCircle size={16} /> Create Avatar
            </button>
          </div>
        )}
      </motion.section>

      {/* Watchlist */}
      <motion.section className={`mt-12 border-t border-${theme.text}/20 pt-8`} variants={fadeIn} initial="hidden" animate="show">
        <h2 className="text-2xl font-semibold mb-6 tracking-wide">Watchlist</h2>
        <div className="space-y-4">
          {watchlistItems.map((item, index) => (
            <Link to={item.link} key={index}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                className={`${theme.accent} border border-${theme.text}/15 flex items-center gap-4 p-5 rounded-xl shadow-md ${theme.shadow} transition-all cursor-pointer`}
              >
                <User size={24} className="text-[#80cbc4]" />
                <div>
                  <h3 className="font-semibold text-base">{item.title}</h3>
                  <p className="mt-1 text-sm">{item.description}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Watch History */}
      <motion.section className={`mt-12 border-t border-${theme.text}/20 pt-8`} variants={fadeIn} initial="hidden" animate="show">
        <h2 className="text-2xl font-semibold mb-6 tracking-wide">Watch History</h2>
        <Link to="/watchhistory">
          <motion.div
            whileHover={{ scale: 1.04 }}
            className={`${theme.accent} border border-${theme.text}/15 flex items-center gap-4 p-5 rounded-xl shadow-md ${theme.shadow} transition-all cursor-pointer`}
          >
            <HelpCircle size={24} className="text-[#80cbc4]" />
            <div>
              <h3 className="font-semibold text-base">Watch History</h3>
              <p className="mt-1 text-sm text-[#80cbc4]">View what you watched earlier</p>
            </div>
          </motion.div>
        </Link>
      </motion.section>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <AvatarModal
            currentProfile={profile || {}}
            onSave={handleAvatarSave}
            onClose={() => setShowAvatarModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
