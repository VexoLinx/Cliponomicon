import { getVideoThumbnailUrl } from "../../../services/api/videoMapper";

export const useVideoThumbnail = (video) => getVideoThumbnailUrl(video);
