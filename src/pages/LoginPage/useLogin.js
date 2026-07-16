import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;
const LOGIN_URL = `${API_URL}/auth/login`;
const OIDC_AUTHORIZE_URL = `${API_URL}/auth/oidc/authorize`;
const OIDC_CALLBACK_URL = `${API_URL}/auth/oidc/callback`;

export const useLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSSOProcessing, setIsSSOProcessing] = useState(false); 

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const REDIRECT_URI = `${window.location.origin}/login`; 

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (code && state) {
            handleSSOCallback(code, state);
        }
    }, [location.search]);

    const handleSSOCallback = async (code, state) => {
        setIsSSOProcessing(true);
        setError(null);

        try {
            const response = await fetch(OIDC_CALLBACK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ code, state, redirect_uri: REDIRECT_URI }),
            });

            const data = await response.json();

            if (!response.ok) {
                let errorMsg = 'Error en la autenticación SSO';
                if (data.detail) {
                    errorMsg = Array.isArray(data.detail) ? data.detail[0].msg : data.detail;
                }
                throw new Error(errorMsg);
            }

            login(data.access_token, data.user);
            navigate('/'); 

        } catch (err) {
            setError(err.message);
            navigate('/login', { replace: true });
        } finally {
            setIsSSOProcessing(false);
        }
    };

    const handleSSOLogin = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${OIDC_AUTHORIZE_URL}?redirect_uri=${encodeURIComponent(REDIRECT_URI)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                let errorMsg = 'Error al conectar con el proveedor SSO';
                if (data.detail) {
                    errorMsg = Array.isArray(data.detail) ? data.detail[0].msg : data.detail;
                }
                throw new Error(errorMsg);
            }

            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                throw new Error("No se recibió la URL de autorización.");
            }

        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                let errorMsg = 'Error en las credenciales';
                if (data.detail) {
                    errorMsg = Array.isArray(data.detail) ? data.detail[0].msg : data.detail;
                }
                throw new Error(errorMsg);
            }

            login(data.access_token, data.user);
            navigate('/');

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
        isSSOProcessing, // Exponemos el nuevo estado
        handleSubmit,
        handleSSOLogin,  // Exponemos la nueva función
    };
};