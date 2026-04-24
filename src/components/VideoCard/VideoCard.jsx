import React from "react";
import "./VideoCard.css";

const VideoCard = ({ data = defaultMock }) => {
  return (
    <div className="video-card">
      <div className="card-header">
        <img src={data.thumbnail} alt={data.title} className="thumbnail" />
        <span className="overlay-link">{data.linkText || "enlace"}</span>

        <div className="overlay-rating">
          <span>{data.rating}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#00ff00">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>

        <span className="overlay-duration">{data.duration}</span>

        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${data.progress || 40}%` }}
          ></div>
        </div>
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
            <span className="user-handle">{data.userHandle}</span>
            <p className="separador">-</p>
            <p className="upload-date">{data.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
