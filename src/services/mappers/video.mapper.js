import { getVideoStreamUrl, getVideoThumbnailUrl } from "../api/videoMedia.api";
import { mapCategories, mapCategory } from "./category.mapper";
import { mapReactionCounts } from "./interaction.mapper";
import { mapTags } from "./tag.mapper";

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

export const formatVideoDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const mapVideoToCard = (video) => {
  const categories = mapCategories(video.categories);
  const category = mapCategory(video.category);
  const mainCategory = categories?.[0] || category;
  const variantType = pickVideoVariant(video);
  const sourceDate = video.source_created_at || video.created_at;

  return {
    ...video,
    id: video.id,
    categories,
    category,
    tags: mapTags(video.tags),
    reactions: mapReactionCounts(video.reactions),
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

export const mapVideoListToCards = (data) => ({
  ...data,
  items: Array.isArray(data?.items) ? data.items.map(mapVideoToCard) : [],
});
