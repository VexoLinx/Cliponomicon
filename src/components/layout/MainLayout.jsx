import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import "./MainLayout.css";
import menosDe7m from '../../assets/menosDe7m.mp4';

function MainLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <main className="content-area">
          {/* El Outlet es donde aparecerá HomePage, GamesPage, etc. */}
          <video autoPlay muted loop id="video-background">
            <source src={menosDe7m} type="video/mp4" />
          </video>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
