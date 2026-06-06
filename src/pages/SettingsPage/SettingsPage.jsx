import React, { useEffect, useState } from "react";
import RegisterForm from "./../../components/RegisterForm/RegisterForm";
import ApiTester from "./../../components/ApiTester";
import { useAuth } from "../../context/AuthContext";
import "./SettingsPage.css";

const API_URL = import.meta.env.VITE_API_URL || "";
const AUTH_ME_URL = `${API_URL}/auth/me`;

const SettingsPage = ({ setShowApiTester }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileJson, setProfileJson] = useState("Cargando perfil...");
  const { token } = useAuth();

  useEffect(() => {
    if (activeTab !== "profile") return;

    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        const response = await fetch(AUTH_ME_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });

        const data = await response.json();
        setProfileJson(JSON.stringify(data, null, 2));
      } catch (error) {
        if (error.name === "AbortError") return;
        setProfileJson(JSON.stringify({ error: error.message }, null, 2));
      }
    };

    loadProfile();

    return () => controller.abort();
  }, [activeTab, token]);

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
              <pre>{profileJson}</pre>
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
