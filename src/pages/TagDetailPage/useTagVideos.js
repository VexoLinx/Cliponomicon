import { useCallback, useEffect, useState } from "react";
import { useSearch } from "../../context/SearchContext";
import { listVideos } from "../../services/api/videos.api";
import { mapVideoToCard, VIDEO_PROCESSING_STATUSES } from "../../services/mappers/video.mapper";

const LIMIT = 20;

export const useTagVideos = (tagId) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [error, setError] = useState(null);
  const { filters } = useSearch();

  const fetchTagVideos = useCallback(async (currentOffset, append = false) => {
    if (!tagId) return;

    try {
      if (append) setIsFetchingNextPage(true);

      const data = await listVideos({
        tagIds: [tagId],
        title: filters.scope === "tag-detail" ? filters.text : undefined,
        categoryIds:
          filters.scope === "tag-detail" && filters.categoryIds?.length
            ? filters.categoryIds
            : undefined,
        ownerId: filters.scope === "tag-detail" ? filters.ownerId : undefined,
        createdDate: filters.scope === "tag-detail" ? filters.createdDate || undefined : undefined,
        createdFrom: filters.scope === "tag-detail" ? filters.createdFrom || undefined : undefined,
        createdTo: filters.scope === "tag-detail" ? filters.createdTo || undefined : undefined,
        edited:
          filters.scope === "tag-detail" && filters.edited !== ""
            ? filters.edited === "true"
            : undefined,
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
      console.error("Error fetching tag videos:", err);
      setError("No se pudieron cargar los videos de este tag.");
    } finally {
      setLoading(false);
      setIsFetchingNextPage(false);
    }
  }, [
    filters.categoryIds,
    filters.createdDate,
    filters.createdFrom,
    filters.createdTo,
    filters.edited,
    filters.ownerId,
    filters.scope,
    filters.text,
    tagId,
  ]);

  useEffect(() => {
    if (!tagId) return;
    setLoading(true);
    setVideos([]);
    setOffset(0);
    setHasMore(true);
    fetchTagVideos(0, false);
  }, [fetchTagVideos, tagId]);

  const loadMoreVideos = useCallback(() => {
    if (isFetchingNextPage || !hasMore) return;
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchTagVideos(nextOffset, true);
  }, [fetchTagVideos, hasMore, isFetchingNextPage, offset]);

  return { error, hasMore, isFetchingNextPage, loadMoreVideos, loading, videos };
};
