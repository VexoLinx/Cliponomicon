import React, { useEffect, useRef } from "react";

const GameCreateModal = ({
  creating,
  title,
  newGameName,
  onClose,
  onSubmit,
  setNewGameName,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="game-create-modal-overlay" onClick={onClose}>
      <div className="game-create-modal" onClick={(e) => e.stopPropagation()}>
        <div className="game-create-modal-header">
          <h2>{title}</h2>
          <button className="game-create-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="game-create-modal-body">
            <label className="game-create-modal-label" htmlFor="gameName">
              Nombre del Juego
            </label>
            <input
              ref={inputRef}
              id="gameName"
              className="game-create-create-input"
              type="text"
              placeholder="Ej. Minecraft, Valorant..."
              value={newGameName}
              onChange={(e) => setNewGameName(e.target.value)}
              disabled={creating}
              required
            />
          </div>

          <div className="game-create-modal-actions">
            <button
              type="button"
              className="game-create-modal-secondary"
              onClick={onClose}
              disabled={creating}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="game-create-create-button"
              disabled={!newGameName.trim() || creating}
            >
              {creating ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameCreateModal;