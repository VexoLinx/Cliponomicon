import { getVideoThumbnailUrl } from "../../../services/api/videoMedia.api";

export const useVideoThumbnail = (video) => getVideoThumbnailUrl(video);
