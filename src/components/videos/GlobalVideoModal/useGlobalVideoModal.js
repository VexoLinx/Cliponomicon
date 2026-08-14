import { useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useVideoModal } from "../../../context/VideoContext";
import { useFavoriteVideo } from "./useFavoriteVideo";
import { useVideoEditState } from "./useVideoEditState";
import { useVideoReactions } from "./useVideoReactions";
import { mapUser } from "../../../services/mappers/user.mapper";

export const useGlobalVideoModal = () => {
  const { 
    activeVideo, 
    closeVideo, 
    playNext, 
    playPrev, 
    hasNext, 
    hasPrev,
    updateActiveVideo,
  } = useVideoModal();
  
  const { token, user: rawUser } = useAuth();
  const user = mapUser(rawUser); 
  
  const videoRef = useRef(null);

  const normalizedRole = user?.role?.toString().toLowerCase() || "";
  const isSuperAdmin = normalizedRole === "superadmin" || normalizedRole === "super_admin";

  const currentUserId = user?.id;
  const videoOwnerId = activeVideo?.owner?.id ?? activeVideo?.userId ?? activeVideo?.user_id;

  const isOwnerById = Boolean(
    currentUserId && 
    videoOwnerId && 
    String(currentUserId) === String(videoOwnerId)
  );

  const currentUsername = (user?.username ?? "").toLowerCase();
  const videoOwnerUsername = (
    activeVideo?.owner?.username ?? 
    activeVideo?.userHandle ?? 
    activeVideo?.username ?? 
    ""
  ).toLowerCase().replace("@", "");

  const isOwnerByHandle = Boolean(
    currentUsername && 
    videoOwnerUsername && 
    currentUsername === videoOwnerUsername
  );

  const isOwner = isOwnerById || isOwnerByHandle;

  const canEdit = Boolean(token && (isSuperAdmin || isOwner));
  const canDelete = Boolean(token && (isSuperAdmin || isOwner));

  const favorite = useFavoriteVideo({ activeVideo, token });
  const reactions = useVideoReactions({ activeVideo, token, updateActiveVideo });
  const editing = useVideoEditState({ activeVideo, closeVideo, token });

  if (!activeVideo) {
    return { activeVideo: null };
  }

  return {
    activeVideo,
    canDelete,
    canEdit,
    closeVideo,
    videoRef,
    playNext,
    playPrev,
    hasNext,
    hasPrev,
    ...editing,
    ...favorite,
    ...reactions,
  };
};
