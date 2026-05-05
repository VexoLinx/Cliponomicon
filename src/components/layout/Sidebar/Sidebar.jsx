import Enchiridion from "../../../assets/Enchiridion.webp";
import VideoUploader from "../../VideoUploader/VideoUploader";
import { GiConsoleController } from "react-icons/gi";
import { IoMdSettings } from "react-icons/io";
import { GoStarFill } from "react-icons/go";
import { CiLogin } from "react-icons/ci";
import { GoVideo } from "react-icons/go";
import { NavLink, Link } from "react-router-dom";
import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={Enchiridion} alt="Logo" />
        <span className="title">Cliponomicon</span>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {/* Usamos NavLink para manejar la clase 'active' automáticamente */}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <GoVideo />
              <span className="nav-icon">Videos</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/games"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <GiConsoleController />
              <span className="nav-icon">Games</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <GoStarFill />
              <span className="nav-icon">Favoritos</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <IoMdSettings />
              <span className="nav-icon">Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-tools">
        <input type="range" min="0" max="100" className="custom-slider" />

        <VideoUploader />
      </div>

      <div className="sidebar-footer">
        <div className="login-user">@Usuario</div>
        <NavLink to="/login" className="login-link">
          <div className="login-btn">
            <CiLogin />
            Login
          </div>
        </NavLink>

        <div className="version-info">
          <span>Fireshare v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
