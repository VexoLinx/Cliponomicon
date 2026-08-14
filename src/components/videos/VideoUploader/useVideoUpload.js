import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { uploadVideo } from "../../../services/api/videos.api";
import { APP_EVENTS, emitAppEvent } from "../../../events/appEvents";

export const useVideoUpload = () => {
  const [status, setStatus] = useState("idle");
  const [files, setFiles] = useState([]);
  const [videoPreview, setVideoPreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isRegisteredOnly, setIsRegisteredOnly] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
  const [isEdited, setIsEdited] = useState(false);
  const [sourceCreatedAt, setSourceCreatedAt] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [videoPreview]);

  const handleFileSelect = (selectedFiles) => {
    const fileArray = Array.isArray(selectedFiles) ? selectedFiles : Array.from(selectedFiles);

    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    setFiles(fileArray);

    if (fileArray.length === 1) {
      setVideoPreview(URL.createObjectURL(fileArray[0]));
      setTitle(fileArray[0].name.replace(/\.[^/.]+$/, ""));
      if (fileArray[0].lastModified) {
          const fileDate = new Date(fileArray[0].lastModified).toISOString().split("T")[0];
          setSourceCreatedAt(fileDate);
      }
    } else {
      setVideoPreview("");
      setTitle("");
      setSourceCreatedAt("");
    }
    setStatus("editing");
  };

  const handleUpload = async (categoryId, tagIds = selectedTagIds) => {
    if (files.length === 1 && !title.trim()) {
      setErrorMessage("El titulo es obligatorio.");
      return;
    }

    setStatus("uploading");
    setErrorMessage("");

    try {
      for (let i = 0; i < files.length; i++) {
        setCurrentUploadIndex(i + 1);
        const currentFile = files[i];

        const formData = new FormData();
        formData.append("file", currentFile);
        formData.append("title", files.length === 1 ? title : currentFile.name.replace(/\.[^/.]+$/, ""));
        formData.append("description", description || "");
        formData.append("is_registered_only", String(isRegisteredOnly));
        formData.append("edited", String(isEdited));

        if (sourceCreatedAt) {
          const userDate = new Date(sourceCreatedAt).toISOString();
          formData.append("source_created_at", userDate);
        } else if (currentFile.lastModified) {
          const fileDate = new Date(currentFile.lastModified).toISOString();
          formData.append("source_created_at", fileDate);
        }

        if (categoryId) {
          formData.append("category_ids", categoryId);
        }

        tagIds.forEach((tagId) => {
          formData.append("tag_ids", tagId);
        });

        await uploadVideo(formData, {
          token,
          fallbackError: `Error al subir el archivo: ${currentFile.name}`,
        });
      }

      setStatus("success");
      emitAppEvent(APP_EVENTS.VIDEOS_CHANGED);

      setTimeout(() => {
        resetUploader();
      }, 3000);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
      setStatus("error");
    }
  };

  const resetUploader = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setStatus("idle");
    setFiles([]);
    setVideoPreview("");
    setTitle("");
    setDescription("");
    setIsRegisteredOnly(false);
    setErrorMessage("");
    setCurrentUploadIndex(0);
    setSourceCreatedAt("");
    setSelectedTagIds([]);
  };

  return {
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
  };
};
