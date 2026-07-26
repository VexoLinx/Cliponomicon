import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useSearch } from "../../../context/SearchContext";
import { listTags } from "../../../services/api/tags.api";
import "./TopBar.css";
import { useTopBarSearchMode } from "./useTopBarSearchMode";

const EMPTY_FILTERS = {
  text: "",
  owner: null,
  ownerId: null,
  tag: null,
  tagId: null,
};

const parseVideoSearchQuery = (query) => {
  if (!query) return EMPTY_FILTERS;

  const filters = { ...EMPTY_FILTERS };
  const parts = query.split(" ");
  const textParts = [];

  parts.forEach((part) => {
    if (part.startsWith("@") && part.length > 1) {
      filters.owner = part.substring(1).toLowerCase();
    } else if (part.startsWith("#") && part.length > 1) {
      filters.tag = part.substring(1).toLowerCase();
    } else {
      textParts.push(part);
    }
  });

  filters.text = textParts.join(" ").trim().toLowerCase();
  return filters;
};

const parsePlainSearchQuery = (query) => ({
  ...EMPTY_FILTERS,
  text: query.trim().toLowerCase(),
});

const TopBar = () => {
  const { setFilters } = useSearch();
  const mode = useTopBarSearchMode();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSearchTerm("");
    setFilters((prev) => ({ ...prev, ...EMPTY_FILTERS, scope: mode.key }));
  }, [mode.key, setFilters]);

  useEffect(() => {
    if (mode.type === "hidden") return undefined;

    const controller = new AbortController();

    const delayDebounceFn = setTimeout(() => {
      const applyFilters = async () => {
        const parsed =
          mode.type === "video"
            ? parseVideoSearchQuery(searchTerm)
            : parsePlainSearchQuery(searchTerm);

        if (mode.type !== "video" || !parsed.tag) {
          setFilters((prev) => ({ ...prev, ...parsed, scope: mode.key }));
          return;
        }

        try {
          const tags = await listTags({ name: parsed.tag, signal: controller.signal });
          const exactMatch = tags.find(
            (tag) => tag.name.toLowerCase() === parsed.tag.toLowerCase(),
          );

          setFilters((prev) => ({
            ...prev,
            ...parsed,
            scope: mode.key,
            tagId: exactMatch?.id || null,
          }));
        } catch (error) {
          if (error.name === "AbortError") return;

          console.error("Error resolviendo tag de busqueda:", error);
          setFilters((prev) => ({ ...prev, ...parsed, scope: mode.key, tagId: null }));
        }
      };

      applyFilters();
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(delayDebounceFn);
    };
  }, [mode.key, mode.type, searchTerm, setFilters]);

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

          {mode.showSort && (
            <div className="filter-container">
              <select
                className="sort-select"
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, sort: event.target.value, scope: mode.key }))
                }
              >
                <option value="newest">Nuevos</option>
                <option value="popular">Mas visto</option>
                <option value="edited">Editados</option>
              </select>
            </div>
          )}
        </>
      )}
    </header>
  );
};

export default TopBar;
