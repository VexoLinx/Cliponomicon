export const getVideoSortParams = (sort = "newest") => {
  const sortMap = {
    newest: { sortBy: "created_at", sortDirection: "desc" },
    popular: { sortBy: "popularity_score", sortDirection: "desc" },
    edited: { sortBy: "edited_at", sortDirection: "desc" },
  };

  return sortMap[sort] || sortMap.newest;
};
