import React from "react";
import VideoUploadButton from "./VideoUploadButton";
import VideoEditModal from "../VideoEditModal";
import { useVideoUpload } from "./useVideoUpload";
import "./VideoUploader.css";

const VideoUploader = () => {
  const {
    status,
    setStatus,
    file,
    videoPreview,
    title,
    setTitle,
    description,
    setDescription,
    isRegisteredOnly,
    setIsRegisteredOnly,
    errorMessage,
    handleFileSelect,
    handleUpload,
    resetUploader,
  } = useVideoUpload();

  return (
    <div className="video-uploader-wrapper">
      {status === "idle" && (
        <>
          <div className="tool-title">Subir nuevo contenido</div>
          <VideoUploadButton onFileSelect={handleFileSelect} />
        </>
      )}
      {status !== "idle" && (
        <VideoEditModal
          status={status}
          file={file}
          videoPreview={videoPreview}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          isRegisteredOnly={isRegisteredOnly}
          setIsRegisteredOnly={setIsRegisteredOnly}
          errorMessage={errorMessage}
          onClose={resetUploader}
          onUpload={handleUpload}
          onRetry={() => setStatus("editing")}
        />
      )}
    </div>
  );
};

export default VideoUploader;
