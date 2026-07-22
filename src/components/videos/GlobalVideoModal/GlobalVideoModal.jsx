import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { IoStar, IoStarOutline, IoClose, IoSettingsSharp } from "react-icons/io5"; // 🔥 Añadimos icono de ajustes
import { useAuth } from "../../../context/AuthContext";
import { CiLink } from "react-icons/ci";
import VideoUpdateModal from "../VideoUpdateModal/VideoUpdateModal";
import { useGlobalVideoModal } from "./useGlobalVideoModal";
import "./GlobalVideoModal.css";

const GlobalVideoModal = () => {
  const { token } = useAuth();
  const [showToast, setShowToast] = useState(false);

  const {
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
    editIsEdited,
    setEditIsEdited,
    categoriesList,
    updateError,
    handleOpenEdit,
    handleSaveChanges,
    handleDeleteVideo,
    isFavorite,
    toggleFavorite,
  } = useGlobalVideoModal();

  const [videoVariant, setVideoVariant] = useState("original");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (activeVideo) {
      setVideoVariant(activeVideo.edited ? "edited" : "original");
      setShowSettings(false);
    }
  }, [activeVideo]);

  if (!activeVideo) return null;

  const currentStreamUrl = `${import.meta.env.VITE_API_URL}/videos/${activeVideo.id}/stream?variant_type=${videoVariant}`;

  const handleVideoError = () => {
    if (videoVariant !== "low_h264") {
      console.warn("El formato original no es soportado por este navegador. Cambiando a low_h264 automáticamente...");
      setVideoVariant("low_h264");
    }
  };

  const handleCopyLink = (e) => {
    e.stopPropagation();
    const clipUrl = `${import.meta.env.VITE_API_URL}/clip/${activeVideo.id}`;

    navigator.clipboard
      .writeText(clipUrl)
      .then(() => {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Fallo al copiar el enlace del endpoint:", error);
        navigator.clipboard
          .writeText(window.location.href)
          .catch((err) => console.error("También falló el fallback:", err));
      });
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={closeVideo}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-video-container" style={{ position: "relative" }}>
          
          {activeVideo.edited && (
            <div
              className="edited-bookmark modal-bookmark"
              title="Este clip está editado"
            >
              <span className="bookmark-text">EDIT</span>
            </div>
          )}

          <div className="quality-settings-container">
            <button
              className="quality-settings-btn"
              onClick={() => setShowSettings(!showSettings)}
              title="Ajustes de calidad"
            >
              <IoSettingsSharp />
            </button>

            {showSettings && (
              <div className="quality-settings-menu">
                <div className="quality-settings-header">Calidad de video</div>
                <div
                  className={`quality-option ${videoVariant === "original" || videoVariant === "edited" ? "active" : ""}`}
                  onClick={() => {
                    setVideoVariant(activeVideo.edited ? "edited" : "original");
                    setShowSettings(false);
                  }}
                >
                  Original
                </div>
                <div
                  className={`quality-option ${videoVariant === "low_h264" ? "active" : ""}`}
                  onClick={() => {
                    setVideoVariant("low_h264");
                    setShowSettings(false);
                  }}
                >
                  Baja (low_h264)
                </div>
              </div>
            )}
          </div>

          <video
            ref={videoRef}
            key={currentStreamUrl}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="main-video"
            src={currentStreamUrl}
            onError={handleVideoError}
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
                {activeVideo.userHandle || "@usuario"}
              </span>
              <span className="meta-separator">|</span>
              <span className="video-date-modal">{activeVideo.date}</span>
            </div>

            <p className="game-name-modal">
              {activeVideo.gameName || "General"}
            </p>

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
              onClick={handleCopyLink}
              title="Copiar enlace"
            >
              <CiLink />
            </button>

            {token && (
              <button
                className={`footer-btn favorite-btn ${isFavorite ? "is-favorite" : ""}`}
                onClick={toggleFavorite}
              >
                {isFavorite ? (
                  <IoStar className="star-icon" />
                ) : (
                  <IoStarOutline className="star-icon" />
                )}
                <span>{isFavorite ? "Favorito" : "Añadir a favoritos"}</span>
              </button>
            )}

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
          isEdited={editIsEdited}
          setIsEdited={setEditIsEdited}
          categoryId={editCategoryId}
          setCategoryId={setEditCategoryId}
          categoriesList={categoriesList || []}
          errorMessage={updateError}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveChanges}
          onDelete={handleDeleteVideo}
          onRetry={() => setEditStatus("editing")}
        />
      )}

      {showToast && <div className="copy-toast">Enlace copiado</div>}
    </div>,
    document.body
  );
};

export default GlobalVideoModal;