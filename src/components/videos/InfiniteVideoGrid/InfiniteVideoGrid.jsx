import React, { useRef, useCallback, useEffect } from "react";
import VideoCard from "../VideoCard/VideoCard";
import { useVideoModal } from "../../../context/VideoContext/VideoContext";

const InfiniteVideoGrid = ({ 
  videos, 
  statusText, 
  hasMore, 
  isFetchingNextPage, 
  loadMoreVideos 
}) => {
  const observer = useRef();
  const videoRefs = useRef(new Map());
  const { registerPlaylist, activeVideo } = useVideoModal();

  useEffect(() => {
    registerPlaylist(videos, loadMoreVideos, hasMore);
  }, [videos, loadMoreVideos, hasMore, registerPlaylist]);

  useEffect(() => {
    if (activeVideo) {
      const videoId = activeVideo.id || activeVideo._id;
      const node = videoRefs.current.get(videoId);
      
      if (node) {
        node.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [activeVideo]);

  const lastVideoElementRef = useCallback(node => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreVideos();
      }
    });

    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, hasMore, loadMoreVideos]);

  return (
    <>
      {statusText && <p className="grid-status-text">{statusText}</p>}

      {videos.length > 0 && (
        <div className="video-grid">
          {videos.map((video, index) => {
            const videoId = video.id || video._id;
            const isLastElement = videos.length === index + 1;

            return (
              <VideoCard 
                key={videoId} 
                data={video}
                ref={(node) => {
                  if (node) {
                    videoRefs.current.set(videoId, node);
                  } else {
                    videoRefs.current.delete(videoId);
                  }
                  
                  if (isLastElement) {
                    lastVideoElementRef(node);
                  }
                }} 
              />
            );
          })}
        </div>
      )}

      {isFetchingNextPage && (
        <p className="grid-status-text" style={{ marginTop: '20px' }}>
          Cargando más vídeos...
        </p>
      )}
    </>
  );
};

export default InfiniteVideoGrid;