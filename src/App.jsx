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
import LiveStream from "./pages/LiveStream";
import Viewer from "./pages/veiwer";
import StartLive from "./pages/StartLive";
import LiveLobby from "./pages/LiveLobby";// Corrected: Import ThemeProvider from its path
import { ThemeProvider } from "./pages/useTheme"; // 

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
                <Route path="/explore" element={<Explore />} />
                <Route path="/setting" element={<SettingsPage />} />
                <Route path="/loginpage" element={<LoginPage />} />
                <Route path="/movie/:id" element={<MovieDetailPage />} /> {/* Dynamic route for movie details */}
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
                        <Route path="/live/host/:roomId" element={<LiveStream />} />
        <Route path="/live/view/:roomId" element={<Viewer />} />

                 <Route path="/start-live" element={<StartLive />} />
        <Route path="/live" element={<LiveLobby />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
      {/* <JotformAgent /> */}
      </ThemeProvider>
    </>
  );
};

export default App;