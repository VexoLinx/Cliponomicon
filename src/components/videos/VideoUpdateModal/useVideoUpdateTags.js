import { useEffect, useState } from "react";
import { APP_EVENTS, onAppEvent } from "../../../events/appEvents";
import { listTags } from "../../../services/api/tags.api";

export const useVideoUpdateTags = (tagsList = []) => {
  const [localTags, setLocalTags] = useState(tagsList);

  useEffect(() => {
    const fetchFreshTags = async () => {
      try {
        const data = await listTags();
        setLocalTags(data);
      } catch (error) {
        console.error("Error actualizando lista de tags en el modal:", error);
      }
    };

    if (tagsList.length === 0) {
      fetchFreshTags();
    } else {
      setLocalTags(tagsList);
    }

    return onAppEvent(APP_EVENTS.TAGS_UPDATED, fetchFreshTags);
  }, [tagsList]);

  return localTags;
};
