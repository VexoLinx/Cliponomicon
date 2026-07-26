import { IoClose, IoCut } from "react-icons/io5";

const EditSidebar = ({
  categoryId,
  description,
  errorMessage,
  isEdited,
  localCategories,
  onClose,
  onDelete,
  onSave,
  setCategoryId,
  setDescription,
  setIsEdited,
  setTitle,
  title,
  video,
}) => (
  <div className="modal-sidebar">
    <div className="sidebar-header-video">
      <span className="now-playing">EDITAR CLIP</span>
      <button className="close-btn" onClick={onClose}>
        <IoClose />
      </button>
    </div>

    <div className="sidebar-info">
      <label className="input-label">Titulo del video *</label>
      <input
        type="text"
        className="edit-input-title"
        maxLength={255}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Modifica el titulo..."
      />

      <div className="video-meta-row">
        <span className="user-handle-modal">{video.userHandle || "@usuario"}</span>
        <span className="meta-separator">|</span>
        <span className="video-date-modal">{video.date}</span>
      </div>

      <select
        className="edit-select-category"
        value={categoryId || ""}
        onChange={(event) => setCategoryId(event.target.value)}
      >
        <option value="">General</option>
        {localCategories.map((category) => (
          <option key={category.id} value={String(category.id)}>
            {category.name}
          </option>
        ))}
      </select>

      <label className="input-label">Descripcion o Contexto</label>
      <div className="video-context-box spec-edit">
        <textarea
          className="edit-textarea-context"
          maxLength={5000}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Actualiza los detalles o el contexto de tu clip..."
        />
      </div>

      <button
        type="button"
        className={`edit-feature-btn ${isEdited ? "active" : ""}`}
        onClick={() => setIsEdited(!isEdited)}
      >
        <div className="icon-wrapper">
          <IoCut />
        </div>
        <div className="text-content">
          <span className="btn-title">Contenido con Edicion</span>
          <span className="btn-subtitle">Memes, efectos, sonidos...</span>
        </div>
        <div className="status-indicator">{isEdited ? "Activado" : "Desactivado"}</div>
      </button>

      {errorMessage && <p className="error-text-sidebar">{errorMessage}</p>}
    </div>

    <div className="sidebar-footer-video">
      {onDelete && (
        <button className="footer-btn delete-btn" onClick={onDelete}>
          Eliminar Clip
        </button>
      )}
      <div className="sidebar-footer-buttons-group">
        <button className="footer-btn cancel-btn" onClick={onClose}>
          Cancelar
        </button>
        <button className="footer-btn upload-btn" onClick={onSave}>
          Guardar
        </button>
      </div>
    </div>
  </div>
);

export default EditSidebar;
