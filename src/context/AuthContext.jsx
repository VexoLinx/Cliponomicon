import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userData", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setToken(null);
    setUser(null);
  };

  // VALIDACIÓN DEL JWT AL INICIAR O RECARGAR LA APP
  useEffect(() => {
    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        if (payloadBase64) {
          const decodedPayload = JSON.parse(window.atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")));
          
          const isExpired = decodedPayload.exp * 1000 < Date.now();

          if (isExpired) {
            console.warn("Cliponomicon: El token ha expirado. Limpiando sesión...");
            logout();
          }
        }
      } catch (error) {
        console.error("Error al verificar la expiración del token:", error);
        logout();
      }
    }
  }, [token]);

  // ESCUCHADOR GLOBAL PARA EXPIRACIONES EN TIEMPO REAL
  useEffect(() => {
    const handleForceLogout = () => {
      console.warn("Cliponomicon: Sesión invalidada por el servidor (401).");
      logout();
    };

    window.addEventListener("auth-expired", handleForceLogout);
    
    return () => {
      window.removeEventListener("auth-expired", handleForceLogout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);