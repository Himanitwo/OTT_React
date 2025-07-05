import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Sidebar from "./pages/sidebar"; // capital S
import MovieDetailPage from "./pages/moviedetail";
import Homepage from "./pages/Homepage/Homepage";
import Explore from "./pages/Explore/Explore"; // Uppercase
import SubscriptionPage from "./pages/subscription";
import LoginPage from "./pages/LoginPage";
import WatchPage from "./pages/watchnow";
import FelciSignup from "./pages/felsignup"; // SignUp page
import SettingsPage from "./pages/Settings/SettingsPage";
import WatchlistPage from "./pages/watchlist";
import WatchHistory from "./pages/WatchHistory";
import Dashboard from "./pages/Dashboard";
import SeriesDetailPage from "./pages/Seriesdetailpage";
import ContactPage from "./pages/contactpage";
import JotformAgent from "./Jotai";
import VideoCall from "./pages/VideoCall";
import VideoCallWrapper from "./pages/VideoCallWrapper";
import JoinRoom from "./pages/joinroom";
import VoiceChatWithText from "./pages/VideoCall";

// Import the functions you need from the SDKs you need
import BadgeDashboard from "./pages/badges/BadgeDashboard";
import WatchPartyRoom from "./pages/WatchParty/WatchPartyRoom";
import LiveStream from "./pages/livestream/LiveStream"; // Corrected: Import LiveStream from its path
import Viewer from "./pages/livestream/veiwer"; // Corrected: Import Viewer from its path
import StartLive from "./pages/livestream/StartLive"; // Corrected: Import StartLive from its path
import LiveLobby from "./pages/livestream/LiveLobby"; // Corrected: Import Live
// Corrected: Import ThemeProvider from its path
import { ThemeProvider } from "./pages/useTheme"; // 
import SeriesPage from "./pages/seriespage";
import MoviePage from "./pages/moviep";// Import the MoviePage component
import reel from "./pages/reels/reel"; // Import the reel component
import ReelsSidebar from "./pages/reels/reel";
const App = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <>
      {/* ThemeProvider must wrap the content that uses the theme, typically the entire app */}
      <ThemeProvider>
        <Router>
          <div className="flex flex-col h-screen">
            {/* Navbar at top */}
            <Navbar />

            {/* Flex container for sidebar + main content */}
            <div className="flex flex-1">
              {/* Sidebar */}
              <Sidebar
                isExpanded={isSidebarExpanded}
                setIsExpanded={setIsSidebarExpanded}
              />

            {/* Main content */}
            <main
              // className={`transition-all duration-300 flex-1 pt-16 ${
              //   isSidebarExpanded ? "ml-64" : "ml-16"
              // }`}
              className={`transition-all duration-300 flex-1 ml-16 pt-0 }`}
            >
              <Routes>
                <Route path="/" element={<Homepage />} />
                {/* <Route path="/explore" element={<Explore />} />
                <Route path="/setting" element={<SettingsPage />} /> */}
                <Route path="/loginpage" element={<LoginPage />} />
                {/* <Route path="/movie/:id" element={<MovieDetailPage />} /> Dynamic route for movie details */}
                <Route path="/watch/:id" element={<WatchPage />}/>
                <Route path="/subscription" element={<SubscriptionPage />}/>
                <Route path="/watchlist" element={<WatchlistPage />}/>
                <Route path="/signup" element={<FelciSignup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/Watchhistory" element={<WatchHistory/>} />
                <Route path="/series/:id" element={<SeriesDetailPage />} /> 
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/vediocall" element={<VoiceChatWithText />} />
                            <Route path="/join" element={<JoinRoom />} />
            <Route path="/room/:roomId" element={<VoiceChatWithText />} />
                <Route path="/vediocall" element={<VideoCall />} />
                <Route path="/badges" element={<BadgeDashboard />} />
                <Route path="/watch-party/:roomId" element={<WatchPartyRoom />} />
                        <Route path="/broadcast/:id" element={<LiveStream />} />
    <Route path="/watch/:id" element={<Viewer />} />
  <Route path="/series/waris" element={<SeriesPage />} />
  <Route path="/movie/:movieId" element={<MoviePage />} />
                <Route path="/go-live" element={<StartLive />} />
        <Route path="/live" element={<LiveLobby />} />
        <Route path="/reels" element={<ReelsSidebar />} />
                <Route path="/video-call" element={<VideoCallWrapper />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
      <JotformAgent />
      </ThemeProvider>
    </>
  );
};

export default App;