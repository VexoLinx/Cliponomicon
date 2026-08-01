import React, { useRef, useCallback, useEffect } from "react";
import VideoCard from "../VideoCard/VideoCard";
import {useVideoModal} from "../../../context/VideoContext/VideoContext";

const InfiniteVideoGrid = ({ 
  videos, 
  statusText, 
  hasMore, 
  isFetchingNextPage, 
  loadMoreVideos 
}) => {
  const observer = useRef();

  const { registerPlaylist } = useVideoModal();

  useEffect(() => {
    registerPlaylist(videos, loadMoreVideos, hasMore);
  }, [videos, loadMoreVideos, hasMore, registerPlaylist]);

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
            if (videos.length === index + 1) {
              return (
                <div ref={lastVideoElementRef} key={video.id || video._id}>
                  <VideoCard data={video} />
                </div>
              );
            }
            return <VideoCard key={video.id || video._id} data={video} />;
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