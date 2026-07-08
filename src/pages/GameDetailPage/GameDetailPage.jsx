import React from "react";
import { useParams } from "react-router-dom";
import InfiniteVideoGrid from "../../components/videos/InfiniteVideoGrid/InfiniteVideoGrid";
import { useGameVideos } from "./useGameVideos";

const GameDetailPage = () => {
  const { categoryId } = useParams();
  const { 
    videos, 
    loading, 
    error, 
    hasMore, 
    isFetchingNextPage, 
    loadMoreVideos 
  } = useGameVideos(categoryId);

  if (loading) return <div className="page-container"><p className="grid-status-text">Cargando clips...</p></div>;
  if (error) return <div className="page-container"><p className="grid-status-text">{error}</p></div>;

  return (
    <div className="page-container">
      <InfiniteVideoGrid 
        videos={videos}
        statusText={videos.length === 0 ? "Aún no hay clips para este juego." : ""}
        hasMore={hasMore}
        isFetchingNextPage={isFetchingNextPage}
        loadMoreVideos={loadMoreVideos}
      />
    </div>
  );
};

export default GameDetailPage;