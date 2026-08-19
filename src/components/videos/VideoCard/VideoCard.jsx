import { forwardRef } from "react";
import { useVideoModal } from "../../../context/VideoContext";
import CardFooter from "./CardFooter";
import CardHeader from "./CardHeader";
import { useVideoCardModel } from "./useVideoCardModel";
import { useVideoData } from "./useVideoData";
import { useCopyClipLink } from "../GlobalVideoModal/useCopyClipLink";
import "./VideoCard.css";

const VideoCard = forwardRef(({ data = {} }, ref) => {
  const { openVideo } = useVideoModal();

  const {
    videoCore,
    videoId,
    isProcessing,
    thumbBuster,
    finalThumbnailSrc,
    categoryName,
    categoryIcon,
    categoryId,
  } = useVideoData(data);

  const { copyLink, showToast } = useCopyClipLink(videoId);

  const { card, modalVideo } = useVideoCardModel({
    categoryIcon,
    categoryId,
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

  return (
    <div
      className={`video-card ${isProcessing ? "is-processing" : ""}`}
      onClick={handlePlayVideo}
      style={{ cursor: isProcessing ? "not-allowed" : "pointer" }}
      ref={ref}
    >
      <CardHeader
        durationSeconds={card.durationSeconds}
        finalThumbnailSrc={finalThumbnailSrc}
        isEdited={card.isEdited}
        isProcessing={isProcessing}
        onCopyLink={copyLink}
        ratingToShow={card.ratingToShow}
        thumbBuster={thumbBuster}
        videoCore={videoCore}
      />
      <CardFooter
        categoryIcon={categoryIcon}
        categoryId={categoryId}
        categoryName={categoryName}
        date={card.date}
        ownerId={card.ownerId}
        tags={card.tags}
        title={card.title}
        userHandle={card.userHandle}
      />

      {showToast && <div className="copy-toast">Enlace copiado</div>}
    </div>
  );
});

export default VideoCard;