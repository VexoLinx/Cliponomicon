import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../services/api/http";
import { getCurrentUser } from "../../services/api/auth.api";
import {
  changePassword,
  deleteAvatar,
  updateAvatar,
  updateUser,
} from "../../services/api/users.api";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const useSettingsProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [updateStatus, setUpdateStatus] = useState({ type: "", msg: "" });

  const [avatarStatus, setAvatarStatus] = useState({ type: "", msg: "" });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState({ type: "", msg: "" });

  const { token } = useAuth();

  const loadProfile = useCallback(async (abortController = null) => {
    try {
      const data = await getCurrentUser({
        token,
        signal: abortController?.signal,
      });
      setProfileData(data);
      setDisplayName(data.display_name || "");
      setBio(data.bio || "");
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error al cargar perfil:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab !== "profile") return;
    const controller = new AbortController();
    setLoading(true);
    loadProfile(controller);
    return () => controller.abort();
  }, [activeTab, loadProfile]);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    setUpdateStatus({ type: "loading", msg: "Guardando cambios..." });

    try {
      await updateUser(profileData.id, {
        display_name: displayName,
        bio,
      }, { token });

      await loadProfile();
      setUpdateStatus({ type: "success", msg: "Perfil actualizado correctamente." });
      setTimeout(() => setUpdateStatus({ type: "", msg: "" }), 3000);
    } catch (error) {
      setUpdateStatus({ type: "error", msg: error.message });
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setAvatarStatus({ type: "loading", msg: "Subiendo imagen..." });

    try {
      const avatar = await fileToBase64(file);
      const formData = new FormData();
      formData.append("avatar", avatar);
      await updateAvatar(profileData.id, formData, { token });
      await loadProfile();
      setAvatarStatus({ type: "success", msg: "Avatar actualizado." });
      setTimeout(() => setAvatarStatus({ type: "", msg: "" }), 3000);
    } catch (error) {
      setAvatarStatus({ type: "error", msg: error.message });
    }
  };

  const handleAvatarDelete = async () => {
    if (!window.confirm("Seguro que deseas eliminar tu avatar?")) return;

    setAvatarStatus({ type: "loading", msg: "Eliminando..." });
    try {
      await deleteAvatar(profileData.id, { token });
      await loadProfile();
      setAvatarStatus({ type: "success", msg: "Avatar eliminado." });
      setTimeout(() => setAvatarStatus({ type: "", msg: "" }), 3000);
    } catch (error) {
      setAvatarStatus({ type: "error", msg: error.message });
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordStatus({ type: "loading", msg: "Verificando..." });

    try {
      await changePassword(profileData.id, {
        current_password: currentPassword,
        new_password: newPassword,
      }, { token });

      setPasswordStatus({ type: "success", msg: "Contrasena actualizada con seguridad." });
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setPasswordStatus({ type: "", msg: "" }), 4000);
    } catch (error) {
      setPasswordStatus({ type: "error", msg: error.message });
    }
  };

  return {
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
  };
};
