import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

// Contextos globales
import { AuthProvider } from "./context/AuthContext";
import { VideoProvider } from "./context/VideoContext";

// Componentes de infraestructura y layouts
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GlobalVideoModal from "./components/videos/GlobalVideoModal";
import ApiTester from "./components/ApiTester";

// Páginas de la aplicación
import HomePage from "./pages/HomePage";
import GamesPage from "./pages/GamesPage";
import FavoritesPage from "./pages/FavoritesPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";

import "./App.css";

function App() {
  const [showApiTester, setShowApiTester] = useState(false);

  return (
    <AuthProvider>
      {/* Controlado desde la pestaña Opciones en SettingsPage */}
      {showApiTester && <ApiTester />}

      <VideoProvider>
        <Routes>
          {/* Rutas con estructura MainLayout (Sidebar + TopBar) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<GamesPage />} />

            {/* Rutas con restricción de sesión activa */}
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage setShowApiTester={setShowApiTester} />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Rutas limpias independientes */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>

        {/* Reproductor global inyectado dinámicamente */}
        <GlobalVideoModal />
      </VideoProvider>
    </AuthProvider>
  );
}

export default App;
