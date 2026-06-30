import React, { createContext, useContext } from "react";
import { useAuthProviderState } from "./useAuthProviderState";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const authState = useAuthProviderState();

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};
