import React, { createContext, useState, useContext } from 'react';

const VideoContext = createContext(null);

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

export const useVideoModal = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoModal debe ser utilizado dentro de un VideoProvider");
  }
  return context;
};