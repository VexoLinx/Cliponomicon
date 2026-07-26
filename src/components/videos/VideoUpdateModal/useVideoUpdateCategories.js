import { useEffect, useState } from "react";
import { APP_EVENTS, onAppEvent } from "../../../events/appEvents";
import { listCategories } from "../../../services/api/categories.api";

export const useVideoUpdateCategories = ({
  categoryId,
  categoriesList,
  setCategoryId,
  video,
}) => {
  const [localCategories, setLocalCategories] = useState(categoriesList);

  useEffect(() => {
    const fetchFreshCategories = async () => {
      try {
        const data = await listCategories();
        setLocalCategories(data);
      } catch (error) {
        console.error("Error actualizando lista de categorias en el modal:", error);
      }
    };

    if (categoriesList.length === 0) {
      fetchFreshCategories();
    } else {
      setLocalCategories(categoriesList);
    }

    return onAppEvent(APP_EVENTS.CATEGORIES_UPDATED, fetchFreshCategories);
  }, [categoriesList]);

  useEffect(() => {
    if (!categoryId && video?.gameName && localCategories.length > 0) {
      const match = localCategories.find(
        (category) => category.name.toLowerCase() === video.gameName.toLowerCase(),
      );

      if (match) {
        setCategoryId(String(match.id));
      }
    }
  }, [categoryId, localCategories, setCategoryId, video?.gameName]);

  return localCategories;
};
