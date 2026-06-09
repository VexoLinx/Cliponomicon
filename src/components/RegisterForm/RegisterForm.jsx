import React, { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import './RegisterForm.css';

const API_URL = import.meta.env.VITE_API_URL;
const REGISTER_URL = `${API_URL}/auth/register`;

const RegisterForm = () => {
  // Extraemos el token del contexto de autenticación
  const { token } = useAuth(); 

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user'
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Añadimos el token Bearer para autenticar la petición de administrador
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = 'Error al registrar usuario';
        if (data.detail) {
          errorMsg = Array.isArray(data.detail) ? data.detail[0].msg : data.detail;
        }
        throw new Error(errorMsg);
      }

      setStatus({ type: 'success', message: '¡Usuario registrado con éxito!' });
      setFormData({ username: '', password: '', role: 'user' }); 

    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-settings-form">
      <h3>Registrar Nuevo Usuario</h3>
      
      <form onSubmit={handleSubmit} autoComplete="off">
        
        {status.message && (
          <div 
            className={`status-message ${status.type}`} 
            style={{
              padding: '10px',
              marginBottom: '15px',
              borderRadius: '4px',
              textAlign: 'center',
              backgroundColor: status.type === 'error' ? '#ffeeee' : '#e6fffa',
              color: status.type === 'error' ? '#cc0000' : '#2c7a7b',
            }}
          >
            {status.message}
          </div>
        )}

        <div className="input-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Introduce un nombre de usuario"
            required
            autoComplete="off"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </div>

        <div className="input-group">
          <label htmlFor="role">Rol del Usuario</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="role-select"
            required
          >
            <option value="user">Usuario Estándar</option>
            <option value="admin">Administrador</option>
            <option value="super_admin">Super Administrador</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="save-button" 
          disabled={isLoading}
          style={{ marginTop: '10px' }}
        >
          {isLoading ? 'Registrando...' : 'Registrar Usuario'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;