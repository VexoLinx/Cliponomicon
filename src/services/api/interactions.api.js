import { apiRequest } from "./http";
import { mapVideoListToCards } from "../mappers/video.mapper";
import { mapVideoReaction, mapVideoReactions } from "../mappers/interaction.mapper";

export const listFavoriteVideos = async ({
  token,
  limit = 20,
  offset = 0,
  mapToCards = true,
} = {}) => {
  const data = await apiRequest("/interactions/me/video-favorites", {
    token,
    params: { limit, offset },
  });

  return mapToCards ? mapVideoListToCards(data) : data;
};

export const favoriteVideo = (videoId, { token } = {}) =>
  apiRequest(`/interactions/videos/${videoId}/favorite`, {
    method: "POST",
    token,
  });

export const unfavoriteVideo = (videoId, { token } = {}) =>
  apiRequest(`/interactions/videos/${videoId}/favorite`, {
    method: "DELETE",
    token,
  });

export const listVideoReactions = async (videoId, { token, mapResponse = true } = {}) => {
  const data = await apiRequest(`/interactions/videos/${videoId}/reactions`, { token });
  return mapResponse ? mapVideoReactions(data) : data;
};

export const addVideoReaction = async (videoId, reactionType, { token, mapResponse = true } = {}) => {
  const data = await apiRequest(`/interactions/videos/${videoId}/reactions`, {
    method: "POST",
    token,
    body: JSON.stringify({ reaction_type: reactionType }),
  });
  return mapResponse ? mapVideoReaction(data) : data;
};

export const deleteVideoReaction = (videoId, { token } = {}) =>
  apiRequest(`/interactions/videos/${videoId}/reactions`, {
    method: "DELETE",
    token,
  });
