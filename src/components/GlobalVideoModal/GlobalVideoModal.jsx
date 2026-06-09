import React from "react";
import ReactDOM from "react-dom";
import { useVideoModal } from "../../context/VideoContext";
import { useAuth } from "../../context/AuthContext";
import { IoClose } from "react-icons/io5";
import "./GlobalVideoModal.css";
import { CiLink } from "react-icons/ci";

const GlobalVideoModal = () => {
  const { activeVideo, closeVideo } = useVideoModal();
  const { token, user } = useAuth(); 

  if (!activeVideo) return null;

// 1. Limpiamos y normalizamos los textos
  const videoOwner = activeVideo.userHandle?.replace("@", "").toLowerCase().trim();
  const currentUser = user?.username?.replace("@", "").toLowerCase().trim();
  const currentUserId = user?.id?.toLowerCase().trim();

  // 2. Comprobación inteligente de permisos
  const canEdit = token && user && (
    user.role === "super_admin" || 
    (currentUser && videoOwner && currentUser === videoOwner) || // Por si en el futuro arreglas el backend y devuelve "Vexo"
    (currentUserId && videoOwner && currentUserId.startsWith(videoOwner)) // Compara el UUID '0537ee91...' con el del vídeo
  );

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={closeVideo}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-video-container">
          <video
            key={activeVideo.videoUrl}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="main-video"
            src={activeVideo.videoUrl}
            onLoadedMetadata={(event) => {
              console.log("Video stream URL:", activeVideo.videoUrl);
              console.log("Video size:", {
                width: event.currentTarget.videoWidth,
                height: event.currentTarget.videoHeight,
              });
            }}
            onError={(event) => {
              console.error("Video playback error:", event.currentTarget.error);
            }}
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
            {/* 1. Título principal */}
            <h2 className="video-title-modal">{activeVideo.title}</h2>

            {/* 2. Línea de Usuario y Fecha */}
            <div className="video-meta-row">
              <span className="user-handle-modal">
                {activeVideo.userHandle}
              </span>
              <span className="meta-separator">|</span>
              <span className="video-date-modal">{activeVideo.date}</span>
            </div>

            {/* 3. Juego y Etiqueta */}
            <p className="game-name-modal">{activeVideo.gameName}</p>

            {/* 4. Recuadro de Contexto */}
            <div className="video-context-box">
              <p>
                {activeVideo.context ||
                  "Aquí irá la descripción o contexto del video..."}
              </p>
            </div>
          </div>

          {/* 5. Separador inferior y Botones */}
          <div className="sidebar-footer-video">
            <button
              className="footer-btn copy-btn"
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
            >
              <CiLink />
            </button>
            
            {/* 4. Renderizado condicional del botón Editar */}
            {canEdit && (
              <button className="footer-btn edit-btn">
                Editar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default GlobalVideoModal;