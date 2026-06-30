import React from "react";
import VideoCard from "../../components/videos/VideoCard/VideoCard";
import { useHomeVideos } from "./useHomeVideos";
import "./HomePage.css";

function HomePage() {
  const { videos, statusText } = useHomeVideos();

  return (
    <>
      {statusText && <p className="grid-status-text">{statusText}</p>}

      {videos.length > 0 && (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video.id} data={video} />
          ))}
        </div>
      )}
    </>
  );
}

export default HomePage;
