import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TagCreateModal from "./TagCreateModal";
import { useTagsPage } from "./useTagsPage";
import "./TagsPage.css";

const TagsPage = () => {
  const { token } = useAuth();
  const {
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
  } = useTagsPage(token);

  return (
    <div className="page-container tags-page">
      <div className="tags-toolbar">
        <div className="tags-summary">
          <span>{tags.length} tags</span>
        </div>

        <button
          className="tag-create-button"
          type="button"
          disabled={!token}
          title={token ? "Crear tag" : "Inicia sesion para crear tags"}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Crear tag
        </button>
      </div>

      {createStatus && <p className="tag-status-text">{createStatus}</p>}
      {!token && <p className="tag-status-text">Inicia sesion para crear tags.</p>}
      {loading && <p className="grid-status-text">Cargando tags...</p>}
      {error && <p className="grid-status-text">{error}</p>}

      {!loading && !error && tags.length === 0 && (
        <p className="grid-status-text">Aun no hay tags registrados.</p>
      )}

      {!loading && tags.length > 0 && (
        <div className="tags-grid">
          {tags.map((tag) => (
            <Link key={tag.id} className="tag-card" to={`/tags/${tag.id}`}>
              <span className="tag-prefix">#</span>
              <span className="tag-name">{tag.name}</span>
            </Link>
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <TagCreateModal
          creating={creating}
          newTagName={newTagName}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTag}
          setNewTagName={setNewTagName}
        />
      )}
    </div>
  );
};

export default TagsPage;
