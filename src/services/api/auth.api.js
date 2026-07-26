import { apiRequest, buildApiUrl } from "./http";
import { mapLoginResponse, mapUser } from "../mappers/user.mapper";

export const loginUser = async (payload, { mapResponse = true } = {}) => {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    fallbackError: "Error en las credenciales",
  });

  return mapResponse ? mapLoginResponse(data) : data;
};

export const registerUser = async (payload, { token, mapResponse = true } = {}) => {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
    fallbackError: "Error al registrar usuario",
  });

  return mapResponse ? mapUser(data) : data;
};

export const getCurrentUser = async ({ token, signal, mapResponse = true } = {}) => {
  const data = await apiRequest("/auth/me", { token, signal });
  return mapResponse ? mapUser(data) : data;
};

export const getOidcAuthorization = (returnTo) =>
  apiRequest("/auth/oidc/authorize", {
    params: { return_to: returnTo },
  });

export const getOidcCallbackRedirectUrl = ({ code, state }) =>
  buildApiUrl("/auth/oidc/callback", { code, state });

export const completeOidcCallback = async ({ code, state }, { mapResponse = true } = {}) => {
  const data = await apiRequest("/auth/oidc/callback", {
    method: "POST",
    body: JSON.stringify({ code, state }),
  });
  return mapResponse ? mapLoginResponse(data) : data;
};
