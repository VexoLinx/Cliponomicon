import { apiRequest } from "./http";
import { mapTag, mapTags } from "../mappers/tag.mapper";

export const listTags = async ({ id, name, signal, mapResponse = true } = {}) => {
  const data = await apiRequest("/tags", {
    signal,
    params: { id, name },
  });
  return mapResponse ? mapTags(data) : data;
};

export const createTag = async (payload, { token, mapResponse = true } = {}) => {
  const data = await apiRequest("/tags", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

  return mapResponse ? mapTag(data) : data;
};

export const getTag = async (tagId, { token, mapResponse = true } = {}) => {
  const data = await apiRequest(`/tags/${tagId}`, { token });
  return mapResponse ? mapTag(data) : data;
};

export const updateTag = async (tagId, payload, { token, mapResponse = true } = {}) => {
  const data = await apiRequest(`/tags/${tagId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });

  return mapResponse ? mapTag(data) : data;
};

export const deleteTag = (tagId, { token } = {}) =>
  apiRequest(`/tags/${tagId}`, {
    method: "DELETE",
    token,
  });
