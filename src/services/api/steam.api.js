import { apiRequest } from "./http";
import { mapSteamOwnedGamesResponse } from "../mappers/steam.mapper";

export const getSteamUserGames = async (
  steamIdOrVanity,
  {
    includePlayedFreeGames = true,
    language = "english",
    mapResponse = true,
  } = {},
) => {
  const data = await apiRequest(`/steam/users/${steamIdOrVanity}/games`, {
    params: {
      include_played_free_games: includePlayedFreeGames,
      language,
    },
  });

  return mapResponse ? mapSteamOwnedGamesResponse(data) : data;
};
