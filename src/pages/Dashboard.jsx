import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Settings, HelpCircle, PlusCircle, User, LogOut } from "lucide-react";
import AvatarModal from "./AvatarPage";
import { useTheme } from "../pages/useTheme";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme, setTheme, currentTheme } = useTheme();

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

  const fetchProfile = async (user) => {
    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`http://localhost:4000/api/profile/${user.uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const profile = await response.json();
        setProfile(profile);
        setHasAvatar(profile.avatarCustomized);
        if (profile.theme) setTheme(profile.theme);
        if (!profile.avatarCustomized) setShowAvatarModal(true);
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

  const handleAvatarSave = (savedProfile) => {
    const fullProfile = {
      ...profile,
      ...savedProfile,
      avatarCustomized: true,
    };
    setProfile(fullProfile);
    setHasAvatar(true);
    setShowAvatarModal(false);
  };

  const getAvatarUrl = (profile) => {
    if (!profile) return "";
    return `https://api.dicebear.com/9.x/adventurer/svg?seed=${profile.seed}&skinColor=${profile.skinColor}&hair=${profile.hair || "long01"}&eyes=${profile.eyes || "variant01"}&mouth=${profile.mouth || "variant01"}&size=150`;
  };

  const watchlistItems = [
    {
      title: "Watchlist",
      description: "Continue watching your favorites",
      link: "/watchlist",
    },
  ];

  const handleSubscribeClick = () => navigate("/subscription");
  const handleSettingsClick = () => navigate("/setting");
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/loginpage");
  };

  return (
    <div
      className={`bg-gradient-to-b ${theme.background} min-h-screen p-6 ${theme.text} font-['Poppins']`}
      style={
        theme.backgroundImage
          ? {
              backgroundImage: theme.backgroundImage,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
    >
      {/* Top Controls Section (Styled like Profile) */}
      <motion.section
        className={`mt-4 border border-${theme.text}/20 rounded-2xl shadow-md bg-${theme.accent}/30 backdrop-blur-md px-6 py-8 max-w-5xl mx-auto ${theme.shadowin}`}
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div className="flex gap-4 flex-wrap justify-center md:justify-start">
            <button
              onClick={handleSubscribeClick}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 via-red-400 to-red-500 text-white rounded-xl shadow hover:scale-105 transition"
            >
              <PlusCircle size={20} /> Subscribe
            </button>
            <button
              onClick={handleSettingsClick}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 text-black rounded-xl shadow hover:scale-105 transition"
            >
              <Settings size={20} /> Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-xl shadow hover:scale-105 transition"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>

          <div className="flex items-center gap-4 bg-white text-black p-4 rounded-xl shadow w-full md:w-auto">
            <label htmlFor="theme-select" className="font-semibold text-sm">
              Theme:
            </label>
            <select
              id="theme-select"
              value={currentTheme}
              onChange={(e) => updateThemeInDB(e.target.value)}
              className="px-3 py-1.5 rounded-md border text-sm"
            >
              <option value="dark">Dark</option>
              <option value="cherryBlossom">Cherry Blossom</option>
              <option value="techno">Techno</option>
              <option value="ocean">Ocean</option>
              <option value="sunset">Sunset</option>
            </select>
          </div>
        </div>
      </motion.section>

      {/* Profile Section */}
      <motion.section
        className={`mt-12 border-t border-${theme.text}/20 pt-8`}
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-2xl font-semibold mb-6 tracking-wide text-center">Your Profile</h2>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`p-6 rounded-2xl shadow-lg border border-${theme.text}/10 bg-${theme.accent}/40 backdrop-blur-md text-center transition-all max-w-md w-full cursor-pointer`}
              onClick={() => !hasAvatar && setShowAvatarModal(true)}
            >
              <img
                src={getAvatarUrl(profile)}
                alt="User Avatar"
                className="w-36 h-36 rounded-full mx-auto border-4 border-white shadow-md"
              />
              <h3 className="mt-4 text-xl font-semibold">{profile?.displayName || "Your Profile"}</h3>
              {!hasAvatar && (
                <>
                  <p className="text-sm mt-2 text-gray-400">
                    You haven't created an avatar yet
                  </p>
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition"
                  >
                    <PlusCircle size={16} className="inline mr-1" /> Create Avatar
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </motion.section>

      {/* Watchlist Section */}
      <motion.section
        className={`mt-12 border-t border-${theme.text}/20 pt-8`}
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
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

      {/* Watch History Section */}
      <motion.section
        className={`mt-12 border-t border-${theme.text} pt-8`}
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-2xl font-semibold mb-6 tracking-wide">Watch History</h2>
        <Link to="/watchhistory">
          <motion.div
            whileHover={{ scale: 1.04 }}
            className={`${theme.accent} border border-${theme.text}/15 flex items-center gap-4 p-5 rounded-xl shadow-md ${theme.shadow} transition-all cursor-pointer`}
          >
            <HelpCircle size={24} className="text-[#80cbc4]" />
            <div>
              <h3 className={`font-semibold text-base`}>Watch History</h3>
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