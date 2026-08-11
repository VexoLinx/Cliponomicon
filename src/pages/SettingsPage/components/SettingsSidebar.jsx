import React from "react";
import { FiExternalLink } from "react-icons/fi";

const SettingsSidebar = ({ activeTab, setActiveTab, canRegisterUsers, canAccessBackoffice }) => (
  <nav className="settings-sidebar">
    <button
      className={activeTab === "profile" ? "active" : ""}
      onClick={() => setActiveTab("profile")}
    >
      Mi Perfil
    </button>

    {canRegisterUsers && (
      <button
        className={activeTab === "register" ? "active" : ""}
        onClick={() => setActiveTab("register")}
      >
        Registrar Usuario
      </button>
    )}

    <button
      className={activeTab === "options" ? "active" : ""}
      onClick={() => setActiveTab("options")}
    >
      Opciones
    </button>

    {canAccessBackoffice && (
      <a
        href="/backoffice"
        className="settings-sidebar-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Backoffice</span>
        <FiExternalLink className="external-icon" size={16} />
      </a>
    )}
  </nav>
);

export default SettingsSidebar;