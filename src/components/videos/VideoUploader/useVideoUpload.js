import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "";
const VIDEOS_URL = `${API_URL}/videos`;

export const useVideoUpload = () => {
    const [status, setStatus] = useState("idle");
    const [files, setFiles] = useState([]); 
    const [videoPreview, setVideoPreview] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isRegisteredOnly, setIsRegisteredOnly] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
    const { token } = useAuth();

    useEffect(() => {
        return () => {
            if (videoPreview) URL.revokeObjectURL(videoPreview);
        };
    }, [videoPreview]);

    const handleFileSelect = (selectedFiles) => {
        const fileArray = Array.isArray(selectedFiles) ? selectedFiles : Array.from(selectedFiles);
        setFiles(fileArray);

        if (fileArray.length === 1) {
            setVideoPreview(URL.createObjectURL(fileArray[0]));
            setTitle(fileArray[0].name.replace(/\.[^/.]+$/, ""));
        } else {
            setVideoPreview("");
            setTitle("");
        }
        setStatus("editing");
    };

    const handleUpload = async (categoryId) => {
        if (files.length === 1 && !title.trim()) {
            setErrorMessage("El título es obligatorio.");
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

                const finalTitle = files.length === 1 ? title : currentFile.name.replace(/\.[^/.]+$/, "");
                formData.append("title", finalTitle);

                formData.append("description", description);
                formData.append("is_registered_only", isRegisteredOnly);

                if (categoryId) {
                    formData.append("category_ids", categoryId);
                }

                console.log(`Subiendo [${i + 1}/${files.length}]: ${currentFile.name} con category_ids: ${categoryId}`);

                const response = await fetch(VIDEOS_URL, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: formData,
                });

                if (response.status === 401) {
                    window.dispatchEvent(new Event("auth-expired"));
                    throw new Error("Sesión expirada. Por favor, vuelve a iniciar sesión para subir contenido.");
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.detail?.[0]?.msg || `Error al subir el archivo: ${currentFile.name}`
                    );
                }
            }

            setStatus("success");
            window.dispatchEvent(new Event("videos-changed"));

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
        errorMessage,
        handleFileSelect,
        handleUpload,
        resetUploader,
    };
};