import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Sidebar from "./pages/sidebar"; // capital S
import MovieDetailPage from "./pages/moviedetail";
import Homepage from "./pages/Homepage/Homepage";
import Explore from "./pages/Explore/Explore"; // Uppercase
import Settings from "./pages/Settingpage/SettingsPage"; // Uppercase
import SubscriptionPage from "./pages/subscription";
import LoginPage from "./pages/LoginPage";
import WatchPage from "./pages/watchnow";
import FelciSignup from "./pages/felsignup"; // SignUp page
import SettingsPage from "./pages/Settingpage/SettingsPage";
import WatchlistPage from "./pages/watchlist";
import WatchHistory from "./pages/WatchHistory";
import Dashboard from "./pages/Dashboard";
import SeriesDetailPage from "./pages/Seriesdetailpage";
import ContactPage from "./pages/contactpage";
const App = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <>
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
              className={`transition-all duration-300 flex-1 pt-16 ${
                isSidebarExpanded ? "ml-64" : "ml-16"
              }`}
              
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
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </>
  );
};

export default App;
