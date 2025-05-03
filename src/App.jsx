import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Sidebar from "./pages/sidebar"; // capital S
import MovieDetailPage from "./pages/moviedetail";
import Homepage from "./pages/Homepage/Homepage";
import Explore from "./pages/Explore/Explore"; // Uppercase
import Settings from "./pages/Settings"; // Uppercase
import SubscriptionPage from "./pages/subscription";
import LoginPage from "./pages/LoginPage";
import WatchPage from "./pages/watchnow";
import FelciSignup from "./pages/felsignup"; // SignUp page
import WatchlistPage from "./pages/watchlist";
import Dashboard from "./pages/Dashboard";
import SeriesDetailPage from "./pages/Seriesdetailpage";
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
                <Route path="/setting" element={<Settings />} />
                <Route path="/loginpage" element={<LoginPage />} />
                <Route path="/movie/:id" element={<MovieDetailPage />} /> {/* Dynamic route for movie details */}
                <Route path="/watch/:id" element={<WatchPage />}/>
                <Route path="/subscription" element={<SubscriptionPage />}/>
                <Route path="/watchlist" element={<WatchlistPage />}/>
                <Route path="/signup" element={<FelciSignup />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </>
  );
};

export default App;
