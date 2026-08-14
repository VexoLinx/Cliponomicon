import { CiLink } from "react-icons/ci";
import { formatDuration } from "./formatDuration";

const CardHeader = ({
  durationSeconds,
  finalThumbnailSrc,
  isEdited,
  isProcessing,
  onCopyLink,
  ratingToShow,
  thumbBuster,
  videoCore,
}) => (
  <div className="card-header">
    {isEdited && !isProcessing && (
      <div className="edited-bookmark" title="Este clip esta editado">
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
        <div className="spinner">...</div>
        <p>Jaimito trabajando...</p>
      </div>
    ) : (
      <>
        <button
          className="overlay-link card-link-button"
          onClick={onCopyLink}
          title="Copiar enlace"
        >
          <CiLink />
        </button>
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
        <div className="overlay-duration">{formatDuration(durationSeconds)}</div>
      </>
    )}
  </div>
);

export default CardHeader;