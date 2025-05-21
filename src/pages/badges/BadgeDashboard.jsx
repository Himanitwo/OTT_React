import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { BadgeCheck, Lock, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import "./styles.css"

// Simulated local badge database
const allBadges = [
  {
    name: "90s Romcom Guru",
    description: "Watched 10+ 90s romcoms",
    condition: (watchHistory) => watchHistory.filter(item => item.genre === "Romcom" && item.year >= 1990 && item.year < 2000).length >= 10
  },
  {
    name: "Trivia Starter",
    description: "Participated in 1 trivia game",
    condition: (triviaStats) => triviaStats.totalGames >= 1
  },
  {
    name: "Trivia Buff",
    description: "Participated in 10 trivia games",
    condition: (triviaStats) => triviaStats.totalGames >= 10
  },
  {
    name: "Weekend Binger",
    description: "Watched 5 shows on a weekend",
    condition: (watchHistory) => watchHistory.filter(item => item.day === "Saturday" || item.day === "Sunday").length >= 5
  },
  {
    name: "Classic Buff",
    description: "Watched 5 black & white classics",
    condition: (watchHistory) => watchHistory.filter(item => item.isClassic).length >= 5
  }
];

// Simulated user watch and trivia data
const testUserData = {
  watchHistory: [
    { title: "Notting Hill", genre: "Romcom", year: 1999, day: "Saturday" },
    { title: "10 Things I Hate About You", genre: "Romcom", year: 1999, day: "Saturday" },
    { title: "You've Got Mail", genre: "Romcom", year: 1998, day: "Sunday" },
    { title: "Clueless", genre: "Romcom", year: 1995, day: "Sunday" },
    { title: "Sleepless in Seattle", genre: "Romcom", year: 1993, day: "Sunday" },
    { title: "While You Were Sleeping", genre: "Romcom", year: 1995, day: "Saturday" },
    { title: "Four Weddings and a Funeral", genre: "Romcom", year: 1994, day: "Sunday" },
    { title: "My Best Friend's Wedding", genre: "Romcom", year: 1997, day: "Sunday" },
    { title: "The Wedding Singer", genre: "Romcom", year: 1998, day: "Saturday" },
    { title: "Runaway Bride", genre: "Romcom", year: 1999, day: "Sunday" },
  ],
  triviaStats: {
    totalGames: 12,
  },
  username: "@romcomfan",
  leaderboardPosition: 4,
  totalBadges: 3
};

const mockLeaderboard = [
  { username: "@filmjunkie", badges: 7 },
  { username: "@quizqueen", badges: 6 },
  { username: "@cinemalover", badges: 5 },
  { username: "@romcomfan", badges: 3 },
  { username: "@bingehero", badges: 2 },
];

export default function BadgeDashboard() {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [lockedBadges, setLockedBadges] = useState([]);

  useEffect(() => {
    const unlocked = allBadges.filter(b => b.condition(testUserData.watchHistory, testUserData.triviaStats));
    const locked = allBadges.filter(b => !unlocked.includes(b));
    setEarnedBadges(unlocked);
    setLockedBadges(locked);
  }, []);

  const handleShare = (badge) => {
    const shareText = `🏅 I just unlocked the "${badge.name}" badge on OTTZone! ${testUserData.username}`;
    navigator.clipboard.writeText(shareText);
    alert("Badge info copied to clipboard! Share it with your friends.");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 glowing-badge">🎖️ Your Earned Badges</h1>

      {/* Leaderboard Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-xl shadow-md">
        <p className="text-blue-500 text-lg font-semibold">🏆 Leaderboard Position: #{testUserData.leaderboardPosition}</p>
        <p className="text-gray-600">You’ve earned {testUserData.totalBadges} badges so far. Keep going!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {earnedBadges.map((badge) => (
          <motion.div
            key={badge.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="card">
              <CardContent className="card-content">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <BadgeCheck className="text-green-600" />
                    <h2 className="text-xl font-semibold glowing-badge">{badge.name}</h2>
                  </div>
                  <button onClick={() => handleShare(badge)} title="Share badge">
                    <Share2 className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                  </button>
                </div>
                <p className="text-gray-600">{badge.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-3">🔒 Locked Badges</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
    {lockedBadges.map((badge) => (
      <div key={badge.name} className="locked-badge p-5 rounded-2xl">
        <div className="flex items-center gap-3 mb-2">
          <Lock className="badge-icon" />
          <h3 className="text-lg font-semibold">{badge.name}</h3>
        </div>
        <p className="text-gray-500 italic">{badge.description}</p>
      </div>
    ))}
  </div>

  <h2 className="text-2xl font-bold mb-4">🌍 Global Leaderboard</h2>
  <div className="leaderboard p-4">
    {mockLeaderboard.map((user, index) => (
      <div
        key={user.username}
        className={`leaderboard-item ${index === 0 ? "bg-yellow-100 rounded" : ""}`}
      >
        <span className="font-medium">#{index + 1} {user.username}</span>
        <span className="text-blue-600 font-semibold">🏅 {user.badges} badge{user.badges > 1 ? "s" : ""}</span>
      </div>
    ))}
  </div>
</div>

  );
}
