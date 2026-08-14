import { useCallback, useEffect, useState } from "react";
import { useSearch } from "../../context/SearchContext";
import { APP_EVENTS, emitAppEvent } from "../../events/appEvents";
import { createTag, deleteTag, listTags, updateTag } from "../../services/api/tags.api";

export const useTagsPage = (token) => {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [isManageMode, setIsManageMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingTagId, setDeletingTagId] = useState(null);
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
      emitAppEvent(APP_EVENTS.TAGS_UPDATED);
      setCreateStatus("Tag creado.");
      setTimeout(() => setCreateStatus(""), 2500);
    } catch (err) {
      console.error("Error creating tag:", err);
      setCreateStatus(err.message);
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = (tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
  };

  const closeTagModal = () => {
    setIsCreateModalOpen(false);
    setEditingTag(null);
    setNewTagName("");
  };

  const handleUpdateTag = async (event) => {
    event.preventDefault();

    const name = newTagName.trim();
    if (!editingTag || !name || updating || !token) return;

    try {
      setUpdating(true);
      const updatedTag = await updateTag(editingTag.id, { name }, { token });
      setTags((currentTags) =>
        currentTags.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag)),
      );
      closeTagModal();
      emitAppEvent(APP_EVENTS.TAGS_UPDATED);
      setCreateStatus("Tag actualizado.");
      setTimeout(() => setCreateStatus(""), 2500);
    } catch (err) {
      console.error("Error updating tag:", err);
      setCreateStatus(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTag = async (tag) => {
    if (!window.confirm(`Seguro que quieres borrar el tag #${tag.name}?`)) return;

    try {
      setDeletingTagId(tag.id);
      await deleteTag(tag.id, { token });
      setTags((currentTags) => currentTags.filter((currentTag) => currentTag.id !== tag.id));
      emitAppEvent(APP_EVENTS.TAGS_UPDATED);
      setCreateStatus("Tag eliminado.");
      setTimeout(() => setCreateStatus(""), 2500);
    } catch (err) {
      console.error("Error deleting tag:", err);
      setCreateStatus(err.message);
    } finally {
      setDeletingTagId(null);
    }
  };

  return {
    createStatus,
    creating,
    deletingTagId,
    editingTag,
    error,
    handleCreateTag,
    handleDeleteTag,
    handleUpdateTag,
    isCreateModalOpen,
    isManageMode,
    loading,
    newTagName,
    closeTagModal,
    openEditModal,
    setIsCreateModalOpen,
    setIsManageMode,
    setNewTagName,
    tags,
    updating,
  };
};
