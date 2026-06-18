import React from "react";
import { useVideoModal } from "../../../context/VideoContext";
import { useVideoThumbnail } from "./useVideoThumbnail";
import "./VideoCard.css";

const VideoCard = ({ data = {} }) => {
  const { openVideo } = useVideoModal();

  const videoCore = data?.video ? data.video : data;

  const videoId = videoCore?.id || videoCore?._id || data?.id;
  const thumbnailSrc = useVideoThumbnail(videoId);

  const handlePlayVideo = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!videoId) {
      console.error("No se puede reproducir: ID no encontrado en el objeto de datos", data);
      return;
    }

    const videoDataNormalized = {
      ...videoCore, 
      id: videoId,
      videoUrl: videoCore?.videoUrl || `${import.meta.env.VITE_API_URL}/videos/${videoId}/stream`,
      title: videoCore?.title || data?.title || "Clip de Video",
      context: videoCore?.description || videoCore?.context || data?.description || "",
      isRegisteredOnly: videoCore?.is_registered_only ?? videoCore?.isRegisteredOnly ?? data?.is_registered_only ?? false,
      userHandle: videoCore?.owner?.username 
        ? `@${videoCore.owner.username}` 
        : (videoCore?.userHandle || data?.userHandle || "@usuario"),
      date: videoCore?.date || (videoCore?.created_at ? videoCore.created_at.split("T")[0] : "")
    };

    openVideo(videoDataNormalized);
  };

  const linkTextToShow = videoCore?.is_registered_only ? "Privado" : (videoCore?.linkText || data?.linkText || "enlace");
  const ratingToShow = videoCore?.rating !== undefined ? videoCore.rating : (videoCore?.popularity_score || data?.rating || 0);
  const userHandleToShow = videoCore?.owner?.username 
    ? `@${videoCore.owner.username}` 
    : (videoCore?.userHandle || data?.userHandle || "@usuario");
  const dateToShow = videoCore?.date || (videoCore?.created_at ? videoCore.created_at.split("T")[0] : (data?.date || "Reciente"));

  return (
    <div className="video-card" onClick={handlePlayVideo} style={{ cursor: "pointer" }}>
      <div className="card-header">
        <img src={thumbnailSrc} alt={videoCore?.title || "Video"} className="thumbnail" />
        <span className="overlay-link">{linkTextToShow}</span>

        <div className="overlay-rating">
          <span>{ratingToShow}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            className="rating-star-icon"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>

        {(videoCore?.duration || data?.duration) && (
          <span className="overlay-duration">{videoCore?.duration || data?.duration}</span>
        )}
      </div>

      <div className="card-footer">
        <div className="game-icon-container">
          <img
            src={videoCore?.gameIcon || data?.gameIcon || "https://via.placeholder.com/40"}
            alt={videoCore?.gameName || data?.gameName || "Juego"}
            className="game-icon"
          />
        </div>

        <div className="card-details">
          <h3 className="video-title">{videoCore?.title || data?.title || "Sin título"}</h3>
          <p className="game-name">{videoCore?.gameName || data?.gameName || "General"}</p>
          <div className="user-data">
            <span className="user-handle">{userHandleToShow}</span>
            <p className="separador">-</p>
            <p className="upload-date">{dateToShow}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;