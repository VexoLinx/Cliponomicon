import ReactDOM from "react-dom";
import { useMemo, useState } from "react";

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

const ChoiceListFilter = ({
  emptyText,
  items,
  label,
  placeholder,
  prefix = "",
  selectedIds,
  setSelectedIds,
}) => {
  const [query, setQuery] = useState("");
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selectedItems = useMemo(
    () => items.filter((item) => selectedSet.has(item.id)),
    [items, selectedSet],
  );

  const resultItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items
      .filter((item) => !selectedSet.has(item.id))
      .filter((item) => !normalizedQuery || item.name.toLowerCase().includes(normalizedQuery))
      .slice(0, 8);
  }, [items, query, selectedSet]);

  const addItem = (itemId) => {
    setSelectedIds([...selectedIds, itemId]);
    setQuery("");
  };

  const removeItem = (itemId) => {
    setSelectedIds(selectedIds.filter((id) => id !== itemId));
  };

  return (
    <div className="filters-section">
      <span className="filters-section-title">{label}</span>

      {selectedItems.length > 0 && (
        <div className="filters-selected-list">
          {selectedItems.map((item) => (
            <button
              key={item.id}
              className="filters-selected-pill"
              type="button"
              onClick={() => removeItem(item.id)}
              title="Quitar"
            >
              <span>{prefix}{item.name}</span>
              <strong>x</strong>
            </button>
          ))}
        </div>
      )}

      <div className="filters-choice-box">
        <input
          className="filters-choice-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
        />

        <div className="filters-choice-results">
          {resultItems.length === 0 ? (
            <span className="filters-choice-empty">{emptyText}</span>
          ) : (
            resultItems.map((item) => (
              <button
                key={item.id}
                className="filters-choice-option"
                type="button"
                onClick={() => addItem(item.id)}
              >
                {prefix}{item.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

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

        <ChoiceListFilter
          emptyText="No hay categorias que coincidan."
          items={categories}
          label="Categorias"
          placeholder="Buscar categoria..."
          selectedIds={filters.categoryIds}
          setSelectedIds={(ids) => updateField("categoryIds", ids)}
        />

        <ChoiceListFilter
          emptyText="No hay tags que coincidan."
          items={tags}
          label="Tags"
          placeholder="Buscar tag..."
          prefix="#"
          selectedIds={filters.tagIds}
          setSelectedIds={(ids) => updateField("tagIds", ids)}
        />

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
