import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "";

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
            const res = await fetch(
                `${API_URL}/video-categories/steam/search?term=${encodeURIComponent(query)}`,
                {
                    headers: {
                        Accept: "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    }
                }
            );
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data);
            }
        } catch (err) {
            console.error("Error buscando en Steam:", err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleImportGame = async (game) => {
        setIsImporting(true);

        console.log("🎮 Datos del juego seleccionado en la búsqueda:", game);

        try {
            const bodyData = {
                steam_appid: game.steam_appid || game.id || 1,
                steamgriddb_game_id: game.steamgriddb_game_id || game.id || 1
            };

            console.log("Sending to API:", bodyData);

            const res = await fetch(`${API_URL}/video-categories/steam/import`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(bodyData),
            });

            if (!res.ok) {
                const errorDetail = await res.json();
                console.error("Detalle del error devuelto por el servidor:", errorDetail);
                throw new Error(errorDetail.detail?.[0]?.msg || "Error al importar de Steam.");
            }

            const newCategory = await res.json();
            setSearchTerm("");
            setSearchResults([]);

            window.dispatchEvent(new Event("categories_updated"));

            if (onImportSuccess) {
                onImportSuccess(newCategory.id, newCategory.name);
            }
            return newCategory;
        } catch (err) {
            console.error("Error al importar/crear categoría:", err);
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
        handleImportGame
    };
};