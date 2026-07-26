import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const SecurityForm = ({
  currentPassword,
  handleChangePassword,
  newPassword,
  passwordStatus,
  setCurrentPassword,
  setNewPassword,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <form onSubmit={handleChangePassword} className="settings-card security-card">
      <h3 className="card-title">Seguridad</h3>

      <div className="form-group">
        <label htmlFor="currentPassword">Contrasena Actual</label>
        <div className="password-wrapper">
          <input
            id="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
            className="input-editable"
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowCurrentPassword((visible) => !visible)}
            tabIndex="-1"
            title={showCurrentPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
          >
            {showCurrentPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </button>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="newPassword">Nueva Contrasena</label>
        <div className="password-wrapper">
          <input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            className="input-editable"
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowNewPassword((visible) => !visible)}
            tabIndex="-1"
            title={showNewPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
          >
            {showNewPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-outline-danger" disabled={passwordStatus.type === "loading"}>
          Actualizar Contrasena
        </button>
        {passwordStatus.msg && (
          <span className={`status-msg ${passwordStatus.type}`}>{passwordStatus.msg}</span>
        )}
      </div>
    </form>
  );
};

export default SecurityForm;
