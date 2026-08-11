import ReactDOM from "react-dom";

const EMPTY_FORM = {
  categoryIds: [],
  tagIds: [],
  ownerId: "",
  createdFrom: "",
  createdTo: "",
  datePreset: "any",
  edited: "",
};

const toDateInputValue = (date) => date.toISOString().slice(0, 10);

const getDateRangeForPreset = (preset) => {
  const today = new Date();
  const start = new Date(today);

  if (preset === "today") {
    return { createdFrom: toDateInputValue(today), createdTo: toDateInputValue(today) };
  }

  if (preset === "last7") {
    start.setDate(today.getDate() - 6);
    return { createdFrom: toDateInputValue(start), createdTo: toDateInputValue(today) };
  }

  if (preset === "last30") {
    start.setDate(today.getDate() - 29);
    return { createdFrom: toDateInputValue(start), createdTo: toDateInputValue(today) };
  }

  if (preset === "thisMonth") {
    start.setDate(1);
    return { createdFrom: toDateInputValue(start), createdTo: toDateInputValue(today) };
  }

  return { createdFrom: "", createdTo: "" };
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

  const updateDatePreset = (preset) => {
    setFilters((current) => ({
      ...current,
      datePreset: preset,
      ...(preset === "custom"
        ? { createdFrom: current.createdFrom, createdTo: current.createdTo }
        : getDateRangeForPreset(preset)),
    }));
  };

  const updateCustomDate = (field, value) => {
    setFilters((current) => ({
      ...current,
      datePreset: "custom",
      [field]: value,
    }));
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

          <div className="filters-field">
            <span>Editado</span>
            <div className="filters-segmented" role="group" aria-label="Filtro de editado">
              {[
                ["", "Todos"],
                ["true", "Editados"],
                ["false", "Sin editar"],
              ].map(([value, label]) => (
                <button
                  key={value || "all"}
                  className={filters.edited === value ? "active" : ""}
                  type="button"
                  onClick={() => updateField("edited", value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <label className="filters-field">
            <span>Fecha</span>
            <select
              value={filters.datePreset || "any"}
              onChange={(event) => updateDatePreset(event.target.value)}
            >
              <option value="any">Cualquier fecha</option>
              <option value="today">Hoy</option>
              <option value="last7">Ultimos 7 dias</option>
              <option value="last30">Ultimos 30 dias</option>
              <option value="thisMonth">Este mes</option>
              <option value="custom">Rango personalizado</option>
            </select>
          </label>

          {(filters.datePreset || "any") === "custom" && (
            <>
              <label className="filters-field">
                <span>Desde</span>
                <input
                  type="date"
                  value={filters.createdFrom}
                  onChange={(event) => updateCustomDate("createdFrom", event.target.value)}
                />
              </label>

              <label className="filters-field">
                <span>Hasta</span>
                <input
                  type="date"
                  value={filters.createdTo}
                  onChange={(event) => updateCustomDate("createdTo", event.target.value)}
                />
              </label>
            </>
          )}
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
