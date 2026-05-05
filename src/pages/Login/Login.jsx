import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Enchiridion from "./../../assets/Enchiridion.webp";
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = 'Error en las credenciales';
        
        if (data.detail) {
          errorMsg = Array.isArray(data.detail) 
            ? data.detail[0].msg  // Si es error de validación (422)
            : data.detail;        // Si es un error simple (401/404/etc)
        }
        
        throw new Error(errorMsg);
      }

      // Login exitoso: El esquema dice { access_token, token_type, user }
      console.log('Login exitoso:', data);
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      navigate('/'); 

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <div className="logo-wrapper">
          <img src={Enchiridion} alt="Logo" />
        </div>

        <h2>Iniciar Sesión</h2>

        {/* Mostrar error si falla el login */}
        {error && (
          <div className="error-message" style={{
            backgroundColor: '#ffeeee',
            color: '#cc0000',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
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

        <button 
          type="submit" 
          className="login-button" 
          disabled={isLoading}
        >
          {isLoading ? 'Verificando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Login;