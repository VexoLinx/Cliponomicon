import { useState, useEffect, useCallback } from "react";
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";
import { listVideos } from "../../services/api/videos.api";
import { mapVideoToCard } from "../../services/mappers/video.mapper";

const LIMIT = 20;

export const useHomeVideos = () => {
  const [videos, setVideos] = useState([]);
  const [statusText, setStatusText] = useState("Cargando videos...");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const { filters } = useSearch();
  const { token } = useAuth();

  const loadVideos = async (currentOffset, append = false, signal = null) => {
    try {
      if (append) setIsFetchingNextPage(true);

      const data = await listVideos({
        token,
        signal,
        title: filters.text,
        ownerId: filters.ownerId,
        tagIds: filters.tagId ? [filters.tagId] : undefined,
        limit: LIMIT,
        offset: currentOffset,
      });

      const mappedItems = Array.isArray(data.items) ? data.items : [];

      if (append) {
        setVideos((prev) => [...prev, ...mappedItems]);
      } else {
        setVideos(mappedItems);
      }

      setHasMore(currentOffset + mappedItems.length < (data.total ?? currentOffset + mappedItems.length));
      setStatusText(!append && mappedItems.length === 0 ? "No hay videos disponibles." : "");
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
  }, [filters, token]);

  const loadMoreVideos = useCallback(() => {
    if (isFetchingNextPage || !hasMore) return;
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    loadVideos(nextOffset, true);
  }, [offset, isFetchingNextPage, hasMore, filters, token]);

  useEffect(() => {
    const handleVideosRefresh = () => {
      setOffset(0);
      setHasMore(true);
      loadVideos(0, false);
    };
    window.addEventListener("videos-changed", handleVideosRefresh);
    return () => window.removeEventListener("videos-changed", handleVideosRefresh);
  }, [filters, token]);

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

    window.addEventListener("video-updated", handleVideoUpdated);
    window.addEventListener("video-deleted", handleVideoDeleted);

    return () => {
      window.removeEventListener("video-updated", handleVideoUpdated);
      window.removeEventListener("video-deleted", handleVideoDeleted);
    };
  }, []);

  return { videos, statusText, loadMoreVideos, hasMore, isFetchingNextPage };
};
