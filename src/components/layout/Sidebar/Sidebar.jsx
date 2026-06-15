import VideoUploader from "../../VideoUploader/VideoUploader";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { GiConsoleController } from "react-icons/gi";
import { IoMdPricetags } from "react-icons/io";
import { CiLogin, CiLogout } from "react-icons/ci";
import Enchiridion from "../../../assets/logo.png";
import { IoMdSettings } from "react-icons/io";
import { GoStarFill } from "react-icons/go";
import { GoVideo } from "react-icons/go";
import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
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
                  to="/tags"
                  className={({ isActive }) =>
                    isActive ? "nav-item active" : "nav-item"
                  }
                >
                  <IoMdPricetags />
                  <span className="nav-icon">Tags</span>
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
        {/* <input type="range" min="0" max="100" className="custom-slider" /> */}

        {token && <VideoUploader />}
      </div>

      <div className="sidebar-footer">
        {token && user && <div className="login-user">@{user.username}</div>}

        {!token ? (
          <NavLink to="/login" className="login-link">
            <div className="login-btn">
              <CiLogin />
              <span className="nav-icon">Login</span>
            </div>
          </NavLink>
        ) : (
          <button className="login-btn" onClick={handleLogout}>
            <CiLogout />
            <span className="nav-icon">Logout</span>
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
