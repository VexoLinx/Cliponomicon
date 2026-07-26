import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "";

export const useVideoThumbnail = (videoId) => {
    const { token } = useAuth();
    const [thumbnailSrc, setThumbnailSrc] = useState("https://placehold.co/300x170");

    useEffect(() => {
        if (!videoId) return;

        let objectUrl = null;

        const loadSecureThumbnail = async () => {
            try {
                const response = await fetch(`${API_URL}/videos/${videoId}/thumbnail`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    window.dispatchEvent(new Event("auth-expired"));
                    return;
                }

                if (response.ok) {
                    const blob = await response.blob();
                    objectUrl = URL.createObjectURL(blob);
                    setThumbnailSrc(objectUrl);
                }
            } catch (error) {
                console.error("Error cargando la miniatura protegida:", error);
            }
        };

        loadSecureThumbnail();

        // Limpieza de memoria al desmontar el componente o cambiar de ID
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [videoId, token]);

    return thumbnailSrc;
};