import React, { useState, useEffect } from "react";
import VideoUploadButton from "./VideoUploadButton";
import VideoEditModal from "../VideoEditModal";
import { useVideoUpload } from "./useVideoUpload";
import { listCategories } from "../../../services/api/categories.api";
import { listTags } from "../../../services/api/tags.api";
import { APP_EVENTS, onAppEvent } from "../../../events/appEvents";
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
    isEdited,
    setIsEdited,
    sourceCreatedAt,     
    setSourceCreatedAt, 
    selectedTagIds,
    setSelectedTagIds,
    errorMessage,
    handleFileSelect,
    handleUpload,
    resetUploader,
  } = useVideoUpload();

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchCategories = async () => {
    try {
      const data = await listCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error cargando categorías para el uploader:", err);
    }
  };

  const fetchTags = async () => {
    try {
      const data = await listTags();
      setTags(data);
    } catch (err) {
      console.error("Error cargando tags para el uploader:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTags();
    return onAppEvent(APP_EVENTS.CATEGORIES_UPDATED, fetchCategories);
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
          isEdited={isEdited}
          setIsEdited={setIsEdited}
          setIsRegisteredOnly={setIsRegisteredOnly}
          categoryId={selectedCategory}
          setCategoryId={setSelectedCategory}
          sourceCreatedAt={sourceCreatedAt}     
          setSourceCreatedAt={setSourceCreatedAt} 
          categories={categories}
          selectedTagIds={selectedTagIds}
          setSelectedTagIds={setSelectedTagIds}
          tags={tags}
          onRefreshCategories={fetchCategories}
          errorMessage={errorMessage}
          onClose={resetUploader}
          onUpload={() => handleUpload(selectedCategory, selectedTagIds)}
          onRetry={() => setStatus("editing")}
        />
      )}
    </div>
  );
};

export default VideoUploader;
