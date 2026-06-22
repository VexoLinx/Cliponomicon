import React, { useState, useEffect } from "react";
import GameCard from "./GameCard/GameCard";
import "./GamesPage.css";

const GamesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/video-categories`);
        
        if (!response.ok) {
          throw new Error("Error al cargar las categorías");
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("No se pudieron cargar los juegos. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="page-container">
      <h2 style={{ color: 'white', marginBottom: '20px', marginLeft: '20px' }}>
        Explorar Juegos
      </h2>

      {loading && <p className="grid-status-text">Cargando categorías...</p>}
      
      {error && <p className="grid-status-text">{error}</p>}

      {!loading && !error && categories.length === 0 && (
        <p className="grid-status-text">Aún no hay categorías registradas.</p>
      )}

      {!loading && categories.length > 0 && (
        <div className="games-grid">
          {categories.map((category) => (
            <GameCard 
              key={category.id} 
              game={{
                id: category.id,
                name: category.name,
                image: category.thumbnail_horizontal_url || "https://placehold.co/460x215/222/white?text=Sin+Imagen"
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GamesPage;