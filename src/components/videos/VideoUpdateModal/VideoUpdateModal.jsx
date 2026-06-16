import React, { useState } from "react";
import ReactDOM from "react-dom";
import { IoClose } from "react-icons/io5";
import {
  MdCloudUpload,
  MdError,
} from "react-icons/md";
import "./VideoUpdateModal.css";

const VideoUpdateModal = ({
  status,
  video,
  title,
  setTitle,
  description,
  setDescription,
  isRegisteredOnly,
  setIsRegisteredOnly,
  errorMessage,
  onClose,
  onSave,
  onDelete,
  onRetry,
}) => {
  const [aspectRatio, setAspectRatio] = useState("16 / 9");

  const handleVideoLoad = (e) => {
    const { videoWidth, videoHeight } = e.currentTarget;
    setAspectRatio(`${videoWidth} / ${videoHeight}`);
  };

  if (!video) return null;

  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      onClick={status === "editing" || status === "error" ? onClose : undefined}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {status === "editing" && (
          <>
            <div
              className="modal-video-container"
              style={{ "--video-aspect-ratio": aspectRatio }}
            >
              <video
                controls
                className="main-video"
                src={video.videoUrl}
                onLoadedMetadata={handleVideoLoad}
              />
            </div>

            <div className="modal-sidebar">
              <div className="sidebar-header-video">
                <span className="now-playing">EDITAR CLIP</span>
                <button className="close-btn" onClick={onClose}>
                  <IoClose />
                </button>
              </div>

              <div className="sidebar-info">
                <label className="input-label">Título del vídeo *</label>
                <input
                  type="text"
                  className="edit-input-title"
                  maxLength={255}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Modifica el título..."
                />

                <div className="video-meta-row">
                  <span className="user-handle-modal">
                    {video.userHandle || "@usuario"}
                  </span>
                  <span className="meta-separator">|</span>
                  <span className="video-date-modal">{video.date}</span>
                </div>

                <label className="input-label">Descripción o Contexto</label>
                <div className="video-context-box spec-edit">
                  <textarea
                    className="edit-textarea-context"
                    maxLength={5000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Actualiza los detalles o el contexto de tu clip..."
                  />
                </div>

                <div className="checkbox-wrapper">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isRegisteredOnly}
                      onChange={(e) => setIsRegisteredOnly(e.target.checked)}
                      className="real-checkbox"
                    />
                    <span className="custom-checkbox-edit"></span>
                    <span className="checkbox-text">Clip Editado</span>
                  </label>
                </div>

                {errorMessage && (
                  <p className="error-text-sidebar">{errorMessage}</p>
                )}
              </div>

              <div className="sidebar-footer-video">
                <button className="footer-btn delete-btn" onClick={onDelete}>
                  Eliminar Clip
                </button>
                <div className="sidebar-footer-buttons-group">
                  <button className="footer-btn cancel-btn" onClick={onClose}>
                    Cancelar
                  </button>
                  <button className="footer-btn upload-btn" onClick={onSave}>
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {status !== "editing" && (
          <div className="modal-status-centered">
            {status === "updating" && (
              <div className="upload-status uploading">
                <MdCloudUpload className="icon-spin" />
                <span className="file-name-scroll">
                  Actualizando metadata...
                </span>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill"></div>
                </div>
                <p>Guardando los nuevos cambios en el servidor...</p>
              </div>
            )}

            {status === "error" && (
              <div className="upload-status error">
                <MdError className="modal-error-icon" />
                <span>Error en la solicitud</span>
                <p className="error-message">{errorMessage}</p>
                <button onClick={onRetry} className="btn-retry">
                  Reintentar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default VideoUpdateModal;