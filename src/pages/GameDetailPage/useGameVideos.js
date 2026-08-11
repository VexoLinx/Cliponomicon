import { useState, useEffect, useCallback } from "react";
import { useSearch } from "../../context/SearchContext";
import { listVideos } from "../../services/api/videos.api";
import { getVideoSortParams } from "../../services/api/videoSort";
import { mapVideoToCard, VIDEO_PROCESSING_STATUSES } from "../../services/mappers/video.mapper";

const LIMIT = 20;

export const useGameVideos = (categoryId) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [error, setError] = useState(null);
  const { filters } = useSearch();

  const fetchGameVideos = useCallback(async (currentOffset, append = false) => {
    if (!categoryId) return;

    try {
      if (append) setIsFetchingNextPage(true);

      const data = await listVideos({
        categoryIds: [categoryId],
        title: filters.scope === "game-detail" ? filters.text : undefined,
        tagIds:
          filters.scope === "game-detail" && filters.tagIds?.length
            ? filters.tagIds
            : undefined,
        ownerId: filters.scope === "game-detail" ? filters.ownerId : undefined,
        createdDate: filters.scope === "game-detail" ? filters.createdDate || undefined : undefined,
        createdFrom: filters.scope === "game-detail" ? filters.createdFrom || undefined : undefined,
        createdTo: filters.scope === "game-detail" ? filters.createdTo || undefined : undefined,
        edited:
          filters.scope === "game-detail" && filters.edited !== ""
            ? filters.edited === "true"
            : undefined,
        ...getVideoSortParams(filters.scope === "game-detail" ? filters.sort : "newest"),
        limit: LIMIT,
        offset: currentOffset,
        mapToCards: false,
      });

      const items = data.items || [];
      const readyItems = items.filter(
        (video) => !VIDEO_PROCESSING_STATUSES.includes(video.processing_status),
      );
      const mappedItems = readyItems.map(mapVideoToCard);

      setVideos((prev) => (append ? [...prev, ...mappedItems] : mappedItems));
      setHasMore(currentOffset + items.length < (data.total ?? currentOffset + items.length));
      setError(null);
    } catch (err) {
      console.error("Error fetching game videos:", err);
      setError("No se pudieron cargar los videos de este juego.");
    } finally {
      setLoading(false);
      setIsFetchingNextPage(false);
    }
  }, [
    categoryId,
    filters.createdDate,
    filters.createdFrom,
    filters.createdTo,
    filters.edited,
    filters.ownerId,
    filters.scope,
    filters.sort,
    filters.tagIds,
    filters.text,
  ]);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    setVideos([]);
    setOffset(0);
    setHasMore(true);
    fetchGameVideos(0, false);
  }, [categoryId, fetchGameVideos]);

  const loadMoreVideos = useCallback(() => {
    if (isFetchingNextPage || !hasMore) return;
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchGameVideos(nextOffset, true);
  }, [offset, isFetchingNextPage, hasMore, fetchGameVideos]);

  return { videos, loading, error, hasMore, isFetchingNextPage, loadMoreVideos };
};
