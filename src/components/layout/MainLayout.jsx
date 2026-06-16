import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

function MainLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <main className="content-area">
          {/* El Outlet es donde aparecerá HomePage, GamesPage, etc. */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;