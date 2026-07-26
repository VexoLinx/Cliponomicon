import { apiRequest } from "./http";

export const getHealth = () => apiRequest("/health");

export const getVersion = () => apiRequest("/version");
