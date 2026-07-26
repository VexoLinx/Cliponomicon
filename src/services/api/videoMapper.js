import { buildApiUrl, resolveApiUrl } from "./http";

export const VIDEO_PROCESSING_STATUSES = ["pending", "processing"];

const PREFERRED_DESKTOP_VARIANTS = ["original", "original_h264", "original_av1", "low_h264"];
const PREFERRED_MOBILE_VARIANTS = ["low_h264", "original_h264", "original", "original_av1"];

export const getVideoVariantTypes = (video) => {
  const fromApi = video?.variants
    ?.map((variant) => variant.variant_type)
    .filter(Boolean);

  return [...new Set(fromApi?.length ? fromApi : ["low_h264", "original"])];
};

export const pickVideoVariant = (video, { mobile = false } = {}) => {
  const available = getVideoVariantTypes(video);
  const preferences = mobile ? PREFERRED_MOBILE_VARIANTS : PREFERRED_DESKTOP_VARIANTS;
  return preferences.find((variant) => available.includes(variant)) || available[0] || "low_h264";
};

export const getVideoStreamUrl = (videoId, variantType = "low_h264") =>
  buildApiUrl(`/videos/${videoId}/stream`, { variant_type: variantType });

export const getVideoThumbnailUrl = (video) => {
  if (!video?.id) return "https://placehold.co/300x170";
  if (video?.thumbnail_url) return resolveApiUrl(video.thumbnail_url);
  return buildApiUrl(`/videos/${video?.id}/thumbnail`);
};

export const getClipUrl = (videoId) => buildApiUrl(`/clip/${videoId}`);

export const formatVideoDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const mapVideoToCard = (video) => {
  const mainCategory = video.categories?.[0] || video.category;
  const variantType = pickVideoVariant(video);
  const sourceDate = video.source_created_at || video.created_at;

  return {
    ...video,
    id: video.id,
    thumbnail: getVideoThumbnailUrl(video),
    videoUrl: getVideoStreamUrl(video.id, variantType),
    gameIcon:
      mainCategory?.thumbnail_horizontal_url ||
      mainCategory?.thumbnail_vertical_url ||
      "https://placehold.co/40",
    gameName: mainCategory?.name || "Sin categoria",
    date: formatVideoDate(sourceDate),
    rating: String(video.favorite_count ?? 0),
    userHandle: video.owner?.username ? `@${video.owner.username}` : "@usuario",
    context: video.description || "",
    isProcessing: VIDEO_PROCESSING_STATUSES.includes(video.processing_status),
  };
};
