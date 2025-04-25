import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Sidebar from "./pages/sidebar";

import MarathiPlayHome from "./pages/Homepage";
import explore from "./pages/Explore.jsx";
import setting from "./pages/Settings.jsx";
import LoginPage from "./pages/LoginPage";
//import Products from "./pages/Products";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/" element={<MarathiPlayHome />} />
        <Route path="/explore" element={<explore />} />
        <Route path="/setting" element={<setting />} />
        <Route path="/loginpage" element={<LoginPage />} />
        
      </Routes>
    </Router>
  );
};

export default App;
