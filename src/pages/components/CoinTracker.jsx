import React, { useContext } from "react";
import { CoinContext } from "../context/CoinContext";

const CoinTracker = () => {
  const { coins } = useContext(CoinContext);

  return (
    <div className="text-white text-lg">
      🪙 Coins: <strong>{coins}</strong>
    </div>
  );
};

export default CoinTracker;
