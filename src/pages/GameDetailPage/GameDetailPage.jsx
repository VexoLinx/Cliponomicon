import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteVideoGrid from "../../components/videos/InfiniteVideoGrid/InfiniteVideoGrid";
import { useGameVideos } from "./useGameVideos";
import { listCategories } from "../../services/api/categories.api"; 
import "./GameDetailPage.css";

const GameDetailPage = () => {
  const { categoryId } = useParams();
  const [categoryInfo, setCategoryInfo] = useState(null);
  
  const { 
    videos, 
    loading, 
    error, 
    hasMore, 
    isFetchingNextPage, 
    loadMoreVideos 
  } = useGameVideos(categoryId);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await listCategories({});
        const currentCategory = data.find(cat => cat.id === categoryId);
        
        if (currentCategory) {
          setCategoryInfo(currentCategory);
        }
      } catch (err) {
        console.error("Error al obtener la categoría:", err);
      }
    };

    if (categoryId) fetchCategory();
  }, [categoryId]);

  if (loading && !categoryInfo) return <div className="page-container"><p className="grid-status-text">Cargando clips...</p></div>;
  if (error) return <div className="page-container"><p className="grid-status-text">{error}</p></div>;

  // Si no esta la imagen lo dejo vacio
  const bannerStyle = categoryInfo?.thumbnail_horizontal_url 
    ? { backgroundImage: `url(${categoryInfo.thumbnail_horizontal_url})` } 
    : {};

  return (
    <div className="page-container game-detail-page">
      
      {/* Cabecera con la imagen de fondo del juego */}
      <div className="game-detail-header" style={bannerStyle}>
        <div className="header-overlay">
          <h1 className="game-title">
            {categoryInfo ? categoryInfo.name : "Cargando..."}
          </h1>
          <div className="title-decorator"></div>
        </div>
      </div>

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