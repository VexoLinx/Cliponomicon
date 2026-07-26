import React, { useState, useEffect } from "react";
import GameCard from "./GameCard/GameCard";
import { listCategories } from "../../services/api/categories.api";
import { useSearch } from "../../context/SearchContext";
import "./GamesPage.css";

const GamesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { filters } = useSearch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await listCategories({
          name: filters.scope === "games" ? filters.text || undefined : undefined,
        });
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("No se pudieron cargar los juegos. Intentalo de nuevo mas tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [filters.scope, filters.text]);

  return (
    <div className="page-container">
      {loading && <p className="grid-status-text">Cargando categorias...</p>}

      {error && <p className="grid-status-text">{error}</p>}

      {!loading && !error && categories.length === 0 && (
        <p className="grid-status-text">Aun no hay categorias registradas.</p>
      )}

      {!loading && categories.length > 0 && (
        <div className="games-grid">
          {categories.map((category) => (
            <GameCard
              key={category.id}
              game={{
                id: category.id,
                name: category.name,
                image: category.thumbnail_horizontal_url || "https://placehold.co/460x215/222/white?text=Sin+Imagen",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GamesPage;
