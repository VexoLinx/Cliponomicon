import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "";
const AUTH_ME_URL = `${API_URL}/auth/me`;

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

    const loadProfile = async (abortController = null) => {
        try {
            const response = await fetch(AUTH_ME_URL, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                signal: abortController?.signal,
            });

            if (response.ok) {
                const data = await response.json();
                setProfileData(data);
                setDisplayName(data.display_name || "");
                setBio(data.bio || "");
            }
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Error al cargar perfil:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab !== "profile") return;
        const controller = new AbortController();
        setLoading(true);
        loadProfile(controller);
        return () => controller.abort();
    }, [activeTab, token]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdateStatus({ type: "loading", msg: "Guardando cambios..." });
        
        try {
            const response = await fetch(`${API_URL}/users/${profileData.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    display_name: displayName,
                    bio: bio
                })
            });

            if (!response.ok) throw new Error("No se pudieron guardar los cambios.");
            
            await loadProfile();
            setUpdateStatus({ type: "success", msg: "Perfil actualizado correctamente." });
            setTimeout(() => setUpdateStatus({ type: "", msg: "" }), 3000);
        } catch (error) {
            setUpdateStatus({ type: "error", msg: error.message });
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAvatarStatus({ type: "loading", msg: "Subiendo imagen..." });
        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const response = await fetch(`${API_URL}/users/${profileData.id}/avatar`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) throw new Error("Error al subir el avatar.");
            
            await loadProfile();
            setAvatarStatus({ type: "success", msg: "Avatar actualizado." });
            setTimeout(() => setAvatarStatus({ type: "", msg: "" }), 3000);
        } catch (error) {
            setAvatarStatus({ type: "error", msg: error.message });
        }
    };

    const handleAvatarDelete = async () => {
        if (!window.confirm("¿Seguro que deseas eliminar tu avatar?")) return;
        
        setAvatarStatus({ type: "loading", msg: "Eliminando..." });
        try {
            const response = await fetch(`${API_URL}/users/${profileData.id}/avatar`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Error al eliminar el avatar.");
            
            await loadProfile();
            setAvatarStatus({ type: "success", msg: "Avatar eliminado." });
            setTimeout(() => setAvatarStatus({ type: "", msg: "" }), 3000);
        } catch (error) {
            setAvatarStatus({ type: "error", msg: error.message });
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordStatus({ type: "loading", msg: "Verificando..." });
        
        try {
            const response = await fetch(`${API_URL}/users/${profileData.id}/password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail?.[0]?.msg || "Error al cambiar contraseña.");
            }

            setPasswordStatus({ type: "success", msg: "Contraseña actualizada con seguridad." });
            setCurrentPassword("");
            setNewPassword("");
            setTimeout(() => setPasswordStatus({ type: "", msg: "" }), 4000);
        } catch (error) {
            setPasswordStatus({ type: "error", msg: error.message });
        }
    };

    return {
        activeTab, setActiveTab, profileData, loading,
        displayName, setDisplayName, bio, setBio,
        updateStatus, handleUpdateProfile,
        handleAvatarUpload, handleAvatarDelete, avatarStatus,
        currentPassword, setCurrentPassword, newPassword, setNewPassword,
        passwordStatus, handleChangePassword, API_URL
    };
};