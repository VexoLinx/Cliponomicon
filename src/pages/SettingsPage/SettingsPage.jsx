import RegisterForm from "../../components/auth/RegisterForm/RegisterForm";
import { useAuth } from "../../context/AuthContext";
import DeveloperOptions from "./components/DeveloperOptions";
import ProfileTab from "./components/ProfileTab";
import SettingsSidebar from "./components/SettingsSidebar";
import { useSettingsProfile } from "./useSettingsProfile";
import "./SettingsPage.css";

const SettingsPage = ({ setShowApiTester }) => {
  const {
    activeTab,
    setActiveTab,
    profileData,
    loading,
    displayName,
    setDisplayName,
    bio,
    setBio,
    updateStatus,
    handleUpdateProfile,
    handleAvatarUpload,
    handleAvatarDelete,
    avatarStatus,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    passwordStatus,
    handleChangePassword,
    API_URL,
  } = useSettingsProfile();

  const { token, user } = useAuth();
  
  const canRegisterUsers = token && user && user.role !== "user";

  const canAccessBackoffice = 
    token && 
    user && 
    ["admin", "superadmin", "super_admin"].includes(user.role?.toLowerCase());

  return (
    <div className="settings-container">
      <div className="settings-layout">
        <SettingsSidebar
          activeTab={activeTab}
          canRegisterUsers={canRegisterUsers}
          canAccessBackoffice={canAccessBackoffice}
          setActiveTab={setActiveTab}
        />

        <main className="settings-content">
          {activeTab === "profile" && (
            <ProfileTab
              apiUrl={API_URL}
              avatarStatus={avatarStatus}
              bio={bio}
              currentPassword={currentPassword}
              displayName={displayName}
              handleAvatarDelete={handleAvatarDelete}
              handleAvatarUpload={handleAvatarUpload}
              handleChangePassword={handleChangePassword}
              handleUpdateProfile={handleUpdateProfile}
              loading={loading}
              newPassword={newPassword}
              passwordStatus={passwordStatus}
              profileData={profileData}
              setBio={setBio}
              setCurrentPassword={setCurrentPassword}
              setDisplayName={setDisplayName}
              setNewPassword={setNewPassword}
              updateStatus={updateStatus}
            />
          )}

          {activeTab === "register" && canRegisterUsers && <RegisterForm />}

          {activeTab === "options" && <DeveloperOptions setShowApiTester={setShowApiTester} />}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;