import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/api/http";
import { mapVideoToCard } from "../../services/api/videoMapper";

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

      const data = await apiRequest("/interactions/me/video-favorites", {
        token,
        params: { limit: LIMIT, offset: currentOffset },
      });

      const items = data.items || [];
      const mappedItems = items.map(mapVideoToCard);

      if (append) {
        setFavorites((prev) => [...prev, ...mappedItems]);
      } else {
        setFavorites(mappedItems);
      }

      setHasMore(currentOffset + items.length < (data.total ?? currentOffset + items.length));
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
