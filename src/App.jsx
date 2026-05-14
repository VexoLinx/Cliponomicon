import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import MainLayout from "./components/layout/MainLayout";
import { VideoProvider } from "./helpers/VideoContext.jsx";
import GlobalVideoModal from "./components/GlobalVideoModal/GlobalVideoModal";
import GamesPage from "./pages/GamesPage/GamesPage";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Login/Login";
import { useState, React } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <VideoProvider>

        <Routes>
          {/*Rutas con Sidebar y TopBar*/}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/*Rutas sin Sidebar ni TopBar*/}
          <Route path="/login" element={<Login />} />
        </Routes>
        
        <GlobalVideoModal />
      </VideoProvider>
    </>
  );
}

export default App;
