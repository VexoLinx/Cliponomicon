import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  completeOidcCallback,
  getOidcAuthorization,
  loginUser,
} from "../../services/api/auth.api";

export const useLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSSOProcessing, setIsSSOProcessing] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSSOCallback = useCallback(async (code, state) => {
    setIsSSOProcessing(true);
    setError(null);

    try {
      const data = await completeOidcCallback({ code, state });
      login(data.access_token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
      navigate("/login", { replace: true });
    } finally {
      setIsSSOProcessing(false);
    }
  }, [login, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (code && state) {
      handleSSOCallback(code, state);
    }
  }, [location.search, handleSSOCallback]);

  const handleSSOLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getOidcAuthorization(window.location.origin);

      if (data.authorization_url) {
        const urlMatch = data.authorization_url.match(/(https?:\/\/[^\s"']+)/);

        if (urlMatch && urlMatch[0]) {
          window.location.href = urlMatch[0];
        } else {
          throw new Error("La URL de autorizacion recibida no tiene un formato valido.");
        }
      } else {
        throw new Error("El JSON no contenia la authorization_url");
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await loginUser({ username, password });
      login(data.access_token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    isLoading,
    isSSOProcessing,
    handleSubmit,
    handleSSOLogin,
  };
};
