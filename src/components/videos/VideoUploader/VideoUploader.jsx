import React, { useState, useEffect } from "react";
import VideoUploadButton from "./VideoUploadButton";
import VideoEditModal from "../VideoEditModal";
import { useVideoUpload } from "./useVideoUpload";
import "./VideoUploader.css";
import "../videos.css";

const VideoUploader = () => {
  const {
    status,
    setStatus,
    files,
    currentUploadIndex,
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

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/category`,
      );
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Error cargando categorías para el uploader:", err);
    }
  };

  useEffect(() => {
    fetchCategories();

    window.addEventListener("categories_updated", fetchCategories);
    return () => {
      window.removeEventListener("categories_updated", fetchCategories);
    };
  }, [status]);

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
          files={files}
          currentUploadIndex={currentUploadIndex}
          videoPreview={videoPreview}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          isRegisteredOnly={isRegisteredOnly}
          setIsRegisteredOnly={setIsRegisteredOnly}
          categoryId={selectedCategory}
          setCategoryId={setSelectedCategory}
          categories={categories}
          onRefreshCategories={fetchCategories}
          errorMessage={errorMessage}
          onClose={resetUploader}
          onUpload={() => handleUpload(selectedCategory)}
          onRetry={() => setStatus("editing")}
        />
      )}
    </div>
  );
};

export default VideoUploader;
