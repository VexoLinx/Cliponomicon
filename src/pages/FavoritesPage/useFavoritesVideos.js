import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { listFavoriteVideos } from "../../services/api/interactions.api";

const LIMIT = 20;

export const useFavoritesVideos = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const { token, user } = useAuth();

  const fetchFavorites = async (currentOffset, append = false) => {
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

      if (append) {
        setFavorites((prev) => [...prev, ...mappedItems]);
      } else {
        setFavorites(mappedItems);
      }

      setHasMore(currentOffset + mappedItems.length < (data.total ?? currentOffset + mappedItems.length));
    } catch (error) {
      console.error("Error cargando favoritos:", error);
    } finally {
      setLoading(false);
      setIsFetchingNextPage(false);
    }
  };

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

    window.addEventListener("favorites-changed", handleFavoritesRefresh);
    return () => {
      window.removeEventListener("favorites-changed", handleFavoritesRefresh);
    };
  }, [token, user?.id]);

  const loadMoreFavorites = useCallback(() => {
    if (isFetchingNextPage || !hasMore) return;

    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchFavorites(nextOffset, true);
  }, [offset, isFetchingNextPage, hasMore]);

  return {
    favorites,
    loading,
    hasMore,
    isFetchingNextPage,
    loadMoreFavorites,
    token,
  };
};
