import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "";
const AUTH_ME_URL = `${API_URL}/auth/me`;

export const useSettingsProfile = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [profileJson, setProfileJson] = useState("Cargando perfil...");
    const { token } = useAuth();

    useEffect(() => {
        if (activeTab !== "profile") return;

        const controller = new AbortController();

        const loadProfile = async () => {
            try {
                const response = await fetch(AUTH_ME_URL, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    signal: controller.signal,
                });

                const data = await response.json();
                setProfileJson(JSON.stringify(data, null, 2));
            } catch (error) {
                if (error.name === "AbortError") return;
                setProfileJson(JSON.stringify({ error: error.message }, null, 2));
            }
        };

        loadProfile();

        return () => controller.abort();
    }, [activeTab, token]);

    return {
        activeTab,
        setActiveTab,
        profileJson,
    };
};