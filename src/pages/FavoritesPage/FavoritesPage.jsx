import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import VideoCard from "../../components/videos/VideoCard/VideoCard";
import "./FavoritesPage.css";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  const fetchFavorites = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/me/video-favorites`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.items || []);
      } else if (response.status === 401) {
        window.dispatchEvent(new Event("auth-expired"));
      }
    } catch (error) {
      console.error("Error cargando favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchFavorites();

    window.addEventListener("favorites-changed", fetchFavorites);
    return () => {
      window.removeEventListener("favorites-changed", fetchFavorites);
    };
  }, [token, user?.id]);

  if (!token) {
    return (
      <div className="fav-message">Inicia sesión para ver tus favoritos.</div>
    );
  }

  if (loading) {
    return <div className="fav-message">Cargando tus clips favoritos...</div>;
  }

  return (
    <div className="favorites-container">
      <h1 className="favorites-title">Mis Videos Favoritos</h1>
      {favorites.length === 0 ? (
        <p className="no-favorites">
          Aún no has guardado ningún video en favoritos.
        </p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((video) => (
            <VideoCard key={video.id || video._id} data={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;