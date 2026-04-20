import Enchiridion from "../../../assets/Enchiridion.webp";
import { GiConsoleController } from "react-icons/gi";
import { CiLogin } from "react-icons/ci";
import { GoVideo } from "react-icons/go";
import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={Enchiridion} alt="Logo" />
        <span className="title">Cliponomicon</span>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className="active">
            <GoVideo />
            <span className="nav-icon">Videos</span>
          </li>
          <li>
            <GiConsoleController />
            <span className="nav-icon">Games</span>
          </li>
        </ul>
      </nav>

      <div className="sidebar-tools">
        {/* Aquí puedes reemplazar con tu slider real */}
        <input type="range" min="0" max="100" className="custom-slider" />
      </div>

      <div className="sidebar-footer">
        <Link to="/login" className="login-link">
          <div className="login-btn">
            <CiLogin />
            Login
          </div>
        </Link>
        
        <div className="version-info">
          <span>Fireshare v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
