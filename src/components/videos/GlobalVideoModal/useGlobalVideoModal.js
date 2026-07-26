import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVideoModal } from "../../../context/VideoContext";
import { useAuth } from "../../../context/AuthContext";
import { apiRequest } from "../../../services/api/http";

export const useGlobalVideoModal = () => {
  const { activeVideo, closeVideo } = useVideoModal();
  const { token } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState("editing");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsRegistered, setEditIsRegistered] = useState(false);
  const [editIsEdited, setEditIsEdited] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(Boolean(activeVideo?.is_favorite ?? activeVideo?.isFavorite));
  }, [activeVideo]);

  if (!activeVideo) {
    return { activeVideo: null };
  }

  const canEdit = token && Boolean(activeVideo.can_edit ?? activeVideo.canEdit ?? activeVideo.is_owner);
  const canDelete = token && Boolean(activeVideo.can_delete ?? activeVideo.canDelete ?? activeVideo.is_owner);

  const toggleFavorite = async () => {
    if (!token) {
      alert("Debes iniciar sesion para guardar favoritos.");
      return;
    }

    const method = isFavorite ? "DELETE" : "POST";

    try {
      await apiRequest(`/interactions/videos/${activeVideo.id}/favorite`, {
        token,
        method,
      });

      setIsFavorite(!isFavorite);
      window.dispatchEvent(new Event("favorites-changed"));
    } catch (err) {
      console.error("Error de red al gestionar favoritos:", err);
    }
  };

  const handleOpenEdit = () => {
    if (!activeVideo) return;

    setEditTitle(activeVideo.title || "");
    setEditDescription(activeVideo.description || activeVideo.context || "");
    setEditIsRegistered(activeVideo.is_registered_only || activeVideo.isRegisteredOnly || false);
    setEditIsEdited(activeVideo.edited || false);
    setEditCategoryId(activeVideo.categories?.[0]?.id || activeVideo.category?.id || "");
    setEditStatus("editing");
    setUpdateError("");
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    setEditStatus("updating");
    setUpdateError("");

    try {
      const payload = {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
        is_registered_only: Boolean(editIsRegistered),
        edited: Boolean(editIsEdited),
        tag_ids: activeVideo.tags?.map((tag) => tag.id).filter(Boolean) || [],
      };

      if (editCategoryId) {
        payload.category_ids = [editCategoryId];
      }

      const data = await apiRequest(`/videos/${activeVideo.id}`, {
        token,
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      setEditStatus("success");
      window.dispatchEvent(new CustomEvent("video-updated", { detail: data }));

      setTimeout(() => {
        setIsEditing(false);
        closeVideo();
        navigate("/");
      }, 1500);
    } catch (err) {
      setUpdateError(err.message);
      setEditStatus("error");
    }
  };

  const handleDeleteVideo = async () => {
    if (!window.confirm("Seguro que quieres eliminar este clip permanentemente?")) {
      return;
    }

    setEditStatus("deleting");
    setUpdateError("");

    try {
      await apiRequest(`/videos/${activeVideo.id}`, {
        token,
        method: "DELETE",
        fallbackError: "Error al eliminar el archivo",
      });

      setEditStatus("success");
      window.dispatchEvent(new CustomEvent("video-deleted", {
        detail: { id: activeVideo.id },
      }));

      setTimeout(() => {
        setIsEditing(false);
        closeVideo();
        navigate("/");
      }, 1500);
    } catch (err) {
      setUpdateError(err.message);
      setEditStatus("error");
    }
  };

  return {
    activeVideo,
    closeVideo,
    videoRef,
    canEdit,
    canDelete,
    isEditing,
    setIsEditing,
    editStatus,
    setEditStatus,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    editIsRegistered,
    setEditIsRegistered,
    editIsEdited,
    setEditIsEdited,
    editCategoryId,
    setEditCategoryId,
    updateError,
    handleOpenEdit,
    handleSaveChanges,
    handleDeleteVideo,
    isFavorite,
    toggleFavorite,
  };
};
