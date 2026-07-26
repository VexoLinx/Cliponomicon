import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../../services/api/http";
import { mapVideoToCard, VIDEO_PROCESSING_STATUSES } from "../../services/api/videoMapper";

const LIMIT = 20;

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

      const data = await apiRequest("/videos", {
        params: {
          category_ids: [categoryId],
          limit: LIMIT,
          offset: currentOffset,
        },
      });

      const items = data.items || [];
      const readyItems = items.filter(
        (video) => !VIDEO_PROCESSING_STATUSES.includes(video.processing_status),
      );
      const mappedItems = readyItems.map(mapVideoToCard);

      if (append) {
        setVideos((prev) => [...prev, ...mappedItems]);
      } else {
        setVideos(mappedItems);
      }

      setHasMore(currentOffset + items.length < (data.total ?? currentOffset + items.length));
    } catch (err) {
      console.error("Error fetching game videos:", err);
      setError("No se pudieron cargar los videos de este juego.");
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
