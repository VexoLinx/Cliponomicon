import ReactDOM from "react-dom";

const TagCreateModal = ({
  creating,
  title = "Crear tag",
  newTagName,
  onClose,
  onSubmit,
  setNewTagName,
}) => (
  ReactDOM.createPortal(
    <div className="tag-modal-overlay" onClick={onClose}>
      <form className="tag-modal" onSubmit={onSubmit} onClick={(event) => event.stopPropagation()}>
        <div className="tag-modal-header">
          <h2>{title}</h2>
          <button className="tag-modal-close" type="button" onClick={onClose} aria-label="Cerrar">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="tag-modal-body">
          <label className="tag-modal-label" htmlFor="tagName">
            Nombre de la etiqueta
          </label>
          <input
            id="tagName"
            className="tag-create-input"
            type="text"
            value={newTagName}
            onChange={(event) => setNewTagName(event.target.value)}
            placeholder="Ej. speedrun, fail, epic..."
            maxLength={100}
            autoFocus
          />
        </div>

        <div className="tag-modal-actions">
          <button className="tag-modal-secondary" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="tag-create-button"
            type="submit"
            disabled={creating || !newTagName.trim()}
          >
            {creating ? "Guardando..." : "Guardar tag"}
          </button>
        </div>
      </form>
    </div>,
    document.body
  )
);

export default TagCreateModal;