import { apiRequest } from "./http";
import { mapVideoListToCards, mapVideoToCard } from "../mappers/video.mapper";

export const listVideos = async ({
  token,
  title,
  ownerId,
  categoryIds,
  tagIds,
  createdDate,
  createdFrom,
  createdTo,
  edited,
  sortBy,
  sortDirection,
  limit = 20,
  offset = 0,
  signal,
  mapToCards = true,
} = {}) => {
  const data = await apiRequest("/videos", {
    token,
    signal,
    params: {
      title,
      owner_id: ownerId,
      category_ids: categoryIds,
      tag_ids: tagIds,
      created_date: createdDate,
      created_from: createdFrom,
      created_to: createdTo,
      edited,
      sort_by: sortBy,
      sort_direction: sortDirection,
      limit,
      offset,
    },
  });

  return mapToCards ? mapVideoListToCards(data) : data;
};

export const getVideo = async (videoId, { token, mapToCard = false } = {}) => {
  const data = await apiRequest(`/videos/${videoId}`, { token });
  return mapToCard ? mapVideoToCard(data) : data;
};

export const uploadVideo = (formData, { token, idempotencyKey, fallbackError } = {}) =>
  apiRequest("/videos", {
    method: "POST",
    token,
    body: formData,
    fallbackError,
    headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
  });

export const updateVideo = (videoId, payload, { token } = {}) =>
  apiRequest(`/videos/${videoId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });

export const deleteVideo = (videoId, { token, fallbackError } = {}) =>
  apiRequest(`/videos/${videoId}`, {
    method: "DELETE",
    token,
    fallbackError,
  });

export const retryVideoProcessing = (videoId, { token } = {}) =>
  apiRequest(`/videos/${videoId}/processing/retry`, {
    method: "POST",
    token,
  });
