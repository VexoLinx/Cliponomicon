import { useState, useEffect } from "react";
import { useVideoThumbnail } from "./useVideoThumbnail";
import { getVideoThumbnailUrl } from "../../../services/api/videoMedia.api";
import { getVideo } from "../../../services/api/videos.api";
import { VIDEO_PROCESSING_STATUSES } from "../../../services/mappers/video.mapper";

const activeStatuses = VIDEO_PROCESSING_STATUSES;

export const useVideoData = (initialData) => {
  const [videoCore, setVideoCore] = useState(initialData?.video ? initialData.video : initialData);
  const [thumbBuster, setThumbBuster] = useState("");
  
  const videoId = videoCore?.id || videoCore?._id || initialData?.id;
  const isProcessing = activeStatuses.includes(videoCore?.processing_status?.toLowerCase());

  const hookThumbnailSrc = useVideoThumbnail(videoCore);
  
  const baseThumbnail = !isProcessing && videoId
    ? getVideoThumbnailUrl(videoCore)
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
        const freshData = await getVideo(videoId);
        const stillWorking = activeStatuses.includes(freshData.processing_status?.toLowerCase());

        if (!stillWorking) {
          setVideoCore(freshData);
          setThumbBuster(Date.now());
          window.dispatchEvent(new Event("videos-changed"));
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
