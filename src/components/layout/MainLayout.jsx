import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import TopBar from './TopBar/TopBar';
import React from 'react';

function MainLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <main className="content-area">
          {/* El Outlet es donde aparecerá HomePage o GamesPage */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;