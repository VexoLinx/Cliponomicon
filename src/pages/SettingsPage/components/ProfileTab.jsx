import AccountDataCard from "./AccountDataCard";
import AvatarCard from "./AvatarCard";
import PublicProfileForm from "./PublicProfileForm";
import SecurityForm from "./SecurityForm";

const buildAvatarUrl = (profileData, apiUrl) => {
  if (profileData.has_avatar) {
    return `${apiUrl}/users/${profileData.id}/avatar?t=${new Date().getTime()}`;
  }

  const fallbackName = profileData.display_name || profileData.username || "U";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=8f44fd&color=fff&size=150`;
};

const ProfileTab = ({
  apiUrl,
  avatarStatus,
  bio,
  currentPassword,
  displayName,
  handleAvatarDelete,
  handleAvatarUpload,
  handleChangePassword,
  handleUpdateProfile,
  loading,
  newPassword,
  passwordStatus,
  profileData,
  setBio,
  setCurrentPassword,
  setDisplayName,
  setNewPassword,
  updateStatus,
}) => (
  <section className="profile-section fade-in">
    <header className="section-header">
      <h2>Configuracion de Perfil</h2>
      <p className="subtitle">Administra tu identidad e informacion personal en Cliponomicon.</p>
    </header>

    {loading ? (
      <div className="ux-skeleton-loader">Cargando tu espacio...</div>
    ) : profileData ? (
      <div className="profile-forms-container">
        <AvatarCard
          avatarStatus={avatarStatus}
          avatarUrl={buildAvatarUrl(profileData, apiUrl)}
          handleAvatarDelete={handleAvatarDelete}
          handleAvatarUpload={handleAvatarUpload}
          profileData={profileData}
        />
        <PublicProfileForm
          bio={bio}
          displayName={displayName}
          handleUpdateProfile={handleUpdateProfile}
          setBio={setBio}
          setDisplayName={setDisplayName}
          updateStatus={updateStatus}
        />
        <AccountDataCard profileData={profileData} />
        {profileData.auth_provider === "local" && (
          <SecurityForm
            currentPassword={currentPassword}
            handleChangePassword={handleChangePassword}
            newPassword={newPassword}
            passwordStatus={passwordStatus}
            setCurrentPassword={setCurrentPassword}
            setNewPassword={setNewPassword}
          />
        )}
      </div>
    ) : (
      <p className="error-text">No se pudo cargar la informacion del perfil.</p>
    )}
  </section>
);

export default ProfileTab;
