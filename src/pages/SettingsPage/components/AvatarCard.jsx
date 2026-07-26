import { useRef } from "react";

const AvatarCard = ({
  avatarStatus,
  avatarUrl,
  handleAvatarDelete,
  handleAvatarUpload,
  profileData,
}) => {
  const fileInputRef = useRef(null);

  return (
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
        {avatarStatus.msg && (
          <span className={`status-msg ${avatarStatus.type}`}>{avatarStatus.msg}</span>
        )}
      </div>
    </div>
  );
};

export default AvatarCard;
