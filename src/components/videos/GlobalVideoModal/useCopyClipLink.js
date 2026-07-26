import { useState } from "react";
import { getClipUrl } from "../../../services/api/videoMedia.api";

export const useCopyClipLink = (videoId) => {
  const [showToast, setShowToast] = useState(false);

  const copyLink = (event) => {
    event.stopPropagation();

    navigator.clipboard
      .writeText(getClipUrl(videoId))
      .then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      })
      .catch((error) => {
        console.error("Fallo al copiar el enlace del endpoint:", error);
        navigator.clipboard
          .writeText(window.location.href)
          .catch((err) => console.error("Tambien fallo el fallback:", err));
      });
  };

  return { copyLink, showToast };
};
