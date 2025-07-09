import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Settings, HelpCircle, PlusCircle, User, LogOut } from "lucide-react";
import AvatarModal from "./AvatarPage";
import { useTheme } from './useTheme';

const Dashboard = () => {
  const { theme, setTheme, currentTheme } = useTheme();
  const [profile, setProfile] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [hasAvatar, setHasAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
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

  const getAvatarUrl = (profile) => {
    if (!profile) return "";
    return `https://api.dicebear.com/9.x/adventurer/svg?seed=${profile.seed}&skinColor=${profile.skinColor}&hair=${profile.hair || "long01"}&eyes=${profile.eyes || "variant01"}&mouth=${profile.mouth || "variant01"}&size=150`;
  };

  const handleAvatarSave = (savedProfile) => {
    setProfile({ ...profile, ...savedProfile, avatarCustomized: true });
    setHasAvatar(true);
    setShowAvatarModal(false);
  };

  const watchlistItems = [
    { title: "Watchlist", description: "Continue watching your favorites", link: "/watchlist" },
  ];

  return (
    <div className={`min-h-screen font-['Poppins'] p-6 ${theme.background} ${theme.text}`}>
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header Buttons */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate("/subscription")} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-400 text-white rounded-xl shadow hover:scale-105 transition">
              <PlusCircle size={20} /> Subscribe
            </button>
            <button onClick={() => navigate("/setting")} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-300 to-yellow-200 text-black rounded-xl shadow hover:scale-105 transition">
              <Settings size={20} /> Settings
            </button>
            <button onClick={() => { localStorage.removeItem("user"); navigate("/loginpage"); }} className={`flex items-center gap-2 px-4 py-2 ${theme.text} rounded-xl shadow hover:scale-105 transition`}>
              <LogOut size={20} /> Logout
            </button>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-medium text-sm">Theme:</label>
            <select
              id="theme-select"
              value={currentTheme}
              onChange={(e) => updateThemeInDB(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm bg-white/20 text-black border border-white/30 backdrop-blur-md"
            >
              <option value="dark">Dark</option>
              <option value="cherryBlossom">Cherry Blossom</option>
              <option value="techno">Techno</option>
            </select>
          </div>
        </div>

        {/* Profile */}
        <div className="text-center">
          <p className={`text-3xl font-bold tracking-wide mb-6 ${theme.text}`}>Your Profile</p>
          <div className="flex justify-center">
            <div
              className={`backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-3xl shadow-lg w-80 ${theme.text} cursor-pointer`}
              onClick={() => setShowAvatarModal(true)}
            >
              <img
                src={getAvatarUrl(profile)}
                alt="User Avatar"
                className="w-36 h-36 rounded-full mx-auto border-4 border-white shadow-md"
              />
              <p className={`mt-4 text-xl font-semibold ${theme.text}`}>{profile?.displayName || "Your Profile"}</p>
              {!hasAvatar ? (
                <button className="mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md">
                  <PlusCircle size={16} className="inline mr-1" /> Create Avatar
                </button>
              ) : (
                <p className="mt-4 text-sm text-blue-400">Click to edit avatar</p>
              )}
            </div>
          </div>
        </div>

        {/* Watchlist */}
        <div className="space-y-5">
          {watchlistItems.map((item, index) => (
            <Link to={item.link} key={index}>
              <motion.div whileHover={{ scale: 1.04 }} className={`backdrop-blur-lg bg-white/10 border border-white/15 flex items-center gap-4 p-5 rounded-2xl shadow-lg transition-all cursor-pointer ${theme.text}`}>
                <User size={24} className={`${theme.text}`} />
                <div>
                  <p className={`font-semibold text-lg ${theme.text}`}>{item.title}</p>
                  <p className={`mt-1 text-sm ${theme.text}`}>{item.description}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Watch History */}
        <Link to="/watchhistory">
          <motion.div whileHover={{ scale: 1.04 }} className={`backdrop-blur-lg bg-white/10 border border-white/15 flex items-center gap-4 p-5 rounded-2xl shadow-lg transition-all cursor-pointer ${theme.text}`}>
            <HelpCircle size={24} className={`${theme.text}`} />
            <div>
              <p className={`font-semibold text-lg ${theme.text}`}>Watch History</p>
              <p className={`mt-1 text-sm ${theme.text}`}>View what you watched earlier</p>
            </div>
          </motion.div>
        </Link>

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
    </div>
  );
};

export default Dashboard;
