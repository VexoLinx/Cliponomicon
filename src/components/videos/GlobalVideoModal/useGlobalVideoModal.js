import { useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useVideoModal } from "../../../context/VideoContext";
import { useFavoriteVideo } from "./useFavoriteVideo";
import { useVideoEditState } from "./useVideoEditState";

export const useGlobalVideoModal = () => {
  const { 
    activeVideo, 
    closeVideo, 
    playNext, 
    playPrev, 
    hasNext, 
    hasPrev 
  } = useVideoModal();
  
  const { token } = useAuth();
  const videoRef = useRef(null);

  const canEdit = token && Boolean(activeVideo?.can_edit ?? activeVideo?.canEdit ?? activeVideo?.is_owner);
  const canDelete = token && Boolean(activeVideo?.can_delete ?? activeVideo?.canDelete ?? activeVideo?.is_owner);

  const favorite = useFavoriteVideo({ activeVideo, token });
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
  };
};