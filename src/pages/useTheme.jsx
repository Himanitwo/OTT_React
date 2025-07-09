import { createContext, useContext, useState, useEffect } from "react";

export const themes = {
  dark: {
    name: "dark",
    background: "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700",
    text: "text-white",
    accent: "bg-gray-800",
    card: "bg-gray-800",
    button: "bg-gray-700 hover:bg-gray-600",
    buttonText: "text-white",
    sectionTitle: "text-white",
    bannerContent: "text-white",
    genreButton: "bg-gray-700 hover:bg-gray-600 text-white",
    rating: "text-yellow-400"
  },
  cherryBlossom: {
    name: "cherryBlossom",
    background: "bg-gradient-to-br from-white via-blue-200 to-rose-200",
    text: "text-gray-800", 
    accent: "bg-white/30 backdrop-blur-md",
    card: "bg-white/40 backdrop-blur-lg border border-white/20", 
    button: "bg-rose-400",
    buttonText: "text-white",
    sectionTitle: "text-rose-600", 
    bannerContent: "text-blue-900",
    genreButton: "bg-pink-400 hover:bg-pink-300 text-white",
    rating: "text-yellow-500",
    shadow: "shadow-lg shadow-rose-200" 
  },
  techno: {
    name: "techno",
    background: "bg-gradient-to-br from-slate-900 via-purple-800 to-purple-900",
    text: "text-cyan-100",
    accent: "bg-mirage-500",
    card: "bg-",
    button: "bg-cyan-600 hover:bg-cyan-500",
    buttonText: "text-white",
    sectionTitle: "text-cyan-300",
    bannerContent: "text-cyan-100",
    genreButton: "bg-cyan-600 hover:bg-cyan-500 text-white",
    rating: "text-yellow-300",
    shadow: "shadow-rose-500"
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  const [themeKey, setThemeKey] = useState(savedTheme);

  const setTheme = (key) => {
    if (themes[key]) {
      setThemeKey(key);
      localStorage.setItem("theme", key);
    }
  };

  useEffect(() => {
    // Apply theme classes to body
    document.body.className = `${themes[themeKey].background} ${themes[themeKey].text}`;
  }, [themeKey]);

  return (
    <ThemeContext.Provider value={{ 
      theme: themes[themeKey], 
      setTheme, 
      currentTheme: themeKey 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
