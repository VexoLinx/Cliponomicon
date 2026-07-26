import { useState, useEffect, useCallback } from "react";
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";
import { listVideos } from "../../services/api/videos.api";
import { mapVideoToCard } from "../../services/mappers/video.mapper";
import { APP_EVENTS, onAppEvent } from "../../events/appEvents";

const LIMIT = 20;

export const useHomeVideos = () => {
  const [videos, setVideos] = useState([]);
  const [statusText, setStatusText] = useState("Cargando videos...");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const { filters } = useSearch();
  const { token } = useAuth();

  const loadVideos = useCallback(async (currentOffset, append = false, signal = null) => {
    try {
      if (append) setIsFetchingNextPage(true);

      const data = await listVideos({
        token,
        signal,
        title: filters.text,
        ownerId: filters.ownerId,
        categoryIds: filters.categoryIds?.length ? filters.categoryIds : undefined,
        tagIds: filters.tagIds?.length ? filters.tagIds : undefined,
        createdDate: filters.createdDate || undefined,
        createdFrom: filters.createdFrom || undefined,
        createdTo: filters.createdTo || undefined,
        edited: filters.edited === "" ? undefined : filters.edited === "true",
        limit: LIMIT,
        offset: currentOffset,
      });

      const mappedItems = Array.isArray(data.items) ? data.items : [];

      setVideos((prev) => (append ? [...prev, ...mappedItems] : mappedItems));
      setHasMore(currentOffset + mappedItems.length < (data.total ?? currentOffset + mappedItems.length));
      setStatusText(!append && mappedItems.length === 0 ? "No hay videos disponibles." : "");
    } catch (error) {
      if (error.name === "AbortError") return;
      setStatusText(error.message);
    } finally {
      if (append) setIsFetchingNextPage(false);
    }
  }, [filters, token]);

  useEffect(() => {
    const controller = new AbortController();
    setStatusText("Cargando videos...");
    setVideos([]);
    setOffset(0);
    setHasMore(true);

    loadVideos(0, false, controller.signal);

    return () => controller.abort();
  }, [loadVideos]);

  const loadMoreVideos = useCallback(() => {
    if (isFetchingNextPage || !hasMore) return;
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    loadVideos(nextOffset, true);
  }, [offset, isFetchingNextPage, hasMore, loadVideos]);

  useEffect(() => {
    const handleVideosRefresh = () => {
      setOffset(0);
      setHasMore(true);
      loadVideos(0, false);
    };
    return onAppEvent(APP_EVENTS.VIDEOS_CHANGED, handleVideosRefresh);
  }, [loadVideos]);

  useEffect(() => {
    const handleVideoUpdated = (event) => {
      const updatedVideo = event.detail;
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === updatedVideo.id ? mapVideoToCard({ ...video, ...updatedVideo }) : video,
        ),
      );
    };

    const handleVideoDeleted = (event) => {
      const deletedId = event.detail.id;
      setVideos((prevVideos) => prevVideos.filter((video) => video.id !== deletedId));
    };

    const unsubscribeUpdated = onAppEvent(APP_EVENTS.VIDEO_UPDATED, handleVideoUpdated);
    const unsubscribeDeleted = onAppEvent(APP_EVENTS.VIDEO_DELETED, handleVideoDeleted);

    return () => {
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
  }, []);

  return { videos, statusText, loadMoreVideos, hasMore, isFetchingNextPage };
};
