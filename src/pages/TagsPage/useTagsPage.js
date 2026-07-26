import { useCallback, useEffect, useState } from "react";
import { useSearch } from "../../context/SearchContext";
import { createTag, listTags } from "../../services/api/tags.api";

export const useTagsPage = (token) => {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [createStatus, setCreateStatus] = useState("");
  const { filters } = useSearch();

  const fetchTags = useCallback(async (signal = null) => {
    try {
      setLoading(true);
      const data = await listTags({
        name: filters.scope === "tags" ? filters.text || undefined : undefined,
        signal,
      });
      setTags(data);
      setError(null);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("Error fetching tags:", err);
      setError("No se pudieron cargar los tags. Intentalo de nuevo mas tarde.");
    } finally {
      setLoading(false);
    }
  }, [filters.scope, filters.text]);

  useEffect(() => {
    const controller = new AbortController();
    fetchTags(controller.signal);
    return () => controller.abort();
  }, [fetchTags]);

  const handleCreateTag = async (event) => {
    event.preventDefault();

    const name = newTagName.trim();
    if (!name || creating || !token) return;

    try {
      setCreating(true);
      const createdTag = await createTag({ name }, { token });
      setTags((currentTags) => {
        const exists = currentTags.some((tag) => tag.id === createdTag.id);
        return exists ? currentTags : [createdTag, ...currentTags];
      });
      setNewTagName("");
      setIsCreateModalOpen(false);
      setCreateStatus("Tag creado.");
      setTimeout(() => setCreateStatus(""), 2500);
    } catch (err) {
      console.error("Error creating tag:", err);
      setCreateStatus(err.message);
    } finally {
      setCreating(false);
    }
  };

  return {
    createStatus,
    creating,
    error,
    handleCreateTag,
    isCreateModalOpen,
    loading,
    newTagName,
    setIsCreateModalOpen,
    setNewTagName,
    tags,
  };
};
