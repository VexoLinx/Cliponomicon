import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TagCreateModal from "./TagCreateModal";
import { useTagsPage } from "./useTagsPage";
import "./TagsPage.css";

const TagsPage = () => {
  const { token, user } = useAuth();
  const {
    createStatus,
    creating,
    deletingTagId,
    editingTag,
    error,
    handleDeleteTag,
    handleCreateTag,
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
  } = useTagsPage(token);

  const canManageTags = token && ["admin", "super_admin"].includes(user?.role);

  return (
    <div className="page-container tags-page">
      <div className="tags-toolbar">
        <div className="tags-summary">
          <span>{tags.length} tags</span>
        </div>

        <div className="tags-toolbar-actions">
          <button
            className="tag-create-button"
            type="button"
            disabled={!token}
            title={token ? "Crear tag" : "Inicia sesión para crear tags"}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Crear tag
          </button>

          {canManageTags && (
            <label
              className={`tag-manage-toggle ${isManageMode ? "active" : ""}`}
            >
              <input
                type="checkbox"
                checked={isManageMode}
                onChange={(event) => setIsManageMode(event.target.checked)}
              />
              <span>Modificar</span>
            </label>
          )}
        </div>
      </div>

      {createStatus && <p className="tag-status-text">{createStatus}</p>}
      {!token && (
        <p className="tag-status-text">Inicia sesión para crear tags.</p>
      )}
      {loading && <p className="grid-status-text">Cargando tags...</p>}
      {error && <p className="grid-status-text">{error}</p>}

      {!loading && !error && tags.length === 0 && (
        <p className="grid-status-text">Aún no hay tags registrados.</p>
      )}

      {!loading && tags.length > 0 && (
        <div className="tags-grid">
          {tags.map((tag) => (
            <div key={tag.id} className="tag-card">
              <Link className="tag-card-link" to={`/tags/${tag.id}`}>
                <div className="tag-text-wrapper">
                  <span className="tag-prefix">#</span>
                  <span className="tag-name" title={tag.name}>
                    {tag.name}
                  </span>
                </div>
              </Link>

              {canManageTags && isManageMode && (
                <div className="tag-card-actions">
                  <button type="button" onClick={() => openEditModal(tag)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="danger"
                    disabled={deletingTagId === tag.id}
                    onClick={() => handleDeleteTag(tag)}
                  >
                    {deletingTagId === tag.id ? "..." : "Borrar"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {(isCreateModalOpen || editingTag) && (
        <TagCreateModal
          creating={creating || updating}
          title={editingTag ? "Modificar tag" : "Crear tag"}
          newTagName={newTagName}
          onClose={closeTagModal}
          onSubmit={editingTag ? handleUpdateTag : handleCreateTag}
          setNewTagName={setNewTagName}
        />
      )}
    </div>
  );
};

export default TagsPage;
