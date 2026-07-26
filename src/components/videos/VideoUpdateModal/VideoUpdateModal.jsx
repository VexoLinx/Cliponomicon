import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { IoClose, IoCut } from "react-icons/io5";
import { MdCloudUpload, MdError } from "react-icons/md";
import { listCategories } from "../../../services/api/categories.api";
import "./VideoUpdateModal.css";
import "../videos.css";

const VideoUpdateModal = ({
  status,
  video,
  title,
  setTitle,
  description,
  setDescription,
  isEdited,
  setIsEdited,
  categoryId,
  setCategoryId,
  categoriesList = [],
  errorMessage,
  onClose,
  onSave,
  onDelete,
  onRetry,
}) => {
  const [localCategories, setLocalCategories] = useState(categoriesList);

  const handleVideoLoad = (e) => {
    const { videoWidth, videoHeight } = e.currentTarget;
    e.currentTarget.style.aspectRatio = `${videoWidth} / ${videoHeight}`;
  };

  useEffect(() => {
    const fetchFreshCategories = async () => {
      try {
        const data = await listCategories();
        setLocalCategories(data);
      } catch (err) {
        console.error(
          "Error actualizando lista de categorías en el modal:",
          err,
        );
      }
    };

    if (categoriesList.length === 0) {
      fetchFreshCategories();
    } else {
      setLocalCategories(categoriesList);
    }

    window.addEventListener("categories_updated", fetchFreshCategories);
    return () => {
      window.removeEventListener("categories_updated", fetchFreshCategories);
    };
  }, [categoriesList]);

  useEffect(() => {
    if (!categoryId && video?.gameName && localCategories.length > 0) {
      const match = localCategories.find(
        (cat) => cat.name.toLowerCase() === video.gameName.toLowerCase(),
      );

      if (match) {
        setCategoryId(String(match.id));
      }
    }
  }, [video?.gameName, localCategories, categoryId, setCategoryId]);

  if (!video) return null;

  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      onClick={status === "editing" || status === "error" ? onClose : undefined}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {status === "editing" && (
          <>
            <div className="modal-video-container">
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

                <select
                  className="edit-select-category"
                  value={categoryId || ""}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">General</option>
                  {localCategories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </option>
                  ))}
                </select>

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

                <button
                  type="button"
                  className={`edit-feature-btn ${isEdited ? "active" : ""}`}
                  onClick={() => setIsEdited(!isEdited)}
                >
                  <div className="icon-wrapper">
                    <IoCut />
                  </div>
                  <div className="text-content">
                    <span className="btn-title">Contenido con Edición</span>
                    <span className="btn-subtitle">
                      Memes, efectos, sonidos...
                    </span>
                  </div>
                  <div className="status-indicator">
                    {isEdited ? "Activado" : "Desactivado"}
                  </div>
                </button>

                {errorMessage && (
                  <p className="error-text-sidebar">{errorMessage}</p>
                )}
              </div>

              <div className="sidebar-footer-video">
                {onDelete && (
                  <button className="footer-btn delete-btn" onClick={onDelete}>
                    Eliminar Clip
                  </button>
                )}
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

            {status === "deleting" && (
              <div className="upload-status deleting">
                <MdCloudUpload className="icon-spin" />
                <span className="file-name-scroll">Eliminando clip...</span>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill fill-complete"></div>
                </div>
                <p className="status-message">
                  Borrando el archivo del servidor de forma permanente.
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="upload-status success">
                <span className="status-title">¡Operación exitosa!</span>
                <p className="status-message">
                  Los cambios se han aplicado correctamente.
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="upload-status error">
                <MdError className="modal-error-icon" />
                <span className="status-title">Error en la solicitud</span>
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
