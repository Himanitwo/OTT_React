import React, { useContext } from "react";
import { CoinContext } from "../context/CoinContext";
import { badges } from "../badgeData/badges";

const BadgeDisplay = () => {
  const { coins } = useContext(CoinContext);

  const currentBadge =
    badges
      .slice()
      .reverse()
      .find((b) => coins >= b.minCoins)?.level || "Unranked";

  return (
    <div className="text-white text-lg mt-2">
      🎖️ Badge Level: <strong>{currentBadge}</strong>
    </div>
  );
};

export default BadgeDisplay;
