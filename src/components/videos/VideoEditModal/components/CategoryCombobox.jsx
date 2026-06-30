import React, { useState, useEffect, useRef } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { useSteamSearch } from "../../useSteamSearch";

const CategoryCombobox = ({ categoryId, setCategoryId, categories, onRefreshCategories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("Sin Categoría (General)");
  const dropdownRef = useRef(null);

  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
    isSearching,
    isImporting,
    handleSearch,
    handleImportGame,
  } = useSteamSearch((newId, newName) => {
    if (onRefreshCategories) onRefreshCategories();
    setCategoryId(newId);
    setDisplayValue(newName);
    setIsOpen(false);
  });

  useEffect(() => {
    if (!categoryId) {
      setDisplayValue("Sin Categoría (General)");
    } else {
      const currentCat = categories.find((cat) => String(cat.id) === String(categoryId));
      if (currentCat) setDisplayValue(currentCat.name);
    }
  }, [categoryId, categories]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const selectLocalCategory = (cat) => {
    if (!cat) {
      setCategoryId("");
      setDisplayValue("Sin Categoría (General)");
    } else {
      setCategoryId(cat.id);
      setDisplayValue(cat.name);
    }
    setIsOpen(false);
    setSearchTerm("");
    setSearchResults([]);
  };

  const filteredLocalCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <label className="input-label">Categoría o Juego común</label>
      <div className="custom-combobox-container" ref={dropdownRef}>
        <div className="combobox-wrapper-input" onClick={() => setIsOpen(!isOpen)}>
          <input
            type="text"
            className="combobox-input"
            placeholder={isOpen ? "Buscar o importar juego..." : displayValue}
            value={searchTerm}
            onChange={handleInputChange}
            onClick={(e) => e.stopPropagation()}
            onFocus={() => setIsOpen(true)}
          />
          <div className="combobox-actions">
            <MdArrowDropDown className={`combobox-arrow ${isOpen ? "open" : ""}`} />
          </div>
        </div>

        {isOpen && (
          <div className="combobox-dropdown-menu">
            <div className="dropdown-section-title">Tus Categorías</div>
            <div className="dropdown-item" onClick={() => selectLocalCategory(null)}>
              Sin Categoría (General)
            </div>

            {filteredLocalCategories.map((cat) => (
              <div key={cat.id} className="dropdown-item" onClick={() => selectLocalCategory(cat)}>
                {cat.name} {cat.source === "steam" ? "🎮" : ""}
              </div>
            ))}

            {searchTerm.trim().length > 0 && (
              <>
                <div className="dropdown-section-title steam-title">
                  {isSearching ? "Buscando en Steam..." : "Resultados de Steam (Click para importar)"}
                </div>

                {searchResults.map((game) => (
                  <div
                    key={game.id}
                    className="dropdown-item steam-item"
                    onClick={() => !isImporting && handleImportGame(game)}
                  >
                    <span className="game-name">{game.name}</span>
                    <span className="import-badge">
                      {isImporting ? "Añadiendo..." : "Importar"}
                    </span>
                  </div>
                ))}

                {!isSearching && searchResults.length === 0 && (
                  <div className="dropdown-no-results">No se encontraron juegos en Steam</div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryCombobox;