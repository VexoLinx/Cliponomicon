import { useState, useEffect, useCallback } from "react";
import { listCategories, createCategory, updateCategory, deleteCategory } from "../../services/api/categories.api";
import { useSearch } from "../../context/SearchContext";

export const useGamesPage = (token) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isManageMode, setIsManageMode] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [actionStatus, setActionStatus] = useState("");

  const { filters } = useSearch();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listCategories({
        name: filters.scope === "games" ? filters.text || undefined : undefined,
      });
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("No se pudieron cargar los juegos. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  }, [filters.scope, filters.text]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setCreating(true);
    try {
      const newCategory = await createCategory({ name: newCategoryName }, { token });
      setCategories((prev) => [newCategory, ...prev]);
      setActionStatus("Juego creado exitosamente.");
      closeModal();
    } catch (err) {
      console.error("Error al crear juego:", err);
      setActionStatus("Error al crear el juego.");
    } finally {
      setCreating(false);
      setTimeout(() => setActionStatus(""), 3000);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !editingCategory) return;
    setUpdating(true);
    try {
      const updated = await updateCategory(editingCategory.id, { name: newCategoryName }, { token });
      setCategories((prev) =>
        prev.map((cat) => (cat.id === editingCategory.id ? updated : cat))
      );
      setActionStatus("Juego actualizado exitosamente.");
      closeModal();
    } catch (err) {
      console.error("Error al actualizar juego:", err);
      setActionStatus("Error al actualizar el juego.");
    } finally {
      setUpdating(false);
      setTimeout(() => setActionStatus(""), 3000);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`¿Seguro que quieres borrar el juego "${category.name}"?`)) return;
    setDeletingCategoryId(category.id);
    try {
      await deleteCategory(category.id, { token });
      setCategories((prev) => prev.filter((cat) => cat.id !== category.id));
      setActionStatus("Juego borrado exitosamente.");
    } catch (err) {
      console.error("Error al borrar juego:", err);
      setActionStatus("Error al borrar el juego.");
    } finally {
      setDeletingCategoryId(null);
      setTimeout(() => setActionStatus(""), 3000);
    }
  };

  const openEditModal = (category) => {
    // setEditingCategory(category);
    // setNewCategoryName(category.name);
    // setIsCreateModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setEditingCategory(null);
    setNewCategoryName("");
  };

  return {
    actionStatus,
    categories,
    creating,
    deletingCategoryId,
    editingCategory,
    error,
    isCreateModalOpen,
    isManageMode,
    loading,
    newCategoryName,
    updating,
    refreshGames: fetchCategories,
    closeModal,
    handleCreateCategory,
    handleDeleteCategory,
    handleUpdateCategory,
    openEditModal,
    setIsCreateModalOpen,
    setIsManageMode,
    setNewCategoryName,
  };
};