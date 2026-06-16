import React from "react";
import GameCard from "./GameCard/GameCard";
import "./GamesPage.css";

const GamesPage = () => {
  const mockGames = [
    {
      id: 1,
      name: "Abiotic Factor",
      image:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1325900/header.jpg",
    },
    {
      id: 2,
      name: "Baldur's Gate 3",
      image:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg",
    },
    {
      id: 3,
      name: "Counter-Strike 2",
      image:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg",
    },
    {
      id: 4,
      name: "Dungeons of Eternity",
      image: "https://placehold.co/460x215/222/white?text=Dungeons",
    },
    {
      id: 5,
      name: "Half Sword",
      image:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2397300/header.jpg",
    },
    {
      id: 6,
      name: "Hytale",
      image: "https://placehold.co/460x215/333/white?text=Hytale",
    },
  ];

  return (
    <div className="games-grid">
      {mockGames.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
};

export default GamesPage;
