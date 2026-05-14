import React, { useState } from 'react';
import RegisterForm from './../../components/RegisterForm/RegisterForm';
import './SettingsPage.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="settings-container">
      <div className="settings-layout">
        {/* Submenú lateral */}
        <nav className="settings-sidebar">
          <button 
            className={activeTab === 'profile' ? 'active' : ''} 
            onClick={() => setActiveTab('profile')}
          >
            Mi Perfil
          </button>
          <button 
            className={activeTab === 'register' ? 'active' : ''} 
            onClick={() => setActiveTab('register')}
          >
            Registrar Usuario
          </button>
        </nav>

        {/* Contenido dinámico */}
        <main className="settings-content">
          {activeTab === 'profile' && (
            <section>
              <h2>Mi Perfil</h2>
              <p>Aquí iría la información del usuario actual.</p>
            </section>
          )}

          {activeTab === 'register' && (
            <section>
              <RegisterForm />
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;