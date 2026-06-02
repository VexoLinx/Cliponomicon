import Enchiridion from "../../../assets/logo.png";
import VideoUploader from "../../VideoUploader/VideoUploader";
import { GiConsoleController } from "react-icons/gi";
import { IoMdSettings } from "react-icons/io";
import { GoStarFill } from "react-icons/go";
import { CiLogin, CiLogout } from "react-icons/ci";
import { GoVideo } from "react-icons/go";
import { NavLink, useNavigate } from "react-router-dom";
import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");

    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={Enchiridion} alt="Logo" />
        <span className="title">Cliponomicon</span>
      </div>

      <nav className="sidebar-nav">
        <ul>
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

          {token && (
            <>
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
            </>
          )}
        </ul>
      </nav>

      <div className="sidebar-tools">
        <input type="range" min="0" max="100" className="custom-slider" />

        {token && <VideoUploader />}
      </div>

      <div className="sidebar-footer">
        {token && userData && (
          <div className="login-user">@{userData.username}</div>
        )}

        {!token ? (
          <NavLink to="/login" className="login-link">
            <div className="login-btn">
              <CiLogin />
              Login
            </div>
          </NavLink>
        ) : (
          <button className="login-btn" onClick={handleLogout}>
            <CiLogout />
            Logout
          </button>
        )}

        <div className="version-info">
          <span>Cliponomicon v0.5</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
