import React from "react";
import { MdCloudUpload, MdCheckCircle, MdError } from "react-icons/md";
import "../VideoEditModal.css";

const UploadStatusSection = ({ status, files, currentUploadIndex, errorMessage, onRetry }) => {
  return (
    <div className="modal-status-centered">
      {status === "uploading" && (
        <div className="upload-status uploading">
          <MdCloudUpload className="icon-spin" />
          <span className="file-name-scroll">
            {files[currentUploadIndex - 1]?.name || "Preparando archivo..."}
          </span>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${(currentUploadIndex / files.length) * 100}%` }}
            ></div>
          </div>
          <p className="upload-status-text">
            Subiendo clip <strong>{currentUploadIndex}</strong> de <strong>{files.length}</strong>...
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="upload-status success">
          <MdCheckCircle />
          <span>¡Todos los vídeos se han subido con éxito!</span>
        </div>
      )}

      {status === "error" && (
        <div className="upload-status error">
          <MdError className="modal-error-icon" />
          <span>Error al procesar la solicitud</span>
          <p className="error-message">{errorMessage}</p>
          <button onClick={onRetry} className="btn-retry">
            Corregir campos
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadStatusSection;