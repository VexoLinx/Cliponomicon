import React from "react";
import ReactDOM from "react-dom";
import { useVideoModal } from "../../helpers/VideoContext";
import { IoClose } from "react-icons/io5";
import "./GlobalVideoModal.css";

const GlobalVideoModal = () => {
  const { activeVideo, closeVideo } = useVideoModal();

  if (!activeVideo) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={closeVideo}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-video-container">
          <video controls autoPlay className="main-video">
            <source src={activeVideo.videoUrl} type="video/mp4" />
          </video>
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
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default GlobalVideoModal;
