import React, { useState } from "react";
import { useVideoModal } from "../../../context/VideoContext";
import { useVideoData } from "./useVideoData";
import "./VideoCard.css";
import { CiLink } from "react-icons/ci";

const formatDuration = (totalSeconds) => {
  if (totalSeconds === undefined || totalSeconds === null || isNaN(totalSeconds)) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

  const CardHeader = ({ isProcessing, thumbBuster, finalThumbnailSrc, videoCore, durationSeconds, ratingToShow, isEdited, onCopyLink }) => (
  <div className="card-header">
    {isEdited && !isProcessing && (
      <div className="edited-bookmark" title="Este clip está editado">
        <span className="bookmark-text">EDIT</span>
      </div>
    )}

    <img
      key={thumbBuster || "static-thumb"}
      src={finalThumbnailSrc}
      alt={videoCore?.title || "Video"}
      className="thumbnail"
    />

    {isProcessing ? (
      <div className="processing-overlay">
        <div className="spinner">⚙️</div>
        <p>Jaimito trabajando...</p>
      </div>
    ) : (
      <>
        <button
          className="overlay-link card-link-button"
          onClick={(e) => onCopyLink(e, videoCore?.id)}
          title="Copiar enlace"
        >
          <CiLink />
        </button>
        <div className="overlay-rating">
          <span>{ratingToShow}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" className="rating-star-icon">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
        <div className="overlay-duration">
          {formatDuration(durationSeconds)}
        </div>
      </>
    )}
  </div>
);

const CardFooter = ({ categoryIcon, categoryName, title, userHandle, date }) => (
  <div className="card-footer">
    <div className="game-icon-container">
      <img src={categoryIcon} alt={categoryName} className="game-icon" />
    </div>
    <div className="card-details">
      <h3 className="video-title">{title}</h3>
      <p className="game-name">{categoryName}</p>
      <div className="user-data">
        <span className="user-handle">{userHandle}</span>
        <p className="separador">-</p>
        <p className="upload-date">{date}</p>
      </div>
    </div>
  </div>
);

const VideoCard = ({ data = {} }) => {
  const { openVideo } = useVideoModal();
  const [showToast, setShowToast] = useState(false);
  
  const { 
    videoCore, videoId, isProcessing, thumbBuster, 
    finalThumbnailSrc, categoryName, categoryIcon 
  } = useVideoData(data);

  const getFormattedDate = (isoString) => {
    if (!isoString) return "";
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString("es-ES", { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    }).replace(".", "");
  };

  const handlePlayVideo = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!videoId || isProcessing) return;

    const rawDate = videoCore?.source_created_at || videoCore?.created_at;

    const videoDataNormalized = {
      ...videoCore,
      id: videoId,
      videoUrl: videoCore?.videoUrl || `${import.meta.env.VITE_API_URL}/videos/${videoId}/stream`,
      title: videoCore?.title || data?.title || "Clip de Video",
      context: videoCore?.description || videoCore?.context || data?.description || "",
      isRegisteredOnly: videoCore?.is_registered_only ?? videoCore?.isRegisteredOnly ?? data?.is_registered_only ?? false,
      gameName: categoryName,
      gameIcon: categoryIcon,
      userHandle: videoCore?.owner?.username ? `@${videoCore.owner.username}` : (videoCore?.userHandle || data?.userHandle || "@usuario"),
      date: videoCore?.date || rawDate?.split("T")[0] || "",
    };

    openVideo(videoDataNormalized);
  };

  const handleCopyLink = (e, targetVideoId) => {
    e.stopPropagation();
    
    const clipUrl = `${import.meta.env.VITE_API_URL}/clip/${targetVideoId}`;
    
    navigator.clipboard.writeText(clipUrl)
      .then(() => {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Fallo al copiar:", error);
        const fallbackLink = `${window.location.origin}/games/${targetVideoId}`;
        navigator.clipboard.writeText(fallbackLink).catch(err => console.error("Fallo el fallback", err));
      });
  };

  const isEdited = videoCore?.edited ?? data?.edited ?? false;

  const ratingToShow = videoCore?.rating !== undefined ? videoCore.rating : (videoCore?.popularity_score || data?.rating || 0);
  const userHandleToShow = videoCore?.owner?.username ? `@${videoCore.owner.username}` : (videoCore?.userHandle || data?.userHandle || "@usuario");
  const durationSeconds = videoCore?.duration_seconds ?? data?.duration_seconds ?? 0;
  const titleToShow = videoCore?.title || data?.title || "Sin título";

  const rawDateToShow = videoCore?.source_created_at || videoCore?.created_at || data?.source_created_at || data?.created_at;
  const dateToShow = videoCore?.date || (rawDateToShow ? getFormattedDate(rawDateToShow) : (data?.date || "Reciente"));

  return (
    <div
      className={`video-card ${isProcessing ? "is-processing" : ""}`}
      onClick={handlePlayVideo}
      style={{ cursor: isProcessing ? "not-allowed" : "pointer" }}
    >
      <CardHeader 
        isProcessing={isProcessing}
        thumbBuster={thumbBuster}
        finalThumbnailSrc={finalThumbnailSrc}
        videoCore={videoCore}
        durationSeconds={durationSeconds}
        ratingToShow={ratingToShow}
        isEdited={isEdited}
        onCopyLink={handleCopyLink}
      />
      <CardFooter 
        categoryIcon={categoryIcon}
        categoryName={categoryName}
        title={titleToShow}
        userHandle={userHandleToShow}
        date={dateToShow}
      />
      
      {showToast && (
        <div className="copy-toast">
          Enlace copiado
        </div>
      )}
    </div>
  );
};

export default VideoCard;