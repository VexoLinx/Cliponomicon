import { useEffect, useMemo, useState } from "react";
import { BsSearch, BsSliders } from "react-icons/bs";
import { useSearch } from "../../../context/SearchContext";
import "./TopBar.css";
import { useTopBarSearchMode } from "./useTopBarSearchMode";
import { useVideoFilterOptions } from "./useVideoFilterOptions";
import VideoFiltersModal from "./VideoFiltersModal";

const EMPTY_FILTERS = {
  text: "",
  owner: null,
  ownerId: null,
  categoryIds: [],
  tag: null,
  tagId: null,
  tagIds: [],
  createdFrom: "",
  createdTo: "",
  datePreset: "any",
  edited: "",
};

const toPlainSearchFilters = (query) => ({
  ...EMPTY_FILTERS,
  text: query.trim().toLowerCase(),
});

const getActiveFilterCount = (filters) =>
  [
    filters.ownerId,
    filters.datePreset !== "any" ? filters.datePreset : "",
    filters.edited,
    ...(filters.categoryIds || []),
    ...(filters.tagIds || []),
  ].filter(Boolean).length;

const TopBar = () => {
  const { filters, setFilters } = useSearch();
  const mode = useTopBarSearchMode();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const showVideoFilters = ["videos", "game-detail", "tag-detail"].includes(mode.key);
  const { categories, tags, users } = useVideoFilterOptions(showVideoFilters && isFiltersOpen);
  const activeFilterCount = useMemo(() => getActiveFilterCount(filters), [filters]);

  useEffect(() => {
    setSearchTerm("");
    setIsFiltersOpen(false);
    setFilters((prev) => ({ ...prev, ...EMPTY_FILTERS, scope: mode.key }));
  }, [mode.key, setFilters]);

  useEffect(() => {
    if (mode.type === "hidden") return undefined;

    const delayDebounceFn = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        ...toPlainSearchFilters(searchTerm),
        categoryIds: prev.categoryIds,
        createdFrom: prev.createdFrom,
        createdTo: prev.createdTo,
        datePreset: prev.datePreset,
        edited: prev.edited,
        ownerId: prev.ownerId,
        scope: mode.key,
        tagIds: prev.tagIds,
      }));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [mode.key, mode.type, searchTerm, setFilters]);

  const resetVideoFilters = () => {
    setFilters((prev) => ({
      ...prev,
      categoryIds: [],
      createdFrom: "",
      createdTo: "",
      datePreset: "any",
      edited: "",
      ownerId: null,
      tagIds: [],
    }));
  };

  return (
    <header className={`topbar ${mode.type === "hidden" ? "topbar-empty" : ""}`}>
      {mode.type !== "hidden" && (
        <>
          <div className="search-container">
            <span className="search-icon">
              <BsSearch />
            </span>
            <input
              type="text"
              placeholder={mode.placeholder}
              className="search-input"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="filter-container">
            {showVideoFilters && (
              <button
                className="filter-button"
                type="button"
                onClick={() => setIsFiltersOpen(true)}
                title="Filtros"
              >
                <BsSliders />
                {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
              </button>
            )}

            {mode.showSort && (
              <select
                className="sort-select"
                value={filters.sort}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, sort: event.target.value, scope: mode.key }))
                }
              >
                <option value="newest">Nuevos</option>
                <option value="popular">Mas visto</option>
                <option value="edited">Editados</option>
              </select>
            )}
          </div>

          {isFiltersOpen && (
            <VideoFiltersModal
              categories={categories}
              filters={filters}
              onApply={() => setIsFiltersOpen(false)}
              onClose={() => setIsFiltersOpen(false)}
              onReset={resetVideoFilters}
              setFilters={setFilters}
              tags={tags}
              users={users}
            />
          )}
        </>
      )}
    </header>
  );
};

export default TopBar;
