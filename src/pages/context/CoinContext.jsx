import React, { createContext, useState, useEffect } from "react";

export const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
  const [coins, setCoins] = useState(() => {
    return parseInt(localStorage.getItem("coins")) || 0;
  });

  useEffect(() => {
    localStorage.setItem("coins", coins);
  }, [coins]);

  const addCoins = (amount) => setCoins((prev) => prev + amount);

  return (
    <CoinContext.Provider value={{ coins, addCoins }}>
      {children}
    </CoinContext.Provider>
  );
};
