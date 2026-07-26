import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { importSteamCategory, searchSteamCategories } from "../../services/api/categories.api";
import { APP_EVENTS, emitAppEvent } from "../../events/appEvents";

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
      const data = await searchSteamCategories(query, { token });
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

      const newCategory = await importSteamCategory(bodyData, {
        token,
      });

      setSearchTerm("");
      setSearchResults([]);
      emitAppEvent(APP_EVENTS.CATEGORIES_UPDATED);

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
