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
};



const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeKey, setThemeKey] = useState("dark");

  const setTheme = (key) => {
    if (themes[key]) setThemeKey(key);
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
