import React, { useRef } from "react";
import { MdFileUpload } from "react-icons/md";

const VideoUploadButton = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);    
    const videoFiles = selectedFiles.filter(file => file.type.startsWith("video/"));

    if (videoFiles.length === 0) {
      alert("Por favor, selecciona archivos de vídeo válidos.");
      return;
    }

    if (videoFiles.length !== selectedFiles.length) {
      alert("Se han omitido algunos archivos porque no eran formatos de vídeo admitidos.");
    }
    onFileSelect(videoFiles);
  };

  return (
    <div
      className="upload-dropzone"
      onClick={() => fileInputRef.current.click()}
      style={{ cursor: "pointer" }}
    >
      <MdFileUpload />
      <span>Seleccionar Vídeos</span>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        multiple
        hidden
      />
    </div>
  );
};

export default VideoUploadButton;