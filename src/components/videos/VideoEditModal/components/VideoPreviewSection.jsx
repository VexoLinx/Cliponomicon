import React, { useState } from "react";
import "../VideoEditModal.css";

const VideoPreviewSection = ({ files, videoPreview }) => {
  const [aspectRatio, setAspectRatio] = useState("16 / 9");

  const handleVideoLoad = (e) => {
    const { videoWidth, videoHeight } = e.currentTarget;
    setAspectRatio(`${videoWidth} / ${videoHeight}`);
  };

  if (files.length === 1) {
    return (
      <div
        className="modal-video-container"
        style={{ "--video-aspect-ratio": aspectRatio }}
      >
        <video
          controls
          className="main-video"
          src={videoPreview}
          onLoadedMetadata={handleVideoLoad}
        />
      </div>
    );
  }

  return (
    <div className="modal-video-container batch-preview-list">
      <h3 className="batch-preview-title">
        Clips en cola de subida ({files.length})
      </h3>
      <div className="batch-preview-items">
        {files.map((f, index) => (
          <div key={index} className="batch-preview-item">
            <span className="batch-preview-name">🎥 {f.name}</span>
            <span className="batch-preview-size">
              {(f.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPreviewSection;