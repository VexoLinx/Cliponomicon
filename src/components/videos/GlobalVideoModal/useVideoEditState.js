import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_EVENTS, emitAppEvent } from "../../../events/appEvents";
import { deleteVideo, updateVideo } from "../../../services/api/videos.api";

export const useVideoEditState = ({ activeVideo, closeVideo, token }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState("editing");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsRegistered, setEditIsRegistered] = useState(false);
  const [editIsEdited, setEditIsEdited] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState("");
  const [updateError, setUpdateError] = useState("");

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

  const closeAfterSuccess = () => {
    setTimeout(() => {
      setIsEditing(false);
      closeVideo();
      navigate("/");
    }, 1500);
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

      const data = await updateVideo(activeVideo.id, payload, { token });
      setEditStatus("success");
      emitAppEvent(APP_EVENTS.VIDEO_UPDATED, data);
      closeAfterSuccess();
    } catch (error) {
      setUpdateError(error.message);
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
      await deleteVideo(activeVideo.id, {
        token,
        fallbackError: "Error al eliminar el archivo",
      });

      setEditStatus("success");
      emitAppEvent(APP_EVENTS.VIDEO_DELETED, { id: activeVideo.id });
      closeAfterSuccess();
    } catch (error) {
      setUpdateError(error.message);
      setEditStatus("error");
    }
  };

  return {
    editCategoryId,
    editDescription,
    editIsEdited,
    editIsRegistered,
    editStatus,
    editTitle,
    handleDeleteVideo,
    handleOpenEdit,
    handleSaveChanges,
    isEditing,
    setEditCategoryId,
    setEditDescription,
    setEditIsEdited,
    setEditIsRegistered,
    setEditStatus,
    setEditTitle,
    setIsEditing,
    updateError,
  };
};
