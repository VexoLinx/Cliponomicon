const SettingsSidebar = ({ activeTab, setActiveTab, canRegisterUsers }) => (
  <nav className="settings-sidebar">
    <button
      className={activeTab === "profile" ? "active" : ""}
      onClick={() => setActiveTab("profile")}
    >
      Mi Perfil
    </button>
    {canRegisterUsers && (
      <button
        className={activeTab === "register" ? "active" : ""}
        onClick={() => setActiveTab("register")}
      >
        Registrar Usuario
      </button>
    )}
    <button
      className={activeTab === "options" ? "active" : ""}
      onClick={() => setActiveTab("options")}
    >
      Opciones
    </button>
  </nav>
);

export default SettingsSidebar;
