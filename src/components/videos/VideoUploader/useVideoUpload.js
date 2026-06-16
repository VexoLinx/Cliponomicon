import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "";
const VIDEOS_URL = `${API_URL}/videos`;

export const useVideoUpload = () => {
    const [status, setStatus] = useState("idle");
    const [file, setFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isRegisteredOnly, setIsRegisteredOnly] = useState(false);
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
                    errorData.detail?.[0]?.msg || "Error al subir el archivo",
                );
            }

            await response.json();
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
        setFile(null);
        setVideoPreview("");
        setTitle("");
        setDescription("");
        setIsRegisteredOnly(false);
        setErrorMessage("");
    };

    return {
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
    };
};