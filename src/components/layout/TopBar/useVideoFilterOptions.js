import { useEffect, useState } from "react";
import { listCategories } from "../../../services/api/categories.api";
import { listTags } from "../../../services/api/tags.api";
import { listUsers } from "../../../services/api/users.api";
import { useAuth } from "../../../context/AuthContext";

export const useVideoFilterOptions = (enabled) => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();

    const loadOptions = async () => {
      try {
        const [categoryList, tagList, userList] = await Promise.all([
          listCategories({ signal: controller.signal }),
          listTags({ signal: controller.signal }),
          token ? listUsers({ token }) : Promise.resolve([]),
        ]);

        setCategories(categoryList);
        setTags(tagList);
        setUsers(userList);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error cargando opciones de filtros:", error);
        }
      }
    };

    loadOptions();
    return () => controller.abort();
  }, [enabled, token]);

  return { categories, tags, users };
};
