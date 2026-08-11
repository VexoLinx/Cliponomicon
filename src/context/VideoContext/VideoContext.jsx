import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { mapVideoToCard } from '../../services/mappers/video.mapper';

const VideoContext = createContext(null);

export const VideoProvider = ({ children }) => {
  const [activeVideo, setActiveVideo] = useState(null);
  
  const [playlist, setPlaylist] = useState([]);
  const [gridControls, setGridControls] = useState({ loadMore: null, hasMore: false });

  const openVideo = useCallback((videoData) => {
    const formattedVideo = videoData.date ? videoData : mapVideoToCard(videoData);
    setActiveVideo(formattedVideo);
  }, []);

  const closeVideo = useCallback(() => {
    setActiveVideo(null);
  }, []);

  const updateActiveVideo = useCallback((updater) => {
    setActiveVideo((current) => {
      if (!current) return current;
      return typeof updater === "function" ? updater(current) : { ...current, ...updater };
    });
  }, []);

  const registerPlaylist = useCallback((videos, loadMore = null, hasMore = false) => {
    setPlaylist(videos);
    setGridControls({ loadMore, hasMore });
  }, []);

  const currentIndex = useMemo(() => {
    if (!activeVideo || !playlist.length) return -1;
    return playlist.findIndex(v => (v.id || v._id) === (activeVideo.id || activeVideo._id));
  }, [activeVideo, playlist]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && (currentIndex < playlist.length - 1 || gridControls.hasMore);

  const playPrev = useCallback(() => {
    if (hasPrev) {
      setActiveVideo(playlist[currentIndex - 1]);
    }
  }, [hasPrev, playlist, currentIndex]);

  const playNext = useCallback(() => {
    if (!hasNext) return;

    if (currentIndex < playlist.length - 1) {
      setActiveVideo(playlist[currentIndex + 1]);
    } else if (gridControls.hasMore && gridControls.loadMore) {
      gridControls.loadMore();
    }
  }, [hasNext, currentIndex, playlist, gridControls]);

  const value = useMemo(() => ({
    activeVideo,
    openVideo,
    closeVideo,
    updateActiveVideo,
    registerPlaylist,
    playNext,
    playPrev,
    hasNext,
    hasPrev
  }), [
    activeVideo,
    openVideo,
    closeVideo,
    updateActiveVideo,
    registerPlaylist,
    playNext,
    playPrev,
    hasNext,
    hasPrev,
  ]);

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoModal = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoModal debe ser utilizado dentro de un VideoProvider");
  }
  return context;
};
