import { apiRequest } from "./http";
import { mapCategories, mapCategory } from "../mappers/category.mapper";
import {
  mapSteamGridDbGames,
  mapSteamGridDbGridList,
} from "../mappers/steam.mapper";

export const listCategories = async ({ mapResponse = true } = {}) => {
  const data = await apiRequest("/category");
  return mapResponse ? mapCategories(data) : data;
};

export const createCategory = async (payload, { token, mapResponse = true } = {}) => {
  const data = await apiRequest("/category", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
  return mapResponse ? mapCategory(data) : data;
};

export const searchSteamCategories = async (term, { token, mapResponse = true } = {}) => {
  const data = await apiRequest("/category/steam/search", {
    token,
    params: { term },
  });
  return mapResponse ? mapSteamGridDbGames(data) : data;
};

export const listSteamGameGrids = async (gameId, params = {}, { token, mapResponse = true } = {}) => {
  const data = await apiRequest(`/category/steam/games/${gameId}/grids`, {
    token,
    params,
  });
  return mapResponse ? mapSteamGridDbGridList(data) : data;
};

export const importSteamCategory = async (payload, { token, mapResponse = true } = {}) => {
  const data = await apiRequest("/category/steam/import", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
    fallbackError: "Error al importar de Steam.",
  });
  return mapResponse ? mapCategory(data) : data;
};

export const updateCategory = async (categoryId, payload, { token, mapResponse = true } = {}) => {
  const data = await apiRequest(`/category/${categoryId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
  return mapResponse ? mapCategory(data) : data;
};

export const deleteCategory = (categoryId, { token } = {}) =>
  apiRequest(`/category/${categoryId}`, {
    method: "DELETE",
    token,
  });
