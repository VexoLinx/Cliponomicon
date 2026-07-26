export const mapCategory = (category) => {
  if (!category) return null;

  return {
    ...category,
    steamAppId: category.steam_appid ?? null,
    steamGridDbGameId: category.steamgriddb_game_id ?? null,
    thumbnailVerticalUrl: category.thumbnail_vertical_url ?? null,
    thumbnailHorizontalUrl: category.thumbnail_horizontal_url ?? null,
  };
};

export const mapCategories = (categories) =>
  Array.isArray(categories) ? categories.map(mapCategory) : [];
