import { useEffect, useState } from "react";
import { APP_EVENTS, emitAppEvent } from "../../../events/appEvents";
import { favoriteVideo, unfavoriteVideo } from "../../../services/api/interactions.api";

export const useFavoriteVideo = ({ activeVideo, token }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(Boolean(activeVideo?.is_favorite ?? activeVideo?.isFavorite));
  }, [activeVideo]);

  const toggleFavorite = async () => {
    if (!token) {
      alert("Debes iniciar sesion para guardar favoritos.");
      return;
    }

    try {
      if (isFavorite) {
        await unfavoriteVideo(activeVideo.id, { token });
      } else {
        await favoriteVideo(activeVideo.id, { token });
      }

      setIsFavorite(!isFavorite);
      emitAppEvent(APP_EVENTS.FAVORITES_CHANGED);
    } catch (error) {
      console.error("Error de red al gestionar favoritos:", error);
    }
  };

  return { isFavorite, toggleFavorite };
};
