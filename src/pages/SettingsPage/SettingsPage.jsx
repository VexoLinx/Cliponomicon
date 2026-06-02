import React, { useState } from "react";
import RegisterForm from "./../../components/RegisterForm/RegisterForm";
import ApiTester from "./../../components/ApiTester";
import "./SettingsPage.css";

const SettingsPage = ({ setShowApiTester }) => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="settings-container">
      <div className="settings-layout">
        {/* Submenú lateral */}
        <nav className="settings-sidebar">
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Mi Perfil
          </button>
          <button
            className={activeTab === "register" ? "active" : ""}
            onClick={() => setActiveTab("register")}
          >
            Registrar Usuario
          </button>
          <button
            className={activeTab === "options" ? "active" : ""}
            onClick={() => setActiveTab("options")}
          >
            Opciones
          </button>
        </nav>

        {/* Contenido dinámico */}
        <main className="settings-content">
          {activeTab === "profile" && (
            <section>
              <h2>Mi Perfil</h2>
              <p>Aquí iría la información del usuario actual.</p>
            </section>
          )}

          {activeTab === "register" && (
            <section>
              <RegisterForm />
            </section>
          )}

          {activeTab === "options" && (
            <section>
              <h2 className="title-options">Opciones</h2>
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  onChange={(e) => setShowApiTester(e.target.checked)}
                />
                <span className="checkmark"></span>
                <h3>Mostrar Probador de API</h3>
              </label>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
