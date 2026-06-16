import React, { useEffect, useState } from "react";
import { useVideoModal } from "../../context/VideoContext";
import { useAuth } from "../../context/AuthContext";
import "./VideoCard.css";

const API_URL = import.meta.env.VITE_API_URL || "";

const VideoCard = ({ data = {} }) => {
  const { openVideo } = useVideoModal();
  const { token } = useAuth();

  const [thumbnailSrc, setThumbnailSrc] = useState(
    "https://placehold.co/300x170",
  );

  useEffect(() => {
    if (!data.id) return;

    const loadSecureThumbnail = async () => {
      try {
        const response = await fetch(`${API_URL}/videos/${data.id}/thumbnail`, {
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
          const objectUrl = URL.createObjectURL(blob);
          setThumbnailSrc(objectUrl);

          return () => URL.revokeObjectURL(objectUrl);
        }
      } catch (error) {
        console.error("Error cargando la miniatura protegida:", error);
      }
    };

    loadSecureThumbnail();
  }, [data.id, token]);

  return (
    <div className="video-card">
      <div className="card-header" onClick={() => openVideo(data)}>
        <img src={thumbnailSrc} alt={data.title} className="thumbnail" />
        <span className="overlay-link">{data.linkText || "enlace"}</span>

        <div className="overlay-rating">
          <span>{data.rating}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#00ff00">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>

        {data.duration && (
          <span className="overlay-duration">{data.duration}</span>
        )}
      </div>

      <div className="card-footer">
        <div className="game-icon-container">
          <img
            src={data.gameIcon || "https://via.placeholder.com/40"}
            alt={data.gameName}
            className="game-icon"
          />
        </div>

        <div className="card-details">
          <h3 className="video-title">{data.title}</h3>
          <p className="game-name">{data.gameName}</p>
          <div className="user-data">
            <span className="user-handle">{data.userHandle || "@usuario"}</span>
            <p className="separador">-</p>
            <p className="upload-date">{data.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;