import React, { useState, useEffect } from 'react';
import { BsSearch } from "react-icons/bs";
import { useSearch } from '../../../context/SearchContext';
import './TopBar.css';

const TopBar = () => {
  const { setFilters } = useSearch(); // Obtenemos la función para actualizar filtros
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Parseamos y enviamos al contexto
      const parsed = parseSearchQuery(searchTerm);
      setFilters(prev => ({ ...prev, ...parsed }));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setFilters]);

  const parseSearchQuery = (query) => {
    if (!query) return { text: "", owner: null, tag: null };
    const filters = { text: "", owner: null, tag: null };
    const parts = query.split(" ");
    const textParts = [];

    parts.forEach(part => {
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

  return (
    <header className="topbar">
      <div className="search-container">
        <span className="search-icon"><BsSearch /></span>
        <input 
          type="text" 
          placeholder="@Username, #Tag, Título..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="filter-container">
        <select className="sort-select" onChange={(e) => setFilters(prev => ({...prev, sort: e.target.value}))}>
          <option value="newest">Nuevos</option>
          <option value="popular">Más visto</option>
          <option value="edited">Editados</option>
        </select>
      </div>
    </header>
  );
};

export default TopBar;