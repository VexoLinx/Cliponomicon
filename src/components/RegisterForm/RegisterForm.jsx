import React, { useState } from 'react';
import './RegisterForm.css';

const RegisterForm = () => {
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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
      setFormData({ username: '', password: '', role: 'user' }); // Limpiar formulario

    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-settings-form">
      <h3>Registrar Nuevo Usuario</h3>
      <form onSubmit={handleSubmit}>
        {status.message && (
          <div className={`status-message ${status.type}`} style={{
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '4px',
            backgroundColor: status.type === 'error' ? '#ffeeee' : '#e6fffa',
            color: status.type === 'error' ? '#cc0000' : '#2c7a7b',
            textAlign: 'center'
          }}>
            {status.message}
          </div>
        )}

        <div className="input-group">
          <label>Nombre de Usuario</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
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