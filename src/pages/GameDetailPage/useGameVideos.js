import { useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";
const LIMIT = 20;

const getVideoStreamUrl = (videoId) => `${API_URL}/videos/${videoId}/stream?variant_type=original`;
const getVideoThumbnailUrl = (videoId) => `${API_URL}/videos/${videoId}/thumbnail`;

const mapApiVideoToCard = (video) => {
  let finalUserHandle = "@usuario";
  if (video.owner?.username) finalUserHandle = `@${video.owner.username}`;
  const mainCategory = video.categories?.[0] || video.category;

  return {
    id: video.id,
    thumbnail: getVideoThumbnailUrl(video.id),
    gameIcon: mainCategory?.thumbnail_horizontal_url || "https://via.placeholder.com/40",
    title: video.title,
    gameName: mainCategory?.name || "Sin categoría",
    date: video.created_at ? new Date(video.created_at).toLocaleDateString("es-ES") : "",
    duration_seconds: video.duration_seconds, 
    rating: String(video.favorite_count ?? 0),
    userHandle: finalUserHandle,
    context: video.description || "",
    videoUrl: getVideoStreamUrl(video.id),
  };
};

export const useGameVideos = (categoryId) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [error, setError] = useState(null);

  const fetchGameVideos = async (currentOffset, append = false) => {
    try {
      if (append) setIsFetchingNextPage(true);

      const response = await fetch(
        `${API_URL}/videos?category_ids=${categoryId}&limit=${LIMIT}&offset=${currentOffset}`
      );

      if (!response.ok) throw new Error("Error al cargar los clips del juego");

      const data = await response.json();
      const items = data.items || [];
      
      const readyItems = items.filter(video => video.processing_status !== "pending");
      const mappedItems = readyItems.map(mapApiVideoToCard);

      if (append) {
        setVideos((prev) => [...prev, ...mappedItems]);
      } else {
        setVideos(mappedItems);
      }

      setHasMore(items.length === LIMIT);
    } catch (err) {
      console.error("Error fetching game videos:", err);
      setError("No se pudieron cargar los vídeos de este juego.");
    } finally {
      setLoading(false);
      setIsFetchingNextPage(false);
    }
  };

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    setVideos([]);
    setOffset(0);
    setHasMore(true);
    fetchGameVideos(0, false);
  }, [categoryId]);

  const loadMoreVideos = useCallback(() => {
    if (isFetchingNextPage || !hasMore) return;
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchGameVideos(nextOffset, true);
  }, [offset, isFetchingNextPage, hasMore, categoryId]);

  return { videos, loading, error, hasMore, isFetchingNextPage, loadMoreVideos };
};