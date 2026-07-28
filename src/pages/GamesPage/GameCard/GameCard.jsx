import { useNavigate } from 'react-router-dom';
import React from 'react';
import './GameCard.css';

const GameCard = ({ 
  game, 
  canManageGames, 
  isManageMode, 
  onEdit, 
  onDelete, 
  isDeleting 
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/games/${game.id}`);
  };

  return (
    <div className="game-card" onClick={handleCardClick}>
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

      {canManageGames && isManageMode && (
        <div 
          className="game-card-actions"
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" onClick={() => onEdit(game)}>
            Editar
          </button>
          <button
            type="button"
            className="danger"
            disabled={isDeleting}
            onClick={() => onDelete(game)}
          >
            {isDeleting ? "..." : "Borrar"}
          </button>
        </div>
      )}
    </div>
  );
};

export default GameCard;