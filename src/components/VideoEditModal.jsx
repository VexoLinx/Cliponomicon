import React, { useState } from "react";
import ReactDOM from "react-dom";
import { IoClose } from "react-icons/io5";
import { MdCloudUpload, MdCheckCircle, MdError } from "react-icons/md";

const VideoEditModal = ({
  status,
  file,
  videoPreview,
  title,
  setTitle,
  description,
  setDescription,
  isRegisteredOnly,
  setIsRegisteredOnly,
  errorMessage,
  onClose,
  onUpload,
  onRetry,
}) => {
  // Estado para guardar la relación de aspecto dinámica (por defecto 16/9)
  const [aspectRatio, setAspectRatio] = useState("16 / 9");

  const handleVideoLoad = (e) => {
    const { videoWidth, videoHeight } = e.currentTarget; // Calculamos y guardamos la relación exacta (Ej: 1920 / 1080)
    setAspectRatio(`${videoWidth} / ${videoHeight}`);
  };

  return ReactDOM.createPortal(
    <div 
      className="modal-overlay" 
      onClick={status === "editing" || status === "error" ? onClose : undefined}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {status === "editing" && (
          <>
            {/* Le pasamos la relación de aspecto dinámica calculada por inline style */}
            <div className="modal-video-container" style={{ aspectRatio: aspectRatio }}>
              <video 
                controls 
                className="main-video" 
                src={videoPreview} 
                onLoadedMetadata={handleVideoLoad} /* <--- Captura las dimensiones al cargar */
              />
            </div>

            <div className="modal-sidebar">
              <div className="sidebar-header-video">
                <span className="now-playing">CONFIGURAR SUBIDA</span>
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
                  placeholder="Escribe el título..."
                />

                <div className="video-meta-row">
                  <span className="user-handle-modal">NUEVO CLIP</span>
                  <span className="meta-separator">|</span>
                  <span className="video-date-modal">Formato detectado</span>
                </div>

                <label className="input-label">Descripción o Contexto *</label>
                <div className="video-context-box spec-edit">
                  <textarea 
                    className="edit-textarea-context"
                    maxLength={5000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Añade los detalles de tu jugada para la API..."
                  />
                </div>

                <div className="checkbox-wrapper">
                  <label 
                    className="checkbox-label" 
                    title="El clip contiene edición activa como memes, música, recortes o efectos visuales."
                  >
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
                
                {errorMessage && <p className="error-text-sidebar">{errorMessage}</p>}
              </div>

              <div className="sidebar-footer-video">
                <button className="footer-btn cancel-btn" onClick={onClose}>
                  Cancelar
                </button>
                <button className="footer-btn upload-btn" onClick={onUpload}>
                  Publicar Vídeo
                </button>
              </div>
            </div>
          </>
        )}

        {status !== "editing" && (
          <div className="modal-status-centered">
            {status === "uploading" && (
              <div className="upload-status uploading">
                <MdCloudUpload className="icon-spin" />
                <span className="file-name-scroll">{file?.name}</span>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill"></div>
                </div>
                <p>Subiendo clip a la base de datos...</p>
              </div>
            )}

            {status === "success" && (
              <div className="upload-status success">
                <MdCheckCircle />
                <span>¡Vídeo enviado con éxito!</span>
              </div>
            )}

            {status === "error" && (
              <div className="upload-status error">
                <MdError style={{ color: "#ef4444", fontSize: "3rem" }} />
                <span>Error al procesar la solicitud</span>
                <p className="error-message">{errorMessage}</p>
                <button onClick={onRetry} className="btn-retry">Corregir campos</button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>,
    document.body
  );
};

export default VideoEditModal;