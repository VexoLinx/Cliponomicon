import { MdFileUpload, MdCheckCircle, MdCloudUpload } from "react-icons/md";
import React, { useState, useRef } from "react";
import "./VideoUploader.css";

const VideoUploader = () => {
  const [status, setStatus] = useState("idle"); // idle, uploading, success
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const startUpload = (file) => {
    if (!file || !file.type.startsWith("video/")) return;

    setFileName(file.name);
    setStatus("uploading");

    // --- Simulación de subida automática ---
    // Aquí es donde integrarías tu llamada a la API (fetch/axios)
    setTimeout(() => {
      setStatus("success");
      
      // Volver al estado inicial después de 3 segundos
      setTimeout(() => {
        setStatus("idle");
        setFileName("");
      }, 3000);
    }, 2500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    startUpload(file);
  };

  return (
    <div className="video-upload-container">
      {status === "idle" && (
        <div className="upload-dropzone" onClick={() => fileInputRef.current.click()}>
          <MdFileUpload />
          <span>Seleccionar Vídeo</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="video/*" 
            hidden 
          />
        </div>
      )}

      {status === "uploading" && (
        <div className="upload-status uploading">
          <MdCloudUpload className="icon-spin" />
          <span className="file-name-scroll">{fileName}</span>
          <div className="progress-bar-container">
            <div className="progress-bar-fill"></div>
          </div>
          <p>Subiendo...</p>
        </div>
      )}

      {status === "success" && (
        <div className="upload-status success">
          <MdCheckCircle />
          <span>¡Vídeo enviado!</span>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;