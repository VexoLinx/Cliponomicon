export const getVideoSortParams = (sort = "newest") => {
  const sortMap = {
    newest: { sortBy: "source_created_at", sortDirection: "desc" },
    oldest: { sortBy: "source_created_at", sortDirection: "asc" }
  };

  return sortMap[sort] || sortMap.newest;
};