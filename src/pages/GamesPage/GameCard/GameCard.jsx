import { useNavigate } from 'react-router-dom';
import React from 'react';
import './GameCard.css';

const GameCard = ({ game }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="game-card" 
      onClick={() => navigate(`/games/${game.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="game-card-image-container">
        <img 
          src={game.image || game.thumbnail_horizontal_url} 
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