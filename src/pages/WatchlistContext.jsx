import React, { createContext, useContext, useState } from 'react';

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);

  const addToWatchlist = (movie) => {
    setWatchlist((prev) => {
      if (prev.find(item => item.title === movie.title)) return prev;
      return [...prev, movie];
    });
  };

  const removeFromWatchlist = (title) => {
    setWatchlist(prev => prev.filter(movie => movie.title !== title));
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};
