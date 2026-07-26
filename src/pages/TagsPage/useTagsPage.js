import { useCallback, useEffect, useState } from "react";
import { createTag, listTags } from "../../services/api/tags.api";

export const useTagsPage = (token) => {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [createStatus, setCreateStatus] = useState("");

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listTags();
      setTags(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tags:", err);
      setError("No se pudieron cargar los tags. Intentalo de nuevo mas tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
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
