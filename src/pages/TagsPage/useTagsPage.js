import { useCallback, useEffect, useState } from "react";
import { createTag, listTags } from "../../services/api/tags.api";

export const useTagsPage = (token) => {
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [createStatus, setCreateStatus] = useState("");

  const fetchTags = useCallback(async (name = searchTerm) => {
    try {
      setLoading(true);
      const data = await listTags({ name: name.trim() || undefined });
      setTags(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tags:", err);
      setError("No se pudieron cargar los tags. Intentalo de nuevo mas tarde.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTags(searchTerm);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [fetchTags, searchTerm]);

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
    loading,
    newTagName,
    searchTerm,
    setNewTagName,
    setSearchTerm,
    tags,
  };
};
