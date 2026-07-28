import React from "react";
import ReactDOM from "react-dom";
import { IoClose } from "react-icons/io5";
import { useSteamSearch } from "../../../hooks/useSteamSearch";
import "./GameImportModal.css";

const GameImportModal = ({ onClose, onImportSuccess }) => {
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    isImporting,
    handleSearch,
    handleImportGame,
  } = useSteamSearch((newId, newName) => {
    if (onImportSuccess) onImportSuccess();
    onClose();
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  return ReactDOM.createPortal(
    <div className="game-import-overlay" onClick={onClose}>
      <div className="game-import-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="game-import-header">
          <h2 className="game-import-title">Importar desde Steam</h2>
          <button className="game-import-close" onClick={onClose} title="Cerrar">
            <IoClose />
          </button>
        </div>

        <div className="game-import-body">
          <div>
            <label className="game-import-label">Buscar juego en SteamGridDB</label>
            <input
              type="text"
              className="game-import-input"
              placeholder="Ej. Star Citizen, Minecraft..."
              value={searchTerm}
              onChange={handleInputChange}
              autoFocus
              style={{ marginTop: '8px' }}
            />
          </div>

          {searchTerm.trim().length > 0 && (
            <div className="game-import-results-container">
              {isSearching && (
                <div className="game-import-status-msg">Buscando coincidencias...</div>
              )}

              {!isSearching && searchResults.length === 0 && (
                <div className="game-import-status-msg">No se encontraron juegos.</div>
              )}

              {!isSearching && searchResults.map((game) => (
                <div
                  key={game.id}
                  className={`game-import-result-item ${isImporting ? "disabled" : ""}`}
                  onClick={() => !isImporting && handleImportGame(game)}
                >
                  <span className="game-import-game-name">{game.name}</span>
                  <span className="game-import-badge">
                    {isImporting ? "Importando..." : "Importar"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>,
    document.body
  );
};

export default GameImportModal;