import React from "react";
import "./HomePage.css";
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import TopBar from '../../components/layout/TopBar/TopBar';
import VideoCard from '../../components/VideoCard/VideoCard';

function HomePage() {
  // 1. Simulación de una lista de videos (Array)
  const mockVideos = [
    {
      id: 1,
      thumbnail: "https://placehold.co/300x170",
      gameIcon: "https://placehold.co/40x40",
      title: "ESIGUALDijoElVexosA4FPS- Star...",
      gameName: "Star Citizen",
      date: "Apr 3, 2026",
      duration: "00:18",
      rating: "3",
      userHandle: "@vexo",
      linkText: "enlace",
      progress: 40
    },
    {
      id: 2,
      thumbnail: "https://placehold.co/300x170",
      gameIcon: "https://placehold.co/40x40",
      title: "Cómo derrotar a Malenia sin recibir daño",
      gameName: "Elden Ring",
      date: "Apr 10, 2026",
      duration: "15:20",
      rating: "5",
      userHandle: "@LuigiFun",
      linkText: "enlace",
      progress: 90
    },
    {
      id: 3,
      thumbnail: "https://placehold.co/300x170",
      gameIcon: "https://placehold.co/40x40",
      title: "Clutch 1v5 en Inferno - Increíble",
      gameName: "CS:GO 2",
      date: "Apr 15, 2026",
      duration: "01:05",
      rating: "4",
      userHandle: "@Pinocheteado",
      linkText: "enlace",
      progress: 10
    },
    {
      id: 3,
      thumbnail: "https://placehold.co/300x170",
      gameIcon: "https://placehold.co/40x40",
      title: "Clutch 1v5 en Inferno - Increíble",
      gameName: "CS:GO 2",
      date: "Apr 15, 2026",
      duration: "01:05",
      rating: "4",
      userHandle: "@PeruDeEpoca",
      linkText: "enlace",
      progress: 10
    }
  ];

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <main className="content-area">
          {/* Contenedor de la Grid */}
          <div className="video-grid">
            {mockVideos.map((video) => (
              <VideoCard key={video.id} data={video} />
            ))}

          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePage;