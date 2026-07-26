import { useState, useRef, useEffect } from "react";

export const useVideoPlayer = (video) => {
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const settingsRef = useRef(null);

  const getInitialVariant = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (isMobile) return "low_h264";
    return video?.edited ? "edited" : "original";
  };

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem("cliponomicon_volume");
    return savedVolume !== null ? parseFloat(savedVolume) : 1;
  });

  const [isMuted, setIsMuted] = useState(() => {
    const savedMute = localStorage.getItem("cliponomicon_muted");
    return savedMute !== null ? JSON.parse(savedMute) : false;
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [videoVariant, setVideoVariant] = useState(getInitialVariant);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  const currentStreamUrl = `${import.meta.env.VITE_API_URL}/videos/${video?.id}/stream?variant_type=${videoVariant}`;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [currentStreamUrl, volume, isMuted]);

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    setCurrentTime(formatTime(current));
    setProgress((current / total) * 100 || 0);
  };

  const handleLoadedMetadata = () => {
    setDuration(formatTime(videoRef.current.duration));
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    let nextVolume = volume;

    if (isMuted && volume === 0) {
      nextVolume = 0.5;
      setVolume(0.5);
    }

    setIsMuted(nextMuted);

    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = nextVolume;
    }

    localStorage.setItem("cliponomicon_muted", JSON.stringify(nextMuted));
    localStorage.setItem("cliponomicon_volume", nextVolume.toString());
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    const newMuted = newVolume === 0;

    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newMuted;
    }

    setVolume(newVolume);
    setIsMuted(newMuted);

    localStorage.setItem("cliponomicon_volume", newVolume.toString());
    localStorage.setItem("cliponomicon_muted", JSON.stringify(newMuted));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleVideoError = () => {
    if (videoVariant !== "low_h264") {
      setVideoVariant("low_h264");
    }
  };

  const changeQuality = (variant) => {
    const currentTimeAtSwitch = videoRef.current.currentTime;
    const wasPlaying = !videoRef.current.paused;
    setVideoVariant(variant);
    setActiveMenu(null);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = currentTimeAtSwitch;
        if (wasPlaying) videoRef.current.play();
      }
    }, 100);
  };

  const changeSpeed = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setPlaybackRate(rate);
    setActiveMenu("main");
  };

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled && videoRef.current) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error("Error al activar PiP", error);
    }
    setActiveMenu(null);
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const response = await fetch(currentStreamUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = video?.title ? `${video.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.mp4` : "clip.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error al forzar la descarga:", error);
    } finally {
      setIsDownloading(false);
      setActiveMenu(null);
    }
  };

  return {
    refs: { videoRef, playerContainerRef, settingsRef },
    states: {
      isPlaying, progress, currentTime, duration, volume,
      isMuted, isFullscreen, activeMenu, videoVariant,
      playbackRate, isDownloading, currentStreamUrl
    },
    actions: {
      togglePlay, handleTimeUpdate, handleLoadedMetadata,
      handleVideoEnd, handleSeek, toggleMute, handleVolumeChange,
      toggleFullscreen, handleVideoError, setActiveMenu,
      changeQuality, changeSpeed, togglePiP, handleDownload
    }
  };
};