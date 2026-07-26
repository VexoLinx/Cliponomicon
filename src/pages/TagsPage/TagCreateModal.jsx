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
          <button className="tag-modal-close" type="button" onClick={onClose}>
            x
          </button>
        </div>

        <label className="tag-modal-label" htmlFor="tagName">
          Nombre
        </label>
        <input
          id="tagName"
          className="tag-create-input"
          type="text"
          value={newTagName}
          onChange={(event) => setNewTagName(event.target.value)}
          placeholder="Ej. speedrun"
          maxLength={100}
          autoFocus
        />

        <div className="tag-modal-actions">
          <button className="tag-modal-secondary" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="tag-create-button"
            type="submit"
            disabled={creating || !newTagName.trim()}
          >
            {creating ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  )
);

export default TagCreateModal;
