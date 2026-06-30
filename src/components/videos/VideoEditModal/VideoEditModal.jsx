import React from "react";
import ReactDOM from "react-dom";
import { IoClose } from "react-icons/io5";
import { FcInfo } from "react-icons/fc";

import VideoPreviewSection from "./components/VideoPreviewSection";
import CategoryCombobox from "./components/CategoryCombobox";
import UploadStatusSection from "./components/UploadStatusSection";

import "./VideoEditModal.css";
import "../videos.css";

const VideoEditModal = ({
  status,
  files = [],
  currentUploadIndex = 0,
  videoPreview,
  title,
  setTitle,
  description,
  setDescription,
  isRegisteredOnly,
  setIsRegisteredOnly,
  categoryId,
  setCategoryId,
  categories = [],
  onRefreshCategories,
  errorMessage,
  onClose,
  onUpload,
  onRetry,
}) => {
  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      onClick={status === "editing" || status === "error" ? onClose : undefined}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {status === "editing" && (
          <>
            <VideoPreviewSection files={files} videoPreview={videoPreview} />

            <div className="modal-sidebar">
              <div className="sidebar-header-video">
                <span className="now-playing">
                  {files.length > 1 ? "SUBIDA POR LOTES" : "CONFIGURAR SUBIDA"}
                </span>
                <button className="close-btn" onClick={onClose}>
                  <IoClose />
                </button>
              </div>

              <div className="sidebar-info">
                {files.length === 1 ? (
                  <>
                    <label className="input-label">Título del vídeo *</label>
                    <input
                      type="text"
                      className="edit-input-title"
                      maxLength={255}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Escribe el título..."
                    />
                  </>
                ) : (
                  <>
                    <label className="input-label">
                      Títulos de la Selección
                    </label>
                    <div className="selection-info-container">
                      <FcInfo className="info-icon" />
                      <div className="info-text-block">
                        Los clips heredarán automáticamente el nombre de su
                        archivo original como título provisional.
                      </div>
                    </div>
                  </>
                )}

                <CategoryCombobox
                  categoryId={categoryId}
                  setCategoryId={setCategoryId}
                  categories={categories}
                  onRefreshCategories={onRefreshCategories}
                />

                <label className="input-label">
                  Descripción {files.length > 1 ? "común del lote" : ""}
                </label>
                <div className="video-context-box spec-edit">
                  <textarea
                    className="edit-textarea-context"
                    maxLength={5000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      files.length > 1
                        ? "Se aplicará este contexto a todos los clips..."
                        : "Añade los detalles de tu jugada..."
                    }
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
                    <span className="checkbox-text">
                      {files.length > 1 ? "Clips Editados" : "Clip Editado"}
                    </span>
                  </label>
                </div>

                {errorMessage && (
                  <p className="error-text-sidebar">{errorMessage}</p>
                )}
              </div>

              <div className="sidebar-footer-video">
                <button className="footer-btn cancel-btn" onClick={onClose}>
                  Cancelar
                </button>
                <button className="footer-btn upload-btn" onClick={onUpload}>
                  {files.length > 1
                    ? `Publicar ${files.length} Vídeos`
                    : "Publicar Vídeo"}
                </button>
              </div>
            </div>
          </>
        )}

        {status !== "editing" && (
          <UploadStatusSection
            status={status}
            files={files}
            currentUploadIndex={currentUploadIndex}
            errorMessage={errorMessage}
            onRetry={onRetry}
          />
        )}
      </div>
    </div>,
    document.body,
  );
};

export default VideoEditModal;
