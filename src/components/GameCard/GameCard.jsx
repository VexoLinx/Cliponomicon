import React from 'react';
import './GameCard.css';

const GameCard = ({ game }) => {
  // https://cdn.akamai.steamstatic.com/steam/apps/{appid}/header.jpg
  
  return (
    <div className="game-card">
      <div className="game-card-image-container">
        <img 
          src={game.image} 
          alt={game.name} 
          className="game-card-image" 
        />
        <div className="game-card-overlay">
          <span className="game-title-hover">{game.name}</span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;