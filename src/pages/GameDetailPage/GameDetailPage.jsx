import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoCard from "../../components/videos/VideoCard";

const GameDetailPage = () => {
  const { categoryId } = useParams();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameVideos = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/videos?category_ids=${categoryId}&limit=50`,
        );

        if (!response.ok) {
          throw new Error("Error al cargar los clips del juego");
        }

        const data = await response.json();
        setVideos(data.items || []);
      } catch (err) {
        console.error("Error fetching game videos:", err);
        setError("No se pudieron cargar los vídeos de este juego.");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchGameVideos();
    }
  }, [categoryId]);

  return (
    <div className="page-container">
      <h2 style={{ color: "white", marginBottom: "20px", marginLeft: "20px" }}>
        Clips de la categoría
      </h2>

      {loading && <p className="grid-status-text">Cargando clips...</p>}

      {error && <p className="grid-status-text">{error}</p>}

      {!loading && !error && videos.length === 0 && (
        <p className="grid-status-text">Aún no hay clips para este juego.</p>
      )}

      {!loading && videos.length > 0 && (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video.id} data={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameDetailPage;
