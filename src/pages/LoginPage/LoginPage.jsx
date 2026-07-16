import React from 'react';
import Enchiridion from "../../assets/logo.png";
import { useLogin } from "./useLogin";
import './LoginPage.css';

const LoginPage = () => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    isLoading,
    isSSOProcessing,
    handleSubmit,
    handleSSOLogin,
  } = useLogin();

  if (isSSOProcessing) {
    return (
      <div className="login-container">
        <div className="login-box processing-box">
          <div className="logo-wrapper">
            <img src={Enchiridion} alt="Logo" />
          </div>
          <h2>Autenticando...</h2>
          <div className="spinner-sso">⚙️</div>
          <p>Conectando de forma segura.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <div className="logo-wrapper">
          <img src={Enchiridion} alt="Logo" />
        </div>

        <h2>Iniciar Sesión</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="input-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nombre de usuario"
            required
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          className="login-button" 
          disabled={isLoading}
        >
          {isLoading ? 'Verificando...' : 'Entrar'}
        </button>

        <div className="sso-divider">
          <span>o</span>
        </div>

        <button 
          type="button" 
          className="sso-button" 
          onClick={handleSSOLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Iniciar sesión con SSO (Keycloak)'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;