import React, { createContext, useState, useContext } from 'react';

const PlaylistContext = createContext();

export const usePlaylist = () => useContext(PlaylistContext);

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);

  const createPlaylist = (name) => {
    setPlaylists((prev) => [...prev, { name, movies: [] }]);
  };

  const addToPlaylist = (name, movie) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.name === name
          ? { ...p, movies: [...p.movies, movie] }
          : p
      )
    );
  };

  return (
    <PlaylistContext.Provider value={{ playlists, createPlaylist, addToPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
};
