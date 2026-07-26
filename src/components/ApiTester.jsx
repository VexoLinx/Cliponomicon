import React, { useState } from "react";
import { getCurrentUser, loginUser } from "../services/api/auth.api";
import { listUsers } from "../services/api/users.api";

const ApiTester = () => {
  const [status, setStatus] = useState("Esperando prueba...");

  const runTests = async () => {
    try {
      console.log("--- Iniciando pruebas de API ---");

      console.log("Probando Login...");
      const loginRes = await loginUser({
        username: "admin",
        password: "change-me-before-first-start",
      });
      console.log("Login Result:", loginRes);

      const token = loginRes.access_token;

      console.log("Probando GetMe...");
      const me = await getCurrentUser({ token });
      console.log("User Profile:", me);

      console.log("Probando Listar Usuarios...");
      const users = await listUsers({ token });
      console.log("Users List:", users);

      setStatus("Pruebas completadas. Revisa la consola.");
    } catch (error) {
      console.error("Error en las pruebas:", error);
      setStatus(`Error: ${error.message}. Revisa la consola.`);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
      <h2>Probador de API</h2>
      <p>Estado: {status}</p>
      <button onClick={runTests} style={{ padding: "10px", cursor: "pointer" }}>
        Ejecutar Pruebas
      </button>
    </div>
  );
};

export default ApiTester;
