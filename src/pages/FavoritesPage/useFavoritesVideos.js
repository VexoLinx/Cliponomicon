import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";
import { listFavoriteVideos } from "../../services/api/interactions.api";
import { APP_EVENTS, onAppEvent } from "../../events/appEvents";

const LIMIT = 20;

export const useFavoritesVideos = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const { token, user } = useAuth();
  const { filters } = useSearch();

  const fetchFavorites = useCallback(async (currentOffset, append = false) => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      if (append) setIsFetchingNextPage(true);

      const data = await listFavoriteVideos({
        token,
        limit: LIMIT,
        offset: currentOffset,
      });

      const mappedItems = data.items || [];
      const visibleItems =
        filters.scope === "favorites" && filters.text
          ? mappedItems.filter((video) =>
              [
                video.title,
                video.context,
                video.description,
                video.gameName,
                video.userHandle,
              ]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(filters.text.toLowerCase())),
            )
          : mappedItems;

      setFavorites((prev) => (append ? [...prev, ...visibleItems] : visibleItems));
      setHasMore(currentOffset + mappedItems.length < (data.total ?? currentOffset + mappedItems.length));
    } catch (error) {
      console.error("Error cargando favoritos:", error);
    } finally {
      setLoading(false);
      setIsFetchingNextPage(false);
    }
  }, [filters.scope, filters.text, token]);

  useEffect(() => {
    setLoading(true);
    setFavorites([]);
    setOffset(0);
    setHasMore(true);

    fetchFavorites(0, false);

    const handleFavoritesRefresh = () => {
      setOffset(0);
      setHasMore(true);
      fetchFavorites(0, false);
    };

    return onAppEvent(APP_EVENTS.FAVORITES_CHANGED, handleFavoritesRefresh);
  }, [fetchFavorites, user?.id]);

  const loadMoreFavorites = useCallback(() => {
    if (isFetchingNextPage || !hasMore) return;

    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchFavorites(nextOffset, true);
  }, [offset, isFetchingNextPage, hasMore, fetchFavorites]);

  return {
    favorites,
    loading,
    hasMore,
    isFetchingNextPage,
    loadMoreFavorites,
    token,
  };
};
