import React, { useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";
import "./MainLayout.css";

function MainLayout() {
  const contentRef = useRef(null);
  useScrollRestoration(contentRef);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <main className="content-area" ref={contentRef}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;