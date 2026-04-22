import { Route, Routes } from "react-router-dom";
import { useState, React } from "react";
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Login/Login";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes> 
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
