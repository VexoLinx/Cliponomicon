import VideoCard from "../../components/VideoCard/VideoCard";
import React, { useEffect, useState } from "react";
import "./HomePage.css";

const API_URL = import.meta.env.VITE_API_URL || "";
const VIDEOS_URL = `${API_URL}/videos`;

// Endpoint dinámico para el streaming del vídeo
const getVideoStreamUrl = (videoId) =>
  `${API_URL}/videos/${videoId}/stream?variant_type=original`;

// Endpoint real de la API para obtener la miniatura de la imagen
const getVideoThumbnailUrl = (videoId) =>
  `${API_URL}/videos/${videoId}/thumbnail`;

// Formateador de fecha
const formatVideoDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Formateador de duración (Convierte "duration_seconds" a MM:SS)
const formatDuration = (seconds) => {
  if (seconds === undefined || seconds === null || seconds === 0) return ""; 
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const mapApiVideoToCard = (video) => {
  // Como la API solo devuelve el UUID en 'owner_id', recortamos un fragmento para que no sea tan largo
  // Ej: "3fa85f64-5717..." -> "@3fa85f64" hasta que el backend devuelva el nombre real.
  const shortId = video.owner_id ? `@${video.owner_id.substring(0, 8)}` : "@usuario";

  return {
    id: video.id,
    // 1. Corregido: Usamos el endpoint de miniaturas de tu documentación
    thumbnail: getVideoThumbnailUrl(video.id), 
    gameIcon: "https://placehold.co/40x40", 
    title: video.title,
    gameName: video.categories?.[0]?.name || "Sin categoria",
    date: formatVideoDate(video.created_at),
    // 2. Corregido: El campo oficial según tus esquemas es 'duration_seconds'
    duration: formatDuration(video.duration_seconds), 
    rating: String(video.favorite_count ?? 0),
    // 3. Explicación: La API no provee strings de nombres aquí, solo el UUID
    userHandle: shortId, 
    linkText: "enlace",
    context: video.description || "",
    videoUrl: getVideoStreamUrl(video.id),
  };
};

function HomePage() {
  const [videos, setVideos] = useState([]);
  const [statusText, setStatusText] = useState("Cargando videos...");

  useEffect(() => {
    const controller = new AbortController();

    const loadVideos = async () => {
      try {
        const response = await fetch(VIDEOS_URL, {
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
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

    loadVideos();

    return () => controller.abort();
  }, []);

  return (
    <div className="video-grid">
      {statusText && <p>{statusText}</p>}
      {videos.map((video) => (
        <VideoCard key={video.id} data={video} />
      ))}
    </div>
  );
}

export default HomePage;