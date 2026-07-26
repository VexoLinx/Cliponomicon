import { useState, useEffect, useCallback } from "react";
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/api/http";
import { mapVideoToCard } from "../../services/api/videoMapper";

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

      const data = await apiRequest("/videos", {
        token,
        signal,
        params: {
          title: filters.text,
          owner_id: filters.ownerId,
          tag_ids: filters.tagId ? [filters.tagId] : undefined,
          limit: LIMIT,
          offset: currentOffset,
        },
      });

      const items = Array.isArray(data.items) ? data.items : [];
      const mappedItems = items.map(mapVideoToCard);

      if (append) {
        setVideos((prev) => [...prev, ...mappedItems]);
      } else {
        setVideos(mappedItems);
      }

      setHasMore(currentOffset + items.length < (data.total ?? currentOffset + items.length));
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
