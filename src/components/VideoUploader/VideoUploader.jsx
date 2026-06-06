import React, { useState, useEffect } from "react";
import VideoUploadButton from "./VideoUploadButton";
import VideoEditModal from "./../VideoEditModal";
import { useAuth } from "../../context/AuthContext";
import "./VideoUploader.css";

const API_URL = import.meta.env.VITE_API_URL || "";
const VIDEOS_URL = `${API_URL}/videos`;

const VideoUploader = () => {
  const [status, setStatus] = useState("idle");
  const [file, setFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isRegisteredOnly, setIsRegisteredOnly] = useState(false); // Nuevo estado
  const [errorMessage, setErrorMessage] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [videoPreview]);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setVideoPreview(URL.createObjectURL(selectedFile));
    setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    setStatus("editing");
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      setErrorMessage("El título es obligatorio.");
      return;
    }

    setStatus("uploading");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("is_registered_only", isRegisteredOnly); 

    try {
      console.log("Upload API_URL:", API_URL);
      console.log("Upload URL:", VIDEOS_URL);

      const response = await fetch(VIDEOS_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.[0]?.msg || "Error al subir el archivo");
      }

      await response.json();
      setStatus("success");

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
    setFile(null);
    setVideoPreview("");
    setTitle("");
    setDescription("");
    setIsRegisteredOnly(false);
    setErrorMessage("");
  };

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
