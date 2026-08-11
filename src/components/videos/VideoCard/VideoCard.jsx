import { useState } from "react";
import { useVideoModal } from "../../../context/VideoContext";
import { getClipUrl } from "../../../services/api/videoMedia.api";
import CardFooter from "./CardFooter";
import CardHeader from "./CardHeader";
import { useVideoCardModel } from "./useVideoCardModel";
import { useVideoData } from "./useVideoData";
import "./VideoCard.css";

const VideoCard = ({ data = {} }) => {
  const { openVideo } = useVideoModal();
  const [showToast, setShowToast] = useState(false);

  const {
    videoCore,
    videoId,
    isProcessing,
    thumbBuster,
    finalThumbnailSrc,
    categoryName,
    categoryIcon,
  } = useVideoData(data);

  const { card, modalVideo } = useVideoCardModel({
    categoryIcon,
    categoryName,
    data,
    videoCore,
    videoId,
  });

  const handlePlayVideo = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!videoId || isProcessing) return;
    openVideo(modalVideo);
  };

  const handleCopyLink = (event, targetVideoId) => {
    event.stopPropagation();

    navigator.clipboard
      .writeText(getClipUrl(targetVideoId))
      .then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      })
      .catch((error) => {
        console.error("Fallo al copiar:", error);
        navigator.clipboard
          .writeText(getClipUrl(targetVideoId))
          .catch((err) => console.error("Fallo el fallback", err));
      });
  };

  return (
    <div
      className={`video-card ${isProcessing ? "is-processing" : ""}`}
      onClick={handlePlayVideo}
      style={{ cursor: isProcessing ? "not-allowed" : "pointer" }}
    >
      <CardHeader
        durationSeconds={card.durationSeconds}
        finalThumbnailSrc={finalThumbnailSrc}
        isEdited={card.isEdited}
        isProcessing={isProcessing}
        onCopyLink={handleCopyLink}
        ratingToShow={card.ratingToShow}
        thumbBuster={thumbBuster}
        videoCore={videoCore}
      />
      <CardFooter
        categoryIcon={categoryIcon}
        categoryName={categoryName}
        date={card.date}
        ownerId={card.ownerId}
        title={card.title}
        userHandle={card.userHandle}
      />

      {showToast && <div className="copy-toast">Enlace copiado</div>}
    </div>
  );
};

export default VideoCard;
