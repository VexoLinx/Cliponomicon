import { useState, useEffect } from "react";

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

    const mainCategory = video.categories?.[0] || video.category;

    return {
        id: video.id,
        thumbnail: getVideoThumbnailUrl(video.id),
        gameIcon: mainCategory?.thumbnail_horizontal_url || 
                  mainCategory?.horizontal_thumbnail_url || 
                  mainCategory?.thumbnail_url || 
                  "https://via.placeholder.com/40",
        title: video.title,
        gameName: mainCategory?.name || "Sin categoría",
        date: formatVideoDate(video.created_at),
        duration: formatDuration(video.duration_seconds),
        rating: String(video.favorite_count ?? 0),
        userHandle: finalUserHandle,
        linkText: "enlace",
        context: video.description || "",
        videoUrl: getVideoStreamUrl(video.id),
    };
};

export const useHomeVideos = () => {
    const [videos, setVideos] = useState([]);
    const [statusText, setStatusText] = useState("Cargando videos...");

    const loadVideos = async (signal = null) => {
        try {
            const response = await fetch(VIDEOS_URL, {
                headers: {
                    Accept: "application/json",
                },
                signal: signal,
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

        loadVideos(controller.signal);

        const handleVideosRefresh = () => {
            loadVideos();
        };

        window.addEventListener("videos-changed", handleVideosRefresh);

        return () => {
            controller.abort();
            window.removeEventListener("videos-changed", handleVideosRefresh);
        };
    }, []);

    return { videos, statusText };
};