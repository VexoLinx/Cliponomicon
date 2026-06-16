import React, { useRef } from "react";
import { MdFileUpload } from "react-icons/md";

const VideoUploadButton = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || !selectedFile.type.startsWith("video/")) {
      alert("Por favor, selecciona un archivo de vídeo válido.");
      return;
    }
    onFileSelect(selectedFile);
  };

  return (
    <div
      className="upload-dropzone"
      onClick={() => fileInputRef.current.click()}
    >
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
  );
};

export default VideoUploadButton;
