import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/api/http";

export const useSteamSearch = (onImportSuccess) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { token } = useAuth();

  const handleSearch = async (term) => {
    const query = term !== undefined ? term : searchTerm;
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const data = await apiRequest("/category/steam/search", {
        token,
        params: { term: query },
      });
      setSearchResults(data);
    } catch (err) {
      console.error("Error buscando en Steam:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImportGame = async (game) => {
    setIsImporting(true);

    try {
      const bodyData = {
        steam_appid: game.steam_appid || null,
        steamgriddb_game_id: game.id || game.steamgriddb_game_id,
        thumbnail_vertical_url: game.thumbnail_vertical_url || null,
        thumbnail_horizontal_url: game.thumbnail_horizontal_url || null,
      };

      const newCategory = await apiRequest("/category/steam/import", {
        method: "POST",
        token,
        body: JSON.stringify(bodyData),
        fallbackError: "Error al importar de Steam.",
      });

      setSearchTerm("");
      setSearchResults([]);
      window.dispatchEvent(new Event("categories_updated"));

      if (onImportSuccess) {
        onImportSuccess(newCategory.id, newCategory.name);
      }

      return newCategory;
    } catch (err) {
      console.error("Error al importar/crear categoria:", err);
      return null;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
    isSearching,
    isImporting,
    handleSearch,
    handleImportGame,
  };
};
