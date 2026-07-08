import { useState, useEffect } from "react";
import { useVideoThumbnail } from "./useVideoThumbnail";

const activeStatuses = ["pending", "processing", "in_progress", "working", "active"];

export const useVideoData = (initialData) => {
  const [videoCore, setVideoCore] = useState(initialData?.video ? initialData.video : initialData);
  const [thumbBuster, setThumbBuster] = useState("");
  
  const videoId = videoCore?.id || videoCore?._id || initialData?.id;
  const isProcessing = activeStatuses.includes(videoCore?.processing_status?.toLowerCase());

  const hookThumbnailSrc = useVideoThumbnail(videoId);
  const baseThumbnail = videoCore?.processing_status && !isProcessing
    ? `${import.meta.env.VITE_API_URL}/videos/${videoId}/thumbnail`
    : hookThumbnailSrc;

  const finalThumbnailSrc = thumbBuster 
    ? `${baseThumbnail}${baseThumbnail.includes("?") ? "&" : "?"}t=${thumbBuster}` 
    : baseThumbnail;

  const currentCategory = videoCore?.category || videoCore?.categories?.[0];
  const [categoryName, setCategoryName] = useState(
    currentCategory?.name || videoCore?.gameName || initialData?.gameName || "General"
  );
  const [categoryIcon, setCategoryIcon] = useState(
    currentCategory?.thumbnail_horizontal_url || videoCore?.gameIcon || initialData?.gameIcon || "https://via.placeholder.com/40"
  );

  useEffect(() => {
    const freshCore = initialData?.video ? initialData.video : initialData;
    setVideoCore(freshCore);
  }, [initialData]);

  useEffect(() => {
    const cat = videoCore?.category || videoCore?.categories?.[0];
    setCategoryName(cat?.name || videoCore?.gameName || initialData?.gameName || "General");
    setCategoryIcon(cat?.thumbnail_horizontal_url || videoCore?.gameIcon || initialData?.gameIcon || "https://via.placeholder.com/40");
  }, [videoCore, initialData]);

  useEffect(() => {
    if (!videoId || !isProcessing) return;

    const checkStatus = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/videos/${videoId}`);
        if (res.ok) {
          const freshData = await res.json();
          const stillWorking = activeStatuses.includes(freshData.processing_status?.toLowerCase());

          if (!stillWorking) {
            setVideoCore(freshData);
            setThumbBuster(Date.now());
            window.dispatchEvent(new Event("videos-changed"));
          }
        }
      } catch (err) {
        console.error("Error en el autochequeo:", err);
      }
    };

    const intervalId = setInterval(checkStatus, 4000);
    return () => clearInterval(intervalId);
  }, [videoId, isProcessing]);

  return {
    videoCore,
    videoId,
    isProcessing,
    thumbBuster,
    finalThumbnailSrc,
    categoryName,
    categoryIcon,
  };
};