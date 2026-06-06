import VideoCard from "../../components/VideoCard/VideoCard";
import React, { useEffect, useState } from "react";
import "./HomePage.css";

const API_URL = import.meta.env.VITE_API_URL || "";
const VIDEOS_URL = `${API_URL}/videos`;
const getVideoStreamUrl = (videoId) =>
  `${API_URL}/videos/${videoId}/stream?variant_type=original`;

const formatVideoDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const mapApiVideoToCard = (video) => ({
  id: video.id,
  thumbnail: "https://placehold.co/300x170",
  gameIcon: "https://placehold.co/40x40",
  title: video.title,
  gameName: video.categories?.[0]?.name || "Sin categoria",
  date: formatVideoDate(video.created_at),
  duration: "",
  rating: String(video.favorite_count ?? 0),
  userHandle: video.owner_id ? `@${video.owner_id}` : "@usuario",
  linkText: "enlace",
  context: video.description || "",
  videoUrl: getVideoStreamUrl(video.id),
});

function HomePage() {
  const [videos, setVideos] = useState([]);
  const [statusText, setStatusText] = useState("Cargando videos...");

  useEffect(() => {
    const controller = new AbortController();

    const loadVideos = async () => {
      try {
        console.log("Videos API_URL:", API_URL);
        console.log("Videos URL:", VIDEOS_URL);

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
