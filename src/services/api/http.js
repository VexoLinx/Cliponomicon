import { APP_EVENTS, emitAppEvent } from "../../events/appEvents";

export const API_URL = import.meta.env.VITE_API_URL || "";

export const getStoredToken = () => localStorage.getItem("token") || null;
export const getStoredRefreshToken = () => localStorage.getItem("refreshToken") || null;

export const setStoredTokens = (token, refreshToken) => {
  if (token) localStorage.setItem("token", token);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

export const getAuthHeaders = (token = getStoredToken()) =>
  token ? { Authorization: `Bearer ${token}` } : {};

export const buildApiUrl = (path, params = {}) => {
  const normalizedBase = API_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${normalizedBase}${normalizedPath}`, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") {
          url.searchParams.append(key, item);
        }
      });
      return;
    }
    url.searchParams.append(key, value);
  });

  if (/^https?:\/\//i.test(API_URL)) return url.toString();
  return `${url.pathname}${url.search}`;
};

export const resolveApiUrl = (resourceUrl) => {
  if (!resourceUrl) return "";
  if (/^https?:\/\//i.test(resourceUrl)) return resourceUrl;

  const normalizedBase = API_URL.replace(/\/$/, "");
  const normalizedResource = resourceUrl.startsWith("/") ? resourceUrl : `/${resourceUrl}`;
  if (normalizedBase && normalizedResource.startsWith(`${normalizedBase}/`)) {
    return normalizedResource;
  }

  const url = new URL(`${normalizedBase}${normalizedResource}`, window.location.origin);

  if (/^https?:\/\//i.test(API_URL)) return url.toString();
  return `${url.pathname}${url.search}`;
};

export const parseApiError = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => null);
  const detail = data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg || item.message || String(item)).join(", ");
  }
  if (typeof detail === "string") return detail;
  return fallbackMessage || `Error HTTP ${response.status}`;
};

let refreshPromise = null;

const refreshTokens = () => {
  if (refreshPromise) return refreshPromise;

  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    return Promise.reject(new Error("No hay refresh token disponible"));
  }

  refreshPromise = fetch(buildApiUrl("/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
    .then(async (response) => {
      if (!response.ok) throw new Error(await parseApiError(response, "Refresh fallido"));
      const data = await response.json();
      setStoredTokens(data.access_token, data.refresh_token);
      emitAppEvent(APP_EVENTS.TOKEN_REFRESHED);
      return data.access_token;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

export const apiRequest = async (path, options = {}) => {
  const {
    token = getStoredToken(),
    params,
    headers,
    body,
    fallbackError,
    _isRetry = false,
    ...fetchOptions
  } = options;

  const isFormData = body instanceof FormData;
  const response = await fetch(buildApiUrl(path, params), {
    ...fetchOptions,
    body,
    headers: {
      Accept: "application/json",
      ...getAuthHeaders(token),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
  });

  const isAuthEndpoint = path === "/auth/refresh" || path === "/auth/login";

  if (response.status === 401 && !_isRetry && !isAuthEndpoint) {
    try {
      const newToken = await refreshTokens();
      return apiRequest(path, { ...options, token: newToken, _isRetry: true });
    } catch (refreshError) {
      emitAppEvent(APP_EVENTS.AUTH_EXPIRED);
      throw new Error("Sesión expirada");
    }
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response, fallbackError));
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return response;

  return response.json();
};