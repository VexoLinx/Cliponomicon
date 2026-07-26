import React from "react";
import InfiniteVideoGrid from "../../components/videos/InfiniteVideoGrid/InfiniteVideoGrid";
import { useFavoritesVideos } from "./useFavoritesVideos";
import "./FavoritesPage.css";

const FavoritesPage = () => {
  const {
    favorites,
    loading,
    hasMore,
    isFetchingNextPage,
    loadMoreFavorites,
    token,
  } = useFavoritesVideos();

  if (!token) {
    return (
      <div className="fav-message">Inicia sesión para ver tus favoritos.</div>
    );
  }

  if (loading) {
    return <div className="fav-message">Cargando tus clips favoritos...</div>;
  }

  return (
    <div className="favorites-container">
      <InfiniteVideoGrid
        videos={favorites}
        statusText={
          favorites.length === 0
            ? "Aún no has guardado ningún video en favoritos."
            : ""
        }
        hasMore={hasMore}
        isFetchingNextPage={isFetchingNextPage}
        loadMoreVideos={loadMoreFavorites}
      />
    </div>
  );
};

export default FavoritesPage;
