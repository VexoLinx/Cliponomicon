const AccountDataCard = ({ profileData }) => (
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
);

export default AccountDataCard;
