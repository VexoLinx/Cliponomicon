import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    text: "",
    owner: null,
    ownerId: null,
    categoryIds: [],
    tagIds: [],
    tag: null,
    tagId: null,
    createdDate: "",
    createdFrom: "",
    createdTo: "",
    edited: "",
    scope: "videos",
    sort: "newest",
  });

  return (
    <SearchContext.Provider value={{ filters, setFilters }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
