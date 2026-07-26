import ReactDOM from "react-dom";

const EMPTY_FORM = {
  categoryIds: [],
  tagIds: [],
  ownerId: "",
  createdDate: "",
  createdFrom: "",
  createdTo: "",
  edited: "",
};

const toggleArrayValue = (values, value) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

const VideoFiltersModal = ({
  categories,
  filters,
  onApply,
  onClose,
  onReset,
  setFilters,
  tags,
  users,
}) => {
  const updateField = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setFilters((current) => ({ ...current, ...EMPTY_FORM }));
    onReset();
  };

  return ReactDOM.createPortal(
    <div className="filters-modal-overlay" onClick={onClose}>
      <section className="filters-modal" onClick={(event) => event.stopPropagation()}>
        <header className="filters-modal-header">
          <h2>Filtros de videos</h2>
          <button className="filters-close-button" type="button" onClick={onClose}>
            x
          </button>
        </header>

        <div className="filters-grid">
          <label className="filters-field">
            <span>Usuario</span>
            <select
              value={filters.ownerId || ""}
              onChange={(event) => updateField("ownerId", event.target.value)}
            >
              <option value="">Cualquiera</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  @{user.username}
                </option>
              ))}
            </select>
          </label>

          <label className="filters-field">
            <span>Editado</span>
            <select
              value={filters.edited}
              onChange={(event) => updateField("edited", event.target.value)}
            >
              <option value="">Todos</option>
              <option value="true">Editados</option>
              <option value="false">Sin editar</option>
            </select>
          </label>

          <label className="filters-field">
            <span>Fecha exacta</span>
            <input
              type="date"
              value={filters.createdDate}
              onChange={(event) => updateField("createdDate", event.target.value)}
            />
          </label>

          <label className="filters-field">
            <span>Desde</span>
            <input
              type="date"
              value={filters.createdFrom}
              onChange={(event) => updateField("createdFrom", event.target.value)}
            />
          </label>

          <label className="filters-field">
            <span>Hasta</span>
            <input
              type="date"
              value={filters.createdTo}
              onChange={(event) => updateField("createdTo", event.target.value)}
            />
          </label>
        </div>

        <div className="filters-section">
          <span className="filters-section-title">Categorias</span>
          <div className="filters-chip-list">
            {categories.map((category) => (
              <label key={category.id} className="filters-chip">
                <input
                  type="checkbox"
                  checked={filters.categoryIds.includes(category.id)}
                  onChange={() =>
                    updateField("categoryIds", toggleArrayValue(filters.categoryIds, category.id))
                  }
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filters-section">
          <span className="filters-section-title">Tags</span>
          <div className="filters-chip-list">
            {tags.map((tag) => (
              <label key={tag.id} className="filters-chip">
                <input
                  type="checkbox"
                  checked={filters.tagIds.includes(tag.id)}
                  onChange={() => updateField("tagIds", toggleArrayValue(filters.tagIds, tag.id))}
                />
                <span>#{tag.name}</span>
              </label>
            ))}
          </div>
        </div>

        <footer className="filters-modal-actions">
          <button className="filters-secondary-button" type="button" onClick={resetForm}>
            Limpiar
          </button>
          <button className="filters-apply-button" type="button" onClick={onApply}>
            Aplicar filtros
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  );
};

export default VideoFiltersModal;
