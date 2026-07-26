const PublicProfileForm = ({
  bio,
  displayName,
  handleUpdateProfile,
  setBio,
  setDisplayName,
  updateStatus,
}) => (
  <form onSubmit={handleUpdateProfile} className="settings-card">
    <h3 className="card-title">Informacion Publica</h3>
    <div className="form-group">
      <label htmlFor="displayName">Nombre a mostrar</label>
      <input
        id="displayName"
        type="text"
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
        placeholder="Ej. Juan Perez"
        className="input-editable"
      />
      <small>Este nombre aparecera en tus clips y comentarios.</small>
    </div>
    <div className="form-group">
      <label htmlFor="bio">Biografia</label>
      <textarea
        id="bio"
        value={bio}
        onChange={(event) => setBio(event.target.value)}
        placeholder="Escribe algo sobre ti..."
        className="input-editable textarea-editable"
        rows="3"
      />
    </div>
    <div className="form-actions">
      <button type="submit" className="btn-primary" disabled={updateStatus.type === "loading"}>
        {updateStatus.type === "loading" ? "Guardando..." : "Guardar Cambios"}
      </button>
      {updateStatus.msg && (
        <span className={`status-msg ${updateStatus.type}`}>{updateStatus.msg}</span>
      )}
    </div>
  </form>
);

export default PublicProfileForm;
