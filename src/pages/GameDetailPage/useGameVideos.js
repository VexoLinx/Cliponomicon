import { useState, useEffect, useCallback } from "react";
import { useSearch } from "../../context/SearchContext";
import { listVideos } from "../../services/api/videos.api";
import { getVideoSortParams } from "../../services/api/videoSort";
import { mapVideoToCard, VIDEO_PROCESSING_STATUSES } from "../../services/mappers/video.mapper";
import { APP_EVENTS, onAppEvent } from "../../events/appEvents";
import { getListCache, setListCache, clearListCache } from "../../hooks/listCache";

const LIMIT = 20;

export const useGameVideos = (categoryId) => {
  const { filters } = useSearch();
  const cacheKey = `game:${categoryId}:${JSON.stringify(filters)}`;

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [error, setError] = useState(null);

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

    const cachedData = getListCache(cacheKey);

    if (cachedData && cachedData.videos.length > 0) {
      setVideos(cachedData.videos);
      setOffset(cachedData.offset);
      setHasMore(cachedData.hasMore);
      setLoading(false);
    } else {
      setLoading(true);
      setVideos([]);
      setOffset(0);
      setHasMore(true);
      fetchGameVideos(0, false);
    }
  }, [categoryId, cacheKey, fetchGameVideos]);

  useEffect(() => {
    if (!loading && categoryId) {
      setListCache(cacheKey, { videos, offset, hasMore });
    }
  }, [cacheKey, videos, offset, hasMore, loading, categoryId]);

  const loadMoreVideos = useCallback(() => {
    if (isFetchingNextPage || !hasMore) return;
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchGameVideos(nextOffset, true);
  }, [offset, isFetchingNextPage, hasMore, fetchGameVideos]);

  useEffect(() => {
    const handleVideosRefresh = () => {
      clearListCache("game:");
      setOffset(0);
      setHasMore(true);
      fetchGameVideos(0, false);
    };
    return onAppEvent(APP_EVENTS.VIDEOS_CHANGED, handleVideosRefresh);
  }, [fetchGameVideos]);

  useEffect(() => {
    const handleVideoUpdated = (event) => {
      const updatedVideo = event.detail;
      setVideos((prev) =>
        prev.map((video) =>
          video.id === updatedVideo.id ? mapVideoToCard({ ...video, ...updatedVideo }) : video,
        ),
      );
    };
    const handleVideoDeleted = (event) => {
      const deletedId = event.detail.id;
      setVideos((prev) => prev.filter((video) => video.id !== deletedId));
    };

    const unsubscribeUpdated = onAppEvent(APP_EVENTS.VIDEO_UPDATED, handleVideoUpdated);
    const unsubscribeDeleted = onAppEvent(APP_EVENTS.VIDEO_DELETED, handleVideoDeleted);

    return () => {
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
  }, []);

  return { videos, loading, error, hasMore, isFetchingNextPage, loadMoreVideos };
};