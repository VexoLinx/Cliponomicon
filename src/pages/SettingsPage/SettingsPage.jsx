import React, { useRef, useState } from "react";
import RegisterForm from "../../components/auth/RegisterForm/RegisterForm";
import ApiTester from "../../components/ApiTester";
import { useSettingsProfile } from "./useSettingsProfile";
import { useAuth } from "../../context/AuthContext";
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import "./SettingsPage.css";

const SettingsPage = ({ setShowApiTester }) => {
  const { 
    activeTab, setActiveTab, profileData, loading,
    displayName, setDisplayName, bio, setBio,
    updateStatus, handleUpdateProfile,
    handleAvatarUpload, handleAvatarDelete, avatarStatus,
    currentPassword, setCurrentPassword, newPassword, setNewPassword,
    passwordStatus, handleChangePassword, API_URL
  } = useSettingsProfile();
  
  const { token, user } = useAuth();
  const canRegisterUsers = token && user && user.role !== "user";
  const fileInputRef = useRef(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const avatarUrl = profileData?.has_avatar 
    ? `${API_URL}/users/${profileData.id}/avatar?t=${new Date().getTime()}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData?.display_name || profileData?.username || "U")}&background=8f44fd&color=fff&size=150`;

  return (
    <div className="settings-container">
      <div className="settings-layout">
        <nav className="settings-sidebar">
          <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
            Mi Perfil
          </button>
          {canRegisterUsers && (
            <button className={activeTab === "register" ? "active" : ""} onClick={() => setActiveTab("register")}>
              Registrar Usuario
            </button>
          )}
          <button className={activeTab === "options" ? "active" : ""} onClick={() => setActiveTab("options")}>
            Opciones
          </button>
        </nav>

        <main className="settings-content">
          {activeTab === "profile" && (
            <section className="profile-section fade-in">
              <header className="section-header">
                <h2>Configuración de Perfil</h2>
                <p className="subtitle">Administra tu identidad e información personal en Cliponomicon.</p>
              </header>
              
              {loading ? (
                <div className="ux-skeleton-loader">Cargando tu espacio...</div>
              ) : profileData ? (
                <div className="profile-forms-container">
                  
                  {/* ... (Tarjeta de Avatar - se mantiene igual) ... */}
                  <div className="settings-card avatar-card">
                    <div className="avatar-preview">
                      <img src={avatarUrl} alt="Tu Avatar" />
                    </div>
                    <div className="avatar-actions">
                      <h3>Foto de perfil</h3>
                      <p>Sube una imagen personalizada para destacar tu perfil.</p>
                      <div className="btn-group">
                        <button className="btn-primary" onClick={() => fileInputRef.current.click()}>
                          Cambiar Avatar
                        </button>
                        {profileData.has_avatar && (
                          <button className="btn-text-danger" onClick={handleAvatarDelete}>
                            Eliminar
                          </button>
                        )}
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleAvatarUpload} 
                        accept="image/png, image/jpeg, image/webp" 
                        hidden 
                      />
                      {avatarStatus.msg && <span className={`status-msg ${avatarStatus.type}`}>{avatarStatus.msg}</span>}
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="settings-card">
                    <h3 className="card-title">Información Pública</h3>
                    <div className="form-group">
                      <label htmlFor="displayName">Nombre a mostrar</label>
                      <input 
                        id="displayName"
                        type="text" 
                        value={displayName} 
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="input-editable"
                      />
                      <small>Este nombre aparecerá en tus clips y comentarios.</small>
                    </div>
                    <div className="form-group">
                      <label htmlFor="bio">Biografía</label>
                      <textarea 
                        id="bio"
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Escribe algo sobre ti..."
                        className="input-editable textarea-editable"
                        rows="3"
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-primary" disabled={updateStatus.type === "loading"}>
                        {updateStatus.type === "loading" ? "Guardando..." : "Guardar Cambios"}
                      </button>
                      {updateStatus.msg && <span className={`status-msg ${updateStatus.type}`}>{updateStatus.msg}</span>}
                    </div>
                  </form>

                  <div className="settings-card bg-subtle">
                    <h3 className="card-title">Datos de Cuenta</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Usuario (Login)</label>
                        <input type="text" value={profileData.username} readOnly className="input-readonly" />
                      </div>
                      <div className="form-group">
                        <label>Tipo de Cuenta</label>
                        <input type="text" value={profileData.role.toUpperCase()} readOnly className="input-readonly" />
                      </div>
                    </div>
                  </div>

                  {profileData.auth_provider === "local" && (
                    <form onSubmit={handleChangePassword} className="settings-card security-card">
                      <h3 className="card-title">Seguridad</h3>
                      
                      <div className="form-group">
                        <label htmlFor="currentPassword">Contraseña Actual</label>
                        <div className="password-wrapper">
                          <input 
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"} 
                            autoComplete="current-password"
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="input-editable"
                          />
                          <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            tabIndex="-1"
                            title={showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showCurrentPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="newPassword">Nueva Contraseña</label>
                        <div className="password-wrapper">
                          <input 
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"} 
                            autoComplete="new-password"
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="input-editable"
                          />
                          <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            tabIndex="-1"
                            title={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showNewPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                          </button>
                        </div>
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="btn-outline-danger" disabled={passwordStatus.type === "loading"}>
                          Actualizar Contraseña
                        </button>
                        {passwordStatus.msg && <span className={`status-msg ${passwordStatus.type}`}>{passwordStatus.msg}</span>}
                      </div>
                    </form>
                  )}

                </div>
              ) : (
                <p className="error-text">No se pudo cargar la información del perfil.</p>
              )}
            </section>
          )}

          {activeTab === "register" && canRegisterUsers && (
             <RegisterForm />
          )}

          {activeTab === "options" && (
             <section className="settings-card">
              <h2 className="card-title">Opciones de Desarrollador</h2>
              <label className="custom-checkbox">
                <input type="checkbox" onChange={(e) => setShowApiTester(e.target.checked)} />
                <span className="checkmark"></span>
                <span>Mostrar Probador de API</span>
              </label>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;