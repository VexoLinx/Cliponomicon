import React from "react";
import GameCard from "./GameCard/GameCard";
import GameCreateModal from "./GameCreateModal";
import GameImportModal from "./GameImportModal/GameImportModal";
import { useAuth } from "../../context/AuthContext";
import { useGamesPage } from "./useGamesPage";
import "./GamesPage.css";

const GamesPage = () => {
  const { token, user } = useAuth();
  const {
    actionStatus,
    categories,
    creating,
    deletingCategoryId,
    editingCategory,
    error,
    isCreateModalOpen,
    isManageMode,
    loading,
    newCategoryName,
    updating,
    refreshGames,
    closeModal,
    handleDeleteCategory,
    handleUpdateCategory,
    openEditModal,
    setIsCreateModalOpen,
    setIsManageMode,
    setNewCategoryName,
  } = useGamesPage(token);

  const canManageGames = token && ["admin", "super_admin"].includes(user?.role);

  return (
    <div className="page-container games-page">
      <div className="games-toolbar">
        <div className="games-summary">
          <span>{categories.length} juegos</span>
        </div>

        <div className="games-toolbar-actions">
          <button
            className="game-create-button"
            type="button"
            disabled={!token}
            title={token ? "Importar juego" : "Inicia sesión para crear juegos"}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Añadir juego
          </button>

          {canManageGames && (
            <button
              type="button"
              className={`game-manage-toggle ${isManageMode ? "active" : ""}`}
              onClick={() => setIsManageMode(!isManageMode)}
            >
              <div className="toggle-text-wrapper">
                <span className="toggle-text-default">Modificar</span>
                <span className="toggle-text-active">Terminar edición</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {actionStatus && <p className="grid-status-text">{actionStatus}</p>}
      {!token && <p className="grid-status-text">Inicia sesión para crear juegos.</p>}
      
      {loading && <p className="grid-status-text">Cargando categorías...</p>}
      {error && <p className="grid-status-text">{error}</p>}

      {!loading && !error && categories.length === 0 && (
        <p className="grid-status-text">Aún no hay categorías registradas.</p>
      )}

      {!loading && categories.length > 0 && (
        <div className="games-grid">
          {categories.map((category) => (
            <GameCard
              key={category.id}
              game={{
                id: category.id,
                name: category.name,
                image: category.thumbnail_horizontal_url || "https://placehold.co/460x215/222/white?text=Sin+Imagen",
              }}
              canManageGames={canManageGames}
              isManageMode={isManageMode}
              onEdit={openEditModal}
              onDelete={handleDeleteCategory}
              isDeleting={deletingCategoryId === category.id}
            />
          ))}
        </div>
      )}

      {isCreateModalOpen && !editingCategory && (
        <GameImportModal
          onClose={() => setIsCreateModalOpen(false)}
          onImportSuccess={() => {
            refreshGames();
          }}
        />
      )}

      {editingCategory && (
        <GameCreateModal
          creating={updating}
          title={"Modificar juego"}
          newGameName={newCategoryName}
          onClose={closeModal}
          onSubmit={handleUpdateCategory}
          setNewGameName={setNewCategoryName}
        />
      )}
    </div>
  );
};

export default GamesPage;