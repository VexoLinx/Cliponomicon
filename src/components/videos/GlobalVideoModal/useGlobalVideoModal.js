import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useVideoModal } from "../../../context/VideoContext";
import { useAuth } from "../../../context/AuthContext";

export const useGlobalVideoModal = () => {
  const { activeVideo, closeVideo } = useVideoModal();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState("editing"); 
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsRegistered, setEditIsRegistered] = useState(false);
  const [updateError, setUpdateError] = useState("");

  if (!activeVideo) {
    return { activeVideo: null };
  }

  const videoOwner = activeVideo.userHandle?.replace("@", "").toLowerCase().trim();
  const currentUser = user?.username?.replace("@", "").toLowerCase().trim();
  const currentUserId = user?.id?.toLowerCase().trim();

  const canEdit =
    token &&
    user &&
    (user.role === "super_admin" ||
      (currentUser && videoOwner && currentUser === videoOwner) ||
      (currentUserId && videoOwner && currentUserId.startsWith(videoOwner)));

  const handleOpenEdit = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setEditTitle(activeVideo.title || "");
    setEditDescription(activeVideo.context || "");
    setEditIsRegistered(activeVideo.isRegisteredOnly || false);
    setEditStatus("editing");
    setUpdateError("");
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    setEditStatus("updating");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/videos/${activeVideo.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editTitle.trim(),
            description: editDescription.trim() || null,
            is_registered_only: Boolean(editIsRegistered),
            category_ids: activeVideo.categories?.map((c) => c.id) || [],
            tags: activeVideo.tags?.map((t) => t.name) || [],
          }),
        }
      );

      if (response.status === 401) {
        window.dispatchEvent(new Event("auth-expired"));
        throw new Error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
      }

      const data = await response.json();
      if (!response.ok) {
        console.error("Detalles del error 422 del servidor:", data.detail);
        throw new Error(data.detail?.[0]?.msg || "Error al actualizar");
      }

      setEditStatus("success");
      window.dispatchEvent(new Event("videos-changed"));

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
    if (!window.confirm("¿Estás seguro de que quieres eliminar este clip permanentemente?")) {
      return;
    }

    setEditStatus("deleting");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/videos/${activeVideo.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        window.dispatchEvent(new Event("auth-expired"));
        throw new Error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Error al eliminar el archivo");
      }

      setEditStatus("success");
      window.dispatchEvent(new Event("videos-changed"));

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
    updateError,
    handleOpenEdit,
    handleSaveChanges,
    handleDeleteVideo,
  };
};