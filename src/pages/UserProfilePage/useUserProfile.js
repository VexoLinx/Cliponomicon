import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { listVideos } from "../../services/api/videos.api";
import { getVideoSortParams } from "../../services/api/videoSort";
import { getAvatarUrl, getUser } from "../../services/api/users.api";

const LIMIT = 20;

export const useUserProfile = (userId) => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!userId) return;

    try {
      const user = await getUser(userId, { token });
      setProfile(user);
    } catch (err) {
      setError(token ? "No se pudo cargar este perfil." : "Inicia sesion para ver perfiles de usuario.");
      console.error("Error cargando perfil:", err);
    }
  }, [token, userId]);

  const loadVideos = useCallback(async (currentOffset, append = false) => {
    if (!userId) return;

    try {
      if (append) setIsFetchingNextPage(true);

      const data = await listVideos({
        token,
        ownerId: userId,
        ...getVideoSortParams("newest"),
        limit: LIMIT,
        offset: currentOffset,
      });

      const mappedItems = data.items || [];
      setVideos((prev) => (append ? [...prev, ...mappedItems] : mappedItems));
      setHasMore(currentOffset + mappedItems.length < (data.total ?? currentOffset + mappedItems.length));
    } catch (err) {
      setError("No se pudieron cargar los clips de este usuario.");
      console.error("Error cargando clips del usuario:", err);
    } finally {
      setLoading(false);
      setIsFetchingNextPage(false);
    }
  }, [token, userId]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setProfile(null);
    setVideos([]);
    setOffset(0);
    setHasMore(true);

    Promise.all([loadProfile(), loadVideos(0, false)]).finally(() => setLoading(false));
  }, [loadProfile, loadVideos]);

  const loadMoreVideos = useCallback(() => {
    if (isFetchingNextPage || !hasMore) return;
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    loadVideos(nextOffset, true);
  }, [hasMore, isFetchingNextPage, loadVideos, offset]);

  return {
    avatarUrl: profile?.hasAvatar ? getAvatarUrl(userId) : null,
    error,
    hasMore,
    isFetchingNextPage,
    loadMoreVideos,
    loading,
    profile,
    videos,
  };
};
