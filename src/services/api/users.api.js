import { apiRequest, buildApiUrl } from "./http";
import { mapUser, mapUsers } from "../mappers/user.mapper";

export const listUsers = async ({ token, mapResponse = true } = {}) => {
  const data = await apiRequest("/users", { token });
  return mapResponse ? mapUsers(data) : data;
};

export const getUser = async (userId, { token, mapResponse = true } = {}) => {
  const data = await apiRequest(`/users/${userId}`, { token });
  return mapResponse ? mapUser(data) : data;
};

export const updateUser = async (userId, payload, { token, mapResponse = true } = {}) => {
  const data = await apiRequest(`/users/${userId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
  return mapResponse ? mapUser(data) : data;
};

export const deleteUser = (userId, { token } = {}) =>
  apiRequest(`/users/${userId}`, {
    method: "DELETE",
    token,
  });

export const updateAvatar = async (userId, body, { token, mapResponse = true } = {}) => {
  const data = await apiRequest(`/users/${userId}/avatar`, {
    method: "PUT",
    token,
    body,
  });
  return mapResponse ? mapUser(data) : data;
};

export const deleteAvatar = async (userId, { token, mapResponse = true } = {}) => {
  const data = await apiRequest(`/users/${userId}/avatar`, {
    method: "DELETE",
    token,
  });
  return mapResponse ? mapUser(data) : data;
};

export const getAvatarUrl = (userId) => buildApiUrl(`/users/${userId}/avatar`);

export const getAvatarResponse = (userId, { token } = {}) =>
  apiRequest(`/users/${userId}/avatar`, { token });

export const changePassword = (userId, payload, { token } = {}) =>
  apiRequest(`/users/${userId}/password`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
