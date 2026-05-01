import Enchiridion from "../../../assets/Enchiridion.webp";
import VideoUploader from "../../VideoUploader/VideoUploader";
import { GiConsoleController } from "react-icons/gi";
import { VscFileSubmodule } from "react-icons/vsc";
import { IoMdSettings } from "react-icons/io";
import { CiLogin } from "react-icons/ci";
import { GoVideo } from "react-icons/go";
import { Link } from "react-router-dom";
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
          <li className="active">
            <GoVideo />
            <span className="nav-icon">Videos</span>
          </li>
          <li>
            <GiConsoleController />
            <span className="nav-icon">Games</span>
          </li>
          <li>
            <VscFileSubmodule />
            <span className="nav-icon">File Manager</span>
          </li>
          <li>
            <IoMdSettings />
            <span className="nav-icon">Settings</span>
          </li>
        </ul>
      </nav>

      <div className="sidebar-tools">
        {/* Aquí puedes reemplazar con tu slider real */}
        <input type="range" min="0" max="100" className="custom-slider" />

        <VideoUploader />
      </div>

      <div className="sidebar-footer">
        <div className="login-user">
          @Usuario
        </div>
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
