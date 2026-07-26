export const mapSteamOwnedGame = (game) => {
  if (!game) return null;

  return {
    ...game,
    appId: game.appid,
    playtimeForever: game.playtime_forever ?? null,
    playtime2Weeks: game.playtime_2weeks ?? null,
    imgIconUrl: game.img_icon_url ?? null,
    iconUrl: game.icon_url ?? null,
    headerImageUrl: game.header_image_url ?? null,
    capsuleImageUrl: game.capsule_image_url ?? null,
  };
};

export const mapSteamOwnedGamesResponse = (data) => ({
  ...data,
  steamId: data?.steamid,
  gameCount: data?.game_count ?? 0,
  games: Array.isArray(data?.games) ? data.games.map(mapSteamOwnedGame) : [],
});

export const mapSteamGridDbGame = (game) => {
  if (!game) return null;
  return {
    ...game,
    steamgriddb_game_id: game.id,
  };
};

export const mapSteamGridDbGames = (games) =>
  Array.isArray(games) ? games.map(mapSteamGridDbGame) : [];

export const mapSteamGridDbGrid = (grid) => {
  if (!grid) return null;
  return { ...grid };
};

export const mapSteamGridDbGridList = (data) => ({
  ...data,
  hasMore: Boolean(data?.has_more),
  nextOffset: data?.next_offset ?? null,
  items: Array.isArray(data?.items) ? data.items.map(mapSteamGridDbGrid) : [],
});
