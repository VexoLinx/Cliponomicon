import GlobalVideoModal from "./components/GlobalVideoModal/GlobalVideoModal";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import { VideoProvider } from "./context/VideoContext";
import MainLayout from "./components/layout/MainLayout";
import GamesPage from "./pages/GamesPage/GamesPage";
import { AuthProvider } from "./context/AuthContext";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import ApiTester from "./components/ApiTester";
import Login from "./pages/Login/Login";
import { useState, React } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [showApiTester, setShowApiTester] = useState(false);

  return (
    <AuthProvider>
      {/*La función de mostrar el probador de API se ha movido a la pestaña de Opciones en la página de Settings*/}
      {showApiTester && <ApiTester />}
      <VideoProvider>
        <Routes>
          {/*Rutas con Sidebar y TopBar*/}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<GamesPage />} />

            {/* Rutas protegidas */}
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

          {/*Rutas sin Sidebar ni TopBar*/}
          <Route path="/login" element={<Login />} />
        </Routes>

        <GlobalVideoModal />
      </VideoProvider>
    </AuthProvider>
  );
}

export default App;
