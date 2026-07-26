import { apiRequest, buildApiUrl, resolveApiUrl } from "./http";

export const getVideoStreamUrl = (videoId, variantType = "low_h264") =>
  buildApiUrl(`/videos/${videoId}/stream`, { variant_type: variantType });

export const getVideoThumbnailUrl = (video) => {
  if (!video?.id) return "https://placehold.co/300x170";
  if (video?.thumbnail_url) return resolveApiUrl(video.thumbnail_url);
  return buildApiUrl(`/videos/${video.id}/thumbnail`);
};

export const getClipUrl = (videoId) => buildApiUrl(`/clip/${videoId}`);

export const getH264ClipUrl = (videoId) => buildApiUrl(`/clip/${videoId}/h264`);

export const getVideoDownloadUrl = (videoId) => buildApiUrl(`/videos/${videoId}/download`);

export const getVideoStreamResponse = (videoId, variantType = "low_h264", { token } = {}) =>
  apiRequest(`/videos/${videoId}/stream`, {
    token,
    params: { variant_type: variantType },
  });

export const getVideoThumbnailResponse = (videoId, { token } = {}) =>
  apiRequest(`/videos/${videoId}/thumbnail`, { token });

export const getClipResponse = (videoId, { token } = {}) =>
  apiRequest(`/clip/${videoId}`, { token });

export const getH264ClipResponse = (videoId, { token } = {}) =>
  apiRequest(`/clip/${videoId}/h264`, { token });

export const getVideoDownloadResponse = (videoId, { token } = {}) =>
  apiRequest(`/videos/${videoId}/download`, { token });

export const downloadVideoVariantBlob = async (videoId, variantType) => {
  const response = await getVideoStreamResponse(videoId, variantType);
  return response.blob();
};
