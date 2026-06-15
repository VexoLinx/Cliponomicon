import VideoCard from "../../components/VideoCard/VideoCard";
import React, { useEffect, useState } from "react";
import "./HomePage.css";

const API_URL = import.meta.env.VITE_API_URL || "";
const VIDEOS_URL = `${API_URL}/videos`;

const getVideoStreamUrl = (videoId) =>
  `${API_URL}/videos/${videoId}/stream?variant_type=original`;

const getVideoThumbnailUrl = (videoId) =>
  `${API_URL}/videos/${videoId}/thumbnail`;

const formatVideoDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDuration = (seconds) => {
  if (seconds === undefined || seconds === null || seconds === 0) return ""; 
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const mapApiVideoToCard = (video) => {
  let finalUserHandle = "@usuario";
  
  if (video.owner?.username) {
    finalUserHandle = `@${video.owner.username}`;
  } else if (video.owner_id) {
    finalUserHandle = `@${video.owner_id.substring(0, 8)}`;
  }

  return {
    id: video.id,
    thumbnail: getVideoThumbnailUrl(video.id), 
    gameIcon: "https://placehold.co/40x40", 
    title: video.title,
    gameName: video.categories?.[0]?.name || "Sin categoria",
    date: formatVideoDate(video.created_at),
    duration: formatDuration(video.duration_seconds), 
    rating: String(video.favorite_count ?? 0),
    userHandle: finalUserHandle,
    linkText: "enlace",
    context: video.description || "",
    videoUrl: getVideoStreamUrl(video.id),
  };
};

function HomePage() {
  const [videos, setVideos] = useState([]);
  const [statusText, setStatusText] = useState("Cargando videos...");

  // Sacamos la función aquí para poder llamarla en la carga inicial Y cuando haya cambios
  const loadVideos = async (signal = null) => {
    try {
      const response = await fetch(VIDEOS_URL, {
        headers: {
          Accept: "application/json",
        },
        signal: signal, // El signal solo se usa en el desmontaje inicial
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error al cargar videos");
      }

      const items = Array.isArray(data.items) ? data.items : [];
      setVideos(items.map(mapApiVideoToCard));
      setStatusText(items.length ? "" : "No hay videos.");
    } catch (error) {
      if (error.name === "AbortError") return;
      setStatusText(error.message);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    // Carga inicial al montar la página
    loadVideos(controller.signal);

    // ESCUCHADOR: Si ocurre el evento "videos-changed", recargamos la lista silenciosamente
    const handleVideosRefresh = () => {
      loadVideos(); 
    };

    window.addEventListener("videos-changed", handleVideosRefresh);

    return () => {
      controller.abort();
      // Limpiamos el escuchador al desmontar el componente para evitar fugas de memoria
      window.removeEventListener("videos-changed", handleVideosRefresh);
    };
  }, []);

return (
  <>
    {statusText && <p className="grid-status-text">{statusText}</p>}
    
    {videos.length > 0 && (
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video.id} data={video} />
        ))}
      </div>
    )}
  </>
);
}

export default HomePage;