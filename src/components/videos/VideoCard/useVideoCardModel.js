import { getVideoStreamUrl } from "../../../services/api/videoMedia.api";
import { getAvatarUrl } from "../../../services/api/users.api";
import { pickVideoVariant } from "../../../services/mappers/video.mapper";

const formatDate = (isoString) => {
  if (!isoString) return "";

  const cleanDate = isoString.includes("T") 
    ? isoString 
    : isoString.replace(/-/g, "/");

  return new Date(cleanDate)
    .toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .replace(".", "");
};

export const useVideoCardModel = ({
  categoryIcon,
  categoryName,
  data,
  videoCore,
  videoId,
}) => {
  const isEdited = videoCore?.edited === true || data?.edited === true;

  const rawDate =
    videoCore?.source_created_at ||
    data?.source_created_at ||
    videoCore?.created_at ||
    data?.created_at;

  const formattedDate = videoCore?.date || (rawDate ? formatDate(rawDate) : "");

  const userHandle = videoCore?.owner?.username
    ? `@${videoCore.owner.username}`
    : videoCore?.userHandle || data?.userHandle || "@usuario";
  const ownerId = videoCore?.owner?.id || videoCore?.userId || videoCore?.user_id || data?.userId || data?.user_id;
  const ownerAvatarUrl =
    videoCore?.ownerAvatarUrl ||
    data?.ownerAvatarUrl ||
    (ownerId ? getAvatarUrl(ownerId) : "");
  const tags = Array.isArray(videoCore?.tags) ? videoCore.tags : data?.tags || [];

  return {
    card: {
      date: formattedDate || "Reciente",
      durationSeconds: videoCore?.duration_seconds ?? data?.duration_seconds ?? 0,
      isEdited,
      ratingToShow:
        videoCore?.rating !== undefined
          ? videoCore.rating
          : videoCore?.popularity_score || data?.rating || 0,
      title: videoCore?.title || data?.title || "Sin titulo",
      userHandle,
      ownerId,
      ownerAvatarUrl,
      tags,
    },
    modalVideo: {
      ...videoCore,
      id: videoId,
      videoUrl:
        videoCore?.videoUrl ||
        data?.videoUrl ||
        getVideoStreamUrl(videoId, pickVideoVariant(videoCore)),
      title: videoCore?.title || data?.title || "Clip de Video",
      context: videoCore?.description || videoCore?.context || data?.description || "",
      isRegisteredOnly:
        videoCore?.is_registered_only ??
        videoCore?.isRegisteredOnly ??
        data?.is_registered_only ??
        false,
      edited: isEdited,
      gameName: categoryName,
      gameIcon: categoryIcon,
      userHandle,
      ownerId,
      ownerAvatarUrl,
      tags,
      date: formattedDate,
    },
  };
};
