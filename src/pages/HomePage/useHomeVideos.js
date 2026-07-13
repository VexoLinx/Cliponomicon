import { useState, useEffect, useCallback } from "react";
import { useSearch } from "../../context/SearchContext";

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
        date: formatVideoDate(video.source_created_at),
        
        source_created_at: video.source_created_at,
        created_at: video.created_at,

        duration_seconds: video.duration_seconds,
        rating: String(video.favorite_count ?? 0),
        userHandle: finalUserHandle,
        linkText: "enlace",
        context: video.description || "",
        videoUrl: getVideoStreamUrl(video.id),
        processing_status: video.processing_status, 
    };
};

const LIMIT = 20;

export const useHomeVideos = () => {
    const [videos, setVideos] = useState([]);
    const [statusText, setStatusText] = useState("Cargando videos...");
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

    const { filters } = useSearch();

    const loadVideos = async (currentOffset, append = false, signal = null) => {
        try {
            if (append) setIsFetchingNextPage(true);

            const url = new URL(VIDEOS_URL);
            if (filters.text) url.searchParams.append("title", filters.text);
            if (filters.tag) url.searchParams.append("tags", filters.tag);

            url.searchParams.append("limit", LIMIT);
            url.searchParams.append("offset", currentOffset);

            const response = await fetch(url.toString(), {
                headers: { Accept: "application/json" },
                signal: signal,
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.detail || "Error al cargar videos");

            const items = Array.isArray(data.items) ? data.items : [];
            const mappedItems = items.map(mapApiVideoToCard);

            if (append) {
                setVideos(prev => [...prev, ...mappedItems]);
            } else {
                setVideos(mappedItems);
            }

            setHasMore(items.length === LIMIT);
            setStatusText(!append && items.length === 0 ? "No hay videos disponibles." : "");
        } catch (error) {
            if (error.name === "AbortError") return;
            setStatusText(error.message);
        } finally {
            if (append) setIsFetchingNextPage(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        setStatusText("Cargando videos...");
        setVideos([]);
        setOffset(0);
        setHasMore(true);

        loadVideos(0, false, controller.signal);

        return () => controller.abort();
    }, [filters]);

    const loadMoreVideos = useCallback(() => {
        if (isFetchingNextPage || !hasMore) return;
        const nextOffset = offset + LIMIT;
        setOffset(nextOffset);
        loadVideos(nextOffset, true);
    }, [offset, isFetchingNextPage, hasMore]);

    useEffect(() => {
        const handleVideosRefresh = () => {
            setOffset(0);
            setHasMore(true);
            loadVideos(0, false);
        };
        window.addEventListener("videos-changed", handleVideosRefresh);
        return () => window.removeEventListener("videos-changed", handleVideosRefresh);
    }, [filters]);

    return { videos, statusText, loadMoreVideos, hasMore, isFetchingNextPage };
};