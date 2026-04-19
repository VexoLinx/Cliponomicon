import { useState, React } from "react";
import "./App.css";
import Sidebar from './components/layout/Sidebar/Sidebar';
import TopBar from './components/layout/TopBar/TopBar';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <TopBar />
          {/* Aquí iría el componente de la cuadrícula de videos */}
          <main className="content-area">
            <p>Área principal de contenido...</p>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
