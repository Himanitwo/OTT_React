// hooks/useTheme.js
import { createContext, useContext, useState, useEffect } from "react";

export const themes = {
  dark: {
    background: "from-gray-900 via-gray-800 to-black",
    text: "text-white",
    accent: "bg-gray-800",
    shadow: "hover:shadow-gray-400/40",
  },
  cherryBlossom: {
    background: "from-pink-100 via-pink-200 to-pink-300",
    text: "text-gray-900",
    accent: "bg-pink-200",
    shadow: "hover:shadow-pink-800/40",
    // backgroundImage:`url('/img/cherry.jpg')`
  },
  techno: {
    background: "from-[#0f0c29] via-[#302b63] to-[#24243e]",
    text: "text-teal-100",
    accent: "bg-[#1a1a2e]",
    shadow: "hover:shadow-cyan-400/40",
    shadowin: "shadow-cyan-800/30",
    // backgroundImage:`url('/img/techbg.jpg')`, // sample techno bg
  },
   ocean: {
    background: "from-cyan-200 to-blue-300",
    text: "text-blue-900",
    accent: "bg-cyan-100",
    card: "bg-white/90 border border-cyan-300 text-blue-800",
    button: "bg-cyan-500 text-white hover:bg-cyan-600",
    shadow: "shadow-md",
    shadowin: "shadow-inner",
  },

  sunset: {
    background: "from-orange-300 to-purple-300",
    text: "text-purple-900",
    accent: "bg-orange-200",
    card: "bg-white/80 border border-purple-300 text-orange-900",
    button: "bg-orange-400 text-white hover:bg-orange-500",
    shadow: "shadow-lg",
    shadowin: "shadow-inner",
  },
};



const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  const [themeKey, setThemeKey] = useState(savedTheme);


  const setTheme = (key) => {
    if (themes[key]) {
    setThemeKey(key);
    localStorage.setItem("theme", key); // ✅ Save to localStorage
  }
  };

  useEffect(() => {
    document.body.className = ""; // Clear existing classes
    document.body.classList.add("transition-colors", "duration-500");
  }, [themeKey]);

  return (
    <ThemeContext.Provider value={{ theme: themes[themeKey], setTheme, currentTheme: themeKey }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);