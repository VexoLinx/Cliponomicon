import React from 'react';
import { useRegisterForm } from './useRegisterForm';
import './RegisterForm.css';

const RegisterForm = () => {
  const { formData, status, isLoading, handleChange, handleSubmit } = useRegisterForm();

  return (
    <div className="register-settings-form">
      <h3>Registrar Nuevo Usuario</h3>
      
      <form onSubmit={handleSubmit} autoComplete="off">
        
        {status.message && (
          <div className={`status-message ${status.type}`}>
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
        >
          {isLoading ? 'Registrando...' : 'Registrar Usuario'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;