import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";

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

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/interactions/me/video-favorites?limit=${LIMIT}&offset=${currentOffset}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                const items = data.items || [];

                if (append) {
                    setFavorites((prev) => [...prev, ...items]);
                } else {
                    setFavorites(items);
                }

                setHasMore(items.length === LIMIT);
            } else if (response.status === 401) {
                window.dispatchEvent(new Event("auth-expired"));
            }
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
        token
    };
};