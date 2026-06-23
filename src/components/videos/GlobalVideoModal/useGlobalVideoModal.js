import { useState, useRef, useEffect } from "react";
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

  const [editCategoryId, setEditCategoryId] = useState("");

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!activeVideo || !token) {
      setIsFavorite(false);
      return;
    }

    const checkIfFavorite = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me/video-favorites?limit=100`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const isFav = data.items?.some((item) => item.id === activeVideo.id);
          setIsFavorite(!!isFav);
        }
      } catch (err) {
        console.error("Error al comprobar favoritos:", err);
      }
    };

    checkIfFavorite();
  }, [activeVideo, token]);

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

  const toggleFavorite = async () => {
    if (!token) {
      alert("Debes iniciar sesión para guardar favoritos.");
      return;
    }

    const method = isFavorite ? "DELETE" : "POST";
    const url = `${import.meta.env.VITE_API_URL}/videos/${activeVideo.id}/favorite`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        window.dispatchEvent(new Event("auth-expired"));
        return;
      }

      if (response.status === 204) {
        setIsFavorite(!isFavorite);
        window.dispatchEvent(new Event("favorites-changed"));
      } else {
        const data = await response.json();
        console.error("Error en la petición de favoritos:", data.detail);
      }
    } catch (err) {
      console.error("Error de red al gestionar favoritos:", err);
    }
  };

  const handleOpenEdit = () => {
    if (!activeVideo) return;

    setEditTitle(activeVideo.title || "");
    setEditDescription(activeVideo.description || "");
    setEditIsRegistered(activeVideo.is_registered_only || false);

    setEditCategoryId("");

    setEditStatus("editing");
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
            category_ids: editCategoryId ? [editCategoryId] : [],
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
    editCategoryId,
    setEditCategoryId,
    updateError,
    handleOpenEdit,
    handleSaveChanges,
    handleDeleteVideo,
    isFavorite,
    toggleFavorite
  };
};