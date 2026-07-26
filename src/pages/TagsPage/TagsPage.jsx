import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTagsPage } from "./useTagsPage";
import "./TagsPage.css";

const TagsPage = () => {
  const { token } = useAuth();
  const {
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
  } = useTagsPage(token);

  return (
    <div className="page-container tags-page">
      <div className="tags-toolbar">
        <input
          className="tag-search-input"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar tag..."
        />

        <form className="tag-create-form" onSubmit={handleCreateTag}>
          <input
            className="tag-create-input"
            type="text"
            value={newTagName}
            onChange={(event) => setNewTagName(event.target.value)}
            placeholder="Nuevo tag"
            maxLength={100}
          />
          <button
            className="tag-create-button"
            type="submit"
            disabled={!token || creating || !newTagName.trim()}
            title={token ? "Crear tag" : "Inicia sesion para crear tags"}
          >
            {creating ? "Creando..." : "Crear tag"}
          </button>
        </form>
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
    </div>
  );
};

export default TagsPage;
