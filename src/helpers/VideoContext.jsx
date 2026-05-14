import React, { createContext, useState, useContext } from 'react';

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [activeVideo, setActiveVideo] = useState(null);

  const openVideo = (videoData) => setActiveVideo(videoData);
  const closeVideo = () => setActiveVideo(null);

  return (
    <VideoContext.Provider value={{ activeVideo, openVideo, closeVideo }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoModal = () => useContext(VideoContext);