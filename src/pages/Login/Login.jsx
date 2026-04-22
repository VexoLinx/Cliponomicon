import React, { useState } from 'react';
import Enchiridion from "./../../assets/Enchiridion.webp";
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login intentado con:', { username, password });
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <div className="logo-wrapper">
        <img src={Enchiridion} alt="Logo" />
        </div>

        <h2>Iniciar Sesión</h2>

        <div className="input-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Introduce tu usuario"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;