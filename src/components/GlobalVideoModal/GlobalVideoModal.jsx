import VideoUpdateModal from "../VideoUpdateModal/VideoUpdateModal";
import { useVideoModal } from "../../context/VideoContext";
import { useAuth } from "../../context/AuthContext";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { CiLink } from "react-icons/ci";
import ReactDOM from "react-dom";
import "./GlobalVideoModal.css";

const GlobalVideoModal = () => {
  const { activeVideo, closeVideo } = useVideoModal();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState("editing"); // "editing", "updating", "deleting", "success", "error"
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsRegistered, setEditIsRegistered] = useState(false);
  const [updateError, setUpdateError] = useState("");

  if (!activeVideo) return null;

  const videoOwner = activeVideo.userHandle
    ?.replace("@", "")
    .toLowerCase()
    .trim();
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
            title: editTitle,
            description: editDescription,
            is_registered_only: editIsRegistered,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Error al actualizar");

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
    if (
      !window.confirm(
        "¿Estás seguro de que quieres eliminar este clip permanentemente?",
      )
    ) {
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
        },
      );

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

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={closeVideo}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-video-container">
          <video
            ref={videoRef}
            key={activeVideo.videoUrl}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="main-video"
            src={activeVideo.videoUrl}
          />
        </div>

        <div className="modal-sidebar">
          <div className="sidebar-header-video">
            <span className="now-playing">NOW PLAYING</span>
            <button className="close-btn" onClick={closeVideo}>
              <IoClose />
            </button>
          </div>

          <div className="sidebar-info">
            <h2 className="video-title-modal">{activeVideo.title}</h2>
            <div className="video-meta-row">
              <span className="user-handle-modal">
                {activeVideo.userHandle}
              </span>
              <span className="meta-separator">|</span>
              <span className="video-date-modal">{activeVideo.date}</span>
            </div>
            <p className="game-name-modal">{activeVideo.gameName}</p>
            <div className="video-context-box">
              <p>
                {activeVideo.context ||
                  "Aquí irá la descripción o contexto del video..."}
              </p>
            </div>
          </div>

          <div className="sidebar-footer-video">
            <button
              className="footer-btn copy-btn"
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
            >
              <CiLink />
            </button>

            {canEdit && (
              <button className="footer-btn edit-btn" onClick={handleOpenEdit}>
                Editar
              </button>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <VideoUpdateModal
          status={editStatus}
          video={activeVideo}
          title={editTitle}
          setTitle={setEditTitle}
          description={editDescription}
          setDescription={setEditDescription}
          isRegisteredOnly={editIsRegistered}
          setIsRegisteredOnly={setEditIsRegistered}
          errorMessage={updateError}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveChanges}
          onDelete={handleDeleteVideo}
          onRetry={() => setEditStatus("editing")}
        />
      )}
    </div>,
    document.body,
  );
};

export default GlobalVideoModal;
