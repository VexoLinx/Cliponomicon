import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { useSearch } from "../../../context/SearchContext";
import { listTags } from "../../../services/api/tags.api";
import "./TopBar.css";

const parseSearchQuery = (query) => {
  if (!query) return { text: "", owner: null, tag: null, tagId: null };
  const filters = { text: "", owner: null, tag: null, tagId: null };
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

const TopBar = () => {
  const { setFilters } = useSearch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const delayDebounceFn = setTimeout(() => {
      const applyFilters = async () => {
        const parsed = parseSearchQuery(searchTerm);

        if (!parsed.tag) {
          setFilters((prev) => ({ ...prev, ...parsed, tagId: null }));
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
            tagId: exactMatch?.id || null,
          }));
        } catch (error) {
          if (error.name === "AbortError") {
            return;
          }

          console.error("Error resolviendo tag de busqueda:", error);
          setFilters((prev) => ({ ...prev, ...parsed, tagId: null }));
        }
      };

      applyFilters();
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(delayDebounceFn);
    };
  }, [searchTerm, setFilters]);

  return (
    <header className="topbar">
      <div className="search-container">
        <span className="search-icon"><BsSearch /></span>
        <input
          type="text"
          placeholder="@Username, #Tag, Titulo..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-container">
        <select className="sort-select" onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}>
          <option value="newest">Nuevos</option>
          <option value="popular">Mas visto</option>
          <option value="edited">Editados</option>
        </select>
      </div>
    </header>
  );
};

export default TopBar;
