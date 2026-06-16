import React from "react";
import ReactDOM from "react-dom";
import { IoClose } from "react-icons/io5";
import { CiLink } from "react-icons/ci";
import VideoUpdateModal from "../VideoUpdateModal/VideoUpdateModal";
import { useGlobalVideoModal } from "./useGlobalVideoModal";
import "./GlobalVideoModal.css";

const GlobalVideoModal = () => {
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
    updateError,
    handleOpenEdit,
    handleSaveChanges,
    handleDeleteVideo,
  } = useGlobalVideoModal();

  if (!activeVideo) return null;

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
                {activeVideo.userHandle || "@usuario"}
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
              onClick={() => navigator.clipboard.writeText(window.location.href)}
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
    document.body
  );
};

export default GlobalVideoModal;